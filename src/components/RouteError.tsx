"use client";

import { useEffect } from "react";
import { RefreshCw, AlertTriangle } from "lucide-react";

export default function RouteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error("Route error:", error);
  }, [error]);

  return (
    <div className="card" style={{ padding: 48, textAlign: "center", maxWidth: 480, margin: "40px auto" }}>
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: "var(--radius-md)",
          backgroundColor: "var(--status-absent-bg)",
          color: "var(--status-absent)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 16px",
        }}
      >
        <AlertTriangle size={22} />
      </div>
      <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: 8, color: "var(--text-primary)" }}>
        Something went wrong
      </h3>
      <p style={{ color: "var(--text-secondary)", marginBottom: 24, fontSize: "0.9rem", lineHeight: 1.5 }}>
        {error.message || "An unexpected error occurred while loading this view."}
      </p>
      <button type="button" className="btn btn-primary" onClick={reset}>
        <RefreshCw size={15} />
        <span>Reload View</span>
      </button>
    </div>
  );
}
