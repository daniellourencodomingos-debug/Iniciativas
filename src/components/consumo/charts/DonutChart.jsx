/**
 * Donut chart via conic-gradient (CSS puro, sem lib) + rótulos de % ao
 * redor do anel. props.segments: [{ label, color, valor }] (valor em %).
 */
export default function DonutChart({ segments, size = 210, thickness = 38 }) {
  let acc = 0
  const stops = segments
    .map((s) => {
      const start = acc
      acc += s.valor
      return `${s.color} ${start}% ${acc}%`
    })
    .join(', ')

  const cx = size / 2
  const cy = size / 2
  const labelR = size / 2 - thickness / 2

  let cursor = 0
  const labels = segments.map((s) => {
    const mid = cursor + s.valor / 2
    cursor += s.valor
    const angle = (mid / 100) * 2 * Math.PI - Math.PI / 2
    const x = cx + labelR * Math.cos(angle)
    const y = cy + labelR * Math.sin(angle)
    return { key: s.label, x, y, valor: s.valor }
  })

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <div
        className="absolute inset-0 rounded-full"
        style={{ background: `conic-gradient(${stops})` }}
      />
      <div
        className="absolute rounded-full bg-white"
        style={{
          top: thickness / 2,
          left: thickness / 2,
          right: thickness / 2,
          bottom: thickness / 2,
        }}
      />
      {labels.map((l) =>
        l.valor >= 3.2 ? (
          <span
            key={l.key}
            className="absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-[10px] font-semibold text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.55)]"
            style={{ left: l.x, top: l.y }}
          >
            {l.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%
          </span>
        ) : null,
      )}
    </div>
  )
}
