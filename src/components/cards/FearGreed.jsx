import Card from "../common/Card";
import { useTranslation } from "../../i18n";

function getLabel(value) {
  if (value <= 25) return { textKey: "fearGreed.extremeFear", color: "text-fear", bg: "bg-bear/10", signalKey: "fearGreed.strongBuy", emoji: "😱" };
  if (value <= 45) return { textKey: "fearGreed.fear", color: "text-bear", bg: "bg-bear/10", signalKey: "fearGreed.buy", emoji: "😟" };
  if (value <= 55) return { textKey: "fearGreed.neutral", color: "text-neutral", bg: "bg-btc/10", signalKey: "fearGreed.hold", emoji: "😐" };
  if (value <= 75) return { textKey: "fearGreed.greed", color: "text-btc", bg: "bg-btc/10", signalKey: "fearGreed.caution", emoji: "🤑" };
  return { textKey: "fearGreed.extremeGreed", color: "text-greed", bg: "bg-bull/10", signalKey: "fearGreed.sell", emoji: "🔥" };
}

function Gauge({ value }) {
  const angle = (value / 100) * 180 - 90;
  const radius = 50;
  const cx = 60;
  const cy = 55;

  const needleRad = (angle * Math.PI) / 180;
  const needleTip = { x: cx + (radius - 8) * Math.cos(needleRad), y: cy + (radius - 8) * Math.sin(needleRad) };

  return (
    <svg viewBox="0 0 120 70" className="w-full max-w-[200px] mx-auto">
      {[
        { pct: 0.25, color: "#ef4444" },
        { pct: 0.25, color: "#f59e0b" },
        { pct: 0.25, color: "#65a30d" },
        { pct: 0.25, color: "#22c55e" },
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
      <line x1={cx} y1={cy} x2={needleTip.x} y2={needleTip.y} stroke="#f1f5f9" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx={cx} cy={cy} r="4" fill="#f1f5f9" />
    </svg>
  );
}

export default function FearGreed({ fearGreed }) {
  const { t } = useTranslation();

  if (!fearGreed || fearGreed.length === 0) {
    return (
      <Card icon="😶" title={t("fearGreed.title")}>
        <p className="text-text-dim text-sm">{t("fearGreed.noData")}</p>
      </Card>
    );
  }

  const current = fearGreed[0];
  const info = getLabel(current.value);

  return (
    <Card icon="🧠" title={t("fearGreed.title")} subtitle={t("fearGreed.subtitle")}>
      <div className="flex flex-col items-center gap-4">
        {/* Gauge */}
        <div className="max-w-[180px] w-full">
          <Gauge value={current.value} />
        </div>
        {/* Value + label + badge */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2">
            <span className="text-2xl">{info.emoji}</span>
            <span className={`text-4xl font-bold tabular-nums ${info.color}`}>{current.value}</span>
          </div>
          <p className={`text-base font-semibold mt-1 ${info.color}`}>{t(info.textKey)}</p>
          <div className={`inline-block mt-3 px-4 py-2 rounded-full text-sm font-medium ${info.bg} ${info.color}`}>
            {t(info.signalKey)}
          </div>
        </div>
      </div>
    </Card>
  );
}
