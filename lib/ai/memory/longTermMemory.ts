/**
 * Layer 3: Long-Term Memory & Firestore Conversation Persistence
 * Implements isolated conversation storage per authenticated user:
 * users/{uid}/conversations/{conversationId}/messages/{messageId}
 * With strict privacy isolation, message retrieval, and conversation deletion.
 */

import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  deleteDoc,
  query,
  orderBy,
  limit,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebase.ts";

export interface StoredChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
  metadata?: {
    symptoms?: string[];
    isEmergency?: boolean;
    condition?: string;
    gifUrl?: string;
    turnCount?: number;
  };
}

export interface ConversationThread {
  id: string;
  userId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messageCount: number;
}

/**
 * Persists a single message turn to the user's isolated conversation in Firestore.
 */
export async function persistMessageToFirestore(
  userId: string,
  conversationId: string,
  message: {
    role: "user" | "assistant";
    content: string;
    metadata?: Record<string, unknown>;
  }
): Promise<string> {
  if (!userId || !conversationId) return "";

  try {
    const messageId = `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const msgRef = doc(
      db,
      "users",
      userId,
      "conversations",
      conversationId,
      "messages",
      messageId
    );

    await setDoc(msgRef, {
      role: message.role,
      content: message.content,
      createdAt: serverTimestamp(),
      timestamp: new Date().toISOString(),
      metadata: message.metadata || {},
    });

    // Update conversation parent document
    const convRef = doc(db, "users", userId, "conversations", conversationId);
    await setDoc(
      convRef,
      {
        userId,
        updatedAt: serverTimestamp(),
        lastMessageSnippet: message.content.substring(0, 100),
      },
      { merge: true }
    );

    return messageId;
  } catch (err) {
    console.warn("Could not persist message to long-term Firestore memory:", err);
    return "";
  }
}

/**
 * Loads recent conversation turns for a user from Firestore.
 */
export async function loadConversationHistory(
  userId: string,
  conversationId: string,
  turnLimit: number = 20
): Promise<StoredChatMessage[]> {
  if (!userId || !conversationId) return [];

  try {
    const msgsRef = collection(
      db,
      "users",
      userId,
      "conversations",
      conversationId,
      "messages"
    );
    const q = query(msgsRef, orderBy("createdAt", "asc"), limit(turnLimit));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        role: data.role || "user",
        content: data.content || "",
        timestamp: data.timestamp || new Date().toISOString(),
        metadata: data.metadata || {},
      };
    });
  } catch (err) {
    console.warn("Could not load long-term conversation history:", err);
    return [];
  }
}

/**
 * Deletes an entire conversation thread for a user (GDPR / Privacy compliance).
 */
export async function deleteUserConversation(
  userId: string,
  conversationId: string
): Promise<boolean> {
  if (!userId || !conversationId) return false;

  try {
    const msgsRef = collection(
      db,
      "users",
      userId,
      "conversations",
      conversationId,
      "messages"
    );
    const snapshot = await getDocs(msgsRef);

    const deletePromises = snapshot.docs.map((d) => deleteDoc(d.ref));
    await Promise.all(deletePromises);

    const convRef = doc(db, "users", userId, "conversations", conversationId);
    await deleteDoc(convRef);

    return true;
  } catch (err) {
    console.error("Failed to delete user conversation:", err);
    return false;
  }
}
