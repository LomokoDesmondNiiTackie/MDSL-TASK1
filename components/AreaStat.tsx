"use client";
 
import * as d3 from "d3";
import { useEffect, useId, useRef, useState } from "react";
 
type StatCardProps = {
  label: string;
  value: number;
  change: number;
  data: number[];
  color: string; 
};

export default function AreaStatCard({ label, value, change, data, color }: StatCardProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const gradId = `grad-${useId().replace(/:/g, "")}`;
 
  const height = 110;
  const pad = { top: 10, right: 10, bottom: 0, left: 0 };
 
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setWidth(e.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
 
  const innerW = Math.max(0, width - pad.left - pad.right);
  const innerH = height - pad.top - pad.bottom;
 
  const x = d3
    .scaleLinear()
    .domain([0, data.length - 1])
    .range([0, innerW]);
 
  const [min, max] = d3.extent(data) as [number, number];
  const y = d3
    .scaleLinear()
    .domain([min - (max - min) * 0.4, max + (max - min) * 0.1])
    .range([innerH, 0]);
 
  const line = d3
    .line<number>()
    .x((_, i) => x(i))
    .y((d) => y(d))
    .curve(d3.curveMonotoneX);
 
  const area = d3
    .area<number>()
    .x((_, i) => x(i))
    .y0(innerH)
    .y1((d) => y(d))
    .curve(d3.curveMonotoneX);
 
  const lastX = x(data.length - 1);
  const lastY = y(data[data.length - 1]);
  const positive = change >= 0;
 
  return (
    <article className="overflow-hidden rounded-3xl bg-[#202228] pt-5 text-white">
      <div className="flex items-start justify-between px-5">
        <div>
          <p className="text-sm text-white/60">{label}</p>
          <p className="mt-1 text-2xl font-bold tabular-nums">
            ${value.toLocaleString("en-US").replace(/,/g, " ")}
          </p>
        </div>
 
        <span
          className="flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium tabular-nums"
          style={{
            color: positive ? "#34d399" : "#fb7185",
            background: positive ? "rgba(52,211,153,.12)" : "rgba(251,113,133,.12)",
          }}
        >
          <span
            aria-hidden
            className="flex size-4 items-center justify-center rounded-full text-[10px] text-[#202228]"
            style={{ background: positive ? "#34d399" : "#fb7185" }}
          >
            {positive ? "↗" : "↘"}
          </span>
          {positive ? "+" : ""}
          {change}%
        </span>
      </div>
 
      <div ref={wrapRef} className="mt-3 w-full">
        {width > 0 && (
          <svg
            width={width}
            height={height}
            role="img"
            aria-label={`${label} trend, ${positive ? "up" : "down"} ${Math.abs(change)} percent`}
            className="block"
          >
            <defs>
              <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.55} />
                <stop offset="100%" stopColor={color} stopOpacity={0.05} />
              </linearGradient>
            </defs>
 
            <g transform={`translate(${pad.left},${pad.top})`}>
              <path d={area(data) ?? ""} fill={`url(#${gradId})`} />
              <path
                d={line(data) ?? ""}
                fill="none"
                stroke={color}
                strokeWidth={2}
                strokeLinecap="round"
              />
              <circle
                cx={lastX}
                cy={lastY}
                r={5}
                fill="#202228"
                stroke={color}
                strokeWidth={2.5}
              />
            </g>
          </svg>
        )}
      </div>
    </article>
  );
}