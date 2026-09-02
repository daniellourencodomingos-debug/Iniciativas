import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '../components/Layout.jsx'
import { Icon } from '../components/icons.jsx'
import Avatar from '../components/Avatar.jsx'
import DeleteModal from '../components/DeleteModal.jsx'
import { useApp } from '../store/AppContext.jsx'
import { currency } from '../data/mock.js'

export default function CentrosDeCusto() {
  const { centros, dispatch, gerenteById, centroTotal, iniciativasDoCentro } =
    useApp()
  const navigate = useNavigate()
  const [q, setQ] = useState('')
  const [sortAsc, setSortAsc] = useState(true)
  const [toDelete, setToDelete] = useState(null)

  const rows = useMemo(() => {
    const filtered = centros.filter(
      (c) =>
        c.nome.toLowerCase().includes(q.toLowerCase()) ||
        c.codigo.toLowerCase().includes(q.toLowerCase()),
    )
    return [...filtered].sort((a, b) =>
      sortAsc ? a.nome.localeCompare(b.nome) : b.nome.localeCompare(a.nome),
    )
  }, [centros, q, sortAsc])

  return (
    <>
      <PageHeader
        title="Centros de custo"
        subtitle="Listagem / cadastro"
        actions={
          <button
            onClick={() => navigate('/centros-de-custo/novo')}
            className="flex items-center gap-2 rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark"
          >
            <Icon.Plus width={16} height={16} /> Novo centro de custo
          </button>
        }
      />

      <div className="mb-4 flex items-center gap-3">
        <div className="relative max-w-sm flex-1">
          <Icon.Search
            width={16}
            height={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Procurar"
            className="w-full rounded-md border border-hairline bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
          />
        </div>
        <span className="rounded-md border border-hairline bg-white px-3 py-1.5 text-sm text-gray-600">
          Total: <span className="font-semibold text-gray-900">{centros.length}</span> Centros de custo
        </span>
        <button
          className="rounded-md border border-hairline bg-white p-2 text-gray-500 hover:bg-gray-50"
          title="Configurar colunas"
        >
          <Icon.Gear width={16} height={16} />
        </button>
      </div>

      <div className="overflow-hidden rounded-card border border-hairline bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-hairline bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
              <th className="px-4 py-3">
                <button
                  onClick={() => setSortAsc((s) => !s)}
                  className="flex items-center gap-1 font-semibold hover:text-gray-700"
                >
                  Centro de custo
                  <Icon.ChevronDown
                    width={13}
                    height={13}
                    className={sortAsc ? '' : 'rotate-180'}
                  />
                </button>
              </th>
              <th className="px-4 py-3 font-semibold">Gerente</th>
              <th className="px-4 py-3 font-semibold">Orçamento total</th>
              <th className="px-4 py-3 text-right font-semibold">Ação</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((c) => {
              const g = gerenteById(c.gerenteId)
              const nIni = iniciativasDoCentro(c.id).length
              return (
                <tr
                  key={c.id}
                  className="border-b border-hairline last:border-0 hover:bg-gray-50"
                >
                  <td className="px-4 py-3">
                    <button
                      onClick={() => navigate(`/centros-de-custo/${c.id}/editar`)}
                      className="text-left"
                    >
                      <span className="font-semibold text-gray-900">{c.nome}</span>
                      <span className="block text-xs text-gray-400">{c.codigo}</span>
                    </button>
                    {nIni > 0 && (
                      <span className="mt-1 inline-block rounded bg-brand-light px-1.5 py-0.5 text-[10px] font-semibold text-brand">
                        {nIni} iniciativa{nIni > 1 ? 's' : ''} vinculada{nIni > 1 ? 's' : ''}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {g ? (
                      <div className="flex items-center gap-2">
                        <Avatar name={g.nome} size={30} />
                        <div>
                          <span className="block font-medium text-gray-800">{g.nome}</span>
                          <span className="block text-xs text-gray-400">{g.email}</span>
                        </div>
                      </div>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-bold text-gray-900">
                      {currency(centroTotal(c.id))}
                    </span>
                    <span className="block text-[11px] text-gray-400">
                      soma dos vínculos
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => setToDelete(c)}
                        title="Remover"
                        className="rounded-md p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500"
                      >
                        <Icon.Trash width={16} height={16} />
                      </button>
                      <button
                        onClick={() => navigate(`/centros-de-custo/${c.id}/editar`)}
                        title="Abrir"
                        className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-brand"
                      >
                        <Icon.Chevron width={18} height={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
            {rows.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-gray-400">
                  Nenhum centro de custo encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <DeleteModal
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={() => {
          dispatch({ type: 'DELETE_CENTRO', id: toDelete.id })
          setToDelete(null)
        }}
        entityLabel={`o centro de custo "${toDelete?.nome ?? ''}"`}
        effects={[
          'O centro de custo deixa de aparecer nas listagens e relatórios.',
          'Todos os vínculos deste centro de custo com iniciativas serão removidos, junto com seus orçamentos e alertas.',
          'Iniciativas que ficarem sem nenhum vínculo serão removidas.',
          'Esta ação, neste protótipo, não pode ser desfeita.',
        ]}
      />
    </>
  )
}
