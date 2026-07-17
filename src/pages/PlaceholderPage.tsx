import type { ReactNode } from 'react'

interface PlaceholderPageProps {
  title: string
  description: string
  icon: ReactNode
  children?: ReactNode
}

export function PlaceholderPage({ title, description, icon, children }: PlaceholderPageProps) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">{title}</h1>
        <p className="text-xs text-gray-400 dark:text-gray-600 mt-1">{description}</p>
      </div>

      {children ?? (
        <div className="flex flex-col items-center justify-center py-24 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-center gap-4 transition-colors duration-200">
          <div className="w-14 h-14 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400 dark:text-gray-600">
            {icon}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">{title} coming soon</p>
            <p className="text-xs text-gray-400 dark:text-gray-600 mt-1">This section is under construction.</p>
          </div>
        </div>
      )}
    </div>
  )
}
