import { useNavigate, useParams } from 'react-router-dom'
import { PageHeader } from '../components/Layout.jsx'
import FormCard from '../components/FormCard.jsx'
import { Icon } from '../components/icons.jsx'
import { useApp } from '../store/AppContext.jsx'
import { currency, somaProvedor, valorVinculo, PROVEDORES } from '../data/mock.js'

function StatTile({ label, value }) {
  return (
    <div className="rounded-card border border-hairline bg-white px-4 py-3">
      <p className="text-[11px] font-medium uppercase tracking-wide text-gray-500">{label}</p>
      <p className="mt-1 text-lg font-semibold text-gray-900">{value}</p>
    </div>
  )
}

function Badge({ children }) {
  return (
    <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
      {children}
    </span>
  )
}

function VinculoCard({ vinculo, centroNome }) {
  const workspaces = (vinculo.workspaces ?? []).map((w) => w.split('::')[1] ?? w)
  const provedores = [...new Set((vinculo.workspaces ?? []).map((w) => w.split('::')[0]))]
  const provedoresComOrcamento = PROVEDORES.filter((p) => somaProvedor(vinculo, p) > 0)

  return (
    <FormCard title={centroNome} description={`${workspaces.length} workspace(s) vinculado(s)`}>
      <div className="flex flex-wrap items-center gap-2">
        {provedores.length > 0 ? (
          provedores.map((p) => <Badge key={p}>{p}</Badge>)
        ) : (
          <span className="text-sm text-gray-400">Nenhum provedor vinculado.</span>
        )}
      </div>

      {workspaces.length > 0 && (
        <div>
          <p className="mb-1.5 text-[11px] font-medium uppercase tracking-wide text-gray-500">Workspaces</p>
          <ul className="space-y-1 text-sm text-gray-700">
            {workspaces.map((w) => (
              <li key={w}>{w}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="overflow-hidden rounded-md border border-hairline">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-hairline bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
              <th className="px-3 py-2 font-semibold">Provedor</th>
              <th className="px-3 py-2 text-right font-semibold">Orçamento</th>
            </tr>
          </thead>
          <tbody>
            {provedoresComOrcamento.map((p) => (
              <tr key={p} className="border-b border-hairline last:border-0">
                <td className="px-3 py-2 text-gray-700">{p}</td>
                <td className="px-3 py-2 text-right text-gray-900">{currency(somaProvedor(vinculo, p))}</td>
              </tr>
            ))}
            {provedoresComOrcamento.length === 0 && (
              <tr>
                <td colSpan={2} className="px-3 py-4 text-center text-gray-400">
                  Sem orçamento alocado.
                </td>
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr className="border-t border-hairline bg-gray-50">
              <td className="px-3 py-2 font-semibold text-gray-900">Total do vínculo</td>
              <td className="px-3 py-2 text-right font-semibold text-gray-900">{currency(valorVinculo(vinculo))}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </FormCard>
  )
}

/**
 * Visualização somente leitura de uma Iniciativa — sem edição, já que a
 * iniciativa vem do Vínculo automático. Mostra as informações mais
 * importantes: orçamento por Centro de Custo/Provedor, workspaces e
 * provedores vinculados.
 */
export default function IniciativaVisualizar() {
  const { id } = useParams()
  const navigate = useNavigate()
  const {
    iniciativaById,
    vinculosDaIniciativa,
    centrosDaIniciativa,
    centroById,
    iniciativaTotal,
  } = useApp()

  const iniciativa = iniciativaById(id)
  const vinculos = vinculosDaIniciativa(id)
  const centros = centrosDaIniciativa(id)
  const workspacesTotal = new Set(
    vinculos.flatMap((v) => (v.workspaces ?? []).map((w) => w.split('::')[1] ?? w)),
  ).size
  const provedoresTotal = new Set(
    vinculos.flatMap((v) => (v.workspaces ?? []).map((w) => w.split('::')[0])),
  ).size

  if (!iniciativa) {
    return (
      <>
        <PageHeader title="Iniciativa não encontrada" />
        <button
          onClick={() => navigate('/iniciativas-listagem')}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-brand hover:underline"
        >
          <Icon.ArrowLeft width={15} height={15} /> Voltar para Iniciativas
        </button>
      </>
    )
  }

  return (
    <>
      <button
        onClick={() => navigate('/iniciativas-listagem')}
        className="mb-3 inline-flex items-center gap-1.5 text-sm font-medium text-brand hover:underline"
      >
        <Icon.ArrowLeft width={15} height={15} /> Iniciativas
      </button>

      <PageHeader
        title={iniciativa.slug}
        subtitle="Visualização somente leitura — dados vindos do Vínculo automático. Sem edição por aqui."
      />

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile label="Orçamento total" value={currency(iniciativaTotal(id))} />
        <StatTile label="Centros de custo" value={centros.length} />
        <StatTile label="Workspaces" value={workspacesTotal} />
        <StatTile label="Provedores" value={provedoresTotal} />
      </div>

      <div className="space-y-4">
        {vinculos.map((v) => (
          <VinculoCard key={v.id} vinculo={v} centroNome={centroById(v.centroId)?.nome ?? v.centroId} />
        ))}
        {vinculos.length === 0 && (
          <div className="rounded-card border border-hairline bg-white px-5 py-10 text-center text-sm text-gray-400">
            Nenhum vínculo de Centro de Custo encontrado para esta iniciativa.
          </div>
        )}
      </div>
    </>
  )
}
