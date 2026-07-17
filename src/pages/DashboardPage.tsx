import { useState } from 'react'
import { RefreshCw, EyeOff, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { WalletCards } from '@/components/dashboard/WalletCards'
import { TransactionsTable } from '@/components/dashboard/TransactionsTable'
import { WalletDistribution } from '@/components/dashboard/WalletDistribution'
import { RequestPayoutModal } from '@/components/dashboard/RequestPayoutModal'
import { useApp } from '@/context/AppContext'
import { cn } from '@/lib/utils'

export function DashboardPage() {
  const { hideBalances, toggleHideBalances, isRefreshing, refreshBalances } = useApp()
  const [payoutOpen, setPayoutOpen] = useState(false)

  return (
    <div className="flex flex-col gap-5">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Dashboard</h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 text-xs font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Verified merchant
            </span>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-600 mt-1">Monitor transactions, customers, and payouts at a glance.</p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 text-xs"
            onClick={refreshBalances}
            disabled={isRefreshing}
          >
            <RefreshCw size={12} className={cn(isRefreshing && 'animate-spin')} />
            {isRefreshing ? 'Refreshing…' : 'Refresh balances'}
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 text-xs"
            onClick={toggleHideBalances}
          >
            {hideBalances ? <Eye size={12} /> : <EyeOff size={12} />}
            {hideBalances ? 'Show balances' : 'Hide balances'}
          </Button>

          <Button
            variant="default"
            size="sm"
            className="text-xs font-semibold"
            onClick={() => setPayoutOpen(true)}
          >
            Request payout
          </Button>
        </div>
      </div>



      {/* Wallet Cards Row */}
      <WalletCards />

      {/* Bottom Section */}
      <div className="flex gap-4">
        <div className="flex-1 min-w-0">
          <TransactionsTable />
        </div>
        <div className="w-[220px] flex-shrink-0">
          <WalletDistribution />
        </div>
      </div>

      <RequestPayoutModal open={payoutOpen} onClose={() => setPayoutOpen(false)} />
    </div>
  )
}
