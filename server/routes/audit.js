const express = require("express");
const router = express.Router();
const { nanoid } = require("nanoid");
const Audit = require("../models/Audit");
const { runAudit } = require("../utils/auditEngine");

/**
 * POST /api/audit
 * Create a new audit from form input
 */
router.post("/", async (req, res) => {
  try {
    const { tools, teamSize, primaryUseCase } = req.body;

    // Basic validation
    if (!tools || !Array.isArray(tools) || tools.length === 0) {
      return res.status(400).json({ error: "At least one tool is required." });
    }
    if (!teamSize || teamSize < 1) {
      return res.status(400).json({ error: "Team size must be at least 1." });
    }
    if (!primaryUseCase) {
      return res.status(400).json({ error: "Primary use case is required." });
    }

    // Run the audit engine
    const { results, totalMonthlySavings, totalAnnualSavings } = runAudit(tools, teamSize, primaryUseCase);

    // Generate unique share ID
    const shareId = nanoid(10);

    // Save to MongoDB
    const audit = await Audit.create({
      shareId,
      teamSize,
      primaryUseCase,
      tools,
      results,
      totalMonthlySavings,
      totalAnnualSavings,
    });

    res.status(201).json({
      shareId: audit.shareId,
      results: audit.results,
      totalMonthlySavings: audit.totalMonthlySavings,
      totalAnnualSavings: audit.totalAnnualSavings,
      teamSize: audit.teamSize,
      primaryUseCase: audit.primaryUseCase,
    });
  } catch (err) {
    console.error("Audit creation error:", err);
    res.status(500).json({ error: "Failed to create audit. Please try again." });
  }
});

/**
 * GET /api/audit/:shareId
 * Retrieve a public audit by share ID (no PII)
 */
router.get("/:shareId", async (req, res) => {
  try {
    const audit = await Audit.findOne({ shareId: req.params.shareId }).select(
      "-email -companyName -role -__v"
    );

    if (!audit) {
      return res.status(404).json({ error: "Audit not found." });
    }

    res.json(audit);
  } catch (err) {
    console.error("Audit fetch error:", err);
    res.status(500).json({ error: "Failed to retrieve audit." });
  }
});

module.exports = router;
