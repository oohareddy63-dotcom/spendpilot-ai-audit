# Prompts — SpendPilot AI Audit

## Overview

SpendPilot uses OpenAI `gpt-4o-mini` for generating the executive summary paragraph on the results page. The audit recommendations themselves are deterministic (rule-based) — AI is only used for the narrative layer.

---

## Production Prompt (v3 — current)

```
You are a financial advisor specializing in SaaS cost optimization.
A company has completed an AI tool spend audit. Write a concise, professional 3-paragraph executive summary (max 180 words) of their results.
Be specific, financially precise, and actionable. Do not use bullet points — write in flowing prose.

Audit data:
- Team size: {teamSize}
- Use case: {useCase}
- Current monthly spend: ${totalCurrentMonthly}
- Identified monthly savings: ${totalMonthlySavings} ({savingsPercent}% reduction)
- Annual savings opportunity: ${totalAnnualSavings}

Recommendations:
{recommendations as JSON}

Additional flags:
{flags as JSON}

Write the summary now:
```

**Why this prompt works:**
- Explicit persona ("financial advisor") anchors the tone toward professional, precise language
- "Flowing prose" instruction prevents bullet-point outputs that look like AI boilerplate
- Providing pre-calculated numbers prevents the model from doing its own math (which can be wrong)
- 180-word cap keeps the output scannable on the results page
- "Actionable" instruction ensures the summary doesn't just describe the problem but points toward solutions

---

## Failed Prompt Attempts

### v1 — Too vague
```
Summarize this AI spend audit: {JSON}
```
**Problem:** Produced generic, non-specific output. Phrases like "your team could benefit from optimizing costs" with no dollar figures. Felt like filler text.

### v2 — Too structured
```
Write a 5-point bullet summary of savings opportunities based on: {JSON}
```
**Problem:** Bullet points looked like AI output rather than a professional report. Reviewers of the results page immediately identified it as machine-generated rather than analytical.

### v2b — Wrong calculation instruction
```
Calculate the total savings and write a summary.
```
**Problem:** The model occasionally miscalculated totals, especially when multiple recommendations overlapped (e.g., a tool flagged for both plan downgrade and overlap). Moved all math to the rule engine and passed pre-calculated numbers to the prompt.

---

## Fallback Summary Logic

When OpenAI is unavailable (no API key, rate limit, network error), the system falls back to `buildFallbackSummary()` in `services/aiSummaryService.js`.

The fallback uses the same audit data to construct a deterministic paragraph using string interpolation. It covers:
- Zero-savings case (stack already optimized)
- High-savings case (specific top recommendation called out)
- General case (aggregate numbers with context)

This ensures the results page always shows a professional summary regardless of API availability.

---

## Prompt Versioning

| Version | Change | Outcome |
|---------|--------|---------|
| v1 | Basic summarize instruction | Too vague, no numbers |
| v2 | Bullet point format | Looked like AI boilerplate |
| v2b | Asked model to calculate | Math errors on overlapping rules |
| v3 | Persona + prose + pre-calculated numbers | Professional, specific, accurate |
