export function StatCard({
  label,
  value,
  hint,
  icon,
  tone = "default",
  trend,
}) {
  const toneRing = {
    default: "bg-primary/10 text-primary",
    success: "bg-[color:var(--success)]/12 text-[color:var(--success)]",
    warning: "bg-[color:var(--warning)]/20 text-[color:var(--warning-foreground)]",
    info: "bg-[color:var(--info)]/12 text-[color:var(--info)]",
  };
  const trendCls =
    trend?.direction === "down"
      ? "text-destructive bg-destructive/10"
      : trend?.direction === "flat"
      ? "text-muted-foreground bg-muted"
      : "text-[color:var(--success)] bg-[color:var(--success)]/10";
  return (
    <div className="group bg-card rounded-2xl p-5 border border-border shadow-soft hover:shadow-glass hover:-translate-y-0.5 transition-all duration-200">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">{label}</div>
          <div className="text-[28px] leading-none font-semibold text-foreground mt-2 tracking-tight tabular-nums">{value}</div>
        </div>
        <div className={`size-10 rounded-xl grid place-items-center shrink-0 ${toneRing[tone]}`}>{icon}</div>
      </div>
      {(hint || trend) && (
        <div className="mt-4 flex items-center gap-2">
          {trend && (
            <span className={`text-[11px] font-medium px-1.5 py-0.5 rounded-md ${trendCls}`}>{trend.value}</span>
          )}
          {hint && <div className="text-xs text-muted-foreground">{hint}</div>}
        </div>
      )}
    </div>
  );
}

export function StatusBadge({ status }) {
  const map = {
    Completed: "bg-[color:var(--success)]/12 text-[color:var(--success)] ring-[color:var(--success)]/20",
    Pending: "bg-[color:var(--warning)]/20 text-[color:var(--warning-foreground)] ring-[color:var(--warning)]/30",
    "In Progress": "bg-[color:var(--info)]/12 text-[color:var(--info)] ring-[color:var(--info)]/25",
    Cancelled: "bg-destructive/10 text-destructive ring-destructive/20",
    Active: "bg-[color:var(--success)]/12 text-[color:var(--success)] ring-[color:var(--success)]/20",
    Inactive: "bg-muted text-muted-foreground ring-border",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium ring-1 whitespace-nowrap ${map[status] ?? "bg-muted text-muted-foreground ring-border"}`}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}

export function SectionHeader({
  title,
  subtitle,
  action,
}) {
  return (
    <div className="flex items-end justify-between flex-wrap gap-4 mb-7">
      <div className="min-w-0">
        <h1 className="text-2xl sm:text-[28px] font-semibold tracking-tight text-foreground leading-tight">{title}</h1>
        {subtitle && <p className="text-sm text-muted-foreground mt-1.5 max-w-2xl">{subtitle}</p>}
      </div>
      {action && <div className="flex items-center gap-2">{action}</div>}
    </div>
  );
}

export function Field({
  label,
  hint,
  children,
}) {
  return (
    <label className="block">
      <span className="block text-xs font-medium text-foreground/80 mb-1.5">{label}</span>
      {children}
      {hint && <span className="block text-[11px] text-muted-foreground mt-1">{hint}</span>}
    </label>
  );
}

export const inputCls =
  "w-full h-10 px-3.5 rounded-xl bg-white border border-border focus:border-primary/50 focus:ring-4 focus:ring-primary/10 outline-none text-sm text-foreground placeholder:text-muted-foreground/70 transition";

export const selectCls = inputCls + " appearance-none pr-9 bg-no-repeat bg-[length:14px] bg-[position:right_0.75rem_center] bg-[image:url('data:image/svg+xml;utf8,<svg%20xmlns=%22http://www.w3.org/2000/svg%22%20viewBox=%220%200%2020%2020%22%20fill=%22none%22%20stroke=%22%2364748B%22%20stroke-width=%221.6%22%20stroke-linecap=%22round%22%20stroke-linejoin=%22round%22><polyline%20points=%226%208%2010%2012%2014%208%22/></svg>')]";

export const textareaCls =
  "w-full px-3.5 py-2.5 rounded-xl bg-white border border-border focus:border-primary/50 focus:ring-4 focus:ring-primary/10 outline-none text-sm text-foreground placeholder:text-muted-foreground/70 transition resize-y";

export function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}) {
  const map = {
    primary:
      "bg-primary text-primary-foreground hover:bg-primary/90 shadow-soft hover:shadow-glass focus:ring-4 focus:ring-primary/20",
    ghost: "text-foreground hover:bg-secondary",
    outline: "border border-border bg-white text-foreground hover:bg-secondary hover:border-border",
    danger: "bg-destructive/10 text-destructive hover:bg-destructive/15",
  };
  const sizeCls = size === "sm" ? "h-9 px-3.5 text-[13px]" : "h-10 px-5 text-sm";
  return (
    <button
      {...props}
      className={`${sizeCls} rounded-full font-medium inline-flex items-center justify-center gap-2 transition-all duration-150 active:scale-[.98] outline-none disabled:opacity-50 disabled:pointer-events-none ${map[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

export function EmptyState({ title, hint, icon }) {
  return (
    <div className="py-14 px-6 text-center">
      <div className="mx-auto size-12 rounded-2xl bg-secondary text-muted-foreground grid place-items-center mb-3">
        {icon ?? <span className="text-lg">∅</span>}
      </div>
      <div className="font-medium text-foreground text-sm">{title}</div>
      {hint && <div className="text-xs text-muted-foreground mt-1">{hint}</div>}
    </div>
  );
}

export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4 bg-foreground/40 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-card rounded-2xl shadow-glass border border-border overflow-hidden animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h3 className="font-semibold text-foreground">{title}</h3>
          <button
            onClick={onClose}
            className="size-8 grid place-items-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition"
          >
            ✕
          </button>
        </div>
        <div className="p-6 max-h-[70vh] overflow-y-auto">{children}</div>
        {footer && (
          <div className="px-6 py-4 border-t border-border bg-secondary/40 flex justify-end gap-2">{footer}</div>
        )}
      </div>
    </div>
  );
}

export function Card({ children, className = "" }) {
  return (
    <div className={`bg-card rounded-2xl border border-border shadow-soft ${className}`}>{children}</div>
  );
}
