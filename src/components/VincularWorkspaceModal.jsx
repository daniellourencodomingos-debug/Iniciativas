import { useEffect, useState } from 'react'
import { Icon } from './icons.jsx'
import { SearchInput } from './FormCard.jsx'
import AttentionBanner from './AttentionBanner.jsx'
import { useApp } from '../store/AppContext.jsx'
import { TODOS_WORKSPACES, idDoWorkspace } from '../data/mock.js'

const toggleSet = (setter, id) =>
  setter((prev) => {
    const next = new Set(prev)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    return next
  })

/**
 * Tela "Vincular workspace": abre por cima do cadastro da Iniciativa para o
 * usuário escolher os workspaces deste Vínculo, num seletor de duas colunas
 * (disponíveis / vinculados ao centro de custo). Ao Registrar, fecha e volta
 * para o cadastro exatamente de onde o usuário estava.
 */
export default function VincularWorkspaceModal({
  open,
  vinculoAtual,
  onClose,
  onRegistrar,
}) {
  const { centros, vinculos, dispatch } = useApp()

  const [pendentes, setPendentes] = useState([])
  const [checkedLeft, setCheckedLeft] = useState(new Set())
  const [checkedRight, setCheckedRight] = useState(new Set())
  const [buscaEsquerda, setBuscaEsquerda] = useState('')
  const [buscaDireita, setBuscaDireita] = useState('')
  const [confirmado, setConfirmado] = useState(false)

  useEffect(() => {
    if (open) {
      setPendentes(vinculoAtual?.workspaces ?? [])
      setCheckedLeft(new Set())
      setCheckedRight(new Set())
      setBuscaEsquerda('')
      setBuscaDireita('')
      setConfirmado(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, vinculoAtual?.id])

  if (!open || !vinculoAtual) return null

  const donoAtual = (wsId) =>
    vinculos.find((vv) => vv.id !== vinculoAtual.id && vv.workspaces?.includes(wsId))

  const centroNomeDoDono = (wsId) => {
    const dono = donoAtual(wsId)
    return dono ? centros.find((c) => c.id === dono.centroId)?.nome ?? null : null
  }

  const disponiveis = TODOS_WORKSPACES.filter(
    (w) =>
      !pendentes.includes(w.id) &&
      w.nome.toLowerCase().includes(buscaEsquerda.toLowerCase()),
  )
  const vinculados = TODOS_WORKSPACES.filter(
    (w) =>
      pendentes.includes(w.id) &&
      w.nome.toLowerCase().includes(buscaDireita.toLowerCase()),
  )

  const conflitos = pendentes.filter((wsId) => {
    const dono = donoAtual(wsId)
    return dono && dono.centroId !== vinculoAtual.centroId
  })
  const temConflito = conflitos.length > 0

  const moverParaDireita = () => {
    setPendentes((p) => [...p, ...checkedLeft])
    setCheckedLeft(new Set())
  }
  const moverParaEsquerda = () => {
    setPendentes((p) => p.filter((id) => !checkedRight.has(id)))
    setCheckedRight(new Set())
  }

  const registrar = () => {
    if (temConflito && !confirmado) return
    // reflete no estado global: remove o workspace reatribuído do vínculo
    // (em outro centro de custo) que o tinha antes
    conflitos.forEach((wsId) => {
      const dono = donoAtual(wsId)
      if (dono) {
        dispatch({
          type: 'UPDATE_VINCULO',
          payload: { id: dono.id, workspaces: dono.workspaces.filter((w) => w !== wsId) },
        })
      }
    })
    onRegistrar(pendentes)
    onClose()
  }

  const Coluna = ({ titulo, itens, busca, onBusca, checked, onToggle, vazio, ladoDireito }) => (
    <div className="rounded-md border border-hairline">
      <div className="border-b border-hairline p-2">
        <p className="px-1 text-xs font-semibold text-gray-500">{titulo}</p>
        <SearchInput
          value={busca}
          onChange={(e) => onBusca(e.target.value)}
          placeholder="Buscar workspace"
          className="mt-1"
        />
      </div>
      <div className="max-h-72 overflow-y-auto divide-y divide-hairline">
        <div className="grid grid-cols-[auto_1fr_1fr] gap-2 px-2 py-1.5 text-[11px] font-semibold text-gray-400">
          <span />
          <span>Centro de custo</span>
          <span>Workspace</span>
        </div>
        {itens.length === 0 && (
          <p className="p-3 text-xs text-gray-400">{vazio}</p>
        )}
        {itens.map((w) => {
          const dono = centroNomeDoDono(w.id)
          return (
            <label
              key={w.id}
              className="grid cursor-pointer grid-cols-[auto_1fr_1fr] items-center gap-2 px-2 py-2 text-xs hover:bg-gray-50"
            >
              <input
                type="checkbox"
                checked={checked.has(w.id)}
                onChange={() => onToggle(w.id)}
              />
              <span className={dono && ladoDireito ? 'font-medium text-amber-600' : 'text-gray-500'}>
                {dono ?? 'Sem centro de custo'}
              </span>
              <span>
                <span className="block font-medium text-gray-900">
                  {w.provedor} · {w.nome}
                </span>
                <span className="block text-[10px] text-gray-400">
                  ID do workspace: {idDoWorkspace(w.nome)}
                </span>
              </span>
            </label>
          )
        })}
      </div>
      <div className="flex items-center justify-between border-t border-hairline px-2 py-1.5 text-[11px] text-gray-400">
        <span>Linhas por página: 20</span>
        <span>
          {itens.length === 0 ? 0 : 1}–{itens.length} de {itens.length}
        </span>
      </div>
    </div>
  )

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="flex max-h-[90vh] w-full max-w-4xl flex-col rounded-card bg-white shadow-xl">
        <div className="border-b border-hairline px-5 py-4">
          <p className="text-xs text-gray-400">
            Centros de Custo / Nova Iniciativa / Workspace
          </p>
          <h2 className="mt-1 text-base font-semibold text-gray-900">
            Vincular workspace
          </h2>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
          <div className="grid grid-cols-1 items-start gap-3 md:grid-cols-[1fr_auto_1fr]">
            <Coluna
              titulo="Workspaces disponíveis"
              itens={disponiveis}
              busca={buscaEsquerda}
              onBusca={setBuscaEsquerda}
              checked={checkedLeft}
              onToggle={(id) => toggleSet(setCheckedLeft, id)}
              vazio="Nenhum workspace disponível."
              ladoDireito={false}
            />

            <div className="flex flex-row items-center justify-center gap-2 md:flex-col">
              <button
                type="button"
                onClick={moverParaDireita}
                disabled={checkedLeft.size === 0}
                title="Vincular selecionados"
                className="flex h-8 w-8 items-center justify-center rounded border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-40"
              >
                <Icon.ArrowRight width={14} height={14} />
              </button>
              <button
                type="button"
                onClick={moverParaEsquerda}
                disabled={checkedRight.size === 0}
                title="Remover selecionados"
                className="flex h-8 w-8 items-center justify-center rounded border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-40"
              >
                <Icon.ArrowLeft width={14} height={14} />
              </button>
            </div>

            <Coluna
              titulo="Vincular ao centro de custo"
              itens={vinculados}
              busca={buscaDireita}
              onBusca={setBuscaDireita}
              checked={checkedRight}
              onToggle={(id) => toggleSet(setCheckedRight, id)}
              vazio="Não há workspace, selecione os na tabela à esquerda para vincular."
              ladoDireito
            />
          </div>

          {temConflito && (
            <AttentionBanner
              actionLabel={confirmado ? undefined : 'Confirma'}
              onAction={() => setConfirmado(true)}
            >
              Vincular este(s) workspace(s) selecionado(s) a esse centro de
              custo removerá o vínculo abaixo com outros centros. Confirme se
              deseja prosseguir.
            </AttentionBanner>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-hairline px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-hairline bg-white px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={registrar}
            disabled={temConflito && !confirmado}
            className="rounded bg-brand px-5 py-2 text-sm font-semibold text-white hover:bg-brand-dark disabled:cursor-not-allowed disabled:bg-brand/40"
          >
            Registrar
          </button>
        </div>
      </div>
    </div>
  )
}
