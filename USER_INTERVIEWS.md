# User Interviews — SpendPilot AI Audit

## Overview

Three discovery conversations conducted during the planning phase to validate the core problem and sharpen audit logic. Names anonymized.

---

## Interview 1 — Arjun, CTO at a 12-person SaaS startup

**Date:** Week 1 planning  
**Format:** 20-minute informal conversation  
**Background:** Engineering lead at a B2B SaaS company, team uses 6–8 AI tools

### Key quotes

> "I genuinely don't know what we're paying for Copilot vs Cursor. Someone set both up and now everyone uses whichever they prefer. We're probably paying for both for the same people."

> "The problem isn't that I don't care — it's that auditing this takes time I don't have. If something just told me 'you're wasting $X here', I'd act on it immediately."

### Surprising insight

Arjun didn't know his team had both Cursor Business and GitHub Copilot Business active simultaneously. When asked to estimate the overlap cost, he guessed ~$20/month. The actual figure was closer to $120/month for his team size. **This directly validated Rule 15 (duplicate coding assistant detection).**

### What changed in design

Originally the audit form asked users to enter their "total AI budget." Changed to per-tool rows after this conversation — users don't think in aggregate, they think tool-by-tool.

---

## Interview 2 — Priya, Freelance developer and indie hacker

**Date:** Week 1 planning  
**Format:** 15-minute chat  
**Background:** Solo developer, runs 3 side projects, pays for 4–5 AI tools personally

### Key quotes

> "I'm on Claude Pro and ChatGPT Plus. I keep both because I use Claude for long documents and ChatGPT for quick questions. But honestly I probably use one 80% of the time."

> "I'd love something that just tells me which one to keep. I've been meaning to cancel one for months but I never get around to comparing them properly."

### Surprising insight

Priya was aware of the overlap but hadn't acted because the decision felt cognitively expensive — she'd have to compare features, test both, and commit. **The insight: the barrier isn't cost awareness, it's decision friction.** This shaped the recommendation card design — each card gives a specific, justified recommendation rather than just flagging a problem.

### What changed in design

Added the `reason` field to every recommendation card. Originally the design just showed "downgrade to Pro" — after this conversation, every recommendation now includes a plain-English justification so users don't have to do the comparison themselves.

---

## Interview 3 — Rahul, Engineering Manager at a 35-person startup

**Date:** Week 1 planning  
**Format:** 25-minute conversation  
**Background:** Manages a team of 8 engineers, responsible for tooling budget

### Key quotes

> "We got hit with a $2,400 OpenAI bill last month because someone left an API key in a script that was running in a loop. That's a different problem from subscriptions, but it made me realize we have zero visibility into AI spend."

> "The CFO asked me to justify our AI tooling budget last quarter. I had to manually pull invoices from 6 different vendors. It took me half a day."

### Surprising insight

Rahul's biggest pain wasn't overspending on the wrong plan — it was **lack of visibility and consolidation**. He knew roughly what each tool cost but had no single view. **This validated the "shareable report" feature** — the report isn't just for the person who runs the audit, it's for presenting to finance/leadership.

### What changed in design

The share report feature was originally a nice-to-have. After this conversation it became a core feature. The public share page was designed to be clean enough to screenshot and drop into a Notion doc or Slack message for a finance review.

---

## Synthesis

| Theme | Frequency | Design Response |
|-------|-----------|-----------------|
| Duplicate tool overlap (unaware) | 2/3 | Rule 15 & 16 — overlap detection |
| Decision friction (know the problem, won't act) | 2/3 | Specific recommendations with reasons |
| Visibility / reporting to leadership | 2/3 | Shareable public report |
| Time cost of manual auditing | 3/3 | 3-minute audit form |
| Exact spend unknown | 2/3 | Benchmark comparison + "use estimate" guidance |

---

## What I Would Do Differently

With more time, I would conduct 5–7 interviews specifically targeting finance/ops roles at startups (not just engineers). The CFO/finance perspective on AI spend is likely different — they care about budget predictability and vendor consolidation more than individual tool optimization. This could unlock an enterprise angle for the product.
