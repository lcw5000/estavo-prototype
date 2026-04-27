// Estavo Prototype — DashboardPage
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { kpis, contacts, transactions, interactions } from '../data/mockData'
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

function typeIcon(type) {
  const map = { email_opened: '✉️', lead_created: '⚡', listing_saved: '🏠', campaign_stat: '📣', document_signed: '✍️', sms_replied: '💬', showing_attended: '🏡' }
  return map[type] ?? '·'
}

export default function DashboardPage() {
  const navigate = useNavigate()
  const [bottomTab, setBottomTab] = useState('deals')

  return (
    <>
      {/* ── Mobile layout — fixed app panels, zero page scroll ── */}
      <div className="md:hidden h-full overflow-hidden flex flex-col bg-paper">

        {/* KPI strip — horizontal scroll */}
        <div className="shrink-0 px-3 pt-3 pb-2">
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {[
              { label: 'Hot leads',   value: kpis.hotLeads.value,   delta: kpis.hotLeads.delta,   color: '#C84B2F' },
              { label: 'Pipeline',    value: kpis.pipeline.value,   delta: kpis.pipeline.delta,   color: '#1A5C4A' },
              { label: 'GCI — April', value: kpis.gciMonth.value,   delta: kpis.gciMonth.delta,   color: '#2B4FA0' },
              { label: 'Showings',    value: kpis.showings.value,   delta: kpis.showings.delta,   color: '#C49A3C' },
            ].map(k => (
              <div key={k.label} className="bg-white border border-rule rounded-xl px-3 py-2.5 shrink-0 min-w-[110px]">
                <p className="text-[10px] text-ink3 mb-0.5 whitespace-nowrap">{k.label}</p>
                <p className="text-[18px] font-semibold leading-tight" style={{ color: k.color }}>{k.value}</p>
                <p className="text-[10px] text-ink3 mt-0.5">{k.delta}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Priority contacts — fills remaining space, scrolls internally */}
        <div className="flex-1 min-h-0 mx-3 bg-white rounded-xl border border-rule flex flex-col overflow-hidden">
          <div className="shrink-0 px-4 py-2.5 border-b border-rule flex items-center justify-between">
            <p className="text-[12px] font-semibold text-navy">🔥 Priority contacts</p>
            <button onClick={() => navigate('/contacts')} className="text-[10px] text-rust">
              View all →
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-3 py-1">
            {priorityContacts.map(contact => (
              <LeadRow key={contact.id} contact={contact} onClick={id => navigate(`/contacts/${id}`)} />
            ))}
          </div>
        </div>

        {/* Bottom tabbed panel — fixed height */}
        <div className="shrink-0 mx-3 mt-2 mb-2 bg-white rounded-xl border border-rule overflow-hidden" style={{ height: 180 }}>
          {/* Tab bar */}
          <div className="flex border-b border-rule">
            {[['deals', '📋 Deals'], ['activity', '⚡ Activity']].map(([id, label]) => (
              <button
                key={id}
                onClick={() => setBottomTab(id)}
                className={`flex-1 py-2 text-[11px] font-semibold border-b-2 transition-colors ${
                  bottomTab === id ? 'border-rust text-rust' : 'border-transparent text-ink3'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="overflow-y-auto" style={{ height: 140 }}>
            {bottomTab === 'deals' ? (
              <div className="divide-y divide-[#F5F5F5]">
                {transactions.map(tx => (
                  <div
                    key={tx.id}
                    onClick={() => navigate(`/transactions/${tx.id}`)}
                    className="flex items-center gap-3 px-4 py-2.5 cursor-pointer hover:bg-ui-bg transition-colors"
                  >
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: riskColor(tx.riskLevel) }} />
                    <p className="text-[12px] text-navy font-medium flex-1 truncate">{tx.address}</p>
                    <span className="text-[10px] bg-[#EEF2FC] text-[#2B4FA0] px-2 py-0.5 rounded-full shrink-0">
                      {stageLabel(tx.stage)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="divide-y divide-[#F5F5F5]">
                {interactions.slice(0, 6).map(item => (
                  <div key={item.id} className="flex items-start gap-2.5 px-4 py-2.5">
                    <span className="text-[13px] mt-0.5 shrink-0">{typeIcon(item.type)}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] text-navy leading-tight truncate">{item.description}</p>
                      <p className="text-[10px] text-ink3 mt-0.5">{item.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
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
