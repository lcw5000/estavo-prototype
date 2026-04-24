// Estavo Prototype — LoginPage
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

export default function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  return (
    <div className="min-h-screen bg-paper flex items-center justify-center p-4">
      <div className="bg-white border border-rule rounded-xl p-8 w-full max-w-sm shadow-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="font-display text-[32px] text-navy leading-none mb-2">
            Esta<span className="text-rust">v</span>o
          </div>
          <p className="text-sub text-slate">The agent-first real estate platform.</p>
        </div>

        {/* Inputs */}
        <div className="space-y-3 mb-5">
          <div>
            <label className="text-label font-medium text-navy block mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@remax.com"
              className="w-full bg-ui-bg border border-rule rounded-md px-3 py-2 text-sub text-navy placeholder:text-ink3 outline-none focus:ring-1 focus:ring-rule transition-shadow"
            />
          </div>
          <div>
            <label className="text-label font-medium text-navy block mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-ui-bg border border-rule rounded-md px-3 py-2 text-sub text-navy placeholder:text-ink3 outline-none focus:ring-1 focus:ring-rule transition-shadow"
            />
          </div>
        </div>

        <button
          onClick={() => navigate('/onboarding')}
          className="w-full bg-rust text-white rounded-md py-2.5 text-sub font-medium hover:bg-[#B33D24] transition-colors"
        >
          Sign in
        </button>

        <div className="text-center mt-4">
          <Link
            to="/dashboard"
            className="text-sub text-slate hover:text-navy transition-colors"
          >
            Skip to dashboard →
          </Link>
        </div>
      </div>
    </div>
  )
}
