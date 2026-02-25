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
                           └──────────────────────┘    └─────────────────────┘```


