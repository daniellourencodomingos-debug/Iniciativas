import { smoothPath, pontosParaSvg } from './chartMath.js'

const W = 640
const H = 34

/**
 * Faixa de seleção de período abaixo do gráfico de linha — visual apenas
 * (não é arrastável neste protótipo). Desenha a mesma forma da série
 * principal em miniatura, com uma janela de seleção destacada.
 */
export default function BrushMock({ valores, selecaoInicio = 0.08, selecaoFim = 0.62 }) {
  const pts = pontosParaSvg(valores, { width: W, height: H, padTop: 4, padBottom: 4, max: 100 })
  const areaPath = `${smoothPath(pts)} L${W},${H} L0,${H} Z`
  const x1 = selecaoInicio * W
  const x2 = selecaoFim * W

  return (
    <div className="mt-1 overflow-hidden rounded-md border border-hairline bg-gray-50 px-0.5 py-1">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" preserveAspectRatio="none">
        <path d={areaPath} fill="#BFD6EE" opacity={0.6} stroke="none" />
        <rect x={x1} y={0} width={x2 - x1} height={H} fill="#3468A4" opacity={0.22} />
        <rect x={x1 - 1.5} y={0} width={3} height={H} rx={1.5} fill="#3468A4" />
        <rect x={x2 - 1.5} y={0} width={3} height={H} rx={1.5} fill="#3468A4" />
      </svg>
    </div>
  )
}
