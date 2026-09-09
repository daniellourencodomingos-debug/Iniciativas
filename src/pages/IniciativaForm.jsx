import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { PageHeader } from '../components/Layout.jsx'
import FormCard, { Field, TextInput, TextArea, Select, CurrencyInput } from '../components/FormCard.jsx'
import AttentionBanner from '../components/AttentionBanner.jsx'
import Stepper from '../components/Stepper.jsx'
import Toast from '../components/Toast.jsx'
import EmailChipsInput from '../components/EmailChipsInput.jsx'
import VincularWorkspaceModal from '../components/VincularWorkspaceModal.jsx'
import Avatar from '../components/Avatar.jsx'
import { Icon } from '../components/icons.jsx'
import { useApp } from '../store/AppContext.jsx'
import {
  currency,
  SLUG_RE,
  novoVinculo,
  somaMensal,
  distribuirIgualmente,
  setValorMes,
} from '../data/mock.js'

const STEPS = ['Instruções', 'Dados da Iniciativa', 'Vínculo', 'Responsáveis']

/** Ícone "?" com dica ao passar o mouse — usado nos títulos de seção do Vínculo. */
function InfoTooltip({ text }) {
  return (
    <span className="group relative inline-flex">
      <Icon.Info width={14} height={14} className="text-gray-400 hover:text-brand" />
      <span className="pointer-events-none absolute left-1/2 top-full z-10 mt-2 w-64 -translate-x-1/2 rounded-md bg-gray-900 px-2.5 py-1.5 text-xs leading-relaxed text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
        {text}
      </span>
    </span>
  )
}

export default function IniciativaForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const {
    centros,
    iniciativas,
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
          workspaces: v.workspaces?.length
            ? v.workspaces
            : v.workspace
              ? [v.workspace]
              : base.workspaces,
          distribuicaoAutomatica: v.distribuicaoAutomatica ?? base.distribuicaoAutomatica,
          orcamentoAnual: v.orcamentoAnual ?? base.orcamentoAnual,
          orcamentoMensal: v.orcamentoMensal?.length
            ? v.orcamentoMensal.map((m) => ({ ...m }))
            : base.orcamentoMensal,
          alertas: v.alertas ?? base.alertas,
          emailsAlerta: v.emailsAlerta?.length
            ? v.emailsAlerta
            : v.emails?.length
              ? v.emails
              : base.emailsAlerta,
        }
      })
      // mostra todos os vínculos existentes (uma iniciativa pode estar associada
      // a mais de um centro de custo, cada um com seu próprio orçamento)
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
  const [pickerAberto, setPickerAberto] = useState(null)
  const [avisoToggle, setAvisoToggle] = useState({})
  const [zeroAck, setZeroAck] = useState({})

  const slugValido = SLUG_RE.test(slug)
  const vinculosOk =
    vinculos.length > 0 &&
    vinculos.every(
      (v) => v.centroId && v.workspaces?.length > 0 && somaMensal(v.orcamentoMensal) > 0,
    )
  const emailsOk = emails.length >= 2

  const nomeDuplicado =
    slugValido && iniciativas.some((i) => i.slug === slug && i.id !== id)

  const podeAvancar =
    step === 0 ||
    (step === 1 && slugValido && !nomeDuplicado) ||
    (step === 2 && vinculosOk)

  const setVinculo = (vid, next) =>
    setVinculos((l) => l.map((v) => (v.id === vid ? next : v)))

  const removeVinculo = (vid) =>
    setVinculos((l) => (l.length > 1 ? l.filter((v) => v.id !== vid) : l))

  const aplicarDistribuicao = (v, ligar) => {
    setAvisoToggle((a) => ({ ...a, [v.id]: false }))
    if (ligar) {
      const anual = Number(v.orcamentoAnual) || somaMensal(v.orcamentoMensal)
      setVinculo(v.id, {
        ...v,
        distribuicaoAutomatica: true,
        orcamentoAnual: anual,
        orcamentoMensal: distribuirIgualmente(v.orcamentoMensal, anual),
      })
    } else {
      setVinculo(v.id, { ...v, distribuicaoAutomatica: false })
    }
  }

  const onToggleDistribuicao = (v) => {
    const mesesPreenchidos = v.orcamentoMensal.some((m) => Number(m.valor) > 0)
    if (!v.distribuicaoAutomatica && mesesPreenchidos) {
      setAvisoToggle((a) => ({ ...a, [v.id]: true }))
      return
    }
    aplicarDistribuicao(v, !v.distribuicaoAutomatica)
  }

  const setOrcamentoAnual = (v, valor) =>
    setVinculo(v.id, {
      ...v,
      orcamentoAnual: valor,
      orcamentoMensal: v.distribuicaoAutomatica
        ? distribuirIgualmente(v.orcamentoMensal, valor)
        : v.orcamentoMensal,
    })

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
      workspaces: v.workspaces,
      distribuicaoAutomatica: v.distribuicaoAutomatica,
      orcamentoAnual: v.orcamentoAnual,
      orcamentoMensal: v.orcamentoMensal,
      alertas: v.alertas,
      emailsAlerta: v.emailsAlerta,
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
                  O <strong>Centro de Custo pagador</strong>, o{' '}
                  <strong>Workspace</strong> e o <strong>orçamento</strong>{' '}
                  (distribuído pelos 12 meses do ano) ficam no Vínculo.
                </li>
                <li>
                  Uma iniciativa pode ter mais de um Vínculo — um por Centro
                  de Custo — cada um com seu próprio orçamento.
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
                error={
                  slug && !slugValido
                    ? 'Formato de slug inválido.'
                    : nomeDuplicado
                      ? 'Já existe uma iniciativa com este nome.'
                      : ''
                }
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

          {step === 2 && (
            <div className="space-y-8">
              {vinculos.map((v) => {
                const gestor = gestorDoVinculo(v)
                const centro = centros.find((c) => c.id === v.centroId)
                const totalMensal = somaMensal(v.orcamentoMensal)
                const mesesZerados = v.orcamentoMensal.some(
                  (m) => Number(m.valor) === 0,
                )
                const nItens = v.workspaces.length

                return (
                  <div key={v.id} className="space-y-5">
                    {vinculos.length > 1 && (
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-gray-900">
                          Vínculo {vinculos.indexOf(v) + 1}
                        </p>
                        <button
                          type="button"
                          onClick={() => removeVinculo(v.id)}
                          className="flex items-center gap-1 text-xs font-semibold text-red-500 hover:text-red-600"
                        >
                          <Icon.Trash width={14} height={14} /> Remover vínculo
                        </button>
                      </div>
                    )}

                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-semibold text-gray-900">
                        Centro de custo pagador
                      </p>
                      <InfoTooltip text="O centro de custo que terá parte do seu orçamento reservada para essa iniciativa." />
                    </div>

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

                    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                      <div className="rounded-md border border-hairline p-3">
                        <p className="text-xs text-gray-500">Centro de custo</p>
                        <p className="text-sm font-semibold text-gray-900">
                          {centro?.nome ?? '—'}
                        </p>
                        <p className="mt-1 text-xs text-gray-400">
                          Código: {centro?.codigo ?? '—'}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 rounded-md border border-hairline p-3">
                        <Avatar name={gestor?.nome ?? '?'} size={32} />
                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            {gestor?.nome ?? '—'}
                          </p>
                          <p className="text-xs text-gray-400">Gestor(a)</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 rounded-md border border-[#C6D4EC] bg-[#EEF2FB] p-3">
                        <Icon.Wallet width={18} height={18} className="shrink-0 text-brand" />
                        <div>
                          <p className="text-xs text-brand">
                            Orçamento do ano Atual
                          </p>
                          <p className="text-sm font-bold text-gray-900">
                            {v.centroId
                              ? currency(centroTotal(v.centroId))
                              : '—'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <p className="text-sm font-semibold text-gray-900">
                          Orçamento direcionado para essa iniciativa
                        </p>
                        <InfoTooltip text="Este valor é retirado do orçamento total do Centro de Custo selecionado — não é um orçamento novo." />
                      </div>
                      <p className="text-sm text-gray-600">
                        Defina o valor que será direcionado para essa iniciativa
                      </p>
                    </div>

                    <div className="flex items-center justify-between rounded-md border border-hairline px-3 py-2.5">
                      <span className="text-sm text-gray-600">
                        {nItens} {nItens === 1 ? 'item' : 'itens'}
                      </span>
                      <button
                        type="button"
                        onClick={() => setPickerAberto(v.id)}
                        className="text-sm font-semibold text-brand hover:text-brand-dark"
                      >
                        Vincular workspace
                      </button>
                    </div>

                    <Field
                      label="Orçamento anual desta iniciativa"
                      required
                      hint="Valor total do ano — depois você escolhe como distribuir pelos 12 meses abaixo."
                    >
                      <CurrencyInput
                        value={v.orcamentoAnual}
                        onChange={(valor) => setOrcamentoAnual(v, valor)}
                      />
                    </Field>

                    <div className="flex items-center justify-between rounded-md border border-hairline p-3">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          Distribuir automaticamente
                        </p>
                        <p className="text-xs text-gray-500">
                          Divide o orçamento anual igualmente pelos 12 meses
                          abaixo — cada mês continua editável depois. Desligado,
                          você preenche cada mês manualmente.
                        </p>
                      </div>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={v.distribuicaoAutomatica}
                        onClick={() => onToggleDistribuicao(v)}
                        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                          v.distribuicaoAutomatica ? 'bg-brand' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${
                            v.distribuicaoAutomatica ? 'left-[22px]' : 'left-0.5'
                          }`}
                        />
                      </button>
                    </div>

                    {avisoToggle[v.id] && (
                      <AttentionBanner
                        actionLabel="Substituir valores"
                        onAction={() => aplicarDistribuicao(v, true)}
                      >
                        Isso vai substituir os valores já preenchidos.
                      </AttentionBanner>
                    )}

                    {!v.distribuicaoAutomatica && (
                      <Field
                        label="Total definido"
                        hint="Soma dos 12 meses preenchidos manualmente abaixo."
                      >
                        <TextInput
                          readOnly
                          value={currency(totalMensal)}
                          className="font-bold"
                        />
                      </Field>
                    )}

                    <div>
                      <p className="mb-3 text-sm font-semibold text-gray-900">
                        Distribuição de orçamento:
                      </p>
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                        {v.orcamentoMensal.map((m) => (
                          <Field key={m.mes} label={m.mes} hint="Valor (opc)">
                            <CurrencyInput
                              value={m.valor}
                              onChange={(valor) =>
                                setVinculo(v.id, {
                                  ...v,
                                  orcamentoMensal: setValorMes(
                                    v.orcamentoMensal,
                                    m.mes,
                                    valor,
                                  ),
                                })
                              }
                            />
                          </Field>
                        ))}
                      </div>
                    </div>

                    {mesesZerados && !zeroAck[v.id] && (
                      <AttentionBanner
                        actionLabel="Prosseguir"
                        onAction={() =>
                          setZeroAck((a) => ({ ...a, [v.id]: true }))
                        }
                      >
                        Orçamento(s) Zerado(s): um ou mais meses estão com
                        orçamento R$ 0,00. Confirme se deseja prosseguir.
                      </AttentionBanner>
                    )}

                    <div>
                      <p className="mb-1 text-sm font-semibold text-gray-900">
                        Alerta de consumo
                      </p>
                      <p className="mb-4 text-sm text-gray-600">
                        Escolha o percentual de consumo para ser notificado por
                        email:
                      </p>

                      <div className="space-y-3">
                        {v.alertas.map((a) => (
                          <div
                            key={a.id}
                            className="rounded-md border border-hairline p-3"
                          >
                            <div className="mb-2 flex items-center justify-between gap-3">
                              <span className="text-sm font-medium text-gray-700">
                                {a.fixo
                                  ? 'Limite máximo (teto do sistema)'
                                  : 'Notificar ao atingir'}
                              </span>
                              <div className="flex shrink-0 items-center gap-2">
                                <div className="flex w-24 items-center rounded border border-gray-300 bg-white">
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
                                {!a.fixo && (
                                  <button
                                    type="button"
                                    onClick={() => removeAlerta(v, a.id)}
                                    title="Remover"
                                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded border border-gray-300 text-gray-400 hover:text-red-500"
                                  >
                                    <Icon.Trash width={16} height={16} />
                                  </button>
                                )}
                              </div>
                            </div>

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
                            <p className="mt-2 text-xs text-gray-400">
                              {a.fixo
                                ? 'Teto de consumo do sistema — não pode ser removido.'
                                : `Você será notificado quando o consumo atingir ${a.valor}% do orçamento direcionado para esta iniciativa.`}
                            </p>
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

              <VincularWorkspaceModal
                open={Boolean(pickerAberto)}
                vinculoAtual={vinculos.find((v) => v.id === pickerAberto) ?? null}
                onClose={() => setPickerAberto(null)}
                onRegistrar={(workspaces) => {
                  setVinculo(pickerAberto, {
                    ...vinculos.find((v) => v.id === pickerAberto),
                    workspaces,
                  })
                }}
              />

            </div>
          )}

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
                {vinculos.map((v) => (
                  <p key={v.id}>
                    Vínculo:{' '}
                    <strong>
                      {v.centroId
                        ? centros.find((c) => c.id === v.centroId)?.nome
                        : '—'}
                    </strong>{' '}
                    — {currency(somaMensal(v.orcamentoMensal))}
                  </p>
                ))}
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
