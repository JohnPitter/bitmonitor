import { useEffect, useMemo, useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Card from "../common/Card";
import { normalizeCycleForOverlay } from "../../lib/cycle";
import { PATTERN } from "../../lib/constants";
import { useTranslation, INTL_LOCALE_MAP } from "../../i18n";

const CYCLE_COLORS = ["#506679", "#2D7B7B", "#5AC2B0", "#D58A3E"];

function formatDate(ts, intlLocale) {
  if (!ts) return "";
  return new Date(ts).toLocaleDateString(intlLocale, { day: "numeric", month: "short", year: "numeric" });
}

function formatAxisDate(ts, intlLocale) {
  if (!ts) return "";
  return new Date(ts).toLocaleDateString(intlLocale, { month: "short", year: "2-digit" });
}

function CustomTooltip({ active, payload, label, overlays, intlLocale, t }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-[20px] border border-border/80 bg-[rgba(6,12,18,0.96)] px-4 py-3 text-sm shadow-[0_24px_60px_rgba(0,0,0,0.34)]">
      <p className="mb-2 text-[11px] uppercase tracking-[0.18em] text-text-dim">{t("cycleOverlay.day", { number: label })}</p>
      <div className="space-y-1.5">
        {payload.map((point) => {
          const cycleIdx = parseInt(point.dataKey.replace("cycle", ""), 10) - 1;
          const overlay = overlays[cycleIdx];
          const currentPoint = overlay?.data.find((item) => item.day === label);
          const dateLabel = currentPoint ? formatDate(currentPoint.timestamp, intlLocale) : "";

          return (
            <div key={point.name} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: point.stroke }} />
                <span className="text-text-secondary">{point.name}</span>
              </div>
              <div className="text-right">
                <div className="font-medium tabular-nums text-text-primary">{Number(point.value).toFixed(1)}x</div>
                {dateLabel && <div className="text-[11px] text-text-dim">{dateLabel}</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function CycleOverlay({ priceHistory }) {
  const { t, locale } = useTranslation();
  const intlLocale = INTL_LOCALE_MAP[locale];
  const [chartReady, setChartReady] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setChartReady(true));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const overlays = useMemo(
    () => (priceHistory ? normalizeCycleForOverlay(priceHistory) : []),
    [priceHistory],
  );

  const chartData = useMemo(() => {
    if (overlays.length === 0) return [];

    const maxDays = Math.max(...overlays.map((overlay) => (overlay.data.length > 0 ? overlay.data[overlay.data.length - 1].day : 0)));
    const dayMap = new Map();

    for (let day = 0; day <= maxDays; day += 1) {
      dayMap.set(day, { day });
    }

    overlays.forEach((overlay, index) => {
      const key = `cycle${index + 1}`;

      for (const point of overlay.data) {
        const entry = dayMap.get(point.day);
        if (entry) entry[key] = point.normalized;
      }
    });

    return Array.from(dayMap.values());
  }, [overlays]);

  const currentCycle = overlays[overlays.length - 1];

  const dateTicks = useMemo(() => {
    if (!currentCycle?.data.length) return [];
    const seen = new Set();
    const ticks = [];

    for (const point of currentCycle.data) {
      const date = new Date(point.timestamp);
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      if (!seen.has(key)) {
        seen.add(key);
        ticks.push({ day: point.day, timestamp: point.timestamp });
      }
    }

    const step = Math.max(1, Math.floor(ticks.length / 8));
    return ticks.filter((_, index) => index % step === 0);
  }, [currentCycle]);

  if (chartData.length === 0) return null;

  return (
    <Card icon="⟁" title={t("cycleOverlay.title")} subtitle={t("cycleOverlay.subtitle")}>
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full border border-border/70 bg-white/4 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-text-secondary">
            {currentCycle?.label ?? "Cycle Atlas"}
          </span>
          <span className="rounded-full border border-btc/20 bg-btc/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-btc">
            {PATTERN.claimedBullDays}d / {PATTERN.claimedBearDays}d
          </span>
        </div>

        <div className="min-w-0 rounded-[28px] border border-border/70 bg-black/18 p-3 sm:p-4">
          <div className="min-w-0 h-[320px] sm:h-[390px]">
            {!chartReady ? (
              <div className="h-full rounded-[22px] border border-white/6 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),transparent)]" />
            ) : (
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <LineChart data={chartData} margin={{ top: 10, right: 12, left: 4, bottom: 18 }}>
                <CartesianGrid vertical={false} strokeDasharray="4 12" />
                <XAxis
                  dataKey="day"
                  tick={{ fill: "#87959a", fontSize: 11 }}
                  tickFormatter={(day) => {
                    const tick = dateTicks.find((item) => item.day === day);
                    return tick ? formatAxisDate(tick.timestamp, intlLocale) : `${day}d`;
                  }}
                  ticks={dateTicks.map((item) => item.day)}
                  interval={0}
                  angle={-32}
                  textAnchor="end"
                  height={46}
                  axisLine={{ stroke: "rgba(54, 96, 107, 0.56)" }}
                  tickLine={false}
                />
                <YAxis
                  scale="log"
                  domain={["auto", "auto"]}
                  tick={{ fill: "#87959a", fontSize: 11 }}
                  tickFormatter={(value) => `${value}x`}
                  width={48}
                  axisLine={{ stroke: "rgba(54, 96, 107, 0.56)" }}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip overlays={overlays} intlLocale={intlLocale} t={t} />} />
                <Legend wrapperStyle={{ fontSize: 12, paddingTop: 12 }} />
                <ReferenceLine
                  x={PATTERN.claimedBullDays}
                  stroke="#D58A3E"
                  strokeDasharray="6 6"
                  strokeOpacity={0.7}
                  label={{ value: "~1064d", fill: "#D58A3E", fontSize: 11, position: "top" }}
                />

                {overlays.map((overlay, index) => (
                  <Line
                    key={overlay.id}
                    type="monotone"
                    dataKey={`cycle${index + 1}`}
                    name={overlay.label}
                    stroke={CYCLE_COLORS[index]}
                    strokeWidth={index === overlays.length - 1 ? 3.2 : 1.7}
                    strokeOpacity={index === overlays.length - 1 ? 1 : 0.55}
                    dot={false}
                    connectNulls={false}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
