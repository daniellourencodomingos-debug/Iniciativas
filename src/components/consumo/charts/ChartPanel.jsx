import LineChartMock from './LineChartMock.jsx'
import BrushMock from './BrushMock.jsx'
import DonutChart from './DonutChart.jsx'

/**
 * Card de gráfico da aba Consumo. Dois formatos, iguais ao produto:
 * - sem donut (painel "Provedores"): gráfico de linha full width + legenda
 *   de bolinhas centralizada.
 * - com donut (Workspace / Serviço / SKU): linha à esquerda + donut à
 *   direita, com a legenda detalhada (nomes truncados) abaixo dos dois.
 */
export default function ChartPanel({ kicker, titulo, datas, series, donut, dominante }) {
  return (
    <div className="mb-4 rounded-card border border-hairline bg-white p-5">
      <p className="text-xs font-semibold text-brand">{kicker}</p>
      <p className="text-sm font-bold text-gray-900">{titulo}</p>

      <div className={`mt-3 flex flex-col gap-4 ${donut ? 'sm:flex-row sm:items-center' : ''}`}>
        <div className="min-w-0 flex-1">
          <LineChartMock datas={datas} series={series} />
          <BrushMock valores={(dominante ?? series[0]).pontos} />
        </div>
        {donut && <DonutChart segments={donut} />}
      </div>

      {donut ? (
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-hairline pt-3">
          {donut.map((d) => (
            <span
              key={d.label}
              title={d.label}
              className="flex max-w-[140px] items-center gap-1.5 text-xs text-gray-600"
            >
              <span
                className="h-2 w-2 shrink-0 rounded-full"
                style={{ backgroundColor: d.color }}
              />
              <span className="truncate">{d.label}</span>
            </span>
          ))}
        </div>
      ) : (
        <div className="mt-3 flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5 border-t border-hairline pt-3">
          {series.map((s) => (
            <span key={s.key} className="flex items-center gap-1.5 text-xs text-gray-600">
              <span
                className="h-2 w-2 shrink-0 rounded-full"
                style={{ backgroundColor: s.color }}
              />
              {s.label}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
