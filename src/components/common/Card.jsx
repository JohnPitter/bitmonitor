export default function Card({ icon, title, subtitle, hint, children, className = "", iconClassName = "" }) {
  return (
    <div className={`group relative h-full w-full overflow-hidden rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(12,22,30,0.94),rgba(7,12,18,0.96))] p-5 shadow-[0_28px_90px_-48px_rgba(0,0,0,0.95)] backdrop-blur-sm transition-transform duration-300 hover:-translate-y-0.5 ${className}`}>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(98,216,182,0.1),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(213,138,62,0.12),transparent_24%)] opacity-90" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.22),transparent)]" />

      <div className="relative">
        {title && (
          <div className="mb-5">
            <div className="flex items-center gap-3">
              {icon && (
                <span className={`flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-[linear-gradient(180deg,rgba(213,138,62,0.16),rgba(98,216,182,0.12))] text-base shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] ${iconClassName}`}>
                  {icon}
                </span>
              )}
              <div>
                <h3 className="font-display text-lg font-semibold tracking-[-0.04em] text-text-primary">
                  {title}
                </h3>
                {subtitle && (
                  <p className="mt-1 text-sm leading-6 text-text-dim">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {hint && (
          <p className="mb-5 rounded-[20px] border border-white/8 bg-white/[0.035] px-4 py-3 text-sm leading-6 text-text-secondary">
            {hint}
          </p>
        )}

        {children}
      </div>
    </div>
  );
}
