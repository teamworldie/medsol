import "server-only";
import { BetaAnalyticsDataClient } from "@google-analytics/data";

let cachedClient: BetaAnalyticsDataClient | null = null;

// Lazily constructed, same pattern as getSupabaseAdmin()/getResend(): a
// missing env var only fails the specific request that needs it, not the
// build or every other admin page.
function getAnalyticsClient(): BetaAnalyticsDataClient {
  if (cachedClient) return cachedClient;

  const clientEmail = process.env.GOOGLE_ANALYTICS_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_ANALYTICS_PRIVATE_KEY;
  if (!clientEmail || !privateKey) {
    throw new Error("GOOGLE_ANALYTICS_CLIENT_EMAIL and GOOGLE_ANALYTICS_PRIVATE_KEY must be set to fetch website traffic.");
  }

  cachedClient = new BetaAnalyticsDataClient({
    credentials: {
      client_email: clientEmail,
      // Env vars can't contain real newlines, so the key is stored with
      // literal "\n" escapes and unescaped here.
      private_key: privateKey.replace(/\\n/g, "\n"),
    },
  });
  return cachedClient;
}

export type TrafficSummary = {
  users: number;
  sessions: number;
  pageViews: number;
  topPages: { path: string; views: number }[];
};

export async function getTrafficSummary(days = 30): Promise<TrafficSummary | null> {
  const propertyId = process.env.GA4_PROPERTY_ID;
  if (!propertyId || !process.env.GOOGLE_ANALYTICS_CLIENT_EMAIL || !process.env.GOOGLE_ANALYTICS_PRIVATE_KEY) {
    return null;
  }

  const client = getAnalyticsClient();
  const dateRange = { startDate: `${days}daysAgo`, endDate: "today" };

  const [totalsResponse] = await client.runReport({
    property: `properties/${propertyId}`,
    dateRanges: [dateRange],
    metrics: [{ name: "activeUsers" }, { name: "sessions" }, { name: "screenPageViews" }],
  });

  const totalsRow = totalsResponse.rows?.[0];
  const users = Number(totalsRow?.metricValues?.[0]?.value ?? 0);
  const sessions = Number(totalsRow?.metricValues?.[1]?.value ?? 0);
  const pageViews = Number(totalsRow?.metricValues?.[2]?.value ?? 0);

  const [topPagesResponse] = await client.runReport({
    property: `properties/${propertyId}`,
    dateRanges: [dateRange],
    dimensions: [{ name: "pagePath" }],
    metrics: [{ name: "screenPageViews" }],
    orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
    limit: 8,
  });

  const topPages = (topPagesResponse.rows ?? []).map((row) => ({
    path: row.dimensionValues?.[0]?.value ?? "/",
    views: Number(row.metricValues?.[0]?.value ?? 0),
  }));

  return { users, sessions, pageViews, topPages };
}
