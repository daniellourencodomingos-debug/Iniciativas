import { useEffect, useRef, useState } from 'react'
import { Icon } from './icons.jsx'

/**
 * Campo de filtro multi-seleção: valores escolhidos aparecem como chips
 * dentro da própria caixa do campo. Clique abre um dropdown com checkboxes
 * das opções disponíveis.
 *
 * props:
 * - label: rótulo do campo
 * - options: [{ value, label }]
 * - selected: string[] (valores selecionados)
 * - onChange: (string[]) => void
 * - placeholder: texto quando nada selecionado
 * - className: classes extras no wrapper
 */
export default function MultiSelectField({
  label,
  options,
  selected,
  onChange,
  placeholder = 'Todos',
  className = '',
}) {
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

  const toggle = (value) => {
    if (selected.includes(value)) onChange(selected.filter((v) => v !== value))
    else onChange([...selected, value])
  }

  const remove = (value, e) => {
    e.stopPropagation()
    onChange(selected.filter((v) => v !== value))
  }

  const labelOf = (value) => options.find((o) => o.value === value)?.label ?? value

  return (
    <label className={`flex flex-col gap-1 ${className}`}>
      <span className="text-[11px] font-medium uppercase tracking-wide text-gray-500">
        {label}
      </span>
      <div className="relative" ref={ref}>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex min-h-9 w-full flex-wrap items-center gap-1 rounded-md border border-hairline bg-white px-2 py-1 text-left text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
        >
          {selected.length === 0 && (
            <span className="px-1 text-gray-400">{placeholder}</span>
          )}
          {selected.map((v) => (
            <span
              key={v}
              className="flex items-center gap-1 rounded bg-brand/10 px-2 py-0.5 text-xs font-medium text-brand"
            >
              {labelOf(v)}
              <button
                type="button"
                onClick={(e) => remove(v, e)}
                className="rounded-full hover:bg-brand/20"
                title="Remover"
              >
                <Icon.X width={10} height={10} strokeWidth={2.5} />
              </button>
            </span>
          ))}
          <Icon.ChevronDown
            width={12}
            height={12}
            className={`ml-auto shrink-0 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`}
          />
        </button>

        {open && (
          <div className="absolute left-0 top-[calc(100%+4px)] z-20 max-h-64 w-56 overflow-y-auto rounded-md border border-hairline bg-white p-1 shadow-lg">
            {options.map((o) => (
              <label
                key={o.value}
                className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-sm hover:bg-gray-50"
              >
                <input
                  type="checkbox"
                  checked={selected.includes(o.value)}
                  onChange={() => toggle(o.value)}
                  className="h-3.5 w-3.5 rounded border-gray-300 text-brand focus:ring-brand/30"
                />
                {o.label}
              </label>
            ))}
            {options.length === 0 && (
              <p className="px-2 py-1.5 text-sm text-gray-400">Nenhuma opção</p>
            )}
          </div>
        )}
      </div>
    </label>
  )
}
