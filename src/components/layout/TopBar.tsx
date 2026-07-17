import { Sun, Moon } from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { cn } from '@/lib/utils'

export function TopBar() {
  const { environment, theme, toggleTheme } = useApp()

  return (
    <header className="fixed top-0 right-0 left-[148px] h-12 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 z-10 flex items-center justify-between px-6 transition-colors duration-200">
      {/* Left: environment pill */}
      <div className="flex items-center gap-2">

      </div>

      {/* Right: theme toggle + user info */}
      <div className="flex items-center gap-3">

        {/* ── Light / Dark toggle pill ── */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className={cn(
            'relative flex items-center w-[52px] h-7 rounded-full border transition-all duration-300 cursor-pointer flex-shrink-0',
            theme === 'dark'
              ? 'bg-gray-800 border-gray-700'
              : 'bg-gray-100 border-gray-200'
          )}
        >
          {/* Track icons */}
          <Sun
            size={11}
            className={cn(
              'absolute left-[7px] transition-opacity duration-200',
              theme === 'dark' ? 'opacity-30 text-gray-500' : 'opacity-100 text-amber-500'
            )}
          />
          <Moon
            size={11}
            className={cn(
              'absolute right-[7px] transition-opacity duration-200',
              theme === 'dark' ? 'opacity-100 text-indigo-400' : 'opacity-30 text-gray-400'
            )}
          />
          {/* Thumb */}
          <span
            className={cn(
              'absolute w-5 h-5 rounded-full shadow-sm transition-transform duration-300 flex items-center justify-center',
              theme === 'dark'
                ? 'translate-x-[28px] bg-gray-900 border border-gray-700'
                : 'translate-x-[3px] bg-white border border-gray-200'
            )}
          >
            {theme === 'dark'
              ? <Moon size={10} className="text-indigo-400" />
              : <Sun size={10} className="text-amber-500" />
            }
          </span>
        </button>

        {/* Divider */}
        <span className="w-px h-5 bg-gray-200 dark:bg-gray-700" />

        {/* User info */}
        <div className="text-right">
          <p className="text-xs font-semibold text-gray-900 dark:text-gray-100 leading-tight">TRANSACTY</p>
          <p className="text-[10px] text-gray-400 dark:text-gray-500 leading-tight">techinfra@n23digital.com · admin</p>
        </div>
        <div className="w-7 h-7 rounded-full bg-gray-900 dark:bg-gray-700 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
          T
        </div>
      </div>
    </header>
  )
}
