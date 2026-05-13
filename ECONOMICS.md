# Economics — SpendPilot AI Audit

## Unit Economics (Pro Tier — $29/mo)

| Metric | Value | Notes |
|--------|-------|-------|
| Monthly price | $29 | Per team |
| Annual price | $299 | ~15% discount |
| Gross margin | ~92% | SaaS infrastructure costs ~$2.50/team/mo |
| CAC (organic) | ~$0 | Free tool → email capture → upgrade |
| CAC (paid) | ~$45 | Estimated via content/community |
| LTV (12-month) | $299 | Conservative, no expansion |
| LTV/CAC ratio | 6.6x | Healthy for SaaS |

---

## Cost Structure (Monthly, at 500 active teams)

| Cost | Monthly | Notes |
|------|---------|-------|
| Vercel (frontend) | $20 | Pro plan |
| Render (backend) | $25 | Starter instance |
| MongoDB Atlas | $57 | M10 cluster |
| OpenAI API | ~$40 | ~2,000 audits/mo at ~$0.02/audit |
| Resend (email) | $20 | 50k emails/mo |
| Domain + misc | $15 | |
| **Total** | **~$177/mo** | |

At 500 paying teams × $29 = **$14,500 MRR**, infrastructure is ~1.2% of revenue.

---

## Path to $1M ARR

**$1M ARR = ~$83,333 MRR = ~2,874 paying teams at $29/mo**

### Milestones

| Stage | Teams | MRR | Key Unlock |
|-------|-------|-----|------------|
| Launch | 0 → 50 free | $0 | Product-market fit signal |
| Early traction | 50 → 200 free, 20 paid | $580 | First paying customers |
| Growth | 500 free, 100 paid | $2,900 | Content/community flywheel |
| Scale | 5,000 free, 500 paid | $14,500 | Paid acquisition viable |
| $1M ARR | ~15,000 free, 2,874 paid | $83,333 | Enterprise tier launched |

### Key Assumptions
- Free-to-paid conversion: 6% (industry average for dev tools: 3–8%)
- Monthly churn: 4% (teams cancel when they've acted on all recommendations)
- Viral coefficient: 0.3 (30% of users share their report, 10% of those convert)

---

## Why This Business Works

1. **The pain is real and measurable** — we show users a dollar figure, not a vague "you could save money"
2. **Zero marginal cost to serve** — each additional audit costs ~$0.02 in OpenAI tokens
3. **Natural expansion revenue** — as teams grow, they add more tools and need re-audits
4. **No sales motion required at SMB** — the free tool is the sales motion

---

## Pivot Threshold

If free-to-paid conversion stays below 2% after 1,000 free audits, the pricing model needs revisiting. Options:
- Lower price to $9/mo (volume play)
- Move to B2B enterprise-only ($500+/mo, outbound sales)
- Pivot to API product (charge per audit, not per seat)
