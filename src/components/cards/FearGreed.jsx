import Card from "../common/Card";

function getLabel(value) {
  if (value <= 25) return { text: "Extreme Fear", color: "text-fear", signal: "Strong Buy Signal" };
  if (value <= 45) return { text: "Fear", color: "text-bear", signal: "Buy Signal" };
  if (value <= 55) return { text: "Neutral", color: "text-neutral", signal: "Hold" };
  if (value <= 75) return { text: "Greed", color: "text-btc", signal: "Caution" };
  return { text: "Extreme Greed", color: "text-greed", signal: "Sell Signal" };
}

function Gauge({ value }) {
  // Simple arc gauge
  const angle = (value / 100) * 180 - 90; // -90 to 90 degrees
  const radius = 50;
  const cx = 60;
  const cy = 55;

  // Arc path
  const startAngle = -90;
  const endAngle = 90;
  const startRad = (startAngle * Math.PI) / 180;
  const endRad = (endAngle * Math.PI) / 180;
  const needleRad = (angle * Math.PI) / 180;

  const arcStart = { x: cx + radius * Math.cos(startRad), y: cy + radius * Math.sin(startRad) };
  const arcEnd = { x: cx + radius * Math.cos(endRad), y: cy + radius * Math.sin(endRad) };
  const needleTip = { x: cx + (radius - 8) * Math.cos(needleRad), y: cy + (radius - 8) * Math.sin(needleRad) };

  return (
    <svg viewBox="0 0 120 70" className="w-full max-w-[160px] mx-auto">
      {/* Background arc */}
      <path
        d={`M ${arcStart.x} ${arcStart.y} A ${radius} ${radius} 0 0 1 ${arcEnd.x} ${arcEnd.y}`}
        fill="none"
        stroke="#1e1e2e"
        strokeWidth="8"
        strokeLinecap="round"
      />
      {/* Gradient segments */}
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
            opacity="0.3"
          />,
        );
        acc.endAngle = segEnd;
        return acc;
      }, { elements: [], endAngle: -90 }).elements}
      {/* Needle */}
      <line x1={cx} y1={cy} x2={needleTip.x} y2={needleTip.y} stroke="#e2e8f0" strokeWidth="2" strokeLinecap="round" />
      <circle cx={cx} cy={cy} r="3" fill="#e2e8f0" />
    </svg>
  );
}

export default function FearGreed({ fearGreed }) {
  if (!fearGreed || fearGreed.length === 0) {
    return (
      <Card title="Fear & Greed Index">
        <p className="text-text-dim text-sm">No data available</p>
      </Card>
    );
  }

  const current = fearGreed[0];
  const info = getLabel(current.value);

  return (
    <Card title="Fear & Greed Index" subtitle="Market sentiment indicator">
      <div className="text-center space-y-2">
        <Gauge value={current.value} />
        <div>
          <span className={`text-3xl font-bold tabular-nums ${info.color}`}>{current.value}</span>
          <p className={`text-sm font-medium ${info.color}`}>{info.text}</p>
        </div>
        <div className="inline-block px-3 py-1 rounded-full bg-border/50 text-xs text-text-secondary">
          {info.signal}
        </div>
      </div>
    </Card>
  );
}
