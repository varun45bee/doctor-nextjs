"use client";

import { useEffect, useState } from "react";
import {
  Calendar,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Power,
  Video,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export default function GoogleCalendarSyncCard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [disconnecting, setDisconnecting] = useState(false);
  const [connected, setConnected] = useState(false);
  const [calendarEmail, setCalendarEmail] = useState<string | null>(null);
  const [connectedAt, setConnectedAt] = useState<string | null>(null);
  const [syncError, setSyncError] = useState<string | null>(null);

  const fetchStatus = async () => {
    if (!user) return;
    setLoading(true);
    setSyncError(null);
    try {
      const idToken = await user.getIdToken();
      const res = await fetch("/api/integrations/google/status", {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setConnected(data.connected);
        setCalendarEmail(data.email || null);
        setConnectedAt(data.connectedAt || null);
        setSyncError(data.lastSyncError || null);
      }
    } catch (err) {
      console.error("Failed to check Google status:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, [user]);

  const handleConnect = () => {
    const emailParam = user?.email ? `?email=${encodeURIComponent(user.email)}` : "";
    window.location.href = `/api/integrations/google/connect${emailParam}`;
  };

  const handleDisconnect = async () => {
    if (!user) return;
    if (!confirm("Are you sure you want to disconnect Google Calendar? Online appointments will not auto-generate Google Meet links until reconnected.")) {
      return;
    }

    setDisconnecting(true);
    try {
      const idToken = await user.getIdToken();
      const res = await fetch("/api/integrations/google/disconnect", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${idToken}`,
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setConnected(false);
        setCalendarEmail(null);
        setConnectedAt(null);
      } else {
        alert(data.error || "Failed to disconnect Google Calendar.");
      }
    } catch (err) {
      alert("Error disconnecting Google Calendar.");
    } finally {
      setDisconnecting(false);
    }
  };

  return (
    <div
      className="p-5 rounded-2xl border transition-all shadow-sm"
      style={{
        backgroundColor: "var(--bg-surface)",
        borderColor: "var(--border-color)",
      }}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Status Indicator */}
        <div className="flex items-start gap-3.5">
          <div
            className={`p-3 rounded-2xl flex items-center justify-center ${
              connected
                ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 border border-emerald-200 dark:border-emerald-800"
                : "bg-amber-50 dark:bg-amber-950/40 text-amber-600 border border-amber-200 dark:border-amber-800"
            }`}
          >
            <Calendar className="w-5 h-5" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-sm sm:text-base text-[var(--text-primary)]">
                Google Calendar & Meet Integration
              </h3>
              {loading ? (
                <span className="text-[11px] text-[var(--text-muted)] animate-pulse">
                  Checking...
                </span>
              ) : connected ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
                  <CheckCircle2 className="w-3 h-3" /> Connected
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
                  <AlertTriangle className="w-3 h-3" /> Disconnected
                </span>
              )}
            </div>

            <p className="text-xs text-[var(--text-secondary)] mt-0.5">
              {connected ? (
                <>
                  Syncing appointments with Google Calendar & auto-creating Google Meet rooms via{" "}
                  <strong className="text-[var(--text-primary)]">{calendarEmail}</strong>
                </>
              ) : (
                "Connect your Google account to automatically create Calendar events and Google Meet links for online appointments."
              )}
            </p>

            {syncError && (
              <p className="text-xs text-red-600 dark:text-red-400 mt-1 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                Sync Warning: {syncError}
              </p>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          {connected ? (
            <button
              type="button"
              onClick={handleDisconnect}
              disabled={disconnecting}
              className="px-4 py-2 rounded-xl text-xs font-semibold border border-red-200 dark:border-red-900/40 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors flex items-center gap-1.5 disabled:opacity-50"
            >
              <Power className="w-3.5 h-3.5" />
              {disconnecting ? "Disconnecting..." : "Disconnect"}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleConnect}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-sage-600 hover:bg-sage-700 text-white shadow-sm transition-colors flex items-center gap-1.5"
            >
              <Video className="w-3.5 h-3.5" />
              Connect Google Account
            </button>
          )}

          <button
            type="button"
            onClick={fetchStatus}
            disabled={loading}
            className="p-2 rounded-xl border border-[var(--border-color)] hover:bg-[var(--bg-subtle)] text-[var(--text-secondary)] transition-colors"
            title="Refresh status"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>
    </div>
  );
}
