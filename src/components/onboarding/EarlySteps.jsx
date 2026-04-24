// Estavo Prototype — EarlySteps (Onboarding steps 1–4)
import { useState } from 'react'
import { Check, Upload } from 'lucide-react'

function AccountSetup({ agent }) {
  const fields = [
    { label: 'Full name', value: agent.name },
    { label: 'Email',     value: agent.email },
    { label: 'Phone',     value: agent.phone },
    { label: 'Brokerage', value: agent.brokerage },
    { label: 'License',   value: agent.license },
  ]
  return (
    <div>
      <h2 className="text-[15px] font-semibold text-navy mb-4">Account setup</h2>
      <div>
        {fields.map(f => (
          <div key={f.label} className="flex items-center justify-between py-2.5 border-b border-[#F5F5F5] last:border-0">
            <div>
              <p className="text-[10px] text-ink3 mb-0.5">{f.label}</p>
              <p className="text-[12px] text-navy font-medium">{f.value}</p>
            </div>
            <Check size={14} className="text-teal shrink-0" strokeWidth={2.5} />
          </div>
        ))}
      </div>
      <div className="mt-4 bg-[#E6F4EE] rounded-lg p-3">
        <p className="text-[11px] text-teal font-semibold">✓ Looks good! Your account is ready.</p>
      </div>
    </div>
  )
}

function ProfileSetup({ agent }) {
  const [zips, setZips] = useState([...agent.marketAreas])
  const [input, setInput] = useState('')
  function add() {
    if (!input.trim() || zips.includes(input.trim())) return
    setZips(z => [...z, input.trim()]); setInput('')
  }
  return (
    <div>
      <h2 className="text-[15px] font-semibold text-navy mb-1">Market areas</h2>
      <p className="text-[11px] text-slate mb-4">ZIP codes you actively serve.</p>
      <div className="flex flex-wrap gap-2 mb-3">
        {zips.map(z => (
          <span key={z} className="flex items-center gap-1 bg-ui-bg border border-rule text-[11px] text-navy px-2.5 py-1 rounded-full">
            {z}
            <button onClick={() => setZips(p => p.filter(x => x !== z))} className="text-ink3 hover:text-rust ml-0.5 leading-none">×</button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && add()}
          placeholder="Add ZIP code..." className="flex-1 bg-ui-bg border border-rule rounded-md px-3 py-2 text-[11px] outline-none" />
        <button onClick={add} className="px-3 py-2 bg-navy text-white text-[11px] rounded-md hover:opacity-80">Add</button>
      </div>
    </div>
  )
}

function ContactImport() {
  const [status, setStatus] = useState('idle')
  function imp() { setStatus('loading'); setTimeout(() => setStatus('success'), 1500) }
  return (
    <div>
      <h2 className="text-[15px] font-semibold text-navy mb-1">Import contacts</h2>
      <p className="text-[11px] text-slate mb-4">Connect your existing contacts to get started.</p>
      <div className="border-2 border-dashed border-rule rounded-xl p-8 text-center mb-4 cursor-pointer hover:bg-ui-bg transition-colors">
        <Upload size={24} className="text-ink3 mx-auto mb-2" />
        <p className="text-[11px] text-slate">Drop your CSV here or click to browse</p>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {['Follow Up Boss', 'Google Contacts', 'CSV upload'].map(name => (
          <button key={name} onClick={imp} disabled={status === 'loading'}
            className="py-2.5 px-2 border border-rule rounded-lg text-[11px] text-navy font-medium hover:bg-ui-bg transition-colors disabled:opacity-50">
            {name}
          </button>
        ))}
      </div>
      {status === 'loading' && <p className="text-[11px] text-slate mt-3">Importing...</p>}
      {status === 'success' && <p className="text-[11px] text-teal font-semibold mt-3">✓ 14 contacts imported · 2 duplicates merged</p>}
    </div>
  )
}

const SOURCES = ['Zillow', 'Realtor.com', 'Facebook Lead Ads', 'IDX Website']

function LeadSources() {
  const [active, setActive] = useState(new Set(['Zillow']))
  function toggle(name) {
    setActive(prev => { const n = new Set(prev); n.has(name) ? n.delete(name) : n.add(name); return n })
  }
  return (
    <div>
      <h2 className="text-[15px] font-semibold text-navy mb-1">Lead sources</h2>
      <p className="text-[11px] text-slate mb-4">Select platforms where you receive leads.</p>
      <div className="grid grid-cols-2 gap-3">
        {SOURCES.map(name => {
          const on = active.has(name)
          return (
            <button key={name} onClick={() => toggle(name)}
              className={`relative p-3 rounded-xl border-2 text-left transition-colors ${on ? 'border-teal bg-[#E6F4EE]' : 'border-rule hover:bg-ui-bg'}`}>
              <div className="w-7 h-7 rounded-full bg-ui-bg mb-2" />
              <p className="text-[12px] font-medium text-navy">{name}</p>
              {on && <Check size={13} className="absolute top-2.5 right-2.5 text-teal" strokeWidth={2.5} />}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export function EarlySteps({ step, agent }) {
  if (step === 0) return <AccountSetup agent={agent} />
  if (step === 1) return <ProfileSetup agent={agent} />
  if (step === 2) return <ContactImport />
  if (step === 3) return <LeadSources />
  return null
}
