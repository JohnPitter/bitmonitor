export default function Footer() {
  return (
    <footer className="border-t border-border px-4 py-4 mt-6">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-text-dim">
        <span>Data from CoinGecko &middot; Fear &amp; Greed from Alternative.me</span>
        <span>
          <a
            href="https://github.com/JohnPitter/bitmonitor"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-secondary hover:text-btc transition-colors"
          >
            GitHub
          </a>
          {" · "}
          The 1064/364 pattern is a heuristic, not financial advice.
        </span>
      </div>
    </footer>
  );
}
