// Estavo Prototype — Sidebar
import { useState, useEffect, useRef } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Users, TrendingUp,
  FileCheck, CalendarDays, Home,
  Mail, Sparkles, BarChart2,
  ExternalLink, FolderOpen,
  DollarSign, Target,
  Globe, Settings,
  ChevronUp, LogOut, Zap,
} from 'lucide-react'
import { agent, transactions } from '../../data/mockData'

const activeDeals = transactions.filter(t => t.stage !== 'closed').length

const NAV_SECTIONS = [
  {
    label: 'WORKSPACE',
    items: [
      { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', end: true },
      { to: '/leads',     icon: Zap,             label: 'Leads',     badge: 3, badgeColor: 'rust' },
      { to: '/contacts',  icon: Users,           label: 'Contacts' },
      { to: '/pipeline',  icon: TrendingUp,      label: 'Pipeline' },
    ],
  },
  {
    label: 'ACTIVITY',
    items: [
      { to: '/transactions', icon: FileCheck,    label: 'Transactions', badge: activeDeals, badgeColor: 'rust' },
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
      { to: '/portals',       icon: ExternalLink, label: 'Portals',   badge: 2, badgeColor: 'teal' },
      { to: '/documents',    icon: FolderOpen,   label: 'Documents' },
    ],
  },
  {
    label: 'FINANCIALS',
    items: [
      { to: '/commission',  icon: DollarSign, label: 'Commission', end: true },
      { to: '/cap-tracker', icon: Target,     label: 'Cap Tracker' },
      { to: '/analytics',   icon: BarChart2,  label: 'Analytics' },
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

function AgentMenu() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const wrapRef = useRef(null)
  const triggerRef = useRef(null)

  // Apply saved scale on mount
  useEffect(() => {
    const saved = localStorage.getItem('fontScale') ?? 'sm'
    document.documentElement.dataset.scale = saved === 'sm' ? '' : saved
  }, [])

  useEffect(() => {
    function onClickOutside(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  return (
    <div ref={wrapRef} className="hidden lg:block relative px-4 pt-4 pb-3">
      <div
        ref={triggerRef}
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2.5 cursor-pointer group"
      >
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
        <div
          className="fixed z-50 rounded-xl shadow-xl border border-rule overflow-hidden w-56"
          style={{
            top: triggerRef.current?.getBoundingClientRect().bottom + 6,
            left: triggerRef.current?.getBoundingClientRect().left,
            backgroundColor: '#ffffff',
          }}
        >
          {/* Agent header */}
          <div className="px-4 py-3 border-b border-rule bg-[#F8F7F5]">
            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold shrink-0"
                style={{ backgroundColor: agent.avatarColor }}
              >
                {agent.avatar}
              </div>
              <div className="min-w-0">
                <p className="text-[12px] font-semibold text-navy truncate">{agent.name}</p>
                <p className="text-[10px] text-ink3 truncate">{agent.brokerage}</p>
              </div>
            </div>
          </div>

          {/* Menu items */}
          <div className="py-1">
            <button
              onClick={() => { navigate('/settings'); setOpen(false) }}
              className="w-full flex items-center gap-2.5 px-4 py-2 text-[12px] text-navy hover:bg-ui-bg transition-colors"
            >
              <Settings size={13} className="text-ink3 shrink-0" />
              Settings
            </button>
          </div>

          <div className="h-px bg-rule mx-3" />

          <div className="py-1">
            <button className="w-full flex items-center gap-2.5 px-4 py-2 text-[12px] text-rust hover:bg-[#FDF0EE] transition-colors">
              <LogOut size={13} className="shrink-0" />
              Log out
            </button>
          </div>
        </div>
      )}
    </div>
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
      <div className="flex items-center justify-center lg:justify-start px-2 lg:px-4 h-12 shrink-0">
        <span className="text-[20px] font-semibold text-white tracking-[0.08em]">
          <span className="lg:hidden text-rust">E</span>
          <span className="hidden lg:inline">Esta<span style={{ color: '#E8391E' }}>v</span>o</span>
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
