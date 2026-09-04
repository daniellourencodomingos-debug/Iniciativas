import { useState } from 'react'
import SidebarItem from './SidebarItem.jsx'
import { Icon } from './icons.jsx'

/**
 * Menu lateral completo (com texto), sempre visível.
 * O hambúrguer do header pode recolher/expandir a barra inteira (prop `open`).
 * O grupo "Devfinops / Gestão financeira" é colapsável.
 */
export default function Sidebar({ open = true }) {
  const [groupOpen, setGroupOpen] = useState(true)

  return (
    <aside
      className={[
        'fixed left-0 top-14 bottom-0 z-30 flex w-64 flex-col border-r border-hairline bg-white',
        'transition-transform duration-200 ease-out',
        open ? 'translate-x-0' : '-translate-x-full',
      ].join(' ')}
    >
      <div className="flex-1 overflow-y-auto px-3 py-4">
        <button
          type="button"
          onClick={() => setGroupOpen((o) => !o)}
          className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-xs font-bold uppercase tracking-wide text-gray-500 hover:bg-gray-100"
        >
          <Icon.ChevronDown
            width={14}
            height={14}
            className={`shrink-0 transition-transform ${groupOpen ? '' : '-rotate-90'}`}
          />
          <span className="min-w-0 flex-1">
            Devfinops
            <span className="block text-[11px] font-medium normal-case tracking-normal text-gray-400">
              Gestão financeira
            </span>
          </span>
        </button>

        {groupOpen && (
          <nav className="mt-2 space-y-1">
            <SidebarItem
              to="/orcamento"
              icon={Icon.Chart}
              label="Orçamento, consumo e ofensores"
            />
            <SidebarItem
              to="/historico-previsoes"
              icon={Icon.History}
              label="Histórico de Previsões"
            />
            <SidebarItem
              to="/recomendacoes"
              icon={Icon.Bulb}
              label="Recomendações"
            />
            <SidebarItem
              to="/centros-de-custo"
              icon={Icon.Building}
              label="Centros de custo"
              subtitle="Listagem / cadastro"
            />
            <SidebarItem
              to="/iniciativas"
              icon={Icon.Target}
              label="Iniciativas"
              subtitle="Listagem / cadastro"
              badge="novo"
            />
            <SidebarItem
              to="/estrutura-financeira"
              icon={Icon.Layers}
              label="Estrutura financeira"
            />
            <SidebarItem
              to="/relatorios"
              icon={Icon.Report}
              label="Relatórios"
            />
            <SidebarItem
              to="/iam"
              icon={Icon.Users}
              label="IAM"
              subtitle="Gestão de usuários"
            />
            <SidebarItem
              to="/integrar-cloud"
              icon={Icon.Cloud}
              label="Integrar serviço de cloud"
            />
          </nav>
        )}
      </div>

      <div className="border-t border-hairline px-3 py-3">
        <SidebarItem to="/documentacao" icon={Icon.Doc} label="Documentação" />
      </div>
    </aside>
  )
}
