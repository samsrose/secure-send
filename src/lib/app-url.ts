export function getAppBaseUrl(request?: Request): string {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  if (request) {
    const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
    const protocol = request.headers.get("x-forwarded-proto") ?? "http";
    if (host) {
      return `${protocol}://${host}`;
    }
  }

  return "http://localhost:3000";
}
