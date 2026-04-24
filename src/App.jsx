// Estavo Prototype — App Router
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AppShell from './components/layout/AppShell'
import LoginPage from './pages/LoginPage'
import OnboardingPage from './pages/OnboardingPage'
import DashboardPage from './pages/DashboardPage'
import ContactsPage from './pages/ContactsPage'
import CampaignsPage from './pages/CampaignsPage'
import ShowingsPage from './pages/ShowingsPage'
import CommissionPage from './pages/CommissionPage'
import PortalPage from './pages/PortalPage'
import TransactionsPage from './pages/TransactionsPage'
import TransactionDetailPage from './pages/TransactionDetailPage'
import CalendarPage from './pages/CalendarPage'

const Placeholder = ({ title }) => (
  <div className="text-navy">
    <p className="text-sub text-slate">{title} — coming soon.</p>
  </div>
)

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Full-screen — no AppShell */}
        <Route path="/login"      element={<LoginPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />

        {/* Consumer portal — own layout */}
        <Route path="/portal/:id" element={<PortalPage />} />

        {/* Authenticated app — wrapped in AppShell */}
        <Route element={<AppShell />}>
          <Route path="/dashboard"          element={<DashboardPage />} />
          <Route path="/contacts"           element={<ContactsPage />} />
          <Route path="/contacts/:id"       element={<ContactsPage />} />
          <Route path="/campaigns"          element={<CampaignsPage />} />
          <Route path="/campaigns/:id"      element={<CampaignsPage />} />
          <Route path="/showings"           element={<ShowingsPage />} />
          <Route path="/transactions"       element={<TransactionsPage />} />
          <Route path="/transactions/:id"   element={<TransactionDetailPage />} />
          <Route path="/calendar"           element={<CalendarPage />} />
          <Route path="/commission"         element={<CommissionPage />} />
          <Route path="/pipeline"           element={<Placeholder title="Pipeline" />} />
          <Route path="/ai-writer"          element={<Placeholder title="AI Writer" />} />
          <Route path="/market-reports"     element={<Placeholder title="Market Reports" />} />
          <Route path="/documents"          element={<Placeholder title="Documents" />} />
          <Route path="/cap-tracker"        element={<Placeholder title="Cap Tracker" />} />
          <Route path="/idx-site"           element={<Placeholder title="My IDX Site" />} />
          <Route path="/settings"           element={<Placeholder title="Settings" />} />
          <Route path="/portals"            element={<Placeholder title="Portals" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
