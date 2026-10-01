import { Outlet } from 'react-router-dom'
import Header from './Header.jsx'
import Sidebar from './Sidebar.jsx'

export default function Layout() {
  return (
    <div className="min-h-screen bg-pagebg">
      <Header />
      <Sidebar />
      <main className="ml-3 pt-14">
        <div className="mx-auto max-w-6xl px-8 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export function PageHeader({ title, subtitle, actions, icon: IconCmp }) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <div className="flex items-center gap-3">
        {IconCmp && <IconCmp width={28} height={28} className="shrink-0 text-gray-500" />}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
        </div>
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  )
}
