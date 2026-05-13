# Reflection — SpendPilot AI Audit

## 1. What was the hardest technical bug you encountered?

The hardest bug was a silent failure in the audit engine's overlap detection logic. When a user had both Cursor and Copilot in their stack, the `cheaperTool` sort was comparing `parseFloat(spend)` values — but if a user entered `0` for spend on one tool, the sort would always pick that tool as "cheaper" regardless of the actual plan cost. This meant the savings calculation for the overlap flag was always `$0`, making the flag appear but show no financial impact.

The fix was to fall back to the benchmark price from the `PRICING` constant when the user-reported spend is zero, rather than treating zero-spend as the actual cost. This made the overlap savings calculation financially meaningful even when users hadn't filled in exact spend figures.

## 2. What decision did you reverse during the week?

Initially I planned to use a pure OpenAI-generated audit — send the user's stack to GPT-4o and let it produce recommendations. I reversed this after realizing two things: (1) LLM outputs are non-deterministic, meaning the same input could produce different savings numbers on different runs, which destroys financial credibility; (2) if the OpenAI API is down or the key is missing, the entire product breaks.

The reversal was to build a deterministic rule-based engine first, and use OpenAI only for the narrative summary — a layer where non-determinism is acceptable and even desirable. The fallback summary ensures the product works completely without any API key.

## 3. What would you build in week 2 if this continued?

- **Usage data integration**: Connect to Stripe/billing APIs so users don't have to manually enter spend — the tool pulls it automatically.
- **Team collaboration**: Allow multiple team members to contribute tool entries to a shared audit, with a final consolidated report.
- **Savings tracking**: After a user acts on a recommendation, let them mark it as "done" and track actual vs projected savings over time.
- **Benchmark database**: Build a crowdsourced pricing database from anonymized audit submissions to improve recommendation accuracy.
- **Slack/email digest**: Weekly spend digest sent to the team's Slack channel showing any new optimization opportunities.

## 4. How did you use AI during this project?

AI was used in three ways:
1. **Architecture planning**: Used Claude to pressure-test the rule-based vs LLM-generated audit decision. The conversation helped clarify that deterministic rules + LLM narrative was the right split.
2. **Prompt engineering**: Iterated on the OpenAI summary prompt to get professional prose rather than bullet points. The key insight was explicitly instructing the model to write in "flowing prose" and giving it the exact financial numbers rather than asking it to calculate them.
3. **Edge case discovery**: Asked Claude "what edge cases would break a rule-based spend audit engine?" — this surfaced the zero-spend sort bug described above before it was caught in testing.

## 5. Self-rating and honest assessment

**Rating: 7/10**

**Strengths:**
- The audit engine logic is genuinely financially defensible — every rule has a real business rationale tied to official pricing data
- The fallback architecture (rule-based summary, localStorage fallback, DB-optional) means the product works at every level of infrastructure
- 20 passing tests with CI gives the codebase real engineering credibility
- The results page with charts and severity-coded recommendations looks production-quality

**Weaknesses:**
- The exam period in days 6–7 broke momentum and left deployment incomplete
- USER_INTERVIEWS.md reflects planned rather than completed interviews — real customer discovery would have sharpened the audit rules significantly
- The frontend could benefit from a proper design system rather than inline styles throughout
- No rate limiting on the API endpoints — a production deployment would need this immediately
