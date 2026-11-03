import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  increment,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "../firebase.ts";
import type { Conversation, ChatMessage, MessageAttachment } from "../types/chat.ts";

/**
 * Creates or retrieves a deterministic conversation ID for a patient.
 */
export function getConversationIdForPatient(patientUid: string): string {
  return `conv_${patientUid}`;
}

/**
 * Ensures a conversation document exists for a patient.
 */
export async function getOrCreateConversation(patient: {
  uid: string;
  fullName: string;
  email: string;
  phone?: string;
  photoURL?: string;
}): Promise<Conversation> {
  const convId = getConversationIdForPatient(patient.uid);
  const convRef = doc(db, "conversations", convId);
  const snap = await getDoc(convRef);

  if (snap.exists()) {
    return {
      id: snap.id,
      ...snap.data(),
    } as Conversation;
  }

  const initialData: Omit<Conversation, "id"> = {
    patientId: patient.uid,
    patientName: patient.fullName || "Patient",
    patientEmail: patient.email || "",
    patientPhone: patient.phone || "",
    patientPhotoURL: patient.photoURL || "",
    lastMessage: "Conversation initiated",
    lastMessageAt: serverTimestamp(),
    unreadDoctorCount: 0,
    unreadPatientCount: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  await setDoc(convRef, initialData);

  return {
    id: convId,
    ...initialData,
  } as Conversation;
}

/**
 * Subscribes to changes in a single conversation doc (metadata, unread counts, etc.)
 */
export function subscribeToConversation(
  conversationId: string,
  onUpdate: (conv: Conversation | null) => void
): Unsubscribe {
  const convRef = doc(db, "conversations", conversationId);
  return onSnapshot(
    convRef,
    (snap) => {
      if (snap.exists()) {
        onUpdate({ id: snap.id, ...snap.data() } as Conversation);
      } else {
        onUpdate(null);
      }
    },
    (error) => {
      console.error("Error subscribing to conversation:", error);
    }
  );
}

/**
 * Subscribes in real-time to the messages inside a conversation.
 */
export function subscribeToMessages(
  conversationId: string,
  onUpdate: (messages: ChatMessage[]) => void
): Unsubscribe {
  const messagesCol = collection(db, "conversations", conversationId, "messages");
  const q = query(messagesCol, orderBy("createdAt", "asc"));

  return onSnapshot(
    q,
    (snap) => {
      const msgs = snap.docs.map((docSnap) => ({
        id: docSnap.id,
        conversationId,
        ...docSnap.data(),
      })) as ChatMessage[];
      onUpdate(msgs);
    },
    (error) => {
      console.error("Error subscribing to messages:", error);
    }
  );
}

/**
 * Subscribes to all patient conversations for the doctor view.
 */
export function subscribeToDoctorConversations(
  onUpdate: (conversations: Conversation[]) => void
): Unsubscribe {
  const convsCol = collection(db, "conversations");
  const q = query(convsCol, orderBy("updatedAt", "desc"));

  return onSnapshot(
    q,
    (snap) => {
      const list = snap.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      })) as Conversation[];
      onUpdate(list);
    },
    (error) => {
      console.error("Error subscribing to doctor conversations:", error);
      // Fallback if index not ready
      onSnapshot(convsCol, (fallbackSnap) => {
        const list = fallbackSnap.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        })) as Conversation[];
        list.sort((a, b) => {
          const timeA = a.updatedAt?.toMillis?.() || 0;
          const timeB = b.updatedAt?.toMillis?.() || 0;
          return timeB - timeA;
        });
        onUpdate(list);
      });
    }
  );
}

/**
 * Sends a chat message and updates conversation metadata.
 */
export async function sendChatMessage(params: {
  conversationId: string;
  senderId: string;
  senderRole: "patient" | "doctor";
  senderName: string;
  senderPhotoURL?: string;
  text: string;
  attachments?: MessageAttachment[];
}): Promise<string> {
  const { conversationId, senderId, senderRole, senderName, senderPhotoURL, text, attachments } = params;

  if (!text.trim() && (!attachments || attachments.length === 0)) {
    throw new Error("Message cannot be empty");
  }

  const messagesCol = collection(db, "conversations", conversationId, "messages");
  const newMsgDoc = await addDoc(messagesCol, {
    conversationId,
    senderId,
    senderRole,
    senderName,
    senderPhotoURL: senderPhotoURL || "",
    text: text.trim(),
    attachments: attachments || [],
    read: false,
    createdAt: serverTimestamp(),
  });

  const previewText = text.trim() || (attachments?.length ? `📎 ${attachments[0].name}` : "Attachment");

  const convRef = doc(db, "conversations", conversationId);
  const convUpdates: Record<string, any> = {
    lastMessage: previewText,
    lastMessageAt: serverTimestamp(),
    lastSenderRole: senderRole,
    updatedAt: serverTimestamp(),
  };

  if (senderRole === "patient") {
    convUpdates.unreadDoctorCount = increment(1);
  } else {
    convUpdates.unreadPatientCount = increment(1);
  }

  await updateDoc(convRef, convUpdates);

  return newMsgDoc.id;
}

/**
 * Marks conversation as read for patient or doctor.
 */
export async function markConversationRead(
  conversationId: string,
  readerRole: "patient" | "doctor"
): Promise<void> {
  if (!conversationId) return;
  const convRef = doc(db, "conversations", conversationId);
  try {
    if (readerRole === "doctor") {
      await updateDoc(convRef, { unreadDoctorCount: 0 });
    } else {
      await updateDoc(convRef, { unreadPatientCount: 0 });
    }
  } catch (error) {
    console.error("Error resetting unread count:", error);
  }
}
