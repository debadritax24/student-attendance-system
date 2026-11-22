"use client";

import { useState } from "react";
import AppShell from "@/components/AppShell";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { User, Mail, Shield, Save, CheckCircle2 } from "lucide-react";

const roleLabels: Record<string, string> = {
  ADMIN: "System Administrator",
  CR: "Class Representative",
  STUDENT: "Enrolled Student",
};

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const { success } = useToast();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");

  const role = user?.role?.toUpperCase() || "STUDENT";
  const displayName = name || user?.name || "User";

  function getInitials(n: string) {
    return n
      .split(" ")
      .map((w) => w[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      const updated = { ...user, name, email };
      setUser(updated);
      localStorage.setItem("attendifyUser", JSON.stringify(updated));
    }
    success("Profile details updated successfully!");
  };

  return (
    <AppShell>
      <Navbar title="My Profile" />
      <div className="page-content" style={{ maxWidth: 860 }}>
        <div className="page-header">
          <div>
            <h1 className="page-header-title">Account Profile</h1>
            <p className="page-header-subtitle">
              Manage your personal credentials, contact email, and student roles.
            </p>
          </div>
        </div>

        {/* Profile Card */}
        <div className="card" style={{ marginBottom: 24 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 20,
              paddingBottom: 24,
              borderBottom: "1px solid var(--border-subtle)",
              marginBottom: 24,
              flexWrap: "wrap",
            }}
          >
            <div className="avatar avatar-lg">
              {getInitials(displayName)}
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                <h2 style={{ fontSize: "1.45rem", fontWeight: 700 }}>{displayName}</h2>
                <span className="badge badge-accent" style={{ fontWeight: 600 }}>
                  {roleLabels[role] || role}
                </span>
              </div>
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: 4 }}>
                {user?.email || "No email assigned"}
              </p>
            </div>
          </div>

          <form onSubmit={handleSave}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <User size={13} style={{ color: "var(--accent)" }} />
                  <span>Full Legal Name</span>
                </label>
                <input
                  className="form-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <Mail size={13} style={{ color: "var(--accent)" }} />
                  <span>Email Address</span>
                </label>
                <input
                  type="email"
                  className="form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@attendify.com"
                  required
                />
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button type="submit" className="btn btn-primary">
                <Save size={15} />
                <span>Save Profile Changes</span>
              </button>
            </div>
          </form>
        </div>

        {/* Access Rights & Information */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <Shield size={18} style={{ color: "var(--accent)" }} />
              <span>Institutional Permissions & Role</span>
            </h3>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: "0.9rem", color: "var(--text-secondary)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <CheckCircle2 size={16} style={{ color: "var(--status-present)" }} />
              <span>Authorized to view Section CSE-III-E class schedules and rosters.</span>
            </div>
            {role === "CR" && (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <CheckCircle2 size={16} style={{ color: "var(--status-present)" }} />
                <span>Designated Class Representative: Authorized to record and submit period attendance.</span>
              </div>
            )}
            {role === "ADMIN" && (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <CheckCircle2 size={16} style={{ color: "var(--status-present)" }} />
                <span>Full System Administrator: Permissions to enroll students and manage subjects.</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
