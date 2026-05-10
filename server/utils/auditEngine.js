/**
 * auditEngine.js
 * Core audit logic — rule-based, no AI.
 * Each recommendation is defensible and cites specific pricing data.
 */

const PRICING = require("./pricingData");

/**
 * Evaluate a single tool entry and return a recommendation.
 * @param {Object} toolInput - { toolId, toolName, plan, monthlySpend, seats, useCase }
 * @param {number} teamSize - Total team size
 * @returns {Object} audit result
 */
function evaluateTool(toolInput, teamSize) {
  const { toolId, toolName, plan, monthlySpend, seats, useCase } = toolInput;
  const pricingInfo = PRICING[toolId];

  if (!pricingInfo) {
    return {
      toolId,
      toolName,
      currentPlan: plan,
      currentSpend: monthlySpend,
      recommendedAction: "review",
      recommendedPlan: plan,
      recommendedTool: toolName,
      savings: 0,
      annualSavings: 0,
      reason: "No pricing data available for this tool.",
      severity: "optimal",
    };
  }

  const currentPlanData = pricingInfo.plans[plan];
  const expectedSpend = currentPlanData ? currentPlanData.pricePerSeat * seats : monthlySpend;

  // Check if they're overpaying vs plan price (e.g., inflated seats)
  const overpayingVsPlan = monthlySpend > expectedSpend * 1.1 && expectedSpend > 0;

  // Run tool-specific audit logic
  return runToolAudit({ toolId, toolName, plan, monthlySpend, seats, useCase, teamSize, expectedSpend, overpayingVsPlan, pricingInfo });
}

function runToolAudit(params) {
  const { toolId, toolName, plan, monthlySpend, seats, useCase, teamSize, expectedSpend, pricingInfo } = params;

  switch (toolId) {
    case "cursor":
      return auditCursor(params);
    case "github_copilot":
      return auditGithubCopilot(params);
    case "claude":
      return auditClaude(params);
    case "chatgpt":
      return auditChatGPT(params);
    case "anthropic_api":
    case "openai_api":
      return auditAPIUsage(params);
    case "gemini":
      return auditGemini(params);
    case "windsurf":
      return auditWindsurf(params);
    default:
      return genericAudit(params);
  }
}

function auditCursor(p) {
  const { plan, monthlySpend, seats, useCase, teamSize } = p;

  // Cursor Pro for 1-2 coding users is right-sized
  if (plan === "hobby") {
    return optimal(p, "Cursor Hobby covers basic completions. Good choice if usage is light.");
  }

  // Business plan requires at least 20 seats to make sense vs Pro
  if (plan === "business" && seats < 10) {
    const proSpend = 20 * seats;
    const savings = monthlySpend - proSpend;
    if (savings > 0) {
      return recommend(p, "downgrade", "pro", "Cursor", savings,
        `Business plan ($40/seat) is designed for teams needing centralized billing and admin features. With ${seats} seats, Pro ($20/seat) delivers identical AI features at half the cost. Switch to Pro and save $${savings}/mo.`);
    }
  }

  // Non-coding use case with Cursor
  if (!useCase.includes("coding") && useCase !== "mixed") {
    const savings = monthlySpend * 0.7;
    return recommend(p, "switch", "pro", "Claude Pro", savings,
      `Cursor is purpose-built for code editing. For ${useCase} tasks, Claude Pro ($20/seat) provides better writing and research capability at ${Math.round((savings / monthlySpend) * 100)}% less cost.`);
  }

  if (plan === "enterprise" && seats < 50) {
    const businessSpend = 40 * seats;
    const savings = monthlySpend - businessSpend;
    if (savings > 0) {
      return recommend(p, "downgrade", "business", "Cursor", savings,
        `Enterprise tier is cost-effective only at 50+ seats. At ${seats} seats, Business plan provides admin controls and team features at $${savings}/mo savings.`);
    }
  }

  return optimal(p, `Cursor ${plan} is appropriately sized for your ${seats}-seat coding team.`);
}

function auditGithubCopilot(p) {
  const { plan, monthlySpend, seats, useCase, teamSize } = p;

  // Individual vs Business comparison
  if (plan === "business" && seats <= 3) {
    const individualSpend = 10 * seats;
    const savings = monthlySpend - individualSpend;
    if (savings > 0) {
      return recommend(p, "downgrade", "individual", "GitHub Copilot", savings,
        `GitHub Copilot Business ($19/seat) adds org-level policy controls and audit logs — useful at 10+ users. With ${seats} developers, Individual ($10/seat) covers all AI features: completions, chat, and PR summaries. Save $${savings}/mo.`);
    }
  }

  // Enterprise overkill check
  if (plan === "enterprise" && seats < 25) {
    const businessSpend = 19 * seats;
    const savings = monthlySpend - businessSpend;
    if (savings > 0) {
      return recommend(p, "downgrade", "business", "GitHub Copilot", savings,
        `Copilot Enterprise adds fine-tuned models on your codebase — cost-effective at 25+ engineers. At ${seats} seats, Business tier provides identical day-to-day features at $${savings}/mo less.`);
    }
  }

  // Compare with Cursor for heavy coding teams
  if (plan === "business" && seats >= 5 && useCase === "coding") {
    const cursorProSpend = 20 * seats;
    const savings = monthlySpend - cursorProSpend;
    if (savings < 0) {
      // Copilot is actually cheaper
      return optimal(p, `GitHub Copilot Business ($19/seat) is cost-competitive for ${seats} developers. It integrates natively into VS Code, JetBrains, and Neovim without IDE lock-in.`);
    }
  }

  return optimal(p, `GitHub Copilot ${plan} is appropriately sized for your ${seats}-developer team.`);
}

function auditClaude(p) {
  const { plan, monthlySpend, seats, useCase } = p;

  // Team plan requires 5-seat minimum — if fewer, Pro is correct
  if (plan === "team" && seats < 5) {
    const proSpend = 20 * seats;
    const savings = monthlySpend - proSpend;
    if (savings > 0) {
      return recommend(p, "downgrade", "pro", "Claude", savings,
        `Claude Team requires a 5-seat minimum ($30/seat) but adds shared Projects and admin — overkill for ${seats} users. Pro ($20/seat) with individual logins covers the same AI capability. Save $${savings}/mo.`);
    }
  }

  // Max plan — only justified if hitting Pro limits regularly
  if (plan === "max" && seats > 1) {
    const teamSpend = 30 * seats;
    if (teamSpend < monthlySpend) {
      const savings = monthlySpend - teamSpend;
      return recommend(p, "switch", "team", "Claude", savings,
        `Claude Max ($100/seat) provides 5x usage limits — justified for one or two power users but expensive at scale. For ${seats} seats, Team ($30/seat) with shared usage pools offers better economics. Potential saving: $${savings}/mo.`);
    }
  }

  // API direct might be cheaper for systematic usage
  if ((plan === "pro" || plan === "team") && useCase === "coding" && seats >= 3) {
    return {
      ...optimal(p, `Claude ${plan} is a reasonable choice.`),
      reason: `Claude ${plan} is right-sized. Consider Anthropic API direct if your team is doing systematic/automated tasks — token pricing can be 40-60% cheaper at scale for programmatic workflows.`,
    };
  }

  return optimal(p, `Claude ${plan} is well-matched to your ${seats}-person ${useCase} team.`);
}

function auditChatGPT(p) {
  const { plan, monthlySpend, seats, useCase } = p;

  // Team plan minimum 2 seats — check if Plus would suffice
  if (plan === "team" && seats <= 2) {
    const plusSpend = 20 * seats;
    const savings = monthlySpend - plusSpend;
    if (savings > 0) {
      return recommend(p, "downgrade", "plus", "ChatGPT", savings,
        `ChatGPT Team ($30/seat) adds workspace management and higher rate limits — warranted at 5+ users. For ${seats} users, Plus ($20/seat) covers GPT-4o, DALL-E, and code interpreter identically. Save $${savings}/mo.`);
    }
  }

  // Compare with Claude for writing use case
  if (useCase === "writing" && (plan === "plus" || plan === "team")) {
    const claudeProSpend = 20 * seats;
    const savings = monthlySpend - claudeProSpend;
    if (savings <= 0) {
      return {
        ...optimal(p, `ChatGPT ${plan} is price-competitive for writing tasks.`),
        reason: `ChatGPT ${plan} and Claude Pro are price-equivalent for writing. Claude consistently scores higher on long-form writing quality benchmarks — worth A/B testing with your team before renewal.`,
      };
    }
  }

  if (plan === "enterprise" && seats < 150) {
    const teamSpend = 30 * seats;
    const savings = monthlySpend - teamSpend;
    if (savings > 20) {
      return recommend(p, "downgrade", "team", "ChatGPT", savings,
        `ChatGPT Enterprise ($60/seat) provides SSO, audit logs, and custom GPTs — useful at 150+ users. At ${seats} seats, Team plan covers GPT-4o, custom instructions, and expanded rate limits at $${savings}/mo savings.`);
    }
  }

  return optimal(p, `ChatGPT ${plan} is appropriately sized for your ${seats}-person team.`);
}

function auditAPIUsage(p) {
  const { toolId, monthlySpend, seats, useCase } = p;
  const toolName = toolId === "anthropic_api" ? "Anthropic API" : "OpenAI API";
  const altName = toolId === "anthropic_api" ? "OpenAI API" : "Anthropic API";

  // High API spend — suggest cost optimization
  if (monthlySpend > 500) {
    return {
      toolId: p.toolId,
      toolName,
      currentPlan: "api",
      currentSpend: monthlySpend,
      recommendedAction: "optimize",
      recommendedPlan: "api",
      recommendedTool: toolName,
      savings: Math.round(monthlySpend * 0.3),
      annualSavings: Math.round(monthlySpend * 0.3 * 12),
      reason: `At $${monthlySpend}/mo on ${toolName}, prompt caching alone typically cuts costs 30-60%. Evaluate: (1) enable prompt caching for repeated system prompts, (2) downsize to a smaller model for classification/routing tasks, (3) batch non-realtime jobs using the Batch API at 50% discount.`,
      severity: "significant",
    };
  }

  if (monthlySpend > 100) {
    return {
      toolId: p.toolId,
      toolName,
      currentPlan: "api",
      currentSpend: monthlySpend,
      recommendedAction: "optimize",
      recommendedPlan: "api",
      recommendedTool: toolName,
      savings: Math.round(monthlySpend * 0.2),
      annualSavings: Math.round(monthlySpend * 0.2 * 12),
      reason: `$${monthlySpend}/mo on ${toolName}. Audit your model selection — switching non-critical tasks from the flagship model to a smaller model (e.g., Haiku vs Sonnet) cuts per-token cost by 20-30x with minimal quality loss for routing/classification tasks.`,
      severity: "moderate",
    };
  }

  return optimal(p, `${toolName} spend at $${monthlySpend}/mo is within expected range. Monitor monthly for usage spikes.`);
}

function auditGemini(p) {
  const { plan, monthlySpend, seats, useCase } = p;

  if (plan === "free") return optimal(p, "Gemini Free is optimal — no spend.");

  if (plan === "enterprise" && seats < 50) {
    const businessSpend = 24 * seats;
    const savings = monthlySpend - businessSpend;
    if (savings > 0) {
      return recommend(p, "downgrade", "business", "Gemini", savings,
        `Gemini Enterprise ($36/seat) unlocks advanced security, Meet AI, and custom data controls. At ${seats} seats, Business ($24/seat) covers Gemini Advanced and most productivity integrations at $${savings}/mo less.`);
    }
  }

  // Compare against Claude/ChatGPT for specific use cases
  if (useCase === "coding" && (plan === "advanced" || plan === "business")) {
    return {
      ...optimal(p, `Gemini ${plan} is priced reasonably.`),
      reason: `Gemini ${plan} is cost-competitive, but for pure coding tasks Cursor ($20/seat) or GitHub Copilot ($10/seat) offer native IDE integration and code-specific fine-tuning that general-purpose Gemini doesn't match at similar price points.`,
    };
  }

  return optimal(p, `Gemini ${plan} is appropriate for ${seats} users on ${useCase} tasks.`);
}

function auditWindsurf(p) {
  const { plan, monthlySpend, seats, useCase } = p;

  if (plan === "free") return optimal(p, "Windsurf Free is optimal — no spend.");

  if (!useCase.includes("coding") && useCase !== "mixed") {
    const savings = monthlySpend;
    return recommend(p, "switch", "pro", "Claude Pro", savings,
      `Windsurf is a coding IDE extension. For ${useCase} work, Claude Pro ($20/seat) provides direct AI assistance without a coding-focused interface.`);
  }

  // Compare Windsurf Pro vs Cursor Pro
  if (plan === "pro") {
    return {
      ...optimal(p, "Windsurf Pro is priced competitively."),
      reason: `Windsurf Pro ($15/seat) undercuts Cursor Pro ($20/seat) by 25%. Both offer comparable AI completions. Keep Windsurf if your team prefers its UX — you're already on the cost-efficient option.`,
    };
  }

  return optimal(p, `Windsurf ${plan} is reasonable for your ${seats}-person coding team.`);
}

function genericAudit(p) {
  return optimal(p, `${p.toolName} spend of $${p.monthlySpend}/mo appears reasonable based on available data.`);
}

// --- Helpers ---

function optimal(p, reason) {
  return {
    toolId: p.toolId,
    toolName: p.toolName,
    currentPlan: p.plan,
    currentSpend: p.monthlySpend,
    recommendedAction: "keep",
    recommendedPlan: p.plan,
    recommendedTool: p.toolName,
    savings: 0,
    annualSavings: 0,
    reason,
    severity: "optimal",
  };
}

function recommend(p, action, recommendedPlan, recommendedTool, savings, reason) {
  const s = Math.max(0, Math.round(savings));
  let severity = "minor";
  if (s > 500) severity = "significant";
  else if (s > 100) severity = "moderate";

  return {
    toolId: p.toolId,
    toolName: p.toolName,
    currentPlan: p.plan,
    currentSpend: p.monthlySpend,
    recommendedAction: action,
    recommendedPlan,
    recommendedTool,
    savings: s,
    annualSavings: s * 12,
    reason,
    severity,
  };
}

/**
 * Run a full audit on all tools submitted
 */
function runAudit(tools, teamSize, primaryUseCase) {
  const results = tools.map((tool) =>
    evaluateTool({ ...tool, useCase: tool.useCase || primaryUseCase }, teamSize)
  );

  const totalMonthlySavings = results.reduce((sum, r) => sum + r.savings, 0);
  const totalAnnualSavings = totalMonthlySavings * 12;

  return { results, totalMonthlySavings, totalAnnualSavings };
}

module.exports = { runAudit, evaluateTool };
