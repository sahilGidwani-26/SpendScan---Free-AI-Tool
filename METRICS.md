# METRICS

## North Star Metric

**Qualified leads captured per week**

Definition: A lead is "qualified" if `totalMonthlySavings >= $100` — meaning the audit found real actionable savings. Low-savings users are still tracked but aren't the primary conversion target for Credex credit sales.

Why this metric: It's the direct input to Credex's revenue pipeline. Everything else is a leading indicator for this.

---

## Funnel metrics to track

| Metric | Where measured | Target (month 1) |
|--------|---------------|-----------------|
| Landing page visits | Plausible Analytics (privacy-first, no cookies) | 500/week |
| Audit form started | MongoDB: audit docs created with 0 results | 45% of visitors |
| Audit completed | MongoDB: audit docs with results populated | 75% of starters |
| Email captured | MongoDB: leads collection count | 20% of completers |
| High-savings leads ($500+/mo) | MongoDB: `highSavings: true` in leads | 30% of leads |
| Credex consultation booked | Calendly embed or manual tracking | 15% of high-savings |
| Share URL clicked | Simple click counter on share button | 10% of completers |

---

## MongoDB queries for weekly review

```js
// Total audits this week
db.audits.countDocuments({ createdAt: { $gte: new Date(Date.now() - 7*24*60*60*1000) } })

// Total leads this week
db.leads.countDocuments({ createdAt: { $gte: new Date(Date.now() - 7*24*60*60*1000) } })

// High-savings leads
db.leads.countDocuments({ highSavings: true, createdAt: { $gte: ... } })

// Average monthly savings across audits
db.audits.aggregate([
  { $match: { totalMonthlySavings: { $gt: 0 } } },
  { $group: { _id: null, avg: { $avg: "$totalMonthlySavings" } } }
])

// Most common tools submitted
db.audits.aggregate([
  { $unwind: "$tools" },
  { $group: { _id: "$tools.toolId", count: { $sum: 1 } } },
  { $sort: { count: -1 } }
])

// Most common recommended actions
db.audits.aggregate([
  { $unwind: "$results" },
  { $match: { "results.savings": { $gt: 0 } } },
  { $group: { _id: "$results.recommendedAction", count: { $sum: 1 } } }
])
```

---

## Dashboard plan

Week 1: Manual MongoDB queries run weekly, pasted into a Notion doc.
Week 4+: If getting 500+ audits/week, build a simple `/admin` Express route that returns aggregate stats (password-protected with a hardcoded env var). Render as a basic HTML table — not worth building a React dashboard at this scale.

---

## Leading indicator: audit completion rate

If completion rate drops below 60%, the form has too much friction. Levers:
- Reduce required fields (drop "use case" per-tool, use team-level default)
- Autofill plan from common plans
- Show a "preview" of what results look like before form is complete

---

## What we are NOT tracking (and why)

- **Time on page** — vanity metric at this stage
- **Bounce rate** — not actionable without segmentation
- **Social shares from our side** — tracking clicks on our share button tells us engagement but we can't track what people do with the URL after

We're not using Google Analytics because (1) GDPR risk adds legal overhead at MVP stage, (2) Plausible gives us the funnel data we need without cookie consent banners that hurt conversion.
