"use client";

import { useState } from "react";
import AppShell from "@/components/AppShell";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import { User, Mail, Save } from "lucide-react";

const roleLabels: Record<string, string> = {
  ADMIN: "Administrator",
  CR: "Class Representative",
  STUDENT: "Student",
};

export default function ProfilePage() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");

  const role = user?.role?.toUpperCase() || "STUDENT";
  const displayName = name || user?.name || "User";
  const displayEmail = email || user?.email || "No email";

  function getInitials(n: string) {
    return n.split(" ").map(w => w[0]).join("").substring(0, 2).toUpperCase();
  }

  return (
    <AppShell>
      <Navbar title="Profile" />
      <section className="content">
        <div className="page-header">
          <div><h1>My Profile</h1><p>Manage your personal information.</p></div>
        </div>

        <div className="card">
          <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 30, flexWrap: "wrap" }}>
            <div className="avatar" style={{ width: 80, height: 80, fontSize: 24 }}>
              {getInitials(displayName)}
            </div>
            <div>
              <h2 style={{ fontSize: 32, textTransform: "uppercase", letterSpacing: "0.04em" }}>{displayName}</h2>
              <p style={{ color: "var(--text-secondary)" }}>{roleLabels[role] || role}</p>
              <span className={`badge ${role === "ADMIN" ? "badge-danger" : role === "CR" ? "badge-primary" : "badge-warning"}`}>{role}</span>
            </div>
          </div>

          <form onSubmit={e => { e.preventDefault(); alert("Profile updated successfully"); }}>
            <div className="grid-2">
              <div className="form-group">
                <label style={{ display: "flex", alignItems: "center", gap: 6 }}><User size={12} /> Full Name</label>
                <input className="form-control" value={name} onChange={e => setName(e.target.value)} />
              </div>
              <div className="form-group">
                <label style={{ display: "flex", alignItems: "center", gap: 6 }}><Mail size={12} /> Email</label>
                <input type="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
            </div>
            <button type="submit" className="btn btn-primary"><Save size={16} /> Save Changes</button>
          </form>
        </div>
      </section>
    </AppShell>
  );
}
