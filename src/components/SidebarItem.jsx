import { NavLink } from 'react-router-dom'

/**
 * Item de menu lateral com estado ativo/hover.
 * props: to, icon, label, subtitle, badge, collapsed
 */
export default function SidebarItem({
  to,
  icon: IconCmp,
  label,
  subtitle,
  badge,
  dot = false,
  collapsed = false,
}) {
  return (
    <NavLink
      to={to}
      title={collapsed ? label : undefined}
      className={({ isActive }) =>
        [
          'relative flex items-start rounded-md text-sm transition-colors',
          collapsed ? 'justify-center px-2 py-2.5' : 'gap-3 px-3 py-2',
          isActive
            ? 'bg-brand-light font-semibold text-brand'
            : 'text-gray-600 hover:bg-gray-100',
        ].join(' ')
      }
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <span className="absolute left-0 top-1 bottom-1 w-1 rounded-r bg-brand" />
          )}
          {IconCmp && (
            <IconCmp
              className={`${collapsed ? '' : 'mt-0.5'} ${
                isActive ? 'text-brand' : 'text-gray-400'
              }`}
              width={18}
              height={18}
            />
          )}
          {!collapsed && (
            <span className="flex-1 leading-tight">
              <span className="flex items-center gap-2">
                {label}
                {dot && (
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" />
                )}
                {badge != null && (
                  <span className="rounded bg-brand px-1.5 text-[10px] font-bold text-white">
                    {badge}
                  </span>
                )}
              </span>
              {subtitle && (
                <span className="block text-xs font-normal text-gray-400">
                  {subtitle}
                </span>
              )}
            </span>
          )}
          {collapsed && badge != null && (
            <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-brand" />
          )}
        </>
      )}
    </NavLink>
  )
}
