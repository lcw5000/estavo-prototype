// Estavo Prototype — CapTrackerPage
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { capTracker as ct } from '../data/mockData'
import { TrendingUp, Award, AlertCircle } from 'lucide-react'

// ── Helpers ────────────────────────────────────────────────────────────────────

function fmt(v) {
  if (v == null) return '—'
  return '$' + v.toLocaleString()
}

function fmtDate(str) {
  return new Date(str + 'T12:00:00').toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
  })
}

// ── SVG progress ring ──────────────────────────────────────────────────────────

function CapRing({ pct }) {
  const r = 80
  const cx = 100, cy = 100
  const circ = 2 * Math.PI * r
  const filled = circ * Math.min(pct, 1)

  return (
    <svg width="220" height="220" viewBox="0 0 200 200" className="mx-auto">
      <defs>
        <linearGradient id="capGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#1A5C4A" />
          <stop offset="100%" stopColor="#C84B2F" />
        </linearGradient>
      </defs>
      {/* Track */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#E8E4DC" strokeWidth="16" />
      {/* Progress */}
      <circle
        cx={cx} cy={cy} r={r}
        fill="none"
        stroke="url(#capGrad)"
        strokeWidth="16"
        strokeLinecap="round"
        strokeDasharray={`${filled} ${circ - filled}`}
        transform={`rotate(-90 ${cx} ${cy})`}
      />
      {/* Center */}
      <text x={cx} y={cy - 10} textAnchor="middle" fontSize="36" fontWeight="700" fill="#1F2E4A" fontFamily="system-ui">
        {Math.round(pct * 100)}%
      </text>
      <text x={cx} y={cy + 14} textAnchor="middle" fontSize="11" fill="#8A8A8A" fontFamily="system-ui">
        to cap
      </text>
      <text x={cx} y={cy + 30} textAnchor="middle" fontSize="10" fill="#C84B2F" fontFamily="system-ui" fontWeight="600">
        {fmt(ct.capAmount - ct.paidToDate)} remaining
      </text>
    </svg>
  )
}

// ── Monthly chart tooltip ──────────────────────────────────────────────────────

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  const isProjected = payload[0]?.payload?.projected
  return (
    <div className="bg-white border border-rule rounded-lg shadow-sm px-3 py-2">
      <p className="text-[11px] font-semibold text-navy">{label}</p>
      <p className="text-[11px] text-ink3">
        {isProjected ? 'Projected: ' : 'Paid: '}
        <span className="text-navy font-medium">{fmt(payload[0]?.value)}</span>
      </p>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

const pct           = ct.paidToDate / ct.capAmount
const remaining     = ct.capAmount - ct.paidToDate
const avgMonthlyPay = ct.paidToDate / 4
const postCapGainPerDeal = Math.round(ct.avgDealGCI * (ct.splitPctPreCap / 100)) - ct.transactionFee

// Merged chart data
const chartData = [
  ...ct.monthlyActual.map(d => ({ ...d, projected: false })),
  ...ct.monthlyProjected.map(d => ({ ...d, gci: 0, projected: true })),
]

// Running totals for deal table
let running = 0

export default function CapTrackerPage() {
  return (
    <div className="space-y-5 max-w-4xl">

      {/* ── Hero: ring + stats ── */}
      <div className="bg-white rounded-2xl border border-rule p-6">
        <div className="flex flex-col md:flex-row items-center gap-6">

          {/* Ring */}
          <div className="shrink-0">
            <CapRing pct={pct} />
          </div>

          {/* Stats */}
          <div className="flex-1 w-full space-y-3">
            <div>
              <p className="text-[13px] font-semibold text-navy">{ct.brokerageName} — Cap Year 2026</p>
              <p className="text-[11px] text-ink3 mt-0.5">Resets Jan 1, 2027 · {ct.splitPctPreCap}% split until capped</p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Cap amount',      value: fmt(ct.capAmount),    sub: 'Annual cap target' },
                { label: 'Paid to date',    value: fmt(ct.paidToDate),   sub: '4 deals closed' },
                { label: 'Remaining',       value: fmt(remaining),        sub: 'Until you cap', cls: 'text-rust' },
                { label: 'Projected cap',   value: 'Sep 15',             sub: fmtDate(ct.projectedCapDate).split(',')[0] },
              ].map(s => (
                <div key={s.label} className="bg-ui-bg rounded-xl p-3">
                  <p className="text-[10px] text-ink3 mb-0.5">{s.label}</p>
                  <p className={`text-[18px] font-semibold leading-tight ${s.cls ?? 'text-navy'}`}>{s.value}</p>
                  <p className="text-[10px] text-ink3 mt-0.5">{s.sub}</p>
                </div>
              ))}
            </div>

            {/* Progress bar */}
            <div>
              <div className="flex justify-between text-[10px] text-ink3 mb-1">
                <span>{fmt(ct.paidToDate)} paid</span>
                <span>{fmt(ct.capAmount)} cap</span>
              </div>
              <div className="h-2 bg-[#E8E4DC] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${pct * 100}%`,
                    background: 'linear-gradient(to right, #1A5C4A, #C84B2F)',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── What changes when you cap ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="bg-white rounded-xl border border-rule p-4 flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-[#EEF6F2] flex items-center justify-center shrink-0">
            <TrendingUp size={14} className="text-teal" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-navy">Pre-cap split</p>
            <p className="text-[22px] font-semibold text-navy leading-tight">80/20</p>
            <p className="text-[10px] text-ink3 mt-0.5">You keep 80% of each deal</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-rule p-4 flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-[#FDF0EE] flex items-center justify-center shrink-0">
            <Award size={14} className="text-rust" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-navy">Post-cap split</p>
            <p className="text-[22px] font-semibold text-rust leading-tight">100%</p>
            <p className="text-[10px] text-ink3 mt-0.5">+ {fmt(ct.transactionFee)} flat fee/deal</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-rule p-4 flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-[#FEF8EC] flex items-center justify-center shrink-0">
            <AlertCircle size={14} className="text-gold" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-navy">Extra per deal after cap</p>
            <p className="text-[22px] font-semibold text-gold leading-tight">{fmt(postCapGainPerDeal)}</p>
            <p className="text-[10px] text-ink3 mt-0.5">Based on avg {fmt(ct.avgDealGCI)} GCI</p>
          </div>
        </div>
      </div>

      {/* ── Monthly contributions chart ── */}
      <div className="bg-white rounded-xl border border-rule p-5">
        <div className="flex items-center justify-between mb-1">
          <p className="text-[13px] font-semibold text-navy">Monthly brokerage contributions</p>
          <div className="flex items-center gap-3 text-[10px] text-ink3">
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-navy inline-block" /> Actual</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-[#D0D8E8] inline-block" /> Projected</span>
          </div>
        </div>
        <p className="text-[10px] text-ink3 mb-4">Avg monthly pace: {fmt(Math.round(avgMonthlyPay))}</p>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={chartData} barSize={28} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
            <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#8A8A8A' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: '#8A8A8A' }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
            <Tooltip content={<ChartTooltip />} cursor={{ fill: '#F5F5F5' }} />
            <Bar dataKey="paid" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, i) => (
                <Cell
                  key={i}
                  fill={entry.projected ? '#D0D8E8' : '#1F2E4A'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ── Deal breakdown ── */}
      <div className="bg-white rounded-xl border border-rule overflow-hidden">
        <div className="px-5 py-3 border-b border-rule">
          <p className="text-[13px] font-semibold text-navy">Closed deals · cap contributions</p>
        </div>
        <table className="w-full text-[12px]">
          <thead>
            <tr className="bg-ui-bg border-b border-rule">
              {['Address', 'Close date', 'GCI', 'To brokerage', 'Your net', 'Running total'].map(h => (
                <th key={h} className="text-left px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-ink3 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ct.closedDeals.map((deal, i) => {
              running += deal.brokerageAmt
              const cappedAt = running >= ct.capAmount
              return (
                <tr key={deal.id} className="border-b border-[#F5F5F5] last:border-0 hover:bg-[#FAFAFA] transition-colors">
                  <td className="px-4 py-3 font-medium text-navy">{deal.address}</td>
                  <td className="px-4 py-3 text-slate">{fmtDate(deal.closeDate)}</td>
                  <td className="px-4 py-3 text-navy">{fmt(deal.gci)}</td>
                  <td className="px-4 py-3 text-slate">{fmt(deal.brokerageAmt)}</td>
                  <td className="px-4 py-3 text-teal font-medium">{fmt(deal.agentNet)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className={`font-medium ${running >= ct.capAmount ? 'text-rust' : 'text-navy'}`}>
                        {fmt(running)}
                      </span>
                      {cappedAt && (
                        <span className="text-[9px] font-semibold bg-rust text-white px-1.5 py-0.5 rounded">CAPPED</span>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
          <tfoot>
            <tr className="bg-ui-bg border-t border-rule">
              <td colSpan={2} className="px-4 py-2.5 text-[11px] font-semibold text-navy">Totals</td>
              <td className="px-4 py-2.5 text-[11px] font-semibold text-navy">
                {fmt(ct.closedDeals.reduce((s, d) => s + d.gci, 0))}
              </td>
              <td className="px-4 py-2.5 text-[11px] font-semibold text-navy">
                {fmt(ct.paidToDate)}
              </td>
              <td className="px-4 py-2.5 text-[11px] font-semibold text-teal">
                {fmt(ct.closedDeals.reduce((s, d) => s + d.agentNet, 0))}
              </td>
              <td />
            </tr>
          </tfoot>
        </table>
      </div>

      {/* ── Pace insight ── */}
      <div className="bg-navy rounded-xl p-5 text-white">
        <p className="text-[12px] font-semibold mb-1">✦ Estavo AI · Cap pace insight</p>
        <p className="text-[12px] text-white/80 leading-relaxed">
          At your current pace of {fmt(Math.round(avgMonthlyPay))}/month, you'll cap around{' '}
          <span className="text-white font-semibold">September 15, 2026</span> — putting you on track for{' '}
          <span className="text-white font-semibold">3.5 months of 100% commission</span> before the cap year resets.
          Closing one additional deal by July would pull your cap date forward to{' '}
          <span className="text-white font-semibold">early August</span>, earning you an extra{' '}
          <span className="text-white font-semibold">{fmt(postCapGainPerDeal)}</span> per deal.
        </p>
      </div>

    </div>
  )
}
