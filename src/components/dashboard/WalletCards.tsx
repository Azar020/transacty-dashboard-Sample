import { wallets, type Wallet } from '@/data/mockData'
import { useApp } from '@/context/AppContext'
import bdtIcon from '@/assets/bangladesh.png'
import brlIcon from '@/assets/brazil-flag.png'
import usdtIcon from '@/assets/usdt.png'
import usdcIcon from '@/assets/USDC.png'

const ICON_MAP: Record<string, string> = {
  BDT: bdtIcon,
  BRL: brlIcon,
  USDT: usdtIcon,
  USDC: usdcIcon,
}

// ── Flag SVGs for bottom-right corner badge ────────────────────────────────────
function IndiaFlag() {
  return (
    <svg viewBox="0 0 32 32" width="100%" height="100%">
      <rect y="0" width="32" height="10.67" fill="#FF9933" />
      <rect y="10.67" width="32" height="10.67" fill="#FFFFFF" />
      <rect y="21.34" width="32" height="10.67" fill="#138808" />
      <circle cx="16" cy="16" r="3.2" fill="none" stroke="#000080" strokeWidth="0.8" />
      <circle cx="16" cy="16" r="0.8" fill="#000080" />
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
        <line
          key={deg}
          x1={16 + 1.2 * Math.sin((deg * Math.PI) / 180)}
          y1={16 - 1.2 * Math.cos((deg * Math.PI) / 180)}
          x2={16 + 3.2 * Math.sin((deg * Math.PI) / 180)}
          y2={16 - 3.2 * Math.cos((deg * Math.PI) / 180)}
          stroke="#000080"
          strokeWidth="0.35"
        />
      ))}
    </svg>
  )
}

function BangladeshFlag() {
  return (
    <svg viewBox="0 0 32 32" width="100%" height="100%">
      <rect width="32" height="32" fill="#006A4E" />
      <circle cx="14" cy="16" r="8" fill="#F42A41" />
    </svg>
  )
}

function EuropeFlag() {
  return (
    <svg viewBox="0 0 32 32" width="100%" height="100%">
      <rect width="32" height="32" fill="#003399" />
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => {
        const rad = (deg * Math.PI) / 180
        const cx = 16 + 9 * Math.sin(rad)
        const cy = 16 - 9 * Math.cos(rad)
        return <circle key={deg} cx={cx} cy={cy} r="1.1" fill="#FFCC00" />
      })}
    </svg>
  )
}

function BrazilFlag() {
  return (
    <svg viewBox="0 0 32 32" width="100%" height="100%">
      <rect width="32" height="32" fill="#009739" />
      <polygon points="16,4 28,16 16,28 4,16" fill="#FEDD00" />
      <circle cx="16" cy="16" r="6" fill="#002776" />
      <path d="M 10 16 A 6 6 0 0 0 22 16" stroke="#FFFFFF" strokeWidth="1" fill="none" />
    </svg>
  )
}

const WALLET_CONFIG: Record<string, { title: string; note: string; flag: React.ReactNode }> = {
  BDT: {
    title: 'Bangladesh',
    note: 'BDT settlement • payouts',
    flag: <BangladeshFlag />,
  },
  USDT: {
    title: 'India (USDT)',
    note: 'USDT settlement • pay-ins via API',
    flag: <IndiaFlag />,
  },
  USDC: {
    title: 'Europe (USDC)',
    note: 'Europe USDC • EUR payouts',
    flag: <EuropeFlag />,
  },
  BRL: {
    title: 'Brazil (PIX)',
    note: 'Brazil PIX • instant payout',
    flag: <BrazilFlag />,
  },
}

function WalletCard({ wallet, hidden, refreshing }: {
  wallet: Wallet; hidden: boolean; refreshing: boolean
}) {
  const { navigateToWallet } = useApp()
  const config = WALLET_CONFIG[wallet.currencyCode] ?? {
    title: wallet.region,
    note: '',
    flag: null,
  }

  const isActive = wallet.status === 'Active'

  return (
    <div
      onClick={() => navigateToWallet(wallet.currencyCode)}
      style={{
        flex: 1,
        minWidth: 0,
        padding: '16px 20px 14px',
        background: '#FFFFFF',
        border: '1px solid #E5E7EB',
        borderRadius: 14,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
        cursor: 'pointer',
        transition: 'all 0.18s ease',
        userSelect: 'none',
      }}
      onMouseEnter={(e) => {
        ;(e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'
        ;(e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'
      }}
      onMouseLeave={(e) => {
        ;(e.currentTarget as HTMLDivElement).style.boxShadow = '0 1px 3px rgba(0,0,0,0.02)'
        ;(e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'
      }}
    >
      {/* ── Top row: Squircle app icon with flag badge + title & code chip ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* App Icon Squircle Container with Flag Badge */}
        <div style={{ position: 'relative', width: 44, height: 44, flexShrink: 0 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: 'linear-gradient(180deg, #F8FAFC 0%, #E2E8F0 100%)',
              border: '1px solid #D1D5DB',
              boxShadow: '0 1px 3px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.9)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}
          >
            <img
              src={ICON_MAP[wallet.currencyCode]}
              alt={wallet.currencyCode}
              style={{ width: 26, height: 26, objectFit: 'contain' }}
              draggable={false}
            />
          </div>

          {/* Bottom-right overlapping circular country flag */}
          {config.flag && (
            <div
              style={{
                position: 'absolute',
                bottom: -2,
                right: -2,
                width: 17,
                height: 17,
                borderRadius: '50%',
                border: '2px solid #FFFFFF',
                boxShadow: '0 1px 3px rgba(0,0,0,0.18)',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {config.flag}
            </div>
          )}
        </div>

        {/* Title and Code Chip */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 3, minWidth: 0 }}>
          <p
            style={{
              fontSize: 13,
              color: '#4B5563',
              margin: 0,
              fontWeight: 400,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {config.title}
          </p>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '2px 8px',
              borderRadius: 5,
              background: '#F3F4F6',
              fontSize: 11,
              fontWeight: 700,
              color: '#374151',
              letterSpacing: '0.02em',
            }}
          >
            {wallet.currencyCode}
          </span>
        </div>
      </div>

      {/* ── Balance ── */}
      <div style={{ marginTop: 2 }}>
        {refreshing ? (
          <div style={{ height: 32, width: 120, borderRadius: 4, background: '#F3F4F6' }} />
        ) : hidden ? (
          <span style={{ fontSize: 24, fontWeight: 700, color: '#CBD5E1', letterSpacing: '0.12em' }}>
            ****
          </span>
        ) : (
          <p
            style={{
              fontSize: 26,
              fontWeight: 700,
              color: '#111827',
              fontVariantNumeric: 'tabular-nums',
              letterSpacing: '-0.02em',
              margin: 0,
              display: 'flex',
              alignItems: 'baseline',
              gap: 6,
            }}
          >
            <span>{wallet.symbol}&nbsp;{wallet.amount}</span>
            <span style={{ fontSize: 13, fontWeight: 500, color: '#9CA3AF' }}>
              {wallet.currencyCode}
            </span>
          </p>
        )}
      </div>

      {/* ── Divider line ── */}
      <div style={{ height: 1, background: '#F3F4F6', margin: '2px 0' }} />

      {/* ── Bottom row: Status Pill Badge (Left) + Note (Right) ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
        {isActive ? (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              padding: '3px 10px',
              borderRadius: 9999,
              background: '#ECFDF5',
              color: '#059669',
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: '#059669',
                display: 'inline-block',
                flexShrink: 0,
              }}
            />
            Active
          </span>
        ) : (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              padding: '3px 10px',
              borderRadius: 9999,
              background: '#F3F4F6',
              color: '#6B7280',
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: '#9CA3AF',
                display: 'inline-block',
                flexShrink: 0,
              }}
            />
            Unavailable
          </span>
        )}

        <span style={{ fontSize: 11, color: '#9CA3AF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {config.note}
        </span>
      </div>
    </div>
  )
}

export function WalletCards() {
  const { hideBalances, isRefreshing } = useApp()

  // Show all 4 wallets in one horizontal row matching the screenshot order:
  // BDT | USDT | USDC | BRL
  const orderedWallets = ['BDT', 'USDT', 'USDC', 'BRL']
    .map(code => wallets.find(w => w.currencyCode === code)!)
    .filter(Boolean)

  return (
    <div style={{ display: 'flex', gap: 12 }}>
      {orderedWallets.map((wallet) => (
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

