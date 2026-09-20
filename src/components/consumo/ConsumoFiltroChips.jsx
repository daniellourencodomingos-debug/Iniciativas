import { useState } from 'react'
import { Icon } from '../icons.jsx'

/**
 * Caixa "Filtrado por:" da aba Consumo — variante com borda azul e ícone de
 * funil, usada só nesta tela (a FilterChipsBar "solta", sem borda, continua
 * sendo o padrão em Iniciativas). Some quando não há nenhum filtro ativo.
 *
 * O botão de recolher (círculo + chevron que gira) segue o mesmo padrão de
 * ícone de expandir/recolher já usado em "Orçamento por provedores"
 * (IniciativaForm.jsx) — botão redondo, hover suave, chevron rotacionando.
 */
export default function ConsumoFiltroChips({ chips, onClearAll }) {
  const [expandido, setExpandido] = useState(true)

  if (chips.length === 0) return null

  return (
    <div className="mb-4 rounded-md border border-brand bg-white px-4 py-3">
      <div className="flex flex-wrap items-center gap-2">
        <Icon.Filter width={14} height={14} className="shrink-0 text-brand" />
        <span className="text-sm font-semibold text-gray-700">Filtrado por:</span>
        <button
          type="button"
          onClick={onClearAll}
          className="ml-auto flex items-center gap-1 text-sm font-semibold text-brand hover:text-brand-dark"
        >
          Limpar tudo
          <Icon.X width={12} height={12} strokeWidth={2.5} />
        </button>
        <button
          type="button"
          aria-expanded={expandido}
          aria-label={expandido ? 'Recolher filtrado por' : 'Expandir filtrado por'}
          title={expandido ? 'Recolher' : 'Expandir'}
          onClick={() => setExpandido((v) => !v)}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-gray-600 transition hover:bg-black/5"
        >
          <Icon.ChevronDown
            width={20}
            height={20}
            className={`transition-transform ${expandido ? 'rotate-180' : ''}`}
          />
        </button>
      </div>
      {expandido && (
        <div className="mt-2 flex flex-wrap items-center gap-2">
          {chips.map((chip) => (
            <span
              key={chip.key}
              className="flex items-center gap-1.5 rounded-full border border-hairline bg-white px-3 py-1 text-xs font-medium text-gray-700"
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
        </div>
      )}
    </div>
  )
}
