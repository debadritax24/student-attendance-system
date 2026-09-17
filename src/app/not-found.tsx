"use client";

export default function NotFound() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        fontFamily: "Inter, sans-serif",
        background: "#0a0a0f",
        color: "#e4e4e7",
        padding: 20,
      }}
    >
      <h1 style={{ fontSize: 72, fontWeight: 800, color: "#3b82f6", marginBottom: 0 }}>404</h1>
      <h2 style={{ fontSize: 24, marginTop: 8, marginBottom: 12 }}>Page Not Found</h2>
      <p style={{ color: "#a1a1aa", marginBottom: 24, textAlign: "center", maxWidth: 400 }}>
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <a
        href="/dashboard"
        style={{
          padding: "10px 24px",
          background: "#3b82f6",
          color: "white",
          border: "none",
          borderRadius: 8,
          cursor: "pointer",
          fontSize: 14,
          fontWeight: 600,
          textDecoration: "none",
        }}
      >
        Go to Dashboard
      </a>
    </div>
  );
}
