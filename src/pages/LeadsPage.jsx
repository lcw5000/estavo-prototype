// Estavo Prototype — LeadsPage
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Phone, Mail, MessageSquare, Clock, ChevronRight, Zap,
  Bell, ToggleLeft, ToggleRight, Edit3, Check, X,
} from 'lucide-react'
import { leads, contacts } from '../data/mockData'

// ── Source config ──────────────────────────────────────────────────────────────

const SOURCE = {
  zillow:     { label: 'Zillow',      cls: 'bg-[#EEF2FC] text-[#2B4FA0]' },
  idx:        { label: 'IDX Site',    cls: 'bg-[#EEF6F2] text-teal' },
  referral:   { label: 'Referral',    cls: 'bg-[#FEF8EC] text-[#9A6A10]' },
  open_house: { label: 'Open house',  cls: 'bg-[#F5F0FC] text-[#6B3FA0]' },
  social:     { label: 'Social',      cls: 'bg-[#FEF0F0] text-rust' },
  brokerage:  { label: 'Brokerage',   cls: 'bg-[#F5F5F5] text-slate' },
}

// ── Time helpers ───────────────────────────────────────────────────────────────

function minutesSince(isoStr) {
  return Math.floor((Date.now() - new Date(isoStr).getTime()) / 60000)
}

function fmtAge(isoStr) {
  const mins = minutesSince(isoStr)
  if (mins < 60) return `${mins}m ago`
  const hrs  = Math.floor(mins / 60)
  const rem  = mins % 60
  if (hrs < 24) return rem > 0 ? `${hrs}h ${rem}m ago` : `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  const remH = hrs % 24
  let str = `${days}d`
  if (remH > 0) str += ` ${remH}h`
  return str + ' ago'
}

function ageCls(isoStr) {
  const mins = minutesSince(isoStr)
  if (mins < 60)  return 'text-teal font-semibold'
  if (mins < 360) return 'text-gold font-semibold'
  return 'text-rust font-semibold'
}

function fmtResponse(minutes) {
  if (!minutes) return '—'
  if (minutes < 60) return `${minutes}m`
  return `${Math.floor(minutes / 60)}h ${minutes % 60}m`
}

// ── Auto-response status ───────────────────────────────────────────────────────

function AutoStatus({ receivedAt }) {
  const mins = minutesSince(receivedAt)

  if (mins < 1) return (
    <div className="flex items-center gap-1.5 text-[10px] text-teal">
      <span className="w-1.5 h-1.5 rounded-full bg-teal animate-pulse shrink-0" />
      Sending auto-SMS…
    </div>
  )
  if (mins < 120) return (
    <div className="flex items-center gap-1.5 text-[10px] text-teal">
      <MessageSquare size={10} className="shrink-0" />
      Auto-SMS sent · {fmtAge(receivedAt)}
    </div>
  )
  if (mins < 1440) return (
    <div className="flex items-center gap-1.5 text-[10px] text-[#2B4FA0]">
      <Mail size={10} className="shrink-0" />
      Follow-up email sent · {Math.floor(mins / 60)}h ago
    </div>
  )
  return (
    <div className="flex items-center gap-1.5 text-[10px] text-rust">
      <Bell size={10} className="shrink-0" />
      No reply · You've been notified
    </div>
  )
}

// ── Score badge ────────────────────────────────────────────────────────────────

function ScoreBadge({ score }) {
  if (!score) return null
  const cls = score >= 80 ? 'bg-rust text-white'
    : score >= 60 ? 'bg-gold text-white'
    : 'bg-[#E8E5E0] text-slate'
  return (
    <span className={`text-[10px] font-semibold w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${cls}`}>
      {score}
    </span>
  )
}

// ── KPI strip ─────────────────────────────────────────────────────────────────

function KpiStrip({ all }) {
  const newLeads      = all.filter(l => l.status === 'new').length
  const uncontacted1h = all.filter(l => l.status === 'new' && minutesSince(l.receivedAt) > 60).length
  const contacted     = all.filter(l => l.status === 'contacted')
  const avgResponse   = contacted.length
    ? Math.round(contacted.reduce((s, l) => s + (l.responseMinutes ?? 0), 0) / contacted.length)
    : null

  return (
    <div className="grid grid-cols-3 gap-3">
      {[
        {
          label: 'New leads',
          value: newLeads,
          sub: newLeads === 0 ? 'All contacted' : `${newLeads} awaiting response`,
          subCls: newLeads === 0 ? 'text-teal' : 'text-rust',
        },
        {
          label: 'Over 1hr uncontacted',
          value: uncontacted1h,
          sub: uncontacted1h === 0 ? 'Response time on track' : 'Risk losing these leads',
          subCls: uncontacted1h === 0 ? 'text-teal' : 'text-rust',
        },
        {
          label: 'Avg response time',
          value: avgResponse ? fmtResponse(avgResponse) : '—',
          sub: avgResponse && avgResponse <= 30 ? 'Excellent' : avgResponse ? 'Aim for < 30m' : 'No data yet',
          subCls: avgResponse && avgResponse <= 30 ? 'text-teal' : 'text-gold',
        },
      ].map(k => (
        <div key={k.label} className="bg-white border border-rule rounded-xl px-4 py-3">
          <p className="text-[11px] text-ink3 mb-0.5">{k.label}</p>
          <p className="text-[22px] font-semibold text-navy leading-tight">{k.value}</p>
          <p className={`text-[10px] mt-0.5 ${k.subCls}`}>{k.sub}</p>
        </div>
      ))}
    </div>
  )
}

// ── New lead card ──────────────────────────────────────────────────────────────

function NewLeadCard({ lead, contact, onToast }) {
  const src   = SOURCE[lead.source] ?? SOURCE.brokerage
  const age   = fmtAge(lead.receivedAt)
  const ageCl = ageCls(lead.receivedAt)
  const mins  = minutesSince(lead.receivedAt)

  return (
    <div className={`bg-white rounded-xl border-2 p-4 flex flex-col gap-3 transition-all ${
      mins < 60 ? 'border-teal/40' : mins < 360 ? 'border-gold/40' : 'border-rust/40'
    }`}>
      {/* Header */}
      <div className="flex items-start gap-3">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-white text-[11px] font-semibold shrink-0"
          style={{ backgroundColor: contact.avatarColor }}
        >
          {contact.avatar}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-semibold text-navy leading-tight">{contact.name}</p>
          {lead.propertyOfInterest && (
            <p className="text-[10px] text-ink3 truncate">{lead.propertyOfInterest}</p>
          )}
        </div>
        <ScoreBadge score={contact.score} />
      </div>

      {/* Meta row */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full ${src.cls}`}>
          {src.label}
        </span>
        {contact.budget && (
          <span className="text-[10px] text-ink3">
            ${(contact.budget.min / 1000).toFixed(0)}K–${(contact.budget.max / 1000).toFixed(0)}K
          </span>
        )}
        {contact.areas?.length > 0 && (
          <span className="text-[10px] text-ink3">{contact.areas[0]}</span>
        )}
      </div>

      {/* Notes */}
      <p className="text-[11px] text-ink3 leading-relaxed">{lead.notes}</p>

      {/* Auto-response status */}
      <div className="bg-[#F8FAF8] rounded-lg px-3 py-2">
        <AutoStatus receivedAt={lead.receivedAt} />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-auto pt-1 border-t border-[#F5F5F5]">
        <div className="flex items-center gap-1 text-[10px]">
          <Clock size={10} className="text-ink3" />
          <span className={ageCl}>{age}</span>
          {mins > 60 && (
            <span className="text-rust text-[9px] ml-1 font-medium flex items-center gap-0.5">
              <Zap size={9} /> Respond now
            </span>
          )}
        </div>
        <div className="flex gap-1.5">
          <button
            onClick={() => onToast(`Calling ${contact.name}…`)}
            className="flex items-center gap-1 text-[10px] border border-rule rounded px-2 py-1 text-slate hover:bg-ui-bg transition-colors"
          >
            <Phone size={10} /> Call
          </button>
          <button
            onClick={() => onToast(`SMS sent to ${contact.name}`)}
            className="flex items-center gap-1 text-[10px] border border-rule rounded px-2 py-1 text-slate hover:bg-ui-bg transition-colors"
          >
            <MessageSquare size={10} /> Text
          </button>
          <button
            onClick={() => onToast(`Email drafted for ${contact.name}`)}
            className="text-[10px] bg-rust text-white rounded px-2.5 py-1 hover:bg-[#B33D24] transition-colors flex items-center gap-1"
          >
            <Mail size={10} /> Email
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Contacted / Qualified row ─────────────────────────────────────────────────

function LeadRow({ lead, contact, navigate }) {
  const src = SOURCE[lead.source] ?? SOURCE.brokerage
  return (
    <div className="flex items-center gap-4 py-3 border-b border-[#F5F5F5] last:border-0">
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[10px] font-semibold shrink-0"
        style={{ backgroundColor: contact.avatarColor }}
      >
        {contact.avatar}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[12px] font-semibold text-navy truncate">{contact.name}</p>
        <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
          <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${src.cls}`}>
            {src.label}
          </span>
          {lead.propertyOfInterest && (
            <span className="text-[10px] text-ink3 truncate">{lead.propertyOfInterest}</span>
          )}
        </div>
      </div>
      <div className="shrink-0 text-right hidden sm:block">
        {lead.responseMinutes != null && (
          <p className="text-[10px] text-ink3">
            Response: <span className="text-navy font-medium">{fmtResponse(lead.responseMinutes)}</span>
          </p>
        )}
        {lead.nextStep && (
          <p className="text-[10px] text-ink3 truncate max-w-[160px]">{lead.nextStep}</p>
        )}
      </div>
      <ScoreBadge score={contact.score} />
      <button
        onClick={() => navigate(`/contacts/${contact.id}`)}
        className="shrink-0 text-ink3 hover:text-navy transition-colors"
      >
        <ChevronRight size={14} />
      </button>
    </div>
  )
}

// ── Automation / Playbook tab ─────────────────────────────────────────────────

const DEFAULT_STEPS = [
  {
    id: 1,
    Icon: MessageSquare,
    label: 'Instant SMS',
    delay: 'Within 30 seconds of lead arrival',
    colorCls: 'bg-[#EEF6F2] text-teal',
    stat: { value: '3', label: 'sent today' },
    template: `Hi {first_name}! This is Lee from RE/MAX. I saw you were interested in {property} — I'd love to help you find the right home. When's a good time for a quick chat?`,
  },
  {
    id: 2,
    Icon: Mail,
    label: 'Follow-up email',
    delay: 'If no reply · 2 hours later',
    colorCls: 'bg-[#EEF2FC] text-[#2B4FA0]',
    stat: { value: '2', label: 'scheduled' },
    template: `Hi {first_name},\n\nJust following up on my text earlier. I know you're busy — I wanted to make sure you got my message about {property}.\n\nI have a few other options in {area} that might be a great fit too. Happy to set up a call whenever works for you.\n\n— Lee`,
  },
  {
    id: 3,
    Icon: Bell,
    label: 'Agent alert',
    delay: 'If no reply · 24 hours later',
    colorCls: 'bg-[#FDF0EE] text-rust',
    stat: { value: '1', label: 'pending' },
    template: `{first_name} has not replied after 24 hours. Personal outreach recommended — try calling directly or a handwritten note if you have their address.`,
  },
]

function PlaybookStep({ step, isLast, onEdit }) {
  return (
    <div>
      <div className="bg-white rounded-xl border border-rule p-4">
        <div className="flex items-start gap-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${step.colorCls}`}>
            <step.Icon size={14} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <p className="text-[12px] font-semibold text-navy">Step {step.id} · {step.label}</p>
              <span className="text-[9px] font-semibold bg-[#EEF6F2] text-teal px-1.5 py-0.5 rounded">
                {step.stat.value} {step.stat.label}
              </span>
            </div>
            <p className="text-[10px] text-ink3 mb-2">{step.delay}</p>
            <div className="bg-ui-bg rounded-lg px-3 py-2">
              <p className="text-[11px] text-slate leading-relaxed italic">
                "{step.template.split('\n')[0]}"
              </p>
            </div>
          </div>
          <button
            onClick={() => onEdit(step.id)}
            className="shrink-0 text-ink3 hover:text-navy transition-colors p-1"
          >
            <Edit3 size={13} />
          </button>
        </div>
      </div>

      {!isLast && (
        <div className="flex items-center gap-2 pl-8 py-1">
          <div className="flex flex-col items-center">
            <div className="w-px h-3 bg-rule" />
            <div className="w-1.5 h-1.5 rounded-full border border-rule bg-white" />
            <div className="w-px h-3 bg-rule" />
          </div>
          <p className="text-[10px] text-ink3">if no reply</p>
        </div>
      )}
    </div>
  )
}

function EditModal({ step, onSave, onClose }) {
  const [text, setText] = useState(step.template)
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/30">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-rule">
          <p className="text-[13px] font-semibold text-navy">Edit · {step.label}</p>
          <button onClick={onClose} className="text-ink3 hover:text-navy transition-colors">
            <X size={16} />
          </button>
        </div>
        <div className="p-5">
          <p className="text-[10px] text-ink3 mb-2">
            Variables: {'{first_name}'} · {'{property}'} · {'{area}'}
          </p>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            rows={6}
            className="w-full bg-ui-bg rounded-xl px-4 py-3 text-[12px] text-navy outline-none focus:ring-1 focus:ring-rule resize-none leading-relaxed"
          />
        </div>
        <div className="flex gap-2 px-5 pb-5">
          <button
            onClick={onClose}
            className="flex-1 py-2 text-[12px] border border-rule rounded-lg text-slate hover:bg-ui-bg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(step.id, text)}
            className="flex-1 py-2 text-[12px] bg-navy text-white rounded-lg hover:bg-[#2A3F5F] transition-colors flex items-center justify-center gap-1.5"
          >
            <Check size={12} /> Save
          </button>
        </div>
      </div>
    </div>
  )
}

function AutomationTab() {
  const [enabled, setEnabled] = useState(true)
  const [steps, setSteps]     = useState(DEFAULT_STEPS)
  const [editing, setEditing] = useState(null)

  function handleSave(id, text) {
    setSteps(prev => prev.map(s => s.id === id ? { ...s, template: text } : s))
    setEditing(null)
  }

  const editingStep = steps.find(s => s.id === editing)

  return (
    <div className="space-y-4">

      {/* Header card */}
      <div className="bg-white rounded-xl border border-rule p-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[13px] font-semibold text-navy flex items-center gap-1.5">
              ✦ Lead Response Playbook
            </p>
            <p className="text-[11px] text-ink3 mt-0.5 max-w-sm">
              Automatically follow up the moment a new lead arrives — before they go cold.
            </p>
          </div>
          <button
            onClick={() => setEnabled(e => !e)}
            className={`shrink-0 flex items-center gap-1.5 text-[11px] font-medium px-3 py-1.5 rounded-lg transition-colors ${
              enabled
                ? 'bg-[#EEF6F2] text-teal'
                : 'bg-rule text-ink3'
            }`}
          >
            {enabled ? <ToggleRight size={15} /> : <ToggleLeft size={15} />}
            {enabled ? 'Active' : 'Paused'}
          </button>
        </div>

        {/* Today's stats */}
        <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-rule">
          {[
            { label: 'Auto-SMS sent',   value: '3' },
            { label: 'Emails sent',     value: '2' },
            { label: 'Leads replied',   value: '1' },
          ].map(s => (
            <div key={s.label} className="text-center bg-ui-bg rounded-lg py-2">
              <p className="text-[18px] font-semibold text-navy">{s.value}</p>
              <p className="text-[9px] text-ink3 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Steps */}
      <div>
        <p className="text-[11px] font-semibold text-ink3 uppercase tracking-wider mb-2 px-0.5">
          Response sequence
        </p>
        <div className="space-y-0">
          {steps.map((step, i) => (
            <PlaybookStep
              key={step.id}
              step={step}
              isLast={i === steps.length - 1}
              onEdit={setEditing}
            />
          ))}
        </div>
      </div>

      {/* Lead sources */}
      <div className="bg-white rounded-xl border border-rule p-4">
        <p className="text-[11px] font-semibold text-ink3 uppercase tracking-wider mb-3">
          Active lead sources
        </p>
        <div className="space-y-2">
          {[
            { label: 'Zillow Premier Agent',    cls: 'bg-[#EEF2FC] text-[#2B4FA0]', on: true  },
            { label: 'IDX Website',             cls: 'bg-[#EEF6F2] text-teal',       on: true  },
            { label: 'Open house sign-in',      cls: 'bg-[#F5F0FC] text-[#6B3FA0]', on: true  },
            { label: 'Facebook Lead Ads',       cls: 'bg-[#FEF0F0] text-rust',       on: false },
            { label: 'Manual / referral entry', cls: 'bg-[#F5F5F5] text-slate',      on: true  },
          ].map(src => (
            <div key={src.label} className="flex items-center gap-3">
              <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${src.cls}`}>
                {src.label}
              </span>
              <div className="flex-1" />
              <span className={`text-[10px] font-medium ${src.on ? 'text-teal' : 'text-ink3'}`}>
                {src.on ? 'Connected' : 'Not set up'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {editingStep && (
        <EditModal step={editingStep} onSave={handleSave} onClose={() => setEditing(null)} />
      )}
    </div>
  )
}

// ── Toast ──────────────────────────────────────────────────────────────────────

function Toast({ msg }) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-navy text-white text-[12px] px-4 py-2.5 rounded-xl shadow-lg animate-page-in">
      {msg}
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

const TABS = [
  { value: 'new',        label: 'New' },
  { value: 'contacted',  label: 'Contacted' },
  { value: 'qualified',  label: 'Qualified' },
  { value: 'automation', label: '✦ Automation' },
]

export default function LeadsPage() {
  const navigate  = useNavigate()
  const [tab, setTab]     = useState('new')
  const [toast, setToast] = useState(null)

  function showToast(msg) {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  function enrich(lead) {
    return { ...lead, contact: contacts.find(c => c.id === lead.contactId) }
  }

  const enriched  = leads.map(enrich).filter(l => l.contact)
  const tabLeads  = enriched.filter(l => l.status === tab)

  const tabCounts = Object.fromEntries(
    TABS.filter(t => t.value !== 'automation')
      .map(t => [t.value, enriched.filter(l => l.status === t.value).length])
  )

  return (
    <div className="space-y-5">
      <KpiStrip all={leads} />

      {/* Tab selector */}
      <div className="flex gap-2 flex-wrap">
        {TABS.map(t => (
          <button
            key={t.value}
            onClick={() => setTab(t.value)}
            className={`flex items-center gap-1.5 px-4 py-1.5 text-[12px] rounded-md font-medium transition-colors ${
              tab === t.value
                ? 'bg-navy text-white'
                : 'bg-white border border-rule text-slate hover:bg-ui-bg'
            }`}
          >
            {t.label}
            {tabCounts[t.value] > 0 && (
              <span className={`text-[9px] font-semibold rounded-full w-4 h-4 flex items-center justify-center ${
                tab === t.value ? 'bg-white/20 text-white' : 'bg-rule text-slate'
              }`}>
                {tabCounts[t.value]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      {tab === 'new' && (
        tabLeads.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="w-12 h-12 bg-[#EEF6F2] rounded-full flex items-center justify-center">
              <Zap size={20} className="text-teal" />
            </div>
            <p className="text-[13px] font-semibold text-navy">No new leads</p>
            <p className="text-[11px] text-ink3">You're all caught up — great response time.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {tabLeads
              .sort((a, b) => new Date(b.receivedAt) - new Date(a.receivedAt))
              .map(l => (
                <NewLeadCard key={l.id} lead={l} contact={l.contact} onToast={showToast} />
              ))}
          </div>
        )
      )}

      {(tab === 'contacted' || tab === 'qualified') && (
        tabLeads.length === 0 ? (
          <p className="text-[12px] text-ink3 py-8 text-center">No {tab} leads yet.</p>
        ) : (
          <div className="bg-white rounded-xl border border-rule px-4">
            {tabLeads.map(l => (
              <LeadRow key={l.id} lead={l} contact={l.contact} navigate={navigate} />
            ))}
          </div>
        )
      )}

      {tab === 'automation' && <AutomationTab />}

      {toast && <Toast msg={toast} />}
    </div>
  )
}
