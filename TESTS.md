# Tests — SpendPilot AI Audit

## Test Suite: `server/tests/auditEngine.test.js`

**Framework:** Jest  
**Environment:** Node.js  
**Total tests:** 20 passing

### Run tests

```bash
cd server
npm test
```

---

## Test Coverage

### Rule 1 & 2 — Cursor Business downgrade
- ✅ Flags Cursor Business for a 2-seat team as high severity
- ✅ Flags Cursor Business for a 4-seat team as medium severity
- ✅ Does NOT flag Cursor Pro (already optimal)

### Rule 3 — ChatGPT Team optimization
- ✅ Recommends Plus over Team for a 2-seat team
- ✅ Does NOT flag ChatGPT Team for a 5-seat team

### Summary — annual savings calculation
- ✅ Annual savings equals monthly savings × 12
- ✅ Savings percent is correctly calculated

### No-recommendation scenario
- ✅ Returns zero savings for an already-optimal stack
- ✅ Returns empty arrays (not null/undefined)

### Rule 15 & 16 — Duplicate tool overlap
- ✅ Flags Cursor + Copilot as overlapping coding assistants
- ✅ Flags ChatGPT + Claude as overlapping AI assistants
- ✅ Does NOT flag a single coding assistant

### Rule 5 — Claude Max downgrade
- ✅ Recommends Pro over Max for a 2-seat team ($160/mo savings)

### Rule 13 — GitHub Enterprise downgrade
- ✅ Recommends Team over Enterprise for a 5-seat team ($85/mo savings)

### Summary object shape
- ✅ Summary contains all required fields
- ✅ toolsAudited matches input length

### Rule 17 — AI tool sprawl
- ✅ Flags sprawl for 4+ paid tools on a small team

### Edge cases
- ✅ Handles zero spend gracefully
- ✅ Handles missing teamSize gracefully
- ✅ optimizedMonthly is never negative

---

## CI/CD

Tests run automatically on every push to `main` via GitHub Actions.  
See `.github/workflows/ci.yml`.

---

## Anti-spam

The lead capture form uses a **honeypot field** — a hidden input invisible to humans.  
If the field is populated (bots fill all fields), the request is silently rejected server-side in `leadController.js`.  
This requires zero user friction and satisfies basic bot protection without CAPTCHA.
