import { useState } from 'react'
import { Icon } from './icons.jsx'

/**
 * Seção expansível reutilizável.
 * props: title, subtitle, defaultOpen, badge, children
 */
export default function ExpandableSection({
  title,
  subtitle,
  defaultOpen = false,
  badge,
  children,
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="rounded-card border border-hairline bg-white">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-3 px-5 py-4 text-left"
      >
        <Icon.ChevronDown
          className={`text-gray-400 transition-transform ${open ? '' : '-rotate-90'}`}
        />
        <span className="flex-1">
          <span className="text-base font-semibold text-gray-900">{title}</span>
          {subtitle && (
            <span className="ml-2 text-sm text-gray-400">{subtitle}</span>
          )}
        </span>
        {badge != null && (
          <span className="rounded-md bg-brand-light px-2 py-0.5 text-xs font-semibold text-brand">
            {badge}
          </span>
        )}
      </button>
      {open && (
        <div className="border-t border-hairline px-5 py-5">{children}</div>
      )}
    </div>
  )
}
