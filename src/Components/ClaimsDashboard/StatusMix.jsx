/* eslint-disable react/prop-types */
import { useState } from "react";
import { formatNumber, formatQuarter } from "./chartUtils";

const SERIES = [
  { key: "approved_count", label: "Approved", slot: 1 },
  { key: "denied_count", label: "Denied", slot: 2 },
  { key: "pending_count", label: "Pending", slot: 3 },
];

const UNCLASSIFIED = {
  key: "unclassified",
  label: "Unclassified",
  // Neutral grey, not a categorical slot: "no outcome recorded" is the absence
  // of a category, so it must not read as a fourth peer status.
  color: "var(--viz-neutral)",
};

/**
 * Quarterly claim outcomes as a part-to-whole stacked bar.
 *
 * Shares are taken against `total_claims`, not against the sum of the three
 * outcome columns. Those disagree in the real Gold layer -- a quarter can carry
 * 112 claims with only 19 classified -- and dividing by the outcome sum would
 * render that as "19 approved, 100%". The shortfall is shown as an explicit
 * Unclassified remainder instead of being hidden in the denominator.
 */
const StatusMix = ({ rows }) => {
  const [active, setActive] = useState(null);

  const measured = rows.map((row) => {
    const parts = SERIES.map((series) => ({
      ...series,
      color: `var(--viz-series-${series.slot})`,
      value: Number(row[series.key]) || 0,
    }));
    const classified = parts.reduce((sum, part) => sum + part.value, 0);
    const declared = Number(row.total_claims) || 0;
    const unclassified = Math.max(0, declared - classified);
    const total = Math.max(declared, classified);
    return {
      row,
      total,
      unclassified,
      parts: unclassified > 0 ? [...parts, { ...UNCLASSIFIED, value: unclassified }] : parts,
    };
  });

  const anyUnclassified = measured.some((entry) => entry.unclassified > 0);
  const legend = anyUnclassified
    ? [...SERIES.map((s) => ({ ...s, color: `var(--viz-series-${s.slot})` })), UNCLASSIFIED]
    : SERIES.map((s) => ({ ...s, color: `var(--viz-series-${s.slot})` }));

  return (
    <div className="status-mix">
      <ul className="viz-legend">
        {legend.map((series) => (
          <li key={series.key}>
            <span className="viz-legend-swatch" style={{ background: series.color }} />
            {series.label}
          </li>
        ))}
      </ul>

      {anyUnclassified && (
        <p className="status-caveat">
          Some claims have no outcome recorded in the Gold layer yet; shares are of all claims in
          the quarter.
        </p>
      )}

      <ul className="status-rows">
        {measured.map(({ row, total, parts }) => {
          const denominator = total || 1;
          return (
            <li key={`${row.claim_year}-${row.claim_quarter}`} className="status-row">
              <div className="status-row-head">
                <span className="status-row-label">{formatQuarter(row)}</span>
                <span className="status-row-meta">
                  {formatNumber(row.total_claims)} claims
                  {row.avg_processing_days > 0 && ` · ${row.avg_processing_days} day avg processing`}
                </span>
              </div>

              <div className="status-bar">
                {parts
                  .filter((part) => part.value > 0)
                  .map((part) => {
                    const share = (part.value / denominator) * 100;
                    const id = `${row.claim_year}-${row.claim_quarter}-${part.key}`;
                    return (
                      <button
                        type="button"
                        key={part.key}
                        className="status-segment"
                        style={{ width: `${share}%`, background: part.color }}
                        onMouseEnter={() => setActive(id)}
                        onMouseLeave={() => setActive(null)}
                        onFocus={() => setActive(id)}
                        onBlur={() => setActive(null)}
                        aria-label={`${part.label}: ${formatNumber(
                          part.value
                        )} claims, ${share.toFixed(1)} percent of ${formatQuarter(row)}`}
                      >
                        {active === id && (
                          <span className="viz-tooltip status-tooltip" role="status">
                            <strong>
                              {part.label} · {formatQuarter(row)}
                            </strong>
                            <span>{formatNumber(part.value)} claims</span>
                            <span>{share.toFixed(1)}% of quarter</span>
                          </span>
                        )}
                      </button>
                    );
                  })}
              </div>

              <ul className="status-readout">
                {parts.map((part) => (
                  <li key={part.key}>
                    <span className="viz-legend-swatch" style={{ background: part.color }} />
                    <strong>{formatNumber(part.value)}</strong> {part.label.toLowerCase()}
                    <span className="status-readout-share">
                      {((part.value / denominator) * 100).toFixed(1)}%
                    </span>
                  </li>
                ))}
              </ul>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default StatusMix;
