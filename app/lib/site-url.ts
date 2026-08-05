function normalizeUrl(value?: string | null) {
  if (!value) return null;
  return value.replace(/\/$/, "");
}

function isLocalUrl(value: string) {
  return value.includes("localhost") || value.includes("127.0.0.1");
}

function siteUrlFromHost(host?: string | null, proto?: string | null) {
  if (!host) return null;

  const protocol = proto || (host.startsWith("localhost") || host.startsWith("127.0.0.1") ? "http" : "https");
  return `${protocol}://${host}`.replace(/\/$/, "");
}

function getConfiguredSiteUrl() {
  const publicSiteUrl = normalizeUrl(process.env.NEXT_PUBLIC_SITE_URL);
  const vercelProjectUrl = normalizeUrl(process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : null);
  const vercelUrl = normalizeUrl(process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null);

  return publicSiteUrl || vercelProjectUrl || vercelUrl;
}

export function getSiteUrlFromRequest(request?: Request) {
  const forwardedHost = request?.headers.get("x-forwarded-host");
  const host = forwardedHost || request?.headers.get("host");
  const requestSiteUrl = siteUrlFromHost(host, request?.headers.get("x-forwarded-proto"));

  if (requestSiteUrl) return requestSiteUrl;

  return getConfiguredSiteUrl() || "http://localhost:3000";
}

export function getSiteUrlFromHeaders(headersList?: Headers) {
  const configuredSiteUrl = getConfiguredSiteUrl();
  const origin = normalizeUrl(headersList?.get("origin"));

  if (origin && (process.env.NODE_ENV !== "production" || !isLocalUrl(origin))) {
    return origin;
  }

  if (configuredSiteUrl && (process.env.NODE_ENV !== "production" || !isLocalUrl(configuredSiteUrl))) {
    return configuredSiteUrl;
  }

  const forwardedHost = headersList?.get("x-forwarded-host");
  const host = forwardedHost || headersList?.get("host");
  const requestSiteUrl = siteUrlFromHost(host, headersList?.get("x-forwarded-proto"));

  return requestSiteUrl || configuredSiteUrl || origin || "http://localhost:3000";
}
