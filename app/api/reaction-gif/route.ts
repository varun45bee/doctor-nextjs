import { NextRequest, NextResponse } from "next/server";
import { GiphyFetch } from "@giphy/js-fetch-api";
import type { IGif } from "@giphy/js-types";
import {
  type ReactionCategory,
  PREDEFINED_CATEGORY_QUERIES,
  CURATED_CATEGORY_POOLS,
  selectGifFromPool,
} from "@/lib/giphy/categoryPools";
import {
  resolveReactionCategory,
  isProfanity,
  isEmergencySituation,
  isSensitiveMedicalSituation,
} from "@/lib/giphy/reactionDetector";
import {
  getConversationRecentGifIds,
  recordConversationRecentGifId,
} from "@/lib/giphy/gifPersistence";

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
      searchQuery,
      query,
      conversationId,
      recentGifIds = [],
    }: {
      category?: string;
      subType?: string;
      searchQuery?: string;
      query?: string;
      conversationId?: string;
      recentGifIds?: string[];
    } = body;

    const rawTarget = (searchQuery || query || category || subType || "").trim();

    // 0. Safety Boundary: Emergencies, sensitive distress, and profanity strictly suppress all GIFs
    if (isProfanity(rawTarget) || isEmergencySituation(rawTarget) || isSensitiveMedicalSituation(rawTarget)) {
      return NextResponse.json({ gif: null, reason: "Safety gate: emergency, distress, or profanity suppressed" });
    }

    // 1. Resolve Category and Search Query
    const resolvedCategory = resolveReactionCategory(category || subType || rawTarget || "");
    const catKey: ReactionCategory = resolvedCategory || "wellness";
    
    // Determine the safe G-rated search term
    let effectiveQuery = PREDEFINED_CATEGORY_QUERIES[catKey];
    if (searchQuery && typeof searchQuery === "string" && searchQuery.trim()) {
      effectiveQuery = searchQuery.replace(/[^a-zA-Z0-9\s]/g, " ").trim();
    } else if (query && typeof query === "string" && query.trim()) {
      effectiveQuery = query.replace(/[^a-zA-Z0-9\s]/g, " ").trim();
    }

    // 2. Resolve recent GIF history for this conversation (Firestore + in-memory + client state)
    const historyKey = conversationId || "default_session";
    const combinedRecentIds = await getConversationRecentGifIds(historyKey, recentGifIds);

    // 3. Fetch or retrieve cached candidate GIFs from GIPHY
    const cacheKey = `${catKey}_${effectiveQuery}`;
    let liveGifs = serverCategoryCache.get(cacheKey) || serverCategoryCache.get(catKey);

    if (!liveGifs || liveGifs.length === 0) {
      const client = getServerGiphyClient();
      if (client) {
        try {
          // Strictly enforce rating: "g"
          const response = await client.search(effectiveQuery, {
            limit: 25,
            rating: "g",
            sort: "relevant",
            lang: "en",
          });
          if (response?.data && response.data.length > 0) {
            liveGifs = response.data;
            serverCategoryCache.set(cacheKey, liveGifs);
            serverCategoryCache.set(catKey, liveGifs);
          }
        } catch (fetchErr) {
          console.warn(`GIPHY API fetch warning for query "${effectiveQuery}":`, fetchErr);
        }
      }
    }

    // 4. Combine live GIPHY results with curated category fallback pool (deduplicating by ID)
    const curatedPool = CURATED_CATEGORY_POOLS[catKey] || CURATED_CATEGORY_POOLS.wellness || [];
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
    const explicitLastId =
      recentGifIds && recentGifIds.length > 0
        ? String(recentGifIds[recentGifIds.length - 1])
        : undefined;
    const selectedGif = selectGifFromPool(catKey, mergedPool, combinedRecentIds, explicitLastId);

    if (!selectedGif) {
      return NextResponse.json({ gif: null, reason: "No GIF available in category pool" });
    }

    // 6. Record the served GIF ID in persistent conversation history
    const updatedRecentIds = await recordConversationRecentGifId(
      historyKey,
      String(selectedGif.id),
      combinedRecentIds
    );

    return NextResponse.json({
      gif: selectedGif,
      category: catKey,
      gifId: selectedGif.id,
      recentGifIds: updatedRecentIds,
    });
  } catch (err: unknown) {
    console.error("Error in /api/reaction-gif:", err);
    return NextResponse.json({ gif: null, error: "Internal error processing GIF" }, { status: 500 });
  }
}

