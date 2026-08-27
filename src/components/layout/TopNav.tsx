import { cn } from '@/lib/utils'
import { useApp, type ActivePage } from '@/context/AppContext'
import { Sun, Moon } from 'lucide-react'
import {
  LayoutDashboard, Wallet, ArrowLeftRight, Send, Users, Settings,
} from 'lucide-react'

interface NavItem { label: string; page: ActivePage; icon: React.ReactNode }

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard',    page: 'dashboard',    icon: <LayoutDashboard size={13} /> },
  { label: 'Wallets',      page: 'wallets',      icon: <Wallet size={13} /> },
  { label: 'Transactions', page: 'transactions', icon: <ArrowLeftRight size={13} /> },
  { label: 'Payouts',      page: 'payouts',      icon: <Send size={13} /> },
  { label: 'Customers',    page: 'customers',    icon: <Users size={13} /> },
  { label: 'Settings',     page: 'settings',     icon: <Settings size={13} /> },
]

export function TopNav() {
  const { activePage, setActivePage, environment, setEnvironment, theme, toggleTheme } = useApp()
  const isDark = theme === 'dark'

  const navBg = isDark
    ? 'rgba(13, 17, 23, 0.92)'
    : 'rgba(255, 255, 255, 0.92)'
  const navBorder = isDark
    ? 'rgba(255, 255, 255, 0.07)'
    : '#E2E8F0'
  const navShadow = isDark
    ? '0 1px 0 rgba(255,255,255,0.06), 0 2px 12px rgba(0,0,0,0.30)'
    : '0 1px 0 #E2E8F0, 0 2px 8px rgba(15,23,42,0.04)'

  return (
    <header
      className="fixed top-0 left-0 right-0 z-30 h-[56px] flex items-center px-5"
      style={{
        background: navBg,
        backdropFilter: 'blur(20px) saturate(160%)',
        WebkitBackdropFilter: 'blur(20px) saturate(160%)',
        borderBottom: `1px solid ${navBorder}`,
        boxShadow: navShadow,
      }}
    >
      {/* ── Logo ──────────────────────────────────────────────────────────── */}
      <button
        onClick={() => setActivePage('dashboard')}
        className="flex items-center flex-shrink-0 cursor-pointer"
        aria-label="Go to dashboard"
      >
        <img src="/public/icon2.png" alt="Transacty" className="h-7 w-auto" />
      </button>

      {/* ── Nav items — absolutely centered ───────────────────────────────── */}
      <nav className="absolute left-1/2 -translate-x-1/2 flex items-center gap-0.5">
        {NAV_ITEMS.map((item) => {
          const isActive = activePage === item.page
          return (
            <button
              key={item.page}
              onClick={() => setActivePage(item.page)}
              className={cn(
                'relative flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[12.5px] font-medium transition-all duration-150 cursor-pointer select-none',
                isActive
                  ? isDark ? 'text-indigo-300' : 'text-indigo-600'
                  : isDark
                    ? 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.05]'
                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100/70'
              )}
              style={isActive ? {
                background: isDark
                  ? 'rgba(79,70,229,0.15)'
                  : 'rgba(79,70,229,0.08)',
                border: isDark
                  ? '1px solid rgba(79,70,229,0.25)'
                  : '1px solid rgba(79,70,229,0.16)',
              } : {
                border: '1px solid transparent',
              }}
            >
              <span
                className={cn('flex-shrink-0 transition-colors duration-150',
                  isActive
                    ? isDark ? 'text-indigo-400' : 'text-indigo-500'
                    : isDark ? 'text-slate-500 group-hover:text-slate-400' : 'text-slate-400'
                )}
              >
                {item.icon}
              </span>
              {item.label}
              {/* Active underline indicator */}
              {isActive && (
                <span
                  className="absolute bottom-[-1px] left-1/2 -translate-x-1/2 h-[2px] rounded-full"
                  style={{
                    width: '60%',
                    background: isDark ? '#818CF8' : '#4F46E5',
                    opacity: 0.8,
                  }}
                />
              )}
            </button>
          )
        })}
      </nav>

      {/* ── Right controls ────────────────────────────────────────────────── */}
      <div className="ml-auto flex items-center gap-2.5 flex-shrink-0">
        {/* Environment toggle */}
        <div
          className="flex items-center gap-0.5 p-0.5 rounded-md"
          style={{
            background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)',
            border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0',
          }}
        >
          {[
            { label: 'Test', value: 'test' as const, activeColor: '#D97706', activeBg: 'rgba(217,119,6,0.10)', borderColor: 'rgba(217,119,6,0.22)' },
            { label: 'Live', value: 'live' as const, activeColor: '#16A34A', activeBg: 'rgba(22,163,74,0.09)',  borderColor: 'rgba(22,163,74,0.22)' },
          ].map((env) => {
            const isEnvActive = environment === env.value
            return (
              <button
                key={env.value}
                onClick={() => setEnvironment(env.value)}
                className="px-2.5 py-1 text-[11px] font-semibold rounded-sm transition-all duration-150 cursor-pointer"
                style={isEnvActive ? {
                  color: env.activeColor,
                  background: env.activeBg,
                  border: `1px solid ${env.borderColor}`,
                  borderRadius: '4px',
                } : {
                  color: isDark ? 'rgba(255,255,255,0.35)' : '#94A3B8',
                  border: '1px solid transparent',
                }}
              >
                {env.label}
              </button>
            )
          })}
        </div>

        {/* Divider */}
        <span
          className="w-px h-5"
          style={{ background: isDark ? 'rgba(255,255,255,0.08)' : '#E2E8F0' }}
        />

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="relative flex items-center w-[48px] h-[26px] rounded-full cursor-pointer flex-shrink-0 transition-all duration-300"
          style={{
            background: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)',
            border: isDark ? '1px solid rgba(255,255,255,0.10)' : '1px solid #E2E8F0',
          }}
        >
          <Sun  size={10} className={cn('absolute left-[7px] transition-opacity duration-200', isDark ? 'opacity-20 text-slate-400' : 'opacity-100 text-amber-500')} />
          <Moon size={10} className={cn('absolute right-[7px] transition-opacity duration-200', isDark ? 'opacity-100 text-indigo-400' : 'opacity-20 text-slate-400')} />
          <span
            className="absolute w-[19px] h-[19px] rounded-full flex items-center justify-center transition-transform duration-300"
            style={{
              transform: isDark ? 'translateX(26px)' : 'translateX(3px)',
              background: isDark ? '#1E1B4B' : 'white',
              border: isDark ? '1px solid rgba(79,70,229,0.35)' : '1px solid #E2E8F0',
              boxShadow: isDark ? '0 0 6px rgba(79,70,229,0.25)' : '0 1px 3px rgba(0,0,0,0.10)',
            }}
          >
            {isDark ? <Moon size={9} className="text-indigo-400" /> : <Sun size={9} className="text-amber-500" />}
          </span>
        </button>

        {/* Divider */}
        <span
          className="w-px h-5"
          style={{ background: isDark ? 'rgba(255,255,255,0.08)' : '#E2E8F0' }}
        />

        {/* User */}
        <div className="hidden sm:flex items-center gap-2.5">
          <div className="text-right">
            <p className="text-[12px] font-semibold leading-tight"
               style={{ color: isDark ? '#F1F5F9' : '#111827' }}>TRANSACTY</p>
            <p className="text-[10px] leading-tight"
               style={{ color: isDark ? 'rgba(255,255,255,0.35)' : '#94A3B8' }}>admin</p>
          </div>
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[12px] font-bold flex-shrink-0 cursor-pointer select-none"
            style={{
              background: 'linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)',
              boxShadow: '0 2px 8px rgba(79,70,229,0.30)',
            }}
          >
            T
          </div>
        </div>
      </div>
    </header>
  )
}
