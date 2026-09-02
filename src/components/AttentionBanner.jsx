import { Icon } from './icons.jsx'

/**
 * Banner reutilizável.
 * - variant "atencao" (padrão): âmbar, título "Atenção", ícone de alerta.
 * - variant "importante": azul claro, título "Importante", ícone de info.
 * props: variant, title, children, actionLabel, onAction
 */
export default function AttentionBanner({
  variant = 'atencao',
  title,
  children,
  actionLabel,
  onAction,
}) {
  const info = variant === 'importante'

  const cfg = info
    ? {
        wrap: 'border-[#C6D4EC] bg-[#EEF2FB]',
        icon: 'text-brand',
        heading: 'text-brand',
        body: 'text-slate-600',
        IconCmp: Icon.Info,
        defaultTitle: 'Importante',
      }
    : {
        wrap: 'border-attention-border bg-attention-bg',
        icon: 'text-attention-text',
        heading: 'text-attention-text',
        body: 'text-attention-text',
        IconCmp: Icon.Alert,
        defaultTitle: 'Atenção',
      }

  return (
    <div className={`flex gap-3 rounded-card border px-4 py-3 ${cfg.wrap}`}>
      <cfg.IconCmp className={`mt-0.5 shrink-0 ${cfg.icon}`} width={20} height={20} />
      <div className="flex-1 text-sm">
        <p className={`font-bold ${cfg.heading}`}>{title ?? cfg.defaultTitle}</p>
        <p className={`mt-0.5 leading-relaxed ${cfg.body}`}>{children}</p>
      </div>
      {actionLabel && (
        <button
          type="button"
          onClick={onAction}
          className="self-start whitespace-nowrap text-sm font-semibold text-brand underline underline-offset-2 hover:text-brand-dark"
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}
