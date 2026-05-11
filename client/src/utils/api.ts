import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL as string,
  timeout: 30000,
})

export interface ToolInput {
  toolId: string
  toolName: string
  plan: string
  monthlySpend: number
  seats: number
  useCase: string
}

export interface AuditResult {
  toolId: string
  toolName: string
  currentPlan: string
  currentSpend: number
  recommendedAction: string
  recommendedPlan: string
  recommendedTool: string
  savings: number
  annualSavings: number
  reason: string
  severity: 'optimal' | 'minor' | 'moderate' | 'significant'
}

export interface AuditResponse {
  shareId: string
  results: AuditResult[]
  totalMonthlySavings: number
  totalAnnualSavings: number
  teamSize: number
  primaryUseCase: string
}

export const createAudit = async (payload: {
  tools: ToolInput[]
  teamSize: number
  primaryUseCase: string
}): Promise<AuditResponse> => {
  const { data } = await api.post('/audit', payload)
  return data
}

export const getAudit = async (shareId: string): Promise<AuditResponse & { aiSummary?: string }> => {
  const { data } = await api.get(`/audit/${shareId}`)
  return data
}

export const generateSummary = async (shareId: string): Promise<{ summary: string; fallback: boolean }> => {
  const { data } = await api.post(`/summary/${shareId}`)
  return data
}

export const captureLead = async (payload: {
  shareId: string
  email: string
  companyName?: string
  role?: string
  teamSize?: number
  website?: string // honeypot
}): Promise<{ success: boolean; highSavings: boolean; message: string }> => {
  const { data } = await api.post('/leads', payload)
  return data
}
