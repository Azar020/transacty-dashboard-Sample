// AssetRow — compact single-row component for currencies and crypto coins
import type { AssetItem } from '@/data/assetsData'

function StatusDot({ status }: { status: AssetItem['status'] }) {
  if (status === 'Active') {
    return (
      <span
        title="Active"
        style={{
          display: 'inline-block', width: 7, height: 7,
          borderRadius: '50%', background: '#10B981', flexShrink: 0,
        }}
      />
    )
  }
  if (status === 'Maintenance') {
    return (
      <span
        title="Maintenance"
        style={{
          display: 'inline-block', width: 7, height: 7,
          borderRadius: '50%', background: '#F59E0B', flexShrink: 0,
        }}
      />
    )
  }
  return (
    <span
      title="Inactive"
      style={{
        display: 'inline-block', width: 7, height: 7,
        borderRadius: '50%', background: '#D1D5DB', flexShrink: 0,
      }}
    />
  )
}

function CryptoIcon({ code, color }: { code: string; color: string }) {
  return (
    <div
      style={{
        width: 32, height: 32, borderRadius: '50%',
        background: color, display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0, fontSize: 9, fontWeight: 700, color: '#FFFFFF',
        letterSpacing: '-0.03em', userSelect: 'none',
        border: '1px solid rgba(0,0,0,0.08)',
      }}
    >
      {code.slice(0, 4)}
    </div>
  )
}

function FiatIcon({ flag }: { flag: string }) {
  return (
    <div
      style={{
        width: 32, height: 32, borderRadius: '50%',
        background: '#F9FAFB', border: '1px solid #E5E7EB',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0, fontSize: 18, lineHeight: 1, userSelect: 'none',
      }}
    >
      {flag}
    </div>
  )
}

function ChangeChip({ change }: { change: number }) {
  if (change === 0) return null
  const up = change >= 0
  return (
    <span
      style={{
        fontSize: 10, fontWeight: 600, padding: '1px 5px',
        borderRadius: 4,
        background: up ? '#ECFDF5' : '#FEF2F2',
        color: up ? '#059669' : '#DC2626',
      }}
    >
      {up ? '+' : ''}{change.toFixed(2)}%
    </span>
  )
}

interface AssetRowProps {
  asset: AssetItem
  hidden: boolean
  compact?: boolean  // true = smaller gaps / padding for preview strip
}

export function AssetRow({ asset, hidden, compact = false }: AssetRowProps) {
  const isCrypto = asset.type === 'crypto'
  const py = compact ? '7px' : '9px'

  return (
    <div
      style={{
        display: 'flex', alignItems: 'center',
        gap: 10, padding: `${py} 0`,
        borderBottom: '1px solid #F3F4F6',
      }}
    >
      {/* Icon */}
      {isCrypto
        ? <CryptoIcon code={asset.code} color={asset.color} />
        : <FiatIcon flag={asset.flag} />
      }

      {/* Name + sublabel */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>
            {asset.code}
          </span>
          <span style={{ fontSize: 11, color: '#9CA3AF', whiteSpace: 'nowrap' }}>
            {asset.name}
          </span>
          {isCrypto && <ChangeChip change={asset.change24h} />}
        </div>
        {asset.sublabel && (
          <div style={{ fontSize: 10, color: '#9CA3AF', marginTop: 1 }}>
            {asset.sublabel}
          </div>
        )}
      </div>

      {/* Balance */}
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        {hidden ? (
          <span style={{ fontSize: 13, fontWeight: 700, color: '#CBD5E1', letterSpacing: '0.1em' }}>
            ••••
          </span>
        ) : (
          <>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#111827', whiteSpace: 'nowrap' }}>
              {asset.balance}
            </div>
            <div style={{ fontSize: 10, color: '#9CA3AF', whiteSpace: 'nowrap' }}>
              {asset.balanceUSD}
            </div>
          </>
        )}
      </div>

      {/* Status dot */}
      <StatusDot status={asset.status} />
    </div>
  )
}
