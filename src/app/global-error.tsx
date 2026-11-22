"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error("Global application error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          padding: 24,
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          backgroundColor: "#FAF8F5",
          color: "#1C1917",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          textAlign: "center",
        }}
      >
        <div
          style={{
            maxWidth: 460,
            padding: 36,
            borderRadius: 16,
            backgroundColor: "#FFFFFF",
            border: "1px solid #E8E3DA",
            boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 10,
              backgroundColor: "#F7EBF0",
              color: "#5A1629",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
              fontWeight: 700,
              fontSize: 20,
            }}
          >
            !
          </div>
          <h2 style={{ fontSize: "1.45rem", fontWeight: 700, margin: "0 0 8px" }}>
            Something went wrong
          </h2>
          <p style={{ color: "#635E57", fontSize: "0.92rem", lineHeight: 1.5, margin: "0 0 24px" }}>
            An unexpected error occurred. Please try reloading the application.
          </p>
          <button
            onClick={reset}
            style={{
              padding: "10px 20px",
              backgroundColor: "#5A1629",
              color: "#FFFFFF",
              border: "none",
              borderRadius: 10,
              cursor: "pointer",
              fontSize: "0.9rem",
              fontWeight: 600,
            }}
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}
