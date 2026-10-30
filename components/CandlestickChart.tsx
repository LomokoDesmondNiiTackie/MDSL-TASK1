"use client";

import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";

export type Candle = {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
};

const UP = "#16a34a";
const DOWN = "#dc2626";

export default function CandlestickChart({
  data,
  height = 420,
}: {
  data: Candle[];
  height?: number;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [width, setWidth] = useState(0);
  const [hover, setHover] = useState<Candle | null>(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) =>
      setWidth(entry.contentRect.width),
    );
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!svgRef.current || !width || !data.length) return;

    const margin = { top: 12, right: 60, bottom: 28, left: 8 };
    const innerW = width - margin.left - margin.right;
    const innerH = height - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const x = d3
      .scaleBand<string>()
      .domain(data.map((d) => d.date))
      .range([0, innerW])
      .padding(0.3);

    const yMin = d3.min(data, (d) => d.low)!;
    const yMax = d3.max(data, (d) => d.high)!;
    const pad = (yMax - yMin) * 0.05;
    const y = d3
      .scaleLinear()
      .domain([yMin - pad, yMax + pad])
      .range([innerH, 0])
      .nice();

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    g.append("g")
      .attr("transform", `translate(${innerW},0)`)
      .call(d3.axisRight(y).ticks(6).tickSize(-innerW))
      .call((a) => a.select(".domain").remove())
      .call((a) =>
        a.selectAll("line").attr("stroke", "currentColor").attr("opacity", 0.1),
      )
      .call((a) =>
        a.selectAll("text").attr("font-size", 11).attr("opacity", 0.7),
      );

    const step = Math.ceil(data.length / 8);
    g.append("g")
      .attr("transform", `translate(0,${innerH})`)
      .call(
        d3
          .axisBottom(x)
          .tickValues(x.domain().filter((_, i) => i % step === 0))
          .tickSizeOuter(0),
      )
      .call((a) =>
        a.selectAll("text").attr("font-size", 11).attr("opacity", 0.7),
      );

    const candle = g
      .selectAll("g.candle")
      .data(data)
      .join("g")
      .attr("class", "candle")
      .attr("color", (d) => (d.close >= d.open ? UP : DOWN));

    candle
      .append("line")
      .attr("x1", (d) => x(d.date)! + x.bandwidth() / 2)
      .attr("x2", (d) => x(d.date)! + x.bandwidth() / 2)
      .attr("y1", (d) => y(d.high))
      .attr("y2", (d) => y(d.low))
      .attr("stroke", "currentColor");

    candle
      .append("rect")
      .attr("x", (d) => x(d.date)!)
      .attr("width", x.bandwidth())
      .attr("y", (d) => y(Math.max(d.open, d.close)))
      .attr("height", (d) => Math.max(1, Math.abs(y(d.open) - y(d.close))))
      .attr("fill", "currentColor");

    const cross = g
      .append("line")
      .attr("y1", 0)
      .attr("y2", innerH)
      .attr("stroke", "currentColor")
      .attr("opacity", 0.3)
      .attr("stroke-dasharray", "3 3")
      .style("display", "none");

    g.append("rect")
      .attr("width", innerW)
      .attr("height", innerH)
      .attr("fill", "transparent")
      .on("mousemove", (event) => {
        const [mx] = d3.pointer(event);
        const i = Math.min(
          data.length - 1,
          Math.max(0, Math.floor(mx / x.step())),
        );
        const d = data[i];
        cross
          .style("display", null)
          .attr("x1", x(d.date)! + x.bandwidth() / 2)
          .attr("x2", x(d.date)! + x.bandwidth() / 2);
        setHover(d);
      })
      .on("mouseleave", () => {
        cross.style("display", "none");
        setHover(null);
      });
  }, [data, width, height]);

  const last = hover ?? data[data.length - 1];

  return (
    <div ref={wrapRef} className="w-full">
      {last && (
        <div className="mb-2 flex flex-wrap gap-x-4 gap-y-1 text-xs tabular-nums">
          <span className="font-medium">{last.date}</span>
          <span>O {last.open.toFixed(4)}</span>
          <span>H {last.high.toFixed(4)}</span>
          <span>L {last.low.toFixed(4)}</span>
          <span style={{ color: last.close >= last.open ? UP : DOWN }}>
            C {last.close.toFixed(4)}
          </span>
        </div>
      )}
      <svg ref={svgRef} width={width} height={height} className="block" />
    </div>
  );
}
