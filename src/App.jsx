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
import PipelinePage from './pages/PipelinePage'
import DocumentsPage from './pages/DocumentsPage'
import MarketReportsPage from './pages/MarketReportsPage'
import PortalsPage from './pages/PortalsPage'
import SettingsPage from './pages/SettingsPage'
import LeadsPage from './pages/LeadsPage'
import CapTrackerPage from './pages/CapTrackerPage'
import IdxSitePage from './pages/IdxSitePage'

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
          <Route path="/leads"              element={<LeadsPage />} />
          <Route path="/contacts"           element={<ContactsPage />} />
          <Route path="/contacts/:id"       element={<ContactsPage />} />
          <Route path="/campaigns"          element={<CampaignsPage />} />
          <Route path="/campaigns/:id"      element={<CampaignsPage />} />
          <Route path="/showings"           element={<ShowingsPage />} />
          <Route path="/transactions"       element={<TransactionsPage />} />
          <Route path="/transactions/:id"   element={<TransactionDetailPage />} />
          <Route path="/calendar"           element={<CalendarPage />} />
          <Route path="/commission"         element={<CommissionPage />} />
          <Route path="/pipeline"           element={<PipelinePage />} />
          <Route path="/ai-writer"          element={<Placeholder title="AI Writer" />} />
          <Route path="/market-reports"     element={<MarketReportsPage />} />
          <Route path="/documents"          element={<DocumentsPage />} />
          <Route path="/cap-tracker"        element={<CapTrackerPage />} />
          <Route path="/idx-site"           element={<IdxSitePage />} />
          <Route path="/settings"           element={<SettingsPage />} />
          <Route path="/portals"            element={<PortalsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
