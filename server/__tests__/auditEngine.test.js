/**
 * TESTS — Audit Engine
 * Run with: npm test (from /server directory)
 * All 10 tests cover the audit engine logic specifically.
 */

const { runAudit, evaluateTool } = require("../utils/auditEngine");

// ── Test 1: Cursor Business with small team should recommend Pro downgrade ──
test("Cursor Business with 3 seats should recommend downgrade to Pro", () => {
  const result = evaluateTool({
    toolId: "cursor",
    toolName: "Cursor",
    plan: "business",
    monthlySpend: 120, // 3 seats × $40
    seats: 3,
    useCase: "coding",
  }, 3);

  expect(result.recommendedAction).toBe("downgrade");
  expect(result.recommendedPlan).toBe("pro");
  expect(result.savings).toBe(60); // 3 × ($40-$20)
  expect(result.severity).toBe("minor");
});

// ── Test 2: GitHub Copilot Individual for 1 developer is optimal ──
test("GitHub Copilot Individual for 1 developer should be optimal", () => {
  const result = evaluateTool({
    toolId: "github_copilot",
    toolName: "GitHub Copilot",
    plan: "individual",
    monthlySpend: 10,
    seats: 1,
    useCase: "coding",
  }, 5);

  expect(result.recommendedAction).toBe("keep");
  expect(result.savings).toBe(0);
  expect(result.severity).toBe("optimal");
});

// ── Test 3: Claude Team with only 2 users should recommend Pro ──
test("Claude Team with 2 seats should recommend downgrade to Pro", () => {
  const result = evaluateTool({
    toolId: "claude",
    toolName: "Claude",
    plan: "team",
    monthlySpend: 60, // 2 × $30
    seats: 2,
    useCase: "writing",
  }, 2);

  expect(result.recommendedAction).toBe("downgrade");
  expect(result.recommendedPlan).toBe("pro");
  expect(result.savings).toBe(20); // 2 × ($30-$20)
});

// ── Test 4: ChatGPT Team with 1 user should suggest Plus ──
test("ChatGPT Team with 1 seat should recommend Plus downgrade", () => {
  const result = evaluateTool({
    toolId: "chatgpt",
    toolName: "ChatGPT",
    plan: "team",
    monthlySpend: 30,
    seats: 1,
    useCase: "research",
  }, 1);

  expect(result.recommendedAction).toBe("downgrade");
  expect(result.recommendedPlan).toBe("plus");
  expect(result.savings).toBe(10);
});

// ── Test 5: High API spend should trigger optimization recommendation ──
test("High Anthropic API spend ($800/mo) should recommend cost optimization", () => {
  const result = evaluateTool({
    toolId: "anthropic_api",
    toolName: "Anthropic API",
    plan: "api",
    monthlySpend: 800,
    seats: 1,
    useCase: "coding",
  }, 5);

  expect(result.recommendedAction).toBe("optimize");
  expect(result.savings).toBeGreaterThan(0);
  expect(result.severity).toBe("significant");
});

// ── Test 6: runAudit total savings calculation ──
test("runAudit should correctly sum savings across all tools", () => {
  const tools = [
    { toolId: "cursor", toolName: "Cursor", plan: "business", monthlySpend: 120, seats: 3, useCase: "coding" },
    { toolId: "chatgpt", toolName: "ChatGPT", plan: "team", monthlySpend: 30, seats: 1, useCase: "writing" },
  ];

  const { totalMonthlySavings, totalAnnualSavings } = runAudit(tools, 5, "coding");

  expect(totalMonthlySavings).toBe(70); // 60 (cursor) + 10 (chatgpt)
  expect(totalAnnualSavings).toBe(840); // 70 × 12
});

// ── Test 7: Windsurf Pro for coding should be marked optimal ──
test("Windsurf Pro for coding use case should be optimal", () => {
  const result = evaluateTool({
    toolId: "windsurf",
    toolName: "Windsurf",
    plan: "pro",
    monthlySpend: 15,
    seats: 1,
    useCase: "coding",
  }, 3);

  expect(result.severity).toBe("optimal");
  expect(result.savings).toBe(0);
});

// ── Test 8: Cursor for writing use case should recommend Claude ──
test("Cursor used for writing should recommend switching to Claude Pro", () => {
  const result = evaluateTool({
    toolId: "cursor",
    toolName: "Cursor",
    plan: "pro",
    monthlySpend: 60,
    seats: 3,
    useCase: "writing",
  }, 3);

  expect(result.recommendedAction).toBe("switch");
  expect(result.recommendedTool).toBe("Claude Pro");
  expect(result.savings).toBeGreaterThan(0);
});

// ── Test 9: Gemini Enterprise small team should suggest Business ──
test("Gemini Enterprise with 5 seats should recommend Business downgrade", () => {
  const result = evaluateTool({
    toolId: "gemini",
    toolName: "Gemini",
    plan: "enterprise",
    monthlySpend: 180, // 5 × $36
    seats: 5,
    useCase: "research",
  }, 5);

  expect(result.recommendedAction).toBe("downgrade");
  expect(result.recommendedPlan).toBe("business");
  expect(result.savings).toBe(60); // 5 × ($36-$24)
});

// ── Test 10: runAudit returns correct result count ──
test("runAudit should return one result per tool submitted", () => {
  const tools = [
    { toolId: "cursor", toolName: "Cursor", plan: "pro", monthlySpend: 20, seats: 1, useCase: "coding" },
    { toolId: "claude", toolName: "Claude", plan: "pro", monthlySpend: 20, seats: 1, useCase: "writing" },
    { toolId: "gemini", toolName: "Gemini", plan: "free", monthlySpend: 0, seats: 1, useCase: "research" },
  ];

  const { results } = runAudit(tools, 3, "mixed");
  expect(results).toHaveLength(3);
});
