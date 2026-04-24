// Estavo Prototype — TransactionDetailPage
import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { transactions } from '../data/mockData'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import TransactionTimeline from '../components/transactions/TransactionTimeline'
import DocumentChecklist from '../components/transactions/DocumentChecklist'
import DeadlineTracker from '../components/transactions/DeadlineTracker'
import PartiesList from '../components/transactions/PartiesList'
import AiMonitorFeed from '../components/transactions/AiMonitorFeed'
import NotesPanel from '../components/transactions/NotesPanel'
import CommissionPanel from '../components/transactions/CommissionPanel'
import EnvelopesTab from '../components/signatures/EnvelopesTab'
import SignatureEnvelopeModal from '../components/signatures/SignatureEnvelopeModal'

function fmt(val) {
  if (val == null) return '—'
  return '$' + val.toLocaleString()
}

function riskColor(r) {
  if (r === 'red')   return '#C84B2F'
  if (r === 'amber') return '#C49A3C'
  return '#1A5C4A'
}

function daysStyle(days) {
  if (days == null || days > 14) return 'bg-[#EEF6F2] text-teal'
  if (days <= 7)   return 'bg-[#FDF0EE] text-rust'
  return 'bg-[#FEF8EC] text-[#9A6A10]'
}

function stageLabel(s) {
  return s.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

function Toast({ msg }) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-navy text-white text-[12px] px-4 py-2.5 rounded-xl shadow-lg animate-page-in">
      {msg}
    </div>
  )
}

export default function TransactionDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [toast, setToast] = useState(null)
  const [sigModalDoc, setSigModalDoc] = useState(null)

  const tx = transactions.find(t => t.id === id)

  function showToast(msg) {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  if (!tx) {
    return (
      <div className="flex items-center justify-center h-64 text-ink3">
        Transaction not found.
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full -mt-8 -mx-6">
      {/* Header */}
      <div className="bg-white border-b border-rule px-6 py-4 shrink-0">
        <div className="flex items-start justify-between gap-4 mb-2">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <button onClick={() => navigate('/transactions')}
                className="text-ink3 hover:text-navy transition-colors">
                <ArrowLeft size={15} />
              </button>
              <h1 className="text-[18px] font-semibold text-navy">{tx.address}</h1>
            </div>
            <p className="text-[12px] text-[#8A8A8A] ml-5">
              {tx.city}, {tx.state} {tx.zip} · MLS {tx.mlsId}
            </p>
          </div>

          {/* Centre badges */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[11px] bg-[#EEF2FC] text-[#2B4FA0] px-3 py-1 rounded-full font-medium">
              {stageLabel(tx.stage)}
            </span>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: riskColor(tx.riskLevel) }} />
              {tx.riskReason && <span className="text-[10px] text-ink3 max-w-[160px] truncate">{tx.riskReason}</span>}
            </div>
            {tx.daysToClose != null && (
              <span className={`text-[11px] px-3 py-1 rounded-full font-medium ${daysStyle(tx.daysToClose)}`}>
                {tx.daysToClose} days to close
              </span>
            )}
          </div>

          {/* Quick actions */}
          <div className="flex items-center gap-2 shrink-0">
            <button onClick={() => showToast('Document upload opened')}
              className="px-3 py-1.5 text-[11px] border border-rule rounded-md text-slate hover:bg-ui-bg transition-colors">
              Add document
            </button>
            <button onClick={() => showToast('Note added')}
              className="px-3 py-1.5 text-[11px] border border-rule rounded-md text-slate hover:bg-ui-bg transition-colors">
              Log note
            </button>
            <button onClick={() => showToast(`Messaging ${tx.parties.buyer?.name}…`)}
              className="px-3 py-1.5 text-[11px] bg-rust text-white rounded-md hover:bg-[#B33D24] transition-colors">
              Message client
            </button>
          </div>
        </div>

        <p className="text-[11px] text-[#8A8A8A] ml-5">
          {tx.parties.buyer?.name} · Agent: Sarah Chen
          {tx.offerPrice && ` · Offer: ${fmt(tx.offerPrice)}`}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex-1 overflow-hidden">
        <Tabs defaultValue="timeline" className="flex flex-col h-full">
          <TabsList className="bg-ui-bg border-b border-rule rounded-none px-6 justify-start h-auto py-0 shrink-0">
            {['timeline','documents','signatures','deadlines','parties','ai-monitor','notes','commission'].map(tab => (
              <TabsTrigger key={tab} value={tab}
                className="text-[12px] capitalize py-2.5 px-3 rounded-none border-b-2 border-transparent data-[state=active]:border-rust data-[state=active]:text-rust data-[state=active]:bg-transparent data-[state=active]:shadow-none">
                {tab === 'ai-monitor' ? 'AI Monitor' : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="flex-1 overflow-y-auto px-6 py-5">
            <TabsContent value="timeline" className="mt-0">
              <TransactionTimeline milestones={tx.milestones} />
            </TabsContent>

            <TabsContent value="documents" className="mt-0">
              <DocumentChecklist documents={tx.documents} onToast={showToast} onRequestSig={doc => setSigModalDoc(doc)} />
            </TabsContent>

            <TabsContent value="signatures" className="mt-0">
              <EnvelopesTab transaction={tx} onToast={showToast} />
            </TabsContent>

            <TabsContent value="deadlines" className="mt-0">
              <DeadlineTracker deadlines={tx.deadlines} onToast={showToast} />
            </TabsContent>

            <TabsContent value="parties" className="mt-0">
              <PartiesList parties={tx.parties} onToast={showToast} />
            </TabsContent>

            <TabsContent value="ai-monitor" className="mt-0">
              <AiMonitorFeed items={tx.aiMonitor} />
            </TabsContent>

            <TabsContent value="notes" className="mt-0">
              <NotesPanel initialNotes={tx.notes} />
            </TabsContent>

            <TabsContent value="commission" className="mt-0">
              <CommissionPanel transaction={tx} />
            </TabsContent>
          </div>
        </Tabs>
      </div>

      {toast && <Toast msg={toast} />}

      <SignatureEnvelopeModal
        open={!!sigModalDoc}
        onOpenChange={open => !open && setSigModalDoc(null)}
        transaction={tx}
        preSelectedDocIds={sigModalDoc ? [sigModalDoc.id] : []}
        onSent={() => {
          setSigModalDoc(null)
          showToast('Envelope sent · signers notified by email')
        }}
      />
    </div>
  )
}
