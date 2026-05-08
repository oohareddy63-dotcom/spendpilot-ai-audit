# Pricing Data — SpendPilot AI Audit

Benchmark monthly per-seat prices used by the audit engine.
Sources verified as of May 2026. All prices in USD.

## Cursor
| Plan       | $/seat/mo | Notes                                      |
|------------|-----------|--------------------------------------------|
| Hobby      | $0        | Free tier, limited completions             |
| Pro        | $20       | Unlimited completions, GPT-4 access        |
| Business   | $40       | SSO, admin controls, audit logs            |
| Enterprise | $60       | Custom contracts, dedicated support        |

## ChatGPT (OpenAI)
| Plan       | $/seat/mo | Notes                                      |
|------------|-----------|--------------------------------------------|
| Plus       | $20       | GPT-4o, DALL·E, advanced data analysis     |
| Team       | $30       | Shared workspace, admin console, 2+ seats  |
| Enterprise | $60       | SSO, unlimited context, custom pricing     |
| API        | Variable  | Pay-per-token, not a flat subscription     |

## Claude (Anthropic)
| Plan       | $/seat/mo | Notes                                      |
|------------|-----------|--------------------------------------------|
| Free       | $0        | Limited messages, Claude 3 Haiku           |
| Pro        | $20       | 5x more usage, Claude 3.5 Sonnet           |
| Max        | $100      | 5x Pro limits, for heavy power users       |
| Team       | $30       | Collaboration features, 5+ seat minimum    |
| Enterprise | $60       | SSO, custom retention, admin controls      |

## GitHub Copilot
| Plan       | $/seat/mo | Notes                                      |
|------------|-----------|--------------------------------------------|
| Individual | $10       | IDE completions, Copilot Chat              |
| Business   | $19       | Policy management, audit logs              |
| Enterprise | $39       | Copilot Chat in GitHub.com, fine-tuning    |

## Midjourney
| Plan     | $/mo    | Fast GPU hours | Notes                        |
|----------|---------|----------------|------------------------------|
| Basic    | $10     | 3.3 hrs        | ~200 images/mo               |
| Standard | $30     | 15 hrs         | Unlimited relaxed generations |
| Pro      | $60     | 30 hrs         | Stealth mode, 12 fast jobs   |
| Mega     | $120    | 60 hrs         | For high-volume studios      |

## Perplexity
| Plan       | $/seat/mo | Notes                                      |
|------------|-----------|--------------------------------------------|
| Free       | $0        | Limited Pro searches                       |
| Pro        | $20       | Unlimited Pro searches, file uploads       |
| Enterprise | $40       | SSO, admin controls, team management       |

## Notion
| Plan       | $/seat/mo | Notes                                      |
|------------|-----------|--------------------------------------------|
| Free       | $0        | Unlimited pages, limited guests            |
| Plus       | $10       | Unlimited guests, version history          |
| Business   | $15       | SAML SSO, advanced permissions             |
| Enterprise | $25       | Advanced security, dedicated support       |

## Linear
| Plan       | $/seat/mo | Notes                                      |
|------------|-----------|--------------------------------------------|
| Free       | $0        | Up to 250 issues                           |
| Standard   | $8        | Unlimited issues, integrations             |
| Plus       | $14       | Advanced analytics, priority support       |
| Enterprise | $22       | SSO, custom roles, SLA                     |

## Vercel
| Plan       | $/mo      | Notes                                      |
|------------|-----------|--------------------------------------------|
| Hobby      | $0        | Personal projects, no commercial use       |
| Pro        | $20       | Commercial use, team collaboration         |
| Enterprise | $40+      | Custom pricing, SLA, dedicated support     |

## GitHub
| Plan       | $/seat/mo | Notes                                      |
|------------|-----------|--------------------------------------------|
| Free       | $0        | Public repos, basic CI                     |
| Team       | $4        | Private repos, 3,000 CI minutes            |
| Enterprise | $21       | SAML SSO, audit log, advanced security     |

---

## Audit Decision Thresholds

| Rule                                      | Threshold                        | Recommendation          |
|-------------------------------------------|----------------------------------|-------------------------|
| Cursor Business → Pro                     | seats ≤ 5                        | Downgrade to Pro        |
| ChatGPT Team → Plus                       | seats < 3                        | Use individual Plus     |
| ChatGPT Enterprise → Team                 | seats < 10                       | Downgrade to Team       |
| Claude Max → Pro                          | seats ≤ 3, non-power use         | Downgrade to Pro        |
| Copilot Enterprise → Business             | seats < 8                        | Downgrade to Business   |
| GitHub Enterprise → Team                  | seats < 10                       | Downgrade to Team       |
| Duplicate coding assistants               | Cursor + Copilot both active     | Consolidate to one      |
| Duplicate AI assistants                   | ChatGPT + Claude both active     | Consolidate to one      |
| AI tool sprawl                            | 4+ paid tools, team ≤ 5         | Usage audit recommended |
