"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import { Users, UserCheck, UserX, TrendingUp, Plus, RefreshCw } from "lucide-react";

interface DashboardStats {
  students: number;
  subjects: number;
  attendance: number;
  present: number;
  absent: number;
  late: number;
  overallPercentage: number;
}

interface LowAttendanceStudent {
  _id: string;
  rollNumber: string;
  name: string;
  department: string;
  percentage: number;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [lowAttendance, setLowAttendance] = useState<LowAttendanceStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const [statsRes, studentsRes] = await Promise.all([
        fetch("/api/stats/dashboard", { credentials: "include" }),
        fetch("/api/students?limit=200", { credentials: "include" }),
      ]);
      const statsData = await statsRes.json();
      const studentsData = await studentsRes.json();

      if (statsData.success) setStats(statsData.data);
      if (studentsData.success) {
        const items = studentsData.data.items || [];
        const low = items
          .map((s: any) => ({ _id: s._id, rollNumber: s.rollNumber, name: s.name, department: s.department, percentage: s.attendancePercentage || 0 }))
          .filter((s: any) => s.percentage > 0 && s.percentage < 75)
          .sort((a: any, b: any) => a.percentage - b.percentage)
          .slice(0, 5);
        setLowAttendance(low);
      }
    } catch {
      setError("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good Morning";
    if (h < 17) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <AppShell>
      <Navbar title="Dashboard" />
      <section className="content">
        <div className="page-header">
          <div>
            <h1>{greeting()}, {user?.name?.split(" ")[0] || "User"}</h1>
            <p>Here&apos;s what&apos;s happening with attendance today.</p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn btn-secondary" onClick={fetchData} disabled={loading}><RefreshCw size={16} className={loading ? "spin" : ""} /> Refresh</button>
            <a href="/attendance" className="btn btn-primary"><Plus size={16} /> Mark Attendance</a>
          </div>
        </div>

        {loading ? (
          <div className="stats-grid">
            {[1,2,3,4].map(i => <div key={i} className="stat-card"><div className="skeleton" style={{ height: 40, width: 60, borderRadius: 6 }} /><div className="skeleton" style={{ height: 14, width: 100, marginTop: 8 }} /></div>)}
          </div>
        ) : error ? (
          <div className="card" style={{ textAlign: "center", padding: 40 }}>
            <p style={{ color: "var(--danger)", marginBottom: 12 }}>{error}</p>
            <button className="btn btn-primary" onClick={fetchData}><RefreshCw size={16} /> Retry</button>
          </div>
        ) : stats ? (
          <>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon stat-icon-blue"><Users size={20} /></div>
                <div className="stat-header">Total Students</div>
                <div className="stat-value">{stats.students}</div>
                <div className="stat-change success">Active students</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon stat-icon-green"><UserCheck size={20} /></div>
                <div className="stat-header">Present</div>
                <div className="stat-value">{stats.present}</div>
                <div className="stat-change success">{stats.present + stats.late} including late</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon stat-icon-red"><UserX size={20} /></div>
                <div className="stat-header">Absent</div>
                <div className="stat-value">{stats.absent}</div>
                <div className="stat-change danger">{stats.attendance > 0 ? Math.round((stats.absent / stats.attendance) * 100) : 0}% absent</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon stat-icon-cyan"><TrendingUp size={20} /></div>
                <div className="stat-header">Attendance</div>
                <div className="stat-value">{stats.overallPercentage}%</div>
                <div className="stat-change success">Overall</div>
              </div>
            </div>

            <div className="card">
              <div className="card-title">Students With Low Attendance</div>
              <div className="table-container">
                <table>
                  <thead>
                    <tr><th>Roll No</th><th>Student</th><th>Department</th><th>Attendance</th><th>Status</th></tr>
                  </thead>
                  <tbody>
                    {lowAttendance.length === 0 ? (
                      <tr><td colSpan={5} style={{ textAlign: "center", padding: 30, color: "var(--text-muted)" }}>No students with low attendance.</td></tr>
                    ) : lowAttendance.map(s => (
                      <tr key={s._id}>
                        <td>{s.rollNumber}</td>
                        <td><a href={`/students/${s._id}`} style={{ color: "var(--primary)" }}>{s.name}</a></td>
                        <td>{s.department}</td>
                        <td>{s.percentage}%</td>
                        <td>
                          <span className={`badge ${s.percentage < 60 ? "badge-absent" : "badge-warning"}`}>
                            {s.percentage < 60 ? "Critical" : "Warning"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : null}
      </section>
    </AppShell>
  );
}
