"use client";

import { LogOut } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export default function DoctorHeader() {
  const { user, signOut } = useAuth();

  return (
    <header
      className="border-b px-4 sm:px-6 py-4"
      style={{
        backgroundColor: "var(--bg-surface)",
        borderColor: "var(--border-color)",
      }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div>
          <h1
            className="font-serif text-xl sm:text-2xl"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              color: "var(--text-primary)",
            }}
          >
            Doctor Dashboard
          </h1>
          {user?.email && (
            <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
              {user.email}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={() => signOut()}
          className="flex items-center gap-2 text-sm px-4 py-2 rounded-full border hover:bg-sage-50 dark:hover:bg-sage-900 transition-colors"
          style={{
            borderColor: "var(--border-color)",
            color: "var(--text-secondary)",
          }}
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Sign Out</span>
        </button>
      </div>
    </header>
  );
}
