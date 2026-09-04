import { Icon } from './icons.jsx'

/**
 * Stepper da plataforma: UMA barra contínua, sem espaço entre as etapas.
 * Cada segmento tem formato de seta/chevron (borda reta à esquerda encaixando
 * no segmento anterior, ponta em ângulo saindo pela direita) — uma trilha de
 * setas apontando para a direita, com as pontas ARREDONDADAS (não pontiagudas).
 *
 * Fiel ao componente Stepper do design system (Figma), com três estados:
 * - concluída → fundo #F5F5F5, texto #616161, ícone de check verde antes do label
 * - atual     → fundo azul #3468A4 (brand), texto branco
 * - futura    → fundo #F5F5F5, texto #9E9E9E (desabilitado), sem ícone
 *
 * props: steps (string[]), current (índice 0-based)
 */

const N = 15 // profundidade do chevron
const RC = 5 // raio (bevel) das quinas externas da barra

// ponta arredondada (aproximação de arco com raio ~6px em vez de vértice reto)
const TIP_RIGHT = `
  calc(100% - 3.2px) calc(50% - 3.84px),
  calc(100% - 2.17px) calc(50% - 2.05px),
  calc(100% - 1.81px) 50%,
  calc(100% - 2.17px) calc(50% + 2.05px),
  calc(100% - 3.2px) calc(50% + 3.84px)`

const NOTCH_LEFT = `
  3.2px calc(50% + 3.84px),
  2.17px calc(50% + 2.05px),
  1.81px 50%,
  2.17px calc(50% - 2.05px),
  3.2px calc(50% - 3.84px)`

// primeiro segmento: canto sup-esq / inf-esq arredondados; ponta arredondada à direita
const clipFirst = `polygon(
  ${RC}px 0%,
  calc(100% - ${N}px) 0%,
  ${TIP_RIGHT},
  calc(100% - ${N}px) 100%,
  ${RC}px 100%,
  0% calc(100% - ${RC}px),
  0% ${RC}px
)`

// segmento do meio / último: encaixe arredondado à esquerda; ponta arredondada à direita
const clipMiddle = `polygon(
  0% 0%,
  calc(100% - ${N}px) 0%,
  ${TIP_RIGHT},
  calc(100% - ${N}px) 100%,
  0% 100%,
  ${NOTCH_LEFT}
)`

const clipLast = clipMiddle

export default function Stepper({ steps, current }) {
  return (
    <div className="overflow-x-auto py-1">
      <ol className="flex w-full min-w-max">
        {steps.map((label, i) => {
          const done = i < current
          const active = i === current
          const first = i === 0
          const last = i === steps.length - 1
          const clip = first ? clipFirst : last ? clipLast : clipMiddle

          return (
            <li
              key={label}
              aria-current={active ? 'step' : undefined}
              className={[
                'flex flex-1 items-center justify-center gap-1.5 whitespace-nowrap px-5 py-2.5 text-[13px] font-medium tracking-[0.2px]',
                active ? 'text-white' : done ? 'text-[#616161]' : 'text-[#9E9E9E]',
              ].join(' ')}
              style={{
                position: 'relative',
                background: active ? '#3468A4' : '#F5F5F5',
                clipPath: clip,
                marginLeft: first ? 0 : -N,
                paddingLeft: first ? undefined : 20 + N,
                zIndex: active ? 2 : 1,
              }}
            >
              {done && (
                <Icon.Check
                  width={14}
                  height={14}
                  strokeWidth={2.5}
                  style={{ color: '#2E7D32', flexShrink: 0 }}
                />
              )}
              {label}
            </li>
          )
        })}
      </ol>
    </div>
  )
}
