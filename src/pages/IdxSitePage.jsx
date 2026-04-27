// Estavo Prototype — IdxSitePage
import { useState } from 'react'
import { analytics } from '../analytics/track.js'
import { useNavigate } from 'react-router-dom'
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from 'recharts'
import {
  ExternalLink, CheckCircle, AlertCircle, RefreshCw,
  Users, MousePointer, Search, Bookmark, UserPlus, ChevronRight,
  Globe, Zap, Settings,
} from 'lucide-react'
import { idxSite as idx } from '../data/mockData'

// ── Helpers ────────────────────────────────────────────────────────────────────

function fmtDate(str) {
  return new Date(str + 'T12:00:00').toLocaleDateString('en-US', {
    month: 'short', day: 'numeric',
  })
}

function fmt(v) {
  return '$' + v.toLocaleString()
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function StatusPill({ status }) {
  return status === 'connected'
    ? (
      <span className="flex items-center gap-1 text-[10px] font-semibold text-teal bg-[#EEF6F2] px-2.5 py-1 rounded-full">
        <CheckCircle size={10} /> Connected
      </span>
    ) : (
      <span className="flex items-center gap-1 text-[10px] font-semibold text-rust bg-[#FDF0EE] px-2.5 py-1 rounded-full">
        <AlertCircle size={10} /> Disconnected
      </span>
    )
}

function TrafficTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-rule rounded-lg shadow-sm px-3 py-2">
      <p className="text-[10px] text-ink3">{label}</p>
      <p className="text-[12px] font-semibold text-navy">{payload[0].value} visitors</p>
    </div>
  )
}

// ── Tabs ───────────────────────────────────────────────────────────────────────

const TABS = [
  { id: 'overview',  label: 'Overview',     Icon: Globe    },
  { id: 'leads',     label: 'Lead captures', Icon: Users    },
  { id: 'listings',  label: 'Listings',     Icon: Search   },
  { id: 'settings',  label: 'Integrations', Icon: Settings },
]

// ── Overview tab ───────────────────────────────────────────────────────────────

function OverviewTab() {
  const s = idx.stats
  const kpis = [
    { label: 'Visitors this month', value: s.visitorsMonth.toLocaleString(), delta: `+${s.visitorsDelta}%`, Icon: MousePointer, up: true },
    { label: 'Lead captures',       value: s.capturesMonth,                   delta: `+${s.capturesDelta} vs last month`, Icon: UserPlus, up: true },
    { label: 'Listing views',       value: s.listingViews,                    delta: `${s.avgSessionMins}m avg session`,  Icon: Search,   up: true },
    { label: 'Saved searches',      value: s.savedSearches,                   delta: 'Active buyers on-site', Icon: Bookmark, up: true },
  ]

  // Thin down traffic data for x-axis readability
  const chartData = idx.dailyTraffic.map((d, i) => ({
    ...d,
    label: i % 7 === 0 ? fmtDate(d.date) : '',
  }))

  return (
    <div className="space-y-4">
      {/* KPI strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {kpis.map(k => (
          <div key={k.label} className="bg-white border border-rule rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] text-ink3 uppercase tracking-wider">{k.label}</p>
              <k.Icon size={13} className="text-ink3" />
            </div>
            <p className="text-[24px] font-semibold text-navy leading-none">{k.value}</p>
            <p className="text-[10px] text-teal mt-1">{k.delta}</p>
          </div>
        ))}
      </div>

      {/* Traffic chart */}
      <div className="bg-white rounded-xl border border-rule p-5">
        <p className="text-[13px] font-semibold text-navy mb-1">Site traffic — last 30 days</p>
        <p className="text-[10px] text-ink3 mb-4">Unique visitors per day</p>
        <ResponsiveContainer width="100%" height={160}>
          <LineChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#8A8A8A' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: '#8A8A8A' }} axisLine={false} tickLine={false} />
            <Tooltip content={<TrafficTooltip />} />
            <Line
              type="monotone"
              dataKey="visitors"
              stroke="#1F2E4A"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: '#1F2E4A' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Traffic sources + recent captures side by side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Traffic sources */}
        <div className="bg-white rounded-xl border border-rule p-4">
          <p className="text-[12px] font-semibold text-navy mb-3">Traffic sources</p>
          <div className="space-y-3">
            {idx.trafficSources.map(src => (
              <div key={src.label}>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-[11px] text-navy">{src.label}</p>
                  <p className="text-[11px] font-semibold text-navy">{src.pct}%</p>
                </div>
                <div className="h-1.5 bg-[#E8E4DC] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${src.pct}%`, backgroundColor: src.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent captures preview */}
        <div className="bg-white rounded-xl border border-rule p-4">
          <p className="text-[12px] font-semibold text-navy mb-3">Recent lead captures</p>
          <div className="space-y-2.5">
            {idx.recentCaptures.slice(0, 4).map(c => (
              <div key={c.id} className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-ui-bg flex items-center justify-center shrink-0">
                  <Users size={12} className="text-ink3" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-medium text-navy truncate">{c.name}</p>
                  <p className="text-[10px] text-ink3">{c.area} · {c.budget}</p>
                </div>
                {c.inCrm
                  ? <span className="text-[9px] text-teal font-medium shrink-0">In CRM</span>
                  : <span className="text-[9px] font-semibold text-rust shrink-0">New</span>
                }
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Lead captures tab ──────────────────────────────────────────────────────────

function LeadsTab({ onToast }) {
  const [added, setAdded] = useState([])

  function addToCrm(capture) {
    setAdded(prev => [...prev, capture.id])
    analytics.idxLeadAddedToCrm({ captureId: capture.id, area: capture.area, budget: capture.budget })
    onToast('Contact added to CRM')
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-[12px] text-ink3">
          {idx.recentCaptures.length} registrations this month —{' '}
          <span className="text-navy font-medium">
            {idx.recentCaptures.filter(c => !c.inCrm).length} not yet in CRM
          </span>
        </p>
      </div>

      <div className="bg-white rounded-xl border border-rule overflow-hidden">
        <table className="w-full text-[12px]">
          <thead>
            <tr className="bg-ui-bg border-b border-rule">
              {['Name', 'Search area', 'Budget', 'Saved', 'Date', 'Status', ''].map(h => (
                <th key={h} className="text-left px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-ink3 whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {idx.recentCaptures.map(c => {
              const isAdded = added.includes(c.id)
              const inCrm   = c.inCrm || isAdded
              return (
                <tr key={c.id} className="border-b border-[#F5F5F5] last:border-0 hover:bg-[#FAFAFA] transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium text-navy">{c.name}</p>
                    <p className="text-[10px] text-ink3">{c.email}</p>
                  </td>
                  <td className="px-4 py-3 text-slate">{c.area}</td>
                  <td className="px-4 py-3 text-slate whitespace-nowrap">{c.budget}</td>
                  <td className="px-4 py-3 text-center">
                    <span className="flex items-center gap-1 text-[11px] text-slate">
                      <Bookmark size={10} className="text-ink3" />
                      {c.saved}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-ink3 whitespace-nowrap">{fmtDate(c.date)}</td>
                  <td className="px-4 py-3">
                    {inCrm
                      ? <span className="text-[10px] font-medium text-teal flex items-center gap-1"><CheckCircle size={10} /> In CRM</span>
                      : <span className="text-[10px] font-semibold text-rust">New lead</span>
                    }
                  </td>
                  <td className="px-4 py-3">
                    {!inCrm && (
                      <button
                        onClick={() => addToCrm(c)}
                        className="text-[10px] font-medium text-white bg-navy px-2.5 py-1 rounded-md hover:bg-[#2A3F5F] transition-colors whitespace-nowrap"
                      >
                        + Add to CRM
                      </button>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* AI insight */}
      <div className="bg-[#F5F0FC] border border-[#D5C8F0] rounded-xl p-4">
        <p className="text-[11px] font-semibold text-[#6B3FA0] mb-1">✦ Estavo AI · Capture insight</p>
        <p className="text-[11px] text-[#4A3070] leading-relaxed">
          3 visitors saved 4+ listings this month without registering — a strong buying signal.
          Consider adding a softer gate ("Save your search — no spam") to convert these anonymous browsers into leads.
        </p>
      </div>
    </div>
  )
}

// ── Listings tab ───────────────────────────────────────────────────────────────

function ListingsTab({ onToast }) {
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border border-rule p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[12px] font-semibold text-navy">Featured on your site</p>
          <button
            onClick={() => onToast('Opening listing editor…')}
            className="text-[10px] text-rust hover:underline"
          >
            Edit featured →
          </button>
        </div>
        <div className="space-y-3">
          {idx.featuredListings.map(l => (
            <div key={l.id} className="flex items-center gap-4 py-2 border-b border-[#F5F5F5] last:border-0">
              {/* Placeholder photo */}
              <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-[#D0D8E8] to-[#B8C4D8] shrink-0 flex items-center justify-center">
                <Search size={16} className="text-white/60" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-semibold text-navy">{l.address}</p>
                <p className="text-[11px] text-ink3">{fmt(l.price)} · {l.beds}bd {l.baths}ba · {l.sqft.toLocaleString()} sqft</p>
                <div className="flex items-center gap-2 mt-1">
                  {l.featured && (
                    <span className="text-[9px] font-semibold bg-[#FEF8EC] text-gold px-1.5 py-0.5 rounded">Featured</span>
                  )}
                  <span className="text-[10px] text-ink3 flex items-center gap-0.5">
                    <MousePointer size={9} /> {l.views} views
                  </span>
                </div>
              </div>
              <button
                onClick={() => onToast(`Editing ${l.address}…`)}
                className="shrink-0 text-ink3 hover:text-navy transition-colors"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* MLS feed summary */}
      <div className="bg-white rounded-xl border border-rule p-4">
        <p className="text-[12px] font-semibold text-navy mb-3">MLS feed coverage</p>
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: 'Total listings available', value: idx.integration.listingsAvailable.toLocaleString() },
            { label: 'Coverage areas',           value: idx.integration.coverage.length + ' regions' },
            { label: 'Last synced',              value: idx.integration.lastSync },
            { label: 'Feed provider',            value: idx.integration.provider },
          ].map(s => (
            <div key={s.label} className="bg-ui-bg rounded-lg p-3">
              <p className="text-[10px] text-ink3">{s.label}</p>
              <p className="text-[12px] font-semibold text-navy mt-0.5">{s.value}</p>
            </div>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {idx.integration.coverage.map(area => (
            <span key={area} className="text-[10px] bg-[#EEF2FC] text-[#2B4FA0] px-2 py-0.5 rounded-full">
              {area}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Integrations / Settings tab ────────────────────────────────────────────────

function IntegrationsTab({ onToast }) {
  const int = idx.integration
  const bp  = idx.brokeragePortal

  return (
    <div className="space-y-4">

      {/* Estavo-hosted site */}
      <div className="bg-white rounded-xl border border-rule p-5">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <p className="text-[13px] font-semibold text-navy flex items-center gap-2">
              <Globe size={14} className="text-navy" />
              Your Estavo IDX Site
            </p>
            <p className="text-[11px] text-ink3 mt-0.5">
              A branded property search portal you own — portable across brokerages.
            </p>
          </div>
          <StatusPill status="connected" />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between py-2.5 border-b border-rule">
            <div>
              <p className="text-[11px] font-medium text-navy">Site URL</p>
              <p className="text-[10px] text-ink3">{idx.url}</p>
            </div>
            <button
              onClick={() => onToast('Opening site preview…')}
              className="flex items-center gap-1.5 text-[10px] text-rust hover:underline"
            >
              <ExternalLink size={11} /> Preview
            </button>
          </div>

          <div className="flex items-center justify-between py-2.5 border-b border-rule">
            <div>
              <p className="text-[11px] font-medium text-navy">MLS data feed</p>
              <p className="text-[10px] text-ink3">{int.mlsName} via {int.provider} {int.apiVersion}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-ink3">Synced {int.lastSync}</span>
              <button onClick={() => onToast('Syncing MLS data…')} className="text-ink3 hover:text-navy transition-colors">
                <RefreshCw size={12} />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between py-2.5 border-b border-rule">
            <div>
              <p className="text-[11px] font-medium text-navy">Lead capture → CRM</p>
              <p className="text-[10px] text-ink3">New registrations auto-create leads in Estavo</p>
            </div>
            <span className="text-[10px] font-medium text-teal flex items-center gap-1">
              <CheckCircle size={10} /> Active
            </span>
          </div>

          <div className="flex items-center justify-between py-2.5">
            <div>
              <p className="text-[11px] font-medium text-navy">Listings available</p>
              <p className="text-[10px] text-ink3">{int.coverage.join(' · ')}</p>
            </div>
            <span className="text-[11px] font-semibold text-navy">{int.listingsAvailable.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Brokerage portal passthrough */}
      <div className="bg-white rounded-xl border border-rule p-5">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <p className="text-[13px] font-semibold text-navy flex items-center gap-2">
              <Zap size={14} className="text-gold" />
              {bp.name}
            </p>
            <p className="text-[11px] text-ink3 mt-0.5">
              Leads from your brokerage profile are forwarded into Estavo automatically.
            </p>
          </div>
          <StatusPill status="connected" />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between py-2.5 border-b border-rule">
            <div>
              <p className="text-[11px] font-medium text-navy">Brokerage profile URL</p>
              <p className="text-[10px] text-ink3">{bp.url}</p>
            </div>
            <button
              onClick={() => onToast('Opening brokerage profile…')}
              className="flex items-center gap-1.5 text-[10px] text-rust hover:underline"
            >
              <ExternalLink size={11} /> Open
            </button>
          </div>

          <div className="flex items-center justify-between py-2.5 border-b border-rule">
            <div>
              <p className="text-[11px] font-medium text-navy">Lead routing</p>
              <p className="text-[10px] text-ink3">Leads forwarded via email webhook → Estavo</p>
            </div>
            <span className="text-[10px] font-medium text-teal flex items-center gap-1">
              <CheckCircle size={10} /> Routing active
            </span>
          </div>

          <div className="flex items-center justify-between py-2.5">
            <div>
              <p className="text-[11px] font-medium text-navy">Data ownership</p>
              <p className="text-[10px] text-ink3">Brokerage owns listing display rights. Leads are yours.</p>
            </div>
            <span className="text-[9px] font-semibold bg-[#FEF8EC] text-gold px-2 py-0.5 rounded-full">
              Shared
            </span>
          </div>
        </div>
      </div>

      {/* Add another source */}
      <div className="bg-white rounded-xl border border-dashed border-rule p-5">
        <p className="text-[12px] font-semibold text-navy mb-1">Connect another lead source</p>
        <p className="text-[11px] text-ink3 mb-4">
          Add Zillow Premier Agent, Facebook Lead Ads, Realtor.com, or a custom website.
        </p>
        <div className="flex flex-wrap gap-2">
          {['Zillow Premier Agent', 'Realtor.com', 'Facebook Lead Ads', 'Custom webhook'].map(src => (
            <button
              key={src}
              onClick={() => onToast(`Setting up ${src}…`)}
              className="text-[10px] border border-rule rounded-md px-3 py-1.5 text-slate hover:bg-ui-bg transition-colors"
            >
              + {src}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function IdxSitePage() {
  const [tab, setTab]   = useState('overview')
  const [toast, setToast] = useState(null)

  function showToast(msg) {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  return (
    <div className="space-y-5">

      {/* Site header bar */}
      <div className="bg-white rounded-xl border border-rule px-5 py-3 flex items-center gap-4">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="w-2 h-2 rounded-full bg-teal shrink-0" />
          <p className="text-[12px] font-semibold text-navy truncate">{idx.url}</p>
          <span className="text-[10px] text-teal font-medium bg-[#EEF6F2] px-2 py-0.5 rounded-full shrink-0">Live</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => showToast('Opening your IDX site…')}
            className="flex items-center gap-1.5 text-[11px] border border-rule rounded-md px-3 py-1.5 text-slate hover:bg-ui-bg transition-colors"
          >
            <ExternalLink size={12} /> Preview site
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-1.5 px-4 py-1.5 text-[12px] rounded-md font-medium transition-colors ${
              tab === t.id
                ? 'bg-navy text-white'
                : 'bg-white border border-rule text-slate hover:bg-ui-bg'
            }`}
          >
            <t.Icon size={12} />
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {tab === 'overview'  && <OverviewTab />}
      {tab === 'leads'     && <LeadsTab onToast={showToast} />}
      {tab === 'listings'  && <ListingsTab onToast={showToast} />}
      {tab === 'settings'  && <IntegrationsTab onToast={showToast} />}

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-navy text-white text-[12px] px-4 py-2.5 rounded-xl shadow-lg animate-page-in">
          {toast}
        </div>
      )}
    </div>
  )
}
