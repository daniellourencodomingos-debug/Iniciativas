import { Link, useNavigate, useParams } from 'react-router-dom'
import { PageHeader } from '../components/Layout.jsx'
import ExpandableSection from '../components/ExpandableSection.jsx'
import { Icon } from '../components/icons.jsx'
import { useApp } from '../store/AppContext.jsx'
import { currency, formatDate, statusIniciativaInfo } from '../data/mock.js'

function InfoCard({ icon: IconCmp, label, children }) {
  return (
    <div className="rounded-card border border-hairline bg-white px-5 py-4">
      <div className="mb-2 flex items-center gap-1.5 text-gray-400">
        {IconCmp && <IconCmp width={15} height={15} />}
        <p className="text-[11px] font-medium uppercase tracking-wide">{label}</p>
      </div>
      {children}
    </div>
  )
}

function StatusDot({ status }) {
  const info = statusIniciativaInfo(status)
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-600">
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: info.color }} />
      {info.label}
    </span>
  )
}

function Badge({ children }) {
  return (
    <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
      {children}
    </span>
  )
}

/**
 * Visualização somente leitura de uma Iniciativa. A iniciativa vem de uma
 * base externa (via Vínculo automatizado de Centro de custo + Iniciativa),
 * por isso mostramos só o que essa base traz: identidade, centro de custo,
 * orçamento agregado, provedores e workspaces vinculados. Sem alerta ou
 * previsão de consumo aqui — esses dados só existem quando o cadastro é
 * feito dentro do nosso produto, o que não é o caso da Iniciativa.
 */
export default function IniciativaVisualizar() {
  const { id } = useParams()
  const navigate = useNavigate()
  const {
    iniciativaById,
    centrosDaIniciativa,
    centroById,
    iniciativaTotal,
    iniciativasDoCentro,
    vinculosDaIniciativa,
  } = useApp()

  const iniciativa = iniciativaById(id)
  const centros = centrosDaIniciativa(id)
  const vinculos = vinculosDaIniciativa(id)

  const workspacesList = [
    ...new Set(vinculos.flatMap((v) => (v.workspaces ?? []).map((w) => w.split('::')[1] ?? w))),
  ]
  const provedoresList = [
    ...new Set(vinculos.flatMap((v) => (v.workspaces ?? []).map((w) => w.split('::')[0]))),
  ]

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

      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <InfoCard icon={Icon.Building} label="Centro de custo">
          {centros.length === 0 ? (
            <p className="text-sm text-gray-400">Nenhum centro de custo vinculado.</p>
          ) : (
            <div className="space-y-1">
              {centros.map((cid) => {
                const c = centroById(cid)
                return (
                  <p key={cid} className="text-sm font-semibold text-gray-900">
                    {c?.nome ?? cid}
                    {c?.codigo && (
                      <span className="ml-1.5 font-normal text-gray-400">· {c.codigo}</span>
                    )}
                  </p>
                )
              })}
            </div>
          )}
        </InfoCard>

        <InfoCard icon={Icon.Wallet} label="Orçamento da iniciativa">
          <p className="text-lg font-semibold text-gray-900">{currency(iniciativaTotal(id))}</p>
        </InfoCard>

        <InfoCard icon={Icon.Cloud} label="Provedores e workspaces">
          {provedoresList.length === 0 ? (
            <p className="text-sm text-gray-400">Nenhum provedor vinculado.</p>
          ) : (
            <>
              <div className="flex flex-wrap gap-1.5">
                {provedoresList.map((p) => (
                  <Badge key={p}>{p}</Badge>
                ))}
              </div>
              <ul className="mt-2.5 space-y-1 text-sm text-gray-700">
                {workspacesList.map((w) => (
                  <li key={w}>{w}</li>
                ))}
              </ul>
            </>
          )}
        </InfoCard>
      </div>

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
    </>
  )
}
