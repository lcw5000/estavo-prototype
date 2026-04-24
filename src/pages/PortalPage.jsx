// Estavo Prototype — PortalPage
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { transactions, contacts, agent } from '../data/mockData'
import PortalNav from '../components/portal/PortalNav'
import TransactionTimeline from '../components/portal/TransactionTimeline'
import DocumentsCard from '../components/portal/DocumentsCard'
import MessageCard from '../components/portal/MessageCard'
import PropertyDetailsCard from '../components/portal/PropertyDetailsCard'

function fmtDate(str) {
  if (!str || str === 'TBD') return str ?? '—'
  return new Date(str + 'T12:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

export default function PortalPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const isAgentPreview = searchParams.get('agent') === 'true'

  const tx = transactions.find(t => t.id === id) ?? transactions[0]
  const contact = contacts.find(c => c.id === tx.contactId)

  const closingDate = tx.estimatedCloseDate
  const daysLeft = closingDate
    ? Math.round((new Date(closingDate + 'T12:00:00') - new Date()) / (1000 * 60 * 60 * 24))
    : null

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <PortalNav
        address={tx.address}
        agent={agent}
        isAgentPreview={isAgentPreview}
        onBackToTransaction={() => navigate(`/transactions/${tx.id}`)}
      />

      <div className="p-6 max-w-5xl mx-auto">
        <h1 className="font-display text-[22px] text-navy mb-1">
          Welcome back, {contact?.name ?? tx.parties?.buyer?.name} 👋
        </h1>
        <p className="text-[13px] text-[#4A4A4A] mb-6">
          {tx.contractDate ? `Offer accepted ${fmtDate(tx.contractDate)} · ` : ''}
          Estimated closing {fmtDate(closingDate)}
          {daysLeft != null ? ` · ${daysLeft} days to go` : ''}
        </p>

        <div className="grid grid-cols-[2fr_1fr] gap-4">
          <div>
            <TransactionTimeline milestones={tx.milestones} />
            <div className="mt-4">
              <DocumentsCard documents={tx.documents} />
            </div>
          </div>
          <div>
            <MessageCard messages={tx.messages ?? []} agent={agent} />
            <div className="mt-4">
              <PropertyDetailsCard transaction={tx} agent={agent} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
