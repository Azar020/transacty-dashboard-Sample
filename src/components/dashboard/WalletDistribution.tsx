import { walletDistribution } from '@/data/mockData'
import { useApp } from '@/context/AppContext'

const COLORS = ['#14532d', '#4ade80']
const TOTAL = walletDistribution.reduce((sum, d) => sum + d.value, 0)

function DonutChart({ isDark }: { isDark: boolean }) {
  const size = 140
  const cx = size / 2
  const cy = size / 2
  const outerR = 55
  const innerR = 38
  const strokeWidth = outerR - innerR

  let cumulativeAngle = -90

  const slices = walletDistribution.map((item, index) => {
    const fraction = item.value / TOTAL
    const angle = fraction * 360
    const startAngle = cumulativeAngle
    cumulativeAngle += angle
    const endAngle = cumulativeAngle

    const toRad = (deg: number) => (deg * Math.PI) / 180
    const r = (outerR + innerR) / 2

    const x1 = cx + r * Math.cos(toRad(startAngle))
    const y1 = cy + r * Math.sin(toRad(startAngle))
    const x2 = cx + r * Math.cos(toRad(endAngle))
    const y2 = cy + r * Math.sin(toRad(endAngle))

    const largeArc = angle > 180 ? 1 : 0
    const d = `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`

    return { d, color: COLORS[index], strokeWidth: strokeWidth + 2, key: item.name }
  })

  const labelColor = isDark ? '#6b7280' : '#9ca3af'
  const numberColor = isDark ? '#f3f4f6' : '#111827'

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {slices.map((slice) => (
        <path
          key={slice.key}
          d={slice.d}
          fill="none"
          stroke={slice.color}
          strokeWidth={slice.strokeWidth}
          strokeLinecap="butt"
        />
      ))}
      <text x={cx} y={cy - 6} textAnchor="middle" fontSize="9" fill={labelColor}>Wallets</text>
      <text x={cx} y={cy + 10} textAnchor="middle" fontSize="18" fontWeight="700" fill={numberColor}>4</text>
    </svg>
  )
}

export function WalletDistribution() {
  const { theme } = useApp()
  const isDark = theme === 'dark'

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4 flex flex-col gap-4 h-fit transition-colors duration-200">
      <div>
        <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Wallet distribution</h2>
        <p className="text-[11px] text-gray-400 dark:text-gray-600 mt-0.5">Balance share across pockets</p>
      </div>

      {/* Donut Chart */}
      <div className="flex justify-center">
        <DonutChart isDark={isDark} />
      </div>

      {/* Legend */}
      <div className="space-y-2">
        {walletDistribution.map((item, index) => (
          <div key={item.name} className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 min-w-0">
              <span
                className="inline-block w-2.5 h-2.5 rounded-sm flex-shrink-0"
                style={{ backgroundColor: COLORS[index] }}
              />
              <span className="text-[11px] text-gray-700 dark:text-gray-300 font-semibold flex-shrink-0">{item.percentage}</span>
              <span className="text-[11px] text-gray-500 dark:text-gray-500 truncate">{item.name}</span>
            </div>
            <span className="text-[11px] text-gray-700 dark:text-gray-300 font-medium tabular-nums flex-shrink-0">
              {item.amount}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
