import { Icon } from './icons.jsx'

/**
 * Stepper da plataforma ("Solicitação de Workspace"): etapas em formato de
 * seta/chevron, com vão fino entre os segmentos.
 * - Concluída / futura: fundo quase branco + contorno cinja fino; ✓ verde nas concluídas.
 * - Atual: fundo azul (#3468A4), texto branco, um pouco mais alta ("pop").
 *
 * O contorno é feito com DUAS camadas de clip-path (borda + preenchimento 1px
 * para dentro) — sem `drop-shadow`, para as diagonais não ficarem serrilhadas.
 * props: steps (string[]), current (índice 0-based)
 */

const N = 17 // profundidade do chevron
const GAP = 6 // vão branco entre segmentos
const R = 2 // leve arredondamento da ponta

const rightTip = [
  `calc(100% - ${N}px) 0%`,
  `calc(100% - ${R}px) calc(50% - ${R * 1.7}px)`,
  `100% calc(50% - ${R * 0.35}px)`,
  `100% calc(50% + ${R * 0.35}px)`,
  `calc(100% - ${R}px) calc(50% + ${R * 1.7}px)`,
  `calc(100% - ${N}px) 100%`,
]

const leftNotch = [
  `${R}px calc(50% + ${R * 1.7}px)`,
  `0% calc(50% + ${R * 0.35}px)`,
  `0% calc(50% - ${R * 0.35}px)`,
  `${R}px calc(50% - ${R * 1.7}px)`,
]

function clipFor(first, last) {
  if (first) return `polygon(0% 0%, ${rightTip.join(', ')}, 0% 100%)`
  if (last)
    return `polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, ${leftNotch.join(', ')})`
  return `polygon(0% 0%, ${rightTip.join(', ')}, 0% 100%, ${leftNotch.join(', ')})`
}

const BORDER_COLOR = '#D4D4D6'

export default function Stepper({ steps, current }) {
  return (
    <div className="overflow-x-auto py-1">
      <ol className="flex w-full min-w-max items-center pr-0.5">
        {steps.map((label, i) => {
          const done = i < current
          const active = i === current
          const first = i === 0
          const last = i === steps.length - 1
          const clip = clipFor(first, last)

          return (
            <li
              key={label}
              aria-current={active ? 'step' : undefined}
              className="relative flex flex-1"
              style={{
                height: active ? 46 : 38,
                marginLeft: first ? 0 : -(N - GAP),
              }}
            >
              {/* camada de contorno (só nas etapas não-ativas) */}
              {!active && (
                <span
                  aria-hidden
                  className="absolute inset-0"
                  style={{ clipPath: clip, background: BORDER_COLOR }}
                />
              )}
              {/* camada de preenchimento */}
              <span
                aria-hidden
                className="absolute"
                style={{
                  clipPath: clip,
                  background: active ? '#3468A4' : '#F7F7F8',
                  inset: active ? 0 : 1,
                }}
              />
              {/* conteúdo */}
              <span
                className={[
                  'relative z-[1] flex h-full flex-1 items-center justify-center gap-1.5 whitespace-nowrap px-4 text-[13px]',
                  active
                    ? 'font-semibold text-white'
                    : done
                      ? 'text-gray-600'
                      : 'text-gray-500',
                ].join(' ')}
                style={{ paddingLeft: first ? undefined : 16 + N }}
              >
                {done && (
                  <Icon.Check
                    width={14}
                    height={14}
                    className="shrink-0 text-green-600"
                  />
                )}
                {label}
              </span>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
