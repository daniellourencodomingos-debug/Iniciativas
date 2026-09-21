import { Icon } from '../icons.jsx'

/**
 * Caixa "Filtrado por:" da aba Consumo — variante com borda azul e ícone de
 * funil, usada só nesta tela (a FilterChipsBar "solta", sem borda, continua
 * sendo o padrão em Iniciativas). Some quando não há nenhum filtro ativo.
 *
 * O estado de recolhido/expandido é controlado pelo componente pai
 * (Orcamento.jsx) — quando recolhido, esta caixa não renderiza nada; em vez
 * disso, um indicador "Filtrado por (N)" aparece na mesma linha do botão
 * "Filtros" (dentro de ConsumoFilterBar), com uma opção clara pra reabrir.
 * Isso segue a heurística de Nielsen de visibilidade do status do sistema
 * (o usuário sempre sabe que há filtros ativos, mesmo com a caixa fechada)
 * e controle do usuário (uma ação clara e óbvia pra reverter).
 *
 * O botão de recolher (círculo + ícone de cantos) usa o mesmo ícone de
 * expandir/recolher do botão "Filtros" e do indicador "Filtrado por" (na
 * ConsumoFilterBar) — padrão único pra essa ação em toda a barra, sem
 * misturar com a seta de dropdown dos outros pills. Essa caixa só renderiza
 * quando está aberta, então o botão aqui está sempre no estado "recolher".
 * Fica logo depois do rótulo "Filtrado por:", separado do "Limpar tudo"
 * (que continua fixo à direita) pra não ficarem os dois colados.
 */
export default function ConsumoFiltroChips({ chips, onClearAll, aberto, onToggle }) {
  if (chips.length === 0 || !aberto) return null

  return (
    <div className="mb-4 rounded-md border border-brand bg-white px-4 py-3">
      <div className="flex flex-wrap items-center gap-2">
        <Icon.Filter width={14} height={14} className="shrink-0 text-brand" />
        <span className="text-sm font-semibold text-gray-700">Filtrado por:</span>
        <button
          type="button"
          aria-expanded={aberto}
          aria-label="Recolher filtrado por"
          title="Recolher"
          onClick={onToggle}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-gray-600 transition hover:bg-black/5"
        >
          <Icon.Collapse width={18} height={18} />
        </button>
        <button
          type="button"
          onClick={onClearAll}
          className="ml-auto flex items-center gap-1 text-sm font-semibold text-brand hover:text-brand-dark"
        >
          Limpar tudo
          <Icon.X width={12} height={12} strokeWidth={2.5} />
        </button>
      </div>
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
    </div>
  )
}
