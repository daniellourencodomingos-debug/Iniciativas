/**
 * Linha de cards de KPI do topo da aba Consumo. O valor é exibido com a
 * parte decimal menor (igual ao produto: "1.847.622" + ",30" reduzido) e a
 * unidade "R$" abaixo, em azul.
 */
const CARDS = [
  { key: 'recursos', label: 'Consumo de recursos' },
  { key: 'suporte', label: 'Suporte' },
  { key: 'compromissos', label: 'Compromissos de uso' },
  { key: 'creditos', label: 'Créditos' },
  { key: 'total', label: 'Consumo total' },
]

function splitValor(n) {
  const [intPart, decPart] = (Number(n) || 0).toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).split(',')
  return { intPart, decPart }
}

export default function KpiCards({ kpi }) {
  return (
    <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {CARDS.map(({ key, label }) => {
        const { intPart, decPart } = splitValor(kpi[key])
        return (
          <div
            key={key}
            className="rounded-card border border-hairline bg-white px-4 py-3"
          >
            <p className="text-xs font-medium text-gray-500">{label}</p>
            <p className="mt-1 text-lg font-bold text-gray-900">
              {intPart}
              <span className="text-sm font-semibold text-gray-400">,{decPart}</span>
            </p>
            <p className="text-xs font-semibold text-brand">R$</p>
          </div>
        )
      })}
    </div>
  )
}
