export default function Card({ icon, title, subtitle, children, className = "" }) {
  return (
    <div className={`max-w-4xl mx-auto w-full bg-bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 hover:border-border-hover transition-all ${className}`}>
      {title && (
        <div className="mb-5">
          <div className="flex items-center gap-2.5">
            {icon && (
              <span className="w-8 h-8 rounded-lg bg-yellow-50 flex items-center justify-center text-base">{icon}</span>
            )}
            <h3 className="text-base font-bold text-text-primary">{title}</h3>
          </div>
          {subtitle && <p className="text-sm text-text-dim mt-1 leading-relaxed">{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  );
}
