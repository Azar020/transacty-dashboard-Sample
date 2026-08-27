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
        'inline-flex items-center justify-center gap-1.5 rounded-lg font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/50 disabled:pointer-events-none disabled:opacity-50 cursor-pointer select-none',
        {
          // default — deep indigo, professional CTA
          'bg-indigo-600 text-white shadow-sm hover:bg-indigo-700 hover:shadow-[0_2px_12px_rgba(79,70,229,0.30)] active:bg-indigo-800':
            variant === 'default',

          // outline — clean white/glass with border
          'bg-white dark:bg-white/[0.04] border border-gray-200 dark:border-white/[0.09] text-slate-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-white/[0.07] hover:border-indigo-300 dark:hover:border-indigo-700/60 hover:shadow-sm':
            variant === 'outline',

          // ghost
          'text-slate-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-white/[0.06] hover:text-slate-800 dark:hover:text-slate-200':
            variant === 'ghost',

          // secondary
          'bg-gray-100 dark:bg-white/[0.06] text-slate-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-white/[0.09] border border-gray-200 dark:border-white/[0.08]':
            variant === 'secondary',

          // destructive
          'bg-red-600 text-white hover:bg-red-700 hover:shadow-[0_2px_10px_rgba(220,38,38,0.30)]':
            variant === 'destructive',
        },
        {
          'h-7 px-3 text-xs':   size === 'sm',
          'h-8 px-3.5 text-sm': size === 'md',
          'h-9 px-5 text-sm':   size === 'lg',
          'h-8 w-8':            size === 'icon',
        },
        className
      )}
      {...props}
    />
  )
})

Button.displayName = 'Button'

export { Button }
