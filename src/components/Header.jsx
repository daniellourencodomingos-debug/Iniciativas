import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Avatar from './Avatar.jsx'
import { Icon, PROVIDER_ICONS } from './icons.jsx'
import { useApp } from '../store/AppContext.jsx'
import { PROVEDORES } from '../data/mock.js'

const CONTAS = ['Empresa X', 'Empresa Y', 'Empresa Z']

/**
 * Filtro global de Provedor — menu superior, afeta a plataforma inteira
 * (não é um filtro de uma tela só, por isso mora no header + AppContext,
 * não em algum componente de página). Padrão: todos selecionados ("Todos").
 *
 * Rótulo do botão:
 * - Todos selecionados -> texto "Todos"
 * - Exatamente 1 selecionado -> só o ícone daquele provedor, sem texto
 * - Qualquer outra combinação (0, ou 2+ mas não todos) -> texto "Provedores"
 */
function ProvedorHeaderFilter() {
  const { provedoresGlobais, dispatch } = useApp()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    const onDocClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [open])

  const todosSelecionados = provedoresGlobais.length === PROVEDORES.length

  const setProvedores = (next) =>
    dispatch({ type: 'SET_PROVEDORES_GLOBAIS', payload: next })

  const toggleTodos = () => setProvedores(todosSelecionados ? [] : [...PROVEDORES])

  const toggleProvedor = (p) =>
    setProvedores(
      provedoresGlobais.includes(p)
        ? provedoresGlobais.filter((v) => v !== p)
        : [...provedoresGlobais, p],
    )

  let conteudoBotao
  if (todosSelecionados) {
    conteudoBotao = <span className="text-sm font-medium">Todos</span>
  } else if (provedoresGlobais.length === 1) {
    const idx = PROVEDORES.indexOf(provedoresGlobais[0])
    const ProvIcon = PROVIDER_ICONS[idx % PROVIDER_ICONS.length]
    conteudoBotao = <ProvIcon width={18} height={18} />
  } else {
    conteudoBotao = <span className="text-sm font-medium">Provedores</span>
  }

  return (
    <div className="relative" ref={ref}>
      <div className="relative rounded-md border border-dashed border-white/50 px-3 py-1.5">
        <span className="absolute -top-2 left-2 bg-brand px-1 text-[10px] font-medium text-white/80">
          Provedor
        </span>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex items-center gap-2 pr-5 text-white"
        >
          {conteudoBotao}
        </button>
        <Icon.ChevronDown
          width={14}
          height={14}
          className={`pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-white/80 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </div>

      {open && (
        <div className="absolute right-0 top-[calc(100%+6px)] z-50 w-44 overflow-hidden rounded-md border border-hairline bg-white py-1 text-gray-900 shadow-lg">
          <label className="flex cursor-pointer items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50">
            <input
              type="checkbox"
              checked={todosSelecionados}
              onChange={toggleTodos}
              className="h-3.5 w-3.5 rounded border-gray-300 text-brand focus:ring-brand/30"
            />
            Todos
          </label>
          {PROVEDORES.map((p, idx) => {
            const ProvIcon = PROVIDER_ICONS[idx % PROVIDER_ICONS.length]
            return (
              <label
                key={p}
                className="flex cursor-pointer items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50"
              >
                <input
                  type="checkbox"
                  checked={provedoresGlobais.includes(p)}
                  onChange={() => toggleProvedor(p)}
                  className="h-3.5 w-3.5 rounded border-gray-300 text-brand focus:ring-brand/30"
                />
                <ProvIcon width={16} height={16} className="shrink-0 text-gray-500" />
                {p}
              </label>
            )
          })}
        </div>
      )}
    </div>
  )
}

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

      {/* direita: filtro global de Provedor, notificações, config, conta + avatar */}
      <div className="flex items-center gap-4">
        <ProvedorHeaderFilter />

        {/* Notificações e configurações — visual igual ao produto real, sem
            interação própria ainda (só o filtro de Provedor é funcional nesta
            rodada). */}
        <button
          type="button"
          title="Notificações"
          aria-label="Notificações"
          className="relative flex h-8 w-8 items-center justify-center rounded-md transition hover:bg-white/10"
        >
          <Icon.Bell width={18} height={18} />
          <span className="absolute -right-1 -top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold leading-none text-white">
            5+
          </span>
        </button>
        <button
          type="button"
          title="Configurações"
          aria-label="Configurações"
          className="flex h-8 w-8 items-center justify-center rounded-md transition hover:bg-white/10"
        >
          <Icon.Gear width={18} height={18} />
        </button>

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
      </div>
    </header>
  )
}
