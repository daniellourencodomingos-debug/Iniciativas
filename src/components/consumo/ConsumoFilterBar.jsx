import { useState } from 'react'
import { Icon } from '../icons.jsx'
import FilterDropdownPill from './FilterDropdownPill.jsx'
import ConsumoContasPill from './ConsumoContasPill.jsx'
import {
  PERIODO_CONSUMO_PADRAO,
  RATEIO_OPCOES,
  HIERARQUIA_OPCOES,
  SERVICO_OPCOES,
} from '../../data/consumoMock.js'
import { PROVEDORES, CONTAS_FATURAMENTO, WORKSPACES, GERENTES } from '../../data/mock.js'

/**
 * Barra de filtros da aba Consumo — a peça que estamos evoluindo.
 *
 * Estado recolhido: só o pill "Período" + botão "Filtros" (funil, neutro).
 * Um clique no botão "Filtros" expande a barra inteira (rateio, Hierarquias,
 * Centros de custo, Gerente, Workspace, Serviço, Contas + exportar) — o
 * próprio botão "Filtros" continua visível, agora ativo/azul, e um novo
 * clique nele recolhe de volta. Fica expandido até o usuário clicar de
 * novo — não há auto-collapse.
 */
export default function ConsumoFilterBar({
  centroOpts,
  selectedCentros,
  onChangeCentros,
  chipsCount = 0,
  chipsAberto = true,
  onToggleChips,
}) {
  const [expanded, setExpanded] = useState(true)
  const toggle = () => setExpanded((e) => !e)

  const [rateio, setRateio] = useState([])
  // Sem seleção padrão — o usuário escolhe a hierarquia que quiser, a tela
  // não vem mais pré-filtrada.
  const [hierarquia, setHierarquia] = useState([])
  const [gerentes, setGerentes] = useState([])
  const [workspaces, setWorkspaces] = useState([])
  const [servicos, setServicos] = useState([])
  const [contas, setContas] = useState([])

  const gerenteOpts = GERENTES.map((g) => ({ value: g.id, label: g.nome }))
  const workspaceOpts = WORKSPACES.map((w) => ({ value: w, label: w }))

  const FiltrosToggle = () => (
    <button
      type="button"
      onClick={toggle}
      title={expanded ? 'Recolher filtros' : 'Expandir filtros'}
      className={[
        'flex h-9 items-center gap-1.5 whitespace-nowrap rounded-md border px-3 text-sm font-semibold transition',
        expanded
          ? 'border-brand text-brand'
          : 'border-hairline bg-white text-gray-700 hover:bg-gray-50',
      ].join(' ')}
    >
      <Icon.Filter width={15} height={15} />
      Filtros
      {expanded ? (
        <Icon.Collapse width={12} height={12} />
      ) : (
        <Icon.Expand width={12} height={12} />
      )}
    </button>
  )

  // Indicador do "Filtrado por" recolhido — não é mais um pill igual aos
  // outros: fica isolado na ponta direita da barra e com um estilo
  // preenchido (fundo azul sólido, não contorno) que o diferencia de
  // propósito — é um status, não um filtro que o usuário ainda vai abrir e
  // escolher opções. Some o botão "Filtros" recolhido ou expandido; some por
  // completo quando não há nada filtrado. Clicar reabre a caixa "Filtrado
  // por". Isso segue as heurísticas de Nielsen de visibilidade do status do
  // sistema (o usuário sempre sabe que há filtro ativo, mesmo com tudo
  // recolhido) e reconhecimento em vez de memorização (o destaque visual
  // chama atenção sem o usuário precisar procurar).
  const FiltradoPorIndicador = () =>
    chipsCount > 0 &&
    !chipsAberto && (
      <button
        type="button"
        onClick={onToggleChips}
        title="Expandir filtrado por"
        aria-label="Expandir filtrado por"
        className="flex h-9 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-md bg-brand px-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-dark"
      >
        <Icon.Filter width={14} height={14} />
        Filtrado por ({chipsCount})
        <Icon.Expand width={12} height={12} />
      </button>
    )

  // Canto direito da barra: botão de exportar + indicador do "Filtrado por"
  // (quando houver) andam sempre juntos, nessa ordem. Fica numa LINHA PRÓPRIA,
  // sempre — separado da linha dos pills de filtro — pra ter um padrão único
  // em qualquer estado: com poucos pills (tudo cabe numa linha só) ou com
  // muitos (os pills quebram em duas linhas), o canto direito nunca disputa
  // linha com sobras de pill (ex.: Serviço/Contas quebrados sozinhos), o que
  // antes criava um vão feio e uma leitura bagunçada só nesse cenário
  // específico. O exportar fica sempre visível, mesmo sem filtro ativo.
  const CantoDireito = () => (
    <div className="mt-2 flex items-center justify-end gap-2">
      <button
        type="button"
        title="Exportar"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-600"
      >
        <Icon.Download width={17} height={17} />
      </button>
      <FiltradoPorIndicador />
    </div>
  )

  if (!expanded) {
    return (
      <div className="mb-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="flex h-9 items-center whitespace-nowrap rounded-md border border-brand px-3 text-sm font-semibold text-brand"
          >
            Período: {PERIODO_CONSUMO_PADRAO.replace(' - ', ' – ')}
          </button>
          <FiltrosToggle />
        </div>
        <CantoDireito />
      </div>
    )
  }

  return (
    <div className="mb-4">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          title="Período"
          className="flex h-9 items-center gap-1.5 whitespace-nowrap rounded-md border border-brand px-3 text-sm font-semibold text-brand"
        >
          <Icon.Calendar width={15} height={15} />
          {PERIODO_CONSUMO_PADRAO}
          <Icon.ChevronDown width={12} height={12} />
        </button>

        <FiltrosToggle />

        <FilterDropdownPill
          icon={Icon.PieClock}
          label="rateio"
          options={RATEIO_OPCOES}
          selected={rateio}
          onChange={setRateio}
        />
        <FilterDropdownPill
          icon={Icon.Hierarchy}
          label="Hierarquias"
          options={HIERARQUIA_OPCOES}
          selected={hierarquia}
          onChange={setHierarquia}
        />
        <FilterDropdownPill
          icon={Icon.Building}
          label="Centros de custo"
          options={centroOpts}
          selected={selectedCentros}
          onChange={onChangeCentros}
        />
        <FilterDropdownPill
          icon={Icon.UserSingle}
          label="Gerente"
          options={gerenteOpts}
          selected={gerentes}
          onChange={setGerentes}
        />
        <FilterDropdownPill
          icon={Icon.Window}
          label="Workspace"
          options={workspaceOpts}
          selected={workspaces}
          onChange={setWorkspaces}
        />
        <FilterDropdownPill
          label="Serviço"
          options={SERVICO_OPCOES}
          selected={servicos}
          onChange={setServicos}
        />

        <ConsumoContasPill
          providers={PROVEDORES}
          contasPorProvedor={CONTAS_FATURAMENTO}
          value={contas}
          onChange={setContas}
        />
      </div>

      <CantoDireito />
    </div>
  )
}
