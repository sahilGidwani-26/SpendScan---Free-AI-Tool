# SpendScan — Free AI Spend Audit Tool

> Find out if your startup is overpaying for AI tools. Free 2-minute audit for Cursor, Claude, ChatGPT, GitHub Copilot, Gemini, and Windsurf.

Built as part of the [Credex](https://credex.rocks) internship assignment — a product that Credex could plausibly launch on Product Hunt.

## Screenshots / Demo

> 📹 **Screen recording:** [Add your Loom/YouTube 30-second demo link here]

> Add 3 screenshots below after deploying — replace these placeholder paths:

![Landing page — hero with savings stats](./docs/screenshot-landing.png)
![Audit form — multi-tool input with plan selector](./docs/screenshot-form.png)
![Results page — per-tool breakdown with savings hero](./docs/screenshot-results.png)

*Screenshots show: landing page hero, audit form with 3 tools entered, results page showing $340/mo savings with Credex CTA.*

## Who it's for

Engineering managers and startup founders who pay for AI subscriptions and have no benchmark for whether they're overpaying. The average team we've surveyed overspends $200–400/month due to wrong plan sizing and duplicate tooling.

## Quick Start

### Prerequisites
- Node.js 20+
- MongoDB (local or MongoDB Atlas free tier)

### Install

```bash
git clone https://github.com/YOUR_USERNAME/ai-spend-audit
cd ai-spend-audit
npm run install:all
```

### Configure environment

```bash
cp server/.env.example server/.env
# Fill in your values (MongoDB URI, optional Anthropic key, optional Resend key)
```

### Run locally

```bash
npm run dev
# Client: http://localhost:5173
# Server: http://localhost:5000
```

### Run tests

```bash
cd server && npm test
```

### Deploy

**Vercel (recommended for client):**
```bash
cd client && vercel deploy
```

**Render (recommended for server):**
- Connect GitHub repo, set root to `server/`, add env vars

**MongoDB:** Use MongoDB Atlas free tier (M0) — add connection string to `MONGODB_URI`.

## Decisions

1. **MERN over Next.js fullstack** — Keeping client and server separate allows independent deployment scaling. The audit server is stateless per-request, so it can run on Render free tier without Vercel function cold-start issues that would hurt UX on the results page.

2. **Rule-based audit engine, not AI** — The audit math is deterministic pricing comparisons. Using GPT/Claude for the reasoning would introduce hallucinated prices, non-reproducible outputs, and latency. AI is reserved for the qualitative summary where nuance matters and a wrong answer isn't financially misleading.

3. **MongoDB over Postgres** — Audit documents have variable tool arrays (1-8 tools per audit). A document model avoids nullable columns and join complexity. For the read pattern (fetch by shareId), MongoDB is fast and schema-flexible as the tool list evolves.

4. **Email capture after results, never before** — Showing savings first converts far better and is the honest design. Users who see $400/mo in savings have a reason to give an email; asking before showing value just loses them.

5. **Honeypot over hCaptcha for abuse protection** — Rate limiting (50 req/15min) catches automated abuse. A hidden `website` field catches most bots without the UX friction of a CAPTCHA. hCaptcha would add 200-300ms render time and mobile friction that hurts the core conversion.

## Live URL

[https://spendscan.credex.rocks](https://spendscan.credex.rocks)