// Estavo Prototype — TransactionsPage
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LayoutGrid, List } from 'lucide-react'
import { transactions, contacts } from '../data/mockData'
import TransactionCard from '../components/transactions/TransactionCard'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog'

function stageLabel(s) { return s.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) }

function Toast({ msg, onDone }) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-navy text-white text-[12px] px-4 py-2.5 rounded-xl shadow-lg animate-page-in">
      {msg}
    </div>
  )
}

export default function TransactionsPage() {
  const navigate = useNavigate()
  const [view, setView] = useState('card')
  const [showNew, setShowNew] = useState(false)
  const [txList, setTxList] = useState(transactions)
  const [toast, setToast] = useState(null)

  // New transaction form state
  const [form, setForm] = useState({
    contactId: contacts[0]?.id ?? '',
    address: '',
    type: 'buy',
    stage: 'pre-offer',
    estimatedCloseDate: '',
  })

  function showToast(msg) {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  function createTransaction() {
    const contact = contacts.find(c => c.id === form.contactId)
    const newTx = {
      id: `txn-${Date.now()}`,
      contactId: form.contactId,
      address: form.address,
      city: 'San Francisco', state: 'CA', zip: '',
      propertyType: 'SFR', mlsId: '',
      type: form.type,
      stage: form.stage,
      riskLevel: 'green', riskReason: null,
      listPrice: null, offerPrice: null, acceptedPrice: null,
      daysToClose: null, estimatedCloseDate: form.estimatedCloseDate || null,
      parties: { buyer: { name: contact?.name ?? 'Unknown', contactId: form.contactId } },
      milestones: [], documents: [], deadlines: [], aiMonitor: [], notes: [],
    }
    setTxList([newTx, ...txList])
    setShowNew(false)
    showToast('Transaction created')
  }

  const active  = txList.filter(t => t.stage !== 'closed')
  const closing = txList.filter(t => t.estimatedCloseDate?.startsWith('2026-06'))
  const atRisk  = txList.filter(t => t.riskLevel === 'red' || t.riskLevel === 'amber')

  return (
    <div>
      {/* Stats header */}
      <div className="bg-white border-b border-rule px-6 py-3 flex items-center gap-0 -mx-6 -mt-8 mb-6">
        {[
          { label: 'Active deals',       value: active.length },
          { label: 'Closing this month', value: closing.length },
          { label: 'Pipeline value',     value: '$43,875' },
          { label: 'At risk',            value: atRisk.length, risk: true },
        ].map((stat, i) => (
          <div key={stat.label} className={`flex items-center gap-3 px-6 ${i > 0 ? 'border-l border-rule' : ''}`}>
            {stat.risk && <div className="w-2 h-2 rounded-full bg-gold" />}
            <span className="text-[12px] text-ink3">{stat.label}</span>
            <span className="text-[12px] font-semibold text-navy">{stat.value}</span>
          </div>
        ))}

        <div className="ml-auto flex items-center gap-1.5 px-6">
          <button onClick={() => setView('card')}
            className={`p-1.5 rounded transition-colors ${view === 'card' ? 'bg-navy text-white' : 'text-ink3 hover:text-navy'}`}>
            <LayoutGrid size={14} />
          </button>
          <button onClick={() => setView('table')}
            className={`p-1.5 rounded transition-colors ${view === 'table' ? 'bg-navy text-white' : 'text-ink3 hover:text-navy'}`}>
            <List size={14} />
          </button>
        </div>
      </div>

      {/* New Transaction button */}
      <div className="flex justify-end mb-4">
        <button onClick={() => setShowNew(true)}
          className="px-3 py-1.5 text-sub text-white bg-rust rounded-md font-medium hover:bg-[#B33D24] transition-colors">
          + New transaction
        </button>
      </div>

      {/* Card view */}
      {view === 'card' && (
        <div className="grid grid-cols-2 gap-4">
          {txList.map(tx => <TransactionCard key={tx.id} transaction={tx} />)}
        </div>
      )}

      {/* Table view */}
      {view === 'table' && (
        <div className="bg-white rounded-xl border border-rule overflow-hidden">
          <table className="w-full text-[12px]">
            <thead>
              <tr className="border-b border-rule bg-ui-bg">
                {['Address', 'Buyer/Seller', 'Stage', 'Risk', 'Days to Close', 'Docs', 'Next Action'].map(h => (
                  <th key={h} className="text-left px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-ink3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {txList.map((tx, i) => {
                const urgent = tx.aiMonitor?.find(a => ['deadline', 'risk'].includes(a.type))
                const docsOk = tx.documents?.filter(d => ['signed','received'].includes(d.status)).length ?? 0
                return (
                  <tr key={tx.id} onClick={() => navigate(`/transactions/${tx.id}`)}
                    className={`cursor-pointer hover:bg-[#FAFAF8] transition-colors border-b border-[#F5F5F5] last:border-0 ${i % 2 === 1 ? 'bg-[#FAFAFA]' : 'bg-white'}`}>
                    <td className="px-4 py-2.5 font-medium text-navy">{tx.address}</td>
                    <td className="px-4 py-2.5 text-slate">{tx.parties?.buyer?.name ?? '—'}</td>
                    <td className="px-4 py-2.5">
                      <span className="px-2 py-0.5 rounded-full bg-[#EEF2FC] text-[#2B4FA0] text-[10px]">
                        {stageLabel(tx.stage)}
                      </span>
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="w-2 h-2 rounded-full" style={{
                        backgroundColor: tx.riskLevel === 'red' ? '#C84B2F' : tx.riskLevel === 'amber' ? '#C49A3C' : '#1A5C4A'
                      }} />
                    </td>
                    <td className="px-4 py-2.5 text-slate">{tx.daysToClose ?? '—'}</td>
                    <td className="px-4 py-2.5 text-slate">{docsOk}/{tx.documents?.length ?? 0}</td>
                    <td className="px-4 py-2.5 text-slate max-w-[200px] truncate">
                      {urgent ? urgent.message.slice(0, 50) + '…' : 'No urgent actions'}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* New transaction modal */}
      <Dialog open={showNew} onOpenChange={setShowNew}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[13px] font-semibold text-navy">Open new transaction</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <label className="text-[10px] uppercase tracking-wider text-ink3 block mb-1">Contact</label>
              <select value={form.contactId} onChange={e => setForm(f => ({ ...f, contactId: e.target.value }))}
                className="w-full text-[12px] border border-rule rounded-md px-2.5 py-2 outline-none bg-white focus:ring-1 focus:ring-rust/30">
                {contacts.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-wider text-ink3 block mb-1">Property address</label>
              <input value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                placeholder="123 Main St, San Francisco CA"
                className="w-full text-[12px] border border-rule rounded-md px-2.5 py-2 outline-none focus:ring-1 focus:ring-rust/30" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] uppercase tracking-wider text-ink3 block mb-1">Transaction type</label>
                <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                  className="w-full text-[12px] border border-rule rounded-md px-2.5 py-2 outline-none bg-white focus:ring-1 focus:ring-rust/30">
                  <option value="buy">Buying</option>
                  <option value="sell">Selling</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-wider text-ink3 block mb-1">Current stage</label>
                <select value={form.stage} onChange={e => setForm(f => ({ ...f, stage: e.target.value }))}
                  className="w-full text-[12px] border border-rule rounded-md px-2.5 py-2 outline-none bg-white focus:ring-1 focus:ring-rust/30">
                  {['pre-offer','offer','inspection','contingency','clear_to_close'].map(s => (
                    <option key={s} value={s}>{stageLabel(s)}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-wider text-ink3 block mb-1">Estimated closing date</label>
              <input type="date" value={form.estimatedCloseDate}
                onChange={e => setForm(f => ({ ...f, estimatedCloseDate: e.target.value }))}
                className="w-full text-[12px] border border-rule rounded-md px-2.5 py-2 outline-none focus:ring-1 focus:ring-rust/30" />
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button onClick={() => setShowNew(false)}
                className="px-3 py-1.5 text-[11px] border border-rule rounded-md text-slate hover:bg-ui-bg">
                Cancel
              </button>
              <button onClick={createTransaction}
                className="px-3 py-1.5 text-[11px] bg-rust text-white rounded-md hover:bg-[#B33D24]">
                Create transaction
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {toast && <Toast msg={toast} />}
    </div>
  )
}
