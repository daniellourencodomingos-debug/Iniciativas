import { useMemo, useState } from 'react'
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
} from '../data/consumoMock.js'

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
  const { centros, centroById } = useApp()
  const [tab, setTab] = useState('consumo')
  const [selectedCentros, setSelectedCentros] = useState([])

  const centroOpts = useMemo(
    () => centros.map((c) => ({ value: c.id, label: c.nome })),
    [centros],
  )

  const kpi = useMemo(() => {
    const fator =
      selectedCentros.length === 0
        ? 1
        : selectedCentros.reduce((s, id) => s + (PESO_CONSUMO_POR_CENTRO[id] ?? 0), 0)
    const base = escalarKpi(Math.max(fator, 0.05))
    return { ...base, total: kpiTotal(base) }
  }, [selectedCentros])

  const filtroChips = selectedCentros.map((id) => ({
    key: id,
    label: `Centro de custo: ${(centroById(id)?.nome ?? id).toUpperCase()}`,
    onRemove: () => setSelectedCentros((s) => s.filter((v) => v !== id)),
  }))

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
                onClick={() => setTab(t.key)}
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
          />

          <ConsumoFiltroChips chips={filtroChips} onClearAll={() => setSelectedCentros([])} />

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
