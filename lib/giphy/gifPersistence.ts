/**
 * Persistent Conversation GIF History Store
 * Maintains per-conversation recent GIF IDs across serverless cold starts and instances.
 * Stores in Firestore under 'conversation_gif_history' collection with memory fallback.
 */

import { db } from "../firebase.ts";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

// In-memory cache for ultra-fast local lookups
const inMemoryGifHistory = new Map<string, string[]>();

function isTestEnvironment(): boolean {
  return (
    process.env.NODE_ENV === "test" ||
    process.env.npm_lifecycle_event === "test" ||
    Boolean(process.env.TEST) ||
    (typeof window === "undefined" && !process.env.NEXT_RUNTIME)
  );
}

/**
 * Retrieves the list of recently served GIF IDs for a conversation.
 * Merges client-provided recent IDs, in-memory cache, and Firestore persistent state.
 */
export async function getConversationRecentGifIds(
  conversationId?: string,
  clientRecentIds: string[] = []
): Promise<string[]> {
  const merged = new Set<string>(clientRecentIds.map(String));
  const convKey = conversationId || "default_session";

  // 1. Pull from in-memory cache
  const cached = inMemoryGifHistory.get(convKey) || [];
  for (const id of cached) {
    if (id) merged.add(String(id));
  }

  // 2. Pull from Firestore if valid conversationId, non-test environment, and database available
  if (!isTestEnvironment() && conversationId && conversationId !== "default_session" && db) {
    try {
      const ref = doc(db, "conversation_gif_history", conversationId);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        if (Array.isArray(data?.recentGifIds)) {
          for (const id of data.recentGifIds) {
            if (id) merged.add(String(id));
          }
        }
      }
    } catch {
      // Graceful fallback to memory & client state in environments where Firestore is offline
    }
  }

  return Array.from(merged);
}

/**
 * Persists a newly served GIF ID into conversation history.
 * Caps history to the most recent 50 entries to avoid unbounded growth.
 */
export async function recordConversationRecentGifId(
  conversationId: string | undefined,
  gifId: string,
  existingIds: string[] = []
): Promise<string[]> {
  const gifIdStr = String(gifId);
  const convKey = conversationId || "default_session";

  const updated = Array.from(new Set([...existingIds.map(String), gifIdStr]));

  // Cap at 50 recent items
  if (updated.length > 50) {
    updated.splice(0, updated.length - 50);
  }

  // Store in memory
  inMemoryGifHistory.set(convKey, updated);

  // Store in Firestore asynchronously if not test environment
  if (!isTestEnvironment() && conversationId && conversationId !== "default_session" && db) {
    try {
      const ref = doc(db, "conversation_gif_history", conversationId);
      await setDoc(
        ref,
        {
          conversationId,
          recentGifIds: updated,
          lastGifId: gifIdStr,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
    } catch {
      // In offline / test environments, in-memory record handles it
    }
  }

  return updated;
}
