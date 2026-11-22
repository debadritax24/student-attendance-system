"use client";

import { useState, useEffect } from "react";
import AppShell from "@/components/AppShell";
import Navbar from "@/components/Navbar";
import StatCard from "@/components/ui/StatCard";
import {
  Users,
  GraduationCap,
  BookOpen,
  Layers,
  RefreshCw,
  Shield,
  Calendar,
} from "lucide-react";

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

const sections = [
  { key: "CSE-III-A", label: "B.Tech CSE III A" },
  { key: "CSE-III-B", label: "B.Tech CSE III B" },
  { key: "CSE-III-C", label: "B.Tech CSE III C" },
  { key: "CSE-III-D", label: "B.Tech CSE III D" },
  { key: "CSE-III-E", label: "B.Tech CSE III E" },
  { key: "CSE-V-A", label: "B.Tech CSE V A" },
  { key: "IT-III-A", label: "B.Tech IT III A" },
  { key: "ECE-III-A", label: "B.Tech ECE III A" },
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "users" | "timetable">("dashboard");
  const [selectedSection, setSelectedSection] = useState("CSE-III-E");
  const [timetable, setTimetable] = useState<TimetableEntry[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

      if (ttData.success) setTimetable(ttData.data || []);
      else setError(ttData.error || "Failed to load timetable");
      if (usersData.success) setUsers(usersData.data.items || []);
      if (statsData.success)
        setStats({ students: statsData.data.students, subjects: statsData.data.subjects });
    } catch {
      setError("Network error.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedSection]);

  const totalStudents = stats?.students || 61;
  const totalSubjects = stats?.subjects || 12;

  return (
    <AppShell>
      <Navbar title="Administration Portal" />
      <div className="page-content">
        <div className="page-header">
          <div>
            <h1 className="page-header-title">System Administration</h1>
            <p className="page-header-subtitle">
              Manage institutional sections, system users, and master university routines.
            </p>
          </div>
          <div className="page-header-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={fetchData}
              disabled={loading}
            >
              <RefreshCw size={15} className={loading ? "spin" : ""} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="stats-grid">
          <StatCard
            title="Total Students"
            value={totalStudents}
            subtitle="Enrolled cohort"
            variant="default"
            icon={<GraduationCap size={18} />}
          />
          <StatCard
            title="Subjects Configured"
            value={totalSubjects}
            subtitle="Academic syllabus"
            variant="accent"
            icon={<BookOpen size={18} />}
          />
          <StatCard
            title="Registered Users"
            value={users.length || 3}
            subtitle="System accounts"
            variant="success"
            icon={<Users size={18} />}
          />
          <StatCard
            title="Active Sections"
            value={sections.length}
            subtitle="B.Tech departments"
            variant="warning"
            icon={<Layers size={18} />}
          />
        </div>

        {/* Tab Switcher */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            marginBottom: 20,
            backgroundColor: "var(--bg-surface)",
            padding: 4,
            borderRadius: "var(--radius-lg)",
            border: "1px solid var(--border)",
            width: "fit-content",
          }}
        >
          <button
            type="button"
            className={`btn btn-sm ${activeTab === "dashboard" ? "btn-primary" : "btn-subtle"}`}
            onClick={() => setActiveTab("dashboard")}
          >
            <span>Overview & Routine</span>
          </button>
          <button
            type="button"
            className={`btn btn-sm ${activeTab === "users" ? "btn-primary" : "btn-subtle"}`}
            onClick={() => setActiveTab("users")}
          >
            <span>User Accounts ({users.length})</span>
          </button>
        </div>

        {activeTab === "dashboard" && (
          <div className="card">
            <div className="card-header">
              <div>
                <h3 className="card-title">
                  <Calendar size={18} style={{ color: "var(--accent)" }} />
                  <span>Master Section Timetable</span>
                </h3>
                <p className="card-subtitle">Select cohort to inspect period routine</p>
              </div>
              <select
                className="form-select"
                style={{ width: "auto" }}
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
              >
                {sections.map((sec) => (
                  <option key={sec.key} value={sec.key}>
                    {sec.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th style={{ width: 110 }}>Day</th>
                    {[
                      "1 (09:30)",
                      "2 (10:30)",
                      "3 (11:30)",
                      "4 (12:30)",
                      "5 (13:30)",
                      "6 (14:30)",
                      "7 (15:30)",
                      "8 (16:30)",
                    ].map((p, i) => (
                      <th key={i} style={{ textAlign: "center", fontSize: "0.72rem" }}>
                        {p}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {days.map((day) => (
                    <tr key={day}>
                      <td style={{ fontWeight: 600, color: "var(--accent)" }}>{day}</td>
                      {Array.from({ length: 8 }, (_, i) => {
                        const entry = timetable.find(
                          (t) => t.day === day && t.period === i + 1
                        );
                        if (!entry) {
                          return (
                            <td
                              key={i}
                              style={{
                                textAlign: "center",
                                color: "var(--text-muted)",
                                fontSize: "0.75rem",
                                backgroundColor: "var(--bg-surface-subtle)",
                              }}
                            >
                              —
                            </td>
                          );
                        }

                        const isLab = entry.type === "lab";

                        return (
                          <td
                            key={i}
                            style={{
                              padding: "8px 10px",
                              fontSize: "0.76rem",
                              verticalAlign: "top",
                              backgroundColor: isLab ? "var(--accent-light)" : undefined,
                            }}
                          >
                            <div style={{ fontWeight: 600 }}>{entry.subject}</div>
                            {entry.subjectCode && (
                              <div style={{ color: "var(--accent)", fontSize: "0.7rem", marginTop: 2 }}>
                                {entry.subjectCode}
                              </div>
                            )}
                            {entry.location && (
                              <div style={{ color: "var(--text-muted)", fontSize: "0.68rem" }}>
                                {entry.location}
                              </div>
                            )}
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

        {activeTab === "users" && (
          <div className="card">
            <div className="card-header">
              <div>
                <h3 className="card-title">
                  <Shield size={18} style={{ color: "var(--accent)" }} />
                  <span>Authorized Users Directory</span>
                </h3>
                <p className="card-subtitle">Administrators, Class Representatives, and Students</p>
              </div>
            </div>

            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>User Name</th>
                    <th>Email Address</th>
                    <th>Role</th>
                    <th>Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id}>
                      <td style={{ fontWeight: 600 }}>{u.name}</td>
                      <td>{u.email}</td>
                      <td>
                        <span
                          className={`badge ${
                            u.role === "ADMIN"
                              ? "badge-accent"
                              : u.role === "CR"
                              ? "badge-lime"
                              : "badge-present"
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td style={{ color: "var(--text-muted)", fontSize: "0.82rem" }}>
                        {u.createdAt ? u.createdAt.split("T")[0] : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
