import { useMemo } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ReferenceLine,
} from "recharts";
import Card from "../common/Card";
import { normalizeCycleForOverlay } from "../../lib/cycle";
import { PATTERN } from "../../lib/constants";
import { useTranslation } from "../../i18n";

const CYCLE_COLORS = ["#6b7280", "#60a5fa", "#c084fc", "#f7931a"];

function CustomTooltip({ active, payload, label, t }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-bg-card border border-border rounded-xl p-3 text-sm shadow-lg">
      <p className="text-text-dim mb-1.5 font-medium">{t("cycleOverlay.day", { number: label })}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.stroke }} className="tabular-nums">
          {p.name}: {Number(p.value).toFixed(1)}x
        </p>
      ))}
    </div>
  );
}

export default function CycleOverlay({ priceHistory }) {
  const { t } = useTranslation();
  const overlays = useMemo(
    () => (priceHistory ? normalizeCycleForOverlay(priceHistory) : []),
    [priceHistory],
  );

  const chartData = useMemo(() => {
    if (overlays.length === 0) return [];

    const maxDays = Math.max(...overlays.map((o) => o.data.length > 0 ? o.data[o.data.length - 1].day : 0));
    const dayMap = new Map();

    for (let d = 0; d <= maxDays; d++) {
      dayMap.set(d, { day: d });
    }

    overlays.forEach((overlay, idx) => {
      const key = `cycle${idx + 1}`;
      for (const point of overlay.data) {
        const entry = dayMap.get(point.day);
        if (entry) entry[key] = point.normalized;
      }
    });

    return Array.from(dayMap.values());
  }, [overlays]);

  if (chartData.length === 0) return null;

  return (
    <Card
      icon="📉"
      title={t("cycleOverlay.title")}
      subtitle={t("cycleOverlay.subtitle")}
    >
      <div className="h-[300px] sm:h-[380px] -mx-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <XAxis
              dataKey="day"
              tick={{ fill: "#6b6b80", fontSize: 11 }}
              tickFormatter={(d) => `${d}d`}
              interval="preserveStartEnd"
            />
            <YAxis
              scale="log"
              domain={["auto", "auto"]}
              tick={{ fill: "#6b6b80", fontSize: 11 }}
              tickFormatter={(v) => `${v}x`}
              width={45}
            />
            <Tooltip content={<CustomTooltip t={t} />} />
            <Legend
              wrapperStyle={{ fontSize: 12, paddingTop: 10 }}
            />
            <ReferenceLine
              x={PATTERN.claimedBullDays}
              stroke="#f87171"
              strokeDasharray="6 4"
              strokeOpacity={0.4}
              label={{ value: "~1064d", fill: "#f87171", fontSize: 11, position: "top" }}
            />
            {overlays.map((overlay, idx) => (
              <Line
                key={overlay.id}
                type="monotone"
                dataKey={`cycle${idx + 1}`}
                name={overlay.label}
                stroke={CYCLE_COLORS[idx]}
                strokeWidth={idx === overlays.length - 1 ? 3 : 1.5}
                dot={false}
                strokeOpacity={idx === overlays.length - 1 ? 1 : 0.5}
                connectNulls={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
