import { PageHeader } from '../components/Layout.jsx'
import { Icon } from '../components/icons.jsx'

export default function Placeholder({ title }) {
  return (
    <>
      <PageHeader title={title} subtitle="Área existente do produto — fora do escopo deste protótipo." />
      <div className="flex flex-col items-center justify-center rounded-card border border-dashed border-hairline bg-white py-20 text-center">
        <Icon.Layers width={40} height={40} className="text-gray-300" />
        <p className="mt-3 text-sm text-gray-400">
          Conteúdo não incluído neste protótipo.
        </p>
      </div>
    </>
  )
}
