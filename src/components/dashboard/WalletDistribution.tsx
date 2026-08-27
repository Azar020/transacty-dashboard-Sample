import { walletDistribution } from '@/data/mockData'

function DonutChart() {
  const size = 120
  const cx = size / 2
  const cy = size / 2
  const outerR = 44
  const innerR = 30
  const r = (outerR + innerR) / 2
  const strokeW = outerR - innerR

  const circumference = 2 * Math.PI * r

  // Calculate cumulative strokeDashoffsets for multiple segments
  let cumulativeValue = 0

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* Background track */}
      <circle
        cx={cx} cy={cy} r={r}
        fill="none"
        stroke="#F3F4F6"
        strokeWidth={strokeW}
      />
      {/* Multi-colored arcs */}
      {walletDistribution.map((item) => {
        const strokeLength = (item.value / 100) * circumference
        const strokeDashoffset = -((cumulativeValue / 100) * circumference)
        cumulativeValue += item.value

        return (
          <circle
            key={item.name}
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke={item.color}
            strokeWidth={strokeW}
            strokeDasharray={`${strokeLength} ${circumference - strokeLength}`}
            strokeDashoffset={strokeDashoffset}
            transform={`rotate(-90 ${cx} ${cy})`}
          />
        )
      })}
      {/* Center label */}
      <text
        x={cx} y={cy - 5}
        textAnchor="middle"
        fontSize={9}
        fill="#9CA3AF"
        fontWeight={500}
      >
        Total
      </text>
      <text
        x={cx} y={cy + 12}
        textAnchor="middle"
        fontSize={16}
        fill="#111827"
        fontWeight={700}
      >
        {walletDistribution.length}
      </text>
    </svg>
  )
}

export function WalletDistribution() {
  return (
    <div
      style={{
        background: '#FFFFFF',
        border: '1px solid #E5E7EB',
        borderRadius: 8,
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
      }}
    >
      {/* Header */}
      <div>
        <h2 style={{ fontSize: 13, fontWeight: 600, color: '#111827', marginBottom: 2 }}>
          Wallet distribution
        </h2>
        <p style={{ fontSize: 11, color: '#9CA3AF' }}>
          Share by USD-equivalent available balance
        </p>
      </div>

      {/* Donut */}
      <div style={{ display: 'flex', justifyContent: 'center', padding: '6px 0' }}>
        <DonutChart />
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
        {walletDistribution.map((item) => (
          <div
            key={item.name}
            style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11 }}
          >
            {/* Color dot */}
            <span
              style={{
                width: 6, height: 6, borderRadius: '50%',
                background: item.color, flexShrink: 0,
              }}
            />
            {/* Name */}
            <span style={{ color: '#4B5563', flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {item.name}
            </span>
            {/* Percentage */}
            <span
              style={{
                color: '#6B7280',
                fontVariantNumeric: 'tabular-nums', flexShrink: 0,
              }}
            >
              {item.percentage}
            </span>
            {/* Amount */}
            <span style={{ fontWeight: 500, color: '#111827', fontVariantNumeric: 'tabular-nums', flexShrink: 0, marginLeft: 4 }}>
              {item.amount}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
