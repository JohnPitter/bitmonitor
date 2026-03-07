export default function BrandMark({
  size = 44,
  withWordmark = false,
  title = "Cycle Atlas",
  descriptor = "Bitcoin cycle intelligence",
}) {
  return (
    <div
      className="inline-flex items-center gap-3"
      aria-label={title}
      title={title}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="atlas-shell" x1="10" y1="8" x2="54" y2="56" gradientUnits="userSpaceOnUse">
            <stop stopColor="#112332" />
            <stop offset="1" stopColor="#081018" />
          </linearGradient>
          <linearGradient id="atlas-ring" x1="18" y1="16" x2="48" y2="48" gradientUnits="userSpaceOnUse">
            <stop stopColor="#8BE8D8" />
            <stop offset="0.52" stopColor="#2CC7B5" />
            <stop offset="1" stopColor="#D58A3E" />
          </linearGradient>
          <linearGradient id="atlas-line" x1="17" y1="40" x2="45" y2="24" gradientUnits="userSpaceOnUse">
            <stop stopColor="#F0B46A" />
            <stop offset="1" stopColor="#86EFE2" />
          </linearGradient>
        </defs>

        <rect x="4" y="4" width="56" height="56" rx="20" fill="url(#atlas-shell)" />
        <rect x="4.5" y="4.5" width="55" height="55" rx="19.5" stroke="rgba(255,255,255,0.12)" />

        <circle cx="32" cy="32" r="16" stroke="url(#atlas-ring)" strokeWidth="3.2" opacity="0.85" />
        <path d="M16 34C21.6 24.4 27.8 20.4 34.6 22C41.4 23.6 45.4 20.9 48 14" stroke="#174743" strokeWidth="2.5" strokeLinecap="round" opacity="0.75" />
        <path d="M17 40L25 33L31 36L46 22" stroke="url(#atlas-line)" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="46" cy="22" r="4.3" fill="#D58A3E" />
        <circle cx="46" cy="22" r="1.8" fill="#F5E8D3" />
      </svg>

      {withWordmark && (
        <div className="leading-none">
          <div className="font-display text-[0.78rem] uppercase tracking-[0.34em] text-text-dim">
            {descriptor}
          </div>
          <div className="font-display text-[1.45rem] font-semibold tracking-[-0.04em] text-text-primary">
            Cycle Atlas
          </div>
        </div>
      )}
    </div>
  );
}
