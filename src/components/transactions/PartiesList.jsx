// Estavo Prototype — PartiesList
import { Phone, Mail, MessageSquare } from 'lucide-react'

const ROLE_LABELS = {
  buyer:        'Buyer',
  seller:       'Seller',
  escrowOfficer:'Escrow Officer',
  titleOfficer: 'Title Officer',
  lender:       'Lender',
  inspector:    'Inspector',
  listingAgent: 'Listing Agent',
}

function PartyCard({ role, party, onToast }) {
  return (
    <div className="bg-white rounded-lg border border-rule p-3">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-ink3 mb-1">
        {ROLE_LABELS[role] ?? role}
      </p>
      <p className="text-[13px] font-semibold text-navy leading-tight">{party.name}</p>
      {party.company && <p className="text-[11px] text-[#8A8A8A] mt-0.5">{party.company}</p>}
      <div className="mt-1.5 space-y-0.5">
        {party.phone && <p className="text-[11px] text-slate">{party.phone}</p>}
        {party.email && <p className="text-[11px] text-slate truncate">{party.email}</p>}
      </div>
      <div className="flex gap-1.5 mt-2.5">
        <button onClick={() => onToast(`Calling ${party.name}…`)}
          className="p-1.5 rounded-md border border-rule text-ink3 hover:text-navy hover:bg-ui-bg transition-colors">
          <Phone size={12} />
        </button>
        <button onClick={() => onToast(`Opening email to ${party.email}…`)}
          className="p-1.5 rounded-md border border-rule text-ink3 hover:text-navy hover:bg-ui-bg transition-colors">
          <Mail size={12} />
        </button>
        <button onClick={() => onToast(`SMS to ${party.name}…`)}
          className="p-1.5 rounded-md border border-rule text-ink3 hover:text-navy hover:bg-ui-bg transition-colors">
          <MessageSquare size={12} />
        </button>
      </div>
    </div>
  )
}

export default function PartiesList({ parties, onToast }) {
  const entries = Object.entries(parties).filter(([, p]) => p != null)
  return (
    <div className="grid grid-cols-2 gap-3">
      {entries.map(([role, party]) => (
        <PartyCard key={role} role={role} party={party} onToast={onToast} />
      ))}
    </div>
  )
}
