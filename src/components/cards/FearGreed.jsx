import Card from "../common/Card";
import { useTranslation } from "../../i18n";

function getLabel(value) {
  if (value <= 25) return { textKey: "fearGreed.extremeFear", color: "text-fear", signalKey: "fearGreed.strongBuy" };
  if (value <= 45) return { textKey: "fearGreed.fear", color: "text-bear", signalKey: "fearGreed.buy" };
  if (value <= 55) return { textKey: "fearGreed.neutral", color: "text-neutral", signalKey: "fearGreed.hold" };
  if (value <= 75) return { textKey: "fearGreed.greed", color: "text-btc", signalKey: "fearGreed.caution" };
  return { textKey: "fearGreed.extremeGreed", color: "text-greed", signalKey: "fearGreed.sell" };
}

function Gauge({ value }) {
  const angle = (value / 100) * 180 - 90;
  const radius = 50;
  const cx = 60;
  const cy = 55;

  const needleRad = (angle * Math.PI) / 180;
  const needleTip = { x: cx + (radius - 8) * Math.cos(needleRad), y: cy + (radius - 8) * Math.sin(needleRad) };

  return (
    <svg viewBox="0 0 120 70" className="w-full max-w-[160px] mx-auto">
      {[
        { pct: 0.25, color: "#ef4444" },
        { pct: 0.25, color: "#f97316" },
        { pct: 0.25, color: "#eab308" },
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
            strokeWidth="8"
            strokeLinecap="butt"
            opacity="0.4"
          />,
        );
        acc.endAngle = segEnd;
        return acc;
      }, { elements: [], endAngle: -90 }).elements}
      <line x1={cx} y1={cy} x2={needleTip.x} y2={needleTip.y} stroke="#e2e8f0" strokeWidth="2" strokeLinecap="round" />
      <circle cx={cx} cy={cy} r="3" fill="#e2e8f0" />
    </svg>
  );
}

export default function FearGreed({ fearGreed }) {
  const { t } = useTranslation();

  if (!fearGreed || fearGreed.length === 0) {
    return (
      <Card title={t("fearGreed.title")}>
        <p className="text-text-dim text-sm">{t("fearGreed.noData")}</p>
      </Card>
    );
  }

  const current = fearGreed[0];
  const info = getLabel(current.value);

  return (
    <Card title={t("fearGreed.title")} subtitle={t("fearGreed.subtitle")}>
      <div className="text-center space-y-2">
        <Gauge value={current.value} />
        <div>
          <span className={`text-3xl font-bold tabular-nums ${info.color}`}>{current.value}</span>
          <p className={`text-sm font-medium ${info.color}`}>{t(info.textKey)}</p>
        </div>
        <div className="inline-block px-3 py-1 rounded-full bg-border/50 text-xs text-text-secondary">
          {t(info.signalKey)}
        </div>
      </div>
    </Card>
  );
}
