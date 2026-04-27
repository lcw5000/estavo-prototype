// Estavo Prototype — AnalyticsPage
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  LineChart, Line, CartesianGrid,
} from 'recharts'
import { analytics } from '../data/mockData'
import { TrendingUp, Clock, Target, DollarSign } from 'lucide-react'

const { ratios, funnel, gciByMonth, leadSources, responseTime } = analytics

function fmt(v) {
  if (v == null) return '—'
  return '$' + v.toLocaleString()
}

function BarTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-rule rounded-lg shadow-sm px-3 py-2">
      <p className="text-[11px] font-semibold text-navy">{label}</p>
      <p className="text-[11px] text-ink3">{fmt(payload[0]?.value)}</p>
    </div>
  )
}

function LineTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-rule rounded-lg shadow-sm px-3 py-2">
      <p className="text-[11px] font-semibold text-navy">{label}</p>
      <p className="text-[11px] text-ink3">{payload[0]?.value} min avg</p>
    </div>
  )
}

export default function AnalyticsPage() {
  return (
    <div className="space-y-5 max-w-4xl">

      {/* ── KPI strip ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'YTD GCI',           value: fmt(ratios.ytdGCI),           sub: `${ratios.ytdDeals} deals closed`, icon: DollarSign, color: 'text-teal' },
          { label: 'Avg response time', value: `${ratios.avgResponseMin} min`, sub: 'Lead response (Apr)', icon: Clock,       color: 'text-[#2B4FA0]' },
          { label: 'Conversion rate',   value: `${ratios.conversionPct}%`,   sub: 'Lead → closed deal', icon: Target,      color: 'text-rust' },
          { label: 'Avg days to close', value: `${ratios.avgDaysToClose}d`,  sub: 'Contract → closing', icon: TrendingUp,  color: 'text-[#C49A3C]' },
        ].map(kpi => (
          <div key={kpi.label} className="bg-white rounded-xl border border-rule p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-7 h-7 rounded-full bg-ui-bg flex items-center justify-center shrink-0 ${kpi.color}`}>
                <kpi.icon size={13} />
              </div>
              <p className="text-[10px] text-ink3 leading-tight">{kpi.label}</p>
            </div>
            <p className={`text-[22px] font-semibold leading-tight ${kpi.color}`}>{kpi.value}</p>
            <p className="text-[10px] text-ink3 mt-0.5">{kpi.sub}</p>
          </div>
        ))}
      </div>

      {/* ── GCI by month + Funnel ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* GCI by month */}
        <div className="bg-white rounded-xl border border-rule p-5">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[13px] font-semibold text-navy">GCI by month</p>
            <div className="flex items-center gap-3 text-[10px] text-ink3">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-teal inline-block" /> Actual</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-[#D0D8E8] inline-block" /> Projected</span>
            </div>
          </div>
          <p className="text-[10px] text-ink3 mb-4">Projected based on pipeline value</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={gciByMonth} barSize={26} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#8A8A8A' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#8A8A8A' }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<BarTooltip />} cursor={{ fill: '#F5F5F5' }} />
              <Bar dataKey="gci" radius={[4, 4, 0, 0]}>
                {gciByMonth.map((d, i) => (
                  <Cell key={i} fill={d.projected ? '#D0D8E8' : '#1A5C4A'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Conversion funnel */}
        <div className="bg-white rounded-xl border border-rule p-5">
          <p className="text-[13px] font-semibold text-navy mb-1">Lead conversion funnel</p>
          <p className="text-[10px] text-ink3 mb-4">Year to date · 42 leads in</p>
          <div className="space-y-2.5">
            {funnel.map((f, i) => (
              <div key={f.stage}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] text-navy">{f.stage}</span>
                  <span className="text-[11px] font-semibold text-navy">{f.count}</span>
                </div>
                <div className="h-2 bg-[#F0EDE8] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${f.pct}%`,
                      backgroundColor: i === funnel.length - 1 ? '#1A5C4A' : i <= 1 ? '#1F2E4A' : i <= 3 ? '#2B4FA0' : '#C84B2F',
                    }}
                  />
                </div>
                {i < funnel.length - 1 && (
                  <p className="text-[10px] text-ink3 mt-0.5 text-right">
                    {Math.round((funnel[i + 1].count / f.count) * 100)}% advance
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Response time trend ── */}
      <div className="bg-white rounded-xl border border-rule p-5">
        <p className="text-[13px] font-semibold text-navy mb-1">Lead response time trend</p>
        <p className="text-[10px] text-ink3 mb-4">Average minutes from lead received to first contact</p>
        <ResponsiveContainer width="100%" height={140}>
          <LineChart data={responseTime} margin={{ top: 4, right: 16, left: -16, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F0EDE8" />
            <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#8A8A8A' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: '#8A8A8A' }} axisLine={false} tickLine={false} />
            <Tooltip content={<LineTooltip />} />
            <Line type="monotone" dataKey="avgMin" stroke="#2B4FA0" strokeWidth={2} dot={{ fill: '#2B4FA0', r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* ── Lead source ROI ── */}
      <div className="bg-white rounded-xl border border-rule overflow-hidden">
        <div className="px-5 py-3 border-b border-rule">
          <p className="text-[13px] font-semibold text-navy">Lead source performance</p>
        </div>
        <table className="w-full text-[12px]">
          <thead>
            <tr className="bg-ui-bg border-b border-rule">
              {['Source', 'Leads', 'Closed', 'GCI earned', 'Monthly cost', 'Cost/deal'].map(h => (
                <th key={h} className="text-left px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-ink3 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {leadSources.map(src => {
              const costPerDeal = src.closedDeals > 0 && src.costPerMonth > 0
                ? fmt(Math.round((src.costPerMonth * 12) / src.closedDeals))
                : src.costPerMonth === 0 ? '—' : 'No closes yet'
              const roiColor = src.closedDeals > 0 ? 'text-teal' : 'text-ink3'
              return (
                <tr key={src.source} className="border-b border-[#F5F5F5] last:border-0 hover:bg-[#FAFAFA] transition-colors">
                  <td className="px-4 py-3 font-medium text-navy">{src.source}</td>
                  <td className="px-4 py-3 text-slate">{src.leads}</td>
                  <td className="px-4 py-3 text-navy font-medium">{src.closedDeals}</td>
                  <td className={`px-4 py-3 font-medium ${roiColor}`}>{fmt(src.gci)}</td>
                  <td className="px-4 py-3 text-slate">{src.costPerMonth > 0 ? `${fmt(src.costPerMonth)}/mo` : 'Free'}</td>
                  <td className="px-4 py-3 text-navy">{costPerDeal}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* ── Key ratios ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {[
          { label: 'Lead-to-close ratio', value: `1 in ${ratios.leadToClose}`, sub: 'Industry avg: 1 in 12' },
          { label: 'Showing → offer', value: `${ratios.showingToOfferPct}%`, sub: '6 showings → 3 offers' },
          { label: 'Avg days to close', value: `${ratios.avgDaysToClose} days`, sub: 'Contract to keys' },
        ].map(r => (
          <div key={r.label} className="bg-white rounded-xl border border-rule p-4 text-center">
            <p className="text-[10px] text-ink3 mb-1">{r.label}</p>
            <p className="text-[20px] font-semibold text-navy">{r.value}</p>
            <p className="text-[10px] text-ink3 mt-0.5">{r.sub}</p>
          </div>
        ))}
      </div>

      {/* ── AI insight ── */}
      <div className="bg-navy rounded-xl p-5 text-white">
        <p className="text-[12px] font-semibold mb-1">✦ Estavo AI · Performance insight</p>
        <p className="text-[12px] text-white/80 leading-relaxed">
          Your lead response time has improved{' '}
          <span className="text-white font-semibold">50% since January</span> — now averaging{' '}
          <span className="text-white font-semibold">26 minutes</span>, which is top-quartile for your market.
          Your IDX website is your highest-ROI lead source at{' '}
          <span className="text-white font-semibold">$99/month for $31,800 in GCI</span>.
          Zillow is generating leads but at a higher cost-per-deal — consider reallocating budget toward IDX
          content to accelerate organic growth.
        </p>
      </div>

    </div>
  )
}
