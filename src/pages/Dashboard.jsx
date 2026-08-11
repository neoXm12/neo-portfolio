import { useEffect, useMemo, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { loadGoldTables } from "../data/claimsGold";
import AreaTrend from "../Components/ClaimsDashboard/AreaTrend";
import RankedBars from "../Components/ClaimsDashboard/RankedBars";
import StatusMix from "../Components/ClaimsDashboard/StatusMix";
import StatTile from "../Components/ClaimsDashboard/StatTile";
import DataTable from "../Components/ClaimsDashboard/DataTable";
import Lineage from "../Components/ClaimsDashboard/Lineage";
import GithubLink from "../Components/ClaimsDashboard/GithubLink";
import { PRIVATE_REPO_NOTE, codeIndex, isPrivateRepo, repos } from "../data/repoLinks";
import useDocumentTitle from "../hooks/useDocumentTitle";
import {
  formatCurrency,
  formatCurrencyCompact,
  formatMonth,
  formatNumber,
  formatPercent,
  formatQuarter,
  sumBy,
} from "../Components/ClaimsDashboard/chartUtils";
import "../Components/ClaimsDashboard/ClaimsDashboard.css";

const Dashboard = () => {
  const [state, setState] = useState({ status: "loading" });
  useDocumentTitle("Claims Data Pipeline Dashboard | Nirmad Mudvari");

  useEffect(() => {
    let cancelled = false;
    loadGoldTables().then((result) => {
      if (!cancelled) setState({ status: "ready", ...result });
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const tables = state.tables;

  const kpis = useMemo(() => {
    if (!tables) return null;
    const { summary } = tables;
    const totalClaims = sumBy(summary, "total_claims");
    const totalAmount = sumBy(summary, "total_amount");
    const resolved = sumBy(summary, "resolved_claims");
    const highValue = sumBy(summary, "high_value_claims");
    return {
      totalClaims,
      totalAmount,
      avgClaim: totalClaims ? totalAmount / totalClaims : 0,
      resolutionRate: totalClaims ? (resolved / totalClaims) * 100 : 0,
      highValue,
      highValueShare: totalClaims ? (highValue / totalClaims) * 100 : 0,
      window:
        summary.length > 0 ? `${formatMonth(summary[0])} – ${formatMonth(summary.at(-1))}` : "—",
      months: summary.length,
    };
  }, [tables]);

  return (
    <div className="dashboard-page">
      <section className="section dashboard-hero reveal">
        <p className="section-eyebrow">Production Data Pipeline</p>
        <h1>Claims Data Pipeline Dashboard</h1>
        <p className="section-description">
          A Gold layer, reverse-ETL&apos;d back to where a dashboard can reach it. This page is the
          serving end of a real lakehouse pipeline I built end to end: claims originate in a NestJS
          API on Render, land in Supabase Postgres, get exported to Cloud Storage in batches,
          promoted through Bronze, Silver and Gold on Databricks, then pushed back into a separate
          Supabase project as pre-aggregated marts. Everything below is read straight from those
          four Gold tables.
        </p>

        <div className="dashboard-meta">
          <span className={`data-badge data-badge-${state.source || "loading"}`}>
            {state.status === "loading"
              ? "Loading…"
              : state.source === "live"
                ? "Live from Supabase"
                : "Sample data"}
          </span>
          {state.status === "ready" && state.source === "live" && state.syncedAt && (
            <span className="dashboard-meta-note">
              Last sync {new Date(state.syncedAt).toLocaleString()}
            </span>
          )}
          {state.status === "ready" && state.source === "sample" && (
            <span className="dashboard-meta-note">
              Shape-accurate stand-in — the live Gold tables aren&apos;t wired to this deployment
              {state.error ? ` (${state.error})` : ""}.
            </span>
          )}
          <RouterLink to="/" className="dashboard-back">
            ← Back to portfolio
          </RouterLink>
        </div>

        <div className="dashboard-actions">
          <GithubLink href={repos.pipeline} className="gh-link-primary">
            View the pipeline code
          </GithubLink>
          <GithubLink href={repos.source} className="gh-link-secondary">
            Claims API
          </GithubLink>
          <GithubLink href={repos.portfolio} className="gh-link-secondary">
            View this site&apos;s code
          </GithubLink>
        </div>
      </section>

      {state.status === "loading" && (
        <section className="section dashboard-loading">
          <div className="skeleton-grid" aria-hidden="true">
            {Array.from({ length: 4 }, (_, index) => (
              <div key={index} className="skeleton-tile" />
            ))}
          </div>
          <p className="visually-hidden">Loading dashboard data…</p>
        </section>
      )}

      {state.status === "ready" && kpis && (
        <>
          <section className="section dashboard-kpis reveal" aria-label="Headline metrics">
            <div className="stat-row">
              <StatTile
                label="Total claims"
                value={formatNumber(kpis.totalClaims)}
                // "periods", not "months": the Gold layer only has rows for
                // months that saw claims, so the range can be non-contiguous.
                note={`${kpis.months} monthly ${kpis.months === 1 ? "period" : "periods"} · ${kpis.window}`}
              />
              <StatTile
                label="Total claim value"
                value={formatCurrencyCompact(kpis.totalAmount)}
                note={`${formatCurrency(kpis.avgClaim)} average per claim`}
              />
              <StatTile
                label="Resolution rate"
                value={formatPercent(kpis.resolutionRate)}
                note="Resolved claims as a share of all claims filed"
              />
              <StatTile
                label="High-value claims"
                value={formatNumber(kpis.highValue)}
                note={`${formatPercent(kpis.highValueShare)} of volume, flagged in the Silver layer`}
              />
            </div>
          </section>

          <section className="section dashboard-charts reveal" aria-label="Gold layer analytics">
            <article className="chart-card chart-card-wide">
              <header className="chart-card-head">
                <h2>Claim volume by month</h2>
                <p>
                  From <code>claims_summary</code> — the monthly grain of the Gold layer. Hover for
                  resolution detail.
                </p>
              </header>
              <AreaTrend rows={tables.summary} />
              <DataTable
                caption="monthly claim volume"
                rows={tables.summary}
                rowKey={(row) => `${row.claim_year}-${row.claim_month}`}
                columns={[
                  { key: "month", header: "Month", render: formatMonth },
                  { key: "claims", header: "Claims", numeric: true, render: (r) => formatNumber(r.total_claims) },
                  { key: "amount", header: "Total value", numeric: true, render: (r) => formatCurrency(r.total_amount) },
                  { key: "avg", header: "Avg claim", numeric: true, render: (r) => formatCurrency(r.avg_claim_amount) },
                  { key: "resolved", header: "Resolved", numeric: true, render: (r) => formatNumber(r.resolved_claims) },
                  { key: "rate", header: "Resolution", numeric: true, render: (r) => formatPercent(r.resolution_rate) },
                ]}
              />
            </article>

            <article className="chart-card">
              <header className="chart-card-head">
                <h2>Claims by type</h2>
                <p>
                  From <code>claims_by_type</code>. Shading tracks volume, not identity.
                </p>
              </header>
              <RankedBars
                rows={tables.byType}
                labelKey="claim_type"
                valueKey="claim_count"
                valueLabel="claims"
                secondary={(row) => (
                  <>
                    <span>{formatCurrency(row.total_amount)} total</span>
                    <span>{formatCurrency(row.avg_amount)} average</span>
                    <span>{formatNumber(row.high_value_count)} high-value</span>
                  </>
                )}
              />
              <DataTable
                caption="claims by type"
                rows={tables.byType}
                rowKey={(row) => row.claim_type}
                columns={[
                  { key: "type", header: "Type", render: (r) => r.claim_type },
                  { key: "count", header: "Claims", numeric: true, render: (r) => formatNumber(r.claim_count) },
                  { key: "total", header: "Total value", numeric: true, render: (r) => formatCurrency(r.total_amount) },
                  { key: "avg", header: "Avg", numeric: true, render: (r) => formatCurrency(r.avg_amount) },
                  { key: "max", header: "Max", numeric: true, render: (r) => formatCurrency(r.max_amount) },
                ]}
              />
            </article>

            <article className="chart-card">
              <header className="chart-card-head">
                <h2>Claims by state</h2>
                <p>
                  From <code>claims_by_geography</code>. Same measure as the chart beside it, so it
                  shares the same ramp.
                </p>
              </header>
              <RankedBars
                rows={tables.byGeography}
                labelKey="state"
                valueKey="claim_count"
                valueLabel="claims"
                secondary={(row) => (
                  <>
                    <span>{formatCurrency(row.total_amount)} total</span>
                    <span>{formatCurrency(row.avg_amount)} average</span>
                  </>
                )}
              />
              <DataTable
                caption="claims by state"
                rows={tables.byGeography}
                rowKey={(row) => row.state}
                columns={[
                  { key: "state", header: "State", render: (r) => r.state },
                  { key: "count", header: "Claims", numeric: true, render: (r) => formatNumber(r.claim_count) },
                  { key: "total", header: "Total value", numeric: true, render: (r) => formatCurrency(r.total_amount) },
                  { key: "avg", header: "Avg", numeric: true, render: (r) => formatCurrency(r.avg_amount) },
                ]}
              />
            </article>

            <article className="chart-card chart-card-wide">
              <header className="chart-card-head">
                <h2>Outcome mix by quarter</h2>
                <p>
                  From <code>claims_lifecycle</code>. Part-to-whole, so each quarter&apos;s outcomes
                  share a single bar.
                </p>
              </header>
              <StatusMix rows={tables.lifecycle} />
              <DataTable
                caption="claim outcomes by quarter"
                rows={tables.lifecycle}
                rowKey={(row) => `${row.claim_year}-${row.claim_quarter}`}
                columns={[
                  { key: "quarter", header: "Quarter", render: formatQuarter },
                  { key: "total", header: "Claims", numeric: true, render: (r) => formatNumber(r.total_claims) },
                  { key: "approved", header: "Approved", numeric: true, render: (r) => formatNumber(r.approved_count) },
                  { key: "denied", header: "Denied", numeric: true, render: (r) => formatNumber(r.denied_count) },
                  { key: "pending", header: "Pending", numeric: true, render: (r) => formatNumber(r.pending_count) },
                  { key: "days", header: "Avg days", numeric: true, render: (r) => `${r.avg_processing_days}` },
                ]}
              />
            </article>
          </section>
        </>
      )}

      <section id="pipeline" className="section dashboard-pipeline reveal">
        <div className="section-heading">
          <p className="section-eyebrow">End-to-end structure</p>
          <h2>Where this data comes from.</h2>
          <p className="section-description">
            Nine stages across three repositories and three schedules: claims are generated hourly,
            exported to Cloud Storage every six hours, and promoted through the lakehouse weekly.
            The two Supabase projects are deliberately separate — the source project sits behind the
            API and is never exposed, while the dashboard project holds only pre-aggregated Gold
            marts behind a read-only anon key.
          </p>
        </div>
        <Lineage />
      </section>

      <section id="source" className="section dashboard-source reveal">
        <div className="section-heading">
          <p className="section-eyebrow">Read the code</p>
          <h2>Every stage above, in full.</h2>
          <p className="section-description">
            Three repositories: <code>claims-project</code> generates the data,{" "}
            <GithubLink href={repos.pipeline} showMark={false} className="gh-link-text">
              claims-gcs-to-delta
            </GithubLink>{" "}
            moves and models it, and{" "}
            <GithubLink href={repos.portfolio} showMark={false} className="gh-link-text">
              neo-portfolio
            </GithubLink>{" "}
            serves it. The first is kept private — happy to walk through it or share access on
            request. Jump straight to the modules behind each part of this page.
          </p>
        </div>

        <ul className="code-index">
          {codeIndex.map((entry) => {
            const locked = isPrivateRepo(entry.href);
            const body = (
              <>
                <div className="code-index-head">
                  <h3>{entry.title}</h3>
                  <span aria-hidden="true" className="code-index-arrow">
                    {locked ? "🔒" : "↗"}
                  </span>
                </div>
                <code>{entry.path}</code>
                <p>{entry.detail}</p>
              </>
            );

            return (
              <li key={entry.path}>
                {locked ? (
                  <div className="code-index-card code-index-card-locked" data-note={PRIVATE_REPO_NOTE}>
                    {body}
                    <span className="code-index-locked-note">{PRIVATE_REPO_NOTE}</span>
                  </div>
                ) : (
                  <a
                    href={entry.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="code-index-card"
                  >
                    {body}
                    <span className="visually-hidden">(opens in a new tab)</span>
                  </a>
                )}
              </li>
            );
          })}
        </ul>
      </section>

      <section className="section dashboard-notes reveal">
        <div className="notes-grid">
          <article>
            <h3>Why reverse ETL</h3>
            <p>
              Databricks is the right place to compute aggregates and the wrong place to serve a
              public web page. Pushing finished Gold tables into Postgres gives the dashboard
              millisecond reads with no warehouse running and no cluster to wake.
            </p>
          </article>
          <article>
            <h3>Idempotent by design</h3>
            <p>
              The sync is a batched <code>INSERT … ON CONFLICT DO UPDATE</code> keyed on each
              table&apos;s grain. Re-running the weekly job updates rows in place rather than
              duplicating them, and every row carries a <code>synced_at</code> stamp.
            </p>
          </article>
          <article>
            <h3>Cost-shaped</h3>
            <p>
              Staged files are deleted after a verified Delta write, the job runs weekly rather
              than continuously, and the cluster auto-terminates — so the platform idles at
              effectively zero cost between runs.
            </p>
          </article>
          <article>
            <h3>Tested before it ships</h3>
            <p>
              Transformation and sync logic are kept independent of Databricks wiring so they run
              under <code>pytest</code> locally, with integration checks against real Delta tables
              in the workspace before the scheduled job picks them up.
            </p>
          </article>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
