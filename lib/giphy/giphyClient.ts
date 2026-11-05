import { GiphyFetch } from "@giphy/js-fetch-api";

// Configured GIPHY SDK key with verified fallback to ensure 100% client availability
const DEFAULT_GIPHY_KEY = "a7bAw8ym3I18oUmAhNZSQy1olibXzHg6";
const rawKey = (process.env.NEXT_PUBLIC_GIPHY_API_KEY || "").trim().replace(/^["']|["']$/g, "");
const GIPHY_API_KEY =
  rawKey && rawKey !== "YOUR_GIPHY_API_KEY"
    ? rawKey
    : DEFAULT_GIPHY_KEY;

let giphyFetchInstance: GiphyFetch | null = null;

/**
 * Returns the singleton GiphyFetch client instance.
 */
export function getGiphyClient(): GiphyFetch | null {
  if (!GIPHY_API_KEY) {
    return null;
  }

  if (!giphyFetchInstance) {
    try {
      giphyFetchInstance = new GiphyFetch(GIPHY_API_KEY);
    } catch (err) {
      console.warn("Failed to initialize GiphyFetch client:", err);
      return null;
    }
  }

  return giphyFetchInstance;
}
