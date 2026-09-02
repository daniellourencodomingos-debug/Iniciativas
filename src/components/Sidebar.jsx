import { useEffect, useRef, useState } from 'react'
import SidebarItem from './SidebarItem.jsx'
import { Icon } from './icons.jsx'

// Atraso antes de abrir no hover — evita abrir sem querer ao passar o mouse.
const OPEN_DELAY = 350
const CLOSE_DELAY = 180

/**
 * Menu lateral: rail recolhido (só ícones) que expande no hover.
 * A abertura só ocorre depois de OPEN_DELAY (intenção deliberada) e o
 * menu expandido flutua sobre o conteúdo, sem reposicionar a página.
 */
export default function Sidebar() {
  const [groupOpen, setGroupOpen] = useState(true)
  const [expanded, setExpanded] = useState(false)
  const openTimer = useRef()
  const closeTimer = useRef()

  useEffect(
    () => () => {
      clearTimeout(openTimer.current)
      clearTimeout(closeTimer.current)
    },
    [],
  )

  const handleEnter = () => {
    clearTimeout(closeTimer.current)
    openTimer.current = setTimeout(() => setExpanded(true), OPEN_DELAY)
  }

  const handleLeave = () => {
    clearTimeout(openTimer.current)
    closeTimer.current = setTimeout(() => setExpanded(false), CLOSE_DELAY)
  }

  return (
    <aside
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      className={[
        'fixed left-0 top-14 bottom-0 z-30 flex flex-col border-r border-hairline bg-white',
        'transition-[width] duration-200 ease-out',
        expanded ? 'w-64 shadow-xl' : 'w-16',
      ].join(' ')}
    >
      <div className="flex-1 overflow-y-auto overflow-x-hidden px-2 py-4">
        <button
          type="button"
          onClick={() => setGroupOpen((o) => !o)}
          disabled={!expanded}
          className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-xs font-bold uppercase tracking-wide text-gray-500 hover:bg-gray-100 disabled:hover:bg-transparent"
        >
          {expanded ? (
            <>
              <Icon.ChevronDown
                width={14}
                height={14}
                className={`shrink-0 transition-transform ${groupOpen ? '' : '-rotate-90'}`}
              />
              <span className="min-w-0 flex-1 truncate">
                Devfinops
                <span className="block truncate text-[11px] font-medium normal-case tracking-normal text-gray-400">
                  Gestão financeira
                </span>
              </span>
            </>
          ) : (
            <span className="mx-auto flex h-7 w-7 items-center justify-center rounded-md bg-brand-light font-black text-brand">
              D
            </span>
          )}
        </button>

        <nav className="mt-2 space-y-1">
          {(!expanded || groupOpen) && (
            <>
              <SidebarItem to="/orcamento" icon={Icon.Chart} label="Orçamento, consumo e ofensores" collapsed={!expanded} />
              <SidebarItem to="/historico-previsoes" icon={Icon.History} label="Histórico de Previsões" collapsed={!expanded} />
              <SidebarItem to="/recomendacoes" icon={Icon.Bulb} label="Recomendações" collapsed={!expanded} />
              <SidebarItem
                to="/centros-de-custo"
                icon={Icon.Building}
                label="Centros de custo"
                subtitle="Listagem / cadastro"
                collapsed={!expanded}
              />
              <SidebarItem
                to="/iniciativas"
                icon={Icon.Rocket}
                label="Iniciativas"
                subtitle="Listagem / cadastro"
                badge="novo"
                collapsed={!expanded}
              />
              <SidebarItem to="/estrutura-financeira" icon={Icon.Layers} label="Estrutura financeira" collapsed={!expanded} />
              <SidebarItem to="/relatorios" icon={Icon.Report} label="Relatórios" collapsed={!expanded} />
              <SidebarItem
                to="/iam"
                icon={Icon.Users}
                label="IAM"
                subtitle="Gestão de usuários"
                collapsed={!expanded}
              />
              <SidebarItem to="/integrar-cloud" icon={Icon.Cloud} label="Integrar serviço de cloud" collapsed={!expanded} />
            </>
          )}
        </nav>
      </div>

      <div className="border-t border-hairline px-2 py-3">
        <SidebarItem to="/documentacao" icon={Icon.Doc} label="Documentação" collapsed={!expanded} />
      </div>
    </aside>
  )
}
