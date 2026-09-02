import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '../components/Layout.jsx'
import { Icon } from '../components/icons.jsx'
import DeleteModal from '../components/DeleteModal.jsx'
import { useApp } from '../store/AppContext.jsx'
import { currency } from '../data/mock.js'

export default function Iniciativas() {
  const {
    iniciativas,
    dispatch,
    centroById,
    centrosDaIniciativa,
    iniciativaTotal,
    vinculosDaIniciativa,
  } = useApp()
  const navigate = useNavigate()
  const [q, setQ] = useState('')
  const [toDelete, setToDelete] = useState(null)

  const rows = useMemo(
    () =>
      iniciativas.filter((i) => i.slug.toLowerCase().includes(q.toLowerCase())),
    [iniciativas, q],
  )

  return (
    <>
      <PageHeader
        title="Iniciativas"
        subtitle="Visão global — todas as iniciativas, em todos os centros de custo"
        actions={
          <button
            onClick={() => navigate('/iniciativas/nova')}
            className="flex items-center gap-2 rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark"
          >
            <Icon.Plus width={16} height={16} /> Nova iniciativa
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
          Total: <span className="font-semibold text-gray-900">{iniciativas.length}</span> Iniciativas
        </span>
      </div>

      <div className="overflow-hidden rounded-card border border-hairline bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-hairline bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
              <th className="px-4 py-3 font-semibold">Nome da iniciativa</th>
              <th className="px-4 py-3 font-semibold">Centro(s) de custo vinculados</th>
              <th className="px-4 py-3 font-semibold">Orçamento total</th>
              <th className="px-4 py-3 text-right font-semibold">Ação</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((i) => {
              const centros = centrosDaIniciativa(i.id)
              const nVinc = vinculosDaIniciativa(i.id).length
              return (
                <tr
                  key={i.id}
                  className="border-b border-hairline last:border-0 hover:bg-gray-50"
                >
                  <td className="px-4 py-3">
                    <button
                      onClick={() => navigate(`/iniciativas/${i.id}/editar`)}
                      className="flex items-center gap-2 text-left"
                    >
                      <Icon.Rocket width={15} height={15} className="text-brand" />
                      <span className="font-semibold text-gray-900">{i.slug}</span>
                    </button>
                    <span className="mt-1 block text-[11px] text-gray-400">
                      {nVinc} vínculo{nVinc === 1 ? '' : 's'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {centros.length === 0 && (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                      {centros.map((cid) => (
                        <span
                          key={cid}
                          className="rounded-md bg-brand-light px-2 py-0.5 text-xs font-medium text-brand"
                        >
                          {centroById(cid)?.nome ?? cid}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-bold text-gray-900">
                    {currency(iniciativaTotal(i.id))}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => navigate(`/iniciativas/${i.id}/editar`)}
                        title="Editar"
                        className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-brand"
                      >
                        <Icon.Edit width={16} height={16} />
                      </button>
                      <button
                        onClick={() => setToDelete(i)}
                        title="Excluir"
                        className="rounded-md p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500"
                      >
                        <Icon.Trash width={16} height={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
            {rows.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-gray-400">
                  Nenhuma iniciativa encontrada.
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
          dispatch({ type: 'DELETE_INICIATIVA', id: toDelete.id })
          setToDelete(null)
        }}
        entityLabel={`a iniciativa "${toDelete?.slug ?? ''}"`}
        effects={[
          'A iniciativa deixa de aparecer na listagem global.',
          'Todos os vínculos desta iniciativa (com todos os centros de custo) serão removidos, junto com orçamentos e alertas.',
          'Os orçamentos deixam de compor o total dos centros de custo afetados.',
          'Esta ação, neste protótipo, não pode ser desfeita.',
        ]}
      />
    </>
  )
}
