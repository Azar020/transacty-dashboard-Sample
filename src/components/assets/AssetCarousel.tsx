import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { fiatCurrencies, cryptoCoins, type AssetItem } from '@/data/assetsData'

// Real image assets
import bdtIcon from '@/assets/bangladesh.png'
import brlIcon from '@/assets/brazil-flag.png'
import usdtIcon from '@/assets/usdt.png'
import usdcIcon from '@/assets/USDC.png'

const REAL_ICONS: Record<string, string> = {
  BDT: bdtIcon,
  BRL: brlIcon,
  USDT: usdtIcon,
  USDC: usdcIcon,
}

// ── Flag / Icon SVGs ────────────────────────────────────────────────────────
function SvgFlag({ code }: { code: string }) {
  switch (code) {
    case 'INR':
      return (
        <svg viewBox="0 0 32 32" width="100%" height="100%">
          <clipPath id="circleClipINR"><circle cx="16" cy="16" r="16" /></clipPath>
          <g clipPath="url(#circleClipINR)">
            <rect y="0" width="32" height="10.6" fill="#FF9933" />
            <rect y="10.6" width="32" height="10.7" fill="#FFFFFF" />
            <rect y="21.3" width="32" height="10.7" fill="#138808" />
            <circle cx="16" cy="16" r="3.2" fill="none" stroke="#000080" strokeWidth="0.8" />
            <circle cx="16" cy="16" r="0.8" fill="#000080" />
          </g>
        </svg>
      )
    case 'USD':
      return (
        <svg viewBox="0 0 32 32" width="100%" height="100%">
          <clipPath id="circleClipUSD"><circle cx="16" cy="16" r="16" /></clipPath>
          <g clipPath="url(#circleClipUSD)">
            <rect width="32" height="32" fill="#B22234" />
            {[1, 3, 5, 7, 9, 11].map((i) => (
              <rect key={i} y={i * 2.46} width="32" height="2.46" fill="#FFFFFF" />
            ))}
            <rect width="14" height="14" fill="#3C3B6E" />
            {/* Stars pattern */}
            <circle cx="4" cy="4" r="0.9" fill="#FFF" />
            <circle cx="7" cy="4" r="0.9" fill="#FFF" />
            <circle cx="10" cy="4" r="0.9" fill="#FFF" />
            <circle cx="5.5" cy="7" r="0.9" fill="#FFF" />
            <circle cx="8.5" cy="7" r="0.9" fill="#FFF" />
            <circle cx="4" cy="10" r="0.9" fill="#FFF" />
            <circle cx="7" cy="10" r="0.9" fill="#FFF" />
            <circle cx="10" cy="10" r="0.9" fill="#FFF" />
          </g>
        </svg>
      )
    case 'EUR':
      return (
        <svg viewBox="0 0 32 32" width="100%" height="100%">
          <clipPath id="circleClipEUR"><circle cx="16" cy="16" r="16" /></clipPath>
          <g clipPath="url(#circleClipEUR)">
            <rect width="32" height="32" fill="#003399" />
            {/* Stars circle */}
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => {
              const rad = (deg * Math.PI) / 180
              const cx = 16 + 9 * Math.sin(rad)
              const cy = 16 - 9 * Math.cos(rad)
              return <circle key={deg} cx={cx} cy={cy} r="1" fill="#FFCC00" />
            })}
          </g>
        </svg>
      )
    case 'GBP':
      return (
        <svg viewBox="0 0 32 32" width="100%" height="100%">
          <clipPath id="circleClipGBP"><circle cx="16" cy="16" r="16" /></clipPath>
          <g clipPath="url(#circleClipGBP)">
            <rect width="32" height="32" fill="#012169" />
            <path d="M0 0 L32 32 M32 0 L0 32" stroke="#FFFFFF" strokeWidth="5" />
            <path d="M0 0 L32 32 M32 0 L0 32" stroke="#C8102E" strokeWidth="2.5" />
            <path d="M16 0 V32 M0 16 H32" stroke="#FFFFFF" strokeWidth="7" />
            <path d="M16 0 V32 M0 16 H32" stroke="#C8102E" strokeWidth="4.2" />
          </g>
        </svg>
      )
    case 'JPY':
      return (
        <svg viewBox="0 0 32 32" width="100%" height="100%">
          <clipPath id="circleClipJPY"><circle cx="16" cy="16" r="16" /></clipPath>
          <g clipPath="url(#circleClipJPY)">
            <rect width="32" height="32" fill="#FFFFFF" />
            <circle cx="16" cy="16" r="8" fill="#BC002D" />
          </g>
        </svg>
      )
    default:
      return null
  }
}

function SvgCrypto({ code }: { code: string }) {
  switch (code) {
    case 'BTC':
      return (
        <svg viewBox="0 0 32 32" width="100%" height="100%">
          <circle cx="16" cy="16" r="16" fill="#F7931A" />
          <text x="16" y="22" textAnchor="middle" fill="#FFFFFF" fontSize="18" fontWeight="bold" fontFamily="sans-serif">
            ₿
          </text>
        </svg>
      )
    case 'ETH':
      return (
        <svg viewBox="0 0 32 32" width="100%" height="100%">
          <circle cx="16" cy="16" r="16" fill="#627EEA" />
          <g fill="#FFFFFF">
            <polygon points="16,5 16,15.5 22.5,12.5" fillOpacity="0.8" />
            <polygon points="16,5 9.5,12.5 16,15.5" />
            <polygon points="16,17 16,25.5 22.5,14" fillOpacity="0.8" />
            <polygon points="16,17 9.5,14 16,25.5" />
          </g>
        </svg>
      )
    case 'BNB':
      return (
        <svg viewBox="0 0 32 32" width="100%" height="100%">
          <circle cx="16" cy="16" r="16" fill="#F3BA2F" />
          <g fill="#FFFFFF">
            <polygon points="16,8 19,11 16,14 13,11" />
            <polygon points="10,13 13,16 10,19 7,16" />
            <polygon points="22,13 25,16 22,19 19,16" />
            <polygon points="16,18 19,21 16,24 13,21" />
            <polygon points="16,14.5 17.5,16 16,17.5 14.5,16" />
          </g>
        </svg>
      )
    case 'SOL':
      return (
        <svg viewBox="0 0 32 32" width="100%" height="100%">
          <defs>
            <linearGradient id="solGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00FFA3" />
              <stop offset="100%" stopColor="#DC1FFF" />
            </linearGradient>
          </defs>
          <path d="M9 19 L23 19 L21 22 L7 22 Z" fill="url(#solGrad)" />
        </svg>
      )
    default:
      return null
  }
}

// ── Asset Icon Component ───────────────────────────────────────────────────
function AssetIcon({ asset }: { asset: AssetItem }) {
  const realImg = REAL_ICONS[asset.code]

  if (realImg) {
    return (
      <img
        src={realImg}
        alt={asset.code}
        style={{ width: 26, height: 26, objectFit: 'contain' }}
        draggable={false}
      />
    )
  }

  // SVG flags for prominent fiat currencies
  if (asset.type === 'fiat') {
    const svgFlag = SvgFlag({ code: asset.code })
    if (svgFlag) {
      return (
        <div style={{ width: 28, height: 28, borderRadius: '50%', overflow: 'hidden', flexShrink: 0, border: '1px solid #E5E7EB' }}>
          {svgFlag}
        </div>
      )
    }

    return (
      <div
        style={{
          width: 28, height: 28, borderRadius: '50%',
          background: '#F9FAFB', border: '1px solid #E5E7EB',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 16, lineHeight: 1, flexShrink: 0, userSelect: 'none',
        }}
      >
        {asset.flag}
      </div>
    )
  }

  // SVG for prominent cryptocurrencies
  const svgCrypto = SvgCrypto({ code: asset.code })
  if (svgCrypto) {
    return (
      <div style={{ width: 28, height: 28, borderRadius: '50%', overflow: 'hidden', flexShrink: 0, border: '1px solid #E5E7EB' }}>
        {svgCrypto}
      </div>
    )
  }

  // Generic crypto initials circle
  return (
    <div
      style={{
        width: 28, height: 28, borderRadius: '50%',
        background: asset.color || '#6366F1',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#FFFFFF', fontWeight: 700, fontSize: 8,
        letterSpacing: '-0.02em', flexShrink: 0, userSelect: 'none',
        boxShadow: `0 2px 6px ${asset.color}33`,
      }}
    >
      {asset.code.slice(0, 4)}
    </div>
  )
}

// ── Asset Card ─────────────────────────────────────────────────────────────
function AssetCard({ asset, hidden }: { asset: AssetItem; hidden: boolean }) {
  const { navigateToWallet } = useApp()
  const isSelected = asset.selected

  // Full name with code e.g. "Bangladeshi Taka (BDT)", "United States Dollar (USD)", "Tether (USDT)"
  const fullName = `${asset.name} (${asset.code})`
  // Sublabel for bottom row
  const sublabel = asset.sublabel || asset.name

  return (
    <div
      onClick={() => navigateToWallet(asset.code)}
      style={{
        width: 310,
        height: 160,
        boxSizing: 'border-box',
        flexShrink: 0,
        background: '#FFFFFF',
        border: isSelected ? '1px solid #4F46E5' : '1px solid #E5E7EB',
        borderRadius: 14,
        padding: '16px 20px 14px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        boxShadow: isSelected ? '0 2px 8px rgba(79, 70, 229, 0.08)' : '0 1px 3px rgba(0,0,0,0.02)',
        transition: 'all 0.18s ease',
        cursor: 'pointer',
        userSelect: 'none',
      }}
      onMouseEnter={(e) => {
        ;(e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'
        ;(e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'
      }}
      onMouseLeave={(e) => {
        ;(e.currentTarget as HTMLDivElement).style.boxShadow = isSelected ? '0 2px 8px rgba(79, 70, 229, 0.08)' : '0 1px 3px rgba(0,0,0,0.02)'
        ;(e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'
      }}
    >
      {/* ── Top row: Squircle app icon + full name label & currency code chip ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* App Icon Squircle Container */}
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
            flexShrink: 0,
          }}
        >
          <AssetIcon asset={asset} />
        </div>

        {/* Title and Code Chip */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 3, minWidth: 0, flex: 1 }}>
          <p
            title={fullName}
            style={{
              fontSize: 13,
              color: '#374151',
              margin: 0,
              fontWeight: 500,
              lineHeight: 1.25,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              wordBreak: 'break-word',
              width: '100%',
            }}
          >
            {fullName}
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
            {asset.code}
          </span>
        </div>
      </div>

      {/* ── Balance row ── */}
      <div>
        {hidden ? (
          <span style={{ fontSize: 24, fontWeight: 700, color: '#CBD5E1', letterSpacing: '0.12em' }}>
            *******
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
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            <span>{asset.balance}</span>
            <span style={{ fontSize: 13, fontWeight: 500, color: '#9CA3AF' }}>
              {asset.code}
            </span>
          </p>
        )}
      </div>

      {/* ── Divider line ── */}
      <div style={{ height: 1, background: '#F3F4F6', margin: '0' }} />

      {/* ── Bottom row: Status Pill Badge (Left) + Note/Sublabel (Right) ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        {asset.status === 'Active' ? (
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
              flexShrink: 0,
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
        ) : asset.status === 'Maintenance' ? (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              padding: '3px 10px',
              borderRadius: 9999,
              background: '#FFFBEB',
              color: '#D97706',
              fontSize: 12,
              fontWeight: 600,
              flexShrink: 0,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: '#D97706',
                display: 'inline-block',
                flexShrink: 0,
              }}
            />
            Maintenance
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
              flexShrink: 0,
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

        <span
          style={{
            fontSize: 11,
            color: '#9CA3AF',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            textAlign: 'right',
            maxWidth: '58%',
          }}
        >
          {sublabel}
        </span>
      </div>
    </div>
  )
}

// ── Carousel Component ─────────────────────────────────────────────────────
interface AssetCarouselProps {
  type: 'currency' | 'crypto'
  hidden: boolean
  onViewAll: () => void
}

export function AssetCarousel({ type, hidden, onViewAll }: AssetCarouselProps) {
  const [index, setIndex] = useState(0)
  const isCrypto = type === 'crypto'
  const data = isCrypto ? cryptoCoins : fiatCurrencies

  // Responsive items visible (based on ~310px width cards + 12px gap)
  const [visibleCount, setVisibleCount] = useState(4)

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth
      if (w < 680) setVisibleCount(1)
      else if (w < 1000) setVisibleCount(2)
      else if (w < 1340) setVisibleCount(3)
      else setVisibleCount(4)
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const maxIndex = Math.max(0, data.length - visibleCount)

  const handlePrev = useCallback(() => {
    setIndex((prev) => Math.max(0, prev - 1))
  }, [])

  const handleNext = useCallback(() => {
    setIndex((prev) => Math.min(maxIndex, prev + 1))
  }, [maxIndex])

  // Card dimensions: 310px width + 12px gap = 322px step
  const stepWidth = 322
  const translateX = index * stepWidth

  // Section theme
  const title = isCrypto ? 'Coins' : 'Currencies'
  const subtitle = isCrypto ? 'Cryptocurrencies powered by blockchain.' : 'Fiat currencies from around the world.'

  // Pagination dots (show 6 dots representing progress)
  const totalDots = 6
  const activeDotIndex = maxIndex > 0 ? Math.round((index / maxIndex) * (totalDots - 1)) : 0

  return (
    <div
      style={{
        background: '#FFFFFF',
        border: '1px solid #E5E7EB',
        borderRadius: 12,
        padding: '16px 18px 14px',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
      }}
    >
      {/* ── Section Header ────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: '#111827', margin: 0 }}>
              {title}
            </h2>

          </div>
          <p style={{ fontSize: 11, color: '#9CA3AF', margin: '2px 0 0 0' }}>
            {subtitle}
          </p>
        </div>

        {/* View all button */}
        <button
          onClick={onViewAll}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 2,
            fontSize: 12,
            fontWeight: 600,
            color: '#4F46E5',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px 0',
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = '0.8' }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = '1' }}
        >
          View all <ChevronRight size={13} />
        </button>
      </div>

      {/* ── Carousel Cards Container with integrated Left/Right arrows ── */}
      <div style={{ position: 'relative' }}>
        {/* Left Arrow Button */}
        <button
          onClick={handlePrev}
          disabled={index === 0}
          style={{
            position: 'absolute',
            left: -10,
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 10,
            width: 30,
            height: 30,
            borderRadius: '50%',
            background: '#FFFFFF',
            border: '1px solid #E5E7EB',
            boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: index === 0 ? 'not-allowed' : 'pointer',
            color: index === 0 ? '#D1D5DB' : '#374151',
            opacity: index === 0 ? 0.35 : 1,
            transition: 'all 0.15s',
          }}
        >
          <ChevronLeft size={16} />
        </button>

        {/* Card Track Viewport */}
        <div style={{ overflow: 'hidden', padding: '4px 2px' }}>
          <div
            style={{
              display: 'flex',
              gap: 12,
              alignItems: 'stretch',
              transform: `translateX(-${translateX}px)`,
              transition: 'transform 0.35s cubic-bezier(0.25, 1, 0.5, 1)',
            }}
          >
            {data.map((asset) => (
              <AssetCard key={asset.id} asset={asset} hidden={hidden} />
            ))}
          </div>
        </div>

        {/* Right Arrow Button */}
        <button
          onClick={handleNext}
          disabled={index >= maxIndex}
          style={{
            position: 'absolute',
            right: -10,
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 10,
            width: 30,
            height: 30,
            borderRadius: '50%',
            background: '#FFFFFF',
            border: '1px solid #E5E7EB',
            boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: index >= maxIndex ? 'not-allowed' : 'pointer',
            color: index >= maxIndex ? '#D1D5DB' : '#374151',
            opacity: index >= maxIndex ? 0.35 : 1,
            transition: 'all 0.15s',
          }}
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* ── Pagination Dots ───────────────────────────────────────── */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 4, marginTop: -2 }}>
        {Array.from({ length: totalDots }).map((_, i) => {
          const isActive = i === activeDotIndex
          return (
            <span
              key={i}
              onClick={() => {
                const targetIdx = Math.round((i / (totalDots - 1)) * maxIndex)
                setIndex(targetIdx)
              }}
              style={{
                display: 'inline-block',
                width: isActive ? 18 : 5,
                height: 4,
                borderRadius: 2,
                background: isActive ? '#4F46E5' : '#E5E7EB',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
              }}
            />
          )
        })}
      </div>
    </div>
  )
}
