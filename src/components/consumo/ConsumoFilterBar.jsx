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
export default function ConsumoFilterBar({ centroOpts, selectedCentros, onChangeCentros }) {
  const [expanded, setExpanded] = useState(true)
  const toggle = () => setExpanded((e) => !e)

  const [rateio, setRateio] = useState([])
  const [hierarquia, setHierarquia] = useState(['departamento'])
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
      <Icon.ChevronDown
        width={12}
        height={12}
        className={`transition-transform ${expanded ? 'rotate-180' : ''}`}
      />
    </button>
  )

  if (!expanded) {
    return (
      <div className="mb-4 flex items-center gap-2">
        <button
          type="button"
          className="flex h-9 items-center whitespace-nowrap rounded-md border border-brand px-3 text-sm font-semibold text-brand"
        >
          Período: {PERIODO_CONSUMO_PADRAO.replace(' - ', ' – ')}
        </button>
        <FiltrosToggle />
      </div>
    )
  }

  return (
    <div className="mb-4 flex flex-wrap items-center gap-2">
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

      {/* Exportar + Contas ficam agrupados num wrapper só, com o ml-auto
          aqui em vez de no botão sozinho — assim, quando a barra dá wrap
          em telas mais estreitas, os dois sempre quebram de linha juntos
          e colados um no outro, em vez do botão ficar flutuando sozinho
          longe da pill de Contas. */}
      <div className="ml-auto flex shrink-0 items-center gap-2">
        <button
          type="button"
          title="Exportar"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-600"
        >
          <Icon.Download width={17} height={17} />
        </button>

        <ConsumoContasPill
          providers={PROVEDORES}
          contasPorProvedor={CONTAS_FATURAMENTO}
          value={contas}
          onChange={setContas}
        />
      </div>
    </div>
  )
}
