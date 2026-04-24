// Estavo Prototype — BottomNav (mobile only)
import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Zap, FileCheck, CalendarDays, Users } from 'lucide-react'

const NAV = [
  { to: '/dashboard',    icon: LayoutDashboard, label: 'Home',         end: true },
  { to: '/leads',        icon: Zap,             label: 'Leads' },
  { to: '/transactions', icon: FileCheck,       label: 'Deals' },
  { to: '/showings',     icon: CalendarDays,    label: 'Showings',     end: true },
  { to: '/contacts',     icon: Users,           label: 'Contacts' },
]

export default function BottomNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-rule z-50 flex"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      {NAV.map(item => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className={({ isActive }) =>
            `flex-1 flex flex-col items-center justify-center gap-0.5 py-2 transition-colors ${
              isActive ? 'text-rust' : 'text-ink3'
            }`
          }
        >
          <item.icon size={20} strokeWidth={1.5} />
          <span className="text-[9px] font-medium">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
