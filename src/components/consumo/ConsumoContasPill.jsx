import { useEffect, useRef, useState } from 'react'
import { Icon } from '../icons.jsx'

/**
 * Pill "Contas" da barra de Consumo: lista as contas de faturamento
 * agrupadas por provedor (checkboxes), igual ao ContasField usado em
 * Iniciativas, mas com o visual de pill (ícone + rótulo fixo + chevron)
 * desta barra em vez do campo com rótulo flutuante.
 *
 * props:
 * - providers: string[]
 * - contasPorProvedor: { [provider]: string[] }
 * - value: string[] (ids "provedor::conta")
 * - onChange: (string[]) => void
 */
export default function ConsumoContasPill({ providers, contasPorProvedor, value, onChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    const onDocClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [open])

  const idOf = (provider, conta) => `${provider}::${conta}`
  const toggle = (id) =>
    onChange(value.includes(id) ? value.filter((v) => v !== id) : [...value, id])

  const active = value.length > 0

  return (
    <div className="relative shrink-0" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={[
          'flex h-9 items-center gap-1.5 whitespace-nowrap rounded-md border px-3 text-sm transition',
          active
            ? 'border-brand text-brand font-semibold'
            : 'border-hairline bg-white text-gray-600 hover:bg-gray-50',
        ].join(' ')}
      >
        <Icon.Bank width={15} height={15} className="shrink-0" />
        Contas
        {active && (
          <span className="flex h-4 min-w-[16px] shrink-0 items-center justify-center rounded-full bg-brand px-1 text-[10px] font-semibold leading-none text-white">
            {value.length}
          </span>
        )}
        <Icon.ChevronDown
          width={12}
          height={12}
          className={`shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="absolute left-0 top-[calc(100%+4px)] z-30 max-h-72 w-64 overflow-y-auto rounded-md border border-hairline bg-white p-1 shadow-lg">
          {providers.map((prov) => (
            <div key={prov} className="mb-1 last:mb-0">
              <p className="px-2 pb-1 pt-1.5 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                {prov}
              </p>
              {(contasPorProvedor[prov] ?? []).map((conta) => {
                const id = idOf(prov, conta)
                return (
                  <label
                    key={id}
                    className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-sm hover:bg-gray-50"
                  >
                    <input
                      type="checkbox"
                      checked={value.includes(id)}
                      onChange={() => toggle(id)}
                      className="h-3.5 w-3.5 rounded border-gray-300 text-brand focus:ring-brand/30"
                    />
                    {conta}
                  </label>
                )
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
