// Estavo Prototype — OnboardingPage
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Check } from 'lucide-react'
import { agent, contacts, campaigns } from '../data/mockData'
import { EarlySteps } from '../components/onboarding/EarlySteps'
import { LaterSteps } from '../components/onboarding/LaterSteps'

const STEP_NAMES = [
  'Account setup', 'Your profile', 'Import contacts', 'Lead sources',
  'Your website', 'First campaign', 'AI calibration', 'Dashboard preview',
]

export default function OnboardingPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [done, setDone] = useState(new Set())

  function next() {
    if (step === 7) { navigate('/dashboard'); return }
    setDone(prev => new Set([...prev, step]))
    setStep(s => s + 1)
  }
  function back() { setStep(s => Math.max(0, s - 1)) }

  return (
    <div className="min-h-screen bg-paper">
      {/* Top bar */}
      <div className="relative border-b border-rule px-6 pt-5 pb-3">
        <div className="text-center mb-3">
          <span className="font-display text-[22px] text-navy">
            Esta<span className="text-rust">v</span>o
          </span>
        </div>
        <div className="h-1 bg-rule rounded-full overflow-hidden">
          <div className="h-full bg-rust transition-all duration-300 rounded-full"
            style={{ width: `${(step / 7) * 100}%` }} />
        </div>
        <p className="text-[11px] text-ink3 text-center mt-1.5">Step {step + 1} of 8</p>
        <Link to="/dashboard"
          className="absolute right-6 top-5 text-[11px] text-slate hover:text-navy transition-colors">
          Skip setup →
        </Link>
      </div>

      {/* Body */}
      <div className="max-w-3xl mx-auto px-4 pt-6 pb-16 flex gap-6">
        {/* Step list — hidden on mobile */}
        <div className="w-44 shrink-0 hidden sm:block pt-1">
          {STEP_NAMES.map((name, i) => {
            const isDone    = done.has(i)
            const isCurrent = i === step
            return (
              <div key={i} className="flex items-center gap-2.5 mb-4">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                  isDone ? 'bg-teal' : isCurrent ? 'bg-rust' : 'border border-[#CCC] bg-white'
                }`}>
                  {isDone
                    ? <Check size={10} className="text-white" strokeWidth={3} />
                    : <span className={`text-[9px] font-semibold ${isCurrent ? 'text-white' : 'text-ink3'}`}>{i + 1}</span>
                  }
                </div>
                <span className={`text-[11px] leading-tight ${
                  isCurrent ? 'font-semibold text-navy' : isDone ? 'text-teal' : 'text-ink3'
                }`}>{name}</span>
              </div>
            )
          })}
        </div>

        {/* Step content */}
        <div className="flex-1 min-w-0">
          <div className="bg-white border border-rule rounded-xl p-6 mb-4">
            {step < 4
              ? <EarlySteps step={step} agent={agent} />
              : <LaterSteps step={step} agent={agent} contacts={contacts} campaigns={campaigns}
                  onFinish={() => navigate('/dashboard')} />
            }
          </div>

          {/* Navigation buttons */}
          <div className="flex justify-between items-center">
            {step > 0 ? (
              <button onClick={back}
                className="px-4 py-2 text-[11px] border border-rule rounded-md text-slate hover:bg-ui-bg transition-colors">
                ← Back
              </button>
            ) : <div />}
            <button onClick={next}
              className="px-5 py-2.5 text-[11px] bg-rust text-white font-semibold rounded-md hover:bg-[#B33D24] transition-colors">
              {step === 7 ? 'Go to dashboard →' : 'Next →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
