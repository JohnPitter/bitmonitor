export default function Card({ icon, title, subtitle, children, className = "" }) {
  return (
    <div className={`bg-bg-card border border-border rounded-2xl p-6 hover:border-border-hover transition-all ${className}`}>
      {title && (
        <div className="mb-5">
          <div className="flex items-center gap-2.5">
            {icon && <span className="text-xl">{icon}</span>}
            <h3 className="text-base font-bold text-text-primary">{title}</h3>
          </div>
          {subtitle && <p className="text-sm text-text-dim mt-1 leading-relaxed">{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  );
}
