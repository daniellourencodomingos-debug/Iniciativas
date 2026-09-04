import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { PageHeader } from '../components/Layout.jsx'
import FormCard, { Field, TextInput, TextArea, Select } from '../components/FormCard.jsx'
import AttentionBanner from '../components/AttentionBanner.jsx'
import Stepper from '../components/Stepper.jsx'
import Toast from '../components/Toast.jsx'
import EmailChipsInput from '../components/EmailChipsInput.jsx'
import MultiSelectField from '../components/MultiSelectField.jsx'
import ContasField from '../components/ContasField.jsx'
import { Icon } from '../components/icons.jsx'
import { useApp } from '../store/AppContext.jsx'
import {
  currency,
  SLUG_RE,
  novoVinculo,
  orcamentosDeContas,
  PROVEDORES,
  WORKSPACES,
  SERVICOS,
  CONTAS_FATURAMENTO,
} from '../data/mock.js'

const STEPS = ['Instruções', 'Dados da Iniciativa', 'Vínculo', 'Responsáveis']

const WORKSPACE_OPTS = WORKSPACES.map((w) => ({ value: w, label: w }))

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
    centroTotal,
  } = useApp()

  const editing = Boolean(id)
  const existing = editing ? iniciativaById(id) : null

  const [step, setStep] = useState(0)
  const [slug, setSlug] = useState(existing?.slug ?? '')
  const [descricao, setDescricao] = useState(existing?.descricao ?? '')
  const [vinculos, setVinculos] = useState(() => {
    if (editing && existing) {
      const atuais = vinculosDaIniciativa(id).map((v) => {
        const base = novoVinculo(uid, v.centroId)
        return {
          ...base,
          id: v.id,
          centroId: v.centroId,
          contas: v.contas ?? base.contas,
          workspaces: v.workspaces?.length
            ? v.workspaces
            : v.workspace
              ? [v.workspace]
              : base.workspaces,
          orcamentoDirecionado:
            v.orcamentoDirecionado ?? base.orcamentoDirecionado,
          servico: v.servico ?? base.servico,
          alertas: v.alertas ?? base.alertas,
          emailsAlerta: v.emailsAlerta ?? v.emails ?? [],
          orcamentos: (v.orcamentos ?? []).map((o) => ({ ...o })),
        }
      })
      return atuais.length ? [atuais[0]] : [novoVinculo(uid)]
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
    vinculos.every(
      (v) =>
        v.centroId &&
        v.contas?.length > 0 &&
        v.workspaces?.length > 0 &&
        v.servico,
    )
  const emailsOk = emails.length >= 2

  const podeAvancar =
    step === 0 || (step === 1 && slugValido) || (step === 2 && vinculosOk)

  const setVinculo = (vid, next) =>
    setVinculos((l) => l.map((v) => (v.id === vid ? next : v)))

  const setAlerta = (v, aid, valor) =>
    setVinculo(v.id, {
      ...v,
      alertas: v.alertas.map((a) =>
        a.id === aid ? { ...a, valor: Math.min(100, Math.max(0, valor)) } : a,
      ),
    })
  const addAlerta = (v) =>
    setVinculo(v.id, {
      ...v,
      alertas: [...v.alertas, { id: uid('a'), valor: 50, fixo: false }],
    })
  const removeAlerta = (v, aid) =>
    setVinculo(v.id, {
      ...v,
      alertas: v.alertas.filter((a) => a.id !== aid),
    })

  const gestorDoVinculo = (v) => {
    const c = centros.find((x) => x.id === v.centroId)
    return c ? gerenteById(c.gerenteId) : null
  }

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
      contas: v.contas,
      workspaces: v.workspaces,
      orcamentoDirecionado: Number(v.orcamentoDirecionado) || 0,
      servico: v.servico,
      alertas: v.alertas,
      emailsAlerta: v.emailsAlerta,
      orcamentos: orcamentosDeContas(uid, v.contas),
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
                negócio e se conecta a um Centro de Custo por meio de um{' '}
                <strong>Vínculo</strong>.
              </p>
              <ul className="list-disc space-y-1 pl-5 text-sm text-gray-600">
                <li>
                  O <strong>Provedor/Conta, Workspace e Serviço</strong> e o{' '}
                  <strong>alerta de consumo</strong> ficam no Vínculo.
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
              <Field label="Descrição (Opcional)">
                <TextArea
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value.slice(0, 200))}
                  maxLength={200}
                  rows={4}
                  placeholder="Descreva o objetivo desta iniciativa..."
                />
                <span className="mt-1 block text-right text-[11px] text-gray-400">
                  {descricao.length}/200
                </span>
              </Field>
              <AttentionBanner>
                Verifique periodicamente o status desta iniciativa e exclua-a
                quando ela não for mais necessária — isso ajuda a manter os
                custos de nuvem sob controle.
              </AttentionBanner>
            </div>
          )}

          {step === 2 &&
            vinculos.map((v) => {
              const gestor = gestorDoVinculo(v)
              return (
                <div key={v.id} className="space-y-5">
                  <div className="grid grid-cols-1 gap-x-4 gap-y-4 md:grid-cols-2">
                    <Field label="Centro de Custo pagador" required>
                      <Select
                        leftIcon={Icon.Search}
                        value={v.centroId}
                        onChange={(e) =>
                          setVinculo(v.id, { ...v, centroId: e.target.value })
                        }
                      >
                        <option value="">Selecione o centro de custo</option>
                        {centros.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.nome} ({c.codigo})
                          </option>
                        ))}
                      </Select>
                    </Field>

                    <Field label="Gestor do centro de custo">
                      <TextInput
                        readOnly
                        value={
                          gestor
                            ? `${gestor.email} (somente leitura)`
                            : 'gestor@exemplo.com (somente leitura)'
                        }
                      />
                    </Field>
                  </div>

                  <div className="grid grid-cols-1 gap-x-4 gap-y-4 md:grid-cols-2">
                    <Field label="Orçamento total do centro de custo">
                      <TextInput
                        readOnly
                        value={
                          v.centroId
                            ? currency(centroTotal(v.centroId))
                            : 'Selecione um centro de custo'
                        }
                        className="font-bold"
                      />
                    </Field>

                    <Field
                      label="Orçamento direcionado para a iniciativa"
                      required
                      hint="Valor do orçamento do centro de custo reservado para esta iniciativa."
                    >
                      <TextInput
                        type="number"
                        min={0}
                        step="0.01"
                        value={v.orcamentoDirecionado ?? 0}
                        onChange={(e) =>
                          setVinculo(v.id, {
                            ...v,
                            orcamentoDirecionado: e.target.value,
                          })
                        }
                        placeholder="0,00"
                      />
                    </Field>
                  </div>

                  <ContasField
                    label="Contas"
                    providers={PROVEDORES}
                    contasPorProvedor={CONTAS_FATURAMENTO}
                    value={v.contas}
                    onChange={(contas) => setVinculo(v.id, { ...v, contas })}
                  />

                  <MultiSelectField
                    label="Workspace"
                    options={WORKSPACE_OPTS}
                    selected={v.workspaces}
                    onChange={(workspaces) =>
                      setVinculo(v.id, { ...v, workspaces })
                    }
                    placeholder="Selecione o(s) workspace(s)"
                  />

                  <Field label="Serviço">
                    <Select
                      value={v.servico}
                      onChange={(e) =>
                        setVinculo(v.id, { ...v, servico: e.target.value })
                      }
                    >
                      <option value="">Selecione o serviço</option>
                      {SERVICOS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </Select>
                  </Field>

                  <div>
                    <p className="mb-1 text-sm font-semibold text-gray-900">
                      Alerta de consumo
                    </p>
                    <p className="mb-4 text-sm text-gray-600">
                      Escolha o percentual de consumo para ser notificado por
                      email:
                    </p>

                    <div className="space-y-5">
                      {v.alertas.map((a) => (
                        <div key={a.id} className="flex items-start gap-3">
                          <div className="flex-1 pt-1">
                            <input
                              type="range"
                              min={0}
                              max={100}
                              value={a.valor}
                              disabled={a.fixo}
                              onChange={(e) =>
                                setAlerta(v, a.id, Number(e.target.value))
                              }
                              className="brand-range w-full disabled:opacity-50"
                            />
                            <div className="mt-1 flex justify-between text-xs text-gray-400">
                              <span>0%</span>
                              <span>100%</span>
                            </div>
                          </div>

                          <div className="w-20 shrink-0">
                            <Field>
                              <div className="flex items-center">
                                <TextInput
                                  type="number"
                                  min={0}
                                  max={100}
                                  disabled={a.fixo}
                                  value={a.valor}
                                  onChange={(e) =>
                                    setAlerta(v, a.id, Number(e.target.value))
                                  }
                                  className="text-center"
                                />
                                <span className="pr-2 text-sm text-gray-400">
                                  %
                                </span>
                              </div>
                            </Field>
                          </div>

                          <p className="w-52 shrink-0 pt-1 text-xs text-gray-400">
                            Espaço acima de 99GB em disco disponível para o
                            sistema raiz dos node.
                          </p>

                          {!a.fixo && (
                            <button
                              type="button"
                              onClick={() => removeAlerta(v, a.id)}
                              title="Remover"
                              className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded border border-gray-300 text-gray-400 hover:text-red-500"
                            >
                              <Icon.Trash width={16} height={16} />
                            </button>
                          )}
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={() => addAlerta(v)}
                        title="Adicionar limite de alerta"
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-brand text-brand hover:bg-brand-light"
                      >
                        <Icon.Plus width={16} height={16} />
                      </button>
                    </div>
                  </div>

                  {!ack24h && (
                    <AttentionBanner
                      actionLabel="Entendi"
                      onAction={() => setAck24h(true)}
                    >
                      Os alertas serão enviados em até 24 horas, devido ao
                      tempo necessário para sincronização desses dados com os
                      provedores.
                    </AttentionBanner>
                  )}

                  <Field label="Adicione os membros que irão receber as notificações de alertas">
                    <EmailChipsInput
                      value={v.emailsAlerta}
                      onChange={(list) =>
                        setVinculo(v.id, { ...v, emailsAlerta: list })
                      }
                      placeholder="Adicionar usuários"
                    />
                  </Field>
                </div>
              )
            })}

          {step === 3 && (
            <div className="space-y-5">
              <p className="text-sm text-gray-600">
                Informe pelo menos 2 e-mails que receberão as notificações de
                consumo e o resultado da aprovação.
              </p>

              <AttentionBanner variant="importante">
                Esta solicitação passa por <strong>duas etapas de aprovação</strong>:
                o time FinOps e o gestor responsável pelo centro de custo. Por
                isso, informe no mínimo 2 e-mails — cada aprovador é notificado
                na etapa correspondente.
              </AttentionBanner>

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
                  Vínculo:{' '}
                  <strong>
                    {vinculos[0]?.centroId
                      ? centros.find((c) => c.id === vinculos[0].centroId)
                          ?.nome
                      : '—'}
                  </strong>
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
