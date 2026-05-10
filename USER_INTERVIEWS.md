# USER_INTERVIEWS

## Interview 1 — Engineering Manager, 15-person Series A startup

**Background:** Manages a team of 6 engineers. Pays for Cursor Business, GitHub Copilot Business, and Claude Team.

**Key quotes:**
- "I don't even know what plan we're on for half these tools. I just approve the card charge every month."
- "The worst part is I know we're probably overpaying but I don't have time to go compare every plan."
- "If something just told me 'you're paying $X too much and here's how to fix it' I'd act on it same day."

**Pain discovered:** Tool sprawl — 3 coding AI tools for 6 engineers, with partial overlap in functionality.

**What they'd pay for:** Nothing (free is right). But they'd happily book a Credex consultation if shown $400+/mo in savings.

---

## Interview 2 — Solo founder / indie hacker

**Background:** Building a SaaS, paying for ChatGPT Plus and Claude Pro personally.

**Key quotes:**
- "I have both because I use them for different things but I genuinely don't know if that's rational."
- "Claude is better for writing, GPT is better for... I think? I'm not sure anymore."
- "I'd love something that just tells me: keep both, drop one, or switch."

**Pain discovered:** Duplicate subscription uncertainty — paying for two competing products, unsure if there's a meaningful difference for their use case.

**What they'd do:** Would share the audit result on Twitter/Indie Hackers if it gave them a clear answer they agreed with.

---

## Interview 3 — CTO, 40-person company

**Background:** Multiple departments using AI — engineering, marketing, ops.

**Key quotes:**
- "Marketing is paying for ChatGPT Team, engineering has Claude Enterprise, and I found out last month that ops was separately expensing ChatGPT Plus on their own cards."
- "We're definitely paying for overlapping things. I just can't see it in one place."
- "I'd want to share this with my CFO. If it has a shareable URL that'd be useful."

**Pain discovered:** Cross-department visibility — no central view of AI spend.

**Key feature request that shaped product:** Shareable URL — the CTO wanted to send the audit to their CFO. This is why shareId/public URL was a priority feature, not an afterthought.

---

## What changed based on interviews

1. **Shareable URL was deprioritized in my original spec** — I was going to make it a "nice to have." The CTO interview made it clear it's a core use case (send to CFO/finance). Moved it to MVP.

2. **"Wrong use case" recommendation added** — The indie hacker interview revealed a common pattern: someone using Cursor for non-coding tasks. Added the use-case check to the audit engine that catches this.

3. **Email capture positioned as "get this report" not "sign up"** — Early framing was "join our newsletter." The engineering manager interview revealed they hate that. Changed copy to "Send this audit to my email" — it's about saving the result, not joining a list.
