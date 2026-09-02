import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { PageHeader } from '../components/Layout.jsx'
import FormCard, { Field, TextInput, Select } from '../components/FormCard.jsx'
import AttentionBanner from '../components/AttentionBanner.jsx'
import ExpandableSection from '../components/ExpandableSection.jsx'
import VinculoEditor from '../components/VinculoEditor.jsx'
import { Icon } from '../components/icons.jsx'
import { useApp } from '../store/AppContext.jsx'
import { currency, somaOrcamentos, SLUG_RE, novoVinculo } from '../data/mock.js'

export default function CentroDeCustoForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const {
    centros,
    gerentes,
    dispatch,
    uid,
    centroById,
    centroTotal,
    vinculosDoCentro,
    iniciativaById,
    iniciativaBySlug,
  } = useApp()

  const editing = Boolean(id)
  const existing = editing ? centroById(id) : null

  const [nome, setNome] = useState(existing?.nome ?? '')
  const [codigo, setCodigo] = useState(existing?.codigo ?? '')
  const [gerenteId, setGerenteId] = useState(existing?.gerenteId ?? '')
  const [ackPermanente, setAckPermanente] = useState(false)

  const valido = nome.trim() && codigo.trim() && gerenteId

  const salvar = () => {
    if (editing) {
      dispatch({
        type: 'UPDATE_CENTRO',
        payload: { id, nome: nome.trim(), codigo: codigo.trim(), gerenteId },
      })
      navigate('/centros-de-custo')
    } else {
      const novoId = uid('cc')
      dispatch({
        type: 'CREATE_CENTRO',
        payload: { id: novoId, nome: nome.trim(), codigo: codigo.trim(), gerenteId },
      })
      // Vínculos só podem ser criados na edição.
      navigate(`/centros-de-custo/${novoId}/editar`)
    }
  }

  if (editing && !existing) {
    return (
      <>
        <PageHeader title="Centro de custo não encontrado" />
        <button
          onClick={() => navigate('/centros-de-custo')}
          className="text-sm font-semibold text-brand"
        >
          Voltar para a listagem
        </button>
      </>
    )
  }

  const vinculos = editing ? vinculosDoCentro(id) : []

  return (
    <>
      <PageHeader
        title={editing ? 'Editar centro de custo' : 'Novo centro de custo'}
        subtitle={editing ? existing.codigo : 'Preencha os dados para cadastrar'}
        actions={
          <button
            onClick={() => navigate('/centros-de-custo')}
            className="rounded-md border border-hairline bg-white px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
          >
            Voltar
          </button>
        }
      />

      <div className="space-y-6">
        <FormCard
          title="Dados do centro de custo"
          actions={
            <>
              <button
                onClick={() => navigate('/centros-de-custo')}
                className="rounded-md border border-hairline bg-white px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={salvar}
                disabled={!valido}
                className="rounded-md bg-brand px-6 py-2 text-sm font-semibold text-white hover:bg-brand-dark disabled:cursor-not-allowed disabled:bg-brand/40"
              >
                {editing ? 'Salvar' : 'Cadastrar'}
              </button>
            </>
          }
        >
          <Field
            label="Nome do centro de custo"
            required
            hint="Certifique-se de que o nome será de fácil compreensão"
          >
            <TextInput
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex.: Plataforma de Dados"
            />
          </Field>

          <Field
            label="Código do centro de custo"
            required
            hint="mantenha um padrão para o entendimento geral"
          >
            <TextInput
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              placeholder="Ex.: PLAT-DATA-001"
              disabled={editing}
            />
          </Field>

          {!ackPermanente && (
            <AttentionBanner actionLabel="Entendi" onAction={() => setAckPermanente(true)}>
              Uma vez criado, o centro de custo não poderá ser excluído do banco de dados.
              O código do centro de custo será único e permanente.
            </AttentionBanner>
          )}

          <Field label="Gerente do centro de custo" required>
            <Select
              value={gerenteId}
              onChange={(e) => setGerenteId(e.target.value)}
            >
              <option value="">Selecione um gerente</option>
              {gerentes.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.nome} — {g.email}
                </option>
              ))}
            </Select>
          </Field>
        </FormCard>

        <ExpandableSection title="Itens" subtitle="workspaces">
          <div className="space-y-3">
            <p className="text-sm text-gray-500">
              O vínculo de workspaces é gerenciado no fluxo existente do produto.
            </p>
            <button
              type="button"
              className="flex items-center gap-1 rounded-md border border-brand px-3 py-1.5 text-sm font-semibold text-brand hover:bg-brand-light"
            >
              <Icon.Plus width={15} height={15} /> Vincular workspace
            </button>
          </div>
        </ExpandableSection>

        {editing && (
          <>
            <FormCard title="Orçamento total do Centro de Custo">
              <Field label="Orçamento total do Centro de Custo">
                <TextInput
                  readOnly
                  value={currency(centroTotal(id))}
                  className="text-lg font-bold"
                />
              </Field>
              <p className="text-xs text-gray-400">
                Soma automática de todas as linhas de orçamento de todos os vínculos
                associados. O centro de custo não possui orçamento próprio.
              </p>
            </FormCard>

            <VinculosComIniciativas
              centroId={id}
              vinculos={vinculos}
              iniciativaById={iniciativaById}
              iniciativaBySlug={iniciativaBySlug}
              dispatch={dispatch}
              uid={uid}
            />
          </>
        )}
      </div>
    </>
  )
}

function VinculosComIniciativas({
  centroId,
  vinculos,
  iniciativaById,
  iniciativaBySlug,
  dispatch,
  uid,
}) {
  const [showForm, setShowForm] = useState(false)
  const [slug, setSlug] = useState('')
  const [draft, setDraft] = useState(() => {
    const v = novoVinculo(uid, centroId)
    delete v.centroId
    return v
  })

  const slugValido = SLUG_RE.test(slug)
  const temOrcamento = draft.orcamentos.length > 0
  const podeAssociar = slugValido && temOrcamento

  const resetForm = () => {
    const v = novoVinculo(uid, centroId)
    delete v.centroId
    setDraft(v)
    setSlug('')
    setShowForm(false)
  }

  const associar = () => {
    const existente = iniciativaBySlug(slug)
    let iniciativaId
    if (existente) {
      iniciativaId = existente.id
    } else {
      iniciativaId = uid('ini')
      dispatch({ type: 'CREATE_INICIATIVA', payload: { id: iniciativaId, slug } })
    }
    dispatch({
      type: 'CREATE_VINCULO',
      payload: {
        id: uid('v'),
        iniciativaId,
        centroId,
        orcamentos: draft.orcamentos,
        alerta: draft.alerta,
        emails: draft.emails,
      },
    })
    resetForm()
  }

  return (
    <FormCard
      title="Vínculos com Iniciativas"
      description="Cada vínculo (Iniciativa + este Centro de Custo) carrega seu próprio orçamento por cloud, alerta de consumo e destinatários."
    >
      <div>
        {!showForm ? (
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="flex items-center gap-1 rounded-md border border-brand px-3 py-1.5 text-sm font-semibold text-brand hover:bg-brand-light"
          >
            <Icon.Plus width={15} height={15} /> Associar iniciativa
          </button>
        ) : (
          <div className="space-y-5 rounded-md border border-brand/30 bg-brand-light/40 p-4">
            <Field
              label="Nome da iniciativa"
              required
              hint='minúsculas, números e hífen. Ex.: "aceleracao-de-agentes-ia"'
              error={slug && !slugValido ? 'Formato de slug inválido.' : ''}
            >
              <TextInput
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase())}
                placeholder="aceleracao-de-agentes-ia"
              />
            </Field>
            {slugValido && iniciativaBySlug(slug) && (
              <p className="-mt-3 text-xs text-brand">
                Iniciativa já existe — este vínculo será adicionado a ela.
              </p>
            )}

            <VinculoEditor value={draft} onChange={setDraft} />

            <div className="flex justify-end gap-2">
              <button
                onClick={resetForm}
                className="rounded-md border border-hairline bg-white px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={associar}
                disabled={!podeAssociar}
                className="rounded-md bg-brand px-4 py-1.5 text-sm font-semibold text-white hover:bg-brand-dark disabled:bg-brand/40"
              >
                Associar
              </button>
            </div>
          </div>
        )}
      </div>

      {vinculos.length === 0 && !showForm && (
        <p className="text-sm text-gray-400">Nenhuma iniciativa vinculada ainda.</p>
      )}

      <div className="space-y-4">
        {vinculos.map((v) => {
          const ini = iniciativaById(v.iniciativaId)
          return (
            <div key={v.id} className="rounded-md border border-hairline p-4">
              <div className="mb-4 flex items-center gap-2">
                <Icon.Rocket width={16} height={16} className="text-brand" />
                <span className="font-semibold text-gray-900">
                  {ini?.slug ?? '—'}
                </span>
                <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-gray-500">
                  vínculo
                </span>
                <span className="ml-auto text-sm text-gray-500">
                  Subtotal:{' '}
                  <span className="font-bold text-gray-800">
                    {currency(somaOrcamentos(v.orcamentos))}
                  </span>
                </span>
                <button
                  onClick={() => dispatch({ type: 'DELETE_VINCULO', id: v.id })}
                  title="Remover vínculo"
                  className="rounded-md p-1 text-gray-400 hover:bg-red-50 hover:text-red-500"
                >
                  <Icon.Trash width={16} height={16} />
                </button>
              </div>
              <VinculoEditor
                value={v}
                onChange={(next) =>
                  dispatch({ type: 'UPDATE_VINCULO', payload: next })
                }
              />
            </div>
          )
        })}
      </div>
    </FormCard>
  )
}
