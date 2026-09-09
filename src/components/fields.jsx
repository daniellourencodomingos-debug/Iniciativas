import { useEffect, useState } from 'react'
import { Icon } from './icons.jsx'

/**
 * Campo com contorno e rótulo flutuante sobre a linha (estilo Material outlined),
 * igual ao formulário "Solicitação de Workspace" do produto.
 * props: label, hint, required, error, children, className
 */
export function Field({ label, hint, required, error, children, className = '' }) {
  return (
    <div className={className}>
      <div
        className={[
          'relative rounded border bg-white transition',
          error
            ? 'border-red-400 focus-within:border-red-400'
            : 'border-gray-300 focus-within:border-brand',
          'focus-within:ring-1 focus-within:ring-brand/30',
        ].join(' ')}
      >
        {label && (
          <span className="pointer-events-none absolute -top-[7px] left-2.5 bg-white px-1 text-[11px] font-medium leading-none text-gray-500">
            {required && <span className="text-red-500">* </span>}
            {label}
          </span>
        )}
        {children}
      </div>
      {hint && !error && (
        <p className="mt-1 pl-1 text-xs text-gray-400">{hint}</p>
      )}
      {error && <p className="mt-1 pl-1 text-xs text-red-500">{error}</p>}
    </div>
  )
}

const CTRL =
  'w-full bg-transparent px-3 py-2.5 text-sm text-gray-900 outline-none placeholder:text-gray-400 read-only:text-gray-500 disabled:text-gray-400'

export function TextInput({ className = '', ...props }) {
  return <input {...props} className={`${CTRL} ${className}`} />
}

export function TextArea({ className = '', ...props }) {
  return <textarea {...props} className={`${CTRL} resize-none ${className}`} />
}

/**
 * Campo de valor monetário no formato usado em FinOps/BR: separador de
 * milhar "." e decimal ",", ex. "20.000,00". Trabalha por dígitos (como um
 * caixa eletrônico): cada tecla digitada entra nos centavos, sem depender
 * do formato de número nativo do navegador. `value`/`onChange` continuam em
 * número puro (reais), como os demais campos numéricos do formulário.
 */
export function CurrencyInput({ value, onChange, className = '', ...props }) {
  const digitsFromValue = (v) => String(Math.round((Number(v) || 0) * 100))
  const formatDigits = (digits) =>
    ((Number(digits || '0') || 0) / 100).toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })

  const [display, setDisplay] = useState(() => formatDigits(digitsFromValue(value)))

  // Mantém o campo em sincronia quando o valor muda de fora (ex.: distribuição
  // automática recalculando os meses), sem perder o que o usuário está digitando.
  useEffect(() => {
    setDisplay(formatDigits(digitsFromValue(value)))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  const handleChange = (e) => {
    const digits = e.target.value.replace(/\D/g, '')
    setDisplay(formatDigits(digits))
    onChange((Number(digits || '0') || 0) / 100)
  }

  return (
    <input
      {...props}
      type="text"
      inputMode="decimal"
      value={display}
      onChange={handleChange}
      className={`${CTRL} ${className}`}
    />
  )
}

export function Select({ className = '', children, leftIcon: LeftIcon, ...props }) {
  return (
    <div className="relative">
      {LeftIcon && (
        <LeftIcon
          width={16}
          height={16}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
      )}
      <select
        {...props}
        className={`${CTRL} appearance-none pr-9 ${LeftIcon ? 'pl-9' : ''} ${className}`}
      >
        {children}
      </select>
      <Icon.ChevronDown
        width={16}
        height={16}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
      />
    </div>
  )
}

export function SearchInput({ className = '', ...props }) {
  return (
    <div className="relative">
      <Icon.Search
        width={16}
        height={16}
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
      />
      <input {...props} className={`${CTRL} pl-9 ${className}`} />
    </div>
  )
}
