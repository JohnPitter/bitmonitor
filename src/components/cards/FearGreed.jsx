import Card from "../common/Card";
import { useTranslation } from "../../i18n";

function getLabel(value) {
  if (value <= 25) return { textKey: "fearGreed.extremeFear", color: "text-fear", bg: "bg-bear/10", signalKey: "fearGreed.strongBuy" };
  if (value <= 45) return { textKey: "fearGreed.fear", color: "text-bear", bg: "bg-bear/10", signalKey: "fearGreed.buy" };
  if (value <= 55) return { textKey: "fearGreed.neutral", color: "text-neutral", bg: "bg-btc/10", signalKey: "fearGreed.hold" };
  if (value <= 75) return { textKey: "fearGreed.greed", color: "text-btc", bg: "bg-btc/10", signalKey: "fearGreed.caution" };
  return { textKey: "fearGreed.extremeGreed", color: "text-greed", bg: "bg-bull/10", signalKey: "fearGreed.sell" };
}

function Gauge({ value }) {
  const angle = (value / 100) * 180 - 90;
  const radius = 50;
  const cx = 60;
  const cy = 55;

  const needleRad = (angle * Math.PI) / 180;
  const needleTip = { x: cx + (radius - 8) * Math.cos(needleRad), y: cy + (radius - 8) * Math.sin(needleRad) };

  return (
    <svg viewBox="0 0 120 70" className="mx-auto w-full max-w-[200px]">
      {[
        { pct: 0.25, color: "#ff7a6b" },
        { pct: 0.25, color: "#c57a54" },
        { pct: 0.25, color: "#0fa7a0" },
        { pct: 0.25, color: "#57d68d" },
      ].reduce((acc, seg, i) => {
        const segStart = acc.endAngle;
        const segEnd = segStart + seg.pct * 180;
        const sr = (segStart * Math.PI) / 180;
        const er = (segEnd * Math.PI) / 180;
        const s = { x: cx + radius * Math.cos(sr), y: cy + radius * Math.sin(sr) };
        const e = { x: cx + radius * Math.cos(er), y: cy + radius * Math.sin(er) };
        acc.elements.push(
          <path
            key={i}
            d={`M ${s.x} ${s.y} A ${radius} ${radius} 0 0 1 ${e.x} ${e.y}`}
            fill="none"
            stroke={seg.color}
            strokeWidth="10"
            strokeLinecap="round"
            opacity="0.6"
          />,
        );
        acc.endAngle = segEnd;
        return acc;
      }, { elements: [], endAngle: -90 }).elements}
      <line x1={cx} y1={cy} x2={needleTip.x} y2={needleTip.y} stroke="#ecf7f7" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx={cx} cy={cy} r="4" fill="#ecf7f7" />
    </svg>
  );
}

export default function FearGreed({ fearGreed }) {
  const { t } = useTranslation();

  if (!fearGreed || fearGreed.length === 0) {
    return (
      <Card icon="◉" title={t("fearGreed.title")} hint={t("fearGreed.explainer")}>
        <p className="text-sm text-text-dim">{t("fearGreed.noData")}</p>
      </Card>
    );
  }

  const current = fearGreed[0];
  const info = getLabel(current.value);

  return (
    <Card
      icon="◉"
      title={t("fearGreed.title")}
      subtitle={t("fearGreed.subtitle")}
      hint={t("fearGreed.explainer")}
    >
      <div className="grid gap-4 lg:grid-cols-[190px_1fr]">
        <div className="rounded-[24px] border border-border/70 bg-black/18 p-4">
          <div className="mx-auto max-w-[180px]">
            <Gauge value={current.value} />
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-[24px] border border-border/70 bg-white/4 p-5">
            <div className="flex flex-wrap items-center gap-3">
              <span className={`text-5xl font-semibold tracking-[-0.05em] tabular-nums ${info.color}`}>{current.value}</span>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] ${info.bg} ${info.color}`}>
                {t(info.textKey)}
              </span>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-border/60 bg-black/15 p-3.5">
                <p className="text-[11px] uppercase tracking-[0.18em] text-text-dim">{t("fearGreed.title")}</p>
                <p className={`mt-2 text-base font-semibold ${info.color}`}>{t(info.textKey)}</p>
              </div>

              <div className={`rounded-2xl border border-transparent p-3.5 ${info.bg}`}>
                <p className="text-[11px] uppercase tracking-[0.18em] text-text-dim">{t("fearGreed.subtitle")}</p>
                <p className={`mt-2 text-sm font-semibold ${info.color}`}>{t(info.signalKey)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
