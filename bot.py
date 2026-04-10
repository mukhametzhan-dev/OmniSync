import os
import re
import asyncio
import logging
import json
from typing import Dict, Optional, List
from dotenv import load_dotenv

import aiohttp
from aiogram import Bot, Dispatcher, types
from aiogram.filters import Command
from aiogram import F
from aiogram.fsm.context import FSMContext
from aiogram.fsm.state import State, StatesGroup
from aiogram.fsm.storage.memory import MemoryStorage
from aiogram.types import InlineKeyboardButton, InlineKeyboardMarkup, ReplyKeyboardMarkup, KeyboardButton, ReplyKeyboardRemove

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Bot configuration
API_TOKEN = os.getenv('TELEGRAM_BOT_TOKEN')
BACKEND_URL = os.getenv('BACKEND_URL', 'http://localhost:8001')

if not API_TOKEN:
    logger.error('TELEGRAM_BOT_TOKEN not found in .env file')
    exit(1)

bot = Bot(token=API_TOKEN)
storage = MemoryStorage()
dp = Dispatcher(storage=storage)

# In-memory session storage: {user_id: session_data}
active_sessions: Dict[int, Dict] = {}

# FSM States
class MeetingStates(StatesGroup):
    WaitingForLink = State()
    MeetingInProgress = State()

# Utility functions for HTTP requests
async def post_json(session: aiohttp.ClientSession, url: str, payload: dict, timeout: int = 30) -> dict:
    """Make POST request and return response"""
    try:
        async with session.post(url, json=payload, timeout=aiohttp.ClientTimeout(total=timeout)) as resp:
            text = await resp.text()
            try:
                data = json.loads(text)
            except json.JSONDecodeError:
                data = {'raw_text': text}
            return {'status': resp.status, 'data': data}
    except asyncio.TimeoutError:
        logger.warning(f'Timeout error for POST {url}')
        raise
    except Exception as e:
        logger.warning(f'HTTP POST error to {url}: {e}')
        raise

async def get_json(session: aiohttp.ClientSession, url: str, timeout: int = 10) -> dict:
    """Make GET request and return response"""
    try:
        async with session.get(url, timeout=aiohttp.ClientTimeout(total=timeout)) as resp:
            text = await resp.text()
            try:
                data = json.loads(text)
            except json.JSONDecodeError:
                data = {'raw_text': text}
            return {'status': resp.status, 'data': data}
    except asyncio.TimeoutError:
        logger.warning(f'Timeout error for GET {url}')
        raise
    except Exception as e:
        logger.warning(f'HTTP GET error to {url}: {e}')
        raise

# Bot handlers

@dp.message(Command(commands=['start']))
async def cmd_start(message: types.Message, state: FSMContext):
    """Handle /start command - Main Menu"""
    await state.clear()
    
    # Clean up any existing session
    user_id = message.from_user.id
    if user_id in active_sessions:
        # Cancel polling task if exists
        session_data = active_sessions[user_id]
        if 'poll_task' in session_data and session_data['poll_task']:
            session_data['poll_task'].cancel()
        del active_sessions[user_id]
    
    # Create main menu
    keyboard = InlineKeyboardMarkup(inline_keyboard=[
        [InlineKeyboardButton(text='📞 Начать созвон', callback_data='start_meeting')],
        [InlineKeyboardButton(text='📂 Мои созвоны', callback_data='my_history')]
    ])
    
    await message.answer(
        'Привет! Я твой AI Scrum Master. Готов к работе.',
        reply_markup=keyboard
    )

@dp.callback_query(F.data == 'start_meeting')
async def on_start_meeting(callback: types.CallbackQuery, state: FSMContext):
    """Handle start meeting callback"""
    await callback.message.answer('Отправьте ссылку на Google Meet.')
    await state.set_state(MeetingStates.WaitingForLink)
    await callback.answer()

@dp.message(MeetingStates.WaitingForLink)
async def receive_meet_link(message: types.Message, state: FSMContext):
    """Handle Google Meet link and start agent"""
    link = message.text.strip()
    
    # Validate Google Meet link
    if 'meet.google.com' not in link:
        await message.reply('Неверная ссылка. Пожалуйста, отправьте ссылку вида meet.google.com/...')
        return
    
    # Send loading message
    status_msg = await message.answer('⏳ Запускаю агента...')
    
    # Start agent via backend
    async with aiohttp.ClientSession() as session:
        try:
            payload = {
                'meeting_url': link,
                'participants_info': None
            }
            url = f"{BACKEND_URL}/start_agent"
            resp = await post_json(session, url, payload, timeout=30)
        except Exception as e:
            logger.exception('Failed to start agent')
            await message.answer('❌ Ошибка при обращении к бэкенду. Проверьте, что сервер запущен.')
            await state.clear()
            return
    
    # Check response
    if resp.get('status') != 200:
        await message.answer('❌ Бэкенд вернул ошибку при запуске агента.')
        await state.clear()
        return
    
    # Extract session_id
    data = resp.get('data', {})
    session_id = data.get('session_id') or data.get('id') or data.get('session')
    
    if not session_id:
        await message.answer('❌ Не удалось получить session_id от бэкенда.')
        await state.clear()
        return
    
    # Store session info
    user_id = message.from_user.id
    active_sessions[user_id] = {
        'session_id': session_id,
        'chat_id': message.chat.id,
        'status_message_id': status_msg.message_id,
        'poll_task': None,
        'last_question': None
    }
    
    # Start background status polling
    poll_task = asyncio.create_task(
        poll_agent_status(user_id, session_id, message.chat.id, status_msg.message_id)
    )
    active_sessions[user_id]['poll_task'] = poll_task
    
    await state.set_state(MeetingStates.MeetingInProgress)

async def poll_agent_status(user_id: int, session_id: str, chat_id: int, status_message_id: int):
    """Background task to poll agent status and update user"""
    last_question_sent = None
    keyboard_sent = False
    last_status_text = None
    error_count = 0
    max_errors = 5
    
    async with aiohttp.ClientSession() as session:
        while True:
            try:
                # Get agent status with longer timeout
                url = f"{BACKEND_URL}/agent_status/{session_id}"
                resp = await get_json(session, url, timeout=30)
                
                # Reset error count on successful request
                error_count = 0
                
                if resp.get('status') != 200:
                    logger.warning(f'Agent status polling returned {resp.get("status")}')
                    await asyncio.sleep(5)
                    continue
                
                data = resp.get('data', {})
                status = data.get('status', '').lower()
                
                # Map status to user-friendly messages
                status_text = None
                if status in ['starting', 'launching']:
                    status_text = '🟡 Агент запускает браузер...'
                elif status in ['waiting_admission', 'waiting']:
                    status_text = '🟠 Агент ждет разрешения на вход...'
                elif status in ['joined', 'in_call', 'connected']:
                    status_text = '🟢 Агент успешно присоединился к звонку!'
                elif status in ['error', 'failed']:
                    status_text = '🔴 Ошибка у агента'
                elif status in ['stopped', 'finished']:
                    status_text = '⚪ Агент завершил работу'
                    break
                
                # Skip update if status is unknown/unrecognized
                if not status_text:
                    await asyncio.sleep(5)
                    continue
                
                # Only update status message if text changed
                if status_text != last_status_text:
                    try:
                        await bot.edit_message_text(
                            status_text,
                            chat_id=chat_id,
                            message_id=status_message_id
                        )
                        last_status_text = status_text
                        logger.info(f'Status updated for session {session_id}: {status_text}')
                    except Exception as e:
                        # If edit fails (message too old, etc.), send new message
                        logger.warning(f'Failed to edit status message: {e}')
                        try:
                            await bot.send_message(chat_id, status_text)
                            last_status_text = status_text
                        except Exception:
                            logger.warning('Failed to send new status message')
                
                # Check for agent questions
                current_question = data.get('last_question') or data.get('question')
                if current_question and current_question != last_question_sent:
                    await bot.send_message(
                        chat_id,
                        f'❓ Вопрос от агента: {current_question}'
                    )
                    last_question_sent = current_question
                
                # Show stop button when agent joins
                if status in ['joined', 'in_call', 'connected'] and not keyboard_sent:
                    keyboard = ReplyKeyboardMarkup(
                        keyboard=[[KeyboardButton(text='🛑 Завершить созвон')]],
                        resize_keyboard=True,
                        one_time_keyboard=False
                    )
                    await bot.send_message(
                        chat_id,
                        'Агент в звонке. Вы можете завершить созвон кнопкой ниже.',
                        reply_markup=keyboard
                    )
                    keyboard_sent = True
                
                await asyncio.sleep(5)  # Increased polling interval
                
            except asyncio.CancelledError:
                logger.info('Status polling cancelled')
                break
            except Exception as e:
                error_count += 1
                logger.warning(f'Error in status polling loop (attempt {error_count}/{max_errors}): {e}')
                
                # If too many errors, stop polling to prevent spam
                if error_count >= max_errors:
                    logger.error(f'Too many errors in status polling for session {session_id}. Stopping.')
                    try:
                        await bot.send_message(
                            chat_id,
                            '❌ Потеряно соединение с агентом. Попробуйте перезапустить созвон.'
                        )
                    except Exception:
                        pass
                    break
                
                await asyncio.sleep(10)  # Longer wait on error
    
    # Clean up session when polling ends
    if user_id in active_sessions:
        active_sessions[user_id].pop('poll_task', None)

@dp.message(F.text == '🛑 Завершить созвон')
@dp.message(Command(commands=['stop']))
async def stop_meeting(message: types.Message, state: FSMContext):
    """Handle stop meeting command"""
    user_id = message.from_user.id
    
    # Check if user has active session
    if user_id not in active_sessions:
        await message.reply('У вас нет активного созвона.', reply_markup=ReplyKeyboardRemove())
        await state.clear()
        return
    
    session_data = active_sessions[user_id]
    session_id = session_data.get('session_id')
    
    # Cancel polling task
    if session_data.get('poll_task'):
        session_data['poll_task'].cancel()
    
    # Send processing message
    await message.answer('Генерирую саммари встречи... 🧠', reply_markup=ReplyKeyboardRemove())
    
    # Stop agent and get summary
    async with aiohttp.ClientSession() as session:
        try:
            url = f"{BACKEND_URL}/stop_agent/{session_id}"
            resp = await post_json(session, url, {}, timeout=180)  # Long timeout for summary generation
        except Exception:
            logger.exception('Failed to stop agent')
            await message.answer('❌ Ошибка при обращении к бэкенду при остановке агента.')
            # Clean up session
            del active_sessions[user_id]
            await state.clear()
            return
    
    # Process response
    if resp.get('status') != 200:
        await message.answer('❌ Бэкенд вернул ошибку при остановке агента.')
        del active_sessions[user_id]
        await state.clear()
        return
    
    data = resp.get('data', {})
    
    # Extract summary text
    summary_text = (
        data.get('summary') or 
        data.get('summary_text') or 
        data.get('final_summary') or 
        data.get('text') or 
        ''
    )
    
    # Extract action items/tasks
    action_items = data.get('action_items') or data.get('tasks') or []
    
    # Fallback: parse tasks from summary text if not provided separately
    if not action_items and summary_text:
        # Look for bullet points in the summary
        lines = summary_text.split('\n')
        for line in lines:
            line = line.strip()
            if line.startswith('• ') or line.startswith('- '):
                task_text = line[2:].strip() if line.startswith('• ') else line[2:].strip()
                if task_text:
                    action_items.append(task_text)
    
    # Store summary and tasks for Jira callback
    session_data['last_summary'] = summary_text
    session_data['last_tasks'] = action_items
    
    # Send summary with Jira buttons
    if summary_text:
        keyboard = InlineKeyboardMarkup(inline_keyboard=[
            [
                InlineKeyboardButton(text='🚀 Создать задачи в Jira', callback_data=f'create_jira:{user_id}'),
                InlineKeyboardButton(text='❌ Отмена', callback_data=f'cancel:{user_id}')
            ]
        ])
        await message.answer(summary_text, reply_markup=keyboard)
    else:
        await message.answer('❌ Сводка не получена от бэкенда.')
    
    await state.clear()
