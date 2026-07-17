import * as React from 'react'
import { cn } from '@/lib/utils'

const Button = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: 'default' | 'outline' | 'ghost' | 'secondary' | 'destructive'
    size?: 'sm' | 'md' | 'lg' | 'icon'
  }
>(({ className, variant = 'default', size = 'md', ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center gap-1.5 rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-900 dark:focus-visible:ring-gray-300 disabled:pointer-events-none disabled:opacity-50 cursor-pointer',
        {
          // default  → black in light, white in dark
          'bg-gray-900 text-white shadow hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100':
            variant === 'default',

          // outline  → white-bg bordered in light, dark-bg bordered in dark
          'border border-gray-200 bg-white text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800':
            variant === 'outline',

          // ghost    → transparent, subtle hover
          'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800':
            variant === 'ghost',

          // secondary
          'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700':
            variant === 'secondary',

          // destructive
          'bg-red-600 text-white hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600':
            variant === 'destructive',
        },
        {
          'h-7 px-2.5 text-xs': size === 'sm',
          'h-8 px-3 text-sm': size === 'md',
          'h-9 px-4 text-sm': size === 'lg',
          'h-8 w-8': size === 'icon',
        },
        className
      )}
      {...props}
    />
  )
})

Button.displayName = 'Button'

export { Button }
