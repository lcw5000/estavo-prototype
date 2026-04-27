// Estavo Prototype — PortalsPage (agent portal preview)
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ExternalLink, Eye } from 'lucide-react'
import { transactions, contacts, agent } from '../data/mockData'
import TransactionTimeline from '../components/portal/TransactionTimeline'
import DocumentsCard from '../components/portal/DocumentsCard'
import MessageCard from '../components/portal/MessageCard'
import PropertyDetailsCard from '../components/portal/PropertyDetailsCard'

function fmtDate(str) {
  if (!str || str === 'TBD') return str ?? '—'
  return new Date(str + 'T12:00:00').toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
  })
}

// Transactions that have an active portal (anything not closed/cancelled)
const portalTxns = transactions.filter(tx =>
  !['closed', 'cancelled', 'withdrawn'].includes(tx.stage ?? tx.status ?? '')
)

export default function PortalsPage() {
  const navigate = useNavigate()
  const [txId, setTxId] = useState(portalTxns[0]?.id ?? null)
  const tx = transactions.find(t => t.id === txId) ?? portalTxns[0]
  const contact = contacts.find(c => c.id === tx?.contactId)

  const closingDate = tx?.estimatedCloseDate
  const daysLeft = closingDate
    ? Math.round((new Date(closingDate + 'T12:00:00') - new Date()) / (1000 * 60 * 60 * 24))
    : null

  if (!tx) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <Eye size={28} className="text-ink3" />
        <p className="text-[13px] font-semibold text-navy">No active portals</p>
        <p className="text-[11px] text-ink3">Client portals appear here once a transaction is active.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Client selector */}
      <div className="flex items-center gap-3">
        <div className="flex gap-2">
          {portalTxns.map(t => {
            const c = contacts.find(x => x.id === t.contactId)
            return (
              <button
                key={t.id}
                onClick={() => setTxId(t.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-[12px] font-medium transition-colors ${
                  txId === t.id
                    ? 'bg-navy text-white'
                    : 'bg-white border border-rule text-slate hover:bg-ui-bg'
                }`}
              >
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[9px] font-semibold shrink-0"
                  style={{ backgroundColor: c?.avatarColor ?? '#888' }}
                >
                  {c?.avatar ?? '?'}
                </div>
                {c?.name ?? t.address}
              </button>
            )
          })}
        </div>
        <div className="ml-auto">
          <button
            onClick={() => navigate(`/portal/${tx.id}?agent=true`)}
            className="flex items-center gap-1.5 text-[11px] border border-rule rounded-md px-3 py-1.5 text-slate hover:bg-ui-bg transition-colors"
          >
            <ExternalLink size={12} /> Open full portal
          </button>
        </div>
      </div>

      {/* Preview frame */}
      <div className="rounded-xl border-2 border-rule overflow-hidden shadow-sm">

        {/* Browser chrome bar */}
        <div className="bg-[#1C3A5E] px-4 py-2.5 flex items-center gap-3">
          <div className="flex gap-1.5 shrink-0">
            <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
            <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
            <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
          </div>
          <div className="flex-1 bg-white/10 rounded px-3 py-1 text-center">
            <span className="text-[10px] text-white/60 select-none">
              estavo.com/portal/{tx.id}
            </span>
          </div>
          <span className="text-[10px] text-white/50 shrink-0 select-none">
            👁 Agent preview
          </span>
        </div>

        {/* Portal nav (client's branded header) */}
        <div className="bg-[#1A2A3A] py-2.5 px-5 flex items-center gap-4">
          <span className="font-display text-[15px] text-white shrink-0">
            Esta<span style={{ color: '#D4A843' }}>v</span>o
          </span>
          <p className="flex-1 text-center text-[11px] text-[#6A8A9A] truncate">{tx.address}</p>
          <span className="text-[11px] text-[#9AB4C4] shrink-0">Your agent: {agent.name}</span>
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[9px] font-semibold shrink-0"
            style={{ backgroundColor: agent.avatarColor }}
          >
            {agent.avatar}
          </div>
        </div>

        {/* Portal content */}
        <div className="bg-[#F8F9FA] p-5">
          <h1 className="font-display text-[20px] text-navy mb-1">
            Welcome back, {contact?.name ?? tx.parties?.buyer?.name} 👋
          </h1>
          <p className="text-[12px] text-[#4A4A4A] mb-5">
            {tx.contractDate ? `Offer accepted ${fmtDate(tx.contractDate)} · ` : ''}
            Estimated closing {fmtDate(closingDate)}
            {daysLeft != null ? ` · ${daysLeft} days to go` : ''}
          </p>

          <div className="grid grid-cols-[2fr_1fr] gap-4">
            <div className="space-y-4">
              <TransactionTimeline milestones={tx.milestones} />
              <DocumentsCard documents={tx.documents} />
            </div>
            <div className="space-y-4">
              <MessageCard messages={tx.messages ?? []} agent={agent} />
              <PropertyDetailsCard transaction={tx} agent={agent} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
