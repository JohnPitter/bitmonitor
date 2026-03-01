export default function Card({ title, subtitle, children, className = "" }) {
  return (
    <div className={`bg-bg-card border border-border rounded-xl p-5 hover:border-border-hover transition-colors ${className}`}>
      {title && (
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-text-primary">{title}</h3>
          {subtitle && <p className="text-xs text-text-dim mt-0.5">{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  );
}
