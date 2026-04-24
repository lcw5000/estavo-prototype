// Estavo Prototype — SettingsPage
import { useState, useEffect } from 'react'
import { Type, User, Bell, Shield, CreditCard } from 'lucide-react'
import { agent } from '../data/mockData'

const SCALES = [
  { key: 'sm', label: 'Small',   preview: 'text-[11px]', sample: 'Aa' },
  { key: 'md', label: 'Medium',  preview: 'text-[13px]', sample: 'Aa' },
  { key: 'lg', label: 'Large',   preview: 'text-[15px]', sample: 'Aa' },
  { key: 'xl', label: 'X-Large', preview: 'text-[18px]', sample: 'Aa' },
]

function Section({ icon: Icon, title, children }) {
  return (
    <div className="bg-white border border-rule rounded-xl overflow-hidden">
      <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-rule">
        <Icon size={14} className="text-ink3 shrink-0" />
        <p className="text-[13px] font-semibold text-navy">{title}</p>
      </div>
      <div className="px-5 py-4">{children}</div>
    </div>
  )
}

function Row({ label, description, children }) {
  return (
    <div className="flex items-start justify-between gap-6 py-3 border-b border-[#F5F5F5] last:border-0">
      <div className="min-w-0">
        <p className="text-[12px] font-medium text-navy">{label}</p>
        {description && <p className="text-[11px] text-ink3 mt-0.5">{description}</p>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  )
}

function Toggle({ value, onChange }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={`w-9 h-5 rounded-full transition-colors relative ${value ? 'bg-teal' : 'bg-[#D4CFC9]'}`}
    >
      <span
        className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${value ? 'translate-x-4' : 'translate-x-0.5'}`}
      />
    </button>
  )
}

// ── Appearance section ─────────────────────────────────────────────────────────

function AppearanceSection() {
  const [scale, setScale] = useState(() => localStorage.getItem('fontScale') ?? 'sm')

  useEffect(() => {
    document.documentElement.dataset.scale = scale === 'sm' ? '' : scale
    localStorage.setItem('fontScale', scale)
  }, [scale])

  return (
    <Section icon={Type} title="Appearance">
      <Row
        label="Text size"
        description="Adjusts the font size across the entire app."
      >
        <div className="flex gap-1.5">
          {SCALES.map(s => (
            <button
              key={s.key}
              onClick={() => setScale(s.key)}
              className={`flex flex-col items-center gap-1 w-16 py-2 rounded-lg border transition-all ${
                scale === s.key
                  ? 'border-navy bg-navy text-white'
                  : 'border-rule bg-white text-slate hover:bg-ui-bg'
              }`}
            >
              <span className={`font-semibold leading-none ${s.preview}`}>{s.sample}</span>
              <span className="text-[9px] font-medium leading-none opacity-80">{s.label}</span>
            </button>
          ))}
        </div>
      </Row>
    </Section>
  )
}

// ── Notifications section ──────────────────────────────────────────────────────

function NotificationsSection() {
  const [prefs, setPrefs] = useState({
    newLeads:       true,
    signingUpdates: true,
    showingReminders: true,
    marketDigest:   false,
    aiSuggestions:  true,
  })

  function toggle(key) {
    setPrefs(p => ({ ...p, [key]: !p[key] }))
  }

  return (
    <Section icon={Bell} title="Notifications">
      <Row label="New lead alerts" description="Notify when a new lead comes in from Zillow or your IDX site.">
        <Toggle value={prefs.newLeads} onChange={() => toggle('newLeads')} />
      </Row>
      <Row label="Signing updates" description="Notify when a client signs or views a document envelope.">
        <Toggle value={prefs.signingUpdates} onChange={() => toggle('signingUpdates')} />
      </Row>
      <Row label="Showing reminders" description="Reminder 1 hour before each scheduled showing.">
        <Toggle value={prefs.showingReminders} onChange={() => toggle('showingReminders')} />
      </Row>
      <Row label="Weekly market digest" description="AI-generated summary of market trends in your areas.">
        <Toggle value={prefs.marketDigest} onChange={() => toggle('marketDigest')} />
      </Row>
      <Row label="AI action suggestions" description="Show proactive suggestions in the dashboard.">
        <Toggle value={prefs.aiSuggestions} onChange={() => toggle('aiSuggestions')} />
      </Row>
    </Section>
  )
}

// ── Profile section ────────────────────────────────────────────────────────────

function ProfileSection() {
  return (
    <Section icon={User} title="Profile">
      <Row label="Name" description="Shown to clients in portals and emails.">
        <p className="text-[12px] text-navy font-medium">{agent.name}</p>
      </Row>
      <Row label="Brokerage">
        <p className="text-[12px] text-navy font-medium">{agent.brokerage}</p>
      </Row>
      <Row label="Phone">
        <p className="text-[12px] text-navy font-medium">{agent.phone}</p>
      </Row>
      <Row label="License #">
        <p className="text-[12px] text-navy font-medium">{agent.license}</p>
      </Row>
    </Section>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function SettingsPage() {
  return (
    <div className="max-w-2xl space-y-4">
      <AppearanceSection />
      <NotificationsSection />
      <ProfileSection />

      <Section icon={Shield} title="Security">
        <Row label="Password" description="Last changed 3 months ago.">
          <button className="text-[11px] border border-rule rounded-md px-3 py-1.5 text-slate hover:bg-ui-bg transition-colors">
            Change password
          </button>
        </Row>
        <Row label="Two-factor authentication" description="Add an extra layer of security to your account.">
          <button className="text-[11px] border border-rule rounded-md px-3 py-1.5 text-slate hover:bg-ui-bg transition-colors">
            Enable 2FA
          </button>
        </Row>
      </Section>

      <Section icon={CreditCard} title="Billing">
        <Row label="Plan" description="Estavo Pro — renews May 1, 2026.">
          <span className="text-[11px] font-semibold bg-[#EEF6F2] text-teal px-2.5 py-1 rounded-full">Active</span>
        </Row>
        <Row label="Payment method" description="Visa ending in 4242.">
          <button className="text-[11px] border border-rule rounded-md px-3 py-1.5 text-slate hover:bg-ui-bg transition-colors">
            Update
          </button>
        </Row>
      </Section>
    </div>
  )
}
