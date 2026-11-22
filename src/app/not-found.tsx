"use client";

import Link from "next/link";
import { Sparkles, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        background: "var(--bg-app)",
        color: "var(--text-primary)",
        padding: 24,
        textAlign: "center",
      }}
    >
      <div
        className="brand-mark"
        style={{ width: 48, height: 48, marginBottom: 20 }}
      >
        <Sparkles size={24} strokeWidth={2.3} />
        <div className="brand-dot" />
      </div>
      <h1
        style={{
          fontSize: "4.5rem",
          fontWeight: 800,
          color: "var(--accent)",
          lineHeight: 1,
          letterSpacing: "-0.04em",
        }}
      >
        404
      </h1>
      <h2 style={{ fontSize: "1.5rem", marginTop: 12, marginBottom: 8, fontWeight: 700 }}>
        Page Not Found
      </h2>
      <p
        style={{
          color: "var(--text-secondary)",
          marginBottom: 24,
          maxWidth: 420,
          fontSize: "0.95rem",
        }}
      >
        The page you are looking for does not exist, has been removed, or is temporarily unavailable.
      </p>
      <Link href="/dashboard" className="btn btn-primary btn-lg">
        <ArrowLeft size={16} />
        <span>Return to Dashboard</span>
      </Link>
    </div>
  );
}
