const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema(
  {
    auditId: { type: mongoose.Schema.Types.ObjectId, ref: "Audit" },
    shareId: { type: String, required: true },
    email: { type: String, required: true },
    companyName: { type: String, default: "" },
    role: { type: String, default: "" },
    teamSize: { type: Number },
    totalMonthlySavings: { type: Number },
    totalAnnualSavings: { type: Number },
    highSavings: { type: Boolean, default: false },
    emailSent: { type: Boolean, default: false },
    source: { type: String, default: "organic" },
    // Honeypot field — should always be empty
    website: { type: String, default: "" },
  },
  { timestamps: true }
);

leadSchema.index({ email: 1, shareId: 1 }, { unique: true });

module.exports = mongoose.model("Lead", leadSchema);
