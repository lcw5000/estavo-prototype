// Estavo Prototype — CommissionPage
import { useState } from 'react'
import { Download } from 'lucide-react'
import { commissionSummary } from '../data/mockData'

function fmt(val) {
  if (val == null) return '—'
  return '$' + val.toLocaleString()
}

function fmtDate(str) {
  return new Date(str + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function statusBadge(status) {
  const map = {
    paid:        { cls: 'bg-[#EEF6F2] text-teal',        label: 'Paid' },
    pending:     { cls: 'bg-[#FEF8EC] text-[#9A6A10]',   label: 'Pending' },
    in_progress: { cls: 'bg-[#EEF2FC] text-[#2B4FA0]',   label: 'In progress' },
  }
  return map[status] ?? { cls: 'bg-[#F5F5F5] text-[#8A8A8A]', label: status }
}

function Toast({ msg }) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-navy text-white text-[12px] px-4 py-2.5 rounded-xl shadow-lg animate-page-in">
      {msg}
    </div>
  )
}

const cs = commissionSummary

export default function CommissionPage() {
  const [toast, setToast] = useState(null)

  function showToast(msg) {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  const capPct = Math.min((cs.capPaid / cs.capAmount) * 100, 100)

  const totalGross = cs.deals.reduce((s, d) => s + (d.grossCommission ?? 0), 0)
  const totalNet   = cs.deals.reduce((s, d) => s + (d.netCommission ?? 0), 0)

  return (
    <div className="space-y-4">
      {/* KPI cards */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'YTD GCI',          value: fmt(cs.ytdGCI),          sub: `${cs.ytdDeals} deals closed` },
          { label: 'Closed deals',      value: cs.ytdDeals,              sub: 'This year' },
          { label: 'Pipeline value',    value: fmt(cs.pipelineValue),   sub: `${cs.pipelineDeals} active deals` },
          { label: 'Projected annual',  value: fmt(cs.projectedAnnual), sub: 'Based on current pace' },
        ].map(kpi => (
          <div key={kpi.label} className="bg-white border border-rule rounded-xl p-4">
            <p className="text-[10px] uppercase tracking-wider text-ink3 mb-1.5">{kpi.label}</p>
            <p className="text-[22px] font-semibold text-navy leading-none mb-1">{kpi.value}</p>
            <p className="text-[10px] text-ink3">{kpi.sub}</p>
          </div>
        ))}
      </div>

      {/* Cap tracker */}
      <div className="bg-white rounded-xl border border-rule p-5">
        <p className="text-[13px] font-semibold text-navy mb-0.5">Commission Cap Tracker</p>
        <p className="text-[11px] text-ink3 mb-4">Based on your $24,000 annual cap with RE/MAX Gold</p>
        <div className="bg-[#F2F0EC] rounded-full h-4 w-full overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{
              width: `${capPct}%`,
              background: 'linear-gradient(to right, #1A5C4A, #C84B2F)',
            }}
          />
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-[11px] text-ink3">{fmt(cs.capPaid)} paid</span>
          <span className="text-[11px] text-ink3">{fmt(cs.capRemaining)} remaining</span>
        </div>
        <p className="text-[12px] text-ink3 mt-1">
          Projected cap date: {fmtDate(cs.capReachedDate)}
        </p>
      </div>

      {/* Deals table */}
      <div className="bg-white rounded-xl border border-rule overflow-hidden">
        <div className="px-5 py-3 border-b border-rule flex items-center justify-between">
          <p className="text-[13px] font-semibold text-navy">Deal history · 2026</p>
        </div>
        <table className="w-full text-[12px]">
          <thead>
            <tr className="bg-ui-bg border-b border-rule">
              {['Address', 'Type', 'Stage', 'Close Date', 'Gross Commission', 'Net Commission', 'Status'].map(h => (
                <th key={h} className="text-left px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-ink3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cs.deals.map((deal, i) => {
              const { cls, label } = statusBadge(deal.status)
              return (
                <tr key={deal.id} className={`border-b border-[#F5F5F5] last:border-0 ${i % 2 === 1 ? 'bg-[#FAFAFA]' : ''}`}>
                  <td className="px-4 py-2.5 font-medium text-navy">{deal.address}</td>
                  <td className="px-4 py-2.5 text-slate capitalize">{deal.type}</td>
                  <td className="px-4 py-2.5 text-slate capitalize">{deal.stage}</td>
                  <td className="px-4 py-2.5 text-slate">{fmtDate(deal.closeDate)}</td>
                  <td className="px-4 py-2.5 text-navy">{fmt(deal.grossCommission)}</td>
                  <td className="px-4 py-2.5 text-navy">{fmt(deal.netCommission)}</td>
                  <td className="px-4 py-2.5">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${cls}`}>{label}</span>
                  </td>
                </tr>
              )
            })}
          </tbody>
          <tfoot>
            <tr className="bg-ui-bg border-t border-rule font-semibold">
              <td colSpan={4} className="px-4 py-2.5 text-[11px] text-navy">Totals</td>
              <td className="px-4 py-2.5 text-[11px] text-navy">{fmt(totalGross)}</td>
              <td className="px-4 py-2.5 text-[11px] text-navy">{fmt(totalNet)}</td>
              <td />
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Export */}
      <div className="flex justify-end">
        <button
          onClick={() => showToast('CSV exported — open your Downloads folder.')}
          className="flex items-center gap-2 px-3 py-1.5 text-[11px] border border-rule rounded-md text-slate hover:bg-ui-bg transition-colors"
        >
          <Download size={13} />
          Export to QuickBooks CSV
        </button>
      </div>

      {toast && <Toast msg={toast} />}
    </div>
  )
}
