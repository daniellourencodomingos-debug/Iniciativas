import OrcamentoCloudRows from './OrcamentoCloudRows.jsx'
import EmailChipsInput from './EmailChipsInput.jsx'
import { Field, Select } from './fields.jsx'
import { useApp } from '../store/AppContext.jsx'
import { ALERTA_OPCOES } from '../data/mock.js'

/**
 * Editor de um Vínculo: orçamento por cloud + select de alerta (+ e-mails).
 * Componente controlado.
 * props: value { orcamentos, alerta, emails }, onChange(next), showEmails
 */
export default function VinculoEditor({ value, onChange, showEmails = true }) {
  const { uid } = useApp()
  const patch = (p) => onChange({ ...value, ...p })

  return (
    <div className="space-y-5">
      <div>
        <span className="mb-2 block text-sm font-medium text-gray-700">
          Orçamento por cloud
        </span>
        <OrcamentoCloudRows
          rows={value.orcamentos}
          onChange={(orcamentos) => patch({ orcamentos })}
          uid={uid}
        />
      </div>

      <Field label="Alerta de consumo">
        <Select
          value={value.alerta ?? 'padrao'}
          onChange={(e) => patch({ alerta: e.target.value })}
        >
          {ALERTA_OPCOES.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </Select>
      </Field>

      {showEmails && (
        <div>
          <Field label="Adicione os membros que irão receber a notificação">
            <EmailChipsInput
              value={value.emails ?? []}
              onChange={(emails) => patch({ emails })}
            />
          </Field>
          <p className="mt-1 pl-1 text-xs text-gray-400">
            Responsável técnico e time responsável receberão os emails
          </p>
        </div>
      )}
    </div>
  )
}
