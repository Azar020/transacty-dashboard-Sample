import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'

export type Environment = 'test' | 'live'
export type ActivePage = 'dashboard' | 'wallets' | 'transactions' | 'payouts' | 'customers' | 'settings'
export type Theme = 'light' | 'dark'

interface AppState {
  hideBalances: boolean
  environment: Environment
  isRefreshing: boolean
  activePage: ActivePage
  theme: Theme
  selectedWalletCode: string
  toggleHideBalances: () => void
  setEnvironment: (env: Environment) => void
  refreshBalances: () => void
  setActivePage: (page: ActivePage) => void
  setSelectedWalletCode: (code: string) => void
  navigateToWallet: (code: string) => void
  toggleTheme: () => void
}

const AppContext = createContext<AppState | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [hideBalances, setHideBalances] = useState(false)
  const [environment, setEnvironment] = useState<Environment>('test')
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [activePage, setActivePage] = useState<ActivePage>('dashboard')
  const [selectedWalletCode, setSelectedWalletCode] = useState<string>('BDT')
  const [theme, setTheme] = useState<Theme>(() => {
    // Persist theme preference across sessions
    return (localStorage.getItem('transacty-theme') as Theme) ?? 'light'
  })

  // Apply / remove `dark` class on <html> whenever theme changes
  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    localStorage.setItem('transacty-theme', theme)
  }, [theme])

  const toggleHideBalances = useCallback(() => {
    setHideBalances((prev) => !prev)
  }, [])

  const refreshBalances = useCallback(() => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 1800)
  }, [])

  const navigateToWallet = useCallback((code: string) => {
    setSelectedWalletCode(code)
    setActivePage('wallets')
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))
  }, [])

  return (
    <AppContext.Provider
      value={{
        hideBalances,
        environment,
        isRefreshing,
        activePage,
        theme,
        selectedWalletCode,
        toggleHideBalances,
        setEnvironment,
        refreshBalances,
        setActivePage,
        setSelectedWalletCode,
        navigateToWallet,
        toggleTheme,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside AppProvider')
  return ctx
}
