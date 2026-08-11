const MONTH_LABELS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export const formatMonth = (row) => `${MONTH_LABELS[(row.claim_month ?? 1) - 1]} ${row.claim_year}`;
export const formatMonthShort = (row) => MONTH_LABELS[(row.claim_month ?? 1) - 1];
export const formatQuarter = (row) => `Q${row.claim_quarter} ${row.claim_year}`;

export const formatNumber = (value) =>
  typeof value === "number" ? value.toLocaleString("en-US") : "—";

export const formatCompact = (value) => {
  if (typeof value !== "number") return "—";
  if (Math.abs(value) >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (Math.abs(value) >= 1_000) return `${(value / 1_000).toFixed(1)}k`;
  return `${value}`;
};

export const formatCurrency = (value) =>
  typeof value === "number"
    ? value.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })
    : "—";

export const formatCurrencyCompact = (value) => {
  if (typeof value !== "number") return "—";
  if (Math.abs(value) >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (Math.abs(value) >= 1_000) return `$${(value / 1_000).toFixed(0)}k`;
  return `$${value}`;
};

export const formatPercent = (value) =>
  typeof value === "number" ? `${value.toFixed(1)}%` : "—";

export const sumBy = (rows, key) =>
  rows.reduce((total, row) => total + (Number(row?.[key]) || 0), 0);

// Fine enough that a series topping out at 305 gets a 350 axis rather than a
// 500 one -- a coarse ladder squashes the plot into the bottom half.
const NICE_STEPS = [1, 1.2, 1.5, 2, 2.5, 3, 3.5, 4, 5, 6, 8, 10];

/** "Nice" upper bound for an axis, so gridlines land on readable round numbers. */
export const niceMax = (value) => {
  if (!Number.isFinite(value) || value <= 0) return 1;
  const magnitude = 10 ** Math.floor(Math.log10(value));
  const normalized = value / magnitude;
  const step = NICE_STEPS.find((candidate) => normalized <= candidate) ?? 10;
  return step * magnitude;
};

/**
 * Gridline values for a 0..max axis. Tries 4, then 5, then 3 intervals and
 * takes the first that divides into round numbers -- otherwise a 350 axis
 * would tick at 87.5 / 175 / 262.5.
 */
export const buildTicks = (max) => {
  const unit = 10 ** Math.floor(Math.log10(max)) / 10;
  const count =
    [4, 5, 3].find((candidate) => Number.isInteger(Number((max / candidate / unit).toFixed(6)))) ?? 4;
  return Array.from({ length: count + 1 }, (_, index) => (max / count) * index);
};

/**
 * Maps a rank within `total` items onto the 5-step ordinal ramp, largest value
 * to step 5. Sequential encoding: one hue, magnitude carried by lightness.
 */
export const rampStep = (rank, total) => {
  if (total <= 1) return 5;
  const position = 1 - rank / (total - 1);
  return Math.max(1, Math.min(5, Math.round(position * 4) + 1));
};
