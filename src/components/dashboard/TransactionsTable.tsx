import { useState } from 'react'
import { ChevronRight, ChevronUp, ChevronDown, X, Search } from 'lucide-react'
import { transactions as allTransactions, type Transaction } from '@/data/mockData'
import { useApp } from '@/context/AppContext'

type TabValue = 'all' | 'successful' | 'pending' | 'failed'
type SortKey = 'transactionId' | 'customer' | 'type' | 'amount' | 'status' | 'date'
type SortDir = 'asc' | 'desc'

const tabs: { value: TabValue; label: string }[] = [
  { value: 'all',        label: 'All'        },
  { value: 'successful', label: 'Successful'  },
  { value: 'pending',    label: 'Pending'     },
  { value: 'failed',     label: 'Failed'      },
]

function StatusBadge({ status }: { status: Transaction['status'] }) {
  const color =
    status === 'Success' ? '#16A34A'
    : status === 'Failed' ? '#DC2626'
    : '#D97706'
  const dot = (
    <span
      style={{
        width: 6, height: 6, borderRadius: '50%',
        background: color, display: 'inline-block',
        marginRight: 4, flexShrink: 0,
      }}
    />
  )
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', fontSize: 12, fontWeight: 600, color }}>
      {dot}
      {status}
    </span>
  )
}

// ── Transaction Detail Drawer ────────────────────────────────────────────────
function TransactionDrawer({ tx, onClose }: { tx: Transaction | null; onClose: () => void }) {
  if (!tx) return null

  const statusColor =
    tx.status === 'Success' ? '#16A34A'
    : tx.status === 'Failed' ? '#DC2626'
    : '#D97706'
  const statusBg =
    tx.status === 'Success' ? 'rgba(22,163,74,0.07)'
    : tx.status === 'Failed' ? 'rgba(220,38,38,0.07)'
    : 'rgba(217,119,6,0.07)'

  return (
    <>
      <div
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.25)', zIndex: 30 }}
        onClick={onClose}
      />
      <div
        style={{
          position: 'fixed', right: 0, top: 0, bottom: 0, zIndex: 40,
          width: 320, display: 'flex', flexDirection: 'column',
          background: '#FFFFFF',
          borderLeft: '1px solid #E5E7EB',
          boxShadow: '-4px 0 32px rgba(15,23,42,0.10)',
          animation: 'slideInRight 0.2s ease-out',
        }}
      >
        <div
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '14px 20px', borderBottom: '1px solid #E5E7EB',
          }}
        >
          <div>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: '#111827' }}>Transaction Details</h3>
            <p style={{ fontSize: 11, fontFamily: 'monospace', color: '#9CA3AF', marginTop: 2, wordBreak: 'break-all' }}>
              {tx.transactionId}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{ padding: 6, borderRadius: 6, cursor: 'pointer', color: '#9CA3AF', background: 'transparent' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#F3F4F6' }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent' }}
          >
            <X size={15} />
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '10px 14px', borderRadius: 8,
              background: statusBg, border: `1px solid ${statusColor}22`,
            }}
          >
            <span style={{ fontSize: 12, color: '#6B7280' }}>Status</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: statusColor }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: statusColor }} />
              {tx.status}
            </span>
          </div>

          {[
            { label: 'Customer', value: tx.customer, mono: true },
            { label: 'Type',     value: tx.type },
            { label: 'Amount',   value: tx.amount },
            { label: 'Settled',  value: tx.settled },
            { label: 'Fee',      value: tx.fee ?? '—' },
            { label: 'Date',     value: tx.date },
          ].map(({ label, value, mono }) => (
            <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#9CA3AF' }}>
                {label}
              </span>
              <span style={{ fontSize: 13, color: '#111827', fontFamily: mono ? 'monospace' : undefined, wordBreak: 'break-all' }}>
                {value}
              </span>
            </div>
          ))}
        </div>

        <div style={{ borderTop: '1px solid #E5E7EB', padding: '10px 20px' }}>
          <button
            onClick={onClose}
            style={{
              width: '100%', padding: '8px', fontSize: 12, fontWeight: 600,
              borderRadius: 6, cursor: 'pointer', color: '#6B7280', background: 'transparent',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#F9FAFB' }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent' }}
          >
            Close
          </button>
        </div>
      </div>
    </>
  )
}

function SortIcon({ col, sortKey, sortDir }: { col: SortKey; sortKey: SortKey; sortDir: SortDir }) {
  if (col !== sortKey) return <ChevronDown size={10} style={{ marginLeft: 2, opacity: 0.3 }} />
  return sortDir === 'asc'
    ? <ChevronUp size={10} style={{ marginLeft: 2 }} />
    : <ChevronDown size={10} style={{ marginLeft: 2 }} />
}

// ── Props for use from both Dashboard and Wallet page ──────────────────────────
interface TransactionsTableProps {
  /** Optional override dataset — when omitted, uses all transactions from mockData */
  data?: Transaction[]
  /** Title to show instead of "Recent activity" */
  title?: string
  /** Subtitle/description */
  description?: string
  /** Whether to show the "View all" right-side header link */
  showViewAll?: boolean
  /** Whether to show pagination */
  showPagination?: boolean
  /** Per-page options */
  perPage?: number
}

export function TransactionsTable({
  data,
  title = 'Recent activity',
  description,
  showViewAll = true,
  showPagination = false,
  perPage: defaultPerPage = 10,
}: TransactionsTableProps) {
  const { environment } = useApp()
  const [activeTab, setActiveTab] = useState<TabValue>('all')
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('date')
  const [sortDir, setSortDir] = useState<SortDir>('desc')
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [perPage, setPerPage] = useState(defaultPerPage)

  const source = data ?? allTransactions

  const handleSort = (key: SortKey) => {
    if (key === sortKey) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else { setSortKey(key); setSortDir('asc') }
  }

  const query = search.toLowerCase().trim()

  const filtered = source
    .filter((t) => {
      const matchesTab =
        activeTab === 'all' ||
        (activeTab === 'successful' && t.status === 'Success') ||
        (activeTab === 'failed'     && t.status === 'Failed')  ||
        (activeTab === 'pending'    && t.status === 'Pending')
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

  // Tab counts from the source data
  const tabCounts = {
    all:        source.length,
    successful: source.filter((t) => t.status === 'Success').length,
    pending:    source.filter((t) => t.status === 'Pending').length,
    failed:     source.filter((t) => t.status === 'Failed').length,
  }

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage))
  const paginated = showPagination ? filtered.slice((currentPage - 1) * perPage, currentPage * perPage) : filtered

  const thStyle: React.CSSProperties = {
    fontSize: 11, fontWeight: 600, textTransform: 'uppercase',
    letterSpacing: '0.07em', color: '#9CA3AF',
    padding: '9px 12px', textAlign: 'left',
    cursor: 'pointer', userSelect: 'none',
    whiteSpace: 'nowrap',
  }

  const SortTh = ({ col, label, align = 'left' }: { col: SortKey; label: string; align?: 'left' | 'right' }) => (
    <th
      onClick={() => handleSort(col)}
      style={{ ...thStyle, textAlign: align }}
    >
      <span style={{ display: 'inline-flex', alignItems: 'center' }}>
        {align === 'right' && <SortIcon col={col} sortKey={sortKey} sortDir={sortDir} />}
        {label}
        {align === 'left'  && <SortIcon col={col} sortKey={sortKey} sortDir={sortDir} />}
      </span>
    </th>
  )

  return (
    <>
      <div
        style={{
          background: '#FFFFFF',
          border: '1px solid #E5E7EB',
          borderRadius: 8,
          overflow: 'hidden',
        }}
      >
        {/* ── Header ──────────────────────────────────────────────────────── */}
        <div
          style={{
            display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
            padding: '14px 16px 10px',
          }}
        >
          <div>
            <h2 style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{title}</h2>
            {description ? (
              <p style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>{description}</p>
            ) : (
              <p style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>
                Last {source.length} transactions · synced just now.{' '}
                {showViewAll && (
                  <button style={{ color: '#4F46E5', textDecoration: 'underline', cursor: 'pointer', background: 'none', border: 'none', fontSize: 11 }}>
                    View all
                  </button>
                )}{' '}
                {showViewAll ? 'for full history.' : ''}
              </p>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
            {/* Search */}
            <div style={{ position: 'relative' }}>
              <Search
                size={12}
                style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF', pointerEvents: 'none' }}
              />
              <input
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1) }}
                placeholder="Search…"
                style={{
                  height: 28, paddingLeft: 28, paddingRight: search ? 26 : 10,
                  fontSize: 12, borderRadius: 6,
                  border: '1px solid #E5E7EB', background: '#F9FAFB',
                  color: '#111827', outline: 'none', width: 160,
                }}
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF', cursor: 'pointer', background: 'none', border: 'none', padding: 0 }}
                >
                  <X size={11} />
                </button>
              )}
            </div>
            {showViewAll && (
              <button
                style={{
                  display: 'flex', alignItems: 'center', gap: 2,
                  fontSize: 12, color: '#6B7280', cursor: 'pointer', background: 'none', border: 'none',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = '#4F46E5' }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = '#6B7280' }}
              >
                View all <ChevronRight size={12} />
              </button>
            )}
          </div>
        </div>

        {/* ── Tabs ────────────────────────────────────────────────────────── */}
        <div style={{ display: 'flex', borderBottom: '1px solid #E5E7EB', padding: '0 16px' }}>
          {tabs.map((tab) => {
            const isActive = activeTab === tab.value
            const count = tabCounts[tab.value]
            return (
              <button
                key={tab.value}
                onClick={() => { setActiveTab(tab.value); setCurrentPage(1) }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 5,
                  padding: '7px 10px', fontSize: 12, fontWeight: isActive ? 600 : 400,
                  color: isActive ? '#111827' : '#9CA3AF',
                  borderBottom: isActive ? '2px solid #111827' : '2px solid transparent',
                  marginBottom: -1,
                  background: 'transparent', cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                {tab.label}
                <span
                  style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    width: 18, height: 18, borderRadius: '50%',
                    fontSize: 10, fontWeight: 700,
                    background: isActive ? '#111827' : '#F3F4F6',
                    color: isActive ? '#FFFFFF' : '#9CA3AF',
                  }}
                >
                  {count}
                </span>
              </button>
            )
          })}
        </div>

        {/* ── Table ───────────────────────────────────────────────────────── */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', fontSize: 12, borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#FAFAFA', borderBottom: '1px solid #E5E7EB' }}>
                <SortTh col="transactionId" label="TRANSACTION ID" />
                <SortTh col="customer" label="CUSTOMER" />
                <SortTh col="type" label="TYPE" />
                <SortTh col="amount" label="AMOUNT" align="right" />
                <th style={{ ...thStyle, textAlign: 'right' }}>SETTLED</th>
                <th style={{ ...thStyle, textAlign: 'right' }}>FEE</th>
                <SortTh col="status" label="STATUS" />
                <SortTh col="date" label="DATE" align="right" />
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ padding: '28px 16px', textAlign: 'center', fontSize: 12, color: '#9CA3AF' }}>
                    No transactions match your search.
                  </td>
                </tr>
              ) : (
                paginated.map((tx) => (
                  <tr
                    key={tx.id}
                    onClick={() => setSelectedTx(tx)}
                    style={{ borderBottom: '1px solid #F3F4F6', cursor: 'pointer', transition: 'background 0.1s' }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLTableRowElement).style.background = '#FAFAFA' }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLTableRowElement).style.background = '' }}
                  >
                    <td style={{ padding: '10px 12px', fontFamily: 'monospace', fontSize: 12, color: '#374151', minWidth: 130 }}>
                      {tx.transactionId}
                    </td>
                    <td style={{ padding: '10px 12px', fontFamily: 'monospace', fontSize: 11, color: '#6B7280', minWidth: 140, maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {tx.customer}
                    </td>
                    <td style={{ padding: '10px 12px', minWidth: 140 }}>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '2px 8px',
                          fontSize: 11, borderRadius: 4,
                          background: '#F3F4F6',
                          color: '#374151',
                          border: '1px solid #E5E7EB',
                        }}
                      >
                        {tx.type}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: '10px 12px', textAlign: 'right', fontSize: 12,
                        color: tx.isStrikethrough ? '#CBD5E1' : '#111827',
                        textDecoration: tx.isStrikethrough ? 'line-through' : undefined,
                        minWidth: 90, fontVariantNumeric: 'tabular-nums',
                      }}
                    >
                      {tx.amount}
                    </td>
                    <td
                      style={{
                        padding: '10px 12px', textAlign: 'right', fontSize: 12,
                        color: tx.isStrikethrough ? '#CBD5E1' : '#6B7280',
                        textDecoration: tx.isStrikethrough ? 'line-through' : undefined,
                        minWidth: 90, fontVariantNumeric: 'tabular-nums',
                      }}
                    >
                      {tx.settled}
                    </td>
                    <td style={{ padding: '10px 12px', textAlign: 'right', fontSize: 12, color: '#9CA3AF', minWidth: 70, fontVariantNumeric: 'tabular-nums' }}>
                      {tx.fee ?? <span style={{ color: '#D1D5DB' }}>—</span>}
                    </td>
                    <td style={{ padding: '10px 12px', minWidth: 90 }}>
                      <StatusBadge status={tx.status} />
                    </td>
                    <td style={{ padding: '10px 12px', textAlign: 'right', fontSize: 11, color: '#9CA3AF', minWidth: 110, whiteSpace: 'nowrap' }}>
                      {tx.date}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ── Footer: Pagination + Test mode ──────────────────────────────── */}
        <div
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '8px 14px',
            borderTop: '1px solid #F3F4F6',
            background: '#FAFAFA',
            flexWrap: 'wrap',
            gap: 8,
          }}
        >
          {/* Left: count + test mode badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 11, color: '#9CA3AF' }}>
              {filtered.length === 0
                ? 'No results'
                : showPagination
                  ? `Showing ${(currentPage - 1) * perPage + 1}–${Math.min(currentPage * perPage, filtered.length)} of ${filtered.length}`
                  : `Showing ${filtered.length}`}
            </span>
            {environment === 'test' && (
              <span
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                  fontSize: 10, fontWeight: 600,
                  padding: '2px 7px', borderRadius: 99,
                  background: 'rgba(217,119,6,0.08)', border: '1px solid rgba(217,119,6,0.22)',
                  color: '#92400E',
                }}
              >
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#D97706', display: 'inline-block' }} />
                Test mode
              </span>
            )}
          </div>

          {/* Right: pagination controls */}
          {showPagination && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {/* Per-page selector */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <select
                  value={perPage}
                  onChange={(e) => { setPerPage(Number(e.target.value)); setCurrentPage(1) }}
                  style={{
                    fontSize: 11, color: '#374151', border: '1px solid #E5E7EB',
                    borderRadius: 4, padding: '2px 4px', background: '#FFFFFF', cursor: 'pointer',
                  }}
                >
                  {[5, 10, 20, 50].map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
                <span style={{ fontSize: 11, color: '#9CA3AF' }}>per page</span>
              </div>
              <span style={{ fontSize: 11, color: '#9CA3AF' }}>
                Page {currentPage} of {totalPages}
              </span>
              <div style={{ display: 'flex', gap: 4 }}>
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  style={{
                    fontSize: 11, padding: '2px 8px', borderRadius: 4,
                    border: '1px solid #E5E7EB', background: currentPage === 1 ? '#F9FAFB' : '#FFFFFF',
                    color: currentPage === 1 ? '#D1D5DB' : '#374151',
                    cursor: currentPage === 1 ? 'default' : 'pointer',
                  }}
                >
                  Prev
                </button>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  style={{
                    fontSize: 11, padding: '2px 8px', borderRadius: 4,
                    border: '1px solid #E5E7EB', background: currentPage === totalPages ? '#F9FAFB' : '#FFFFFF',
                    color: currentPage === totalPages ? '#D1D5DB' : '#374151',
                    cursor: currentPage === totalPages ? 'default' : 'pointer',
                  }}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <TransactionDrawer tx={selectedTx} onClose={() => setSelectedTx(null)} />
    </>
  )
}
