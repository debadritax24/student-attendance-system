"use client";

import { useState } from "react";
import AppShell from "@/components/AppShell";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import { Moon, Bell, Shield, LogOut, Save } from "lucide-react";

export default function SettingsPage() {
  const { logout } = useAuth();
  const [darkMode, setDarkMode] = useState(false);

  return (
    <AppShell>
      <Navbar title="Settings" />
      <section className="content">
        <div className="page-header">
          <div><h1>Settings</h1><p>Customize your Attendify experience.</p></div>
        </div>

        <div className="card">
          <div className="card-title" style={{ display: "flex", alignItems: "center", gap: 10 }}><Moon size={18} /> Appearance</div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
            <div><strong style={{ color: "var(--text)" }}>Dark Mode</strong><p style={{ color: "var(--text-muted)" }}>Use a darker interface.</p></div>
            <label><input type="checkbox" checked={darkMode} onChange={e => setDarkMode(e.target.checked)} /> Enable</label>
          </div>
        </div>

        <div className="card">
          <div className="card-title" style={{ display: "flex", alignItems: "center", gap: 10 }}><Bell size={18} /> Notifications</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <label style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
              <span><strong style={{ color: "var(--text)" }}>Attendance Alerts</strong><small style={{ display: "block", color: "var(--text-muted)" }}>Get notified about low attendance.</small></span>
              <input type="checkbox" defaultChecked />
            </label>
            <label style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
              <span><strong style={{ color: "var(--text)" }}>Class Reminders</strong><small style={{ display: "block", color: "var(--text-muted)" }}>Receive reminders for upcoming classes.</small></span>
              <input type="checkbox" defaultChecked />
            </label>
            <label style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
              <span><strong style={{ color: "var(--text)" }}>System Notifications</strong><small style={{ display: "block", color: "var(--text-muted)" }}>Receive important system updates.</small></span>
              <input type="checkbox" defaultChecked />
            </label>
          </div>
        </div>

        <div className="card">
          <div className="card-title" style={{ display: "flex", alignItems: "center", gap: 10 }}><Shield size={18} /> Account</div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button className="btn btn-secondary" onClick={() => alert("Password change will be available after backend integration")}>Change Password</button>
            <button className="btn btn-danger" onClick={logout}><LogOut size={14} /> Logout</button>
          </div>
        </div>

        <div style={{ textAlign: "right" }}>
          <button className="btn btn-primary" onClick={() => alert("Settings saved successfully")}><Save size={16} /> Save Settings</button>
        </div>
      </section>
    </AppShell>
  );
}
