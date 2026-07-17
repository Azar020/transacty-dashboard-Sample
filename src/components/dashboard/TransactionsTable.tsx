import { useState } from 'react'
import { Search, ChevronRight, ChevronUp, ChevronDown, X } from 'lucide-react'
import { transactions as allTransactions, type Transaction } from '@/data/mockData'
import { cn } from '@/lib/utils'
import { useApp } from '@/context/AppContext'

type TabValue = 'all' | 'successful' | 'pending' | 'failed'
type SortKey = 'transactionId' | 'customer' | 'type' | 'amount' | 'status' | 'date'
type SortDir = 'asc' | 'desc'

const tabs: { value: TabValue; label: string; count: number }[] = [
  { value: 'all', label: 'All', count: 10 },
  { value: 'successful', label: 'Successful', count: 2 },
  { value: 'pending', label: 'Pending', count: 2 },
  { value: 'failed', label: 'Failed', count: 6 },
]

function StatusDot({ status }: { status: Transaction['status'] }) {
  return (
    <span
      className={cn('inline-block w-1.5 h-1.5 rounded-full mr-1 flex-shrink-0', {
        'bg-emerald-500': status === 'Success',
        'bg-red-500': status === 'Failed',
        'bg-yellow-500': status === 'Pending',
      })}
    />
  )
}

function StatusBadge({ status }: { status: Transaction['status'] }) {
  return (
    <span
      className={cn('flex items-center text-xs font-medium', {
        'text-emerald-600 dark:text-emerald-500': status === 'Success',
        'text-red-600 dark:text-red-500': status === 'Failed',
        'text-yellow-600 dark:text-yellow-500': status === 'Pending',
      })}
    >
      <StatusDot status={status} />
      {status} —
    </span>
  )
}

// ── Transaction Detail Drawer ────────────────────────────────────────────────
function TransactionDrawer({ tx, onClose }: { tx: Transaction | null; onClose: () => void }) {
  if (!tx) return null
  return (
    <>
      <div className="fixed inset-0 bg-black/30 dark:bg-black/50 z-30" onClick={onClose} />
      <div className="fixed right-0 top-0 bottom-0 z-40 w-[320px] bg-white dark:bg-gray-900 shadow-2xl flex flex-col animate-[slideInRight_0.2s_ease-out]">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">Transaction Details</h3>
            <p className="text-[11px] text-gray-400 dark:text-gray-600 font-mono mt-0.5 break-all">{tx.transactionId}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          <div className="flex items-center justify-between py-3 px-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Status</span>
            <span
              className={cn('flex items-center gap-1.5 text-xs font-semibold', {
                'text-emerald-600 dark:text-emerald-500': tx.status === 'Success',
                'text-red-600 dark:text-red-500': tx.status === 'Failed',
                'text-yellow-600 dark:text-yellow-500': tx.status === 'Pending',
              })}
            >
              <span
                className={cn('w-2 h-2 rounded-full', {
                  'bg-emerald-500': tx.status === 'Success',
                  'bg-red-500': tx.status === 'Failed',
                  'bg-yellow-500': tx.status === 'Pending',
                })}
              />
              {tx.status}
            </span>
          </div>

          {[
            { label: 'Customer', value: tx.customer, mono: true },
            { label: 'Type', value: tx.type },
            { label: 'Amount', value: tx.amount },
            { label: 'Settled', value: tx.settled },
            { label: 'Fee', value: tx.fee ?? '—' },
            { label: 'Date', value: tx.date },
          ].map(({ label, value, mono }) => (
            <div key={label} className="flex flex-col gap-0.5">
              <span className="text-[10px] font-semibold text-gray-400 dark:text-gray-600 uppercase tracking-wider">{label}</span>
              <span className={cn('text-sm text-gray-800 dark:text-gray-200', mono && 'font-mono text-xs break-all')}>
                {value}
              </span>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-100 dark:border-gray-800 px-5 py-3">
          <button
            onClick={onClose}
            className="w-full py-2 text-xs font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </>
  )
}

// ── Sort Icon ────────────────────────────────────────────────────────────────
function SortIcon({ col, sortKey, sortDir }: { col: SortKey; sortKey: SortKey; sortDir: SortDir }) {
  if (col !== sortKey) return <ChevronDown size={10} className="text-gray-300 dark:text-gray-700 ml-0.5" />
  return sortDir === 'asc'
    ? <ChevronUp size={10} className="text-gray-700 dark:text-gray-300 ml-0.5" />
    : <ChevronDown size={10} className="text-gray-700 dark:text-gray-300 ml-0.5" />
}

// ── Main Component ───────────────────────────────────────────────────────────
export function TransactionsTable() {
  const { environment } = useApp()
  const [activeTab, setActiveTab] = useState<TabValue>('all')
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('date')
  const [sortDir, setSortDir] = useState<SortDir>('desc')
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null)

  const handleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  const query = search.toLowerCase().trim()

  const filtered = allTransactions
    .filter((t) => {
      const matchesTab =
        activeTab === 'all' ||
        (activeTab === 'successful' && t.status === 'Success') ||
        (activeTab === 'failed' && t.status === 'Failed') ||
        (activeTab === 'pending' && t.status === 'Pending')

      const matchesSearch =
        !query ||
        t.transactionId.toLowerCase().includes(query) ||
        t.customer.toLowerCase().includes(query) ||
        t.type.toLowerCase().includes(query) ||
        t.status.toLowerCase().includes(query)

      return matchesTab && matchesSearch
    })
    .sort((a, b) => {
      const av = String(a[sortKey as keyof Transaction] ?? '').toLowerCase()
      const bv = String(b[sortKey as keyof Transaction] ?? '').toLowerCase()
      if (av < bv) return sortDir === 'asc' ? -1 : 1
      if (av > bv) return sortDir === 'asc' ? 1 : -1
      return 0
    })

  const SortTh = ({
    col, label, className, align = 'left',
  }: { col: SortKey; label: string; className?: string; align?: 'left' | 'right' }) => (
    <th
      onClick={() => handleSort(col)}
      className={cn(
        'py-2.5 font-semibold text-gray-500 dark:text-gray-500 uppercase tracking-wide text-[10px] cursor-pointer select-none hover:text-gray-700 dark:hover:text-gray-300 transition-colors',
        align === 'right' ? 'px-3 text-right' : 'px-3 text-left',
        className
      )}
    >
      <span className={cn('inline-flex items-center gap-0.5', align === 'right' && 'flex-row-reverse')}>
        {label}
        <SortIcon col={col} sortKey={sortKey} sortDir={sortDir} />
      </span>
    </th>
  )

  return (
    <>
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden transition-colors duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-4 pt-4 pb-2">
          <div>
            <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Recent activity</h2>
            <p className="text-xs text-gray-400 dark:text-gray-600 mt-0.5">
              Last 10 transactions · synced just now.{' '}
              <button className="text-gray-700 dark:text-gray-400 underline cursor-pointer hover:text-gray-900 dark:hover:text-gray-200">
                View all
              </button>{' '}
              for full history.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="relative">
              <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-600 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search transactions…"
                className="h-7 pl-7 pr-3 text-xs rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-900 dark:focus:ring-gray-400 focus:bg-white dark:focus:bg-gray-800 w-[180px] transition-all"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer"
                >
                  <X size={11} />
                </button>
              )}
            </div>
            <button className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 cursor-pointer whitespace-nowrap">
              View all <ChevronRight size={12} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center px-4 border-b border-gray-200 dark:border-gray-800">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={cn(
                'flex items-center gap-1.5 px-2.5 py-2 text-xs font-medium border-b-2 transition-colors cursor-pointer -mb-px',
                activeTab === tab.value
                  ? 'border-gray-900 dark:border-gray-100 text-gray-900 dark:text-gray-100'
                  : 'border-transparent text-gray-500 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              )}
            >
              {tab.label}
              <span
                className={cn(
                  'inline-flex items-center justify-center w-4 h-4 rounded-full text-[10px] font-bold',
                  activeTab === tab.value
                    ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-500'
                )}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30">
                <SortTh col="transactionId" label="Transaction" className="pl-4" />
                <SortTh col="customer" label="Customer" />
                <SortTh col="type" label="Type" />
                <SortTh col="amount" label="Amount" align="right" />
                <th className="px-3 py-2.5 text-right font-semibold text-gray-500 dark:text-gray-500 uppercase tracking-wide text-[10px]">
                  Settled
                </th>
                <th className="px-3 py-2.5 text-right font-semibold text-gray-500 dark:text-gray-500 uppercase tracking-wide text-[10px]">
                  Fee
                </th>
                <SortTh col="status" label="Status" />
                <SortTh col="date" label="Date" align="right" />
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-xs text-gray-400 dark:text-gray-600">
                    No transactions match your search.
                  </td>
                </tr>
              ) : (
                filtered.map((tx) => (
                  <tr
                    key={tx.id}
                    onClick={() => setSelectedTx(tx)}
                    className="border-b border-gray-100 dark:border-gray-800 hover:bg-blue-50/30 dark:hover:bg-gray-800/60 transition-colors cursor-pointer group"
                  >
                    <td className="pl-4 pr-3 py-2.5 text-gray-700 dark:text-gray-300 font-mono text-[11px] w-[130px] min-w-[130px]">
                      {tx.transactionId}
                    </td>
                    <td className="px-3 py-2.5 text-gray-600 dark:text-gray-400 font-mono text-[11px] w-[120px] min-w-[120px]">
                      {tx.customer}
                    </td>
                    <td className="px-3 py-2.5 w-[140px] min-w-[140px]">
                      <span className="inline-flex items-center px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-[11px] font-medium group-hover:bg-gray-200 dark:group-hover:bg-gray-700 transition-colors">
                        {tx.type}
                      </span>
                    </td>
                    <td className={cn('px-3 py-2.5 text-right text-[11px] w-[90px]', tx.isStrikethrough ? 'line-through text-gray-400 dark:text-gray-700' : 'text-gray-700 dark:text-gray-300')}>
                      {tx.amount}
                    </td>
                    <td className={cn('px-3 py-2.5 text-right text-[11px] w-[90px]', tx.isStrikethrough ? 'line-through text-gray-400 dark:text-gray-700' : 'text-gray-700 dark:text-gray-300')}>
                      {tx.settled}
                    </td>
                    <td className="px-3 py-2.5 text-right text-gray-700 dark:text-gray-300 text-[11px] w-[70px]">
                      {tx.fee ?? <span className="text-gray-300 dark:text-gray-700">—</span>}
                    </td>
                    <td className="px-3 py-2.5 w-[90px]">
                      <StatusBadge status={tx.status} />
                    </td>
                    <td className="px-3 py-2.5 text-right text-gray-500 dark:text-gray-500 text-[11px] w-[100px]">
                      {tx.date}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Environment banner */}
        {environment === 'test' ? (
          <div className="px-4 py-2 bg-red-50 dark:bg-red-950/30 border-t border-red-100 dark:border-red-900/50">
            <p className="text-xs text-red-600 dark:text-red-500 text-center font-medium">
              You are currently in Test Mode.
            </p>
          </div>
        ) : (
          <div className="px-4 py-2 bg-emerald-50 dark:bg-emerald-950/30 border-t border-emerald-100 dark:border-emerald-900/50">
            <p className="text-xs text-emerald-700 dark:text-emerald-500 text-center font-medium">
              ● You are in Live Mode — real transactions are active.
            </p>
          </div>
        )}
      </div>

      <TransactionDrawer tx={selectedTx} onClose={() => setSelectedTx(null)} />
    </>
  )
}
