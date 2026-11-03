import { getAdminDb } from "@/lib/firebase-admin";
import type { AuditLogEntry } from "@/lib/types/appointment";

export async function logAuditEvent(entry: AuditLogEntry): Promise<void> {
  try {
    const db = getAdminDb();
    await db.collection("auditLogs").add({
      ...entry,
      timestamp: entry.timestamp || new Date().toISOString(),
      createdAt: new Date(),
    });
  } catch (err) {
    // Non-blocking error logging for audits
    console.error("Failed to write audit log:", err);
  }
}
