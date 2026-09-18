import { Link } from 'react-router-dom'
import Avatar from './Avatar.jsx'
import { Icon } from './icons.jsx'

const CONTAS = ['Empresa X', 'Empresa Y', 'Empresa Z']

export default function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 flex h-14 items-center justify-between bg-brand px-4 text-white">
      {/* esquerda: sem logo — área clicável (invisível) que também leva pra Consumo */}
      <Link
        to="/orcamento"
        title="Ir para Consumo"
        aria-label="Ir para Consumo"
        className="h-full w-16 shrink-0 rounded-md transition hover:bg-white/10"
      />

      {/* direita: grupo "Conta" (borda tracejada) com select + avatar */}
      <div className="flex items-center gap-3">
        <div className="relative rounded-md border border-dashed border-white/50 px-3 py-1.5">
          <span className="absolute -top-2 left-2 bg-brand px-1 text-[10px] font-medium text-white/80">
            Conta
          </span>
          <select
            defaultValue={CONTAS[0]}
            className="cursor-pointer appearance-none bg-transparent pr-5 text-sm font-medium text-white outline-none"
          >
            {CONTAS.map((c) => (
              <option key={c} value={c} className="text-gray-900">
                {c}
              </option>
            ))}
          </select>
          <Icon.ChevronDown
            width={14}
            height={14}
            className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-white/80"
          />
        </div>
        <Avatar name={CONTAS[0]} size={32} />
      </div>
    </header>
  )
}
