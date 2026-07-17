import { useState } from 'react'
import { X, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { wallets } from '@/data/mockData'

interface RequestPayoutModalProps {
  open: boolean
  onClose: () => void
}

export function RequestPayoutModal({ open, onClose }: RequestPayoutModalProps) {
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

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-[2px] z-40"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-md pointer-events-auto animate-[fadeSlideIn_0.18s_ease-out] border border-gray-100 dark:border-gray-800">
          {/* Header */}
          <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-gray-100 dark:border-gray-800">
            <div>
              <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100">Request Payout</h2>
              <p className="text-xs text-gray-400 dark:text-gray-600 mt-0.5">Withdraw funds from your merchant pocket</p>
            </div>
            <button
              onClick={handleClose}
              className="p-1.5 rounded-md text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
            >
              <X size={15} />
            </button>
          </div>

          {success ? (
            <div className="px-5 py-8 flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M5 13L9 17L19 7" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Payout Requested!</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Your payout of{' '}
                <strong>{selectedWallet.symbol} {amount} {selectedWallet.currencyCode}</strong> to{' '}
                <strong>{destination}</strong> has been submitted for processing.
              </p>
              <Button variant="default" size="md" className="mt-2 w-full" onClick={handleClose}>
                Done
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="px-5 py-4 space-y-4">
              {/* Wallet Select */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Wallet
                </label>
                <select
                  value={walletId}
                  onChange={(e) => setWalletId(e.target.value)}
                  className="w-full h-9 px-3 rounded-md border border-gray-200 dark:border-gray-700 text-sm text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-400 cursor-pointer"
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
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Amount <span className="text-gray-400 font-normal">({selectedWallet.currencyCode})</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 dark:text-gray-400 font-medium">
                    {selectedWallet.symbol}
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className={cn(
                      'w-full h-9 pl-8 pr-3 rounded-md border text-sm text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-400',
                      errors.amount ? 'border-red-400 dark:border-red-600' : 'border-gray-200 dark:border-gray-700'
                    )}
                  />
                </div>
                {errors.amount && (
                  <p className="flex items-center gap-1 mt-1 text-[11px] text-red-500">
                    <AlertCircle size={11} /> {errors.amount}
                  </p>
                )}
              </div>

              {/* Destination */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Destination Address / Account
                </label>
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="e.g. bank account, wallet address..."
                  className={cn(
                    'w-full h-9 px-3 rounded-md border text-sm text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-400 placeholder:text-gray-400 dark:placeholder:text-gray-600',
                    errors.destination ? 'border-red-400 dark:border-red-600' : 'border-gray-200 dark:border-gray-700'
                  )}
                />
                {errors.destination && (
                  <p className="flex items-center gap-1 mt-1 text-[11px] text-red-500">
                    <AlertCircle size={11} /> {errors.destination}
                  </p>
                )}
              </div>

              {/* Note */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Note <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Add a reference note..."
                  rows={2}
                  className="w-full px-3 py-2 rounded-md border border-gray-200 dark:border-gray-700 text-sm text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 resize-none focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-400 placeholder:text-gray-400 dark:placeholder:text-gray-600"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-1">
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  className="dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
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
