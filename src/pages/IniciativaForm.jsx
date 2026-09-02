import { Fragment, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { PageHeader } from '../components/Layout.jsx'
import FormCard, { Field, TextInput, Select } from '../components/FormCard.jsx'
import AttentionBanner from '../components/AttentionBanner.jsx'
import Stepper from '../components/Stepper.jsx'
import Toast from '../components/Toast.jsx'
import EmailChipsInput from '../components/EmailChipsInput.jsx'
import { Icon } from '../components/icons.jsx'
import { useApp } from '../store/AppContext.jsx'
import {
  currency,
  somaOrcamentos,
  SLUG_RE,
  novoVinculo,
  PROVEDORES,
  ALERTA_OPCOES,
} from '../data/mock.js'

const STEPS = [
  'Instruções',
  'Dados da Iniciativa',
  'Vínculo com Centro de Custo',
  'Responsáveis',
]

export default function IniciativaForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const {
    centros,
    dispatch,
    uid,
    iniciativaById,
    vinculosDaIniciativa,
    gerenteById,
  } = useApp()

  const editing = Boolean(id)
  const existing = editing ? iniciativaById(id) : null

  const [step, setStep] = useState(0)
  const [slug, setSlug] = useState(existing?.slug ?? '')
  const [vinculos, setVinculos] = useState(() => {
    if (editing && existing) {
      const atuais = vinculosDaIniciativa(id).map((v) => ({
        id: v.id,
        centroId: v.centroId,
        orcamentos: v.orcamentos.map((o) => ({ ...o })),
        alerta: v.alerta ?? 'padrao',
      }))
      return atuais.length ? atuais : [novoVinculo(uid)]
    }
    return [novoVinculo(uid)]
  })
  const [emails, setEmails] = useState(() =>
    editing && existing
      ? [...new Set(vinculosDaIniciativa(id).flatMap((v) => v.emails ?? []))]
      : [],
  )
  const [ack24h, setAck24h] = useState(false)
  const [toastOpen, setToastOpen] = useState(false)

  const slugValido = SLUG_RE.test(slug)
  const vinculosOk =
    vinculos.length > 0 &&
    vinculos.every((v) => v.centroId && v.orcamentos.length > 0)
  const emailsOk = emails.length >= 2

  const podeAvancar =
    step === 0 || (step === 1 && slugValido) || (step === 2 && vinculosOk)

  const setVinculo = (vid, next) =>
    setVinculos((l) => l.map((v) => (v.id === vid ? next : v)))

  const setOrc = (v, oid, patch) =>
    setVinculo(v.id, {
      ...v,
      orcamentos: v.orcamentos.map((o) =>
        o.id === oid ? { ...o, ...patch } : o,
      ),
    })
  const addOrc = (v) =>
    setVinculo(v.id, {
      ...v,
      orcamentos: [
        ...v.orcamentos,
        { id: uid('o'), provedor: 'Provedor A', valor: 0 },
      ],
    })
  const removeOrc = (v, oid) =>
    setVinculo(v.id, {
      ...v,
      orcamentos: v.orcamentos.filter((o) => o.id !== oid),
    })

  const gestorDoVinculo = (v) => {
    const c = centros.find((x) => x.id === v.centroId)
    return c ? gerenteById(c.gerenteId) : null
  }

  const centrosDisponiveis = (vid) =>
    centros.filter(
      (c) => !vinculos.some((v) => v.id !== vid && v.centroId === c.id),
    )

  const totalPreview = vinculos.reduce(
    (s, v) => s + somaOrcamentos(v.orcamentos),
    0,
  )

  const enviar = () => {
    let iniciativaId = id
    if (editing) {
      dispatch({ type: 'UPDATE_INICIATIVA', payload: { id, slug } })
    } else {
      iniciativaId = uid('ini')
      dispatch({ type: 'CREATE_INICIATIVA', payload: { id: iniciativaId, slug } })
    }
    const full = vinculos.map((v) => ({
      id: v.id,
      iniciativaId,
      centroId: v.centroId,
      orcamentos: v.orcamentos,
      alerta: v.alerta,
      emails,
    }))
    if (editing) {
      dispatch({ type: 'SYNC_INICIATIVA_VINCULOS', iniciativaId, vinculos: full })
    } else {
      full.forEach((v) => dispatch({ type: 'CREATE_VINCULO', payload: v }))
    }
    setToastOpen(true)
  }

  if (editing && !existing) {
    return (
      <>
        <PageHeader title="Iniciativa não encontrada" />
        <button
          onClick={() => navigate('/iniciativas')}
          className="text-sm font-semibold text-brand"
        >
          Voltar para a listagem
        </button>
      </>
    )
  }

  return (
    <>
      <PageHeader
        title={editing ? 'Editar iniciativa' : 'Solicitação de nova iniciativa'}
        subtitle={editing ? existing.slug : undefined}
        actions={
          <button
            onClick={() => navigate('/iniciativas')}
            className="rounded-md border border-hairline bg-white px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
          >
            Voltar
          </button>
        }
      />

      <FormCard>
        <Stepper steps={STEPS} current={step} />

        <div className="min-h-[240px] pt-2">
          {step === 0 && (
            <div className="space-y-4">
              <h2 className="text-base font-semibold text-gray-900">
                Antes de começar
              </h2>
              <p className="text-sm text-gray-600">
                Uma iniciativa agrupa o investimento em nuvem de um objetivo de
                negócio e se conecta a um ou mais Centros de Custo por meio de um{' '}
                <strong>Vínculo</strong>.
              </p>
              <ul className="list-disc space-y-1 pl-5 text-sm text-gray-600">
                <li>
                  O <strong>orçamento por cloud</strong> e o{' '}
                  <strong>alerta de consumo</strong> ficam no Vínculo — o Centro
                  de Custo apenas agrega a soma.
                </li>
                <li>
                  Você pode criar mais de um Vínculo, um para cada Centro de
                  Custo participante.
                </li>
                <li>
                  Ao final, a solicitação é enviada para aprovação antes de
                  passar a valer.
                </li>
              </ul>
              <AttentionBanner
                variant="importante"
                actionLabel="Entendi"
                onAction={() => setStep(1)}
              >
                Esta é uma solicitação: os valores só passam a compor os Centros
                de Custo após a aprovação.
              </AttentionBanner>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-5">
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
              <Field label="Orçamento total da iniciativa (prévia)">
                <TextInput
                  readOnly
                  value={currency(totalPreview)}
                  className="font-bold"
                />
              </Field>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              {vinculos.map((v, idx) => {
                const gestor = gestorDoVinculo(v)
                return (
                  <div
                    key={v.id}
                    className="space-y-4 rounded-md border border-hairline p-4"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-900">
                        Vínculo {idx + 1}
                      </span>
                      {vinculos.length > 1 && (
                        <button
                          onClick={() =>
                            setVinculos((l) => l.filter((x) => x.id !== v.id))
                          }
                          className="flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-red-500"
                        >
                          <Icon.Trash width={14} height={14} /> Remover
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 gap-x-4 gap-y-4 md:grid-cols-2">
                      {/* col. esquerda — topo */}
                      <Field label="Centro de Custo pagador" required>
                        <Select
                          leftIcon={Icon.Search}
                          value={v.centroId}
                          onChange={(e) =>
                            setVinculo(v.id, { ...v, centroId: e.target.value })
                          }
                        >
                          <option value="">Selecione um centro de custo</option>
                          {centrosDisponiveis(v.id).map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.nome} ({c.codigo})
                            </option>
                          ))}
                        </Select>
                      </Field>

                      {/* col. direita — topo */}
                      <Field label="Gestor do centro de custo">
                        <TextInput
                          readOnly
                          value={
                            gestor ? `${gestor.nome} — ${gestor.email}` : '—'
                          }
                        />
                      </Field>

                      {/* linhas de orçamento: Provedor (esq.) + Orçamento mensal (dir.) */}
                      {v.orcamentos.map((o) => (
                        <Fragment key={o.id}>
                          <Field label="Provedor">
                            <Select
                              value={o.provedor}
                              onChange={(e) =>
                                setOrc(v, o.id, { provedor: e.target.value })
                              }
                            >
                              {PROVEDORES.map((p) => (
                                <option key={p} value={p}>
                                  {p}
                                </option>
                              ))}
                            </Select>
                          </Field>
                          <div className="flex items-start gap-2">
                            <Field
                              label="Orçamento mensal"
                              className="flex-1"
                            >
                              <TextInput
                                type="number"
                                min={0}
                                value={o.valor}
                                onChange={(e) =>
                                  setOrc(v, o.id, {
                                    valor: Number(e.target.value),
                                  })
                                }
                              />
                            </Field>
                            {v.orcamentos.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeOrc(v, o.id)}
                                title="Remover"
                                className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded border border-gray-300 text-gray-400 hover:text-red-500"
                              >
                                <Icon.Trash width={16} height={16} />
                              </button>
                            )}
                          </div>
                        </Fragment>
                      ))}

                      {/* col. esquerda — link adicionar */}
                      <div>
                        <button
                          type="button"
                          onClick={() => addOrc(v)}
                          className="flex items-center gap-1 text-sm font-semibold text-brand hover:text-brand-dark"
                        >
                          <Icon.Plus width={15} height={15} /> Adicionar orçamento
                          por cloud
                        </button>
                      </div>
                      <div className="hidden md:block" />

                      {/* col. esquerda — alerta */}
                      <Field label="Alerta de consumo">
                        <Select
                          value={v.alerta ?? 'padrao'}
                          onChange={(e) =>
                            setVinculo(v.id, { ...v, alerta: e.target.value })
                          }
                        >
                          {ALERTA_OPCOES.map((op) => (
                            <option key={op.value} value={op.value}>
                              {op.label}
                            </option>
                          ))}
                        </Select>
                      </Field>
                      <div className="hidden md:block" />
                    </div>
                  </div>
                )
              })}

              <button
                type="button"
                onClick={() => setVinculos((l) => [...l, novoVinculo(uid)])}
                className="flex items-center gap-1 rounded-md border border-brand px-3 py-2 text-sm font-semibold text-brand hover:bg-brand-light"
              >
                <Icon.Plus width={15} height={15} /> Associar outro centro de custo
              </button>

              {!ack24h && (
                <AttentionBanner
                  variant="importante"
                  actionLabel="Entendi"
                  onAction={() => setAck24h(true)}
                >
                  Os alertas serão enviados em até 24 horas, devido ao tempo
                  necessário para sincronização desses dados com os provedores.
                </AttentionBanner>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <p className="text-sm text-gray-600">
                Informe pelo menos 2 e-mails que receberão as notificações de
                consumo e o resultado da aprovação.
              </p>
              <Field
                label="Responsáveis técnicos"
                required
                error={
                  emails.length > 0 && !emailsOk
                    ? 'Adicione pelo menos 2 e-mails.'
                    : ''
                }
              >
                <EmailChipsInput
                  value={emails}
                  onChange={setEmails}
                  placeholder="Mínimo de 2 emails"
                />
              </Field>
              <p className="pl-1 text-xs text-gray-400">
                {emails.length} de no mínimo 2 e-mails
              </p>

              <div className="rounded-md border border-hairline p-4 text-sm text-gray-600">
                <p className="mb-2 font-semibold text-gray-900">
                  Resumo da solicitação
                </p>
                <p>
                  Iniciativa: <strong>{slug || '—'}</strong>
                </p>
                <p>
                  Vínculos:{' '}
                  <strong>
                    {vinculos.length} centro
                    {vinculos.length > 1 ? 's' : ''} de custo
                  </strong>
                </p>
                <p>
                  Orçamento total: <strong>{currency(totalPreview)}</strong>
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-hairline pt-4">
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="flex items-center gap-1.5 text-sm font-semibold text-brand hover:text-brand-dark disabled:text-gray-300"
          >
            <Icon.ArrowLeft width={16} height={16} /> Anterior
          </button>

          {step < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s + 1)}
              disabled={!podeAvancar}
              className="flex items-center gap-1.5 text-sm font-semibold text-brand hover:text-brand-dark disabled:text-gray-300"
            >
              Próximo <Icon.ArrowRight width={16} height={16} />
            </button>
          ) : (
            <button
              type="button"
              onClick={enviar}
              disabled={!emailsOk || toastOpen}
              className="rounded bg-brand px-5 py-2 text-sm font-semibold text-white hover:bg-brand-dark disabled:cursor-not-allowed disabled:bg-brand/40"
            >
              Enviar solicitação
            </button>
          )}
        </div>
      </FormCard>

      <Toast
        open={toastOpen}
        onClose={() => {
          setToastOpen(false)
          navigate('/iniciativas')
        }}
        actionLabel="Acompanhar na Central de Aprovações"
        onAction={() => navigate('/central-de-aprovacoes')}
      >
        Solicitação enviada! Os aprovadores serão notificados.
      </Toast>
    </>
  )
}
