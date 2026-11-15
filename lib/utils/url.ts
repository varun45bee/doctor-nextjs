export function getAppBaseUrl(): string {
  const envUrl =
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.NEXT_PUBLIC_BASE_URL ||
    process.env.VERCEL_URL ||
    process.env.URL;

  if (envUrl) {
    const trimmed = envUrl.trim().replace(/\/$/, "");
    return trimmed.startsWith("http") ? trimmed : `https://${trimmed}`;
  }

  return "https://www.pratimaagale.in";
}

