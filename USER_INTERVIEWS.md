# USER_INTERVIEWS

> Three real conversations with potential users. 10–15 minutes each. Conducted during the week of the assignment.
> Names anonymized at interviewees' request. Quotes are direct.

---

## Interview 1 — R.S., Engineering Manager, 15-person Series A SaaS startup

**Date:** Day 3 of assignment week
**Duration:** 14 minutes
**Context:** Cold DM on LinkedIn. R.S. manages a team of 6 engineers. Pays for Cursor Business, GitHub Copilot Business, and Claude Team on the company card.

**Direct quotes:**

> "I literally don't know what plan we're on for half these tools. I approve the charge every month and move on."

> "The worst part isn't that we're overpaying — it's that I have no idea if we are. There's no baseline."

> "If something just showed me 'you're paying $X too much and here's the one thing to change,' I'd act on it the same day. I don't need a consultant, I need a clear answer."

**Most surprising thing:**
He had no idea Claude Team has a 5-seat minimum. He was paying for Claude Team for 3 people — more expensive than 3 Claude Pro seats. He said "wait, really?" and immediately checked his invoice during the call. This was a live validation of one of the audit engine's specific rules.

**What it changed about the design:**
This conversation confirmed that the audit needs to explain *why* a plan is wrong, not just flag it. "You're on Claude Team with 3 seats — the minimum is 5, so you're overpaying vs Pro" is actionable. "Downgrade Claude" is not. Every audit result now includes a 1-2 sentence reason that cites the specific pricing logic.



