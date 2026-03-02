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
import { useTranslation, INTL_LOCALE_MAP } from "../../i18n";

const CYCLE_COLORS = ["#9ca3af", "#3b82f6", "#a855f7", "#d97706"];

function formatDate(ts, intlLocale) {
  if (!ts) return "";
  return new Date(ts).toLocaleDateString(intlLocale, { day: "numeric", month: "short", year: "numeric" });
}

function formatAxisDate(ts, intlLocale) {
  if (!ts) return "";
  return new Date(ts).toLocaleDateString(intlLocale, { month: "short", year: "2-digit" });
}

function CustomTooltip({ active, payload, label, t, intlLocale, overlays }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-3 text-sm shadow-lg">
      <p className="text-text-dim mb-1.5 font-medium">{t("cycleOverlay.day", { number: label })}</p>
      {payload.map((p, idx) => {
        const cycleIdx = parseInt(p.dataKey.replace("cycle", "")) - 1;
        const overlay = overlays[cycleIdx];
        const point = overlay?.data.find((d) => d.day === label);
        const dateStr = point ? formatDate(point.timestamp, intlLocale) : "";
        return (
          <div key={p.name} className="flex items-center gap-2" style={{ color: p.stroke }}>
            <span className="tabular-nums">{p.name}: {Number(p.value).toFixed(1)}x</span>
            {dateStr && <span className="text-text-dim text-xs">({dateStr})</span>}
          </div>
        );
      })}
    </div>
  );
}

export default function CycleOverlay({ priceHistory }) {
  const { t, locale } = useTranslation();
  const intlLocale = INTL_LOCALE_MAP[locale];

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

  // Current cycle (last one) date ticks for the secondary X axis labels
  const currentCycle = overlays[overlays.length - 1];
  const dateTicks = useMemo(() => {
    if (!currentCycle?.data.length) return [];
    const data = currentCycle.data;
    const seen = new Set();
    const ticks = [];
    for (const point of data) {
      const d = new Date(point.timestamp);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      if (!seen.has(key)) {
        seen.add(key);
        ticks.push({ day: point.day, timestamp: point.timestamp });
      }
    }
    // Show every ~3 months to avoid clutter
    const step = Math.max(1, Math.floor(ticks.length / 8));
    return ticks.filter((_, i) => i % step === 0);
  }, [currentCycle]);

  if (chartData.length === 0) return null;

  return (
    <Card
      icon="📉"
      title={t("cycleOverlay.title")}
      subtitle={t("cycleOverlay.subtitle")}
    >
      <div className="h-[300px] sm:h-[380px] -mx-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 20 }}>
            <XAxis
              dataKey="day"
              tick={{ fill: "#9ca3af", fontSize: 11 }}
              tickFormatter={(d) => {
                const tick = dateTicks.find((t) => t.day === d);
                if (tick) return formatAxisDate(tick.timestamp, intlLocale);
                return `${d}d`;
              }}
              ticks={dateTicks.map((t) => t.day)}
              interval={0}
              angle={-35}
              textAnchor="end"
              height={45}
            />
            <YAxis
              scale="log"
              domain={["auto", "auto"]}
              tick={{ fill: "#9ca3af", fontSize: 11 }}
              tickFormatter={(v) => `${v}x`}
              width={45}
            />
            <Tooltip content={<CustomTooltip t={t} intlLocale={intlLocale} overlays={overlays} />} />
            <Legend
              wrapperStyle={{ fontSize: 12, paddingTop: 10, color: "#4b5563" }}
            />
            <ReferenceLine
              x={PATTERN.claimedBullDays}
              stroke="#dc2626"
              strokeDasharray="6 4"
              strokeOpacity={0.5}
              label={{ value: "~1064d", fill: "#dc2626", fontSize: 11, position: "top" }}
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
