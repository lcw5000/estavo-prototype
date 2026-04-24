// Estavo Prototype — AppShell
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import BottomNav from './BottomNav'

const PAGE_CONFIG = {
  '/dashboard':    { title: 'Good morning, Lee 👋', primaryLabel: '+ New contact' },
  '/contacts':     { title: 'Contacts',   primaryLabel: '+ Add contact' },
  '/campaigns':    { title: 'Campaigns',  primaryLabel: '✦ New AI campaign' },
  '/showings':     { title: 'Showings',   primaryLabel: '+ Schedule showing' },
  '/transactions': { title: 'Active Deals', primaryLabel: '+ New transaction' },
  '/calendar':     { title: 'Calendar' },
  '/commission':   { title: 'Commission & Financials' },
  '/pipeline':     { title: 'Pipeline' },
  '/documents':    { title: 'Documents' },
  '/cap-tracker':  { title: 'Cap Tracker' },
}

const FULL_BLEED = ['/contacts', '/campaigns']

function getConfig(pathname) {
  const key = Object.keys(PAGE_CONFIG).find(k => pathname.startsWith(k))
  return PAGE_CONFIG[key] ?? { title: '' }
}

export default function AppShell() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const config = getConfig(pathname)
  const isFullBleed = FULL_BLEED.some(p => pathname.startsWith(p))

  function handlePrimary() {
    if (pathname.startsWith('/campaigns')) navigate('/campaigns?new=true')
    else if (pathname.startsWith('/showings')) navigate('/showings?schedule=true')
    else navigate('/contacts')
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
        <Topbar
          title={config.title}
          primaryLabel={config.primaryLabel}
          onPrimary={handlePrimary}
        />
        <main
          key={pathname}
          className={`flex-1 animate-page-in ${
            isFullBleed
              ? 'overflow-hidden'
              : 'overflow-y-auto bg-paper px-6 pt-8 pb-20 md:pb-8'
          }`}
        >
          <Outlet />
        </main>
      </div>
      <BottomNav />
    </div>
  )
}
