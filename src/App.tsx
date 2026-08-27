import { Sidebar } from '@/components/layout/Sidebar'
import { TopBar } from '@/components/layout/TopBar'
import { DashboardPage } from '@/pages/DashboardPage'
import { WalletPage } from '@/pages/WalletPage'
import { PlaceholderPage } from '@/pages/PlaceholderPage'
import { AppProvider, useApp } from '@/context/AppContext'
import { ArrowLeftRight, Send, Users, Settings } from 'lucide-react'
import { useState, useEffect } from 'react'

function PageRouter() {
  const { activePage } = useApp()
  switch (activePage) {
    case 'dashboard':    return <DashboardPage />
    case 'wallets':      return <WalletPage />
    case 'transactions': return <PlaceholderPage title="Transactions" description="View and export your full transaction history." icon={<ArrowLeftRight size={24} />} />
    case 'payouts':      return <PlaceholderPage title="Payouts" description="Track and manage all your payout requests." icon={<Send size={24} />} />
    case 'customers':    return <PlaceholderPage title="Customers" description="Browse and manage your customer directory." icon={<Users size={24} />} />
    case 'settings':     return <PlaceholderPage title="Settings" description="Configure your account, API keys, and preferences." icon={<Settings size={24} />} />
    default:             return <DashboardPage />
  }
}

// Track sidebar width so the content area shifts accordingly
const SIDEBAR_EXPANDED = 200
const SIDEBAR_COLLAPSED = 56

function AppShell() {
  // We need to track sidebar collapse state here to offset the main content.
  // We use a custom event from Sidebar to communicate.
  const [sidebarW, setSidebarW] = useState(SIDEBAR_EXPANDED)

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<{ collapsed: boolean }>).detail
      setSidebarW(detail.collapsed ? SIDEBAR_COLLAPSED : SIDEBAR_EXPANDED)
    }
    window.addEventListener('sidebar-toggle', handler)
    return () => window.removeEventListener('sidebar-toggle', handler)
  }, [])

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        background: '#F9FAFB',
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      {/* ── Fixed left sidebar ─────────────────────────────────────────────── */}
      <Sidebar onCollapse={(c) => setSidebarW(c ? SIDEBAR_COLLAPSED : SIDEBAR_EXPANDED)} />

      {/* ── Right content area — shifts with sidebar ───────────────────────── */}
      <div
        style={{
          marginLeft: sidebarW,
          flex: 1,
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
          transition: 'margin-left 0.2s ease',
        }}
      >
        <TopBar />
        <main style={{ flex: 1, padding: '24px 28px' }}>
          <PageRouter />
        </main>
      </div>
    </div>
  )
}

function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  )
}

export default App