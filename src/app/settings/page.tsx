"use client";

import { useState } from "react";
import AppShell from "@/components/AppShell";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { useToast } from "@/context/ToastContext";
import {
  Sun,
  Moon,
  Bell,
  Shield,
  LogOut,
  Save,
  CheckCircle2,
  Lock,
} from "lucide-react";

export default function SettingsPage() {
  const { logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const { success } = useToast();

  const [alerts, setAlerts] = useState(true);
  const [reminders, setReminders] = useState(true);
  const [updates, setUpdates] = useState(false);

  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");

  const handleSaveSettings = () => {
    success("Application preferences saved successfully!");
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPw !== confirmPw) {
      alert("New password and confirmation do not match.");
      return;
    }
    setCurrentPw("");
    setNewPw("");
    setConfirmPw("");
    success("Security credentials updated successfully.");
  };

  return (
    <AppShell>
      <Navbar title="Settings" />
      <div className="page-content" style={{ maxWidth: 860 }}>
        <div className="page-header">
          <div>
            <h1 className="page-header-title">Preferences & Settings</h1>
            <p className="page-header-subtitle">
              Configure your visual appearance, alert thresholds, and security preferences.
            </p>
          </div>
          <button type="button" className="btn btn-primary" onClick={handleSaveSettings}>
            <Save size={15} />
            <span>Save Preferences</span>
          </button>
        </div>

        {/* 1. Theme & Appearance Section */}
        <div className="card" style={{ marginBottom: 24 }}>
          <div className="card-header">
            <div>
              <h3 className="card-title">
                <Sun size={18} style={{ color: "var(--accent)" }} />
                <span>Interface Theme</span>
              </h3>
              <p className="card-subtitle">Select your preferred color scheme across all devices.</p>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {/* Light Mode Card */}
            <div
              onClick={() => setTheme("light")}
              style={{
                cursor: "pointer",
                padding: "18px 20px",
                borderRadius: "var(--radius-lg)",
                border: theme === "light" ? "2px solid var(--accent)" : "1px solid var(--border)",
                backgroundColor: theme === "light" ? "var(--bg-surface-subtle)" : "var(--bg-surface)",
                display: "flex",
                flexDirection: "column",
                gap: 10,
                transition: "all 0.2s ease",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 600 }}>
                  <Sun size={18} style={{ color: "var(--accent)" }} />
                  <span>Warm Light (Cream)</span>
                </div>
                {theme === "light" && <CheckCircle2 size={18} style={{ color: "var(--accent)" }} />}
              </div>
              <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>
                Elegant cream and off-white surfaces with deep burgundy highlights.
              </p>
            </div>

            {/* Dark Mode Card */}
            <div
              onClick={() => setTheme("dark")}
              style={{
                cursor: "pointer",
                padding: "18px 20px",
                borderRadius: "var(--radius-lg)",
                border: theme === "dark" ? "2px solid var(--highlight-lime)" : "1px solid var(--border)",
                backgroundColor: theme === "dark" ? "var(--bg-surface-subtle)" : "var(--bg-surface)",
                display: "flex",
                flexDirection: "column",
                gap: 10,
                transition: "all 0.2s ease",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 600 }}>
                  <Moon size={18} style={{ color: "var(--highlight-lime)" }} />
                  <span>Deep Charcoal</span>
                </div>
                {theme === "dark" && <CheckCircle2 size={18} style={{ color: "var(--highlight-lime)" }} />}
              </div>
              <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>
                Refined dark surfaces with soft burgundy accents and lime highlights.
              </p>
            </div>
          </div>
        </div>

        {/* 2. Notification Preferences */}
        <div className="card" style={{ marginBottom: 24 }}>
          <div className="card-header">
            <div>
              <h3 className="card-title">
                <Bell size={18} style={{ color: "var(--accent)" }} />
                <span>Attendance Alerts & Notifications</span>
              </h3>
              <p className="card-subtitle">Manage automated notifications for student attendance.</p>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 14px",
                borderRadius: "var(--radius-md)",
                backgroundColor: "var(--bg-surface-subtle)",
                cursor: "pointer",
              }}
            >
              <div>
                <strong style={{ fontSize: "0.92rem", color: "var(--text-primary)" }}>
                  Low Attendance Warnings
                </strong>
                <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: 2 }}>
                  Receive prompt alerts when any student dips below the 75% semester mark.
                </p>
              </div>
              <input
                type="checkbox"
                checked={alerts}
                onChange={(e) => setAlerts(e.target.checked)}
                style={{ width: 18, height: 18, accentColor: "var(--accent)", cursor: "pointer" }}
              />
            </label>

            <label
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 14px",
                borderRadius: "var(--radius-md)",
                backgroundColor: "var(--bg-surface-subtle)",
                cursor: "pointer",
              }}
            >
              <div>
                <strong style={{ fontSize: "0.92rem", color: "var(--text-primary)" }}>
                  Daily Period Reminders
                </strong>
                <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: 2 }}>
                  Notify CR 5 minutes before scheduled classes start.
                </p>
              </div>
              <input
                type="checkbox"
                checked={reminders}
                onChange={(e) => setReminders(e.target.checked)}
                style={{ width: 18, height: 18, accentColor: "var(--accent)", cursor: "pointer" }}
              />
            </label>

            <label
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 14px",
                borderRadius: "var(--radius-md)",
                backgroundColor: "var(--bg-surface-subtle)",
                cursor: "pointer",
              }}
            >
              <div>
                <strong style={{ fontSize: "0.92rem", color: "var(--text-primary)" }}>
                  Semester Report Broadcasts
                </strong>
                <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: 2 }}>
                  Receive weekly summary digests on Friday afternoons.
                </p>
              </div>
              <input
                type="checkbox"
                checked={updates}
                onChange={(e) => setUpdates(e.target.checked)}
                style={{ width: 18, height: 18, accentColor: "var(--accent)", cursor: "pointer" }}
              />
            </label>
          </div>
        </div>

        {/* 3. Security & Password Section */}
        <div className="card" style={{ marginBottom: 24 }}>
          <div className="card-header">
            <div>
              <h3 className="card-title">
                <Shield size={18} style={{ color: "var(--accent)" }} />
                <span>Security & Password</span>
              </h3>
              <p className="card-subtitle">Update your account password regularly.</p>
            </div>
          </div>

          <form onSubmit={handlePasswordChange}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14, marginBottom: 16 }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Current Password</label>
                <input
                  type="password"
                  className="form-input"
                  required
                  placeholder="••••••••"
                  value={currentPw}
                  onChange={(e) => setCurrentPw(e.target.value)}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">New Password</label>
                <input
                  type="password"
                  className="form-input"
                  required
                  placeholder="••••••••"
                  value={newPw}
                  onChange={(e) => setNewPw(e.target.value)}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Confirm New Password</label>
                <input
                  type="password"
                  className="form-input"
                  required
                  placeholder="••••••••"
                  value={confirmPw}
                  onChange={(e) => setConfirmPw(e.target.value)}
                />
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button type="submit" className="btn btn-secondary">
                <Lock size={14} />
                <span>Update Password</span>
              </button>
            </div>
          </form>
        </div>

        {/* 4. Session & Logout Card */}
        <div className="card" style={{ borderLeft: "4px solid var(--status-absent)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 14 }}>
            <div>
              <strong style={{ fontSize: "0.95rem", color: "var(--text-primary)" }}>
                Sign Out of Attendify
              </strong>
              <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginTop: 2 }}>
                Clears your current authentication token and active session.
              </p>
            </div>
            <button type="button" className="btn btn-danger" onClick={logout}>
              <LogOut size={15} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
