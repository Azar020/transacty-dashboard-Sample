import { RefreshCw, EyeOff, Eye } from 'lucide-react'
import { TransactionsTable } from '@/components/dashboard/TransactionsTable'
import { useApp } from '@/context/AppContext'
import { wallets, bdtTransactions, type Wallet as WalletType } from '@/data/mockData'
import { allAssets } from '@/data/assetsData'

import bdtIcon  from '@/assets/bangladesh.png'
import brlIcon  from '@/assets/brazil-flag.png'
import usdtIcon from '@/assets/usdt.png'
import usdcIcon from '@/assets/USDC.png'

const ICON_MAP: Record<string, string> = {
  BDT: bdtIcon, BRL: brlIcon, USDT: usdtIcon, USDC: usdcIcon,
}

// ── Per-wallet enriched data ──────────────────────────────────────────────────
interface WalletMeta {
  balance: string
  available: string
  availableLabel: string   // e.g. "Ready to pay out or refund."
  pending: string
  pendingLabel: string     // e.g. "Nothing waiting to clear."
  payIn: { label: string; note: string }
  payOut: { label: string; count: string; progress: number }  // progress 0-1
  successCount: number
  pendingCount: number
  failedCount: number
  statusNote: string       // e.g. "Temporarily down"
  chartData: number[]
  chartStartLabel: string  // e.g. "Aug 1"
  chartStartBalance: string // e.g. "৳ 1,866.00"
}

const WALLET_META: Record<string, WalletMeta> = {
  BDT: {
    balance: '1,866.00',
    available: '166.00',
    availableLabel: 'Ready to pay out or refund.',
    pending: '0.00',
    pendingLabel: 'Nothing waiting to clear.',
    payIn: { label: 'No activity yet', note: '' },
    payOut: { label: '3 of 3 succeeded', count: '3 of 3 succeeded', progress: 1.0 },
    successCount: 3, pendingCount: 0, failedCount: 0,
    statusNote: '',
    chartData: [1866, 1866, 1666, 1466, 1366, 1166, 966, 766, 566, 366, 166],
    chartStartLabel: 'Aug 1',
    chartStartBalance: '৳ 1,866.00',
  },
  USDT: {
    balance: '0.00',
    available: '0.00',
    availableLabel: 'Ready to pay out or refund.',
    pending: '0.00',
    pendingLabel: 'Nothing waiting to clear.',
    payIn: { label: 'No activity yet', note: '' },
    payOut: { label: 'No activity yet', count: '', progress: 0 },
    successCount: 0, pendingCount: 0, failedCount: 0,
    statusNote: '',
    chartData: [0, 0, 0, 0, 0, 0, 0, 0, 0],
    chartStartLabel: 'Aug 1',
    chartStartBalance: '₮ 0.00',
  },
  USDC: {
    balance: '0.00',
    available: '0.00',
    availableLabel: 'Ready to pay out or refund.',
    pending: '0.00',
    pendingLabel: 'Nothing waiting to clear.',
    payIn: { label: 'No activity yet', note: '' },
    payOut: { label: 'No activity yet', count: '', progress: 0 },
    successCount: 0, pendingCount: 0, failedCount: 0,
    statusNote: '',
    chartData: [0, 0, 0, 0, 0, 0, 0, 0, 0],
    chartStartLabel: 'Aug 1',
    chartStartBalance: '$ 0.00',
  },
  BRL: {
    balance: '0.00',
    available: '0.00',
    availableLabel: 'Ready to pay out or refund.',
    pending: '0.00',
    pendingLabel: 'Nothing waiting to clear.',
    payIn: { label: 'No activity yet', note: '' },
    payOut: { label: 'No activity yet', count: '', progress: 0 },
    successCount: 0, pendingCount: 0, failedCount: 0,
    statusNote: '',
    chartData: [0, 0, 0, 0, 0, 0, 0, 0, 0],
    chartStartLabel: 'Aug 1',
    chartStartBalance: 'R$ 0.00',
  },
}

// ── Sparkline chart ────────────────────────────────────────────────────────────
function buildPath(data: number[], w: number, h: number, padX = 20, padY = 16) {
  const minV = Math.min(...data)
  const maxV = Math.max(...data)
  const range = maxV - minV || 1
  const innerW = w - padX * 2
  const innerH = h - padY * 2
  const pts = data.map((v, i) => {
    const x = padX + (i / (data.length - 1)) * innerW
    const y = padY + innerH - ((v - minV) / range) * innerH
    return [x, y] as [number, number]
  })
  let line = `M ${pts[0][0]} ${pts[0][1]}`
  for (let i = 1; i < pts.length; i++) {
    const [px, py] = pts[i - 1]
    const [cx, cy] = pts[i]
    const mx = (px + cx) / 2
    line += ` C ${mx} ${py}, ${mx} ${cy}, ${cx} ${cy}`
  }
  let area = `M ${pts[0][0]} ${h} L ${pts[0][0]} ${pts[0][1]}`
  for (let i = 1; i < pts.length; i++) {
    const [px, py] = pts[i - 1]
    const [cx, cy] = pts[i]
    const mx = (px + cx) / 2
    area += ` C ${mx} ${py}, ${mx} ${cy}, ${cx} ${cy}`
  }
  area += ` L ${pts[pts.length - 1][0]} ${h} Z`
  return { line, area, pts }
}

function BalanceChart({
  data, startLabel, startBalance,
}: {
  data: number[]
  startLabel: string
  startBalance: string
}) {
  const W = 600; const H = 140
  const padX = 20; const padY = 16
  const { line, area, pts } = buildPath(data, W, H, padX, padY)
  const firstPt = pts[0]
  const lastPt = pts[pts.length - 1]

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      {/* Balance label above chart */}
      <div style={{ position: 'relative', height: H + 20 }}>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          style={{ width: '100%', height: H }}
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(16,185,129,0.18)" />
              <stop offset="100%" stopColor="rgba(16,185,129,0.00)" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0.25, 0.5, 0.75].map((t) => (
            <line
              key={t}
              x1={padX} y1={padY + (H - padY * 2) * t}
              x2={W - padX} y2={padY + (H - padY * 2) * t}
              stroke="rgba(0,0,0,0.05)" strokeWidth={1}
            />
          ))}

          {/* Area fill */}
          <path d={area} fill="url(#chartGrad)" />

          {/* Line */}
          <path d={line} fill="none" stroke="#10B981" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />

          {/* Start point dot + vertical line */}
          <line
            x1={firstPt[0]} y1={firstPt[1]}
            x2={firstPt[0]} y2={H - padY}
            stroke="#D1D5DB" strokeWidth={1} strokeDasharray="3,3"
          />
          <circle cx={firstPt[0]} cy={firstPt[1]} r={4} fill="#10B981" />

          {/* End point dot */}
          <circle cx={lastPt[0]} cy={lastPt[1]} r={4} fill="#10B981" />
          <circle cx={lastPt[0]} cy={lastPt[1]} r={8} fill="rgba(16,185,129,0.15)" />
        </svg>

        {/* Tooltip label at start point */}
        <div
          style={{
            position: 'absolute',
            left: `${(firstPt[0] / W) * 100}%`,
            top: firstPt[1] * (H / H) - 42,
            transform: 'translateX(-50%)',
            background: '#FFFFFF',
            border: '1px solid #E5E7EB',
            borderRadius: 6,
            padding: '3px 8px',
            fontSize: 11, fontWeight: 600, color: '#111827',
            whiteSpace: 'nowrap',
            boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
            pointerEvents: 'none',
          }}
        >
          {startBalance}
        </div>

        {/* X label: start date */}
        <div
          style={{
            position: 'absolute',
            left: `${(firstPt[0] / W) * 100}%`,
            bottom: 0,
            transform: 'translateX(-50%)',
            fontSize: 10, color: '#9CA3AF',
            whiteSpace: 'nowrap',
          }}
        >
          {startLabel}
        </div>
      </div>
    </div>
  )
}

// ── Wallet selector tab card ───────────────────────────────────────────────────
function WalletTab({ wallet, selected, hidden, onClick }: {
  wallet: WalletType; selected: boolean; hidden: boolean; onClick: () => void
}) {
  const iconImg = ICON_MAP[wallet.currencyCode]
  const asset = allAssets.find(a => a.code === wallet.currencyCode)

  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '10px 14px', borderRadius: 8, cursor: 'pointer',
        textAlign: 'left',
        background: selected ? '#F3F4F6' : '#FFFFFF',
        border: selected ? '1px solid #D1D5DB' : '1px solid #E5E7EB',
        boxShadow: selected ? '0 1px 4px rgba(0,0,0,0.06)' : 'none',
        transition: 'all 0.15s',
        minWidth: 120,
      }}
      onMouseEnter={(e) => {
        if (!selected) (e.currentTarget as HTMLButtonElement).style.background = '#F9FAFB'
      }}
      onMouseLeave={(e) => {
        if (!selected) (e.currentTarget as HTMLButtonElement).style.background = '#FFFFFF'
      }}
    >
      <div
        style={{
          width: 32, height: 32, borderRadius: '50%',
          overflow: 'hidden', border: '1px solid #E5E7EB',
          background: '#F9FAFB', flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        {iconImg ? (
          <img src={iconImg} alt={wallet.currencyCode} style={{ width: '100%', height: '100%', objectFit: 'cover' }} draggable={false} />
        ) : asset?.flag ? (
          <span style={{ fontSize: 16, lineHeight: 1 }}>{asset.flag}</span>
        ) : (
          <span style={{ fontSize: 10, fontWeight: 700, color: '#4F46E5' }}>{wallet.currencyCode.slice(0, 3)}</span>
        )}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: '#111827' }}>{wallet.currencyCode}</span>
        <span
          style={{
            fontSize: 11, fontVariantNumeric: 'tabular-nums',
            color: selected ? '#4F46E5' : '#6B7280',
            fontWeight: selected ? 600 : 400,
          }}
        >
          {hidden ? '••••' : `${wallet.symbol} ${wallet.amount}`}
        </span>
      </div>
    </button>
  )
}

// ── Info panel ────────────────────────────────────────────────────────────────
function WalletInfoPanel({ wallet, meta }: { wallet: WalletType; meta: WalletMeta }) {
  const isUnavailable = wallet.status === 'Unavailable'

  return (
    <div
      style={{
        background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 8,
        padding: '18px 18px', display: 'flex', flexDirection: 'column', gap: 12,
        width: 240, flexShrink: 0,
      }}
    >
      {/* Wallet name + status */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <p style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>{wallet.region.split(' ')[0]}</p>
          <p style={{ fontSize: 11, color: '#9CA3AF', marginTop: 1 }}>Settled – last 30 days</p>
        </div>
        {isUnavailable && (
          <span
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              padding: '2px 8px', borderRadius: 99,
              fontSize: 10, fontWeight: 600,
              background: '#F9FAFB', border: '1px solid #E5E7EB', color: '#9CA3AF',
            }}
          >
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#9CA3AF', display: 'inline-block' }} />
            Unavailable
          </span>
        )}
      </div>

      <div style={{ height: 1, background: '#F3F4F6' }} />

      {/* Pay-in row */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{ fontSize: 12, color: '#374151', display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ fontSize: 13 }}>↓</span> Pay-in
          </span>
          <span style={{ fontSize: 11, color: '#9CA3AF' }}>{meta.payIn.label}</span>
        </div>
      </div>

      {/* Pay-out row */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: 12, color: '#374151', display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ fontSize: 13 }}>↑</span> Pay-out
          </span>
          <span style={{ fontSize: 11, color: '#374151', fontWeight: 500 }}>{meta.payOut.count}</span>
        </div>
        {/* Progress bar */}
        <div style={{ height: 4, borderRadius: 99, background: '#F3F4F6', overflow: 'hidden' }}>
          <div
            style={{
              height: '100%', borderRadius: 99,
              background: '#10B981',
              width: `${meta.payOut.progress * 100}%`,
              transition: 'width 0.4s ease',
            }}
          />
        </div>
        {/* Legend */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 5 }}>
          {[
            { color: '#10B981', label: 'Succeeded' },
            { color: '#F59E0B', label: 'Pending' },
            { color: '#EF4444', label: 'Failed' },
          ].map(({ color, label }) => (
            <span key={label} style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 10, color: '#9CA3AF' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: color, display: 'inline-block' }} />
              {label}
            </span>
          ))}
        </div>
      </div>

      {/* Status note */}
      {meta.statusNote && (
        <p style={{ fontSize: 11, color: '#9CA3AF', fontStyle: 'italic' }}>{meta.statusNote}</p>
      )}
    </div>
  )
}

// ── Main Wallet Page ───────────────────────────────────────────────────────────
export function WalletPage() {
  const {
    hideBalances, toggleHideBalances, isRefreshing, refreshBalances, environment,
    selectedWalletCode, setSelectedWalletCode,
  } = useApp()

  // Base wallets: BDT, USDT, USDC, BRL
  const baseWallets = ['BDT', 'USDT', 'USDC', 'BRL']
    .map(code => wallets.find(w => w.currencyCode === code)!)
    .filter(Boolean)

  // Dynamically include the selected asset tab if it's from allAssets
  const orderedWallets = [...baseWallets]
  if (selectedWalletCode && !orderedWallets.some(w => w.currencyCode === selectedWalletCode)) {
    const asset = allAssets.find(a => a.code === selectedWalletCode)
    if (asset) {
      orderedWallets.push({
        id: asset.id,
        currency: asset.name,
        currencyCode: asset.code,
        region: asset.region || asset.name,
        amount: asset.balance.replace(/[^0-9.,]/g, '').trim() || '0.00',
        symbol: asset.symbol,
        status: asset.status === 'Active' ? 'Active' : 'Unavailable',
        pocketType: 'Merchant pocket',
        colorClass: 'bg-indigo-500',
        type: asset.type === 'fiat' ? 'currency' : 'coin',
      })
    }
  }

  const selectedWallet = orderedWallets.find((w) => w.currencyCode === selectedWalletCode) ?? orderedWallets[0]

  const meta: WalletMeta = WALLET_META[selectedWallet.currencyCode] ?? {
    balance: selectedWallet.amount,
    available: selectedWallet.amount,
    availableLabel: 'Ready to pay out or refund.',
    pending: '0.00',
    pendingLabel: 'Nothing waiting to clear.',
    payIn: { label: 'No activity yet', note: '' },
    payOut: { label: 'No activity yet', count: '', progress: 0 },
    successCount: 0, pendingCount: 0, failedCount: 0,
    statusNote: '',
    chartData: [parseFloat(selectedWallet.amount.replace(/,/g, '')) || 100, 120, 110, 140, 180, 160, 200, 190, 240, 260],
    chartStartLabel: 'Aug 1',
    chartStartBalance: `${selectedWallet.symbol} ${selectedWallet.amount}`,
  }

  // Use BDT transactions for BDT wallet, empty for others
  const walletTxData = selectedWallet.currencyCode === 'BDT' ? bdtTransactions : []

  const btnBase: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center', gap: 5,
    padding: '6px 12px', fontSize: 12, fontWeight: 500,
    borderRadius: 6, cursor: 'pointer', transition: 'all 0.15s',
    border: '1px solid #E5E7EB', background: '#FFFFFF', color: '#374151',
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18, paddingBottom: 40 }}>
      {/* ── Page Header ──────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#111827' }}>Wallets</h1>
          <p style={{ fontSize: 12, color: '#9CA3AF', marginTop: 3 }}>
            Manage your fiat and crypto wallets and view balances.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <button
            style={btnBase}
            onClick={refreshBalances}
            disabled={isRefreshing}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#F9FAFB' }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#FFFFFF' }}
          >
            <RefreshCw size={12} className={isRefreshing ? 'animate-spin' : ''} />
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
        </div>
      </div>

      {/* ── Wallet Selector Tabs ──────────────────────────────────────────── */}
      <div
        style={{
          display: 'flex', gap: 10, flexWrap: 'wrap',
          padding: '12px 16px',
          background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 8,
        }}
      >
        {orderedWallets.map((w) => (
          <WalletTab
            key={w.id}
            wallet={w}
            selected={w.currencyCode === selectedWallet.currencyCode}
            hidden={hideBalances}
            onClick={() => setSelectedWalletCode(w.currencyCode)}
          />
        ))}
      </div>

      {/* ── Chart + Info Panel row ────────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
        {/* Left: Chart panel */}
        <div
          style={{
            flex: 1, minWidth: 0,
            background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 8,
            padding: '18px 20px',
          }}
        >
          {/* Balance header */}
          <div style={{ marginBottom: 14 }}>
            <p style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 2 }}>
              BALANCE · {meta.chartStartLabel}
            </p>
            {hideBalances ? (
              <span style={{ fontSize: 28, fontWeight: 700, color: '#CBD5E1', letterSpacing: '0.1em' }}>••••••</span>
            ) : (
              <p style={{ fontSize: 28, fontWeight: 700, color: '#111827', fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em' }}>
                {selectedWallet.symbol}&nbsp;{meta.balance}
              </p>
            )}
          </div>

          {/* Chart */}
          <BalanceChart
            data={meta.chartData}
            startLabel={meta.chartStartLabel}
            startBalance={meta.chartStartBalance}
          />

          {/* Available + Pending stat boxes */}
          <div style={{ display: 'flex', gap: 14, marginTop: 16 }}>
            <div
              style={{
                flex: 1, padding: '12px 16px',
                background: '#FAFAFA', border: '1px solid #E5E7EB', borderRadius: 8,
              }}
            >
              <p style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 4 }}>Available now</p>
              <p style={{ fontSize: 17, fontWeight: 700, color: '#111827', fontVariantNumeric: 'tabular-nums' }}>
                {hideBalances ? '••••' : `${selectedWallet.symbol} ${meta.available}`}
              </p>
              <p style={{ fontSize: 11, color: '#9CA3AF', marginTop: 3 }}>{meta.availableLabel}</p>
            </div>
            <div
              style={{
                flex: 1, padding: '12px 16px',
                background: '#FAFAFA', border: '1px solid #E5E7EB', borderRadius: 8,
              }}
            >
              <p style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 4 }}>Pending settlement</p>
              <p style={{ fontSize: 17, fontWeight: 700, color: '#111827', fontVariantNumeric: 'tabular-nums' }}>
                {hideBalances ? '••••' : `${selectedWallet.symbol} ${meta.pending}`}
              </p>
              <p style={{ fontSize: 11, color: '#9CA3AF', marginTop: 3 }}>{meta.pendingLabel}</p>
            </div>
          </div>
        </div>

        {/* Right: Info panel */}
        <WalletInfoPanel wallet={selectedWallet} meta={meta} />
      </div>

      {/* ── BDT Wallet Activity ───────────────────────────────────────────── */}
      <div>
        <TransactionsTable
          data={walletTxData.length > 0 ? walletTxData : undefined}
          title={`${selectedWallet.currencyCode} wallet activity`}
          description={`Recent transactions for ${selectedWallet.region.split(' ')[0]}`}
          showViewAll={true}
          showPagination={true}
          perPage={10}
        />
      </div>

      {/* ── Test Mode Banner ──────────────────────────────────────────────── */}
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
    </div>
  )
}
