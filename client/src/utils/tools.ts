export interface ToolPlan {
  value: string;
  label: string;
  pricePerSeat: number;
}

export interface ToolDefinition {
  id: string;
  name: string;
  category: string;
  plans: ToolPlan[];
}

export const TOOLS: ToolDefinition[] = [
  {
    id: 'cursor',
    name: 'Cursor',
    category: 'coding',
    plans: [
      { value: 'hobby', label: 'Hobby (Free)', pricePerSeat: 0 },
      { value: 'pro', label: 'Pro — $20/seat', pricePerSeat: 20 },
      { value: 'business', label: 'Business — $40/seat', pricePerSeat: 40 },
      { value: 'enterprise', label: 'Enterprise — $60/seat', pricePerSeat: 60 },
    ],
  },
  {
    id: 'github_copilot',
    name: 'GitHub Copilot',
    category: 'coding',
    plans: [
      { value: 'individual', label: 'Individual — $10/seat', pricePerSeat: 10 },
      { value: 'business', label: 'Business — $19/seat', pricePerSeat: 19 },
      { value: 'enterprise', label: 'Enterprise — $39/seat', pricePerSeat: 39 },
    ],
  },
  {
    id: 'claude',
    name: 'Claude (Anthropic)',
    category: 'writing,research,coding',
    plans: [
      { value: 'free', label: 'Free', pricePerSeat: 0 },
      { value: 'pro', label: 'Pro — $20/seat', pricePerSeat: 20 },
      { value: 'max', label: 'Max — $100/seat', pricePerSeat: 100 },
      { value: 'max_200', label: 'Max 200 — $200/seat', pricePerSeat: 200 },
      { value: 'team', label: 'Team — $30/seat', pricePerSeat: 30 },
      { value: 'enterprise', label: 'Enterprise — custom', pricePerSeat: 50 },
      { value: 'api', label: 'API Direct', pricePerSeat: 0 },
    ],
  },
  {
    id: 'chatgpt',
    name: 'ChatGPT (OpenAI)',
    category: 'writing,research,coding',
    plans: [
      { value: 'free', label: 'Free', pricePerSeat: 0 },
      { value: 'plus', label: 'Plus — $20/seat', pricePerSeat: 20 },
      { value: 'team', label: 'Team — $30/seat', pricePerSeat: 30 },
      { value: 'enterprise', label: 'Enterprise — custom', pricePerSeat: 60 },
      { value: 'api', label: 'API Direct', pricePerSeat: 0 },
    ],
  },
  {
    id: 'anthropic_api',
    name: 'Anthropic API',
    category: 'coding,research',
    plans: [
      { value: 'api', label: 'API Direct (pay per token)', pricePerSeat: 0 },
    ],
  },
  {
    id: 'openai_api',
    name: 'OpenAI API',
    category: 'coding,research',
    plans: [
      { value: 'api', label: 'API Direct (pay per token)', pricePerSeat: 0 },
    ],
  },
  {
    id: 'gemini',
    name: 'Google Gemini',
    category: 'writing,research,coding',
    plans: [
      { value: 'free', label: 'Free', pricePerSeat: 0 },
      { value: 'advanced', label: 'Advanced — $19.99/seat', pricePerSeat: 19.99 },
      { value: 'business', label: 'Business — $24/seat', pricePerSeat: 24 },
      { value: 'enterprise', label: 'Enterprise — $36/seat', pricePerSeat: 36 },
      { value: 'api', label: 'API Direct', pricePerSeat: 0 },
    ],
  },
  {
    id: 'windsurf',
    name: 'Windsurf (Codeium)',
    category: 'coding',
    plans: [
      { value: 'free', label: 'Free', pricePerSeat: 0 },
      { value: 'pro', label: 'Pro — $15/seat', pricePerSeat: 15 },
      { value: 'teams', label: 'Teams — $35/seat', pricePerSeat: 35 },
      { value: 'enterprise', label: 'Enterprise — custom', pricePerSeat: 50 },
    ],
  },
]

export const USE_CASES = [
  { value: 'coding', label: 'Software Development / Coding' },
  { value: 'writing', label: 'Writing & Content Creation' },
  { value: 'data', label: 'Data Analysis' },
  { value: 'research', label: 'Research' },
  { value: 'mixed', label: 'Mixed / General' },
]
