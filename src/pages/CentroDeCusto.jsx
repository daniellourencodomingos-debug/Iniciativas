import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '../components/Layout.jsx'
import { Icon } from '../components/icons.jsx'
import { useApp } from '../store/AppContext.jsx'
import { currency } from '../data/mock.js'

const PER_PAGE_OPTS = [5, 10, 20]

const ctl =
  'h-9 rounded-md border border-hairline bg-white px-3 text-sm text-gray-900 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20'

/**
 * Listagem de Centros de Custo. Cadastro/edição acontece por aqui também
 * (botão "Novo centro de custo" e clique na linha) — não é uma jornada
 * separada no menu.
 */
export default function CentroDeCusto() {
  const { centros, gerenteById, centroTotal } = useApp()
  const navigate = useNavigate()

  const [q, setQ] = useState('')
  const [sort, setSort] = useState({ col: 'nome', dir: 'asc' })
  const [perPage, setPerPage] = useState(10)
  const [page, setPage] = useState(0)

  useEffect(() => {
    setPage(0)
  }, [q, perPage])

  const filtered = useMemo(() => {
    const list = centros.filter((c) => {
      if (!q) return true
      const term = q.toLowerCase()
      return (
        c.nome.toLowerCase().includes(term) ||
        c.codigo.toLowerCase().includes(term)
      )
    })
    list.sort((a, b) => {
      const cmp =
        sort.col === 'nome'
          ? a.nome.localeCompare(b.nome)
          : centroTotal(a.id) - centroTotal(b.id)
      return sort.dir === 'asc' ? cmp : -cmp
    })
    return list
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [centros, q, sort])

  const total = filtered.length
  const totalPages = Math.max(1, Math.ceil(total / perPage))
  const pageC = Math.min(page, totalPages - 1)
  const pageRows = filtered.slice(pageC * perPage, pageC * perPage + perPage)
  const from = total === 0 ? 0 : pageC * perPage + 1
  const to = Math.min(total, (pageC + 1) * perPage)

  const toggleSort = (col) =>
    setSort((s) =>
      s.col === col ? { col, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { col, dir: 'asc' },
    )

  const SortHeader = ({ col, children }) => (
    <th className="px-4 py-3 text-left font-semibold">
      <button onClick={() => toggleSort(col)} className="inline-flex items-center gap-1 hover:text-gray-700">
        {children}
        <Icon.ChevronDown
          width={12}
          height={12}
          className={sort.col === col ? (sort.dir === 'asc' ? 'rotate-180' : '') : 'opacity-30'}
        />
      </button>
    </th>
  )

  return (
    <>
      <PageHeader title="Centros de custo" icon={Icon.CloudPlain} />

      <div className="relative z-10 mb-4 flex items-end gap-3 pb-1">
        <label className="flex flex-col gap-1 w-[260px] shrink-0">
          <span className="text-[11px] font-medium uppercase tracking-wide text-gray-500">
            Procurar
          </span>
          <div className="relative">
            <Icon.Search
              width={16}
              height={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Centro de custo e código"
              className={`${ctl} w-full pl-9`}
            />
          </div>
        </label>

        <div className="flex h-9 flex-1 items-center rounded-md bg-gray-100 px-3 text-sm text-gray-600">
          Total: <span className="font-semibold text-gray-900">&nbsp;{centros.length}&nbsp;</span> Centros de custo
        </div>

        <button
          onClick={() => navigate('/centro-de-custo/novo')}
          className="flex h-9 shrink-0 items-center gap-2 rounded-md bg-brand px-4 text-sm font-semibold text-white hover:bg-brand-dark"
        >
          <Icon.Plus width={16} height={16} /> Novo centro de custo
        </button>
      </div>

      <div className="overflow-hidden rounded-card border border-hairline bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-hairline bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
              <SortHeader col="nome">Centro de custo</SortHeader>
              <th className="px-4 py-3 font-semibold">Gerente</th>
              <SortHeader col="orcamento">Orçamento anual</SortHeader>
              <th className="px-4 py-3 text-right font-semibold">Ação</th>
            </tr>
          </thead>
          <tbody>
            {pageRows.map((c) => {
              const gerente = gerenteById(c.gerenteId)
              return (
                <tr
                  key={c.id}
                  className="border-b border-hairline last:border-0 hover:bg-gray-50 cursor-pointer"
                  onClick={() => navigate(`/centro-de-custo/${c.id}/editar`)}
                >
                  <td className="px-4 py-3">
                    <span className="text-gray-900">{c.nome}</span>
                    <span className="block text-xs text-gray-400">{c.codigo}</span>
                  </td>
                  <td className="px-4 py-3">
                    {gerente ? (
                      <div className="flex items-center gap-2.5">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-200 text-gray-400">
                          <Icon.UserSingle width={18} height={18} />
                        </span>
                        <div>
                          <div className="text-gray-900">{gerente.nome}</div>
                          <div className="text-xs text-gray-400">{gerente.email}</div>
                        </div>
                      </div>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-900">{currency(centroTotal(c.id))}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        navigate(`/centro-de-custo/${c.id}/editar`)
                      }}
                      title="Abrir"
                      className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-brand"
                    >
                      <Icon.Chevron width={18} height={18} />
                    </button>
                  </td>
                </tr>
              )
            })}
            {pageRows.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-gray-400">
                  Nenhum centro de custo encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="flex flex-wrap items-center justify-end gap-6 border-t border-hairline px-4 py-3 text-sm text-gray-500">
          <label className="flex items-center gap-2">
            Linhas por página:
            <select
              value={perPage}
              onChange={(e) => setPerPage(Number(e.target.value))}
              className="rounded border border-hairline bg-white px-2 py-1 text-sm outline-none"
            >
              {PER_PAGE_OPTS.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>

          <span className="tabular-nums">
            {from}-{to} de {total}
          </span>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={pageC === 0}
              className="rounded p-1.5 hover:bg-gray-100 disabled:opacity-30"
              title="Anterior"
            >
              <Icon.Chevron width={16} height={16} className="rotate-180" />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={pageC >= totalPages - 1}
              className="rounded p-1.5 hover:bg-gray-100 disabled:opacity-30"
              title="Próxima"
            >
              <Icon.Chevron width={16} height={16} />
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
