import { Link, useNavigate, useParams } from 'react-router-dom'
import { PageHeader } from '../components/Layout.jsx'
import ExpandableSection from '../components/ExpandableSection.jsx'
import { Icon } from '../components/icons.jsx'
import { useApp } from '../store/AppContext.jsx'
import { currency, formatDate, idDoWorkspace, statusIniciativaInfo } from '../data/mock.js'

function StatusDot({ status }) {
  const info = statusIniciativaInfo(status)
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-600">
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: info.color }} />
      {info.label}
    </span>
  )
}

/**
 * Visualização somente leitura de uma Iniciativa. A iniciativa vem de uma
 * base externa (via Vínculo automatizado de Centro de custo + Iniciativa),
 * por isso mostramos só o que essa base traz: identidade, centro(s) de
 * custo, orçamento agregado, provedores e workspaces vinculados. Sem alerta
 * ou previsão de consumo aqui — esses dados só existem quando o cadastro é
 * feito dentro do nosso produto, o que não é o caso da Iniciativa.
 *
 * Qualquer relação 1-para-N (centros de custo, provedores/workspaces,
 * outras iniciativas) vira ExpandableSection + tabela, nunca texto
 * empilhado dentro de um card — mesmo quando hoje só tem 1 item, porque o
 * padrão não pode depender de quantidade.
 */
export default function IniciativaVisualizar() {
  const { id } = useParams()
  const navigate = useNavigate()
  const {
    iniciativaById,
    centrosDaIniciativa,
    centroById,
    centroTotal,
    iniciativaTotal,
    iniciativasDoCentro,
    vinculosDaIniciativa,
  } = useApp()

  const iniciativa = iniciativaById(id)
  const centros = centrosDaIniciativa(id)
  const vinculos = vinculosDaIniciativa(id)

  // Linhas Provedor + Workspace, uma por workspace vinculado (mesma forma
  // "Provedor::workspace" usada em todo o app), ordenadas por provedor.
  const workspaceRows = [
    ...new Set(vinculos.flatMap((v) => v.workspaces ?? [])),
  ]
    .map((w) => {
      const [provedor, nome] = w.split('::')
      return { key: w, provedor: provedor ?? '—', nome: nome ?? w }
    })
    .sort((a, b) => a.provedor.localeCompare(b.provedor) || a.nome.localeCompare(b.nome))

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

  // Outras iniciativas que compartilham algum dos centros de custo desta,
  // sem repetir a própria iniciativa.
  const outrasIds = [...new Set(centros.flatMap((cid) => iniciativasDoCentro(cid)))].filter(
    (oid) => oid !== id,
  )

  return (
    <>
      <nav className="mb-2 flex items-center gap-1.5 text-sm">
        <Link to="/iniciativas-listagem" className="font-medium text-brand hover:underline">
          Iniciativas
        </Link>
        <Icon.Chevron width={11} height={11} className="text-gray-300" />
        <span className="text-gray-400">{iniciativa.slug}</span>
      </nav>

      <PageHeader
        title={iniciativa.slug}
        subtitle={`Criada em ${formatDate(iniciativa.criadoEm)}`}
        actions={<StatusDot status={iniciativa.status} />}
      />

      <div className="mb-6 rounded-card border border-hairline bg-white px-5 py-4">
        <div className="mb-1 flex items-center gap-1.5 text-gray-400">
          <Icon.Wallet width={15} height={15} />
          <p className="text-[11px] font-medium uppercase tracking-wide">Orçamento da iniciativa</p>
        </div>
        <p className="text-lg font-semibold text-gray-900">{currency(iniciativaTotal(id))}</p>
      </div>

      <div className="space-y-4">
        <ExpandableSection title="Centro de custo" badge={centros.length} defaultOpen>
          {centros.length === 0 ? (
            <p className="text-sm text-gray-400">Nenhum centro de custo vinculado.</p>
          ) : (
            <div className="overflow-hidden rounded-md border border-hairline">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-hairline bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
                    <th className="px-3 py-2 font-semibold">Centro de custo</th>
                    <th className="px-3 py-2 font-semibold">Código</th>
                    <th className="px-3 py-2 text-right font-semibold">Orçamento do centro</th>
                  </tr>
                </thead>
                <tbody>
                  {centros.map((cid) => {
                    const c = centroById(cid)
                    return (
                      <tr key={cid} className="border-b border-hairline last:border-0">
                        <td className="px-3 py-2 text-gray-900">{c?.nome ?? cid}</td>
                        <td className="px-3 py-2 text-gray-500">{c?.codigo ?? '—'}</td>
                        <td className="px-3 py-2 text-right text-gray-900">
                          {currency(centroTotal(cid))}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </ExpandableSection>

        <ExpandableSection title="Provedores e workspaces" badge={workspaceRows.length} defaultOpen>
          {workspaceRows.length === 0 ? (
            <p className="text-sm text-gray-400">Nenhum workspace vinculado.</p>
          ) : (
            <div className="overflow-hidden rounded-md border border-hairline">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-hairline bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
                    <th className="px-3 py-2 font-semibold">Provedor</th>
                    <th className="px-3 py-2 font-semibold">Workspace</th>
                    <th className="px-3 py-2 font-semibold">ID</th>
                  </tr>
                </thead>
                <tbody>
                  {workspaceRows.map((row) => (
                    <tr key={row.key} className="border-b border-hairline last:border-0">
                      <td className="px-3 py-2 text-gray-700">{row.provedor}</td>
                      <td className="px-3 py-2 text-gray-900">{row.nome}</td>
                      <td className="px-3 py-2 text-gray-400">{idDoWorkspace(row.nome)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </ExpandableSection>

        <ExpandableSection title="Outras iniciativas do centro de custo" badge={outrasIds.length} defaultOpen>
          {outrasIds.length === 0 ? (
            <p className="text-sm text-gray-400">
              Nenhuma outra iniciativa associada a este centro de custo.
            </p>
          ) : (
            <div className="overflow-hidden rounded-md border border-hairline">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-hairline bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
                    <th className="px-3 py-2 font-semibold">Iniciativa</th>
                    <th className="px-3 py-2 text-right font-semibold">Orçamento</th>
                    <th className="w-10 px-3 py-2" />
                  </tr>
                </thead>
                <tbody>
                  {outrasIds.map((oid) => {
                    const o = iniciativaById(oid)
                    if (!o) return null
                    return (
                      <tr
                        key={oid}
                        className="cursor-pointer border-b border-hairline last:border-0 hover:bg-gray-50"
                        onClick={() => navigate(`/iniciativas/${oid}`)}
                      >
                        <td className="px-3 py-2 text-gray-900">{o.slug}</td>
                        <td className="px-3 py-2 text-right text-gray-900">
                          {currency(iniciativaTotal(oid))}
                        </td>
                        <td className="px-3 py-2 text-right text-gray-400">
                          <Icon.Chevron width={16} height={16} />
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </ExpandableSection>
      </div>
    </>
  )
}
