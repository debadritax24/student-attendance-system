"use client";

import { useState } from "react";
import AppShell from "@/components/AppShell";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";

export default function ProfilePage() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || "Debadrita Goswami");
  const [email, setEmail] = useState(user?.email || "cr@attendify.com");

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
              {name.split(" ").map((w: string) => w[0]).join("").substring(0, 2).toUpperCase()}
            </div>
            <div>
              <h2>{name}</h2>
              <p style={{ color: "#64748b" }}>Class Representative</p>
              <span className="badge badge-primary">{user?.role || "CR"}</span>
            </div>
          </div>

          <form onSubmit={e => { e.preventDefault(); alert("Profile updated successfully"); }}>
            <div className="grid-2">
              <div className="form-group"><label>Full Name</label><input className="form-control" value={name} onChange={e => setName(e.target.value)} /></div>
              <div className="form-group"><label>Email</label><input type="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} /></div>
              <div className="form-group"><label>Department</label><input className="form-control" value="Computer Science & Engineering" readOnly /></div>
              <div className="form-group"><label>Semester</label><input className="form-control" value="5" readOnly /></div>
              <div className="form-group"><label>Section</label><input className="form-control" value="A" readOnly /></div>
              <div className="form-group"><label>Roll Number</label><input className="form-control" value="AU-CR-001" readOnly /></div>
            </div>
            <button type="submit" className="btn btn-primary">Save Changes</button>
          </form>
        </div>
      </section>
    </AppShell>
  );
}
