import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { TOOLS, USE_CASES } from '../utils/tools'
import { createAudit, type ToolInput } from '../utils/api'

const STORAGE_KEY = 'spendscan_form_v1'

interface ToolEntry {
  id: string
  toolId: string
  plan: string
  monthlySpend: string
  seats: string
  useCase: string
}

const defaultEntry = (): ToolEntry => ({
  id: Math.random().toString(36).slice(2),
  toolId: '',
  plan: '',
  monthlySpend: '',
  seats: '1',
  useCase: 'mixed',
})

export default function AuditForm() {
  const navigate = useNavigate()
  const [teamSize, setTeamSize] = useState('5')
  const [primaryUseCase, setPrimaryUseCase] = useState('mixed')
  const [tools, setTools] = useState<ToolEntry[]>([defaultEntry()])
  const [loading, setLoading] = useState(false)

  // Load persisted state
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.teamSize) setTeamSize(parsed.teamSize)
        if (parsed.primaryUseCase) setPrimaryUseCase(parsed.primaryUseCase)
        if (parsed.tools?.length) setTools(parsed.tools)
      }
    } catch {}
  }, [])

  // Persist on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ teamSize, primaryUseCase, tools }))
    } catch {}
  }, [teamSize, primaryUseCase, tools])

  const updateTool = (id: string, field: keyof ToolEntry, value: string) => {
    setTools((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t
        const updated = { ...t, [field]: value }
        // Auto-set plan when tool changes
        if (field === 'toolId') {
          const toolDef = TOOLS.find((td) => td.id === value)
          updated.plan = toolDef?.plans[0]?.value || ''
        }
        return updated
      })
    )
  }

  const addTool = () => {
    if (tools.length >= 8) return
    setTools((prev) => [...prev, defaultEntry()])
  }

  const removeTool = (id: string) => {
    if (tools.length === 1) return
    setTools((prev) => prev.filter((t) => t.id !== id))
  }

  const getPlansForTool = (toolId: string) => {
    return TOOLS.find((t) => t.id === toolId)?.plans || []
  }

  const getExpectedSpend = (entry: ToolEntry): number | null => {
    const toolDef = TOOLS.find((t) => t.id === entry.toolId)
    const planDef = toolDef?.plans.find((p) => p.value === entry.plan)
    if (!planDef || planDef.pricePerSeat === 0) return null
    return planDef.pricePerSeat * parseInt(entry.seats || '1')
  }

  const handleSubmit = async () => {
    // Validate
    const validTools = tools.filter((t) => t.toolId && t.plan)
    if (validTools.length === 0) {
      toast.error('Add at least one tool to audit.')
      return
    }
    if (!teamSize || parseInt(teamSize) < 1) {
      toast.error('Enter your team size.')
      return
    }

    const payload: ToolInput[] = validTools.map((t) => ({
      toolId: t.toolId,
      toolName: TOOLS.find((td) => td.id === t.toolId)?.name || t.toolId,
      plan: t.plan,
      monthlySpend: parseFloat(t.monthlySpend) || 0,
      seats: parseInt(t.seats) || 1,
      useCase: t.useCase || primaryUseCase,
    }))

    setLoading(true)
    try {
      const result = await createAudit({
        tools: payload,
        teamSize: parseInt(teamSize),
        primaryUseCase,
      })
      localStorage.removeItem(STORAGE_KEY)
      navigate(`/audit/${result.shareId}`, { state: result })
    } catch (err: any) {
      toast.error(err?.response?.data?.error || 'Something went wrong. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-paper pb-24">
      {/* Header */}
      <div className="border-b border-gray-100 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <a href="/" className="font-display font-bold text-xl text-ink">SpendScan</a>
          <span className="text-sm text-gray-500">Free AI spend audit</span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 pt-12">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display font-bold text-4xl text-ink mb-2">Audit your AI spend</h1>
          <p className="text-gray-600 mb-10">Add the AI tools your team pays for. Takes 2 minutes.</p>
        </motion.div>

        {/* Team basics */}
        <div className="card mb-6">
          <h2 className="font-display font-bold text-lg mb-4">Your team</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Total team size</label>
              <input
                type="number"
                min="1"
                value={teamSize}
                onChange={(e) => setTeamSize(e.target.value)}
                className="input-field"
                placeholder="e.g. 8"
              />
            </div>
            <div>
              <label className="label">Primary use case</label>
              <select
                value={primaryUseCase}
                onChange={(e) => setPrimaryUseCase(e.target.value)}
                className="input-field"
              >
                {USE_CASES.map((uc) => (
                  <option key={uc.value} value={uc.value}>{uc.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Tool entries */}
        <div className="space-y-4 mb-6">
          <h2 className="font-display font-bold text-lg">AI tools you pay for</h2>
          <AnimatePresence>
            {tools.map((entry, idx) => {
              const plans = getPlansForTool(entry.toolId)
              const expectedSpend = getExpectedSpend(entry)
              const actualSpend = parseFloat(entry.monthlySpend) || 0
              const isOverpaying = expectedSpend !== null && actualSpend > expectedSpend * 1.05

              return (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="card relative"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-gray-500">Tool {idx + 1}</span>
                    {tools.length > 1 && (
                      <button
                        onClick={() => removeTool(entry.id)}
                        className="text-xs text-gray-400 hover:text-crimson transition-colors"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="label">Tool</label>
                      <select
                        value={entry.toolId}
                        onChange={(e) => updateTool(entry.id, 'toolId', e.target.value)}
                        className="input-field"
                      >
                        <option value="">Select a tool...</option>
                        {TOOLS.map((t) => (
                          <option key={t.id} value={t.id}>{t.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="label">Plan</label>
                      <select
                        value={entry.plan}
                        onChange={(e) => updateTool(entry.id, 'plan', e.target.value)}
                        className="input-field"
                        disabled={!entry.toolId}
                      >
                        <option value="">Select plan...</option>
                        {plans.map((p) => (
                          <option key={p.value} value={p.value}>{p.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="label">Monthly spend ($)</label>
                      <input
                        type="number"
                        min="0"
                        value={entry.monthlySpend}
                        onChange={(e) => updateTool(entry.id, 'monthlySpend', e.target.value)}
                        className={`input-field ${isOverpaying ? 'border-amber-400' : ''}`}
                        placeholder="0"
                      />
                      {isOverpaying && (
                        <p className="text-xs text-amber-600 mt-1">
                          Expected ~${expectedSpend}/mo
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="label">Seats / licenses</label>
                      <input
                        type="number"
                        min="1"
                        value={entry.seats}
                        onChange={(e) => updateTool(entry.id, 'seats', e.target.value)}
                        className="input-field"
                        placeholder="1"
                      />
                    </div>
                    <div>
                      <label className="label">Use case</label>
                      <select
                        value={entry.useCase}
                        onChange={(e) => updateTool(entry.id, 'useCase', e.target.value)}
                        className="input-field"
                      >
                        {USE_CASES.map((uc) => (
                          <option key={uc.value} value={uc.value}>{uc.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>

          {tools.length < 8 && (
            <button
              onClick={addTool}
              className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-sm text-gray-500 hover:border-sage-400 hover:text-sage-600 transition-colors"
            >
              + Add another tool
            </button>
          )}
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="btn-primary w-full py-4 text-base rounded-xl disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Running audit...
            </span>
          ) : (
            'Run my free audit →'
          )}
        </button>
        <p className="text-center text-xs text-gray-400 mt-3">No email required. Results shown instantly.</p>
      </div>
    </div>
  )
}
