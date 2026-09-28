import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { PageHeader } from '../components/Layout.jsx'
import FormCard, { Field, TextInput, Select } from '../components/FormCard.jsx'
import Toast from '../components/Toast.jsx'
import { useApp } from '../store/AppContext.jsx'

export default function CentroDeCustoForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { centros, gerentes, centroById, dispatch, uid } = useApp()

  const editing = Boolean(id)
  const existing = editing ? centroById(id) : null

  const [nome, setNome] = useState(existing?.nome ?? '')
  const [codigo, setCodigo] = useState(existing?.codigo ?? '')
  const [gerenteId, setGerenteId] = useState(existing?.gerenteId ?? gerentes[0]?.id ?? '')
  const [toastOpen, setToastOpen] = useState(false)

  const nomeDuplicado = centros.some(
    (c) => c.nome.trim().toLowerCase() === nome.trim().toLowerCase() && c.id !== id,
  )
  const podeSalvar = nome.trim().length > 0 && codigo.trim().length > 0 && !nomeDuplicado

  const salvar = () => {
    if (!podeSalvar) return
    if (editing) {
      dispatch({ type: 'UPDATE_CENTRO', payload: { id, nome, codigo, gerenteId } })
    } else {
      dispatch({ type: 'CREATE_CENTRO', payload: { id: uid('cc'), nome, codigo, gerenteId } })
    }
    setToastOpen(true)
    setTimeout(() => navigate('/centro-de-custo'), 700)
  }

  return (
    <>
      <PageHeader
        title={editing ? 'Editar centro de custo' : 'Novo centro de custo'}
        subtitle={
          editing
            ? 'O orçamento anual é calculado a partir dos vínculos das iniciativas — não é editado aqui.'
            : undefined
        }
      />

      <FormCard
        title="Dados do centro de custo"
        actions={
          <>
            <button
              onClick={() => navigate('/centro-de-custo')}
              className="rounded-md border border-hairline px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              onClick={salvar}
              disabled={!podeSalvar}
              className="rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-40"
            >
              Salvar
            </button>
          </>
        }
      >
        <div className="grid grid-cols-2 gap-4">
          <Field label="Nome do centro de custo" required error={nomeDuplicado ? 'Já existe um centro de custo com esse nome.' : undefined}>
            <TextInput value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex.: Plataforma de Dados" />
          </Field>
          <Field label="Código" required hint="Identificador curto, usado nas integrações.">
            <TextInput value={codigo} onChange={(e) => setCodigo(e.target.value)} placeholder="Ex.: PLAT-DATA-001" />
          </Field>
        </div>
        <Field label="Gerente responsável" required>
          <Select value={gerenteId} onChange={(e) => setGerenteId(e.target.value)}>
            {gerentes.map((g) => (
              <option key={g.id} value={g.id}>
                {g.nome} — {g.email}
              </option>
            ))}
          </Select>
        </Field>
      </FormCard>

      <Toast open={toastOpen} onClose={() => setToastOpen(false)}>
        Centro de custo salvo.
      </Toast>
    </>
  )
}
