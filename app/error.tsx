"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center" style={{ backgroundColor: "var(--bg-base)" }}>
      <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
        <span className="text-3xl">⚠️</span>
      </div>
      <h2 className="font-serif text-3xl mb-4" style={{ fontFamily: "'Cormorant Garamond', serif", color: "var(--text-primary)" }}>
        Something went wrong
      </h2>
      <p className="text-sage-600 mb-8 max-w-md mx-auto">
        We apologize for the inconvenience. Our system encountered an unexpected error. 
        Please try refreshing the page or contact us if the problem persists.
      </p>
      <div className="flex gap-4">
        <button
          onClick={() => reset()}
          className="bg-sage-500 text-white px-8 py-3 rounded-full font-medium hover:bg-sage-600 transition-all"
        >
          Try again
        </button>
        <a
          href="/"
          className="border border-sage-200 px-8 py-3 rounded-full font-medium hover:bg-sage-50 transition-all"
          style={{ color: "var(--text-secondary)" }}
        >
          Go Home
        </a>
      </div>
    </div>
  );
}
