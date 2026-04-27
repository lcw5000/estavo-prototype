// Estavo Prototype — AppShell
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import BottomNav from './BottomNav'

const PAGE_CONFIG = {
  '/dashboard':      { title: 'Good morning, Lee 👋' },
  '/contacts':       { title: 'Contacts' },
  '/campaigns':      { title: 'Campaigns' },
  '/showings':       { title: 'Showings' },
  '/transactions':   { title: 'Active Deals' },
  '/calendar':       { title: 'Calendar' },
  '/commission':     { title: 'Commission & Financials' },
  '/pipeline':       { title: 'Pipeline' },
  '/documents':      { title: 'Documents' },
  '/cap-tracker':    { title: 'Cap Tracker' },
  '/leads':          { title: 'Leads' },
  '/settings':       { title: 'Settings' },
  '/portals':        { title: 'Portals' },
  '/market-reports': { title: 'Market Reports' },
}

const FULL_BLEED = ['/contacts', '/campaigns', '/dashboard']

function getConfig(pathname) {
  const key = Object.keys(PAGE_CONFIG).find(k => pathname.startsWith(k))
  return PAGE_CONFIG[key] ?? { title: '' }
}

export default function AppShell() {
  const { pathname } = useLocation()
  const config = getConfig(pathname)
  const isFullBleed = FULL_BLEED.some(p => pathname.startsWith(p))

  return (
    <div className="flex h-dvh overflow-hidden">
      <Sidebar />
      <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
        <Topbar title={config.title} />
        <main
          key={pathname}
          className={`flex-1 animate-page-in ${
            isFullBleed
              ? 'overflow-hidden pb-20 md:pb-0'
              : 'overflow-y-auto bg-paper px-4 md:px-6 pt-5 md:pt-8 pb-28 md:pb-8'
          }`}
        >
          <Outlet />
        </main>
      </div>
      <BottomNav />
    </div>
  )
}
