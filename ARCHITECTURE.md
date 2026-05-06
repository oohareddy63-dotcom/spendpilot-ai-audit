# Architecture — SpendPilot AI Audit

## System Overview

```
Client (React/Vite)
    │
    │  REST API (JSON)
    ▼
Server (Express/Node.js)
    │
    ├── MongoDB (Mongoose) — data persistence
    ├── OpenAI API         — AI audit analysis
    └── Resend             — transactional email
```

## Frontend Architecture

- React SPA with React Router for navigation
- Tailwind CSS for styling
- Framer Motion for animations
- Axios for API calls
- Component-based structure under `src/components/`

## Backend Architecture

- Express REST API
- MVC pattern: routes → controllers → services → models
- MongoDB for storing audit submissions and results
- Environment-based config via dotenv

## Data Flow

1. User fills out AI spend audit form on frontend
2. Form data POSTed to `/api/audit`
3. Backend processes data, calls OpenAI for analysis
4. Results stored in MongoDB
5. Audit report returned to frontend and emailed via Resend

## Folder Structure

```
server/
├── routes/       # Express route definitions
├── controllers/  # Request handlers
├── models/       # Mongoose schemas
├── services/     # Business logic (AI, email)
├── utils/        # Helper functions
└── tests/        # Jest test suites
```
