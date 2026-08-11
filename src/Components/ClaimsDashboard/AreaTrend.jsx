/* eslint-disable react/prop-types */
import { useId, useState } from "react";
import useElementWidth from "../../hooks/useElementWidth";
import {
  buildTicks,
  formatCompact,
  formatMonth,
  formatMonthShort,
  formatNumber,
  niceMax,
} from "./chartUtils";

const HEIGHT = 260;
const PADDING = { top: 16, right: 16, bottom: 34, left: 44 };

/**
 * Monthly claim volume. One series, so the title names it and no legend box is
 * needed; a crosshair + tooltip carries per-point values instead of labelling
 * every point.
 */
const AreaTrend = ({ rows }) => {
  const [ref, width] = useElementWidth();
  const [activeIndex, setActiveIndex] = useState(null);
  const gradientId = useId();

  const plotWidth = Math.max(width - PADDING.left - PADDING.right, 10);
  const plotHeight = HEIGHT - PADDING.top - PADDING.bottom;
  const max = niceMax(Math.max(...rows.map((row) => row.total_claims), 0) * 1.1);

  const xAt = (index) =>
    PADDING.left + (rows.length === 1 ? plotWidth / 2 : (plotWidth * index) / (rows.length - 1));
  const yAt = (value) => PADDING.top + plotHeight - (value / max) * plotHeight;

  const points = rows.map((row, index) => [xAt(index), yAt(row.total_claims)]);
  const linePath = points.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x},${y}`).join(" ");
  const areaPath = `${linePath} L${points.at(-1)[0]},${PADDING.top + plotHeight} L${points[0][0]},${
    PADDING.top + plotHeight
  } Z`;

  // Fewer labels on narrow viewports so month ticks never collide.
  const labelEvery = plotWidth / rows.length < 46 ? 2 : 1;
  const active = activeIndex === null ? null : rows[activeIndex];

  const handleMove = (event) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - bounds.left - PADDING.left;
    const ratio = plotWidth === 0 ? 0 : x / plotWidth;
    const index = Math.round(ratio * (rows.length - 1));
    setActiveIndex(Math.max(0, Math.min(rows.length - 1, index)));
  };

  return (
    <div className="chart-frame" ref={ref}>
      {width > 0 && (
        <svg
          width={width}
          height={HEIGHT}
          role="img"
          aria-label={`Claim volume by month, ${formatMonth(rows[0])} to ${formatMonth(rows.at(-1))}`}
          onMouseMove={handleMove}
          onMouseLeave={() => setActiveIndex(null)}
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--viz-line)" stopOpacity="0.34" />
              <stop offset="100%" stopColor="var(--viz-line)" stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {buildTicks(max).map((tick) => (
            <g key={tick}>
              <line
                x1={PADDING.left}
                x2={PADDING.left + plotWidth}
                y1={yAt(tick)}
                y2={yAt(tick)}
                className="viz-gridline"
              />
              <text x={PADDING.left - 10} y={yAt(tick) + 4} className="viz-axis-label" textAnchor="end">
                {formatCompact(Math.round(tick))}
              </text>
            </g>
          ))}

          <path d={areaPath} fill={`url(#${gradientId})`} />
          <path d={linePath} className="viz-line" />

          {/* With only a handful of periods the line reads as a continuous
              trend it hasn't earned -- mark the actual observations. */}
          {rows.length <= 8 &&
            points.map(([x, y], index) => (
              <circle
                key={rows[index].claim_year * 100 + rows[index].claim_month}
                cx={x}
                cy={y}
                r="4"
                className="viz-point"
              />
            ))}

          {rows.map((row, index) => (
            <text
              key={`${row.claim_year}-${row.claim_month}`}
              x={xAt(index)}
              y={HEIGHT - 12}
              className="viz-axis-label"
              textAnchor="middle"
              opacity={index % labelEvery === 0 ? 1 : 0}
            >
              {formatMonthShort(row)}
            </text>
          ))}

          {active && (
            <g>
              <line
                x1={xAt(activeIndex)}
                x2={xAt(activeIndex)}
                y1={PADDING.top}
                y2={PADDING.top + plotHeight}
                className="viz-crosshair"
              />
              <circle
                cx={xAt(activeIndex)}
                cy={yAt(active.total_claims)}
                r="5"
                className="viz-marker"
              />
            </g>
          )}
        </svg>
      )}

      {active && (
        <div
          className="viz-tooltip"
          style={{
            left: `${Math.min(Math.max(xAt(activeIndex), 80), Math.max(width - 80, 80))}px`,
            top: `${yAt(active.total_claims)}px`,
          }}
        >
          <strong>{formatMonth(active)}</strong>
          <span>{formatNumber(active.total_claims)} claims</span>
          <span>{formatNumber(active.resolved_claims)} resolved</span>
          <span>{active.resolution_rate}% resolution rate</span>
        </div>
      )}
    </div>
  );
};

export default AreaTrend;
