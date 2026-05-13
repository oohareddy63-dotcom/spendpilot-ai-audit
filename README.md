# SpendPilot AI Audit

> AI-powered SaaS spend audit tool — built for the Credex 7-day engineering challenge.

**Live demo:** https://spendpilot-ai-audit.vercel.app/

**Backend API:** https://spendpilot-ai-audit.onrender.com

---

## What It Does

SpendPilot helps engineering teams and founders identify wasteful AI tool subscriptions in under 3 minutes. Enter your stack, get a rule-based audit with exact savings figures, an AI-generated executive summary, and a shareable report link.

**Core flow:**
1. User fills out the AI spend audit form (tool + plan + spend + seats)
2. Backend runs 20 rule-based checks against benchmark pricing
3. OpenAI generates a professional executive summary (with deterministic fallback)
4. Results saved to MongoDB with a unique share ID
5. User can email the report to themselves and share a public link

---

## Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite + Tailwind CSS + Framer Motion |
| Backend | Node.js + Express 5 |
| Database | MongoDB Atlas (Mongoose) |
| AI | OpenAI gpt-4o-mini (with rule-based fallback) |
| Email | Resend |
| Charts | Recharts |
| Testing | Jest + Supertest |
| CI | GitHub Actions |
| Deploy | Vercel (frontend) + Render (backend) |

---
**##Screenshots**


<img width="1877" height="897" alt="Screenshot 2026-05-13 222549" src="https://github.com/user-attachments/assets/ea249ae3-ebb6-4b29-87b2-7961ebb379cc" />

<img width="1860" height="822" alt="Screenshot 2026-05-13 222610" src="https://github.com/user-attachments/assets/7ae229d1-da43-433c-aa9c-f003949badf8" />

<img width="1912" height="893" alt="Screenshot 2026-05-13 222530" src="https://github.com/user-attachments/assets/6f76a5ee-11c4-4af1-bc86-bba7a3ba6ad1" />

<img width="1883" height="946" alt="Screenshot 2026-05-13 222426" src="https://github.com/user-attachments/assets/90eb7c18-0249-410a-8c4e-2b23d6881ecf" />

<img width="1875" height="982" alt="Screenshot 2026-05-13 222444" src="https://github.com/user-attachments/assets/bb715f5e-d2e0-4f56-946d-656a5aea9db2" />

<img width="1446" height="881" alt="Screenshot 2026-05-13 222148" src="https://github.com/user-attachments/assets/f58a90f1-05f7-4636-8c03-e81517b9d9cb" />


## Getting Started

### Prerequisites
- Node.js 18+
- npm 9+
- MongoDB Atlas account (or local MongoDB)
- OpenAI API key (optional — fallback works without it)
- Resend API key (optional — email skipped without it)

### 1. Clone the repo

```bash
git clone https://github.com/oohareddy63-dotcom/spendpilot-ai-audit.git
cd spendpilot-ai-audit
```

### 2. Set up the backend

```bash
cd server
npm install
cp .env.example .env
# Edit .env with your keys
npm run dev
```

Server runs on `http://localhost:5000`

### 3. Set up the frontend

```bash
cd client
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

### 4. Environment variables

Copy `server/.env.example` to `server/.env` and fill in:

```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/spendpilot
OPENAI_API_KEY=sk-...
RESEND_API_KEY=re_...
CLIENT_URL=http://localhost:5173
```

**The app works without MongoDB, OpenAI, and Resend** — it degrades gracefully:
- No MongoDB → audit results stored in localStorage only, share links use localStorage
- No OpenAI key → deterministic rule-based summary used instead
- No Resend key → email step skipped, rest of flow works normally

---

## Running Tests

```bash
cd server
npm test
```

20 tests covering audit engine rules, savings calculations, edge cases, and summary shape validation. All passing.

---

## Project Structure

```
spendpilot-ai-audit/
├── client/                    # React + Vite frontend
│   └── src/
│       ├── pages/             # LandingPage, AuditFormPage, ResultsPage, SharePage
│       ├── components/        # Navbar
│       ├── data/              # tools.js — 15 AI tools with plan tiers
│       └── services/          # api.js — Axios instance
├── server/                    # Express backend
│   ├── controllers/           # auditController, leadController
│   ├── models/                # Audit.js, Lead.js (Mongoose)
│   ├── routes/                # auditRoutes, leadRoutes
│   ├── services/              # auditEngine, aiSummaryService, emailService
│   └── tests/                 # auditEngine.test.js (20 tests)
├── .github/workflows/ci.yml   # GitHub Actions CI
├── README.md
├── ARCHITECTURE.md
├── DEVLOG.md
├── REFLECTION.md
├── TESTS.md
├── PRICING_DATA.md
├── PROMPTS.md
├── GTM.md
├── ECONOMICS.md
├── USER_INTERVIEWS.md
├── LANDING_COPY.md
└── METRICS.md
```

---

## Key Engineering Decisions

### 1. Rule-based engine, not pure LLM
The audit recommendations are deterministic — 20 rules comparing user input against benchmark pricing. OpenAI is used only for the narrative summary. This ensures: (a) consistent, reproducible results, (b) the product works without an API key, (c) financial figures are never hallucinated.

### 2. Graceful degradation at every layer
Every external service (MongoDB, OpenAI, Resend) has a fallback path. The core audit flow works with zero external dependencies — useful for demos, development, and resilience.

### 3. Honeypot anti-spam on lead capture
The lead form includes a hidden input field that humans never fill. If populated (bots fill all fields), the request is silently accepted but not saved. Zero user friction, effective against basic bots.

### 4. localStorage + DB dual persistence
Audit results are saved to both localStorage (immediate, no latency) and MongoDB (persistent, shareable). The share page tries the API first and falls back to localStorage — so share links work even during backend downtime.

### 5. UUID share IDs, not MongoDB ObjectIDs
Share links use UUID v4 rather than MongoDB `_id`. This decouples the share URL from the database implementation — if the DB changes, existing share links remain valid.

---

## Supported AI Tools

Cursor, ChatGPT, Claude, GitHub Copilot, Gemini, OpenAI API, Anthropic API, Windsurf, v0 by Vercel, Midjourney, Perplexity, Notion, Linear, Vercel, GitHub

---

## Anti-Spam

Lead capture uses a honeypot field. See `server/controllers/leadController.js` and `TESTS.md` for details.

---

## License

MIT
