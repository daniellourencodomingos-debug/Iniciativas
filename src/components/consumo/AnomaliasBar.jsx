export default function AnomaliasBar({ itens }) {
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-card border border-hairline bg-white px-4 py-3">
      <span className="mr-1 shrink-0 text-sm font-semibold text-gray-700">Anomalias:</span>
      {itens.map((nome) => (
        <span
          key={nome}
          className="rounded-full border border-hairline bg-gray-50 px-3 py-1 text-xs font-medium text-gray-600"
        >
          {nome}
        </span>
      ))}
      <button
        type="button"
        className="ml-auto shrink-0 text-sm font-semibold text-brand hover:text-brand-dark hover:underline"
      >
        Ver detalhes
      </button>
    </div>
  )
}
