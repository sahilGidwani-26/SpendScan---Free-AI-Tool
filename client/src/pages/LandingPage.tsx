import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

const stats = [
  { label: 'Average monthly overspend', value: '$340' },
  { label: 'Tools commonly over-licensed', value: '3 of 5' },
  { label: 'Minutes to complete audit', value: '< 2' },
]

const logos = ['Cursor', 'Claude', 'ChatGPT', 'Copilot', 'Gemini', 'Windsurf']

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-paper">
      {/* Nav */}
      <nav className="border-b border-gray-100 px-6 py-4 flex items-center justify-between max-w-6xl mx-auto">
        <span className="font-display font-bold text-2xl text-ink">SpendScan</span>
        <a href="https://credex.rocks" target="_blank" rel="noopener" className="text-sm text-gray-500 hover:text-ink transition-colors">
          by Credex →
        </a>
      </nav>

      {/* Hero */}
      <main className="max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 bg-sage-50 border border-sage-100 rounded-full px-4 py-1.5 text-sm text-sage-600 font-medium mb-8">
            <span className="w-2 h-2 rounded-full bg-sage-500 animate-pulse" />
            Free · No login · 2-minute audit
          </div>

          <h1 className="font-display font-bold text-5xl md:text-7xl text-ink leading-[1.05] mb-6">
            Are you overpaying<br />
            <span className="text-sage-500">for AI tools?</span>
          </h1>

          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
            Most startups overspend $200–800/month on AI subscriptions — wrong plan, 
            too many seats, or duplicate tools. Find out in 60 seconds.
          </p>

          <button
            onClick={() => navigate('/audit')}
            className="btn-primary text-lg px-10 py-4 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
          >
            Run free audit →
          </button>

          <p className="mt-4 text-sm text-gray-400">
            No email required to see results
          </p>
        </motion.div>

        {/* Social proof stats */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-20 grid grid-cols-3 gap-8 max-w-2xl mx-auto"
        >
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="font-display font-bold text-3xl text-ink">{s.value}</div>
              <div className="text-sm text-gray-500 mt-1">{s.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Supported tools */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-20"
        >
          <p className="text-sm text-gray-400 mb-4 uppercase tracking-widest font-medium">Audits these tools</p>
          <div className="flex flex-wrap justify-center gap-3">
            {logos.map((logo) => (
              <span key={logo} className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700 shadow-sm">
                {logo}
              </span>
            ))}
          </div>
        </motion.div>
      </main>

      {/* How it works */}
      <section className="bg-white border-t border-gray-100 py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display font-bold text-3xl text-center mb-12">How it works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Enter your AI tools', desc: 'Tell us what tools you pay for, which plan, how many seats, and your monthly spend.' },
              { step: '02', title: 'Get instant analysis', desc: 'Our audit engine checks plan fit, seat efficiency, and alternative tools with real pricing data.' },
              { step: '03', title: 'See your savings', desc: 'Per-tool breakdown with specific recommendations. Save the report, share it, or book a Credex call.' },
            ].map((item) => (
              <div key={item.step} className="relative">
                <div className="font-mono text-5xl font-bold text-gray-100 mb-3">{item.step}</div>
                <h3 className="font-display font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="savings-hero noise text-white py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-display font-bold text-4xl mb-4">
            Your AI spend has a leak.
          </h2>
          <p className="text-gray-300 mb-8 text-lg">
            Run the audit. It's free, takes 2 minutes, and you'll know exactly where the money's going.
          </p>
          <button
            onClick={() => navigate('/audit')}
            className="bg-sage-500 hover:bg-sage-400 text-white font-semibold px-10 py-4 rounded-xl text-lg transition-all duration-200 hover:-translate-y-0.5"
          >
            Start free audit →
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8 px-6 text-center text-sm text-gray-400">
        <p>SpendScan is a free tool by <a href="https://credex.rocks" className="text-gray-600 hover:text-ink">Credex</a> — discounted AI infrastructure credits for startups.</p>
        <p className="mt-1">Pricing data verified May 2026. All savings estimates are indicative.</p>
      </footer>
    </div>
  )
}
