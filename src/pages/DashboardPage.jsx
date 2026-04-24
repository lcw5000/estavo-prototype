// Estavo Prototype — DashboardPage
import { useRef } from 'react'
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
  const rightColRef = useRef(null)

  return (
    <div className="space-y-3">
      {/* Row 1 — KPI cards */}
      <div className="grid grid-cols-4 gap-3">
        <KpiCard {...kpis.hotLeads} />
        <KpiCard {...kpis.pipeline} />
        <KpiCard {...kpis.gciMonth} />
        <KpiCard {...kpis.showings} onClick={() => navigate('/showings')} />
      </div>

      {/* Row 2 — Main content */}
      <div className="grid grid-cols-[1.6fr_1fr] gap-3">
        {/* Left column */}
        <div className="space-y-3">
          {/* Priority contacts */}
          <div className="bg-white border border-rule rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[12px] font-semibold text-navy">🔥 Priority contacts — AI ranked</p>
              <button onClick={() => navigate('/contacts')} className="text-[10px] text-rust hover:underline">
                View all 68 →
              </button>
            </div>
            <div>
              {priorityContacts.map(contact => (
                <LeadRow key={contact.id} contact={contact} onClick={id => navigate(`/contacts/${id}`)} />
              ))}
            </div>
          </div>

          <PipelineChart />

          {/* Active deals */}
          <div className="bg-white border border-rule rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[12px] font-semibold text-navy">📋 Active deals</p>
              <button onClick={() => navigate('/transactions')} className="text-[10px] text-rust hover:underline">
                View all →
              </button>
            </div>
            <div className="space-y-2">
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

        {/* Right column */}
        <div ref={rightColRef} className="h-full">
          <ActivityFeed />
          <AiActionsPanel containerRef={rightColRef} />
        </div>
      </div>
    </div>
  )
}
