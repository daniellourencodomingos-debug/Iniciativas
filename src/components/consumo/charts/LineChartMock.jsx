import { smoothPath, pontosParaSvg } from './chartMath.js'

const W = 640
const H = 190
const PAD_L = 40
const PAD_R = 28
const PAD_TOP = 10
const PAD_BOTTOM = 22
const Y_LABELS = ['0', '50 mil', '100 mil', '150 mil', '200 mil', '250 mil', '300 mil', '350 mil']

/**
 * Gráfico de linha "mock": SVG desenhado à mão a partir de séries de valores
 * relativos (0-100), sem depender de nenhuma lib de charts — o objetivo é
 * reproduzir o formato visual do gráfico real (grade, eixo R$, picos), não
 * plotar dados verdadeiros.
 */
export default function LineChartMock({ datas, series }) {
  const innerH = H - PAD_TOP - PAD_BOTTOM
  const rows = 4 // linhas de grade horizontais (além do eixo 0)

  return (
    <div className="w-full">
      <p className="mb-1 text-[11px] text-gray-400">R$</p>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" preserveAspectRatio="none">
        {/* grade horizontal */}
        {Array.from({ length: rows + 1 }).map((_, i) => {
          const y = PAD_TOP + (innerH / rows) * i
          return (
            <line
              key={i}
              x1={PAD_L}
              x2={W - PAD_R}
              y1={y}
              y2={y}
              stroke="#EEF0F2"
              strokeWidth={1}
            />
          )
        })}

        {/* rótulos eixo Y (usa só uma amostra pra não poluir) */}
        {[0, 2, 4, 6].map((i) => {
          const y = PAD_TOP + innerH - (innerH / (Y_LABELS.length - 1)) * i
          return (
            <text key={i} x={2} y={y + 3} fontSize="9" fill="#9CA3AF">
              {Y_LABELS[i]}
            </text>
          )
        })}

        {/* séries */}
        {series.map((s) => {
          const pts = pontosParaSvg(s.pontos, {
            width: W,
            height: H,
            padLeft: PAD_L,
            padRight: PAD_R,
            padTop: PAD_TOP,
            padBottom: PAD_BOTTOM,
            max: 100,
          })
          return (
            <path
              key={s.key}
              d={smoothPath(pts)}
              fill="none"
              stroke={s.color}
              strokeWidth={1.6}
              strokeLinecap="round"
            />
          )
        })}

        {/* eixo X */}
        <line x1={PAD_L} x2={W - PAD_R} y1={H - PAD_BOTTOM} y2={H - PAD_BOTTOM} stroke="#E0E0E0" strokeWidth={1} />
        {datas.map((d, i) => {
          const x = PAD_L + (datas.length === 1 ? 0 : (i / (datas.length - 1)) * (W - PAD_L - PAD_R))
          const anchor = i === 0 ? 'start' : i === datas.length - 1 ? 'end' : 'middle'
          return (
            <text key={d + i} x={x} y={H - 6} fontSize="9" fill="#9CA3AF" textAnchor={anchor}>
              {d}
            </text>
          )
        })}
      </svg>
    </div>
  )
}
