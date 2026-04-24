// Estavo Prototype — MarketReportsPage
import { useState } from 'react'
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import { TrendingUp, TrendingDown, Clock, Package, Layers } from 'lucide-react'
import { marketAreas } from '../data/mockData'

// ── Formatters ─────────────────────────────────────────────────────────────────

function fmtPrice(v) {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(2)}M`
  return `$${(v / 1000).toFixed(0)}K`
}

function fmtPriceShort(v) {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(2)}M`
  return `${(v / 1000).toFixed(0)}K`
}

// ── Custom Tooltip ─────────────────────────────────────────────────────────────

function PriceTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-rule rounded-lg px-3 py-2 shadow-md text-[11px]">
      <p className="font-semibold text-navy mb-0.5">{label}</p>
      <p className="text-slate">Median: <span className="text-navy font-medium">{fmtPrice(payload[0].value * 1000)}</span></p>
    </div>
  )
}

function DomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-rule rounded-lg px-3 py-2 shadow-md text-[11px]">
      <p className="font-semibold text-navy mb-0.5">{label}</p>
      <p className="text-slate">Avg days: <span className="text-navy font-medium">{payload[0].value}</span></p>
    </div>
  )
}

// ── KPI Card ───────────────────────────────────────────────────────────────────

function KpiCard({ icon: Icon, label, value, sub, subUp }) {
  return (
    <div className="bg-white border border-rule rounded-xl p-4 flex items-start gap-3">
      <div className="w-9 h-9 rounded-lg bg-[#F5F5F5] flex items-center justify-center shrink-0">
        <Icon size={16} className="text-slate" />
      </div>
      <div>
        <p className="text-[11px] text-ink3 mb-0.5">{label}</p>
        <p className="text-[18px] font-semibold text-navy leading-tight">{value}</p>
        {sub && (
          <p className={`text-[10px] mt-0.5 font-medium ${subUp ? 'text-teal' : 'text-rust'}`}>
            {sub}
          </p>
        )}
      </div>
    </div>
  )
}

// ── Charts ─────────────────────────────────────────────────────────────────────

function PriceTrendChart({ data }) {
  const chartData = data.map(d => ({ ...d, price: d.medianPrice }))
  return (
    <div className="bg-white border border-rule rounded-xl p-4">
      <p className="text-[12px] font-semibold text-navy mb-4">Median Sale Price — 12 months</p>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={chartData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F0EEEB" vertical={false} />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 10, fill: '#8C8984' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tickFormatter={v => `$${fmtPriceShort(v * 1000)}`}
            tick={{ fontSize: 10, fill: '#8C8984' }}
            axisLine={false}
            tickLine={false}
            width={52}
            domain={['auto', 'auto']}
          />
          <Tooltip content={<PriceTooltip />} />
          <Line
            type="monotone"
            dataKey="price"
            stroke="#1C3A5E"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: '#1C3A5E', strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

function DomChart({ data }) {
  return (
    <div className="bg-white border border-rule rounded-xl p-4">
      <p className="text-[12px] font-semibold text-navy mb-4">Avg Days on Market — 12 months</p>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }} barSize={14}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F0EEEB" vertical={false} />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 10, fill: '#8C8984' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 10, fill: '#8C8984' }}
            axisLine={false}
            tickLine={false}
            width={28}
            domain={[0, 'auto']}
          />
          <Tooltip content={<DomTooltip />} />
          <Bar dataKey="daysOnMarket" fill="#2E8B74" radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

function InventoryChart({ data }) {
  return (
    <div className="bg-white border border-rule rounded-xl p-4">
      <p className="text-[12px] font-semibold text-navy mb-4">Active Inventory — 12 months</p>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }} barSize={14}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F0EEEB" vertical={false} />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 10, fill: '#8C8984' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 10, fill: '#8C8984' }}
            axisLine={false}
            tickLine={false}
            width={36}
            domain={[0, 'auto']}
          />
          <Tooltip
            content={({ active, payload, label }) =>
              active && payload?.length ? (
                <div className="bg-white border border-rule rounded-lg px-3 py-2 shadow-md text-[11px]">
                  <p className="font-semibold text-navy mb-0.5">{label}</p>
                  <p className="text-slate">Listings: <span className="text-navy font-medium">{payload[0].value}</span></p>
                </div>
              ) : null
            }
          />
          <Bar dataKey="inventory" fill="#D4A843" radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

// ── AI Summary Card ────────────────────────────────────────────────────────────

function AiSummaryCard({ area }) {
  const up = area.yoy > 0
  return (
    <div className="bg-white border border-rule rounded-xl p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-[12px] font-semibold text-navy">✦ Market Summary</p>
        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${up ? 'bg-[#EEF6F2] text-teal' : 'bg-[#FDF0EE] text-rust'}`}>
          {up ? '+' : ''}{area.yoy}% YoY
        </span>
      </div>
      <p className="text-[11px] text-ink3 leading-relaxed">{area.summary}</p>
      <div className="flex gap-4 pt-1 border-t border-rule">
        <div>
          <p className="text-[10px] text-ink3">YoY Price Change</p>
          <p className={`text-[13px] font-semibold ${up ? 'text-teal' : 'text-rust'}`}>
            {up ? '+' : ''}{area.yoy}%
          </p>
        </div>
        <div>
          <p className="text-[10px] text-ink3">DOM vs Last Month</p>
          <p className={`text-[13px] font-semibold ${area.domChange < 0 ? 'text-rust' : 'text-teal'}`}>
            {area.domChange < 0 ? '' : '+'}{area.domChange} days
          </p>
        </div>
        <div>
          <p className="text-[10px] text-ink3">Latest Sale-to-List</p>
          <p className="text-[13px] font-semibold text-navy">
            {area.data[area.data.length - 1].saleToList}%
          </p>
        </div>
        <div>
          <p className="text-[10px] text-ink3">Closed Sales (Apr)</p>
          <p className="text-[13px] font-semibold text-navy">
            {area.data[area.data.length - 1].closedSales}
          </p>
        </div>
      </div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function MarketReportsPage() {
  const [areaId, setAreaId] = useState(marketAreas[0].id)
  const area = marketAreas.find(a => a.id === areaId)
  const latest = area.data[area.data.length - 1]
  const prev   = area.data[area.data.length - 2]

  const priceChange = latest.medianPrice - prev.medianPrice
  const priceUp     = priceChange >= 0

  return (
    <div className="space-y-5">
      {/* Area selector */}
      <div className="flex gap-2">
        {marketAreas.map(a => (
          <button
            key={a.id}
            onClick={() => setAreaId(a.id)}
            className={`px-4 py-1.5 text-[12px] rounded-md font-medium transition-colors ${
              areaId === a.id
                ? 'bg-navy text-white'
                : 'bg-white border border-rule text-slate hover:bg-ui-bg'
            }`}
          >
            {a.label}
          </button>
        ))}
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-4 gap-3">
        <KpiCard
          icon={TrendingUp}
          label="Median Sale Price"
          value={fmtPrice(latest.medianPrice * 1000)}
          sub={`${priceUp ? '+' : ''}${fmtPrice(Math.abs(priceChange) * 1000)} vs last month`}
          subUp={priceUp}
        />
        <KpiCard
          icon={Clock}
          label="Avg Days on Market"
          value={`${latest.daysOnMarket} days`}
          sub={`${area.domChange < 0 ? '' : '+'}${area.domChange} vs last month`}
          subUp={area.domChange > 0}
        />
        <KpiCard
          icon={Package}
          label="Active Inventory"
          value={latest.inventory.toLocaleString()}
          sub={`${latest.inventory > prev.inventory ? '+' : ''}${latest.inventory - prev.inventory} vs last month`}
          subUp={latest.inventory > prev.inventory}
        />
        <KpiCard
          icon={Layers}
          label="Sale-to-List Ratio"
          value={`${latest.saleToList}%`}
          sub={latest.saleToList >= 100 ? 'Overbid market' : 'Under-ask market'}
          subUp={latest.saleToList >= 100}
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-2 gap-3">
        <PriceTrendChart data={area.data} />
        <DomChart data={area.data} />
      </div>

      {/* Inventory chart + AI summary */}
      <div className="grid grid-cols-2 gap-3">
        <InventoryChart data={area.data} />
        <AiSummaryCard area={area} />
      </div>
    </div>
  )
}
