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

export function Select({ className = '', children, ...props }) {
  return (
    <div className="relative">
      <select {...props} className={`${CTRL} appearance-none pr-9 ${className}`}>
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
