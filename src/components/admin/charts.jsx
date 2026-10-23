"use client";

/**
 * Chart primitives built with plain SVG / CSS so the admin console stays
 * dependency free and strictly monochrome.
 */

export function ColumnChart({ data, height = 140, emptyLabel = "No data yet" }) {
  const max = Math.max(1, ...data.map((point) => point.value));

  if (!data.length) {
    return <p className="py-10 text-center text-sm text-zinc-400">{emptyLabel}</p>;
  }

  return (
    <div className="w-full">
      <div className="flex items-end gap-1" style={{ height }}>
        {data.map((point) => {
          const ratio = point.value / max;
          return (
            <div key={point.label} className="group flex h-full flex-1 flex-col justify-end" title={`${point.label}: ${point.value}`}>
              <div
                className={`w-full rounded-t transition-all ${point.value > 0 ? "bg-zinc-900 group-hover:bg-zinc-600" : "bg-zinc-200"}`}
                style={{ height: `${Math.max(point.value > 0 ? 6 : 2, ratio * 100)}%` }}
              />
            </div>
          );
        })}
      </div>
      <div className="mt-2 flex justify-between text-[10px] font-medium uppercase tracking-wide text-zinc-400">
        <span>{data[0]?.label}</span>
        <span>{data[data.length - 1]?.label}</span>
      </div>
    </div>
  );
}

export function BarList({ data, emptyLabel = "No data yet", valueSuffix = "" }) {
  const max = Math.max(1, ...data.map((row) => row.value));

  if (!data.length) {
    return <p className="py-6 text-center text-sm text-zinc-400">{emptyLabel}</p>;
  }

  return (
    <ul className="space-y-3">
      {data.map((row) => (
        <li key={row.label}>
          <div className="flex items-baseline justify-between gap-3 text-sm">
            <span className="truncate font-medium capitalize text-zinc-700">{row.label}</span>
            <span className="shrink-0 tabular-nums text-zinc-500">
              {row.value}
              {valueSuffix}
            </span>
          </div>
          <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-zinc-100">
            <div className="h-full rounded-full bg-zinc-900" style={{ width: `${(row.value / max) * 100}%` }} />
          </div>
        </li>
      ))}
    </ul>
  );
}

export function DonutChart({ segments, size = 132, thickness = 16 }) {
  const total = segments.reduce((sum, segment) => sum + segment.value, 0);
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const shades = ["#18181b", "#3f3f46", "#71717a", "#a1a1aa", "#d4d4d8", "#e4e4e7"];

  let offset = 0;

  return (
    <div className="flex flex-wrap items-center gap-6">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#f4f4f5" strokeWidth={thickness} />
        {total > 0 &&
          segments.map((segment, index) => {
            const length = (segment.value / total) * circumference;
            const circle = (
              <circle
                key={segment.label}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={shades[index % shades.length]}
                strokeWidth={thickness}
                strokeDasharray={`${length} ${circumference - length}`}
                strokeDashoffset={-offset}
              />
            );
            offset += length;
            return circle;
          })}
      </svg>

      <ul className="space-y-2 text-sm">
        {segments.map((segment, index) => (
          <li key={segment.label} className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 shrink-0 rounded-sm" style={{ background: shades[index % shades.length] }} />
            <span className="capitalize text-zinc-600">{segment.label}</span>
            <span className="font-semibold tabular-nums text-zinc-900">{segment.value}</span>
          </li>
        ))}
        {!segments.length && <li className="text-zinc-400">No data yet</li>}
      </ul>
    </div>
  );
}
