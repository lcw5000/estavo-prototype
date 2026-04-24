// Estavo Prototype — LaterSteps (Onboarding steps 5–8)
import { useState } from 'react'
import { Check } from 'lucide-react'

function IdxWebsite({ agent }) {
  const [url, setUrl] = useState(`${agent.name.toLowerCase().replace(/\s+/g, '')}.estavo.com`)
  const [tmpl, setTmpl] = useState(0)
  const COLORS = ['#1F2E4A', '#1A5C4A', '#C84B2F']
  return (
    <div>
      <h2 className="text-[15px] font-semibold text-navy mb-1">Your IDX website</h2>
      <p className="text-[11px] text-slate mb-4">Your Estavo website address.</p>
      <label className="text-[10px] font-medium text-navy block mb-1.5">Website address</label>
      <div className="flex items-center bg-ui-bg border border-rule rounded-md mb-5">
        <span className="px-3 text-[11px] text-ink3 shrink-0 border-r border-rule py-2">https://</span>
        <input value={url} onChange={e => setUrl(e.target.value)}
          className="flex-1 bg-transparent py-2 px-3 text-[11px] text-navy outline-none" />
      </div>
      <p className="text-[10px] font-medium text-navy mb-2">Choose a template</p>
      <div className="grid grid-cols-3 gap-3">
        {COLORS.map((color, i) => (
          <button key={i} onClick={() => setTmpl(i)}
            className={`rounded-lg overflow-hidden border-2 transition-colors ${tmpl === i ? 'border-teal' : 'border-rule'}`}>
            <div className="h-14" style={{ backgroundColor: color }} />
            <div className="p-2 bg-white space-y-1.5">
              <div className="h-1.5 bg-[#E8E4DC] rounded w-3/4" />
              <div className="h-1.5 bg-[#E8E4DC] rounded w-1/2" />
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

function FirstCampaign({ campaigns }) {
  const [activated, setActivated] = useState(false)
  const c = campaigns[0]
  return (
    <div>
      <h2 className="text-[15px] font-semibold text-navy mb-1">Your first campaign</h2>
      <p className="text-[11px] text-slate mb-4">We pre-built a drip campaign for your buyer leads.</p>
      <div className="space-y-1.5 mb-4">
        {c.steps.map(s => (
          <div key={s.id} className={`flex items-center gap-2.5 p-2.5 rounded-lg border transition-colors ${activated ? 'border-teal bg-[#E6F4EE]' : 'border-rule'}`}>
            <span className="text-[12px] shrink-0">{s.type === 'sms' ? '💬' : s.type === 'market_report' ? '📊' : '✉️'}</span>
            <span className="text-[11px] text-navy flex-1 truncate">{s.subject}</span>
            {s.aiGenerated && <span className="text-[8px] bg-[#FFF3E8] text-[#B54A1A] px-1 py-0.5 rounded font-semibold shrink-0">✦ AI</span>}
            {activated && <Check size={12} className="text-teal shrink-0" strokeWidth={2.5} />}
          </div>
        ))}
      </div>
      {!activated
        ? <button onClick={() => setActivated(true)} className="w-full py-2.5 bg-rust text-white text-[11px] font-semibold rounded-md hover:bg-[#B33D24] transition-colors">Activate this campaign</button>
        : <p className="text-[11px] text-teal font-semibold">✓ Campaign activated — {c.contactCount} contacts enrolled</p>
      }
    </div>
  )
}

const STYLE_TAGS = [
  { label: 'Friendly',              cls: 'bg-[#E6F4EE] text-teal' },
  { label: 'Professional',          cls: 'bg-[#EEF2FC] text-[#2B4FA0]' },
  { label: 'Conversational length', cls: 'bg-[#FEF3E2] text-[#9A6A10]' },
  { label: 'First-name basis',      cls: 'bg-[#FDF0EE] text-rust' },
  { label: 'Low emoji usage',       cls: 'bg-[#F5F5F5] text-ink3' },
]

function AiCalibration() {
  const [text, setText] = useState('')
  const [phase, setPhase] = useState('idle')
  return (
    <div>
      <h2 className="text-[15px] font-semibold text-navy mb-1">AI calibration</h2>
      <p className="text-[11px] text-slate mb-3">Paste a few emails you've sent so AI learns your voice.</p>
      <textarea value={text} onChange={e => setText(e.target.value)} rows={4}
        placeholder="Paste 2–3 emails you have sent to clients here..."
        className="w-full bg-ui-bg border border-rule rounded-lg px-3 py-2.5 text-[11px] text-navy outline-none resize-none mb-3" />
      {phase !== 'done' && (
        <button onClick={() => { setPhase('loading'); setTimeout(() => setPhase('done'), 2000) }}
          disabled={phase === 'loading'}
          className="px-4 py-2 bg-navy text-white text-[11px] font-semibold rounded-md hover:opacity-80 disabled:opacity-50 transition-opacity">
          {phase === 'loading' ? 'Analysing...' : 'Analyse my writing style →'}
        </button>
      )}
      {phase === 'done' && (
        <div>
          <p className="text-[11px] font-semibold text-navy mb-2">Your writing style profile:</p>
          <div className="flex flex-wrap gap-1.5">
            {STYLE_TAGS.map(t => (
              <span key={t.label} className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${t.cls}`}>{t.label}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function DashboardPreview({ contacts, agent, onFinish }) {
  const top3 = contacts.filter(c => c.score != null).sort((a, b) => b.score - a.score).slice(0, 3)
  const scoreStyle = s => s >= 80 ? { bg: '#FDF0EE', text: '#C84B2F' } : s >= 60 ? { bg: '#FEF8EC', text: '#9A6A10' } : { bg: '#EEF2FC', text: '#2B4FA0' }
  return (
    <div>
      <h2 className="text-[15px] font-semibold text-navy mb-1">You're all set, {agent.name}! 🎉</h2>
      <p className="text-[11px] text-slate mb-4">Here's your priority queue to get started:</p>
      <div className="space-y-2 mb-6">
        {top3.map(c => {
          const { bg, text } = scoreStyle(c.score)
          return (
            <div key={c.id} className="flex items-center gap-2.5 p-2.5 bg-ui-bg rounded-lg">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-semibold shrink-0"
                style={{ backgroundColor: c.avatarColor }}>{c.avatar}</div>
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-medium text-navy truncate">{c.name}</p>
                <p className="text-[10px] text-ink3">{c.lastContact}</p>
              </div>
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded shrink-0"
                style={{ backgroundColor: bg, color: text }}>{c.score}</span>
            </div>
          )
        })}
      </div>
      <button onClick={onFinish}
        className="w-full py-3 bg-rust text-white font-semibold rounded-xl hover:bg-[#B33D24] text-[13px] transition-colors">
        Go to my dashboard →
      </button>
    </div>
  )
}

export function LaterSteps({ step, agent, contacts, campaigns, onFinish }) {
  if (step === 4) return <IdxWebsite agent={agent} />
  if (step === 5) return <FirstCampaign campaigns={campaigns} />
  if (step === 6) return <AiCalibration />
  if (step === 7) return <DashboardPreview contacts={contacts} agent={agent} onFinish={onFinish} />
  return null
}
