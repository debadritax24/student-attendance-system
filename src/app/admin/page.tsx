"use client";

import { useState, useEffect } from "react";
import AppShell from "@/components/AppShell";
import Navbar from "@/components/Navbar";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

interface TimetableEntry {
  day: string;
  period: number;
  startTime: string;
  endTime: string;
  subject: string;
  subjectCode: string;
  faculty: string;
  location: string;
  type: string;
}

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const periodLabels = ["1\n9:30", "2\n10:30", "3\n11:30", "4\n12:30", "5\n13:30", "6\n14:30", "7\n15:30", "8\n16:30"];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "users" | "timetable">("dashboard");
  const [timetable, setTimetable] = useState<TimetableEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/timetable?section=CSE-III-E")
      .then(r => r.json())
      .then(d => { if (d.success) setTimetable(d.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const getTimetable = (day: string, period: number) =>
    timetable.find(t => t.day === day && t.period === period);

  return (
    <AppShell>
      <Navbar title="Admin Dashboard" />
      <section className="content">
        <div className="page-header">
          <div><h1>Admin Dashboard</h1><p>Manage users, view timetable, and oversee the system.</p></div>
        </div>

        <div className="stats-grid">
          <div className="stat-card"><div className="stat-header">Total Users</div><div className="stat-value">3</div><div className="stat-change success">Active</div></div>
          <div className="stat-card"><div className="stat-header">Total Students</div><div className="stat-value">8</div><div className="stat-change success">Enrolled</div></div>
          <div className="stat-card"><div className="stat-header">Total Subjects</div><div className="stat-value">6</div><div className="stat-change success">This semester</div></div>
          <div className="stat-card"><div className="stat-header">System Status</div><div className="stat-value">OK</div><div className="stat-change success">All systems operational</div></div>
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          <button className={`btn ${activeTab === "dashboard" ? "btn-primary" : "btn-secondary"}`} onClick={() => setActiveTab("dashboard")}>Dashboard</button>
          <button className={`btn ${activeTab === "users" ? "btn-primary" : "btn-secondary"}`} onClick={() => setActiveTab("users")}>Users</button>
          <button className={`btn ${activeTab === "timetable" ? "btn-primary" : "btn-secondary"}`} onClick={() => setActiveTab("timetable")}>Timetable</button>
        </div>

        {activeTab === "users" && (
          <div className="card">
            <div className="card-title">User Management</div>
            <div className="table-container">
              <table>
                <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th></tr></thead>
                <tbody>
                  <tr>
                    <td><strong>Admin User</strong></td>
                    <td>admin@attendify.com</td>
                    <td><span className="badge badge-danger">ADMIN</span></td>
                    <td><span className="badge badge-present">Active</span></td>
                  </tr>
                  <tr>
                    <td><strong>Debadrita Goswami</strong></td>
                    <td>deba@attendify.com</td>
                    <td><span className="badge badge-primary">CR</span></td>
                    <td><span className="badge badge-present">Active</span></td>
                  </tr>
                  <tr>
                    <td><strong>Aarav Sharma</strong></td>
                    <td>stu@attendify.com</td>
                    <td><span className="badge badge-warning">STUDENT</span></td>
                    <td><span className="badge badge-present">Active</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "timetable" && (
          <div className="card">
            <div className="card-title">B.TECH CSE III E — Class Timetable (w.e.f. 23/07/2026)</div>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Day</th>
                    {periodLabels.map((p, i) => <th key={i} style={{ whiteSpace: "pre-line", textAlign: "center", fontSize: 11 }}>{p}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {days.map(day => (
                    <tr key={day}>
                      <td><strong>{day}</strong></td>
                      {Array.from({ length: 8 }, (_, i) => {
                        const entry = getTimetable(day, i + 1);
                        if (!entry) return <td key={i} style={{ background: "#f8fafc" }}></td>;
                        const bg = entry.type === "lab" ? "#eef2ff" : entry.type === "library" ? "#f0fdf4" : entry.type === "activity" ? "#fef3c7" : "";
                        return (
                          <td key={i} style={{ background: bg, padding: 6, fontSize: 11, lineHeight: 1.3, verticalAlign: "top" }}>
                            <div style={{ fontWeight: 600 }}>{entry.subject}</div>
                            {entry.subjectCode && <div style={{ color: "#6366f1", fontSize: 10 }}>{entry.subjectCode}</div>}
                            {entry.faculty && <div style={{ color: "#64748b", fontSize: 10 }}>{entry.faculty}</div>}
                            {entry.location && <div style={{ color: "#16a34a", fontSize: 10 }}>{entry.location}</div>}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "dashboard" && (
          <>
            <div className="card">
              <div className="card-title">Recent Activity</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #e2e8f0" }}>
                  <span>Admin logged in</span><span style={{ color: "#64748b" }}>Just now</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #e2e8f0" }}>
                  <span>Database seeded with timetable</span><span style={{ color: "#64748b" }}>Today</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0" }}>
                  <span>System initialized</span><span style={{ color: "#64748b" }}>Today</span>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-title">Quick Actions</div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <a href="/admin" className="btn btn-primary">Manage Users</a>
                <a href="/cr" className="btn btn-secondary">View Attendance</a>
                <a href="/students" className="btn btn-secondary">View Students</a>
                <a href="/subjects" className="btn btn-secondary">View Subjects</a>
              </div>
            </div>
          </>
        )}
      </section>
    </AppShell>
  );
}
