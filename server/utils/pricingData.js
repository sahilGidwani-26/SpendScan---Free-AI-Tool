/**
 * PRICING_DATA.js
 * All pricing sourced from official vendor pages.
 * See PRICING_DATA.md for full URLs and verification dates.
 * Last verified: 2026-05-09
 */

const PRICING = {
  cursor: {
    name: "Cursor",
    category: "coding",
    plans: {
      hobby: { label: "Hobby", pricePerSeat: 0, description: "Free tier" },
      pro: { label: "Pro", pricePerSeat: 20, description: "$20/user/mo" },
      business: { label: "Business", pricePerSeat: 40, description: "$40/user/mo" },
      enterprise: { label: "Enterprise", pricePerSeat: 60, description: "Custom ~$60/user/mo" },
    },
  },
  github_copilot: {
    name: "GitHub Copilot",
    category: "coding",
    plans: {
      individual: { label: "Individual", pricePerSeat: 10, description: "$10/user/mo" },
      business: { label: "Business", pricePerSeat: 19, description: "$19/user/mo" },
      enterprise: { label: "Enterprise", pricePerSeat: 39, description: "$39/user/mo" },
    },
  },
  claude: {
    name: "Claude (Anthropic)",
    category: "writing,research,coding",
    plans: {
      free: { label: "Free", pricePerSeat: 0, description: "Free tier" },
      pro: { label: "Pro", pricePerSeat: 20, description: "$20/user/mo" },
      max: { label: "Max", pricePerSeat: 100, description: "$100/user/mo (5x usage)" },
      max_200: { label: "Max 200", pricePerSeat: 200, description: "$200/user/mo (20x usage)" },
      team: { label: "Team", pricePerSeat: 30, description: "$30/user/mo (min 5 seats)" },
      enterprise: { label: "Enterprise", pricePerSeat: 50, description: "Custom ~$50/user/mo" },
      api: { label: "API Direct", pricePerSeat: 0, description: "Pay per token" },
    },
  },
  chatgpt: {
    name: "ChatGPT (OpenAI)",
    category: "writing,research,coding",
    plans: {
      free: { label: "Free", pricePerSeat: 0, description: "Free tier" },
      plus: { label: "Plus", pricePerSeat: 20, description: "$20/user/mo" },
      team: { label: "Team", pricePerSeat: 30, description: "$30/user/mo (min 2 seats)" },
      enterprise: { label: "Enterprise", pricePerSeat: 60, description: "Custom ~$60/user/mo" },
      api: { label: "API Direct", pricePerSeat: 0, description: "Pay per token" },
    },
  },
  anthropic_api: {
    name: "Anthropic API",
    category: "coding,research",
    plans: {
      api: { label: "API Direct", pricePerSeat: 0, description: "Pay per token (variable)" },
    },
  },
  openai_api: {
    name: "OpenAI API",
    category: "coding,research",
    plans: {
      api: { label: "API Direct", pricePerSeat: 0, description: "Pay per token (variable)" },
    },
  },
  gemini: {
    name: "Google Gemini",
    category: "writing,research,coding",
    plans: {
      free: { label: "Free", pricePerSeat: 0, description: "Free tier" },
      advanced: { label: "Advanced", pricePerSeat: 19.99, description: "$19.99/user/mo" },
      business: { label: "Business", pricePerSeat: 24, description: "$24/user/mo" },
      enterprise: { label: "Enterprise", pricePerSeat: 36, description: "$36/user/mo" },
      api: { label: "API Direct", pricePerSeat: 0, description: "Pay per token" },
    },
  },
  windsurf: {
    name: "Windsurf (Codeium)",
    category: "coding",
    plans: {
      free: { label: "Free", pricePerSeat: 0, description: "Free tier" },
      pro: { label: "Pro", pricePerSeat: 15, description: "$15/user/mo" },
      teams: { label: "Teams", pricePerSeat: 35, description: "$35/user/mo" },
      enterprise: { label: "Enterprise", pricePerSeat: 50, description: "Custom ~$50/user/mo" },
    },
  },
};

module.exports = PRICING;
