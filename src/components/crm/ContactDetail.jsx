// Estavo Prototype — ContactDetail
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, Mail, MessageSquare, Sparkles, Home, Send, FileText, Zap, Plus, X } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import ContactTimeline from './ContactTimeline'
import { transactions, contactMessages } from '../../data/mockData'

function stageLabel(s) {
  return s.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

function TagBadge({ label }) {
  return (
    <span className="text-[10px] bg-ui-bg text-slate rounded-md px-2 py-0.5 border border-rule">
      {label}
    </span>
  )
}

function InfoRow({ label, value }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-[#F5F5F5] last:border-0">
      <span className="text-[10px] text-ink3 uppercase tracking-wider">{label}</span>
      <span className="text-[11px] text-navy font-medium text-right max-w-[60%]">{value}</span>
    </div>
  )
}

function fmtTime(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  const now = new Date('2026-04-24T10:00:00')
  const diffMs = now - d
  const diffMin = Math.floor(diffMs / 60000)
  if (diffMin < 60) return `${diffMin}m ago`
  const diffH = Math.floor(diffMin / 60)
  if (diffH < 24) return `${diffH}h ago`
  const diffD = Math.floor(diffH / 24)
  if (diffD < 30) return `${diffD}d ago`
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function MessageBubble({ msg }) {
  if (msg.type === 'event') {
    return (
      <div className="flex items-center gap-2 py-1">
        <div className="flex-1 h-px bg-[#F0EDE8]" />
        <p className="text-[10px] text-ink3 italic shrink-0">{msg.body}</p>
        <div className="flex-1 h-px bg-[#F0EDE8]" />
      </div>
    )
  }
  if (msg.type === 'note') {
    return (
      <div className="bg-[#FFFBF0] border border-[#F0E6B0] rounded-xl p-3 mx-2">
        <div className="flex items-center gap-1.5 mb-1">
          <FileText size={10} className="text-[#9A6A10]" />
          <p className="text-[10px] font-semibold text-[#9A6A10] uppercase tracking-wider">Note</p>
          <span className="ml-auto text-[10px] text-ink3">{fmtTime(msg.timestamp)}</span>
        </div>
        <p className="text-[11px] text-navy leading-relaxed">{msg.body}</p>
      </div>
    )
  }
  if (msg.type === 'email') {
    const isOut = msg.direction === 'out'
    return (
      <div className={`flex flex-col gap-0.5 ${isOut ? 'items-end' : 'items-start'}`}>
        <div className="flex items-center gap-1.5">
          <Mail size={10} className="text-ink3" />
          <p className="text-[10px] text-ink3">{msg.subject}</p>
          <span className="text-[10px] text-ink3">{fmtTime(msg.timestamp)}</span>
        </div>
        <div className={`max-w-[80%] rounded-xl px-3 py-2 text-[11px] leading-relaxed whitespace-pre-wrap ${
          isOut ? 'bg-navy text-white rounded-br-sm' : 'bg-white border border-rule text-navy rounded-bl-sm'
        }`}>
          {msg.body}
        </div>
      </div>
    )
  }
  // SMS
  const isOut = msg.direction === 'out'
  return (
    <div className={`flex ${isOut ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[75%] rounded-2xl px-3 py-2 text-[12px] leading-snug ${
        isOut
          ? 'bg-[#1A5C4A] text-white rounded-br-sm'
          : 'bg-white border border-rule text-navy rounded-bl-sm'
      }`}>
        <p>{msg.body}</p>
        <p className={`text-[9px] mt-0.5 ${isOut ? 'text-white/60' : 'text-ink3'}`}>{fmtTime(msg.timestamp)}</p>
      </div>
    </div>
  )
}

function MessagesTab({ contact }) {
  const msgs = contactMessages[contact.id] ?? []
  const [compose, setCompose] = useState('')
  const [composeType, setComposeType] = useState('sms')
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {msgs.length === 0 && (
          <p className="text-center text-[11px] text-ink3 py-8">No messages yet — start a conversation below.</p>
        )}
        {msgs.map(msg => <MessageBubble key={msg.id} msg={msg} />)}
        <div ref={bottomRef} />
      </div>

      {/* Compose */}
      <div className="border-t border-rule bg-white p-3 shrink-0">
        <div className="flex gap-1.5 mb-2">
          {['sms', 'email', 'note'].map(t => (
            <button
              key={t}
              onClick={() => setComposeType(t)}
              className={`text-[10px] font-semibold px-2.5 py-1 rounded-full transition-colors capitalize ${
                composeType === t ? 'bg-navy text-white' : 'bg-ui-bg text-slate hover:bg-[#EAE8E3]'
              }`}
            >
              {t === 'sms' ? 'SMS' : t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
        <div className="flex gap-2 items-end">
          <textarea
            value={compose}
            onChange={e => setCompose(e.target.value)}
            placeholder={composeType === 'note' ? 'Add a private note…' : `Type a ${composeType}…`}
            rows={2}
            className="flex-1 text-[11px] border border-rule rounded-lg px-2.5 py-2 resize-none focus:outline-none focus:border-navy text-navy placeholder:text-ink3"
          />
          <button
            onClick={() => setCompose('')}
            className="w-8 h-8 rounded-full bg-rust flex items-center justify-center shrink-0"
          >
            <Send size={13} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  )
}

function ConvertModal({ contact, onClose }) {
  const [form, setForm] = useState({ address: '', type: 'purchase', price: '', role: 'buyer' })
  const [done, setDone] = useState(false)

  function set(k, v) { setForm(f => ({ ...f, [k]: v })) }

  if (done) {
    return (
      <div className="text-center py-6">
        <div className="w-12 h-12 rounded-full bg-[#EEF6F2] flex items-center justify-center mx-auto mb-3">
          <Home size={20} className="text-teal" />
        </div>
        <p className="text-[13px] font-semibold text-navy mb-1">Transaction created</p>
        <p className="text-[11px] text-ink3 mb-4">{contact.name} has been converted to an active transaction.</p>
        <button onClick={onClose} className="px-4 py-2 text-[11px] bg-teal text-white rounded-lg">
          View in Transactions →
        </button>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-3 py-2">
        <div>
          <label className="text-[10px] font-semibold text-ink3 uppercase tracking-wider block mb-1">Property address</label>
          <input
            value={form.address}
            onChange={e => set('address', e.target.value)}
            placeholder="123 Main St, San Francisco CA"
            className="w-full text-[12px] border border-rule rounded-lg px-3 py-2 focus:outline-none focus:border-navy text-navy placeholder:text-ink3"
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[10px] font-semibold text-ink3 uppercase tracking-wider block mb-1">Transaction type</label>
            <select
              value={form.type}
              onChange={e => set('type', e.target.value)}
              className="w-full text-[12px] border border-rule rounded-lg px-2.5 py-2 focus:outline-none focus:border-navy text-navy bg-white"
            >
              <option value="purchase">Purchase</option>
              <option value="sale">Sale</option>
              <option value="lease">Lease</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] font-semibold text-ink3 uppercase tracking-wider block mb-1">Your role</label>
            <select
              value={form.role}
              onChange={e => set('role', e.target.value)}
              className="w-full text-[12px] border border-rule rounded-lg px-2.5 py-2 focus:outline-none focus:border-navy text-navy bg-white"
            >
              <option value="buyer">Buyer's agent</option>
              <option value="seller">Listing agent</option>
              <option value="dual">Dual agent</option>
            </select>
          </div>
        </div>
        <div>
          <label className="text-[10px] font-semibold text-ink3 uppercase tracking-wider block mb-1">Estimated price</label>
          <input
            value={form.price}
            onChange={e => set('price', e.target.value)}
            placeholder="$985,000"
            className="w-full text-[12px] border border-rule rounded-lg px-3 py-2 focus:outline-none focus:border-navy text-navy placeholder:text-ink3"
          />
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-3 border-t border-rule">
        <button onClick={onClose} className="px-3 py-1.5 text-[11px] border border-rule rounded-lg text-slate hover:bg-ui-bg">
          Cancel
        </button>
        <button
          onClick={() => setDone(true)}
          className="px-3 py-1.5 text-[11px] bg-teal text-white rounded-lg hover:bg-[#155040]"
        >
          Create transaction
        </button>
      </div>
    </>
  )
}

const TABS = ['Overview', 'Messages']

export default function ContactDetail({ contact, interactions, autoDraft }) {
  const navigate = useNavigate()
  const [draftOpen, setDraftOpen] = useState(false)
  const [convertOpen, setConvertOpen] = useState(false)
  const [tab, setTab] = useState('Overview')
  const linkedTx = contact ? transactions.find(t => t.contactId === contact.id) : null

  useEffect(() => {
    if (autoDraft && contact) setDraftOpen(true)
  }, [autoDraft, contact?.id])

  useEffect(() => {
    setTab('Overview')
  }, [contact?.id])

  if (!contact) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-paper gap-3">
        <Users size={32} className="text-ink3" />
        <p className="text-sub text-slate">Select a contact to view details</p>
      </div>
    )
  }

  const budget = contact.budget
    ? `$${(contact.budget.min / 1000).toFixed(0)}K – $${(contact.budget.max / 1000).toFixed(0)}K`
    : '—'

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-paper">
      {/* Header */}
      <div className="bg-white border-b border-rule p-4 shrink-0">
        <div className="flex items-start gap-3 mb-3">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-white text-[14px] font-semibold shrink-0"
            style={{ backgroundColor: contact.avatarColor }}
          >
            {contact.avatar}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-card font-semibold text-navy leading-tight">{contact.name}</h2>
            <p className="text-[11px] text-ink3 mt-0.5 truncate">{contact.email} · {contact.phone}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {contact.tags?.map(tag => <TagBadge key={tag} label={tag} />)}
        </div>

        {linkedTx ? (
          <div className="bg-[#EEF6F2] rounded-lg px-3 py-2 flex items-center gap-2 mb-3">
            <Home size={13} className="text-teal shrink-0" />
            <p className="text-[11px] text-teal font-medium flex-1 truncate">
              Active transaction — {linkedTx.address}
            </p>
            <span className="text-[10px] bg-white text-[#2B4FA0] px-2 py-0.5 rounded-full shrink-0">
              {stageLabel(linkedTx.stage)}
            </span>
            <button
              onClick={() => navigate(`/transactions/${linkedTx.id}`)}
              className="text-[10px] text-teal hover:underline shrink-0 font-medium"
            >
              View →
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConvertOpen(true)}
            className="w-full flex items-center justify-center gap-1.5 px-3 py-2 mb-3 text-[11px] border border-dashed border-teal/50 text-teal rounded-lg hover:bg-[#EEF6F2] transition-colors"
          >
            <Plus size={12} /> Convert to transaction
          </button>
        )}

        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] border border-rule rounded-md text-slate hover:bg-ui-bg transition-colors">
            <Mail size={12} /> Email
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] border border-rule rounded-md text-slate hover:bg-ui-bg transition-colors">
            <MessageSquare size={12} /> SMS
          </button>
          <button
            onClick={() => setDraftOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] bg-rust text-white rounded-md hover:bg-[#B33D24] transition-colors"
          >
            <Sparkles size={12} /> AI Draft
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-white border-b border-rule shrink-0">
        {TABS.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2.5 text-[11px] font-semibold transition-colors border-b-2 ${
              tab === t
                ? 'border-rust text-rust'
                : 'border-transparent text-ink3 hover:text-navy'
            }`}
          >
            {t === 'Messages' && contactMessages[contact.id]?.length > 0 ? (
              <span className="flex items-center justify-center gap-1">
                Messages
                <span className="w-4 h-4 rounded-full bg-rust text-white text-[9px] flex items-center justify-center">
                  {contactMessages[contact.id].filter(m => m.direction === 'in').length || ''}
                </span>
              </span>
            ) : t}
          </button>
        ))}
      </div>

      {/* Body */}
      {tab === 'Overview' ? (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-ink3 mb-2">Contact info</p>
            <div className="bg-white rounded-xl border border-rule px-3">
              <InfoRow label="Budget"       value={budget} />
              <InfoRow label="Areas"        value={contact.areas?.join(', ') ?? '—'} />
              <InfoRow label="Timeline"     value={contact.timeline ?? '—'} />
              <InfoRow label="Source"       value={contact.source ?? '—'} />
              <InfoRow label="Pre-approved" value={contact.preApproved ? `Yes — ${contact.lender}` : 'No'} />
            </div>
          </div>

          {contact.aiSummary && (
            <div className="bg-navy rounded-xl p-4">
              <p className="text-[10px] font-semibold text-white/60 mb-1.5">✦ AI Summary</p>
              <p className="text-[11px] text-white/90 leading-relaxed">{contact.aiSummary}</p>
            </div>
          )}

          <div>
            <p className="text-[10px] uppercase tracking-wider text-ink3 mb-2">Interaction timeline</p>
            <ContactTimeline contactId={contact.id} interactions={interactions} />
          </div>
        </div>
      ) : (
        <MessagesTab contact={contact} />
      )}

      {/* AI Draft dialog */}
      <Dialog open={draftOpen} onOpenChange={setDraftOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-[13px] font-semibold text-navy">
              ✦ AI Draft — {contact.name}
            </DialogTitle>
          </DialogHeader>
          <pre className="whitespace-pre-wrap text-[11px] text-navy bg-ui-bg rounded-lg p-3 leading-relaxed font-sans max-h-64 overflow-y-auto">
            {contact.draftEmail}
          </pre>
          <div className="flex justify-end gap-2 pt-1">
            <button onClick={() => setDraftOpen(false)}
              className="px-3 py-1.5 text-[11px] border border-rule rounded-md text-slate hover:bg-ui-bg">
              Edit draft
            </button>
            <button onClick={() => setDraftOpen(false)}
              className="px-3 py-1.5 text-[11px] bg-rust text-white rounded-md hover:bg-[#B33D24]">
              Send
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Convert to Transaction dialog */}
      <Dialog open={convertOpen} onOpenChange={setConvertOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[13px] font-semibold text-navy">
              Convert to transaction — {contact.name}
            </DialogTitle>
          </DialogHeader>
          <ConvertModal contact={contact} onClose={() => setConvertOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  )
}
