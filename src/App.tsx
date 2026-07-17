import { Sidebar } from '@/components/layout/Sidebar'
import { TopBar } from '@/components/layout/TopBar'
import { DashboardPage } from '@/pages/DashboardPage'
import { PlaceholderPage } from '@/pages/PlaceholderPage'
import { AppProvider, useApp } from '@/context/AppContext'
import { Wallet, ArrowLeftRight, Send, Users, Settings } from 'lucide-react'

function PageRouter() {
  const { activePage } = useApp()

  switch (activePage) {
    case 'dashboard':
      return <DashboardPage />
    case 'wallets':
      return (
        <PlaceholderPage
          title="Wallets"
          description="Manage your merchant wallets and pocket balances."
          icon={<Wallet size={24} />}
        />
      )
    case 'transactions':
      return (
        <PlaceholderPage
          title="Transactions"
          description="View and export your full transaction history."
          icon={<ArrowLeftRight size={24} />}
        />
      )
    case 'payouts':
      return (
        <PlaceholderPage
          title="Payouts"
          description="Track and manage all your payout requests."
          icon={<Send size={24} />}
        />
      )
    case 'customers':
      return (
        <PlaceholderPage
          title="Customers"
          description="Browse and manage your customer directory."
          icon={<Users size={24} />}
        />
      )
    case 'settings':
      return (
        <PlaceholderPage
          title="Settings"
          description="Configure your account, API keys, and preferences."
          icon={<Settings size={24} />}
        />
      )
    default:
      return <DashboardPage />
  }
}

function App() {
  return (
    <AppProvider>
      <div
        className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-200"
        style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
      >
        <Sidebar />
        <TopBar />
        <main className="ml-[148px] pt-12">
          <div className="p-6">
            <PageRouter />
          </div>
        </main>
      </div>
    </AppProvider>
  )
}

export default App