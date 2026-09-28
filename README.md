# HisabAI — Roommates ka hisab, automatic

A full-stack MERN app that splits shared room expenses automatically and adds
AI-powered natural-language entry, monthly analysis, and a Q&A chatbot on top
of a plain deterministic settlement engine (the math is never done by AI).

## Structure

```
hisabai/
├── backend/     Express + MongoDB API (JWT auth, expenses, settlement, Gemini AI)
└── frontend/    React + Vite + Tailwind app (ledger-style UI)
```

## 1. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env`:
- `MONGO_URI` — your MongoDB connection string (local or Atlas)
- `JWT_SECRET` — any long random string
- `GEMINI_API_KEY` — from https://aistudio.google.com/apikey (AI features are
  optional; the app works without it, the AI Assistant page will just show a
  "not configured" message)

```bash
npm run dev
```

API runs on `http://localhost:5000`.

## 2. Frontend setup

```bash
cd frontend
npm install
npm run dev
```

App runs on `http://localhost:5173` and proxies `/api` to the backend.

## 3. Using the app

1. Register — the first person creates a room and gets an invite code.
2. Share the invite code with roommates; they select "Join a room" at
   registration.
3. Add expenses from the dashboard, or type them in plain English
   ("Today I spent 300 rupees on groceries") in the AI Expense Assistant box.
4. The Settlement page shows the minimum number of transactions needed to
   bring everyone to zero.
5. Reports has category and month-over-month charts; "Download / Print
   report" uses the browser's print-to-PDF.
6. AI Assistant gives a monthly analysis and answers questions grounded in
   the room's actual expense data.

## Notes

- Expense splitting and settlement math is handled entirely in
  `backend/utils/settlement.js` with plain arithmetic — AI is only used for
  parsing natural language and writing summaries, per the original spec.
- Each user has their own login (recommended approach) so the ledger always
  shows who paid and who owes.
- To add more categories or split logic, see `backend/models/Expense.js` and
  `backend/utils/settlement.js`.

## Landing page & mobile app

- Logged-out visitors on the web see the premium landing page (`frontend/src/pages/Landing.jsx`)
  with a live settlement demo; inside the native app it goes straight to login.
- Recurring bills (`isRecurring`) are auto-added each month by `backend/utils/recurring.js`.
- Full deploy guide (Atlas → Render → Android APK via GitHub Actions → Play Store/App Store): see `DEPLOYMENT.md`.
