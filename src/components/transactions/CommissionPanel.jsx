// Estavo Prototype — CommissionPanel
import { useState } from 'react'

function fmt(val) {
  if (val == null) return '—'
  return '$' + val.toLocaleString()
}

function InfoRow({ label, value, italic }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-[#F5F5F5] last:border-0">
      <span className="text-[10px] text-ink3 uppercase tracking-wider">{label}</span>
      <span className={`text-[11px] text-navy font-medium ${italic ? 'italic text-ink3' : ''}`}>
        {value}
      </span>
    </div>
  )
}

export default function CommissionPanel({ transaction: tx }) {
  const [expenses, setExpenses] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [expDesc, setExpDesc] = useState('')
  const [expAmt, setExpAmt] = useState('')
  const [expCat, setExpCat] = useState('Photography')

  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0)
  const netAfterExpenses = tx.agentNetCommission != null ? tx.agentNetCommission - totalExpenses : null

  function addExpense() {
    if (!expDesc || !expAmt) return
    setExpenses([...expenses, { id: Date.now(), desc: expDesc, amount: parseFloat(expAmt), category: expCat }])
    setExpDesc(''); setExpAmt(''); setShowForm(false)
  }

  return (
    <div className="space-y-4">
      {/* Financial summary */}
      <div className="bg-white rounded-xl border border-rule px-4">
        <InfoRow label="List price"         value={fmt(tx.listPrice)} />
        <InfoRow label="Offer price"        value={fmt(tx.offerPrice)} />
        <InfoRow label="Accepted price"     value={tx.acceptedPrice ? fmt(tx.acceptedPrice) : <span className="italic text-ink3 text-[11px]">Pending</span>} />
        <InfoRow label="Commission %"       value={tx.commissionPct ? `${tx.commissionPct}%` : '—'} />
        <InfoRow label="Gross commission"   value={tx.grossCommission ? fmt(tx.grossCommission) : <span className="italic text-ink3 text-[11px]">Pending</span>} />
        <InfoRow label="Brokerage split"    value={tx.brokerageSplit ? `${tx.brokerageSplit}%` : '—'} />
        <InfoRow label="Agent net commission" value={tx.agentNetCommission ? fmt(tx.agentNetCommission) : <span className="italic text-ink3 text-[11px]">Pending</span>} />
      </div>

      {/* Expenses */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-ink3">Expenses</p>
          <button onClick={() => setShowForm(o => !o)}
            className="text-[11px] text-rust hover:underline">
            + Add expense
          </button>
        </div>

        {showForm && (
          <div className="bg-white border border-rule rounded-xl p-3 mb-3 space-y-2">
            <input value={expDesc} onChange={e => setExpDesc(e.target.value)}
              placeholder="Description" className="w-full text-[12px] border border-rule rounded px-2.5 py-1.5 outline-none focus:ring-1 focus:ring-rust/30" />
            <div className="flex gap-2">
              <input type="number" value={expAmt} onChange={e => setExpAmt(e.target.value)}
                placeholder="Amount ($)" className="flex-1 text-[12px] border border-rule rounded px-2.5 py-1.5 outline-none focus:ring-1 focus:ring-rust/30" />
              <select value={expCat} onChange={e => setExpCat(e.target.value)}
                className="flex-1 text-[12px] border border-rule rounded px-2.5 py-1.5 outline-none bg-white">
                {['Photography', 'Staging', 'Marketing', 'Inspection', 'Other'].map(c => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowForm(false)} className="text-[11px] text-slate">Cancel</button>
              <button onClick={addExpense} className="text-[11px] bg-rust text-white rounded px-3 py-1 hover:bg-[#B33D24]">Add</button>
            </div>
          </div>
        )}

        {expenses.length > 0 ? (
          <div className="bg-white rounded-xl border border-rule px-4">
            {expenses.map(e => (
              <div key={e.id} className="flex items-center justify-between py-2 border-b border-[#F5F5F5] last:border-0">
                <div>
                  <p className="text-[12px] text-navy">{e.desc}</p>
                  <p className="text-[10px] text-ink3">{e.category}</p>
                </div>
                <p className="text-[12px] text-navy font-medium">{fmt(e.amount)}</p>
              </div>
            ))}
            <div className="flex justify-between py-2 font-semibold">
              <span className="text-[11px] text-navy">Total expenses</span>
              <span className="text-[11px] text-navy">{fmt(totalExpenses)}</span>
            </div>
          </div>
        ) : (
          <p className="text-[12px] text-ink3 text-center py-4 bg-white rounded-xl border border-rule">No expenses added yet.</p>
        )}
      </div>

      {/* Net commission box */}
      <div className="bg-[#EEF6F2] rounded-lg p-4 text-center">
        <p className="text-[10px] text-teal uppercase tracking-wider font-semibold mb-1">Your net commission</p>
        <p className="text-[28px] font-semibold text-teal leading-none">
          {netAfterExpenses != null ? fmt(netAfterExpenses) : '—'}
        </p>
        {netAfterExpenses == null && (
          <p className="text-[11px] text-teal/70 mt-1 italic">Pending accepted offer</p>
        )}
      </div>
    </div>
  )
}
