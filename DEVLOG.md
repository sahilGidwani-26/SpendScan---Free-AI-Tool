# DEVLOG

> One entry per day for 7 days. Fill in each day as you work.
> Git history is checked — backdating is detectable. Write honest entries.

---

## Day 1 — 2026-05-07

**Hours worked:** 2

**What I did:**
- Set up MERN project structure (server + client), configured Vite + Tailwind
- Defined all 8 tool definitions in `tools.ts` with plan/pricing data
- Built the Express skeleton with `/api/audit`, `/api/leads`, `/api/summary` routes
- Created MongoDB Audit and Lead schemas

**What I learned:**
- nanoid v3 uses CommonJS require() in Node — needed to pin to v3 instead of v5 ESM
- Mongoose `.select('-email')` strips fields from reads cleanly

**Blockers / what I'm stuck on:**
- Deciding on audit engine structure: flat switch vs strategy pattern

**Plan for tomorrow:**
- Implement the full audit engine logic for all 8 tools
- Write tests for the engine before building the React form

---

## Day 2 — 2026-05-08

**Hours worked:** 1

**What I did:**
- Built `auditEngine.js` with per-tool audit functions
- Wrote 10 Jest tests covering all major audit cases
- All tests passing

**What I learned:**
- Writing tests first forced me to make each audit function return a consistent shape
- GitHub Copilot Business at $19/seat is only $9 more than Individual — the ROI calculation only tips for 10+ users

**Blockers / what I'm stuck on:**
- The Gemini pricing tiers are confusing (Workspace vs consumer) — made an assumption documented in PRICING_DATA.md

**Plan for tomorrow:**
- Build the React audit form with tool entry rows and localStorage persistence

---

## Day 3 — 2026-05-09

**Hours worked:** 3

**What I did:**
- Built AuditForm.tsx with dynamic tool entry rows (add/remove up to 8)
- LocalStorage persistence for form state across reloads
- Auto-populates default plan when tool is selected
- Shows expected spend vs entered spend as validation hint

**What I learned:**
- React state with array of objects needs stable IDs (Math.random key) to avoid re-render issues on remove

**Blockers / what I'm stuck on:**
- Framer motion AnimatePresence for removing rows had a bug — fixed by keying on entry.id not index

**Plan for tomorrow:**
- Build the results page with per-tool breakdown and savings hero

---

## Day 4 — 2026-05-10

**Hours worked:** 5

**What I did:**
- Built AuditResults.tsx — savings hero, per-tool cards with severity colors, share button
- Integrated Anthropic API for AI summary with graceful fallback
- Tested API failure scenario by temporarily passing wrong API key
- Built lead capture form (email + optional company/role)
- Honeypot field implementation
- Resend integration for transactional email
- Landing page with animated hero, stats, how-it-works section
- OG meta tags in index.html for Twitter card previews
- GitHub Actions CI workflow (tests + TypeScript check)
- Wrote README, ARCHITECTURE, PRICING_DATA, PROMPTS, TESTS docs
- Deployed: client on Vercel, server on Render, DB on MongoDB Atlas M0
- End-to-end tested the full flow on the live URL
- Wrote REFLECTION, GTM, ECONOMICS, USER_INTERVIEWS, LANDING_COPY, METRICS
- Final review of all required files — checked against rubric
- Resend requires a verified domain — in dev, used their sandbox. Documented in .env



**What I learned:**
- Claude API returns `message.content[0].text` — need to check type is 'text' not 'tool_use'
- High-savings (>$500/mo) users get Credex consultation CTA
- Vite proxy config makes API calls work seamlessly in dev without CORS issues
- Render free tier has cold starts (~30s) — added a /api/health ping from client on page load to warm it


**Blockers / what I'm stuck on:**
- Summary generation adds ~2s latency — moved to a separate useEffect after page load so results show instantly
- MongoDB duplicate key error on re-submit — handled with findOneAndUpdate upsert
- None — on track
- None — submission ready



**Plan for tomorrow:**
- Submit



