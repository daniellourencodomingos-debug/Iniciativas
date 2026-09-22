import { useEffect, useRef, useState } from 'react'
import { Icon } from '../icons.jsx'

/**
 * Pill de filtro usado na barra de Consumo: ícone + rótulo fixo + chevron.
 * Ao contrário do MultiSelectField (usado em Iniciativas), a seleção NÃO
 * aparece como chips dentro do próprio campo — o rótulo do pill não muda,
 * só a cor (fica "ativo"/azul quando há algo selecionado). As seleções
 * aparecem, quando fizer sentido, na barra "Filtrado por:" abaixo.
 *
 * props:
 * - icon: componente de ícone (Icon.X)
 * - label: rótulo fixo do pill (ex.: "Hierarquias")
 * - options: [{ value, label }]
 * - selected: string[]
 * - onChange: (string[]) => void
 */
export default function FilterDropdownPill({ icon: IconCmp, label, options, selected, onChange }) {
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

  const active = selected.length > 0
  const toggleOption = (value) => {
    if (selected.includes(value)) onChange(selected.filter((v) => v !== value))
    else onChange([...selected, value])
  }

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
        {IconCmp && <IconCmp width={15} height={15} className="shrink-0" />}
        {label}
        {active && (
          <span className="flex h-4 min-w-[16px] shrink-0 items-center justify-center rounded-full bg-brand px-1 text-[10px] font-semibold leading-none text-white">
            {selected.length}
          </span>
        )}
        <Icon.ChevronDown
          width={12}
          height={12}
          className={`shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="absolute left-0 top-[calc(100%+4px)] z-30 max-h-64 w-56 overflow-y-auto rounded-md border border-hairline bg-white p-1 shadow-lg">
          {options.map((o) => (
            <label
              key={o.value}
              className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-sm hover:bg-gray-50"
            >
              <input
                type="checkbox"
                checked={selected.includes(o.value)}
                onChange={() => toggleOption(o.value)}
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
  )
}
