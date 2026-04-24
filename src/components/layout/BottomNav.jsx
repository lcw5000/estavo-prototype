// Estavo Prototype — BottomNav (mobile only)
import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Users, Mail, Calendar, MoreHorizontal } from 'lucide-react'

const NAV = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Home',      end: true },
  { to: '/contacts',  icon: Users,           label: 'Contacts' },
  { to: '/campaigns', icon: Mail,            label: 'Campaigns' },
  { to: '/showings',  icon: Calendar,        label: 'Showings',  end: true },
  { to: '/pipeline',  icon: MoreHorizontal,  label: 'More' },
]

export default function BottomNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-rule h-14 z-50 flex safe-area-bottom">
      {NAV.map(item => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className={({ isActive }) =>
            `flex-1 flex flex-col items-center justify-center gap-0.5 transition-colors ${
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
