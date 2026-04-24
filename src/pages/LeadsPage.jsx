// Estavo Prototype — LeadsPage
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Phone, Mail, MessageSquare, Clock, ChevronRight, Zap } from 'lucide-react'
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
  const remM = mins % 60
  let str = `${days}d`
  if (remH > 0) str += ` ${remH}h`
  if (remM > 0) str += ` ${remM}m`
  return str + ' ago'
}

function ageCls(isoStr) {
  const mins = minutesSince(isoStr)
  if (mins < 60)   return 'text-teal font-semibold'
  if (mins < 360)  return 'text-gold font-semibold'
  return 'text-rust font-semibold'
}

function fmtResponse(minutes) {
  if (!minutes) return '—'
  if (minutes < 60) return `${minutes}m`
  return `${Math.floor(minutes / 60)}h ${minutes % 60}m`
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
  const newLeads       = all.filter(l => l.status === 'new').length
  const uncontacted1h  = all.filter(l => l.status === 'new' && minutesSince(l.receivedAt) > 60).length
  const contacted      = all.filter(l => l.status === 'contacted')
  const avgResponse    = contacted.length
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
          sub: avgResponse && avgResponse <= 30 ? 'Excellent' : avgResponse ? 'Good — aim for < 30m' : 'No data yet',
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
  const src = SOURCE[lead.source] ?? SOURCE.brokerage
  const age = fmtAge(lead.receivedAt)
  const ageCl = ageCls(lead.receivedAt)
  const mins = minutesSince(lead.receivedAt)

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
  { value: 'new',       label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'qualified', label: 'Qualified' },
]

export default function LeadsPage() {
  const navigate = useNavigate()
  const [tab, setTab]   = useState('new')
  const [toast, setToast] = useState(null)

  function showToast(msg) {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  function enrich(lead) {
    return { ...lead, contact: contacts.find(c => c.id === lead.contactId) }
  }

  const enriched = leads.map(enrich).filter(l => l.contact)
  const tabLeads = enriched.filter(l => l.status === tab)

  const tabCounts = Object.fromEntries(
    TABS.map(t => [t.value, enriched.filter(l => l.status === t.value).length])
  )

  return (
    <div className="space-y-5">
      <KpiStrip all={leads} />

      {/* Tab selector */}
      <div className="flex gap-2">
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

      {toast && <Toast msg={toast} />}
    </div>
  )
}
