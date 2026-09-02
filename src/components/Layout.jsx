import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header.jsx'
import Sidebar from './Sidebar.jsx'

export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(true)

  return (
    <div className="min-h-screen bg-pagebg">
      <Header onToggleMenu={() => setMenuOpen((o) => !o)} />
      <Sidebar open={menuOpen} />
      <main
        className={`pt-14 transition-[margin] duration-200 ease-out ${
          menuOpen ? 'ml-64' : 'ml-0'
        }`}
      >
        <div className="mx-auto max-w-6xl px-8 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export function PageHeader({ title, subtitle, actions }) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  )
}
