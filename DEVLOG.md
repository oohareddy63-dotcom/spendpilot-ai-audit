# DEVLOG — SpendPilot AI Audit

## Day 1 — 2026-05-06

**Hours worked:** 4

**What I did:**
Finalized MERN stack as the delivery framework, initialized React frontend and Express backend, installed core dependencies, created mandatory repository documentation files, and established the baseline git history for the 7-day execution window.

**What I learned:**
The Credex assignment rewards engineering discipline and founder-style documentation as much as the shipped code, so the repository had to be structured correctly from the first day.

**Blockers / what I'm stuck on:**
Need to finalize frontend SaaS layout and formalize pricing-based audit decision rules.

**Plan for tomorrow:**
Build the premium landing page and dynamic AI spend audit form UI.

---

## Day 2 — 2026-05-07

**Hours worked:** 6

**What I did:**
Built the primary frontend experience including routing, landing page sections, reusable navigation, and the dynamic AI spend audit form. Added localStorage persistence to maintain form state across reloads and improved visual polish using a dark SaaS-inspired UI system.

**What I learned:**
UI quality strongly affects perceived product credibility. Structuring the form dynamically early makes future audit engine integration significantly easier.

**Blockers / what I'm stuck on:**
Need to formalize audit recommendation logic and pricing thresholds before backend implementation.

**Plan for tomorrow:**
Build the backend audit engine and connect the frontend form submission flow.

---

## Day 3 — 2026-05-08

**Hours worked:** 7

**What I did:**
Built the backend audit engine with 20 rule-based recommendations covering plan downgrades, tool overlap detection, team-size mismatches, and spend anomalies. Connected the Express API to the React frontend — the form now POSTs to `/api/audit` and the results page renders real recommendations with severity levels and savings calculations. Rebuilt the results dashboard to display per-recommendation cards, insight flags, a spend breakdown chart, and a conditional Credex CTA based on savings threshold.

**What I learned:**
Rule-based audit logic needs to be financially defensible — every recommendation must have a clear business rationale tied to real pricing data. Vague suggestions destroy credibility. Also learned that structuring the API response with `summary`, `recommendations`, and `flags` as separate arrays makes the frontend much easier to render conditionally.

**Blockers / what I'm stuck on:**
Need to add MongoDB persistence so audit results survive beyond localStorage. Also want to add email delivery of the report via Resend.

**Plan for tomorrow:**
Add MongoDB models, persist audit results to DB, implement shareable report links backed by DB, and add Resend email delivery.

---

## Day 5 — 2026-05-10

**Hours worked:** 6

**What I did:**
Engineering quality day. Wrote 20 Jest unit tests covering all major audit engine rules, edge cases, and summary shape validation — all passing. Set up GitHub Actions CI that runs tests and builds the frontend on every push to main. Added recharts (pie + bar charts) to the results page for visual spend breakdown. Integrated react-hot-toast for non-intrusive notifications (link copied, report sent, form reset). Improved accessibility across all forms with proper aria labels, roles, and semantic HTML. Made the audit form fully mobile-responsive with a CSS grid fallback for small screens. Added client-side validation with clear error messages. Created `.env.example` for clean onboarding. Updated TESTS.md with full coverage documentation.

**What I learned:**
Writing tests after the fact forces you to think about edge cases you missed during implementation — the "missing teamSize" and "zero spend" edge cases revealed a potential divide-by-zero in savingsPercent that was already handled but worth explicitly testing. GitHub Actions CI is a 20-line investment that signals serious engineering discipline to any reviewer.

**Blockers / what I'm stuck on:**
Lighthouse mobile score needs testing in Chrome DevTools. May need to add font preloading and image optimization for performance score.

**Plan for tomorrow:**
Final polish day — update README with screenshots and setup guide, fill in GTM/ECONOMICS/REFLECTION docs, and prepare the submission package.

---

## Day 4 — 2026-05-09

**Hours worked:** 7

**What I did:**
Connected MongoDB Atlas via Mongoose with graceful degradation when the URI is not set. Created Audit and Lead models. Built the AI summary service using OpenAI gpt-4o-mini with a deterministic rule-based fallback that produces professional prose without any external API. Implemented the Resend email service with a full HTML template. Updated the audit controller to persist results to MongoDB and attach a UUID share ID. Built the lead capture form on the results page with honeypot anti-spam protection. Updated the SharePage to fetch reports from the API (DB-backed) with a localStorage fallback for offline dev. Added the public share route `GET /api/audit/:shareId` that returns only non-PII fields.

**What I learned:**
Graceful degradation is critical for a product that depends on multiple external services — OpenAI, MongoDB, and Resend can all fail independently. Every service integration needs a fallback path so the core audit flow never breaks. The honeypot pattern is the simplest effective anti-spam measure that requires zero user friction.

**Blockers / what I'm stuck on:**
Need to add real MongoDB Atlas URI and Resend API key to .env to activate persistence and email. OpenAI key needed for live AI summaries (fallback works without it).

**Plan for tomorrow:**
Write Jest tests for the audit engine, add a basic test for the API routes using supertest, and update TESTS.md with coverage documentation.
