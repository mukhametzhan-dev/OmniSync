Roles:
- admin: full access (except start/stop agent)
- meeting_host: start/stop agent, full transcripts, create/edit tasks
- participant: view own transcripts & tasks only
- ai: system role for automated transcript/task creation & audit writing

## How H3 is used in the system

We use **Uber H3** library for hexagonal geospatial indexing:

- Every processed meeting / generated task is assigned an H3 cell ID based on approximate meeting location (latitude/longitude).
- Resolution 8–9 is used (~0.1–1 km² hexagons).
- This allows future features like:
  - Grouping tasks by geographic region
  - Spatial analytics of meetings/tasks
  - Proximity-based notifications

Example: task gets `h3_hex_id` field like `"891da000000ffff"`

```
┌─────────────────────┐    ┌──────────────────────┐    ┌─────────────────────┐
│   Telegram Bot      │    │   FastAPI Backend    │    │  Selenium Agent     │
│   (Интерфейс)      │◄──►│   (Основная логика)  │◄──►│  (Google Meet)      │
└─────────────────────┘    └──────────────────────┘    └─────────────────────┘
           ▲                          │                           │
           │                          ▼                           │
┌─────────────────────┐    ┌──────────────────────┐              │
│  Telegram Mini App  │    │   OpenRouter AI      │              │
│   (Dashboard)       │    │   (Анализ текста)    │              │
└─────────────────────┘    └──────────────────────┘              │
                                      │                           │
                                      ▼                           ▼
                           ┌──────────────────────┐    ┌─────────────────────┐
                           │   База данных        │    │   Caption Parser    │
                           │   (Сессии/задачи)   │    │   (Извлечение речи) │
                           └──────────────────────┘    └─────────────────────┘
```
Light Theme
<img width="1814" height="969" alt="image" src="https://github.com/user-attachments/assets/af010a9b-8457-4bed-9faa-84c8c83d2a29" />

Dark Theme
<img width="1781" height="966" alt="image" src="https://github.com/user-attachments/assets/8b2c198c-102e-4c8b-b3d0-5e5998da9873" />

Mobile Version
<img width="431" height="869" alt="image" src="https://github.com/user-attachments/assets/dd6f05be-170f-4643-a1e8-48c8826d81be" />


