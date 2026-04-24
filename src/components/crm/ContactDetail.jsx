// Estavo Prototype — ContactDetail
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, Mail, MessageSquare, Sparkles, Home } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import ContactTimeline from './ContactTimeline'
import { transactions } from '../../data/mockData'

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

export default function ContactDetail({ contact, interactions, autoDraft }) {
  const navigate = useNavigate()
  const [draftOpen, setDraftOpen] = useState(false)
  const linkedTx = contact ? transactions.find(t => t.contactId === contact.id) : null

  useEffect(() => {
    if (autoDraft && contact) setDraftOpen(true)
  }, [autoDraft, contact?.id])

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

        {linkedTx && (
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

      {/* Body */}
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

        <div>
          <p className="text-[10px] uppercase tracking-wider text-ink3 mb-2">Interaction timeline</p>
          <ContactTimeline contactId={contact.id} interactions={interactions} />
        </div>
      </div>

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
    </div>
  )
}
