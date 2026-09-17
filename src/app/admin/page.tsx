"use client";

import { useState, useEffect } from "react";
import AppShell from "@/components/AppShell";
import Navbar from "@/components/Navbar";
import { Users, GraduationCap, BookOpen, Activity, RefreshCw } from "lucide-react";

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

interface DashboardStats {
  students: number;
  subjects: number;
}

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const periodLabels = ["1\n9:30", "2\n10:30", "3\n11:30", "4\n12:30", "5\n13:30", "6\n14:30", "7\n15:30", "8\n16:30"];

const sections = [
  { key: "CSE-III-A", label: "B.TECH CSE III A" },
  { key: "CSE-III-B", label: "B.TECH CSE III B" },
  { key: "CSE-III-C", label: "B.TECH CSE III C" },
  { key: "CSE-III-D", label: "B.TECH CSE III D" },
  { key: "CSE-III-E", label: "B.TECH CSE III E" },
  { key: "CSE-V-A", label: "B.TECH CSE V A" },
  { key: "CSE-V-B", label: "B.TECH CSE V B" },
  { key: "CSE-V-C", label: "B.TECH CSE V C" },
  { key: "CSE-V-D", label: "B.TECH CSE V D" },
  { key: "CSE-V-E", label: "B.TECH CSE V E" },
  { key: "IT-III-A", label: "B.TECH IT III A" },
  { key: "IT-III-B", label: "B.TECH IT III B" },
  { key: "IT-V-A", label: "B.TECH IT V A" },
  { key: "IT-V-B", label: "B.TECH IT V B" },
  { key: "ECE-III-A", label: "B.TECH ECE III A" },
  { key: "ECE-III-B", label: "B.TECH ECE III B" },
  { key: "ECE-V-A", label: "B.TECH ECE V A" },
  { key: "ECE-V-B", label: "B.TECH ECE V B" },
  { key: "EEE-III-A", label: "B.TECH EEE III A" },
  { key: "EEE-III-B", label: "B.TECH EEE III B" },
  { key: "ME-III-A", label: "B.TECH ME III A" },
  { key: "ME-III-B", label: "B.TECH ME III B" },
  { key: "CE-III-A", label: "B.TECH CE III A" },
  { key: "CE-III-B", label: "B.TECH CE III B" },
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "users" | "timetable">("dashboard");
  const [selectedSection, setSelectedSection] = useState("CSE-III-E");
  const [timetable, setTimetable] = useState<TimetableEntry[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const [ttRes, usersRes, statsRes] = await Promise.all([
          fetch(`/api/timetable?section=${selectedSection}`, { credentials: "include" }),
          fetch("/api/users?limit=100", { credentials: "include" }),
          fetch("/api/stats/dashboard", { credentials: "include" }),
        ]);
        const ttData = await ttRes.json();
        const usersData = await usersRes.json();
        const statsData = await statsRes.json();

        if (ttData.success) setTimetable(ttData.data);
        else setError(ttData.error || "Failed to load timetable");
        if (usersData.success) setUsers(usersData.data.items || []);
        if (statsData.success) setStats({ students: statsData.data.students, subjects: statsData.data.subjects });
      } catch {
        setError("Network error.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedSection]);

  const getTimetable = (day: string, period: number) =>
    timetable.find(t => t.day === day && t.period === period);

  return (
    <AppShell>
      <Navbar title="Admin Dashboard" />
      <section className="content">
        <div className="page-header">
          <div><h1>Admin Dashboard</h1><p>Manage users, view timetable, and oversee the system.</p></div>
          <button className="btn btn-secondary" onClick={() => window.location.reload()} disabled={loading}><RefreshCw size={16} className={loading ? "spin" : ""} /> Refresh</button>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon stat-icon-blue"><Users size={20} /></div>
            <div className="stat-header">Total Users</div>
            <div className="stat-value">{users.length || "—"}</div>
            <div className="stat-change success">Active</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon stat-icon-green"><GraduationCap size={20} /></div>
            <div className="stat-header">Total Students</div>
            <div className="stat-value">{stats?.students || "—"}</div>
            <div className="stat-change success">Enrolled</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon stat-icon-orange"><BookOpen size={20} /></div>
            <div className="stat-header">Total Subjects</div>
            <div className="stat-value">{stats?.subjects || "—"}</div>
            <div className="stat-change success">This semester</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon stat-icon-cyan"><Activity size={20} /></div>
            <div className="stat-header">System Status</div>
            <div className="stat-value">OK</div>
            <div className="stat-change success">All systems operational</div>
          </div>
        </div>

        <div className="tab-buttons">
          <button className={`btn ${activeTab === "dashboard" ? "btn-primary" : "btn-secondary"}`} onClick={() => setActiveTab("dashboard")}>Dashboard</button>
          <button className={`btn ${activeTab === "users" ? "btn-primary" : "btn-secondary"}`} onClick={() => setActiveTab("users")}>Users</button>
          <button className={`btn ${activeTab === "timetable" ? "btn-primary" : "btn-secondary"}`} onClick={() => setActiveTab("timetable")}>Timetable</button>
        </div>

        {activeTab === "users" && (
          <div className="card">
            <div className="card-title">User Management</div>
            <div className="table-container">
              {loading ? (
                <div style={{ padding: 40, textAlign: "center", color: "var(--text-muted)" }}>Loading users...</div>
              ) : (
                <table>
                  <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th></tr></thead>
                  <tbody>
                    {users.length === 0 ? (
                      <tr><td colSpan={4} style={{ textAlign: "center", padding: 30, color: "var(--text-muted)" }}>No users found.</td></tr>
                    ) : users.map(u => (
                      <tr key={u._id}>
                        <td><strong>{u.name}</strong></td>
                        <td>{u.email}</td>
                        <td>
                          <span className={`badge ${u.role === "ADMIN" ? "badge-danger" : u.role === "CR" ? "badge-primary" : "badge-warning"}`}>
                            {u.role}
                          </span>
                        </td>
                        <td>{u.createdAt ? new Date(u.createdAt).toLocaleDateString("en-IN") : "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {activeTab === "timetable" && (
          <div className="card">
            <div className="card-title" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
              <span>{sections.find(s => s.key === selectedSection)?.label || selectedSection} — Class Timetable</span>
              <select
                className="form-control"
                style={{ width: "auto", padding: "6px 10px", fontSize: 13 }}
                value={selectedSection}
                onChange={e => setSelectedSection(e.target.value)}
              >
                {sections.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
              </select>
            </div>
            {loading ? (
              <p style={{ color: "var(--text-muted)", padding: 20 }}>Loading timetable...</p>
            ) : error ? (
              <div style={{ padding: 20, textAlign: "center" }}>
                <p style={{ color: "var(--danger)", marginBottom: 12 }}>{error}</p>
                <button className="btn btn-primary" onClick={() => window.location.reload()}><RefreshCw size={16} /> Retry</button>
              </div>
            ) : (
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
                          if (!entry) return <td key={i} style={{ background: "rgba(255,255,255,0.02)" }}></td>;
                          const bg = entry.type === "lab" ? "rgba(0,212,255,0.06)" : entry.type === "library" ? "rgba(0,230,118,0.06)" : entry.type === "activity" ? "rgba(255,140,66,0.06)" : "";
                          return (
                            <td key={i} style={{ background: bg, padding: 6, fontSize: 11, lineHeight: 1.3, verticalAlign: "top" }}>
                              <div style={{ fontWeight: 600, color: "var(--text)" }}>{entry.subject}</div>
                              {entry.subjectCode && <div style={{ color: "var(--primary)", fontSize: 10 }}>{entry.subjectCode}</div>}
                              {entry.faculty && <div style={{ color: "var(--text-muted)", fontSize: 10 }}>{entry.faculty}</div>}
                              {entry.location && <div style={{ color: "var(--success)", fontSize: 10 }}>{entry.location}</div>}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === "dashboard" && (
          <>
            <div className="card">
              <div className="card-title">Quick Actions</div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <a href="/students" className="btn btn-primary">Manage Students</a>
                <a href="/subjects" className="btn btn-secondary">Manage Subjects</a>
                <a href="/reports" className="btn btn-secondary">View Reports</a>
              </div>
            </div>
          </>
        )}
      </section>
    </AppShell>
  );
}
