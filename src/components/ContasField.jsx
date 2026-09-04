import { useEffect, useRef, useState } from 'react'
import { Icon } from './icons.jsx'

const PROVIDER_ICONS = [Icon.Cloud, Icon.CloudPlain, Icon.Layers, Icon.Building]

/**
 * Campo "Contas": seletor de duas colunas — provedores à esquerda (com ícone),
 * contas de faturamento do provedor ativo à direita (checkboxes), com rodapé
 * Cancelar/Aplicar. Seleção final aparece como chips dentro do campo.
 *
 * Cada conta selecionada é identificada como "provedor::conta" para evitar
 * colisão entre provedores diferentes.
 *
 * props:
 * - providers: string[] (nomes fictícios, ex.: PROVEDORES de mock.js)
 * - contasPorProvedor: { [provider]: string[] }
 * - value: string[] (ids "provedor::conta")
 * - onChange: (string[]) => void
 * - label: rótulo do campo (default "Contas")
 * - className
 */
export default function ContasField({
  providers,
  contasPorProvedor,
  value,
  onChange,
  label = 'Contas',
  className = '',
}) {
  const [open, setOpen] = useState(false)
  const [activeProvider, setActiveProvider] = useState(providers[0])
  const [pending, setPending] = useState(value)
  const ref = useRef(null)

  useEffect(() => {
    if (open) setPending(value)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  useEffect(() => {
    if (!open) return
    const onDocClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [open])

  const idOf = (provider, conta) => `${provider}::${conta}`

  const togglePending = (id) => {
    setPending((cur) =>
      cur.includes(id) ? cur.filter((v) => v !== id) : [...cur, id],
    )
  }

  const remove = (id, e) => {
    e.stopPropagation()
    onChange(value.filter((v) => v !== id))
  }

  const apply = () => {
    onChange(pending)
    setOpen(false)
  }

  const cancel = () => {
    setPending(value)
    setOpen(false)
  }

  const chipLabel = (id) => {
    const [provider, conta] = id.split('::')
    return conta ?? provider
  }

  return (
    <div className={className} ref={ref}>
      <div className="relative rounded border border-gray-300 bg-white transition focus-within:border-brand focus-within:ring-1 focus-within:ring-brand/30">
        {label && (
          <span className="pointer-events-none absolute -top-[7px] left-2.5 z-10 bg-white px-1 text-[11px] font-medium leading-none text-gray-500">
            {label}
          </span>
        )}
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex min-h-9 w-full flex-wrap items-center gap-1 rounded border-none bg-transparent px-2 py-1.5 text-left text-sm outline-none"
        >
          {value.length === 0 && <span className="px-1 text-gray-400">Todas</span>}
          {value.map((id) => (
            <span
              key={id}
              className="flex items-center gap-1 rounded bg-brand/10 px-2 py-0.5 text-xs font-medium text-brand"
            >
              {chipLabel(id)}
              <button
                type="button"
                onClick={(e) => remove(id, e)}
                className="rounded-full hover:bg-brand/20"
                title="Remover"
              >
                <Icon.X width={10} height={10} strokeWidth={2.5} />
              </button>
            </span>
          ))}
          <Icon.ChevronDown
            width={12}
            height={12}
            className={`ml-auto shrink-0 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`}
          />
        </button>

        {open && (
          <div className="absolute left-0 top-[calc(100%+4px)] z-20 flex w-[420px] overflow-hidden rounded-md border border-hairline bg-white shadow-lg">
            {/* coluna de provedores */}
            <div className="flex w-[160px] shrink-0 flex-col border-r border-hairline bg-gray-50">
              <div className="border-b border-hairline px-3 py-2">
                <span className="text-[13px] font-semibold text-brand">
                  Provedores
                </span>
              </div>
              <div className="py-1">
              {providers.map((prov, idx) => {
                const ProvIcon = PROVIDER_ICONS[idx % PROVIDER_ICONS.length]
                const active = prov === activeProvider
                const countSel = (contasPorProvedor[prov] ?? []).filter((c) =>
                  pending.includes(idOf(prov, c)),
                ).length
                return (
                  <button
                    key={prov}
                    type="button"
                    onClick={() => setActiveProvider(prov)}
                    className={[
                      'flex w-full items-center gap-2 px-3 py-2 text-left text-sm',
                      active
                        ? 'bg-white font-semibold text-brand'
                        : 'text-gray-600 hover:bg-gray-100',
                    ].join(' ')}
                  >
                    <ProvIcon width={16} height={16} className="shrink-0" />
                    <span className="flex-1 truncate">{prov}</span>
                    {countSel > 0 && (
                      <span className="rounded-full bg-brand/10 px-1.5 text-[10px] font-semibold text-brand">
                        {countSel}
                      </span>
                    )}
                  </button>
                )
              })}
              </div>
            </div>

            {/* coluna de contas de faturamento */}
            <div className="flex flex-1 flex-col">
              <div className="border-b border-hairline px-3 py-2">
                <span className="text-[13px] font-semibold text-brand">
                  Provedor / Contas de faturamento
                </span>
              </div>
              <div className="max-h-56 flex-1 overflow-y-auto p-2">
                {(contasPorProvedor[activeProvider] ?? []).map((conta) => {
                  const id = idOf(activeProvider, conta)
                  return (
                    <label
                      key={id}
                      className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-sm hover:bg-gray-50"
                    >
                      <input
                        type="checkbox"
                        checked={pending.includes(id)}
                        onChange={() => togglePending(id)}
                        className="h-3.5 w-3.5 rounded border-gray-300 text-brand focus:ring-brand/30"
                      />
                      {conta}
                    </label>
                  )
                })}
                {(contasPorProvedor[activeProvider] ?? []).length === 0 && (
                  <p className="px-2 py-1.5 text-sm text-gray-400">
                    Nenhuma conta para este provedor.
                  </p>
                )}
              </div>
              <div className="flex items-center justify-end gap-2 border-t border-hairline px-3 py-2">
                <button
                  type="button"
                  onClick={cancel}
                  className="rounded-md px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={apply}
                  className="rounded-md bg-brand px-3 py-1.5 text-sm font-semibold text-white hover:bg-brand-dark"
                >
                  Aplicar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
