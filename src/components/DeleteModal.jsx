import { useEffect, useState } from 'react'
import { Icon } from './icons.jsx'

/**
 * Modal de exclusão com checkbox de confirmação obrigatório.
 * props: open, onClose, onConfirm, entityLabel, effects (string[])
 */
export default function DeleteModal({
  open,
  onClose,
  onConfirm,
  entityLabel = 'este registro',
  effects = [],
}) {
  const [ack, setAck] = useState(false)

  useEffect(() => {
    if (open) setAck(false)
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-card border border-hairline bg-white shadow-xl">
        <header className="flex items-center gap-2 border-b border-hairline px-5 py-4">
          <Icon.Trash className="text-red-500" />
          <h2 className="text-base font-semibold text-gray-900">
            Remover {entityLabel}
          </h2>
        </header>
        <div className="space-y-4 px-5 py-5 text-sm text-gray-600">
          <p>Ao remover, os seguintes efeitos são aplicados:</p>
          <ul className="list-disc space-y-1 pl-5">
            {effects.map((e, i) => (
              <li key={i}>{e}</li>
            ))}
          </ul>
          <label className="flex items-start gap-2 rounded-md bg-gray-50 p-3">
            <input
              type="checkbox"
              checked={ack}
              onChange={(e) => setAck(e.target.checked)}
              className="mt-0.5 h-4 w-4 accent-brand"
            />
            <span className="font-medium text-gray-800">
              Li e compreendi esses efeitos
            </span>
          </label>
        </div>
        <footer className="flex justify-end gap-3 border-t border-hairline px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-hairline px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            disabled={!ack}
            onClick={onConfirm}
            className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-300"
          >
            Remover
          </button>
        </footer>
      </div>
    </div>
  )
}
