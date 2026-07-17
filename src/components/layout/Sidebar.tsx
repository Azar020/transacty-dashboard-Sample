import { cn } from '@/lib/utils'
import { useApp, type ActivePage } from '@/context/AppContext'
import {
  LayoutDashboard,
  Wallet,
  ArrowLeftRight,
  Send,
  Users,
  Settings,
  LogOut,
} from 'lucide-react'

interface NavItem {
  label: string
  page: ActivePage
  icon: React.ReactNode
}

interface NavSection {
  title: string
  items: NavItem[]
}

const navSections: NavSection[] = [
  {
    title: 'OVERVIEW',
    items: [
      { label: 'Dashboard', page: 'dashboard', icon: <LayoutDashboard size={14} /> },
      { label: 'Wallets', page: 'wallets', icon: <Wallet size={14} /> },

    ],
  },
  {
    title: 'PAYMENTS',
    items: [
      { label: 'Transactions', page: 'transactions', icon: <ArrowLeftRight size={14} /> },
      { label: 'Payouts', page: 'payouts', icon: <Send size={14} /> },
    ],
  },
  {
    title: 'CUSTOMERS',
    items: [
      { label: 'Customers', page: 'customers', icon: <Users size={14} /> },
    ],
  },
  {
    title: 'SETTINGS',
    items: [
      { label: 'Settings', page: 'settings', icon: <Settings size={14} /> },
    ],
  },
]

export function Sidebar() {
  const { activePage, setActivePage, environment, setEnvironment } = useApp()

  return (
    <aside className="flex flex-col w-[148px] min-h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 fixed left-0 top-0 bottom-0 z-20 transition-colors duration-200">
      {/* Logo */}
      <div className="flex items-center gap-2 px-4 py-[14px] border-b border-gray-100 dark:border-gray-800">
        <button
          onClick={() => setActivePage('dashboard')}
          className="flex items-center gap-1.5 cursor-pointer"
        >
          <img src="/icon2.png" alt="" height={330} width={330} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-3 space-y-4 overflow-y-auto">
        {navSections.map((section) => (
          <div key={section.title}>
            <p className="px-2 mb-1 text-[10px] font-semibold text-gray-400 dark:text-gray-600 tracking-wider uppercase">
              {section.title}
            </p>
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const isActive = activePage === item.page
                return (
                  <li key={item.label}>
                    <button
                      onClick={() => setActivePage(item.page)}
                      className={cn(
                        'w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-[13px] font-medium transition-colors cursor-pointer',
                        isActive
                          ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100'
                      )}
                    >
                      <span
                        className={cn(
                          isActive
                            ? 'text-white dark:text-gray-800'
                            : 'text-gray-400 dark:text-gray-600'
                        )}
                      >
                        {item.icon}
                      </span>
                      {item.label}
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Environment & Logout */}
      <div className="border-t border-gray-100 dark:border-gray-800 px-2 py-3">
        <p className="px-2 mb-1.5 text-[10px] font-semibold text-gray-400 dark:text-gray-600 tracking-wider uppercase">
          ENVIRONMENT
        </p>
        <div className="flex items-center gap-1 mb-2 p-0.5 bg-gray-100 dark:bg-gray-800 rounded-md">
          <button
            onClick={() => setEnvironment('test')}
            className={cn(
              'flex-1 py-1 text-[11px] font-semibold rounded transition-colors cursor-pointer',
              environment === 'test'
                ? 'bg-gray-900 dark:bg-gray-200 text-white dark:text-gray-900 shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            )}
          >
            Test
          </button>
          <button
            onClick={() => setEnvironment('live')}
            className={cn(
              'flex-1 py-1 text-[11px] font-semibold rounded transition-colors cursor-pointer',
              environment === 'live'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            )}
          >
            Live
          </button>
        </div>
        <button className="w-full flex items-center gap-1.5 px-2 py-1.5 text-[13px] text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100 rounded-md transition-colors cursor-pointer">
          <LogOut size={13} className="text-gray-400 dark:text-gray-600" />
          Logout
        </button>
      </div>
    </aside>
  )
}
