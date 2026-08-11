import GithubLink from "./GithubLink";
import { codeLinks } from "../../data/repoLinks";

const STAGES = [
  {
    stage: "Origin",
    title: "Claims API — NestJS on Render",
    detail:
      "The system of record. A TypeORM REST service that owns the claim schema — eight statuses, eight claim types — and runs its migrations on every deploy.",
    tech: "NestJS · TypeORM · Render",
    code: { label: "src/claims/entity/claim.entity.ts", href: codeLinks.claimEntity },
  },
  {
    stage: "Generate",
    title: "Hourly claim generator",
    detail:
      "A GitHub Action POSTs new claims to the API every hour, so the platform always has a live stream of records rather than a static dump.",
    tech: "cron 0 * * * *",
    code: { label: ".github/workflows/create-hourly-claims.yml", href: codeLinks.hourlyWorkflow },
  },
  {
    stage: "Store",
    title: "Supabase — claims project",
    detail:
      "Operational Postgres behind the API. The analytics pipeline never connects to it directly; it only ever receives what the export pushes out.",
    tech: "Postgres · pooled connection",
    code: { label: "render.yaml", href: codeLinks.renderConfig },
  },
  {
    stage: "Extract",
    title: "Export to GCS — every 6 hours",
    detail:
      "A second Action calls a secret-guarded /claims/sync endpoint. The service claims up to 100 unsynced rows with FOR UPDATE SKIP LOCKED, writes them as one dated batch file, then flips synced_to_gcs — an incremental watermark, so nothing exports twice.",
    tech: "cron 0 */6 * * * · @google-cloud/storage",
    code: {
      label: "src/gcsExport/service/gcs-export.service.ts",
      href: codeLinks.gcsExportService,
    },
  },
  {
    stage: "Stage",
    title: "GCS — exports/<date>/batch_N_claims_export.json",
    detail:
      "Landing zone. Files are deleted after a verified Delta write to keep storage at zero.",
    tech: "Cloud Storage",
    code: { label: "src/ingestion/gcs.py", href: codeLinks.gcsIngestion },
  },
  {
    stage: "Transform",
    title: "Databricks — medallion",
    detail: "Weekly job promoting raw files through Bronze, Silver and Gold on Delta Lake.",
    tech: "PySpark · Delta · Unity Catalog",
    code: { label: "transformations/", href: codeLinks.transformations },
    medallion: [
      {
        layer: "Bronze",
        table: "workspace.bronze.claims_raw",
        note: "Full append. Immutable audit trail with ingestion timestamp, batch id and source file.",
        href: codeLinks.bronze,
        file: "bronze_ingestion.py",
      },
      {
        layer: "Silver",
        table: "workspace.silver.claims",
        note: "MERGE upsert to the latest record per claim. Typed, deduplicated, derived columns, Change Data Feed on, partitioned by claim year.",
        href: codeLinks.silver,
        file: "silver_transformation.py",
      },
      {
        layer: "Gold",
        table: "4 aggregate tables",
        note: "Pre-aggregated summary, type, geography and lifecycle marts — the only layer the dashboard reads.",
        href: codeLinks.gold,
        file: "gold_aggregation.py",
      },
    ],
  },
  {
    stage: "Reverse ETL",
    title: "sync_to_supabase.py",
    detail:
      "Final task in the weekly job. Batched INSERT … ON CONFLICT DO UPDATE per table, so re-runs are idempotent.",
    tech: "psycopg2 · transaction pooler",
    code: { label: "reverse_etl/sync_to_supabase.py", href: codeLinks.syncNotebook },
  },
  {
    stage: "Serve",
    title: "Supabase — dashboard project",
    detail:
      "A separate project holding only Gold aggregates. RLS allows anonymous SELECT, so operational data is never exposed.",
    tech: "Postgres · PostgREST · RLS",
    code: { label: "sql/supabase_dashboard_schema.sql", href: codeLinks.dashboardSchema },
  },
  {
    stage: "Consume",
    title: "This page",
    detail: "Reads the four Gold tables over PostgREST with a read-only anon key. No server, no SDK.",
    tech: "React · fetch",
    code: { label: "src/pages/Dashboard.jsx", href: codeLinks.dashboardPage },
  },
];

const Lineage = () => (
  <div className="lineage">
    <ol className="lineage-flow">
      {STAGES.map((stage) => (
        <li key={stage.stage} className="lineage-stage">
          <div className="lineage-card">
            <p className="lineage-stage-name">{stage.stage}</p>
            <h4>{stage.title}</h4>
            <p className="lineage-detail">{stage.detail}</p>
            <div className="lineage-foot">
              <p className="lineage-tech">{stage.tech}</p>
              {stage.code && (
                <GithubLink href={stage.code.href} className="gh-link-inline">
                  {stage.code.label}
                </GithubLink>
              )}
            </div>
          </div>

          {stage.medallion && (
            <ul className="medallion">
              {stage.medallion.map((layer) => (
                <li
                  key={layer.layer}
                  className={`medallion-layer medallion-${layer.layer.toLowerCase()}`}
                >
                  <div className="medallion-head">
                    <span className="medallion-name">{layer.layer}</span>
                    <code>{layer.table}</code>
                  </div>
                  <p>{layer.note}</p>
                  <GithubLink href={layer.href} className="gh-link-inline">
                    {layer.file}
                  </GithubLink>
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ol>
  </div>
);

export default Lineage;
