import * as React from 'react'
import { cn } from '@/lib/utils'

const Tabs = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { defaultValue?: string; value?: string; onValueChange?: (value: string) => void }
>(({ className, defaultValue, value: controlledValue, onValueChange, children, ...props }, ref) => {
  const [internalValue, setInternalValue] = React.useState(defaultValue ?? '')
  const value = controlledValue ?? internalValue

  const handleValueChange = (newValue: string) => {
    setInternalValue(newValue)
    onValueChange?.(newValue)
  }

  return (
    <div
      ref={ref}
      className={cn('', className)}
      data-value={value}
      {...props}
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<{ value?: string; onValueChange?: (v: string) => void }>, {
            value,
            onValueChange: handleValueChange,
          })
        }
        return child
      })}
    </div>
  )
})
Tabs.displayName = 'Tabs'

const TabsList = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { value?: string; onValueChange?: (v: string) => void }
>(({ className, value, onValueChange, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn('flex items-center gap-0.5', className)}
      {...props}
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<{ activeValue?: string; onValueChange?: (v: string) => void }>, {
            activeValue: value,
            onValueChange,
          })
        }
        return child
      })}
    </div>
  )
})
TabsList.displayName = 'TabsList'

const TabsTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    value: string
    activeValue?: string
    onValueChange?: (v: string) => void
  }
>(({ className, value, activeValue, onValueChange, children, ...props }, ref) => {
  const isActive = value === activeValue
  return (
    <button
      ref={ref}
      className={cn(
        'flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium transition-colors rounded cursor-pointer',
        isActive
          ? 'border-b-2 border-gray-900 text-gray-900'
          : 'text-gray-500 hover:text-gray-700',
        className
      )}
      onClick={() => onValueChange?.(value)}
      {...props}
    >
      {children}
    </button>
  )
})
TabsTrigger.displayName = 'TabsTrigger'

const TabsContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { value: string; activeValue?: string }
>(({ value, activeValue, children, ...props }, ref) => {
  if (value !== activeValue) return null
  return (
    <div ref={ref} {...props}>
      {children}
    </div>
  )
})
TabsContent.displayName = 'TabsContent'

export { Tabs, TabsList, TabsTrigger, TabsContent }
