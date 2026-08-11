/**
 * Gold-layer data for the Claims Platform dashboard.
 *
 * The upstream pipeline (Supabase source -> GCS -> Databricks Bronze/Silver/Gold)
 * runs a weekly reverse-ETL job that upserts four aggregate tables into a
 * dedicated Supabase "dashboard" project. That project exposes them over
 * PostgREST, and its RLS policies allow anonymous SELECT only -- so the anon key
 * below is read-only by design and safe to ship in a client bundle.
 *
 * We query PostgREST directly with fetch instead of pulling in @supabase/supabase-js:
 * four public GETs don't justify the dependency or the bundle weight.
 *
 * If the environment isn't configured (or the request fails), the dashboard falls
 * back to SAMPLE_* below and flags itself in the UI, so the page is never broken.
 */

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_DASHBOARD_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_DASHBOARD_ANON_KEY;

export const isLiveDataConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

// Mirrors sql/supabase_dashboard_schema.sql in the claims-gcs-to-delta repo.
const GOLD_TABLES = [
  { key: "summary", table: "claims_summary", order: "claim_year.asc,claim_month.asc" },
  { key: "byType", table: "claims_by_type", order: "claim_count.desc" },
  { key: "byGeography", table: "claims_by_geography", order: "claim_count.desc" },
  { key: "lifecycle", table: "claims_lifecycle", order: "claim_year.asc,claim_quarter.asc" },
];

const REQUEST_TIMEOUT_MS = 8000;

const fetchTable = async ({ table, order }, signal) => {
  const url = `${SUPABASE_URL.replace(/\/$/, "")}/rest/v1/${table}?select=*&order=${order}`;
  const response = await fetch(url, {
    signal,
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`${table}: ${response.status} ${response.statusText}`);
  }

  const rows = await response.json();
  if (!Array.isArray(rows)) {
    throw new Error(`${table}: expected an array of rows`);
  }
  return rows;
};

/**
 * Loads all four Gold tables. Resolves to `{ tables, source, syncedAt, error }`
 * where `source` is "live" or "sample" -- it never rejects, because a portfolio
 * page should degrade to the snapshot rather than render an error.
 */
export const loadGoldTables = async () => {
  if (!isLiveDataConfigured) {
    return { ...SAMPLE_RESULT, error: null };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const results = await Promise.all(
      GOLD_TABLES.map((config) => fetchTable(config, controller.signal))
    );
    const tables = GOLD_TABLES.reduce(
      (acc, config, index) => ({ ...acc, [config.key]: results[index] }),
      {}
    );

    // An empty Gold layer means the weekly job hasn't landed yet; the snapshot
    // is more useful to a visitor than four blank charts.
    if (!tables.summary?.length) {
      return { ...SAMPLE_RESULT, error: "No rows returned from the Gold layer yet." };
    }

    return { tables, source: "live", syncedAt: latestSyncedAt(tables), error: null };
  } catch (error) {
    return {
      ...SAMPLE_RESULT,
      error: error.name === "AbortError" ? "Request timed out." : error.message,
    };
  } finally {
    clearTimeout(timeout);
  }
};

// Every synced row carries `synced_at`; the newest one is the dashboard's freshness stamp.
const latestSyncedAt = (tables) => {
  const stamps = Object.values(tables)
    .flat()
    .map((row) => row?.synced_at)
    .filter(Boolean)
    .map((value) => new Date(value).getTime())
    .filter((value) => !Number.isNaN(value));
  return stamps.length ? new Date(Math.max(...stamps)).toISOString() : null;
};

/* -------------------------------------------------------------------------- */
/* Sample snapshot                                                             */
/* -------------------------------------------------------------------------- */
/* Shape-accurate stand-in used when live credentials are absent. Generated so  */
/* every table reconciles: type, geography and lifecycle counts each sum to the */
/* same 3,214 claims as the monthly summary.                                    */

export const SAMPLE_SUMMARY = [
  {"claim_year":2025,"claim_month":7,"total_claims":241,"total_amount":1007380,"avg_claim_amount":4180,"high_value_claims":27,"resolved_claims":207,"resolution_rate":85.89},
  {"claim_year":2025,"claim_month":8,"total_claims":258,"total_amount":1141650,"avg_claim_amount":4425,"high_value_claims":34,"resolved_claims":217,"resolution_rate":84.11},
  {"claim_year":2025,"claim_month":9,"total_claims":272,"total_amount":1077120,"avg_claim_amount":3960,"high_value_claims":33,"resolved_claims":239,"resolution_rate":87.87},
  {"claim_year":2025,"claim_month":10,"total_claims":249,"total_amount":1279860,"avg_claim_amount":5140,"high_value_claims":35,"resolved_claims":202,"resolution_rate":81.12},
  {"claim_year":2025,"claim_month":11,"total_claims":231,"total_amount":1298220,"avg_claim_amount":5620,"high_value_claims":28,"resolved_claims":182,"resolution_rate":78.79},
  {"claim_year":2025,"claim_month":12,"total_claims":236,"total_amount":1419540,"avg_claim_amount":6015,"high_value_claims":35,"resolved_claims":196,"resolution_rate":83.05},
  {"claim_year":2026,"claim_month":1,"total_claims":288,"total_amount":1241280,"avg_claim_amount":4310,"high_value_claims":32,"resolved_claims":251,"resolution_rate":87.15},
  {"claim_year":2026,"claim_month":2,"total_claims":264,"total_amount":1246080,"avg_claim_amount":4720,"high_value_claims":34,"resolved_claims":224,"resolution_rate":84.85},
  {"claim_year":2026,"claim_month":3,"total_claims":297,"total_amount":1510245,"avg_claim_amount":5085,"high_value_claims":36,"resolved_claims":244,"resolution_rate":82.15},
  {"claim_year":2026,"claim_month":4,"total_claims":281,"total_amount":1303840,"avg_claim_amount":4640,"high_value_claims":39,"resolved_claims":247,"resolution_rate":87.9},
  {"claim_year":2026,"claim_month":5,"total_claims":305,"total_amount":1619550,"avg_claim_amount":5310,"high_value_claims":40,"resolved_claims":262,"resolution_rate":85.9},
  {"claim_year":2026,"claim_month":6,"total_claims":292,"total_amount":1427880,"avg_claim_amount":4890,"high_value_claims":35,"resolved_claims":245,"resolution_rate":83.9},
];

export const SAMPLE_BY_TYPE = [
  {"claim_type":"Auto","claim_count":1093,"total_amount":4208050,"avg_amount":3850,"max_amount":48200,"high_value_count":74},
  {"claim_type":"Property","claim_count":835,"total_amount":5360700,"avg_amount":6420,"max_amount":187500,"high_value_count":167},
  {"claim_type":"Health","claim_count":611,"total_amount":2553980,"avg_amount":4180,"max_amount":62300,"high_value_count":65},
  {"claim_type":"Liability","claim_count":418,"total_amount":2491280,"avg_amount":5960,"max_amount":124000,"high_value_count":69},
  {"claim_type":"Workers Comp","claim_count":257,"total_amount":1346680,"avg_amount":5240,"max_amount":96800,"high_value_count":33},
];

export const SAMPLE_BY_GEOGRAPHY = [
  {"state":"TX","claim_count":546,"total_amount":2861040,"avg_amount":5240,"high_value_count":66},
  {"state":"CA","claim_count":482,"total_amount":2800420,"avg_amount":5810,"high_value_count":58},
  {"state":"FL","claim_count":418,"total_amount":2060740,"avg_amount":4930,"high_value_count":50},
  {"state":"NY","claim_count":354,"total_amount":2166480,"avg_amount":6120,"high_value_count":42},
  {"state":"IL","claim_count":289,"total_amount":1317840,"avg_amount":4560,"high_value_count":35},
  {"state":"PA","claim_count":257,"total_amount":1125660,"avg_amount":4380,"high_value_count":31},
  {"state":"OH","claim_count":225,"total_amount":924750,"avg_amount":4110,"high_value_count":27},
  {"state":"GA","claim_count":225,"total_amount":1062000,"avg_amount":4720,"high_value_count":27},
  {"state":"MI","claim_count":225,"total_amount":895500,"avg_amount":3980,"high_value_count":27},
  {"state":"NC","claim_count":193,"total_amount":827970,"avg_amount":4290,"high_value_count":23},
];

export const SAMPLE_LIFECYCLE = [
  {"claim_year":2025,"claim_quarter":3,"avg_processing_days":12.4,"total_claims":771,"approved_count":640,"denied_count":69,"pending_count":62,"small_amount_total":709753,"medium_amount_total":1451767.5,"large_amount_total":1064629.5},
  {"claim_year":2025,"claim_quarter":4,"avg_processing_days":14.1,"total_claims":716,"approved_count":565,"denied_count":79,"pending_count":72,"small_amount_total":879476.4,"medium_amount_total":1798929,"large_amount_total":1319214.6},
  {"claim_year":2026,"claim_quarter":1,"avg_processing_days":11.8,"total_claims":849,"approved_count":722,"denied_count":68,"pending_count":59,"small_amount_total":879473.1,"medium_amount_total":1798922.25,"large_amount_total":1319209.65},
  {"claim_year":2026,"claim_quarter":2,"avg_processing_days":10.6,"total_claims":878,"approved_count":711,"denied_count":88,"pending_count":79,"small_amount_total":957279.4,"medium_amount_total":1958071.5,"large_amount_total":1435919.1},
];

const SAMPLE_RESULT = {
  tables: {
    summary: SAMPLE_SUMMARY,
    byType: SAMPLE_BY_TYPE,
    byGeography: SAMPLE_BY_GEOGRAPHY,
    lifecycle: SAMPLE_LIFECYCLE,
  },
  source: "sample",
  syncedAt: null,
};
