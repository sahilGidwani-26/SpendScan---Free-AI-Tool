const mongoose = require("mongoose");

const toolInputSchema = new mongoose.Schema({
  toolId: { type: String, required: true },
  toolName: { type: String, required: true },
  plan: { type: String, required: true },
  monthlySpend: { type: Number, required: true, min: 0 },
  seats: { type: Number, required: true, min: 1 },
  useCase: { type: String, required: true },
});

const auditResultSchema = new mongoose.Schema({
  toolId: String,
  toolName: String,
  currentPlan: String,
  currentSpend: Number,
  recommendedAction: String,
  recommendedPlan: String,
  recommendedTool: String,
  savings: Number,
  annualSavings: Number,
  reason: String,
  severity: { type: String, enum: ["optimal", "minor", "moderate", "significant"] },
});

const auditSchema = new mongoose.Schema(
  {
    shareId: { type: String, unique: true, required: true },
    teamSize: { type: Number, required: true, min: 1 },
    primaryUseCase: { type: String, required: true },
    tools: [toolInputSchema],
    results: [auditResultSchema],
    totalMonthlySavings: { type: Number, default: 0 },
    totalAnnualSavings: { type: Number, default: 0 },
    aiSummary: { type: String, default: "" },
    summaryFallback: { type: Boolean, default: false },
    // Lead info - stripped from public view
    email: { type: String, default: null, select: false },
    companyName: { type: String, default: null, select: false },
    role: { type: String, default: null, select: false },
    leadCaptured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Index for quick shareId lookup
auditSchema.index({ shareId: 1 });
auditSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Audit", auditSchema);
