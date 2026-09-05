"use client";

import { useState } from "react";
import AppShell from "@/components/AppShell";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";

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
          <div className="card-title">Appearance</div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 20 }}>
            <div><strong>Dark Mode</strong><p style={{ color: "#64748b" }}>Use a darker interface.</p></div>
            <label><input type="checkbox" checked={darkMode} onChange={e => setDarkMode(e.target.checked)} /> Enable</label>
          </div>
        </div>

        <div className="card">
          <div className="card-title">Notifications</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <label style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span><strong>Attendance Alerts</strong><small style={{ display: "block", color: "#64748b" }}>Get notified about low attendance.</small></span>
              <input type="checkbox" defaultChecked />
            </label>
            <label style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span><strong>Class Reminders</strong><small style={{ display: "block", color: "#64748b" }}>Receive reminders for upcoming classes.</small></span>
              <input type="checkbox" defaultChecked />
            </label>
            <label style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span><strong>System Notifications</strong><small style={{ display: "block", color: "#64748b" }}>Receive important system updates.</small></span>
              <input type="checkbox" defaultChecked />
            </label>
          </div>
        </div>

        <div className="card">
          <div className="card-title">Account</div>
          <button className="btn btn-secondary" onClick={() => alert("Password change will be available after backend integration")}>Change Password</button>
          <button className="btn btn-danger" style={{ marginLeft: 8 }} onClick={logout}>Logout</button>
        </div>

        <div style={{ textAlign: "right" }}>
          <button className="btn btn-primary" onClick={() => alert("Settings saved successfully")}>Save Settings</button>
        </div>
      </section>
    </AppShell>
  );
}
