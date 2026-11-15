import { NextRequest, NextResponse } from "next/server";
import { GiphyFetch } from "@giphy/js-fetch-api";
import type { IGif } from "@giphy/js-types";
import {
  type ReactionCategory,
  PREDEFINED_CATEGORY_QUERIES,
  CURATED_CATEGORY_POOLS,
  selectGifFromPool,
} from "@/lib/giphy/categoryPools";

export const dynamic = "force-dynamic";

// Server-side in-memory cache for live GIPHY search results (per category)
const serverCategoryCache = new Map<string, IGif[]>();

// Server-side in-memory conversation history of recently served GIF IDs
const serverConversationHistory = new Map<string, string[]>();

const DEFAULT_GIPHY_KEY = "a7bAw8ym3I18oUmAhNZSQy1olibXzHg6";
const SERVER_GIPHY_KEY =
  (process.env.GIPHY_API_KEY || process.env.NEXT_PUBLIC_GIPHY_API_KEY || "").trim() ||
  DEFAULT_GIPHY_KEY;

let serverGiphyClient: GiphyFetch | null = null;

function getServerGiphyClient(): GiphyFetch | null {
  if (!SERVER_GIPHY_KEY) return null;
  if (!serverGiphyClient) {
    try {
      serverGiphyClient = new GiphyFetch(SERVER_GIPHY_KEY);
    } catch (err) {
      console.warn("Failed to initialize server GIPHY client:", err);
      return null;
    }
  }
  return serverGiphyClient;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const {
      category,
      subType,
      conversationId,
      recentGifIds = [],
    }: {
      category?: string;
      subType?: string;
      conversationId?: string;
      recentGifIds?: string[];
    } = body;

    // 1. Strict Intent Validation: If no confident category is provided, return NO GIF
    if (!category || !(category in PREDEFINED_CATEGORY_QUERIES)) {
      return NextResponse.json({ gif: null, reason: "No confident intent category" });
    }

    const catKey = category as ReactionCategory;
    const predefinedQuery = PREDEFINED_CATEGORY_QUERIES[catKey];

    // 2. Resolve recent GIF history for this conversation
    const historyKey = conversationId || "default_session";
    const existingServerHistory = serverConversationHistory.get(historyKey) || [];
    const combinedRecentIds = Array.from(
      new Set([...existingServerHistory, ...recentGifIds.map(String)])
    );

    // 3. Fetch or retrieve cached candidate GIFs from GIPHY
    let liveGifs = serverCategoryCache.get(catKey);

    if (!liveGifs || liveGifs.length === 0) {
      const client = getServerGiphyClient();
      if (client) {
        try {
          // Strictly enforce rating: "g" and use predefined category search term
          const response = await client.search(predefinedQuery, {
            limit: 25,
            rating: "g",
            sort: "relevant",
            lang: "en",
          });
          if (response?.data && response.data.length > 0) {
            liveGifs = response.data;
            serverCategoryCache.set(catKey, liveGifs);
          }
        } catch (fetchErr) {
          console.warn(`GIPHY API fetch warning for category "${catKey}":`, fetchErr);
        }
      }
    }

    // 4. Combine live GIPHY results with curated category fallback pool (deduplicating by ID)
    const curatedPool = CURATED_CATEGORY_POOLS[catKey] || [];
    const mergedPool: IGif[] = [];
    const seenIds = new Set<string>();

    if (liveGifs) {
      for (const g of liveGifs) {
        if (g?.id && !seenIds.has(String(g.id))) {
          seenIds.add(String(g.id));
          mergedPool.push(g);
        }
      }
    }

    for (const g of curatedPool) {
      if (g?.id && !seenIds.has(String(g.id))) {
        seenIds.add(String(g.id));
        mergedPool.push(g);
      }
    }

    // 5. Select non-repeating GIF using conversation history & rotation
    const selectedGif = selectGifFromPool(catKey, mergedPool, combinedRecentIds);

    if (!selectedGif) {
      return NextResponse.json({ gif: null, reason: "No GIF available in category pool" });
    }

    // 6. Record the served GIF ID in conversation history
    combinedRecentIds.push(String(selectedGif.id));
    // Keep max 50 recent IDs to avoid unbounded memory growth
    if (combinedRecentIds.length > 50) {
      combinedRecentIds.splice(0, combinedRecentIds.length - 50);
    }
    serverConversationHistory.set(historyKey, combinedRecentIds);

    return NextResponse.json({
      gif: selectedGif,
      category: catKey,
      gifId: selectedGif.id,
      recentGifIds: combinedRecentIds,
    });
  } catch (err: unknown) {
    console.error("Error in /api/reaction-gif:", err);
    return NextResponse.json({ gif: null, error: "Internal error processing GIF" }, { status: 500 });
  }
}

