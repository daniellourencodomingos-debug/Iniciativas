import { Icon } from './icons.jsx'
import { PROVEDORES, currency } from '../data/mock.js'
import { Field, Select, TextInput } from './fields.jsx'

/**
 * Lista de linhas "Provedor (select) + Orçamento (R$)" com botão de adicionar.
 * props: rows [{id, provedor, valor}], onChange, uid
 */
export default function OrcamentoCloudRows({ rows, onChange, uid }) {
  const update = (id, patch) =>
    onChange(rows.map((r) => (r.id === id ? { ...r, ...patch } : r)))
  const remove = (id) => onChange(rows.filter((r) => r.id !== id))
  const add = () =>
    onChange([...rows, { id: uid('o'), provedor: 'AWS', valor: 0 }])

  const total = rows.reduce((s, r) => s + (Number(r.valor) || 0), 0)

  return (
    <div className="space-y-3">
      {rows.map((row) => (
        <div key={row.id} className="flex items-start gap-3">
          <Field label="Provedor" className="flex-1">
            <Select
              value={row.provedor}
              onChange={(e) => update(row.id, { provedor: e.target.value })}
            >
              {PROVEDORES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Orçamento (R$)" className="flex-1">
            <TextInput
              type="number"
              min={0}
              value={row.valor}
              onChange={(e) => update(row.id, { valor: Number(e.target.value) })}
            />
          </Field>
          <button
            type="button"
            onClick={() => remove(row.id)}
            disabled={rows.length === 1}
            title="Remover"
            className="mt-1 flex h-10 w-10 items-center justify-center rounded border border-gray-300 text-gray-400 hover:text-red-500 disabled:opacity-40"
          >
            <Icon.Trash width={16} height={16} />
          </button>
        </div>
      ))}

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={add}
          className="flex items-center gap-1 text-sm font-semibold text-brand hover:text-brand-dark"
        >
          <Icon.Plus width={15} height={15} /> Adicionar orçamento por cloud
        </button>
        <span className="text-sm text-gray-500">
          Total: <span className="font-bold text-gray-800">{currency(total)}</span>
        </span>
      </div>
    </div>
  )
}
