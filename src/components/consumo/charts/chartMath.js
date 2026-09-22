/** Converte uma lista de pontos {x,y} num path SVG suavizado (curvas simples,
 * ponto de controle na metade do caminho entre vizinhos — leve o bastante
 * para não precisar de nenhuma lib de gráficos). */
export function smoothPath(points) {
  if (points.length === 0) return ''
  if (points.length === 1) return `M${points[0].x},${points[0].y}`
  let d = `M${points[0].x},${points[0].y}`
  for (let i = 0; i < points.length - 1; i += 1) {
    const p0 = points[i]
    const p1 = points[i + 1]
    const midX = (p0.x + p1.x) / 2
    d += ` C${midX},${p0.y} ${midX},${p1.y} ${p1.x},${p1.y}`
  }
  return d
}

/** Mapeia uma série de valores relativos (0-100) para pontos SVG dentro da
 * área de plotagem [padding, width-padding] x [padding, height-padding]. */
export function pontosParaSvg(valores, { width, height, padLeft = 0, padRight = 0, padTop = 8, padBottom = 8, max = 100 }) {
  const innerW = width - padLeft - padRight
  const innerH = height - padTop - padBottom
  const n = valores.length
  return valores.map((v, i) => ({
    x: padLeft + (n === 1 ? 0 : (i / (n - 1)) * innerW),
    y: padTop + innerH - (Math.min(v, max) / max) * innerH,
  }))
}
