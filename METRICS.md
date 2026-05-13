# Metrics — SpendPilot AI Audit

## North Star Metric

**Audits completed per week**

This is the single number that captures whether the product is delivering value. An audit completed means a user went through the full flow, saw their results, and received a savings recommendation. Everything else (leads, shares, conversions) is downstream of this.

---

## 3 Input Metrics

### 1. Audit form completion rate
**Definition:** % of users who land on `/audit` and submit the form  
**Target:** ≥ 65%  
**Why it matters:** A low completion rate means the form is too long, confusing, or the user doesn't trust the product. This is the biggest conversion lever.  
**How to improve:** Reduce required fields, add inline examples, show a "your data is safe" trust signal.

### 2. Results page email submission rate
**Definition:** % of users who reach `/results` and submit their email  
**Target:** ≥ 25%  
**Why it matters:** Email capture is the monetization gateway. Users who submit email are 6x more likely to convert to paid than those who don't.  
**How to improve:** Show the email form only after the savings number is visible. Value-first, capture-second.

### 3. Report share rate
**Definition:** % of results page visitors who copy the share link  
**Target:** ≥ 15%  
**Why it matters:** Every shared report is a free acquisition channel. The share link is the viral loop.  
**How to improve:** Make the share button prominent. Add a "share with your finance team" prompt for high-savings results.

---

## Instrumentation Plan

### Events to track (via PostHog or Mixpanel)

| Event | Properties | Purpose |
|-------|-----------|---------|
| `page_view` | path, referrer | Funnel analysis |
| `audit_form_started` | tool_count | Engagement signal |
| `audit_form_submitted` | tool_count, total_spend, team_size | Conversion tracking |
| `audit_completed` | monthly_savings, annual_savings, rec_count | Value delivery |
| `email_submitted` | audit_id, savings_amount | Lead capture |
| `share_link_copied` | audit_id, savings_amount | Viral tracking |
| `share_page_viewed` | audit_id, referrer | Viral attribution |

### Minimum viable instrumentation (MVP)
For the MVP, track only:
1. Audit form submissions (count + savings amount)
2. Email submissions (count)
3. Share link copies (count)

These three numbers tell you if the product is working.

---

## Pivot Threshold

| Signal | Threshold | Action |
|--------|-----------|--------|
| Audit completion rate | < 40% for 2 weeks | Simplify form — reduce to 3 required fields |
| Email submission rate | < 10% for 2 weeks | Redesign lead capture — try exit-intent modal |
| Zero savings results | > 50% of audits | Expand rule set — users have already-optimal stacks |
| Share rate | < 5% | Make share button more prominent, add social proof |
| Free-to-paid conversion | < 2% after 1,000 free audits | Revisit pricing model (see ECONOMICS.md) |

---

## Week 1 Targets (Post-Launch)

| Metric | Target |
|--------|--------|
| Total audits completed | 50 |
| Email leads captured | 15 |
| Reports shared | 8 |
| Avg. savings identified | > $200/mo |
| Zero-savings audits | < 30% |

---

## Reporting Cadence

- **Daily (first 2 weeks):** Check audit count and email submissions
- **Weekly:** Review completion rate, share rate, savings distribution
- **Monthly:** Full funnel review, rule engine accuracy check (are recommendations being acted on?)
