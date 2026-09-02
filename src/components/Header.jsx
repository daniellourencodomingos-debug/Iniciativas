import { Icon } from './icons.jsx'
import Avatar from './Avatar.jsx'

const CONTA = 'Empresa X'

export default function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 flex h-14 items-center justify-between bg-brand px-4 text-white">
      {/* esquerda: hambúrguer + logo */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="rounded-md p-1.5 hover:bg-white/10"
          title="Menu"
        >
          <Icon.Menu width={22} height={22} />
        </button>
        <div className="flex items-center gap-2">
          <Icon.Cloud width={20} height={20} />
          <span className="text-lg font-bold lowercase tracking-tight">
            omnicloud
          </span>
        </div>
      </div>

      {/* direita: grupo "Conta" (borda tracejada) + avatar */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="relative flex items-center gap-2 rounded-md border border-dashed border-white/50 px-3 py-1.5 hover:bg-white/5"
        >
          <span className="absolute -top-2 left-2 bg-brand px-1 text-[10px] font-medium text-white/80">
            Conta
          </span>
          <span className="text-sm font-medium">{CONTA}</span>
          <Icon.ChevronDown width={14} height={14} className="text-white/80" />
        </button>
        <Avatar name={CONTA} size={32} />
      </div>
    </header>
  )
}
