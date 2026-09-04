import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '../components/Layout.jsx'
import { Icon } from '../components/icons.jsx'
import AttentionBanner from '../components/AttentionBanner.jsx'
import { useApp } from '../store/AppContext.jsx'
import { currency, PROVEDORES } from '../data/mock.js'

const PER_PAGE_OPTS = [5, 10, 20]

function FilterField({ label, children, className = '' }) {
  return (
    <label className={`flex flex-col gap-1 ${className}`}>
      <span className="text-[11px] font-medium uppercase tracking-wide text-gray-500">
        {label}
      </span>
      {children}
    </label>
  )
}

const ctl =
  'h-9 rounded-md border border-hairline bg-white px-3 text-sm text-gray-900 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20'

export default function Iniciativas() {
  const {
    iniciativas,
    centros,
    vinculos,
    centroById,
    centrosDaIniciativa,
    iniciativaTotal,
    vinculosDaIniciativa,
  } = useApp()
  const navigate = useNavigate()

  const [fWorkspace, setFWorkspace] = useState('')
  const [fProvedor, setFProvedor] = useState('todos')
  const [fCentro, setFCentro] = useState('todos')
  const [fResponsavel, setFResponsavel] = useState('todos')
  const [q, setQ] = useState('')
  const [sort, setSort] = useState({ col: 'iniciativa', dir: 'asc' })
  const [bannerAck, setBannerAck] = useState(false)
  const [perPage, setPerPage] = useState(10)
  const [page, setPage] = useState(0)

  useEffect(() => {
    setPage(0)
  }, [fWorkspace, fProvedor, fCentro, fResponsavel, q, perPage])

  const provedoresDe = (id) =>
    new Set(
      vinculosDaIniciativa(id).flatMap((v) =>
        v.orcamentos.map((o) => o.provedor),
      ),
    )
  const responsaveisDe = (id) =>
    new Set(vinculosDaIniciativa(id).flatMap((v) => v.emails ?? []))
  const workspacesDe = (i) => i.workspaces ?? vinculosDaIniciativa(i.id).length

  const responsavelOpts = useMemo(
    () => [...new Set(vinculos.flatMap((v) => v.emails ?? []))].sort(),
    [vinculos],
  )

  const filtered = useMemo(() => {
    const list = iniciativas.filter((i) => {
      const slug = i.slug.toLowerCase()
      if (fWorkspace && !slug.includes(fWorkspace.toLowerCase())) return false
      if (q && !slug.includes(q.toLowerCase())) return false
      if (fProvedor !== 'todos' && !provedoresDe(i.id).has(fProvedor))
        return false
      if (fCentro !== 'todos' && !centrosDaIniciativa(i.id).includes(fCentro))
        return false
      if (fResponsavel !== 'todos' && !responsaveisDe(i.id).has(fResponsavel))
        return false
      return true
    })
    list.sort((a, b) => {
      const cmp =
        sort.col === 'iniciativa'
          ? a.slug.localeCompare(b.slug)
          : workspacesDe(a) - workspacesDe(b)
      return sort.dir === 'asc' ? cmp : -cmp
    })
    return list
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [iniciativas, vinculos, fWorkspace, q, fProvedor, fCentro, fResponsavel, sort])

  const total = filtered.length
  const totalPages = Math.max(1, Math.ceil(total / perPage))
  const pageC = Math.min(page, totalPages - 1)
  const pageRows = filtered.slice(pageC * perPage, pageC * perPage + perPage)
  const from = total === 0 ? 0 : pageC * perPage + 1
  const to = Math.min(total, (pageC + 1) * perPage)

  const toggleSort = (col) =>
    setSort((s) =>
      s.col === col
        ? { col, dir: s.dir === 'asc' ? 'desc' : 'asc' }
        : { col, dir: 'asc' },
    )

  const SortHeader = ({ col, children }) => (
    <th className="px-4 py-3 text-left font-semibold">
      <button
        onClick={() => toggleSort(col)}
        className="inline-flex items-center gap-1 hover:text-gray-700"
      >
        {children}
        <Icon.ChevronDown
          width={12}
          height={12}
          className={
            sort.col === col
              ? sort.dir === 'asc'
                ? 'rotate-180'
                : ''
              : 'opacity-30'
          }
        />
      </button>
    </th>
  )

  return (
    <>
      <PageHeader title="Iniciativas" />

      {/* linha de filtros + ação, sempre na mesma linha */}
      <div className="mb-4 flex items-end gap-3">
        <div className="flex flex-1 flex-wrap items-end gap-3">
          <FilterField label="Workspace" className="min-w-[150px] flex-1">
            <input
              value={fWorkspace}
              onChange={(e) => setFWorkspace(e.target.value)}
              placeholder="Buscar workspace"
              className={ctl}
            />
          </FilterField>
          <FilterField label="Provedor">
            <select
              value={fProvedor}
              onChange={(e) => setFProvedor(e.target.value)}
              className={ctl}
            >
              <option value="todos">Todos</option>
              {PROVEDORES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </FilterField>
          <FilterField label="Centro de custo">
            <select
              value={fCentro}
              onChange={(e) => setFCentro(e.target.value)}
              className={ctl}
            >
              <option value="todos">Todos</option>
              {centros.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nome}
                </option>
              ))}
            </select>
          </FilterField>
          <FilterField label="Responsável">
            <select
              value={fResponsavel}
              onChange={(e) => setFResponsavel(e.target.value)}
              className={ctl}
            >
              <option value="todos">Todos</option>
              {responsavelOpts.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </FilterField>
          <FilterField label="Procurar" className="min-w-[180px] flex-1">
            <div className="relative">
              <Icon.Search
                width={16}
                height={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Iniciativa"
                className={`${ctl} w-full pl-9`}
              />
            </div>
          </FilterField>
        </div>

        <button
          onClick={() => navigate('/iniciativas/nova')}
          className="flex h-9 shrink-0 items-center gap-2 rounded-md bg-brand px-4 text-sm font-semibold text-white hover:bg-brand-dark"
        >
          <Icon.Plus width={16} height={16} /> Nova solicitação
        </button>
      </div>

      {!bannerAck && (
        <div className="mb-4">
          <AttentionBanner
            variant="importante"
            actionLabel="Entendi"
            onAction={() => setBannerAck(true)}
          >
            Os orçamentos de iniciativas são feitos anualmente por meio de
            solicitação.
          </AttentionBanner>
        </div>
      )}

      <div className="overflow-hidden rounded-card border border-hairline bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-hairline bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
              <SortHeader col="iniciativa">Iniciativa</SortHeader>
              <SortHeader col="workspaces">Workspace / ID</SortHeader>
              <th className="px-4 py-3 font-semibold">Provedores</th>
              <th className="px-4 py-3 font-semibold">Orçamento total</th>
              <th className="px-4 py-3 text-right font-semibold">Ação</th>
            </tr>
          </thead>
          <tbody>
            {pageRows.map((i) => {
              const centrosI = centrosDaIniciativa(i.id)
              return (
                <tr
                  key={i.id}
                  className="border-b border-hairline last:border-0 hover:bg-gray-50"
                >
                  <td className="px-4 py-3">
                    <button
                      onClick={() => navigate(`/iniciativas/${i.id}/editar`)}
                      className="text-left"
                    >
                      <span className="font-semibold text-gray-900">
                        {i.slug}
                      </span>
                    </button>
                    {centrosI.length > 0 && (
                      <span className="mt-1 block text-[11px] text-gray-400">
                        {centrosI
                          .map((cid) => centroById(cid)?.nome ?? cid)
                          .join(', ')}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-bold text-gray-900">
                      {workspacesDe(i)}
                    </span>
                    <span className="ml-1 text-xs text-gray-400">
                      workspace{workspacesDe(i) === 1 ? '' : 's'}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-bold text-gray-900">
                    {provedoresDe(i.id).size}
                  </td>
                  <td className="px-4 py-3 font-bold text-gray-900">
                    {currency(iniciativaTotal(i.id))}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => navigate(`/iniciativas/${i.id}/editar`)}
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
                <td
                  colSpan={5}
                  className="px-4 py-10 text-center text-gray-400"
                >
                  Nenhuma iniciativa encontrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* paginação */}
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
              <Icon.Chevron
                width={16}
                height={16}
                className="rotate-180"
              />
            </button>
            <button
              onClick={() =>
                setPage((p) => Math.min(totalPages - 1, p + 1))
              }
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
