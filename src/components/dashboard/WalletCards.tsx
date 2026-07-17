import { wallets, type Wallet } from '@/data/mockData'
import { useApp } from '@/context/AppContext'

function WalletCard({ wallet, hidden, refreshing }: { wallet: Wallet; hidden: boolean; refreshing: boolean }) {
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-3.5 flex flex-col min-w-0 hover:shadow-sm dark:hover:shadow-gray-900 transition-all duration-200">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-gray-800 dark:bg-gray-700 text-white tracking-wider">
          {wallet.currency}
        </span>
        <span className="text-[12px] text-gray-500 dark:text-gray-400 truncate">{wallet.region}</span>
      </div>

      {/* Amount */}
      <div className="flex items-baseline gap-1.5 mb-4 min-h-[28px]">
        {refreshing ? (
          <div className="h-5 w-24 rounded bg-gray-200 dark:bg-gray-800 animate-pulse" />
        ) : hidden ? (
          <p className="text-[22px] font-bold text-gray-300 dark:text-gray-700 leading-none tracking-widest select-none">
            *******
          </p>
        ) : (
          <>
            <p className="text-[22px] font-bold text-gray-900 dark:text-gray-100 leading-none tracking-tight">
              {wallet.symbol}&nbsp;{wallet.amount}
            </p>
            <span className="text-[12px] font-normal text-gray-400 dark:text-gray-600">{wallet.currencyCode}</span>
          </>
        )}
      </div>

      {/* Divider + Footer */}
      <div className="border-t border-gray-100 dark:border-gray-800 pt-2.5 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span className="text-[12px] text-emerald-600 dark:text-emerald-500 font-medium">{wallet.status}</span>
        </div>
        <span className="text-[12px] text-gray-400 dark:text-gray-600">{wallet.pocketType}</span>
      </div>
    </div>
  )
}

export function WalletCards() {
  const { hideBalances, isRefreshing } = useApp()

  return (
    <div className="grid grid-cols-4 gap-3">
      {wallets.map((wallet) => (
        <WalletCard
          key={wallet.id}
          wallet={wallet}
          hidden={hideBalances}
          refreshing={isRefreshing}
        />
      ))}
    </div>
  )
}
