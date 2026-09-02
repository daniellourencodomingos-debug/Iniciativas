import { useState } from 'react'
import { Icon } from './icons.jsx'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * Campo de e-mails com chips removíveis. Sem contorno próprio — feito para
 * viver dentro de um <Field> (contorno + rótulo flutuante).
 * props: value (string[]), onChange, placeholder
 */
export default function EmailChipsInput({
  value = [],
  onChange,
  placeholder = 'Digite um ou mais emails',
}) {
  const [draft, setDraft] = useState('')
  const [error, setError] = useState('')

  const commit = () => {
    const parts = draft
      .split(/[,;\s]+/)
      .map((s) => s.trim())
      .filter(Boolean)
    if (!parts.length) return
    const invalid = parts.filter((p) => !EMAIL_RE.test(p))
    if (invalid.length) {
      setError(`E-mail inválido: ${invalid.join(', ')}`)
      return
    }
    onChange([...new Set([...value, ...parts])])
    setDraft('')
    setError('')
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-1.5 px-2.5 py-2">
        <Icon.Search width={16} height={16} className="shrink-0 text-gray-400" />
        {value.map((email) => (
          <span
            key={email}
            className="flex items-center gap-1 rounded bg-brand-light px-2 py-1 text-xs font-medium text-brand"
          >
            {email}
            <button
              type="button"
              onClick={() => onChange(value.filter((e) => e !== email))}
              className="text-brand/70 hover:text-brand"
            >
              <Icon.X width={13} height={13} />
            </button>
          </span>
        ))}
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ',') {
              e.preventDefault()
              commit()
            }
            if (e.key === 'Backspace' && !draft && value.length) {
              onChange(value.slice(0, -1))
            }
          }}
          onBlur={commit}
          placeholder={placeholder}
          className="min-w-[160px] flex-1 border-none bg-transparent py-1 text-sm outline-none placeholder:text-gray-400"
        />
      </div>
      {error && <p className="mt-1 pl-1 text-xs text-red-500">{error}</p>}
    </div>
  )
}
