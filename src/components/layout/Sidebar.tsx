import { useApp, type ActivePage } from '@/context/AppContext'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard, Wallet, ArrowLeftRight, Send, Users, Settings,
  LogOut, ChevronLeft,
} from 'lucide-react'
import { useState } from 'react'

interface NavGroup {
  label: string
  items: { label: string; page: ActivePage; icon: React.ReactNode }[]
}

const NAV_GROUPS: NavGroup[] = [
  {
    label: 'OVERVIEW',
    items: [
      { label: 'Dashboard', page: 'dashboard', icon: <LayoutDashboard size={14} /> },
      { label: 'Wallets',   page: 'wallets',   icon: <Wallet size={14} /> },
    ],
  },
  {
    label: 'PAYMENTS',
    items: [
      { label: 'Transactions', page: 'transactions', icon: <ArrowLeftRight size={14} /> },
      { label: 'Payouts',      page: 'payouts',      icon: <Send size={14} /> },
    ],
  },
  {
    label: 'CUSTOMERS',
    items: [
      { label: 'Customers', page: 'customers', icon: <Users size={14} /> },
    ],
  },
  {
    label: 'SETTINGS',
    items: [
      { label: 'Settings', page: 'settings', icon: <Settings size={14} /> },
    ],
  },
]

interface SidebarProps {
  onCollapse?: (collapsed: boolean) => void
}

export function Sidebar({ onCollapse }: SidebarProps) {
  const { activePage, setActivePage, environment, setEnvironment } = useApp()
  const [collapsed, setCollapsed] = useState(false)

  const toggle = (val: boolean) => {
    setCollapsed(val)
    onCollapse?.(val)
  }

  const W = collapsed ? 56 : 200

  return (
    <aside
      style={{
        width: W,
        minWidth: W,
        maxWidth: W,
        transition: 'width 0.2s ease, min-width 0.2s ease, max-width 0.2s ease',
        background: '#FFFFFF',
        borderRight: '1px solid #E5E7EB',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        zIndex: 20,
        overflow: 'hidden',
      }}
    >
      {/* ── Logo / Header ──────────────────────────────────────────────────── */}
      <div
        className="flex items-center flex-shrink-0"
        style={{
          height: 52,
          padding: collapsed ? '0 8px' : '0 16px',
          borderBottom: '1px solid #E5E7EB',
          justifyContent: collapsed ? 'center' : 'space-between',
        }}
      >
        <button
          onClick={() => setActivePage('dashboard')}
          className="flex items-center gap-2 cursor-pointer min-w-0"
          aria-label="Go to dashboard"
        >
          <img src="/icon2.png" alt="Transacty" style={{ height: collapsed ? 22 : 26, width: 'auto', flexShrink: 0 }} />
        </button>
        {!collapsed && (
          <button
            onClick={() => toggle(true)}
            className="flex items-center justify-center w-6 h-6 rounded-md cursor-pointer transition-colors"
            style={{ color: '#9CA3AF', background: 'transparent', flexShrink: 0 }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#F3F4F6' }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent' }}
            aria-label="Collapse sidebar"
          >
            <ChevronLeft size={14} />
          </button>
        )}
      </div>

      {/* Expand strip when collapsed */}
      {collapsed && (
        <button
          onClick={() => toggle(false)}
          title="Expand sidebar"
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: '100%', padding: '8px 0',
            color: '#D1D5DB', background: 'transparent',
            borderBottom: '1px solid #E5E7EB', cursor: 'pointer',
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#F9FAFB' }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent' }}
          aria-label="Expand sidebar"
        >
          <ChevronLeft size={13} style={{ transform: 'rotate(180deg)' }} />
        </button>
      )}

      {/* ── Nav Groups ───────────────────────────────────────────────────── */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden" style={{ paddingTop: 12, paddingBottom: 4 }}>
        {NAV_GROUPS.map((group) => (
          <div key={group.label} style={{ marginBottom: 16 }}>
            {/* Group label — hidden when collapsed */}
            {!collapsed && (
              <p style={{
                fontSize: 9, fontWeight: 700, letterSpacing: '0.12em',
                color: '#9CA3AF', padding: '0 16px', marginBottom: 2,
                textTransform: 'uppercase',
              }}>
                {group.label}
              </p>
            )}
            {group.items.map((item) => {
              const isActive = activePage === item.page
              return (
                <button
                  key={item.page}
                  onClick={() => setActivePage(item.page)}
                  title={collapsed ? item.label : undefined}
                  className={cn(
                    'flex items-center w-full cursor-pointer transition-colors duration-100 select-none',
                    collapsed ? 'justify-center' : 'gap-2.5',
                  )}
                  style={{
                    padding: collapsed ? '8px 0' : '5px 16px',
                    fontSize: 13,
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? '#111827' : '#6B7280',
                    background: isActive ? '#F3F4F6' : 'transparent',
                    borderLeft: isActive ? '2px solid #111827' : '2px solid transparent',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = '#F9FAFB'
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = 'transparent'
                  }}
                >
                  <span style={{ color: isActive ? '#111827' : '#9CA3AF', flexShrink: 0, display: 'flex' }}>
                    {item.icon}
                  </span>
                  {!collapsed && <span style={{ lineHeight: 1.4 }}>{item.label}</span>}
                </button>
              )
            })}
          </div>
        ))}
      </nav>

      {/* ── Environment toggle + Logout ───────────────────────────────────── */}
      <div
        style={{
          borderTop: '1px solid #E5E7EB',
          padding: collapsed ? '10px 8px' : '10px 14px',
          flexShrink: 0,
        }}
      >
        {/* Environment label */}
        {!collapsed && (
          <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.10em', color: '#9CA3AF', marginBottom: 5, textTransform: 'uppercase' }}>
            ENVIRONMENT
          </p>
        )}

        {/* Toggle pill */}
        <div
          style={{
            display: 'flex', gap: 2, padding: 2,
            background: '#F3F4F6', border: '1px solid #E5E7EB',
            borderRadius: 6, width: '100%',
          }}
        >
          {(['test', 'live'] as const).map((env) => {
            const isEnvActive = environment === env
            return (
              <button
                key={env}
                onClick={() => setEnvironment(env)}
                title={collapsed ? (env === 'test' ? 'Test' : 'Live') : undefined}
                style={{
                  flex: 1,
                  textAlign: 'center',
                  fontSize: 11,
                  fontWeight: 600,
                  padding: '3px 0',
                  borderRadius: 4,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  color: isEnvActive
                    ? (env === 'live' ? '#166534' : '#111827')
                    : '#9CA3AF',
                  background: isEnvActive ? '#FFFFFF' : 'transparent',
                  border: isEnvActive ? '1px solid #D1D5DB' : '1px solid transparent',
                  boxShadow: isEnvActive ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
                }}
              >
                {collapsed ? (env === 'test' ? 'T' : 'L') : (env === 'test' ? 'Test' : 'Live')}
              </button>
            )
          })}
        </div>

        {/* Logout */}
        <button
          style={{
            display: 'flex', alignItems: 'center',
            gap: collapsed ? 0 : 7,
            justifyContent: collapsed ? 'center' : 'flex-start',
            width: '100%',
            marginTop: 8,
            padding: '5px 2px',
            fontSize: 12, fontWeight: 400,
            color: '#9CA3AF',
            background: 'transparent',
            borderRadius: 5,
            cursor: 'pointer',
            transition: 'all 0.15s',
          }}
          title={collapsed ? 'Logout' : undefined}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = '#374151'
            ;(e.currentTarget as HTMLButtonElement).style.background = '#F3F4F6'
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = '#9CA3AF'
            ;(e.currentTarget as HTMLButtonElement).style.background = 'transparent'
          }}
        >
          <LogOut size={13} style={{ flexShrink: 0 }} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  )
}
