/**
 * Source repositories behind this dashboard.
 *
 * Paths are the real tracked files in claims-gcs-to-delta -- note the
 * transformation modules are `*_ingestion` / `*_transformation` /
 * `*_aggregation`, not the `*_layer.py` names that repo's README uses.
 *
 * Both repos are private at time of writing; the links resolve once they're
 * made public.
 */
const SOURCE_REPO = "https://github.com/neoXm12/claims-project";
const PIPELINE_REPO = "https://github.com/neoXm12/claims-gcs-to-delta";
const PORTFOLIO_REPO = "https://github.com/neoXm12/neo-portfolio";

const file = (path, repo = PIPELINE_REPO) => `${repo}/blob/main/${path}`;
const dir = (path, repo = PIPELINE_REPO) => `${repo}/tree/main/${path}`;

export const repos = {
  source: SOURCE_REPO,
  pipeline: PIPELINE_REPO,
  portfolio: PORTFOLIO_REPO,
};

export const codeLinks = {
  // claims-project — the NestJS API where claims originate
  claimEntity: file("src/claims/entity/claim.entity.ts", SOURCE_REPO),
  claimStatuses: file("src/claims/enum/claim-status.enum.ts", SOURCE_REPO),
  claimsController: file("src/claims/controller/claims.controller.ts", SOURCE_REPO),
  gcsExportService: file("src/gcsExport/service/gcs-export.service.ts", SOURCE_REPO),
  hourlyWorkflow: file(".github/workflows/create-hourly-claims.yml", SOURCE_REPO),
  syncWorkflow: file(".github/workflows/sync-claims-to-gcs.yml", SOURCE_REPO),
  renderConfig: file("render.yaml", SOURCE_REPO),
  migrations: dir("src/migrations", SOURCE_REPO),

  gcsIngestion: file("src/ingestion/gcs.py"),
  pipelineModule: file("src/ingestion/pipeline.py"),
  transformations: dir("transformations"),
  bronze: file("transformations/bronze_ingestion.py"),
  silver: file("transformations/silver_transformation.py"),
  gold: file("transformations/gold_aggregation.py"),
  syncNotebook: file("reverse_etl/sync_to_supabase.py"),
  syncLogic: file("src/reverse_etl/supabase_sync.py"),
  syncReadme: file("reverse_etl/README.md"),
  dashboardSchema: file("sql/supabase_dashboard_schema.sql"),
  jobDefinition: file("orchestration/weekly_pipeline_job.json"),
  tests: dir("tests"),
  dashboardPage: file("src/pages/Dashboard.jsx", PORTFOLIO_REPO),
};

/** Key modules, surfaced as a "read the code" row under the lineage. */
export const codeIndex = [
  {
    title: "Claims API",
    path: "src/claims/",
    href: dir("src/claims", SOURCE_REPO),
    detail: "NestJS + TypeORM service where claims are created — the system of record.",
  },
  {
    title: "GCS export service",
    path: "src/gcsExport/service/gcs-export.service.ts",
    href: codeLinks.gcsExportService,
    detail:
      "Batched, locked, incremental export to Cloud Storage with a synced_to_gcs watermark.",
  },
  {
    title: "Medallion transformations",
    path: "transformations/",
    href: codeLinks.transformations,
    detail: "Bronze append, Silver MERGE upsert, and the four Gold aggregations.",
  },
  {
    title: "Reverse ETL sync",
    path: "src/reverse_etl/supabase_sync.py",
    href: codeLinks.syncLogic,
    detail: "Table config, SQL building and the batched upsert — kept testable without a live DB.",
  },
  {
    title: "Dashboard schema",
    path: "sql/supabase_dashboard_schema.sql",
    href: codeLinks.dashboardSchema,
    detail: "DDL for the four served tables, plus the RLS policies this page reads through.",
  },
  {
    title: "Job definition",
    path: "orchestration/weekly_pipeline_job.json",
    href: codeLinks.jobDefinition,
    detail: "The weekly Databricks job, with the sync as its final task.",
  },
  {
    title: "Test suite",
    path: "tests/",
    href: codeLinks.tests,
    detail: "pytest coverage for transforms, pipeline wiring and the reverse-ETL SQL.",
  },
  {
    title: "This page",
    path: "src/pages/Dashboard.jsx",
    href: codeLinks.dashboardPage,
    detail: "The React page you're reading, in the portfolio repo.",
  },
];
