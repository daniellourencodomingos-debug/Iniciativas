import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Icon } from '../components/icons.jsx'
import { useApp } from '../store/AppContext.jsx'
import ConsumoFilterBar from '../components/consumo/ConsumoFilterBar.jsx'
import ConsumoFiltroChips from '../components/consumo/ConsumoFiltroChips.jsx'
import KpiCards from '../components/consumo/KpiCards.jsx'
import ChartPanel from '../components/consumo/charts/ChartPanel.jsx'
import AnomaliasBar from '../components/consumo/AnomaliasBar.jsx'
import {
  DATAS_PROVEDORES,
  SERIE_PROVEDORES,
  DATAS_DETALHE,
  painelWorkspace,
  painelServico,
  painelSku,
  ANOMALIAS,
  PESO_CONSUMO_POR_CENTRO,
  escalarKpi,
  kpiTotal,
  RATEIO_OPCOES,
  HIERARQUIA_OPCOES,
  SERVICO_OPCOES,
} from '../data/consumoMock.js'
import { GERENTES } from '../data/mock.js'

const TABS = [
  { key: 'consumo', label: 'Consumo', icon: Icon.Wallet },
  { key: 'orcamento-vs-consumo', label: 'Orçamento vs Consumo', icon: Icon.Chart },
  { key: 'ranking', label: 'Ranking dos ofensores', icon: Icon.Ranking },
]

function EmptyTab() {
  return (
    <div className="flex flex-col items-center justify-center rounded-card border border-dashed border-hairline bg-white py-20 text-center">
      <Icon.Layers width={40} height={40} className="text-gray-300" />
      <p className="mt-3 text-sm text-gray-400">
        Conteúdo não incluído neste protótipo — trabalhando por enquanto só na aba Consumo.
      </p>
    </div>
  )
}

export default function Orcamento() {
  const { centros, centroById, iniciativas } = useApp()
  const [searchParams, setSearchParams] = useSearchParams()
  // A aba ativa vem da URL (?tab=...), não de um state próprio — assim,
  // tanto os links do menu lateral quanto os cliques aqui na página
  // (que só reescrevem a querystring, sem remontar o componente) mantêm
  // a tela sempre em sincronia com o link acessado.
  const tab = TABS.some((t) => t.key === searchParams.get('tab'))
    ? searchParams.get('tab')
    : 'consumo'
  const [selectedCentros, setSelectedCentros] = useState([])
  const [selectedIniciativas, setSelectedIniciativas] = useState([])
  const [rateio, setRateio] = useState([])
  // Sem seleção padrão — o usuário escolhe a hierarquia que quiser, a tela
  // não vem mais pré-filtrada.
  const [hierarquia, setHierarquia] = useState([])
  const [gerentes, setGerentes] = useState([])
  const [workspaces, setWorkspaces] = useState([])
  const [servicos, setServicos] = useState([])
  const [contas, setContas] = useState([])
  // Estado de aberto/recolhido da caixa "Filtrado por:" — mora aqui (não
  // dentro de ConsumoFiltroChips) porque, recolhido, o indicador some da
  // caixa e reaparece como um pill "Filtrado por (N)" dentro da barra de
  // filtros (ConsumoFilterBar), na mesma linha do botão "Filtros".
  const [filtradoPorAberto, setFiltradoPorAberto] = useState(true)

  const trocarTab = (key) => {
    setSearchParams(key === 'consumo' ? {} : { tab: key })
  }

  const centroOpts = useMemo(
    () => centros.map((c) => ({ value: c.id, label: c.nome })),
    [centros],
  )

  const iniciativaOpts = useMemo(
    () => iniciativas.map((i) => ({ value: i.id, label: i.slug })),
    [iniciativas],
  )

  const kpi = useMemo(() => {
    const fator =
      selectedCentros.length === 0
        ? 1
        : selectedCentros.reduce((s, id) => s + (PESO_CONSUMO_POR_CENTRO[id] ?? 0), 0)
    const base = escalarKpi(Math.max(fator, 0.05))
    return { ...base, total: kpiTotal(base) }
  }, [selectedCentros])

  const iniciativaById = (id) => iniciativas.find((i) => i.id === id)
  const rateioLabel = (v) => RATEIO_OPCOES.find((o) => o.value === v)?.label ?? v
  const hierarquiaLabel = (v) => HIERARQUIA_OPCOES.find((o) => o.value === v)?.label ?? v
  const servicoLabel = (v) => SERVICO_OPCOES.find((o) => o.value === v)?.label ?? v
  const gerenteNome = (id) => GERENTES.find((g) => g.id === id)?.nome ?? id

  // "Filtrado por:" reflete TODO filtro ativo da barra, não só Centro de
  // custo/Iniciativa — por isso o estado de cada pill mora aqui (não dentro
  // de ConsumoFilterBar), controlado, pra dar pra remover qualquer um deles
  // por aqui também.
  const filtroChips = [
    ...selectedCentros.map((id) => ({
      key: `centro-${id}`,
      label: `Centro de custo: ${(centroById(id)?.nome ?? id).toUpperCase()}`,
      onRemove: () => setSelectedCentros((s) => s.filter((v) => v !== id)),
    })),
    ...selectedIniciativas.map((id) => ({
      key: `iniciativa-${id}`,
      label: `Iniciativa: ${iniciativaById(id)?.slug ?? id}`,
      onRemove: () => setSelectedIniciativas((s) => s.filter((v) => v !== id)),
    })),
    ...rateio.map((v) => ({
      key: `rateio-${v}`,
      label: rateioLabel(v),
      onRemove: () => setRateio((s) => s.filter((x) => x !== v)),
    })),
    ...hierarquia.map((v) => ({
      key: `hierarquia-${v}`,
      label: hierarquiaLabel(v),
      onRemove: () => setHierarquia((s) => s.filter((x) => x !== v)),
    })),
    ...gerentes.map((id) => ({
      key: `gerente-${id}`,
      label: `Gerente: ${gerenteNome(id)}`,
      onRemove: () => setGerentes((s) => s.filter((v) => v !== id)),
    })),
    ...workspaces.map((w) => ({
      key: `workspace-${w}`,
      label: `Workspace: ${w}`,
      onRemove: () => setWorkspaces((s) => s.filter((v) => v !== w)),
    })),
    ...servicos.map((v) => ({
      key: `servico-${v}`,
      label: `Serviço: ${servicoLabel(v)}`,
      onRemove: () => setServicos((s) => s.filter((x) => x !== v)),
    })),
    ...contas.map((id) => {
      const [provedor, conta] = id.split('::')
      return {
        key: `conta-${id}`,
        label: `Conta: ${conta} (${provedor})`,
        onRemove: () => setContas((s) => s.filter((v) => v !== id)),
      }
    }),
  ]

  return (
    <>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3 border-b border-hairline">
        <nav className="flex gap-5">
          {TABS.map((t) => {
            const active = t.key === tab
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => trocarTab(t.key)}
                className={[
                  '-mb-px flex items-center gap-1.5 border-b-2 px-1 pb-3 text-sm font-semibold transition',
                  active
                    ? 'border-brand text-brand'
                    : 'border-transparent text-gray-500 hover:text-gray-700',
                ].join(' ')}
              >
                <t.icon width={16} height={16} />
                {t.label}
              </button>
            )
          })}
        </nav>

        <div className="pb-2 text-right">
          <p className="flex items-center justify-end gap-1 text-xs text-gray-500">
            Exibição por <span className="font-semibold text-brand">Data de uso</span>
            <Icon.Info width={13} height={13} className="text-gray-400" />
          </p>
          <p className="text-[11px] text-gray-400">Última atualização: 8h de hoje</p>
        </div>
      </div>

      {tab !== 'consumo' ? (
        <EmptyTab />
      ) : (
        <>
          <ConsumoFilterBar
            centroOpts={centroOpts}
            selectedCentros={selectedCentros}
            onChangeCentros={setSelectedCentros}
            iniciativaOpts={iniciativaOpts}
            selectedIniciativas={selectedIniciativas}
            onChangeIniciativas={setSelectedIniciativas}
            rateio={rateio}
            onChangeRateio={setRateio}
            hierarquia={hierarquia}
            onChangeHierarquia={setHierarquia}
            gerentes={gerentes}
            onChangeGerentes={setGerentes}
            workspaces={workspaces}
            onChangeWorkspaces={setWorkspaces}
            servicos={servicos}
            onChangeServicos={setServicos}
            contas={contas}
            onChangeContas={setContas}
            chipsCount={filtroChips.length}
            chipsAberto={filtradoPorAberto}
            onToggleChips={() => setFiltradoPorAberto((v) => !v)}
          />

          <ConsumoFiltroChips
            chips={filtroChips}
            onClearAll={() => {
              setSelectedCentros([])
              setSelectedIniciativas([])
              setRateio([])
              setHierarquia([])
              setGerentes([])
              setWorkspaces([])
              setServicos([])
              setContas([])
            }}
            aberto={filtradoPorAberto}
            onToggle={() => setFiltradoPorAberto((v) => !v)}
          />

          <KpiCards kpi={kpi} />

          <ChartPanel
            kicker="Comparativo por"
            titulo="Provedores"
            datas={DATAS_PROVEDORES}
            series={SERIE_PROVEDORES}
          />

          <ChartPanel
            kicker="Consumo por"
            titulo={painelWorkspace.titulo}
            datas={DATAS_DETALHE}
            series={painelWorkspace.series}
            donut={painelWorkspace.donut}
          />

          <ChartPanel
            kicker="Consumo por"
            titulo={painelServico.titulo}
            datas={DATAS_DETALHE}
            series={painelServico.series}
            donut={painelServico.donut}
          />

          <ChartPanel
            kicker="Consumo por"
            titulo={painelSku.titulo}
            datas={DATAS_DETALHE}
            series={painelSku.series}
            donut={painelSku.donut}
          />

          <AnomaliasBar itens={ANOMALIAS} />
        </>
      )}
    </>
  )
}
