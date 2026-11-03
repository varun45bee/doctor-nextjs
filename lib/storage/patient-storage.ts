import { storage } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const ALLOWED_DOCUMENT_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
];

function sanitizeFileName(name: string): string {
  return name.replace(/[^a-zA-Z0-9.-]/g, "_");
}

/**
 * Uploads patient profile photo (Max 5MB)
 */
export async function uploadProfilePhoto(uid: string, file: File): Promise<string> {
  if (!uid) throw new Error("User ID is required");
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    throw new Error("Invalid file type. Please upload a JPEG, PNG, or WEBP image.");
  }
  const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
  if (file.size > MAX_SIZE) {
    throw new Error("Profile photo size exceeds 5MB limit.");
  }

  const timestamp = Date.now();
  const filename = `${timestamp}_${sanitizeFileName(file.name)}`;
  const storageRef = ref(storage, `profile-photos/${uid}/${filename}`);

  const snapshot = await uploadBytes(storageRef, file, {
    contentType: file.type,
  });
  return await getDownloadURL(snapshot.ref);
}

/**
 * Uploads patient medical records/prescriptions/scans (Max 15MB)
 */
export async function uploadMedicalDocument(
  uid: string,
  file: File
): Promise<{ url: string; fileName: string; fileSize: number; fileType: string }> {
  if (!uid) throw new Error("User ID is required");
  if (!ALLOWED_DOCUMENT_TYPES.includes(file.type)) {
    throw new Error("Invalid file type. Please upload a PDF or an Image (JPEG, PNG, WEBP).");
  }
  const MAX_SIZE = 15 * 1024 * 1024; // 15 MB
  if (file.size > MAX_SIZE) {
    throw new Error("Medical record document size exceeds 15MB limit.");
  }

  const timestamp = Date.now();
  const filename = `${timestamp}_${sanitizeFileName(file.name)}`;
  const storageRef = ref(storage, `medical-records/${uid}/${filename}`);

  const snapshot = await uploadBytes(storageRef, file, {
    contentType: file.type,
  });
  const url = await getDownloadURL(snapshot.ref);

  return {
    url,
    fileName: file.name,
    fileSize: file.size,
    fileType: file.type,
  };
}

/**
 * Uploads real-time chat attachments (Max 10MB)
 */
export async function uploadChatAttachment(
  conversationId: string,
  file: File
): Promise<{ url: string; name: string; size: number; type: string }> {
  if (!conversationId) throw new Error("Conversation ID is required");
  if (!ALLOWED_DOCUMENT_TYPES.includes(file.type)) {
    throw new Error("Invalid attachment type. Please send an image or PDF.");
  }
  const MAX_SIZE = 10 * 1024 * 1024; // 10 MB
  if (file.size > MAX_SIZE) {
    throw new Error("Chat attachment exceeds 10MB limit.");
  }

  const timestamp = Date.now();
  const filename = `${timestamp}_${sanitizeFileName(file.name)}`;
  const storageRef = ref(storage, `chat-attachments/${conversationId}/${filename}`);

  const snapshot = await uploadBytes(storageRef, file, {
    contentType: file.type,
  });
  const url = await getDownloadURL(snapshot.ref);

  return {
    url,
    name: file.name,
    size: file.size,
    type: file.type,
  };
}

