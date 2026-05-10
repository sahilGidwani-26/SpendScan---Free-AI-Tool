import { useState, useEffect } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { getAudit, generateSummary, captureLead, type AuditResponse, type AuditResult } from '../utils/api'

const severityColors = {
  optimal: 'bg-sage-50 border-sage-200 text-sage-600',
  minor: 'bg-amber-50 border-amber-200 text-amber-700',
  moderate: 'bg-orange-50 border-orange-200 text-orange-700',
  significant: 'bg-red-50 border-red-200 text-red-700',
}

const actionLabels: Record<string, string> = {
  keep: '✓ Optimal',
  downgrade: '↓ Downgrade',
  switch: '⇄ Switch tool',
  optimize: '⚙ Optimize usage',
  review: '? Review',
}

export default function AuditResults() {
  const { shareId } = useParams<{ shareId: string }>()
  const location = useLocation()
  const navigate = useNavigate()

  const [audit, setAudit] = useState<AuditResponse | null>(location.state as AuditResponse || null)
  const [summary, setSummary] = useState('')
  const [summaryFallback, setSummaryFallback] = useState(false)
  const [summaryLoading, setSummaryLoading] = useState(false)

  const [email, setEmail] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [role, setRole] = useState('')
  const [website, setWebsite] = useState('') // honeypot
  const [leadSubmitting, setLeadSubmitting] = useState(false)
  const [leadCaptured, setLeadCaptured] = useState(false)

  const [loading, setLoading] = useState(!audit)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!audit && shareId) {
      setLoading(true)
      getAudit(shareId)
        .then((data) => {
          setAudit(data)
          if ((data as any).aiSummary) setSummary((data as any).aiSummary)
        })
        .catch(() => setError('Audit not found.'))
        .finally(() => setLoading(false))
    }
  }, [shareId])

  useEffect(() => {
    if (audit && !summary && shareId) {
      setSummaryLoading(true)
      generateSummary(shareId)
        .then((data) => {
          setSummary(data.summary)
          setSummaryFallback(data.fallback)
        })
        .catch(() => {})
        .finally(() => setSummaryLoading(false))
    }
  }, [audit, shareId])

  const handleLeadCapture = async () => {
    if (!email || !email.includes('@')) {
      toast.error('Enter a valid email.')
      return
    }
    setLeadSubmitting(true)
    try {
      const res = await captureLead({
        shareId: shareId!,
        email,
        companyName,
        role,
        website, // honeypot
      })
      setLeadCaptured(true)
      toast.success(res.message)
    } catch (err: any) {
      toast.error(err?.response?.data?.error || 'Something went wrong.')
    } finally {
      setLeadSubmitting(false)
    }
  }

  const handleShare = () => {
    const url = window.location.href
    if (navigator.share) {
      navigator.share({ title: 'My AI Spend Audit', url })
    } else {
      navigator.clipboard.writeText(url)
      toast.success('Link copied to clipboard!')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-8 w-8 text-sage-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          <p className="text-gray-600">Loading audit...</p>
        </div>
      </div>
    )
  }

  if (error || !audit) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-display font-bold text-2xl mb-2">Audit not found</h2>
          <p className="text-gray-600 mb-6">This link may have expired or is invalid.</p>
          <button onClick={() => navigate('/audit')} className="btn-primary">Run new audit</button>
        </div>
      </div>
    )
  }

  const highSavings = audit.totalMonthlySavings >= 500
  const noSavings = audit.totalMonthlySavings < 100

  return (
    <div className="min-h-screen bg-paper pb-24">
      {/* Nav */}
      <div className="border-b border-gray-100 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <a href="/" className="font-display font-bold text-xl text-ink">SpendScan</a>
          <button onClick={handleShare} className="text-sm text-gray-500 hover:text-ink flex items-center gap-1.5 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            Share
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 pt-8">
        {/* Hero savings card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="savings-hero noise text-white rounded-2xl p-8 mb-8"
        >
          {noSavings ? (
            <>
              <div className="text-4xl mb-2">✅</div>
              <h1 className="font-display font-bold text-3xl mb-2">You're spending well.</h1>
              <p className="text-gray-300">Your AI stack is right-sized. Less than $100/mo in potential savings identified.</p>
            </>
          ) : (
            <>
              <p className="text-gray-400 text-sm mb-2 uppercase tracking-widest">Potential monthly savings</p>
              <div className="font-display font-bold text-6xl text-sage-400 mb-1">
                ${audit.totalMonthlySavings.toLocaleString()}
              </div>
              <div className="text-gray-300 text-lg">
                ${audit.totalAnnualSavings.toLocaleString()} annually
              </div>
              <div className="mt-4 text-sm text-gray-400">
                {audit.teamSize}-person team · {audit.primaryUseCase} workload
              </div>
            </>
          )}
        </motion.div>

        {/* AI Summary */}
        <div className="card mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm font-medium text-gray-700">AI Analysis</span>
            {summaryFallback && <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">templated</span>}
          </div>
          {summaryLoading ? (
            <div className="flex gap-2 items-center text-gray-400 text-sm">
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Generating personalized summary...
            </div>
          ) : (
            <p className="text-gray-700 leading-relaxed">{summary || 'Summary unavailable.'}</p>
          )}
        </div>

        {/* Per-tool results */}
        <h2 className="font-display font-bold text-xl mb-4">Tool-by-tool breakdown</h2>
        <div className="space-y-4 mb-8">
          {audit.results.map((result: AuditResult, idx: number) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.08 }}
              className={`card border-l-4 ${
                result.severity === 'optimal' ? 'border-l-sage-400' :
                result.severity === 'significant' ? 'border-l-red-500' :
                result.severity === 'moderate' ? 'border-l-orange-400' : 'border-l-amber-400'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-ink">{result.toolName}</span>
                    <span className="text-xs text-gray-500">({result.currentPlan})</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${severityColors[result.severity]}`}>
                      {actionLabels[result.recommendedAction]}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{result.reason}</p>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-sm text-gray-500">${result.currentSpend}/mo</div>
                  {result.savings > 0 && (
                    <div className="font-display font-bold text-sage-500 text-lg">
                      −${result.savings}/mo
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Credex CTA for high savings */}
        {highSavings && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-sage-500 text-white rounded-2xl p-8 mb-8"
          >
            <div className="flex items-start gap-4">
              <div className="text-3xl">💰</div>
              <div>
                <h3 className="font-display font-bold text-xl mb-2">
                  You qualify for a Credex consultation
                </h3>
                <p className="text-sage-50 text-sm mb-4">
                  With ${audit.totalMonthlySavings}/mo in identified overspend, Credex can source discounted AI credits — 
                  Cursor, Claude, ChatGPT Enterprise and more — at 20-40% below retail pricing. 
                  We buy excess inventory from companies that overforecasted.
                </p>
                <a
                  href="https://credex.rocks/consult"
                  target="_blank"
                  rel="noopener"
                  className="inline-block bg-white text-sage-600 font-semibold px-6 py-2.5 rounded-lg text-sm hover:bg-sage-50 transition-colors"
                >
                  Book a free Credex consultation →
                </a>
              </div>
            </div>
          </motion.div>
        )}

        {/* Lead capture */}
        {!leadCaptured ? (
          <div className="card mb-8">
            <h3 className="font-display font-bold text-lg mb-1">
              {noSavings ? 'Get notified when new optimizations apply' : 'Get this report by email'}
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              {noSavings
                ? "We'll alert you if your stack gets more expensive or better alternatives emerge."
                : 'We\'ll send a copy of your full audit and reach out if Credex can help further.'}
            </p>
            {/* Honeypot - hidden from real users */}
            <input
              type="text"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className="hidden"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
            />
            <div className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="you@company.com"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="input-field"
                  placeholder="Company (optional)"
                />
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="input-field"
                  placeholder="Role (optional)"
                />
              </div>
              <button
                onClick={handleLeadCapture}
                disabled={leadSubmitting}
                className="btn-primary w-full py-3 disabled:opacity-60"
              >
                {leadSubmitting ? 'Saving...' : 'Send report to my email →'}
              </button>
              <p className="text-xs text-gray-400 text-center">No spam. One email with your audit report.</p>
            </div>
          </div>
        ) : (
          <div className="card mb-8 bg-sage-50 border-sage-200">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-sage-500 rounded-full flex items-center justify-center text-white text-sm">✓</div>
              <div>
                <p className="font-medium text-sage-700">Audit saved! Check your inbox.</p>
                <p className="text-sm text-sage-600">We'll reach out if we can help reduce your spend further.</p>
              </div>
            </div>
          </div>
        )}

        {/* Share + re-audit */}
        <div className="flex gap-3">
          <button
            onClick={handleShare}
            className="flex-1 btn-secondary py-3 text-sm"
          >
            Share this audit
          </button>
          <button
            onClick={() => navigate('/audit')}
            className="flex-1 btn-primary py-3 text-sm"
          >
            Run new audit
          </button>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Pricing data verified May 2026 · Powered by{' '}
          <a href="https://credex.rocks" className="hover:text-ink">Credex</a>
        </p>
      </div>
    </div>
  )
}
