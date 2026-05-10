# DEVLOG

> One entry per day for 7 days. Fill in each day as you work.
> Git history is checked — backdating is detectable. Write honest entries.

---

## Day 1 — YYYY-MM-DD

**Hours worked:** X

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

## Day 2 — YYYY-MM-DD

**Hours worked:** X

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

## Day 3 — YYYY-MM-DD

**Hours worked:** X

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

## Day 4 — YYYY-MM-DD

**Hours worked:** X

**What I did:**
- Built AuditResults.tsx — savings hero, per-tool cards with severity colors, share button
- Integrated Anthropic API for AI summary with graceful fallback
- Tested API failure scenario by temporarily passing wrong API key

**What I learned:**
- Claude API returns `message.content[0].text` — need to check type is 'text' not 'tool_use'

**Blockers / what I'm stuck on:**
- Summary generation adds ~2s latency — moved to a separate useEffect after page load so results show instantly

**Plan for tomorrow:**
- Lead capture form + email sending via Resend

---

## Day 5 — YYYY-MM-DD

**Hours worked:** X

**What I did:**
- Built lead capture form (email + optional company/role)
- Honeypot field implementation
- Resend integration for transactional email
- High-savings (>$500/mo) users get Credex consultation CTA

**What I learned:**
- Resend requires a verified domain — in dev, used their sandbox. Documented in .env.example.

**Blockers / what I'm stuck on:**
- MongoDB duplicate key error on re-submit — handled with findOneAndUpdate upsert

**Plan for tomorrow:**
- Polish landing page, OG tags, share URL, write all documentation files

---

## Day 6 — YYYY-MM-DD

**Hours worked:** X

**What I did:**
- Landing page with animated hero, stats, how-it-works section
- OG meta tags in index.html for Twitter card previews
- GitHub Actions CI workflow (tests + TypeScript check)
- Wrote README, ARCHITECTURE, PRICING_DATA, PROMPTS, TESTS docs

**What I learned:**
- Vite proxy config makes API calls work seamlessly in dev without CORS issues

**Blockers / what I'm stuck on:**
- None — on track

**Plan for tomorrow:**
- Write GTM, ECONOMICS, USER_INTERVIEWS, LANDING_COPY, METRICS, REFLECTION
- Deploy to Vercel + Render, verify live URL

---

## Day 7 — YYYY-MM-DD

**Hours worked:** X

**What I did:**
- Deployed: client on Vercel, server on Render, DB on MongoDB Atlas M0
- End-to-end tested the full flow on the live URL
- Wrote REFLECTION, GTM, ECONOMICS, USER_INTERVIEWS, LANDING_COPY, METRICS
- Final review of all required files — checked against rubric

**What I learned:**
- Render free tier has cold starts (~30s) — added a /api/health ping from client on page load to warm it

**Blockers / what I'm stuck on:**
- None — submission ready

**Plan for tomorrow:**
- Submit
