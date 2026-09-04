import { Icon } from './icons.jsx'

/**
 * Barra "Filtrado por:" exibida acima da tabela quando há filtros ativos.
 * chips: [{ key, label, onRemove }]
 */
export default function FilterChipsBar({ chips, onClearAll }) {
  if (chips.length === 0) return null

  return (
    <div className="mb-4 flex flex-wrap items-center gap-2 text-sm">
      <span className="font-medium text-gray-500">Filtrado por:</span>
      {chips.map((chip) => (
        <span
          key={chip.key}
          className="flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700"
        >
          {chip.label}
          <button
            type="button"
            onClick={chip.onRemove}
            className="rounded-full text-gray-400 hover:text-gray-700"
            title="Remover filtro"
          >
            <Icon.X width={11} height={11} strokeWidth={2.5} />
          </button>
        </span>
      ))}
      <button
        type="button"
        onClick={onClearAll}
        className="flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold text-brand hover:bg-brand/10"
      >
        Limpar tudo
        <Icon.X width={11} height={11} strokeWidth={2.5} />
      </button>
    </div>
  )
}
