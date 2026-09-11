import { useState } from 'react'
import SidebarItem from './SidebarItem.jsx'
import { Icon } from './icons.jsx'

/**
 * Menu lateral recolhido por padrão (só uma faixa fina). Ao passar o mouse
 * sobre a faixa, abre como um drawer sobrepondo o conteúdo (com sombra) —
 * fecha automaticamente quando o mouse sai da área do menu.
 *
 * O toggle "Visualização alternativa" liga/desliga os ícones nos itens de
 * navegação (versão antiga do protótipo), só para comparação visual — os 4
 * ícones estruturais (Devfinops, IAM, Integrar serviço de cloud,
 * Documentação) ficam sempre visíveis.
 */
export default function Sidebar() {
  const [expanded, setExpanded] = useState(false)
  const [devfinopsOpen, setDevfinopsOpen] = useState(true)
  const [iamOpen, setIamOpen] = useState(true)
  const [mostrarIcones, setMostrarIcones] = useState(false)

  const itemIcon = (IconCmp) => (mostrarIcones ? IconCmp : undefined)

  return (
    <aside
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      className={[
        'fixed left-0 top-14 bottom-0 z-40 flex flex-col overflow-hidden',
        'border-r border-hairline bg-white transition-[width] duration-200 ease-out',
        expanded ? 'w-64 shadow-xl' : 'w-3',
      ].join(' ')}
    >
      <div
        className={[
          'flex min-h-0 flex-1 flex-col transition-opacity duration-150',
          expanded ? 'opacity-100' : 'pointer-events-none opacity-0',
        ].join(' ')}
      >
        <div className="flex-1 overflow-y-auto px-3 py-4">
          <button
            type="button"
            onClick={() => setDevfinopsOpen((o) => !o)}
            className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-xs font-bold uppercase tracking-wide text-gray-500 hover:bg-gray-100"
          >
            <Icon.CloudPlain width={16} height={16} className="shrink-0 text-gray-400" />
            <span className="min-w-0 flex-1">
              Devfinops
              <span className="block text-[11px] font-medium normal-case tracking-normal text-gray-400">
                Gestão financeira
              </span>
            </span>
            <Icon.ChevronDown
              width={14}
              height={14}
              className={`shrink-0 transition-transform ${devfinopsOpen ? '' : '-rotate-90'}`}
            />
          </button>

          {devfinopsOpen && (
            <nav className="mt-2 space-y-1">
              <SidebarItem
                to="/orcamento"
                icon={itemIcon(Icon.Chart)}
                label="Orçamento, consumo e ofensores"
                dot
              />
              <SidebarItem
                to="/historico-previsoes"
                icon={itemIcon(Icon.History)}
                label="Histórico de Previsões"
              />
              <SidebarItem
                to="/recomendacoes"
                icon={itemIcon(Icon.Bulb)}
                label="Recomendações"
              />
              <SidebarItem
                to="/centros-de-custo"
                icon={itemIcon(Icon.Building)}
                label="Centros de custo"
                subtitle="Listagem / cadastro"
              />
              <SidebarItem
                to="/iniciativas"
                icon={itemIcon(Icon.Target)}
                label="Iniciativas"
                subtitle="Listagem / cadastro"
              />
              <SidebarItem
                to="/estrutura-financeira"
                icon={itemIcon(Icon.Layers)}
                label="Estrutura financeira"
              />
              <SidebarItem
                to="/relatorios"
                icon={itemIcon(Icon.Report)}
                label="Relatórios"
              />
            </nav>
          )}

          <div className="my-3 border-t border-hairline" />

          <button
            type="button"
            onClick={() => setIamOpen((o) => !o)}
            className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-xs font-bold uppercase tracking-wide text-gray-500 hover:bg-gray-100"
          >
            <Icon.Users width={16} height={16} className="shrink-0 text-gray-400" />
            <span className="min-w-0 flex-1">
              IAM
              <span className="block text-[11px] font-medium normal-case tracking-normal text-gray-400">
                Gestão de usuários
              </span>
            </span>
            <Icon.ChevronDown
              width={14}
              height={14}
              className={`shrink-0 transition-transform ${iamOpen ? '' : '-rotate-90'}`}
            />
          </button>

          {iamOpen && (
            <nav className="mt-2 space-y-1">
              <SidebarItem to="/iam" icon={itemIcon(Icon.Users)} label="Usuários" />
            </nav>
          )}

          <div className="my-3 border-t border-hairline" />

          <nav className="space-y-1">
            <SidebarItem
              to="/integrar-cloud"
              icon={Icon.Sliders}
              label="Integrar serviço de cloud"
            />
          </nav>
        </div>

        <div className="border-t border-hairline px-3 pb-3 pt-2">
          <label className="mb-1 flex cursor-pointer items-center justify-end gap-1.5 px-1 text-[10px] text-gray-400">
            <span>Visualização alternativa</span>
            <button
              type="button"
              role="switch"
              aria-checked={mostrarIcones}
              onClick={() => setMostrarIcones((v) => !v)}
              className={`relative h-3.5 w-7 shrink-0 rounded-full transition ${
                mostrarIcones ? 'bg-brand' : 'bg-gray-300'
              }`}
            >
              <span
                className={`absolute top-0.5 h-2.5 w-2.5 rounded-full bg-white shadow transition ${
                  mostrarIcones ? 'left-[15px]' : 'left-0.5'
                }`}
              />
            </button>
          </label>
          <SidebarItem to="/documentacao" icon={Icon.Doc} label="Documentação" />
        </div>
      </div>
    </aside>
  )
}
