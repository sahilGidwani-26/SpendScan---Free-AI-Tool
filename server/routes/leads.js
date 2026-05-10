const express = require("express");
const router = express.Router();
const validator = require("validator");
const Lead = require("../models/Lead");
const Audit = require("../models/Audit");
const { sendAuditEmail } = require("../utils/emailService");

/**
 * POST /api/leads
 * Capture lead email after showing audit results.
 * Honeypot: reject if 'website' field is filled (bot trap).
 */
router.post("/", async (req, res) => {
  try {
    const { shareId, email, companyName, role, teamSize, website } = req.body;

    // Honeypot check
    if (website && website.trim() !== "") {
      // Silently accept to not tip off bots
      return res.status(200).json({ success: true });
    }

    // Validate email
    if (!email || !validator.isEmail(email)) {
      return res.status(400).json({ error: "Valid email is required." });
    }

    if (!shareId) {
      return res.status(400).json({ error: "Audit ID is required." });
    }

    // Find audit
    const audit = await Audit.findOne({ shareId });
    if (!audit) {
      return res.status(404).json({ error: "Audit not found." });
    }

    const highSavings = audit.totalMonthlySavings >= 500;

    // Upsert lead
    const lead = await Lead.findOneAndUpdate(
      { email: email.toLowerCase(), shareId },
      {
        auditId: audit._id,
        shareId,
        email: email.toLowerCase(),
        companyName: companyName || "",
        role: role || "",
        teamSize: teamSize || audit.teamSize,
        totalMonthlySavings: audit.totalMonthlySavings,
        totalAnnualSavings: audit.totalAnnualSavings,
        highSavings,
      },
      { upsert: true, new: true, runValidators: true }
    );

    // Mark audit as lead-captured (store email on audit doc)
    await Audit.findByIdAndUpdate(audit._id, {
      leadCaptured: true,
      email: email.toLowerCase(),
      companyName: companyName || "",
      role: role || "",
    });

    // Send transactional email
    const shareUrl = `${process.env.CLIENT_URL || "http://localhost:5173"}/audit/${shareId}`;
    await sendAuditEmail({
      to: email,
      companyName,
      totalMonthlySavings: audit.totalMonthlySavings,
      shareUrl,
      highSavings,
    });

    await Lead.findByIdAndUpdate(lead._id, { emailSent: true });

    res.json({
      success: true,
      highSavings,
      message: highSavings
        ? "Audit saved! Credex will reach out within 2 business days."
        : "Audit saved! We'll notify you when new optimizations apply.",
    });
  } catch (err) {
    if (err.code === 11000) {
      // Duplicate — already captured, still return success
      return res.json({ success: true, message: "Already subscribed for this audit." });
    }
    console.error("Lead capture error:", err);
    res.status(500).json({ error: "Failed to save lead. Please try again." });
  }
});

module.exports = router;
