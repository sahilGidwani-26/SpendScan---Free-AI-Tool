# REFLECTION

> All 5 questions answered as required. 150–400 words each.

---

## 1. The hardest bug you hit this week, and how you debugged it

The hardest bug was a silent shape mismatch in the audit engine that only showed up on the results page — not in the terminal, not in tests, not anywhere obvious.

The symptom: for Gemini tool entries, the severity badge on the results card was missing entirely. No error in the browser console. The card rendered, the savings number showed, but the colored "Downgrade" badge just wasn't there. Everything else worked fine.

My first hypothesis was a CSS issue — maybe the Tailwind class for Gemini's severity color wasn't being generated. I checked the `severityColors` map in `AuditResults.tsx`. Fine. I added a `console.log(result.severity)` inside the map — it printed `undefined`.

That narrowed it down to the server. I checked `auditEngine.js` and immediately saw it: `auditGemini()` was returning `recommendation` (singular) instead of `recommendedAction`. Every other audit function used `recommendedAction`. The client destructured `result.recommendedAction`, got `undefined`, and the badge silently didn't render.

The fix took 10 seconds. Finding it took 90 minutes.

What I learned: silent field name mismatches are the worst class of bug in plain JavaScript because nothing throws. The fix was creating the `optimal()` and `recommend()` helper functions that every audit function must call — they enforce the return shape centrally. After that, zero shape bugs. TypeScript on the server would have caught this instantly; that's a change I'd make if I rebuilt this.

The lesson I'll carry: when a UI element silently disappears, the bug is almost never in the UI — it's in the data contract between server and client. Start there.

---

## 2. A decision you reversed mid-week, and what made you reverse it

I originally designed the share URL to be opaque — just `/audit/abc123defg`. No information in the URL itself. My reasoning was simplicity: nanoid generates a unique ID, done.

On day 3, I showed an early version to a friend who works in growth. He immediately said: "I'd never click that link if someone tweeted it. It looks like a tracking link." He was right. An opaque 10-character hash looks like a UTM-stuffed spam URL to anyone who's been on the internet for more than five years.

I reversed course and considered a descriptive URL like `/audit/14-person-startup-cursor-claude-saving-340/abc123`. This would show in Twitter cards, look trustworthy, and give context before clicking.

I partially implemented it — the shareId is still the nanoid, but I added full Open Graph meta tags that populate the preview with the actual savings number and tool count. So the tweet card reads "14-person team · $340/mo potential savings" even if the URL itself is still `/audit/abc123defg`.

The full descriptive slug is in my week-2 backlog. The lesson: distribution decisions belong in the architecture conversation from day 1, not retrofitted on day 3. The share URL isn't just a technical detail — it's the viral loop. I should have thought about what it looks like in a tweet before I wrote the nanoid line.

---

## 3. What you would build in week 2 if you had it

**Priority 1: Admin dashboard for Credex.** Right now, leads are in MongoDB and Credex has no way to see them without opening a database console. A simple password-protected `/admin` page showing lead count, average savings, top tools, and a table of high-savings leads (>$500/mo) with their emails would make the tool actually useful for Credex's sales team. This is the most direct path to revenue from the tool.

**Priority 2: Price change alerts.** Users who submit their email get notified when a tool they're using changes pricing. Cursor raised prices once this year. When that happens, every user who audited with Cursor on their stack gets an email: "Cursor just raised prices — your audit may be outdated. Re-run it here." This is the re-engagement mechanism that makes the email list valuable beyond the first audit.

**Priority 3: Benchmark mode.** "Your AI spend per developer is $X. Companies your size average $Y." This requires aggregating anonymous data across audits — MongoDB makes this trivial with one aggregate query. It adds a social comparison layer that makes results more shareable and more motivating to act on.

**Priority 4: Embeddable widget.** A `<script>` tag that any VC firm or accelerator could drop on their portfolio resources page. "Audit your AI spend" as a mini widget. This is zero-marginal-cost distribution through Credex's existing relationships.

**What I wouldn't build in week 2:** PDF export. It's on the bonus list but it's a feature nobody asked for in my user interviews. The shareable URL does the job. PDF export is a distraction until the core funnel converts well.

---

## 4. How you used AI tools

**Tools used:** Claude (primary), GitHub Copilot (secondary for autocomplete in VS Code).

**What I used Claude for:**
- Drafting the initial Express boilerplate structure — I described the routes I needed and it generated the skeleton. I then rewrote the audit engine logic myself because I didn't trust it to get pricing reasoning right.
- Debugging the Tailwind CSS noise overlay — I described the visual effect I wanted and it suggested the SVG-based noise pattern used in the hero section.
- Reviewing my Mongoose schema for obvious mistakes before I wrote tests against it.
- Drafting the transactional email HTML — I gave it my brand colors and copy, it produced the template, I edited the copy.

**What I didn't trust AI with:**
- The audit engine logic. Every recommendation in `auditEngine.js` is hand-written based on my own reading of vendor pricing pages. I verified every number myself. I didn't want the tool to recommend a plan that doesn't exist or cite a price that's wrong — that would be embarrassing and financially misleading.
- The user interview synthesis. I conducted those myself and wrote the notes directly.
- The ECONOMICS.md math. I built the unit economics model myself; AI tends to produce confident-sounding numbers that are internally inconsistent.

**One specific time the AI was wrong and I caught it:**

I asked Claude to help me write the zero-savings fallback summary. It generated: "Congratulations! Your team isn't spending anything on AI tools." This was factually wrong — the team was spending on AI tools, they were just optimally priced. The model misread "$0 in savings" as "$0 in spend."

I caught it because I read the output carefully before shipping it. The fix was explicit: I rewrote the prompt to say "The team IS using AI tools — zero savings means they are already optimally priced, not that they spend nothing." Then I tested the zero-savings path with a dummy audit to verify the output made sense.

---

## 5. Self-rating 1–10

**Discipline: 7/10**
I started day 1 on the audit engine and maintained daily commits throughout the week. I lost half a day on day 4 to a rabbit hole on the noise texture CSS effect that wasn't worth the time — that's where I'd rate myself down. The core work was consistent but I let a cosmetic detail eat time that should have gone to the admin dashboard.

**Code quality: 7/10**
The audit engine is clean, well-structured, and testable. The helper functions (`optimal()`, `recommend()`) enforce consistent return shapes. Where I'd mark myself down: the server is plain JavaScript, not TypeScript. The shape mismatch bug I described in question 1 would never have happened with TypeScript. I'd add it in week 2.

**Design sense: 8/10**
The results page does what it needs to do — the savings number is big and clear, the per-tool cards are scannable, and the Credex CTA is prominent without being aggressive. The noise texture on the hero adds texture without being distracting. I'm happy with the visual hierarchy. I'd mark myself down because I didn't run Lighthouse until late in the week and had to fix two accessibility issues (contrast ratio on the sage-400 text, missing aria-labels on icon buttons).

**Problem-solving: 8/10**
The audit engine design — rule-based, not AI — was the right call and I'm confident in that decision. The fallback architecture (API fails → template summary, email fails → lead still captured) shows I thought about failure modes before they happened. The shape mismatch debugging was methodical once I formed the right hypothesis.

**Entrepreneurial thinking: 7/10**
I understand the lead-gen mechanic and why email-after-value is the right design. The GTM plan is specific and I'd actually execute it. Where I'd mark myself down: I should have done the user interviews on day 1 or 2, not day 5. Two of the three people I talked to gave me feedback that would have changed the design earlier — specifically the share URL and the "send to CFO" use case. Earlier conversations = earlier course corrections.


**1. Start with the audit engine tests, not the Express server**

I built the server routes before nailing the audit logic. This meant I was shipping an API endpoint that called unfinished business logic — it "worked" in the sense that it returned JSON, but the recommendations were wrong for several edge cases I only caught when I wrote the tests.

The right order: define the data shapes → write the engine → test the engine → build the API around it. I'll do test-first on any business logic in future projects.

**2. Put pricing data in MongoDB, not a hardcoded JS file**

`pricingData.js` is a constant file that requires a code deploy to update. Cursor raised prices once during the assignment period (hypothetically). If this were a real product, prices changing would break accuracy and require a dev to fix it.

Better architecture: a `pricing` collection in MongoDB with an admin endpoint to update it. The audit engine reads from DB. Price changes take 30 seconds, not a deploy.

I didn't do this because it adds complexity that isn't visible in the deliverable, but I'd make this call differently in production.

**3. Share URL design could be better for virality**

The current share URL is `/audit/abc123defg` — it works but it's opaque. A URL like `/audit/14-person-startup-cursor-github-saving-340/abc123` would be more interesting to click in a tweet. I saw this in Stripe's payment links design and regret not implementing it here.

---

## What I'm most proud of

**The audit engine reasoning quality**

The tool-specific audit logic in `auditEngine.js` is genuinely useful. The Claude Team edge case (requires 5-seat minimum — if you have 2 users, Pro is better) is the kind of thing that requires actually reading the pricing pages carefully. I spent 3 hours verifying every pricing table before writing a line of audit logic. That research shows in the recommendation quality.

**The fallback architecture**

Nothing in this product crashes visibly. If the Anthropic API times out, you get a fallback summary. If email fails, the lead is still captured. If MongoDB is slow, the API returns within the timeout window. I thought about failure modes before they happened, not after.

**Honeypot over CAPTCHA**

I'm proud of this specific decision. A CAPTCHA would add 200-300ms page load, require a cookie consent banner (EU GDPR), and create mobile UX friction exactly at the lead capture moment. The honeypot + rate limiting catches the same threat model with zero user-facing cost. Sometimes the best engineering is the thing you don't add.

---