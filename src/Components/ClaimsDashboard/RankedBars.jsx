/* eslint-disable react/prop-types */
import { useState } from "react";
import { formatNumber, rampStep } from "./chartUtils";

/**
 * Horizontal ranked bars for magnitude comparison (claims by type, by state).
 * Sequential encoding: one blue hue, magnitude carried by lightness, so the
 * ordering is readable without relying on hue identity. Every bar is directly
 * labelled, which is also the relief the light-mode contrast check requires.
 */
const RankedBars = ({ rows, labelKey, valueKey, secondary, valueLabel }) => {
  const [activeKey, setActiveKey] = useState(null);
  const max = Math.max(...rows.map((row) => Number(row[valueKey]) || 0), 1);

  return (
    <ul className="ranked-bars">
      {rows.map((row, index) => {
        const label = row[labelKey];
        const value = Number(row[valueKey]) || 0;
        const step = rampStep(index, rows.length);
        return (
          <li key={label} className="ranked-bar-item">
            <button
              type="button"
              className={`ranked-bar ${activeKey === label ? "active" : ""}`}
              onMouseEnter={() => setActiveKey(label)}
              onMouseLeave={() => setActiveKey(null)}
              onFocus={() => setActiveKey(label)}
              onBlur={() => setActiveKey(null)}
              aria-label={`${label}: ${formatNumber(value)} ${valueLabel}`}
            >
              <span className="ranked-bar-label">{label}</span>
              <span className="ranked-bar-track">
                <span
                  className="ranked-bar-fill"
                  style={{
                    width: `${Math.max((value / max) * 100, 1.5)}%`,
                    background: `var(--viz-seq-${step})`,
                  }}
                />
              </span>
              <span className="ranked-bar-value">{formatNumber(value)}</span>
            </button>
            {activeKey === label && (
              <span className="viz-tooltip ranked-bar-tooltip" role="status">
                <strong>{label}</strong>
                <span>
                  {formatNumber(value)} {valueLabel}
                </span>
                {secondary?.(row)}
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );
};

export default RankedBars;
