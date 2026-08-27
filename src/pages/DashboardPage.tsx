import { useState } from 'react'
import { RefreshCw, EyeOff, Eye, Plus } from 'lucide-react'
import { TransactionsTable } from '@/components/dashboard/TransactionsTable'
import { WalletDistribution } from '@/components/dashboard/WalletDistribution'
import { RequestPayoutModal } from '@/components/dashboard/RequestPayoutModal'
import { AssetCarousel } from '@/components/assets/AssetCarousel'
import { AssetsPanel } from '@/components/assets/AssetsPanel'
import { useApp } from '@/context/AppContext'
import { cn } from '@/lib/utils'

export function DashboardPage() {
  const { hideBalances, toggleHideBalances, isRefreshing, refreshBalances, environment } = useApp()
  const [payoutOpen, setPayoutOpen] = useState(false)
  const [assetsOpen, setAssetsOpen] = useState(false)
  const [assetsTab, setAssetsTab] = useState<'all' | 'currency' | 'crypto'>('all')

  const openAssets = (tab: 'all' | 'currency' | 'crypto') => {
    setAssetsTab(tab)
    setAssetsOpen(true)
  }

  const btnBase: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center', gap: 5,
    padding: '6px 12px', fontSize: 12, fontWeight: 500,
    borderRadius: 6, cursor: 'pointer', transition: 'all 0.15s',
    border: '1px solid #E5E7EB', background: '#FFFFFF', color: '#374151',
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* ── Page Header ─────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: '#111827' }}>Dashboard</h1>
            {/* Verified merchant badge */}
            <span
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                padding: '3px 10px', borderRadius: 99,
                fontSize: 11, fontWeight: 600,
                background: '#D1FAE5', color: '#065F46',
                border: '1px solid #A7F3D0',
              }}
            >
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981', display: 'inline-block' }} />
              Verified merchant
            </span>
          </div>
          <p style={{ fontSize: 12, color: '#9CA3AF', marginTop: 3 }}>
            Monitor transactions, customers, and payouts at a glance.
          </p>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0, flexWrap: 'wrap' }}>
          <button
            style={btnBase}
            onClick={refreshBalances}
            disabled={isRefreshing}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#F9FAFB' }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#FFFFFF' }}
          >
            <RefreshCw size={12} className={cn(isRefreshing && 'animate-spin')} />
            {isRefreshing ? 'Refreshing…' : 'Refresh balances'}
          </button>
          <button
            style={btnBase}
            onClick={toggleHideBalances}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#F9FAFB' }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#FFFFFF' }}
          >
            {hideBalances ? <Eye size={12} /> : <EyeOff size={12} />}
            {hideBalances ? 'Show balances' : 'Hide balances'}
          </button>
          <button
            style={{
              ...btnBase,
              background: '#111827', color: '#FFFFFF', border: '1px solid #111827',
              fontWeight: 600,
            }}
            onClick={() => setPayoutOpen(true)}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#1F2937' }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#111827' }}
          >
            <Plus size={12} />
            Add wallet
          </button>
        </div>
      </div>

      {/* ── Supported Assets — Currencies Carousel ────────────────────── */}
      <AssetCarousel
        type="currency"
        hidden={hideBalances}
        onViewAll={() => openAssets('currency')}
      />

      {/* ── Supported Assets — Coins Carousel ─────────────────────────── */}
      <AssetCarousel
        type="crypto"
        hidden={hideBalances}
        onViewAll={() => openAssets('crypto')}
      />

      {/* ── Bottom: Recent Activity + Wallet Distribution ─────────────── */}
      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <TransactionsTable showViewAll={true} showPagination={false} />
        </div>
        <div style={{ width: 220, flexShrink: 0 }}>
          <WalletDistribution />
        </div>
      </div>

      {/* ── Test Mode Banner ──────────────────────────────────────────── */}
      {environment === 'test' && (
        <div
          style={{
            position: 'fixed', bottom: 0, left: 0, right: 0,
            padding: '8px 16px', textAlign: 'center',
            background: '#FFF7ED', borderTop: '1px solid #FED7AA',
            zIndex: 15,
          }}
        >
          <span style={{ fontSize: 12, fontWeight: 600, color: '#92400E' }}>
            You are currently in Test Mode.
          </span>
        </div>
      )}

      <RequestPayoutModal open={payoutOpen} onClose={() => setPayoutOpen(false)} />

      {/* ── Assets Full Panel ─────────────────────────────────────────── */}
      <AssetsPanel
        open={assetsOpen}
        defaultTab={assetsTab}
        hidden={hideBalances}
        onClose={() => setAssetsOpen(false)}
      />
    </div>
  )
}
