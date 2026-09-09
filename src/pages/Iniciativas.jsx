import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '../components/Layout.jsx'
import { Icon } from '../components/icons.jsx'
import AttentionBanner from '../components/AttentionBanner.jsx'
import MultiSelectField from '../components/MultiSelectField.jsx'
import ContasField from '../components/ContasField.jsx'
import FilterChipsBar from '../components/FilterChipsBar.jsx'
import { useApp } from '../store/AppContext.jsx'
import { PROVEDORES, WORKSPACES, CONTAS_FATURAMENTO, statusIniciativaInfo } from '../data/mock.js'

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

// Mostra a contagem e, no hover, um tooltip com até 2 nomes + "+N" para o restante.
function CountTooltip({ count, items = [] }) {
  if (items.length === 0) {
    return <span className="text-gray-900">{count}</span>
  }
  const shown = items.slice(0, 2).join(', ')
  const label = items.length > 2 ? `${shown} +${items.length - 2}` : shown
  return (
    <span className="group relative inline-block">
      <span className="cursor-default text-gray-900">{count}</span>
      <span className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-1.5 w-max max-w-[240px] -translate-x-1/2 whitespace-normal rounded-md bg-gray-800 px-2 py-1 text-center text-xs text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
        {label}
        <span className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-gray-800" />
      </span>
    </span>
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
    vinculosDaIniciativa,
  } = useApp()
  const navigate = useNavigate()

  const [fWorkspaces, setFWorkspaces] = useState([])
  const [fContas, setFContas] = useState([])
  const [fCentros, setFCentros] = useState([])
  const [fResponsavel, setFResponsavel] = useState('todos')
  const [q, setQ] = useState('')
  const [sort, setSort] = useState({ col: 'iniciativa', dir: 'asc' })
  const [bannerAck, setBannerAck] = useState(false)
  const [perPage, setPerPage] = useState(10)
  const [page, setPage] = useState(0)

  useEffect(() => {
    setPage(0)
  }, [fWorkspaces, fContas, fCentros, fResponsavel, q, perPage])

  const provedoresDe = (id) =>
    new Set(
      vinculosDaIniciativa(id).flatMap((v) =>
        (v.workspaces ?? []).map((w) => w.split('::')[0]),
      ),
    )
  const responsaveisDe = (id) =>
    new Set(vinculosDaIniciativa(id).flatMap((v) => v.emails ?? []))
  const workspacesDaIniciativa = (id) =>
    new Set(
      vinculosDaIniciativa(id).flatMap((v) =>
        (v.workspaces ?? []).map((w) => w.split('::')[1] ?? w),
      ),
    )
  const workspacesDe = (i) => workspacesDaIniciativa(i.id).size

  const responsavelOpts = useMemo(
    () => [...new Set(vinculos.flatMap((v) => v.emails ?? []))].sort(),
    [vinculos],
  )

  const centroOpts = useMemo(
    () => centros.map((c) => ({ value: c.id, label: c.nome })),
    [centros],
  )
  const workspaceOpts = useMemo(
    () => WORKSPACES.map((w) => ({ value: w, label: w })),
    [],
  )

  // provedores selecionados a partir das contas escolhidas (id = "provedor::conta")
  const provedoresSelecionados = useMemo(
    () => new Set(fContas.map((id) => id.split('::')[0])),
    [fContas],
  )

  const filtered = useMemo(() => {
    const list = iniciativas.filter((i) => {
      const slug = i.slug.toLowerCase()
      if (q && !slug.includes(q.toLowerCase())) return false
      if (
        fWorkspaces.length > 0 &&
        ![...workspacesDaIniciativa(i.id)].some((w) => fWorkspaces.includes(w))
      )
        return false
      if (
        fContas.length > 0 &&
        ![...provedoresDe(i.id)].some((p) => provedoresSelecionados.has(p))
      )
        return false
      if (
        fCentros.length > 0 &&
        !centrosDaIniciativa(i.id).some((cid) => fCentros.includes(cid))
      )
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
  }, [
    iniciativas,
    vinculos,
    fWorkspaces,
    fContas,
    provedoresSelecionados,
    q,
    fCentros,
    fResponsavel,
    sort,
  ])

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

  const clearAllFilters = () => {
    setFWorkspaces([])
    setFContas([])
    setFCentros([])
    setFResponsavel('todos')
    setQ('')
  }

  const filterChips = useMemo(() => {
    const chips = []
    fCentros.forEach((cid) =>
      chips.push({
        key: `centro-${cid}`,
        label: `Centro de custo: ${centroById(cid)?.nome ?? cid}`,
        onRemove: () => setFCentros((s) => s.filter((v) => v !== cid)),
      }),
    )
    fWorkspaces.forEach((w) =>
      chips.push({
        key: `ws-${w}`,
        label: `Workspace: ${w}`,
        onRemove: () => setFWorkspaces((s) => s.filter((v) => v !== w)),
      }),
    )
    fContas.forEach((id) => {
      const [provedor, conta] = id.split('::')
      chips.push({
        key: `conta-${id}`,
        label: `Conta: ${conta} (${provedor})`,
        onRemove: () => setFContas((s) => s.filter((v) => v !== id)),
      })
    })
    if (fResponsavel !== 'todos')
      chips.push({
        key: 'responsavel',
        label: `Responsável: ${fResponsavel}`,
        onRemove: () => setFResponsavel('todos'),
      })
    if (q)
      chips.push({
        key: 'q',
        label: `Procurar: ${q}`,
        onRemove: () => setQ(''),
      })
    return chips
  }, [fCentros, fWorkspaces, fContas, fResponsavel, q, centroById])

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
      <div className="relative z-10 mb-4 flex items-end gap-3 pb-1">
        <div className="flex flex-nowrap items-end gap-3">
          <FilterField label="Procurar" className="w-[170px] shrink-0">
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
          <MultiSelectField
            label="Workspace"
            options={workspaceOpts}
            selected={fWorkspaces}
            onChange={setFWorkspaces}
            className="w-[150px] shrink-0"
          />
          <ContasField
            label="Contas"
            providers={PROVEDORES}
            contasPorProvedor={CONTAS_FATURAMENTO}
            value={fContas}
            onChange={setFContas}
            className="w-[150px] shrink-0"
          />
          <MultiSelectField
            label="Centro de custo"
            options={centroOpts}
            selected={fCentros}
            onChange={setFCentros}
            className="w-[150px] shrink-0"
          />
          <FilterField label="Responsável" className="w-[140px] shrink-0">
            <select
              value={fResponsavel}
              onChange={(e) => setFResponsavel(e.target.value)}
              className={`${ctl} w-full`}
            >
              <option value="todos">Todos</option>
              {responsavelOpts.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </FilterField>
        </div>

        <button
          onClick={() => navigate('/iniciativas/nova')}
          className="ml-auto flex h-9 shrink-0 items-center gap-2 rounded-md bg-brand px-4 text-sm font-semibold text-white hover:bg-brand-dark"
        >
          <Icon.Plus width={16} height={16} /> Nova solicitação
        </button>
      </div>

      <FilterChipsBar chips={filterChips} onClearAll={clearAllFilters} />

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
              <th className="px-4 py-3 font-semibold">Centro de Custo</th>
              <SortHeader col="workspaces">Workspace</SortHeader>
              <th className="px-4 py-3 font-semibold">Provedores</th>
              <th className="px-4 py-3 font-semibold">Status</th>
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
                      <span className="text-gray-900">
                        {i.slug}
                      </span>
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <CountTooltip
                      count={centrosI.length}
                      items={centrosI.map((cid) => centroById(cid)?.nome ?? cid)}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <CountTooltip
                      count={workspacesDe(i)}
                      items={[...workspacesDaIniciativa(i.id)]}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <CountTooltip
                      count={provedoresDe(i.id).size}
                      items={[...provedoresDe(i.id)]}
                    />
                  </td>
                  <td className="px-4 py-3">
                    {(() => {
                      const s = statusIniciativaInfo(i.status)
                      return (
                        <span className="inline-flex items-center gap-2">
                          <span
                            className="inline-block h-2 w-2 rounded-full"
                            style={{ backgroundColor: s.color }}
                          />
                          <span className="text-gray-900">{s.label}</span>
                        </span>
                      )
                    })()}
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
                  colSpan={6}
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
