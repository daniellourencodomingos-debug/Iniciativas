const COLORS = ['#3468A4', '#0F7B6C', '#8A5A00', '#7A3E9D', '#B23B3B', '#2B6CB0']

export default function Avatar({ name = '?', size = 32 }) {
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join('')
  const color = COLORS[(name.charCodeAt(0) || 0) % COLORS.length]
  return (
    <span
      className="inline-flex items-center justify-center rounded-full font-semibold text-white shrink-0"
      style={{ width: size, height: size, background: color, fontSize: size * 0.4 }}
    >
      {initials || '?'}
    </span>
  )
}
