# OmniSync AI 🤖

**Intelligent Meeting Assistant & AI Scrum Master**
---

## 🎯 Project Overview

OmniSync is an AI-powered meeting intelligence platform that transforms your video calls into actionable insights. Using advanced speech recognition and AI analysis, it automatically:

- **Records & Transcribes** meetings from Google Meet, Zoom, or Microsoft Teams
- **Generates Summaries** of key discussion points
- **Creates Tasks** and assigns them to team members
- **Extracts Key Takeaways** and decisions
- **Distributes Results** to all participants via Telegram Mini App

Perfect for teams who want to reduce meeting note-taking and focus on actual discussions!

---

## ✨ Key Features

### 🎤 **Smart Recording**
- Automatic transcription from video calls
- Multi-language support (English, Russian, and more)
- Real-time subtitle generation

### 🧠 **AI Analysis**
- Intelligent summary generation
- Automatic task extraction with assignees
- Key decision identification
- Meeting insights and metrics

### 📱 **Telegram Integration**
- Mini App interface for easy access
- Task distribution to participants
- Summary sharing directly in Telegram
- Real-time notifications

### 📊 **Dashboard & Library**
- Meeting history and library
- Task management with progress tracking
- Transcript search functionality
- Analytics and insights

### 🎨 **Beautiful UI**
- Mobile-first responsive design
- Dark/Light mode support
- Intuitive tab-based navigation
- Smooth animations and transitions

---

## 👥 Team & Roles

| Name | Role | Responsibilities |
|------|------|------------------|
| **Almas Temirlan** | Front-end Developer / UX/UI | UI/UX design, React components, responsive layouts, user experience |
| **Kunashuly Mukhametzhan** | Back-end Developer / DevOps / Team Lead | Backend API, database design, DevOps, infrastructure, team coordination |
| **Nessipbay Kamila** | QA Engineer / Telegram Bot | Quality assurance, testing, Telegram bot development & integration |
| **Kudageldina Amina** | Prompt Engineer / AI Integration | AI model prompts, LLM integration, summary & task generation, AI optimization |

---

## 🚀 Live Demo

**Production URL:** [omnysync-aisdu.netlify.app](https://omnysync-aisdu.netlify.app)

Try the working demo:
1. Click **"Process Meet"** button on dashboard
2. Paste a Google Meet link: `https://meet.google.com/abc-defg-hij`
3. Watch the 10-second listening timer with "🤖 Bot is live. Listening..."
4. See AI-generated summary, tasks, and transcript appear

**Example Output:**
```
🚀 Создано новых задач: 3
• Backend: Обновить схему БД — 13:00 (Mukhametzhan)
• Backend: Новый JSON формат — 13:00 (Тимур)
• Frontend: UI Интеграция — 13:30 (Лена)

━━━━━━━━━━━━━━━━━━━━

🤖 AI Scrum Master - Сводка Совещания
📅 Сессия: c2ff764c
⏱ Длительность: ~5 минут
👥 Участники: Mukhametzhan, Тимур, Лена
```

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **shadcn/ui** - Component library
- **React Router** - Navigation
- **React Query** - Data fetching
- **Lucide Icons** - Icons
- **Netlify** - Deployment

### Backend
- **FastAPI** - Server framework
- **PostgreSQL** - Database
- **Openrouter API** - AI/LLM integration
- **Telegram Bot API** - Bot integration
- **Google Meet API** - Meeting integration

### Infrastructure & DevOps
- **Docker** - Containerization
- **GitHub Actions** - CI/CD
- **Environment-based config** - Secret management
- **Selenium** - Web automation for Google Meet

### AI/ML
- **OpenAI/Gemini** - Summary generation
- **Whisper API** - Speech-to-text
- **Custom prompts** - Task extraction & analysis

---

## 📦 Project Structure

```
omnisync/
├── src/
│   ├── pages/
│   │   ├── Index.tsx              # Main router & state management
│   │   ├── DashboardPage.tsx      # Home dashboard
│   │   ├── ProcessMeetingPage.tsx # Meeting processing (listening → results)
│   │   ├── MeetingDetailPage.tsx  # Meeting details & transcript
│   │   ├── LibraryPage.tsx        # Meetings library & history
│   │   ├── TasksPage.tsx          # Tasks management & tracking
│   │   ├── SchedulePage.tsx       # Meeting schedule
│   │   └── SettingsPage.tsx       # User settings
│   ├── components/
│   │   ├── layout/                # Layout components (Header, Sidebar, Nav)
│   │   ├── ui/                    # shadcn/ui components
│   │   └── PlatformBadge.tsx      # Platform indicators
│   ├── hooks/
│   │   ├── useTelegram.ts         # Telegram context
│   │   └── use-*.ts               # Custom hooks
│   ├── data/
│   │   └── mockData.ts            # Mock data (meetings, tasks, transcripts)
│   ├── lib/
│   │   └── utils.ts               # Utility functions
│   └── types/
│       └── telegram.d.ts          # TypeScript definitions
├── package.json
├── vite.config.ts                 # Vite configuration
├── tailwind.config.js             # Tailwind CSS config
├── tsconfig.json                  # TypeScript config
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/omnisync.git
cd omnisync
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Setup**
Create a `.env.local` file:
```env
VITE_API_URL=http://localhost:3000
VITE_TELEGRAM_BOT_TOKEN=your_telegram_bot_token
VITE_OPENAI_API_KEY=your_openai_api_key
```

4. **Start Development Server**
```bash
npm run dev
```

Access at: **http://localhost:8080**

### Build for Production
```bash
npm run build
npm run preview
```

---

## 🎮 How to Use

### For End Users

1. **Open Telegram Mini App**
   - Find @OmniSyncBot in Telegram
   - Click to open Mini App

2. **Process a Meeting**
   - Click "Process Meet" in quick actions
   - Paste your Google Meet/Zoom/Teams link
   - Wait ~12 seconds for processing

3. **View Results**
   - See AI-generated summary with participants
   - Review auto-generated tasks with assignees
   - Check full meeting transcript

4. **Manage Tasks**
   - Click tasks to mark complete/incomplete
   - Track progress by assignee
   - Share with team members

5. **Share & Collaborate**
   - Share summaries via Telegram
   - Distribute tasks to participants
   - Get notifications for updates

### For Developers

#### Run Development Server
```bash
npm run dev
```

#### Run Tests
```bash
npm run test
npm run test:watch
```

#### Linting
```bash
npm run lint
```

#### Type Checking
```bash
npx tsc --noEmit
```

#### Build
```bash
npm run build
npm run preview
```

---

## 📊 User Flow Diagram

```
┌──────────────┐
│  Dashboard   │
└──────┬───────┘
       │ Click "Process Meet"
       ▼
┌──────────────────────┐
│   Input Meeting Link │
│  (Paste Google Meet) │
└──────┬───────────────┘
       │ Submit
       ▼
┌──────────────────────┐
│   Listening State    │
│ 🤖 Bot is live...    │
│ Countdown: 10s       │
└──────┬───────────────┘
       │ After 10 seconds
       ▼
┌──────────────────────┐
│   Processing State   │
│ Analyzing meeting... │
└──────┬───────────────┘
       │ Analysis complete
       ▼
┌──────────────────────────────┐
│    Results Display           │
│ ├─ Summary & Key Takeaways   │
│ ├─ Auto-Generated Tasks      │
│ └─ Full Transcript + Search  │
└──────┬───────────────────────┘
       │ Share to participants
       ▼
┌──────────────────────────────┐
│   Telegram Notification      │
│ Tasks sent to team members   │
└──────────────────────────────┘
```

---

## 🔐 Security

- **Environment Variables**: All secrets in `.env.local` (never committed)
- **API Keys**: Securely managed, not exposed in client code
- **Telegram Auth**: Official Telegram Mini App authentication
- **Data Privacy**: Temporary processing, secure deletion
- **Rate Limiting**: Prevents abuse and excessive API calls

---

## 🌐 Browser Support

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)
- ✅ Responsive design for all screen sizes

---

## 📱 Features by Team Role

### Frontend Developer (Almas Temirlan)
- ✨ Responsive mobile-first design
- ✨ Component library integration
- ✨ Real-time UI updates
- ✨ Smooth animations & transitions
- ✨ Dark/light mode support

### Backend Developer / Team Lead (Kunashuly Mukhametzhan)
- 🔧 RESTful API endpoints
- 🔧 Database migrations
- 🔧 WebSocket support
- 🔧 Authentication & authorization
- 🔧 DevOps & deployment

### QA Engineer / Telegram Bot (Nessipbay Kamila)
- ✅ Comprehensive test coverage
- ✅ Telegram bot integration
- ✅ Cross-browser testing
- ✅ Performance optimization
- ✅ Bug tracking & reporting

### Prompt Engineer / AI (Kudageldina Amina)
- 🤖 LLM prompt optimization
- 🤖 Summary quality tuning
- 🤖 Task extraction accuracy
- 🤖 Multi-language support
- 🤖 Custom output formatting

---

## 🐛 Known Issues & Limitations

- Audio processing: 10-second listening window in demo
- Meeting history: Stored locally in demo mode
- Languages: Initially English & Russian, more to come
- Tasks: Max 50 per meeting (current version)

---

## 🔄 CI/CD Pipeline

- **GitHub Actions**: Automated testing & building
- **TypeScript**: Type checking on every commit
- **ESLint**: Code quality validation
- **Build verification**: Before deployment
- **Netlify**: Automatic production deployment on main branch

---

## 📚 API Endpoints (Backend)

### Meeting Processing
```
POST /api/meetings/process
{
  "meetingUrl": "https://meet.google.com/...",
  "platform": "google_meet" | "zoom" | "teams"
}

Response:
{
  "id": "meeting_id",
  "summary": "...",
  "tasks": [...],
  "keyTakeaways": [...],
  "transcript": [...]
}
```

### Tasks
```
GET    /api/tasks
GET    /api/tasks/:id
POST   /api/tasks
PATCH  /api/tasks/:id
DELETE /api/tasks/:id
```

### Meetings
```
GET    /api/meetings
GET    /api/meetings/:id
DELETE /api/meetings/:id
```

---

## 🎓 Learning Resources

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Telegram Bot API](https://core.telegram.org/bots/api)
- [OpenAI API](https://platform.openai.com/docs)
- [Vite Guide](https://vitejs.dev/guide/)

---

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/amazing-feature`
2. Commit changes: `git commit -m 'Add amazing feature'`
3. Push to branch: `git push origin feature/amazing-feature`
4. Open a Pull Request

### Code Guidelines
- Use TypeScript for all new code
- Follow existing naming conventions
- Add comments for complex logic
- Format with Prettier
- Write meaningful commit messages

---

## 📞 Support & Contact

**Production**: [omnisync-ai.netlify.app](https://omnisync-ai.netlify.app)

**GitHub Issues**: Report bugs and request features

**Team Contact**:
- **Frontend**: Almas Temirlan (UX/UI Design)
- **Backend & DevOps**: Kunashuly Mukhametzhan (Team Lead)
- **QA & Bot**: Nessipbay Kamila (Quality Assurance)
- **AI Integration**: Kudageldina Amina (Prompt Engineering)

---
### Light Theme
<img width="1814" height="969" alt="image" src="https://github.com/user-attachments/assets/af010a9b-8457-4bed-9faa-84c8c83d2a29" />

### Dark Theme
<img width="1781" height="966" alt="image" src="https://github.com/user-attachments/assets/8b2c198c-102e-4c8b-b3d0-5e5998da9873" />

### Mobile Version
<img width="431" height="869" alt="image" src="https://github.com/user-attachments/assets/dd6f05be-170f-4643-a1e8-48c8826d81be" />


## 🎯 Roadmap

- [ ] Multi-language transcription (10+ languages)
- [ ] Custom AI prompt templates
- [ ] Slack & Discord integration
- [ ] Advanced analytics dashboard
- [ ] Team workspace management
- [ ] Premium features & pricing
- [ ] Native mobile apps (iOS/Android)
- [ ] Real-time collaboration features
- [ ] Video replay with highlights
- [ ] Integration with calendar systems

---

## 🙏 Acknowledgments

- **OpenAI** for GPT-4 and Whisper API
- **Telegram** for Bot API and Mini App platform
- **shadcn/ui** for beautiful component library
- **Vite** for fast build tooling
- **The amazing OmniSync team!**




