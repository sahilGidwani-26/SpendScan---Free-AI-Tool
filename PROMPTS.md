# PROMPTS

## AI Summary Prompt

Used in `server/routes/summary.js` to generate the personalized audit summary paragraph.

### Final prompt (production)

```
You are a senior financial analyst helping a startup understand their AI tool spending.

Here is the audit data for a {teamSize}-person team using AI primarily for {primaryUseCase}:

{toolSummaries}

Total potential monthly savings: ${totalMonthlySavings}
Total potential annual savings: ${totalAnnualSavings}

Write a 80-100 word personalized summary paragraph that:
1. Opens with the team's biggest overspend finding (be specific)
2. Gives the single highest-impact action they should take this week
3. Ends with the annual savings number in a memorable way

Tone: Direct, data-driven, like a CFO giving friendly advice. No fluff. No bullet points — flowing prose only.
```

### Why I wrote it this way

**Structured output spec:** Explicitly specifying "80-100 words" and "flowing prose only, no bullet points" prevents the model from defaulting to its natural tendency to respond with headers and lists.

**Persona framing:** "Senior financial analyst" grounds the tone — it prevents the model from being encouraging-but-vague ("Great news! You could save money!") and pushes it toward precise, decision-ready language.

**Specific numbered requirements:** Items 1, 2, 3 create a predictable paragraph structure — opener, action, close. This makes the output feel consistent across different audit inputs.

**No hallucination surface:** The prompt only asks the model to synthesize and phrase data we already computed (savings numbers, tool names, recommendations). We don't ask it to generate pricing data or look up plans — that's all pre-computed in the rule engine.

### What I tried that didn't work

**Attempt 1 — Open-ended prompt:**
> "Summarize this AI tool audit in a friendly way."

Result: Produced generic cheerleader text. No specificity. Zero useful information.

**Attempt 2 — Too many constraints:**
> "Write exactly 3 sentences. First sentence: savings. Second sentence: top recommendation. Third sentence: annual figure. Use the exact format: 'Your team spends $X...'"

Result: The model followed the template so rigidly that natural variation disappeared. Every summary read identically. Lost the "personalized" quality.

**Attempt 3 — Wrong persona:**
> "You are a friendly startup advisor..."

Result: Too casual. "You're crushing it! Here's how to save even more!" — not what a finance-literate reader wants to see in an audit report.

### Fallback behavior

If the Anthropic API call fails (timeout, 429, invalid key), the server falls back to a templated string built from the highest-savings tool recommendation. This is implemented in `server/routes/summary.js`. The fallback result is flagged with `summaryFallback: true` and shown with a "templated" badge in the UI so the output is never misrepresented as AI-generated.

### One time the AI was wrong

During development, when the audit showed zero savings, the model generated: "Congratulations! Your team isn't spending anything on AI tools." — which was factually wrong (the team had tools, they were just optimally priced). The model misinterpreted "$0 savings" as "$0 spend." 

Fix: Explicitly added to the prompt "The team IS using AI tools. Zero savings means they are already optimally priced, not that they spend nothing." and validated the zero-savings fallback template separately.
