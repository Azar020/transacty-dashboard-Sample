import { useState } from 'react'
import { X, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { wallets } from '@/data/mockData'
import { useApp } from '@/context/AppContext'

interface RequestPayoutModalProps {
  open: boolean
  onClose: () => void
}

export function RequestPayoutModal({ open, onClose }: RequestPayoutModalProps) {
  const { theme } = useApp()
  const isDark = theme === 'dark'
  const [walletId, setWalletId] = useState(wallets[0].id)
  const [amount, setAmount] = useState('')
  const [destination, setDestination] = useState('')
  const [note, setNote] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  if (!open) return null

  const selectedWallet = wallets.find((w) => w.id === walletId)!

  const validate = () => {
    const e: Record<string, string> = {}
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0)
      e.amount = 'Enter a valid amount greater than 0.'
    if (!destination.trim())
      e.destination = 'Destination address / account is required.'
    return e
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setErrors({})
    setSubmitting(true)
    setTimeout(() => {
      setSubmitting(false)
      setSuccess(true)
    }, 1500)
  }

  const handleClose = () => {
    setAmount('')
    setDestination('')
    setNote('')
    setErrors({})
    setSuccess(false)
    setSubmitting(false)
    onClose()
  }

  const fieldBase: React.CSSProperties = {
    width: '100%',
    background: isDark ? 'rgba(255,255,255,0.04)' : '#F8FAFC',
    border: `1px solid ${isDark ? 'rgba(255,255,255,0.10)' : '#E2E8F0'}`,
    color: isDark ? '#F1F5F9' : '#111827',
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none',
  }
  const errorBorder = `1px solid ${isDark ? 'rgba(220,38,38,0.50)' : 'rgba(220,38,38,0.40)'}`

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 backdrop-blur-[2px] z-40"
        style={{ background: isDark ? 'rgba(0,0,0,0.60)' : 'rgba(0,0,0,0.35)' }}
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="rounded-xl w-full max-w-md pointer-events-auto animate-[fadeSlideIn_0.18s_ease-out]"
          style={{
            background: isDark ? '#161B22' : '#FFFFFF',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.09)' : '#E2E8F0'}`,
            boxShadow: isDark
              ? '0 24px 64px rgba(0,0,0,0.50)'
              : '0 24px 64px rgba(15,23,42,0.15)',
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-5 pt-5 pb-4 border-b"
            style={{ borderColor: isDark ? 'rgba(255,255,255,0.08)' : '#E2E8F0' }}
          >
            <div>
              <h2
                className="text-sm font-bold"
                style={{ color: isDark ? '#F1F5F9' : '#111827' }}
              >
                Request Payout
              </h2>
              <p
                className="text-xs mt-0.5"
                style={{ color: isDark ? 'rgba(255,255,255,0.38)' : '#64748B' }}
              >
                Withdraw funds from your merchant pocket
              </p>
            </div>
            <button
              onClick={handleClose}
              className="p-1.5 rounded-md transition-colors cursor-pointer"
              style={{ color: isDark ? 'rgba(255,255,255,0.38)' : '#94A3B8' }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = isDark ? 'rgba(255,255,255,0.06)' : '#F1F5F9'
                ;(e.currentTarget as HTMLButtonElement).style.color = isDark ? '#F1F5F9' : '#111827'
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = 'transparent'
                ;(e.currentTarget as HTMLButtonElement).style.color = isDark ? 'rgba(255,255,255,0.38)' : '#94A3B8'
              }}
            >
              <X size={15} />
            </button>
          </div>

          {success ? (
            <div className="px-5 py-8 flex flex-col items-center text-center gap-3">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{
                  background: isDark ? 'rgba(22,163,74,0.12)' : 'rgba(22,163,74,0.08)',
                  border: '1px solid rgba(22,163,74,0.20)',
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M5 13L9 17L19 7" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p
                className="text-sm font-semibold"
                style={{ color: isDark ? '#F1F5F9' : '#111827' }}
              >
                Payout Requested!
              </p>
              <p
                className="text-xs"
                style={{ color: isDark ? 'rgba(255,255,255,0.50)' : '#64748B' }}
              >
                Your payout of{' '}
                <strong style={{ color: isDark ? '#F1F5F9' : '#111827' }}>
                  {selectedWallet.symbol} {amount} {selectedWallet.currencyCode}
                </strong>{' '}
                to{' '}
                <strong style={{ color: isDark ? '#F1F5F9' : '#111827' }}>{destination}</strong>
                {' '}has been submitted for processing.
              </p>
              <Button variant="default" size="md" className="mt-2 w-full" onClick={handleClose}>
                Done
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="px-5 py-4 space-y-4">
              {/* Wallet Select */}
              <div>
                <label
                  className="block text-xs font-semibold mb-1.5"
                  style={{ color: isDark ? '#E2E8F0' : '#374151' }}
                >
                  Wallet
                </label>
                <select
                  value={walletId}
                  onChange={(e) => setWalletId(e.target.value)}
                  className="h-9 px-3 cursor-pointer"
                  style={fieldBase}
                >
                  {wallets.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.currency} — {w.region} ({w.symbol} {w.amount})
                    </option>
                  ))}
                </select>
              </div>

              {/* Amount */}
              <div>
                <label
                  className="block text-xs font-semibold mb-1.5"
                  style={{ color: isDark ? '#E2E8F0' : '#374151' }}
                >
                  Amount{' '}
                  <span style={{ color: isDark ? 'rgba(255,255,255,0.35)' : '#94A3B8', fontWeight: 400 }}>
                    ({selectedWallet.currencyCode})
                  </span>
                </label>
                <div className="relative">
                  <span
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium"
                    style={{ color: isDark ? 'rgba(255,255,255,0.38)' : '#94A3B8' }}
                  >
                    {selectedWallet.symbol}
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="h-9 pl-8 pr-3"
                    style={{
                      ...fieldBase,
                      border: errors.amount ? errorBorder : fieldBase.border,
                    }}
                  />
                </div>
                {errors.amount && (
                  <p className="flex items-center gap-1 mt-1 text-[11px]" style={{ color: '#DC2626' }}>
                    <AlertCircle size={11} /> {errors.amount}
                  </p>
                )}
              </div>

              {/* Destination */}
              <div>
                <label
                  className="block text-xs font-semibold mb-1.5"
                  style={{ color: isDark ? '#E2E8F0' : '#374151' }}
                >
                  Destination Address / Account
                </label>
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="e.g. bank account, wallet address..."
                  className="h-9 px-3"
                  style={{
                    ...fieldBase,
                    border: errors.destination ? errorBorder : fieldBase.border,
                  }}
                />
                {errors.destination && (
                  <p className="flex items-center gap-1 mt-1 text-[11px]" style={{ color: '#DC2626' }}>
                    <AlertCircle size={11} /> {errors.destination}
                  </p>
                )}
              </div>

              {/* Note */}
              <div>
                <label
                  className="block text-xs font-semibold mb-1.5"
                  style={{ color: isDark ? '#E2E8F0' : '#374151' }}
                >
                  Note{' '}
                  <span style={{ color: isDark ? 'rgba(255,255,255,0.35)' : '#94A3B8', fontWeight: 400 }}>
                    (optional)
                  </span>
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Add a reference note..."
                  rows={2}
                  className="px-3 py-2 resize-none"
                  style={fieldBase}
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-1">
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  onClick={handleClose}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="default" size="md" disabled={submitting}>
                  {submitting ? (
                    <span className="flex items-center gap-1.5">
                      <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Submitting…
                    </span>
                  ) : (
                    'Request Payout'
                  )}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  )
}
