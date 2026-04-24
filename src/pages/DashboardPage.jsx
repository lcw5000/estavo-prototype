// Estavo Prototype — DashboardPage
import { useNavigate } from 'react-router-dom'
import { kpis, contacts, transactions } from '../data/mockData'
import KpiCard from '../components/dashboard/KpiCard'
import LeadRow from '../components/dashboard/LeadRow'
import PipelineChart from '../components/dashboard/PipelineChart'
import ActivityFeed from '../components/dashboard/ActivityFeed'
import AiActionsPanel from '../components/dashboard/AiActionsPanel'

const priorityContacts = [...contacts].sort((a, b) => (b.score ?? -1) - (a.score ?? -1))

function riskColor(r) {
  if (r === 'red')   return '#C84B2F'
  if (r === 'amber') return '#C49A3C'
  return '#1A5C4A'
}

function stageLabel(s) {
  return s.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

export default function DashboardPage() {
  const navigate = useNavigate()

  return (
    <>
      {/* ── Mobile layout (< md) — scrollable single column ── */}
      <div className="md:hidden h-full overflow-y-auto bg-paper px-4 pt-4 pb-4 space-y-3">
        {/* KPI 2×2 */}
        <div className="grid grid-cols-2 gap-2">
          <KpiCard {...kpis.hotLeads} />
          <KpiCard {...kpis.pipeline} />
          <KpiCard {...kpis.gciMonth} />
          <KpiCard {...kpis.showings} onClick={() => navigate('/showings')} />
        </div>

        {/* Priority contacts */}
        <div className="bg-white border border-rule rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[12px] font-semibold text-navy">🔥 Priority contacts</p>
            <button onClick={() => navigate('/contacts')} className="text-[10px] text-rust">View all →</button>
          </div>
          {priorityContacts.slice(0, 3).map(contact => (
            <LeadRow key={contact.id} contact={contact} onClick={id => navigate(`/contacts/${id}`)} />
          ))}
        </div>

        {/* Active deals */}
        <div className="bg-white border border-rule rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[12px] font-semibold text-navy">📋 Active deals</p>
            <button onClick={() => navigate('/transactions')} className="text-[10px] text-rust">View all →</button>
          </div>
          {transactions.map(tx => (
            <div
              key={tx.id}
              onClick={() => navigate(`/transactions/${tx.id}`)}
              className="flex items-center gap-3 py-2 border-b border-[#F5F5F5] last:border-0 cursor-pointer"
            >
              <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: riskColor(tx.riskLevel) }} />
              <p className="text-[12px] text-navy font-medium flex-1 truncate">{tx.address}</p>
              <span className="text-[10px] bg-[#EEF2FC] text-[#2B4FA0] px-2 py-0.5 rounded-full shrink-0">
                {stageLabel(tx.stage)}
              </span>
            </div>
          ))}
        </div>

        {/* AI panel — compact on mobile */}
        <div className="bg-white border border-rule rounded-xl p-4">
          <p className="text-[12px] font-semibold text-navy mb-3">✦ Estavo AI</p>
          <AiActionsPanel mobile />
        </div>

        {/* Activity feed */}
        <ActivityFeed />
      </div>

      {/* ── Desktop layout (≥ md) — fixed 2-col grid ── */}
      <div className="hidden md:flex h-full flex-col bg-paper px-6 pt-6 pb-4 gap-3 overflow-hidden">

        {/* Row 1 — KPI cards */}
        <div className="grid grid-cols-4 gap-3 shrink-0">
          <KpiCard {...kpis.hotLeads} />
          <KpiCard {...kpis.pipeline} />
          <KpiCard {...kpis.gciMonth} />
          <KpiCard {...kpis.showings} onClick={() => navigate('/showings')} />
        </div>

        {/* Row 2 — 2-col grid, rows split 2:3 so pipeline+deals always visible */}
        <div className="flex-1 min-h-0 grid grid-cols-[1.6fr_1fr] grid-rows-[2fr_3fr] gap-3">

          {/* [row1, col1] Priority contacts — scrolls internally */}
          <div className="bg-white border border-rule rounded-xl p-4 flex flex-col min-h-0">
            <div className="flex items-center justify-between mb-3 shrink-0">
              <p className="text-[12px] font-semibold text-navy">🔥 Priority contacts — AI ranked</p>
              <button onClick={() => navigate('/contacts')} className="text-[10px] text-rust hover:underline">
                View all 68 →
              </button>
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto">
              {priorityContacts.map(contact => (
                <LeadRow key={contact.id} contact={contact} onClick={id => navigate(`/contacts/${id}`)} />
              ))}
            </div>
          </div>

          {/* [row1, col2] Recent activity */}
          <ActivityFeed />

          {/* [row2, col1] Pipeline + Active deals */}
          <div className="flex flex-col gap-3 min-h-0">
            <PipelineChart />
            <div className="flex-1 min-h-0 bg-white border border-rule rounded-xl p-4 flex flex-col">
              <div className="flex items-center justify-between mb-3 shrink-0">
                <p className="text-[12px] font-semibold text-navy">📋 Active deals</p>
                <button onClick={() => navigate('/transactions')} className="text-[10px] text-rust hover:underline">
                  View all →
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                {transactions.map(tx => (
                  <div
                    key={tx.id}
                    onClick={() => navigate(`/transactions/${tx.id}`)}
                    className="flex items-center gap-3 py-2 border-b border-[#F5F5F5] last:border-0 cursor-pointer hover:bg-ui-bg -mx-1 px-1 rounded transition-colors"
                  >
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: riskColor(tx.riskLevel) }} />
                    <p className="text-[12px] text-navy font-medium flex-1 truncate">{tx.address}</p>
                    <span className="text-[10px] bg-[#EEF2FC] text-[#2B4FA0] px-2 py-0.5 rounded-full shrink-0">
                      {stageLabel(tx.stage)}
                    </span>
                    <span className="text-[11px] text-ink3 shrink-0">
                      {tx.daysToClose != null ? `${tx.daysToClose}d` : 'TBD'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* [row2, col2] AI panel */}
          <AiActionsPanel />
        </div>
      </div>
    </>
  )
}
