// AssetsPanel — full overlay panel with tabs, search, filter, and pagination
import { useState, useMemo, useEffect } from 'react'
import { X, Search, ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react'
import { fiatCurrencies, cryptoCoins, allAssets, type AssetItem, type AssetStatus } from '@/data/assetsData'
import { AssetRow } from './AssetRow'

type Tab = 'all' | 'currency' | 'crypto'
const TABS: { id: Tab; label: string }[] = [
  { id: 'all',      label: 'All Assets' },
  { id: 'currency', label: 'Currencies' },
  { id: 'crypto',   label: 'Coins' },
]

const STATUS_OPTIONS: Array<{ value: 'all' | AssetStatus; label: string }> = [
  { value: 'all',         label: 'All statuses' },
  { value: 'Active',      label: 'Active' },
  { value: 'Maintenance', label: 'Maintenance' },
  { value: 'Inactive',    label: 'Inactive' },
]

const PAGE_SIZE = 15

interface AssetsPanelProps {
  open: boolean
  defaultTab?: Tab
  hidden: boolean
  onClose: () => void
}

export function AssetsPanel({ open, defaultTab = 'all', hidden, onClose }: AssetsPanelProps) {
  const [activeTab, setActiveTab] = useState<Tab>(defaultTab)
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | AssetStatus>('all')
  const [page, setPage] = useState(1)

  // Reset to the correct tab (and clear filters) whenever the panel is opened
  useEffect(() => {
    if (open) {
      setActiveTab(defaultTab)
      setQuery('')
      setStatusFilter('all')
      setPage(1)
    }
  }, [open, defaultTab])

  // Reset page when filters change
  const resetPage = () => setPage(1)

  const baseList: AssetItem[] = useMemo(() => {
    if (activeTab === 'currency') return fiatCurrencies
    if (activeTab === 'crypto')   return cryptoCoins
    return allAssets
  }, [activeTab])

  const filtered = useMemo(() => {
    let list = baseList
    if (statusFilter !== 'all') {
      list = list.filter(a => a.status === statusFilter)
    }
    if (query.trim()) {
      const q = query.trim().toLowerCase()
      list = list.filter(a =>
        a.name.toLowerCase().includes(q) ||
        a.code.toLowerCase().includes(q) ||
        a.region.toLowerCase().includes(q)
      )
    }
    return list
  }, [baseList, statusFilter, query])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const paginated = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  if (!open) return null

  const handleTabChange = (t: Tab) => {
    setActiveTab(t)
    resetPage()
  }

  const handleQueryChange = (v: string) => {
    setQuery(v)
    resetPage()
  }

  const handleStatusChange = (v: 'all' | AssetStatus) => {
    setStatusFilter(v)
    resetPage()
  }

  // Summary counts for tab badges
  const counts = {
    all:      allAssets.length,
    currency: fiatCurrencies.length,
    crypto:   cryptoCoins.length,
  }

  return (
    // Backdrop
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 40,
        background: 'rgba(0,0,0,0.35)',
        display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-end',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      {/* Panel */}
      <div
        style={{
          width: '100%', maxWidth: 600,
          height: '100vh', overflowY: 'auto',
          background: '#FFFFFF',
          display: 'flex', flexDirection: 'column',
          boxShadow: '-4px 0 32px rgba(0,0,0,0.12)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Panel Header ─────────────────────────────────────── */}
        <div
          style={{
            padding: '20px 24px 0',
            borderBottom: '1px solid #E5E7EB',
            position: 'sticky', top: 0, background: '#FFFFFF', zIndex: 10,
          }}
        >
          {/* Title row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div>
              <h2 style={{ fontSize: 17, fontWeight: 700, color: '#111827', margin: 0 }}>
                All Assets
              </h2>
              <p style={{ fontSize: 12, color: '#9CA3AF', marginTop: 2 }}>
                {counts.currency} currencies · {counts.crypto} coins
              </p>
            </div>
            <button
              onClick={onClose}
              style={{
                width: 32, height: 32, borderRadius: '50%',
                background: '#F3F4F6', border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background 0.15s',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#E5E7EB' }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#F3F4F6' }}
            >
              <X size={15} color="#374151" />
            </button>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: 4 }}>
            {TABS.map(tab => {
              const active = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    padding: '8px 14px',
                    fontSize: 13, fontWeight: active ? 600 : 500,
                    color: active ? '#111827' : '#6B7280',
                    background: 'transparent', border: 'none', cursor: 'pointer',
                    borderBottom: active ? '2px solid #111827' : '2px solid transparent',
                    marginBottom: -1, transition: 'all 0.15s',
                  }}
                >
                  {tab.label}
                  <span
                    style={{
                      fontSize: 10, fontWeight: 700, padding: '1px 5px',
                      borderRadius: 99,
                      background: active ? '#111827' : '#F3F4F6',
                      color: active ? '#FFFFFF' : '#6B7280',
                    }}
                  >
                    {counts[tab.id]}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* ── Filters ──────────────────────────────────────────── */}
        <div
          style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '14px 24px',
            borderBottom: '1px solid #F3F4F6',
            position: 'sticky', top: 101, background: '#FFFFFF', zIndex: 9,
          }}
        >
          {/* Search */}
          <div style={{ flex: 1, position: 'relative' }}>
            <Search
              size={14} color="#9CA3AF"
              style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
            />
            <input
              type="text"
              placeholder="Search by name, code, or region…"
              value={query}
              onChange={(e) => handleQueryChange(e.target.value)}
              style={{
                width: '100%', boxSizing: 'border-box',
                padding: '8px 10px 8px 30px',
                fontSize: 13, color: '#111827',
                border: '1px solid #E5E7EB', borderRadius: 7,
                background: '#FAFAFA', outline: 'none',
                transition: 'border-color 0.15s',
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = '#6366F1'; e.currentTarget.style.background = '#FFF' }}
              onBlur={(e) => { e.currentTarget.style.borderColor = '#E5E7EB'; e.currentTarget.style.background = '#FAFAFA' }}
            />
          </div>

          {/* Status filter */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <SlidersHorizontal
              size={13} color="#9CA3AF"
              style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
            />
            <select
              value={statusFilter}
              onChange={(e) => handleStatusChange(e.target.value as 'all' | AssetStatus)}
              style={{
                appearance: 'none', padding: '8px 28px 8px 26px',
                fontSize: 12, fontWeight: 500, color: '#374151',
                border: '1px solid #E5E7EB', borderRadius: 7,
                background: '#FAFAFA', cursor: 'pointer', outline: 'none',
              }}
            >
              {STATUS_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* ── Asset List ───────────────────────────────────────── */}
        <div style={{ flex: 1, padding: '4px 24px 0' }}>
          {paginated.length === 0 ? (
            <div
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                justifyContent: 'center', gap: 8, padding: '60px 0',
                color: '#9CA3AF', textAlign: 'center',
              }}
            >
              <Search size={32} color="#D1D5DB" />
              <p style={{ fontSize: 14, fontWeight: 600, color: '#374151', margin: 0 }}>
                No assets found
              </p>
              <p style={{ fontSize: 12, margin: 0 }}>
                Try adjusting your search or filter.
              </p>
            </div>
          ) : (
            paginated.map(asset => (
              <AssetRow key={asset.id} asset={asset} hidden={hidden} />
            ))
          )}
        </div>

        {/* ── Pagination ──────────────────────────────────────── */}
        {totalPages > 1 && (
          <div
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '14px 24px',
              borderTop: '1px solid #F3F4F6',
              background: '#FAFAFA',
              position: 'sticky', bottom: 0,
            }}
          >
            <span style={{ fontSize: 12, color: '#6B7280' }}>
              Showing {(safePage - 1) * PAGE_SIZE + 1}–{Math.min(safePage * PAGE_SIZE, filtered.length)} of {filtered.length}
            </span>

            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <button
                disabled={safePage <= 1}
                onClick={() => setPage(p => p - 1)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: 30, height: 30, borderRadius: 6,
                  border: '1px solid #E5E7EB', background: safePage <= 1 ? '#F9FAFB' : '#FFFFFF',
                  cursor: safePage <= 1 ? 'not-allowed' : 'pointer',
                  color: safePage <= 1 ? '#D1D5DB' : '#374151',
                }}
              >
                <ChevronLeft size={14} />
              </button>

              {/* Page numbers */}
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(n => Math.abs(n - safePage) <= 2 || n === 1 || n === totalPages)
                .reduce<(number | '…')[]>((acc, n, i, arr) => {
                  if (i > 0 && n - (arr[i - 1] as number) > 1) acc.push('…')
                  acc.push(n)
                  return acc
                }, [])
                .map((n, i) =>
                  n === '…' ? (
                    <span key={`ellipsis-${i}`} style={{ fontSize: 12, color: '#9CA3AF', padding: '0 4px' }}>…</span>
                  ) : (
                    <button
                      key={n}
                      onClick={() => setPage(n as number)}
                      style={{
                        width: 30, height: 30, borderRadius: 6,
                        border: n === safePage ? '1px solid #111827' : '1px solid #E5E7EB',
                        background: n === safePage ? '#111827' : '#FFFFFF',
                        color: n === safePage ? '#FFFFFF' : '#374151',
                        fontSize: 12, fontWeight: n === safePage ? 700 : 400,
                        cursor: 'pointer',
                      }}
                    >
                      {n}
                    </button>
                  )
                )
              }

              <button
                disabled={safePage >= totalPages}
                onClick={() => setPage(p => p + 1)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: 30, height: 30, borderRadius: 6,
                  border: '1px solid #E5E7EB', background: safePage >= totalPages ? '#F9FAFB' : '#FFFFFF',
                  cursor: safePage >= totalPages ? 'not-allowed' : 'pointer',
                  color: safePage >= totalPages ? '#D1D5DB' : '#374151',
                }}
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
