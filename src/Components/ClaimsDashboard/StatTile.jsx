/* eslint-disable react/prop-types */

/** Headline figure with a supporting note. A KPI row of these replaces what
 *  would otherwise be a meaningless one-bar chart per metric. */
const StatTile = ({ label, value, note }) => (
  <article className="stat-tile">
    <p className="stat-tile-label">{label}</p>
    <p className="stat-tile-value">{value}</p>
    {note && <p className="stat-tile-note">{note}</p>}
  </article>
);

export default StatTile;
