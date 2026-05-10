const express = require("express");
const router = express.Router();
const Audit = require("../models/Audit");

/**
 * POST /api/summary/:shareId
 * Generate or retrieve AI summary for an audit.
 * Falls back to templated summary if API fails.
 */
router.post("/:shareId", async (req, res) => {
  try {
    const audit = await Audit.findOne({ shareId: req.params.shareId });
    if (!audit) return res.status(404).json({ error: "Audit not found." });

    // Return cached summary if exists
    if (audit.aiSummary) {
      return res.json({ summary: audit.aiSummary, fallback: audit.summaryFallback });
    }

    const { results, totalMonthlySavings, totalAnnualSavings, teamSize, primaryUseCase } = audit;

    // Build context for the prompt
    const toolSummaries = results.map((r) => {
      const action = r.savings > 0
        ? `overspending by $${r.savings}/mo — recommend ${r.recommendedAction} to ${r.recommendedTool} ${r.recommendedPlan}`
        : `spending optimally`;
      return `${r.toolName} (${r.currentPlan}): ${action}`;
    }).join("\n");

    const prompt = `You are a senior financial analyst helping a startup understand their AI tool spending.

Here is the audit data for a ${teamSize}-person team using AI primarily for ${primaryUseCase}:

${toolSummaries}

Total potential monthly savings: $${totalMonthlySavings}
Total potential annual savings: $${totalAnnualSavings}

Write a 80-100 word personalized summary paragraph that:
1. Opens with the team's biggest overspend finding (be specific)
2. Gives the single highest-impact action they should take this week
3. Ends with the annual savings number in a memorable way

Tone: Direct, data-driven, like a CFO giving friendly advice. No fluff. No bullet points — flowing prose only.`;

    // Smart templated summary — no paid API needed
    let summary = "";
    const fallback = true;

    const significantTools = results.filter((r) => r.savings > 0).sort((a, b) => b.savings - a.savings);
    const topSaving = significantTools[0] || results[0];
    const actionMap = { downgrade: "downgrading", switch: "switching", optimize: "optimizing usage of", keep: "keeping" };

    if (totalMonthlySavings > 0) {
      const topAction = actionMap[topSaving.recommendedAction] || "reviewing";
      const secondLine = significantTools.length > 1
        ? ` Two more tools have smaller but stackable savings — ${significantTools.slice(1).map(r => r.toolName).join(" and ")} together add another $${significantTools.slice(1).reduce((s, r) => s + r.savings, 0)}/mo.`
        : "";
      const hireMonths = Math.round(totalAnnualSavings / 4000);
      summary = `Your highest-impact move this week: ${topAction} ${topSaving.toolName} — ${topSaving.reason.split(".")[0].toLowerCase()}. That alone saves $${topSaving.savings}/month.${secondLine} In total, your ${teamSize}-person team is leaving $${totalAnnualSavings.toLocaleString()} on the table annually — that's ${hireMonths > 0 ? `${hireMonths} months of a junior hire` : "real runway"} going to waste.`;
    } else {
      const toolNames = results.map((r) => r.toolName).join(", ");
      summary = `Your ${teamSize}-person team is running a lean, well-optimized AI stack for ${primaryUseCase} work. Every tool — ${toolNames} — is right-sized for your current usage patterns. Revisit this audit when your team grows beyond ${teamSize + 5} people or when you add new subscriptions; that's when overspend quietly creeps in.`;
    }

    // Cache in DB
    await Audit.findByIdAndUpdate(audit._id, { aiSummary: summary, summaryFallback: fallback });

    res.json({ summary, fallback });
  } catch (err) {
    console.error("Summary error:", err);
    res.status(500).json({ error: "Failed to generate summary." });
  }
});

module.exports = router;