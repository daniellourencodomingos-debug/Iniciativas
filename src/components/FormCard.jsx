export { Field, TextInput, TextArea, Select, SearchInput } from './fields.jsx'

/**
 * Card de formulário reutilizável.
 * props: title, description, children, actions (nó opcional no rodapé)
 */
export default function FormCard({ title, description, children, actions }) {
  return (
    <section className="rounded-card border border-hairline bg-white">
      {(title || description) && (
        <header className="border-b border-hairline px-5 py-4">
          {title && (
            <h2 className="text-base font-semibold text-gray-900">{title}</h2>
          )}
          {description && (
            <p className="mt-1 text-sm text-gray-500">{description}</p>
          )}
        </header>
      )}
      <div className="space-y-5 px-5 py-5">{children}</div>
      {actions && (
        <footer className="flex justify-end gap-3 border-t border-hairline px-5 py-4">
          {actions}
        </footer>
      )}
    </section>
  )
}
