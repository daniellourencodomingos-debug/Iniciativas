import { Icon } from './icons.jsx'
import Avatar from './Avatar.jsx'

export default function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 flex h-14 items-center justify-between bg-brand px-5 text-white">
      <div className="flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-md bg-white/15 font-black">
          D
        </span>
        <span className="text-lg font-bold tracking-tight">devfinops</span>
      </div>
      <div className="flex items-center gap-1">
        <button className="rounded-md p-2 hover:bg-white/10" title="Notificações">
          <Icon.Bell width={20} height={20} />
        </button>
        <button className="rounded-md p-2 hover:bg-white/10" title="Configurações">
          <Icon.Gear width={20} height={20} />
        </button>
        <span className="ml-2">
          <Avatar name="Usuário Interno" size={30} />
        </span>
      </div>
    </header>
  )
}
