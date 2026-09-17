"use client";

import { useEffect } from "react";
import { RefreshCw } from "lucide-react";

export default function RouteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Route error:", error);
  }, [error]);

  return (
    <div style={{ padding: 40, textAlign: "center" }}>
      <h2 style={{ fontSize: 20, marginBottom: 8, color: "var(--text)" }}>Something went wrong</h2>
      <p style={{ color: "var(--text-muted)", marginBottom: 20, maxWidth: 400, margin: "0 auto 20px" }}>
        {error.message || "An unexpected error occurred."}
      </p>
      <button className="btn btn-primary" onClick={reset}>
        <RefreshCw size={16} /> Try Again
      </button>
    </div>
  );
}
