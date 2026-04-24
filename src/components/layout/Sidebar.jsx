// Estavo Prototype — Sidebar
import { useState, useEffect, useRef } from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Users, TrendingUp,
  FileCheck, CalendarDays, Home,
  Mail, Sparkles, BarChart2,
  ExternalLink, FolderOpen,
  DollarSign, Target,
  Globe, Settings,
  ChevronUp, ChevronRight, LogOut, Type,
} from 'lucide-react'
import { agent, transactions } from '../../data/mockData'

const activeDeals = transactions.filter(t => t.stage !== 'closed').length

const NAV_SECTIONS = [
  {
    label: 'WORKSPACE',
    items: [
      { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', end: true },
      { to: '/contacts',  icon: Users,           label: 'Contacts',  badge: 3, badgeColor: 'teal' },
      { to: '/pipeline',  icon: TrendingUp,      label: 'Pipeline' },
    ],
  },
  {
    label: 'TRANSACTIONS',
    items: [
      { to: '/transactions', icon: FileCheck,    label: 'Active Deals', badge: activeDeals, badgeColor: 'rust' },
      { to: '/calendar',     icon: CalendarDays, label: 'Calendar' },
      { to: '/showings',     icon: Home,         label: 'Showings', end: true },
    ],
  },
  {
    label: 'MARKETING',
    items: [
      { to: '/campaigns',      icon: Mail,      label: 'Campaigns' },
      { to: '/ai-writer',      icon: Sparkles,  label: 'AI Writer' },
      { to: '/market-reports', icon: BarChart2, label: 'Market Reports' },
    ],
  },
  {
    label: 'CLIENT',
    items: [
      { to: '/portal/txn-1', icon: ExternalLink, label: 'Portals',   badge: 2, badgeColor: 'teal' },
      { to: '/documents',    icon: FolderOpen,   label: 'Documents' },
    ],
  },
  {
    label: 'FINANCIALS',
    items: [
      { to: '/commission',  icon: DollarSign, label: 'Commission', end: true },
      { to: '/cap-tracker', icon: Target,     label: 'Cap Tracker' },
    ],
  },
  {
    label: 'WEBSITE',
    items: [
      { to: '/idx-site',  icon: Globe,     label: 'My IDX Site' },
      { to: '/settings',  icon: Settings,  label: 'Settings' },
    ],
  },
]

const SCALES = [
  { key: 'sm', label: 'Small' },
  { key: 'md', label: 'Medium' },
  { key: 'lg', label: 'Large' },
  { key: 'xl', label: 'X-Large' },
]

function AgentMenu() {
  const [scale, setScale] = useState(() => localStorage.getItem('fontScale') ?? 'sm')
  const [open, setOpen] = useState(false)
  const [fontSubmenu, setFontSubmenu] = useState(false)
  const agentRef = useRef(null)
  const dropdownRef = useRef(null)
  const [pos, setPos] = useState({ top: 0, left: 0 })

  useEffect(() => {
    document.documentElement.dataset.scale = scale === 'sm' ? '' : scale
    localStorage.setItem('fontScale', scale)
  }, [scale])

  useEffect(() => {
    function onClickOutside(e) {
      if (
        dropdownRef.current && !dropdownRef.current.contains(e.target) &&
        agentRef.current && !agentRef.current.contains(e.target)
      ) { setOpen(false); setFontSubmenu(false) }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  function handleOpen() {
    if (agentRef.current) {
      const rect = agentRef.current.getBoundingClientRect()
      setPos({ top: rect.bottom + 8, left: rect.left })
    }
    setOpen(o => !o)
    setFontSubmenu(false)
  }

  const scaleLabel = SCALES.find(s => s.key === scale)?.label ?? 'Small'

  return (
    <>
      <div ref={agentRef} onClick={handleOpen}
        className="hidden lg:flex px-4 pb-4 items-center gap-2.5 cursor-pointer group">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold shrink-0 ring-2 ring-transparent group-hover:ring-white/20 transition-all"
          style={{ backgroundColor: agent.avatarColor }}
        >
          {agent.avatar}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[13px] text-white font-medium truncate leading-tight">{agent.name}</p>
          <p className="text-[11px] text-[#8A9BB5] truncate">{agent.brokerage}</p>
        </div>
        <ChevronUp size={13} className={`text-[#6B7A9A] shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </div>

      {open && (
        <div ref={dropdownRef}
          className="fixed z-50 bg-white border border-rule rounded-xl shadow-xl overflow-hidden w-48"
          style={{ top: pos.top, left: pos.left }}>
          <div className="relative">
            <button onClick={() => setFontSubmenu(o => !o)}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 text-[12px] text-navy hover:bg-ui-bg transition-colors">
              <Type size={13} className="text-ink3 shrink-0" />
              <span className="flex-1 text-left">Text size</span>
              <span className="text-[10px] text-ink3">{scaleLabel}</span>
              <ChevronRight size={11} className={`text-ink3 transition-transform ${fontSubmenu ? 'rotate-90' : ''}`} />
            </button>
            {fontSubmenu && (
              <div className="border-t border-rule">
                {SCALES.map(s => (
                  <button key={s.key} onClick={() => { setScale(s.key); setFontSubmenu(false) }}
                    className={`w-full text-left px-4 py-2 text-[12px] flex items-center justify-between transition-colors ${scale === s.key ? 'text-navy font-semibold bg-ui-bg' : 'text-slate hover:bg-ui-bg'}`}>
                    {s.label}
                    {scale === s.key && <span className="text-rust text-[11px]">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="h-px bg-rule mx-3" />
          <button className="w-full flex items-center gap-2.5 px-3 py-2.5 text-[12px] text-rust hover:bg-[#FDF0EE] transition-colors">
            <LogOut size={13} className="shrink-0" />
            Log out
          </button>
        </div>
      )}
    </>
  )
}

function NavItem({ to, icon: Icon, label, badge, badgeColor, end }) {
  const badgeCls = badgeColor === 'rust'
    ? 'bg-rust text-white'
    : 'bg-teal text-white'
  return (
    <NavLink to={to} end={end}
      className={({ isActive }) =>
        `flex items-center justify-center lg:justify-start gap-2.5 px-2 lg:px-3 py-[7px] text-[13px] rounded-sm transition-colors border-l-[3px] ${
          isActive
            ? 'border-rust text-rust bg-[#C84B2F]/10'
            : 'border-transparent text-[#C8C4BC] hover:bg-[#263044] hover:text-white'
        }`}>
      <Icon size={15} className="shrink-0" />
      <span className="hidden lg:block flex-1">{label}</span>
      {badge && (
        <span className={`hidden lg:flex text-[10px] font-semibold rounded-full w-4 h-4 items-center justify-center leading-none ${badgeCls}`}>
          {badge}
        </span>
      )}
    </NavLink>
  )
}

export default function Sidebar() {
  return (
    <aside className="hidden md:flex flex-col shrink-0 bg-sidebar h-screen overflow-y-auto md:w-sidebar-sm lg:w-sidebar">
      <div className="flex items-center justify-center lg:justify-start px-2 lg:px-4 pt-5 pb-3">
        <span className="font-display text-[20px] text-white tracking-tight">
          <span className="lg:hidden text-rust">E</span>
          <span className="hidden lg:inline">Esta<span className="text-rust">v</span>o</span>
        </span>
      </div>

      <AgentMenu />
      <div className="mx-2 lg:mx-4 h-px bg-[#263044] mb-3" />

      <nav className="flex-1 px-1 lg:px-2 space-y-4 pb-6">
        {NAV_SECTIONS.map(section => (
          <div key={section.label}>
            <p className="hidden lg:block px-3 mb-1 text-[10px] font-semibold tracking-widest text-[#6B7A9A] uppercase">
              {section.label}
            </p>
            <div className="space-y-0.5">
              {section.items.map(item => <NavItem key={item.to} {...item} />)}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  )
}
