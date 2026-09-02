/**
 * Stepper da plataforma: UMA barra contínua, sem espaço entre as etapas.
 * Cada segmento tem formato de seta/chevron (borda reta à esquerda encaixando
 * no segmento anterior, ponta em ângulo saindo pela direita) — uma trilha de
 * setas apontando para a direita. As pontas do primeiro e do último segmento
 * são levemente arredondadas.
 *
 * Dois estados apenas:
 * - atual   → fundo azul #3468A4, texto branco em negrito
 * - qualquer outra (passada ou futura) → fundo cinza #E8E8E8, texto cinza escuro
 *
 * props: steps (string[]), current (índice 0-based)
 */

const N = 15 // profundidade do chevron
const RC = 5 // raio (bevel) das quinas externas da barra

// primeiro segmento: canto sup-esq / inf-esq levemente arredondados; ponta à direita
const clipFirst = `polygon(
  ${RC}px 0%,
  calc(100% - ${N}px) 0%,
  100% 50%,
  calc(100% - ${N}px) 100%,
  ${RC}px 100%,
  0% calc(100% - ${RC}px),
  0% ${RC}px
)`

// último segmento: encaixe à esquerda; ponta à direita levemente arredondada
const clipLast = `polygon(
  0% 0%,
  calc(100% - ${N}px) 0%,
  calc(100% - 3px) calc(50% - 4px),
  100% calc(50% - 1px),
  100% calc(50% + 1px),
  calc(100% - 3px) calc(50% + 4px),
  calc(100% - ${N}px) 100%,
  0% 100%,
  ${N}px 50%
)`

// segmento do meio: encaixe à esquerda; ponta reta à direita
const clipMiddle = `polygon(
  0% 0%,
  calc(100% - ${N}px) 0%,
  100% 50%,
  calc(100% - ${N}px) 100%,
  0% 100%,
  ${N}px 50%
)`

export default function Stepper({ steps, current }) {
  return (
    <div className="overflow-x-auto py-1">
      <ol className="flex w-full min-w-max">
        {steps.map((label, i) => {
          const active = i === current
          const first = i === 0
          const last = i === steps.length - 1
          const clip = first ? clipFirst : last ? clipLast : clipMiddle

          return (
            <li
              key={label}
              aria-current={active ? 'step' : undefined}
              className={[
                'flex flex-1 items-center justify-center whitespace-nowrap px-5 py-2.5 text-[13px]',
                active ? 'font-bold text-white' : 'text-[#3D3D3D]',
              ].join(' ')}
              style={{
                position: 'relative',
                background: active ? '#3468A4' : '#E8E8E8',
                clipPath: clip,
                marginLeft: first ? 0 : -N,
                paddingLeft: first ? undefined : 20 + N,
                zIndex: active ? 2 : 1,
              }}
            >
              {label}
            </li>
          )
        })}
      </ol>
    </div>
  )
}
