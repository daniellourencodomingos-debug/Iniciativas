import { useEffect } from 'react'
import { Icon } from './icons.jsx'

/**
 * Toast de confirmação (canto inferior direito).
 * props: open, onClose, children, actionLabel, onAction, duration
 */
export default function Toast({
  open,
  onClose,
  children,
  actionLabel,
  onAction,
  duration = 9000,
}) {
  useEffect(() => {
    if (!open) return
    const t = setTimeout(onClose, duration)
    return () => clearTimeout(t)
  }, [open, duration, onClose])

  if (!open) return null

  return (
    <div className="fixed bottom-6 right-6 z-50 flex max-w-sm items-start gap-3 rounded-card border border-hairline bg-white p-4 shadow-xl">
      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-700">
        <Icon.Check width={15} height={15} />
      </span>
      <div className="flex-1 text-sm">
        <p className="text-gray-800">{children}</p>
        {actionLabel && (
          <button
            type="button"
            onClick={onAction}
            className="mt-1 font-semibold text-brand hover:underline"
          >
            {actionLabel}
          </button>
        )}
      </div>
      <button
        type="button"
        onClick={onClose}
        className="text-gray-400 hover:text-gray-600"
        title="Fechar"
      >
        <Icon.X width={15} height={15} />
      </button>
    </div>
  )
}
