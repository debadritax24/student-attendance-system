"use client";

import AppShell from "@/components/AppShell";
import Navbar from "@/components/Navbar";
import { Users, TrendingUp, CheckCircle, AlertTriangle, Printer, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";

interface Student {
  _id: string;
  rollNumber: string;
  name: string;
  department: string;
  section: string;
  semester: number;
  attendancePercentage?: number;
}

export default function ReportsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/students?limit=500", { credentials: "include" });
      const data = await res.json();
      if (data.success) setStudents(data.data.items || []);
      else setError(data.error || "Failed to load reports");
    } catch {
      setError("Network error.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const total = students.length;
  const withAttendance = students.filter(s => (s.attendancePercentage || 0) > 0);
  const average = withAttendance.length ? Math.round(withAttendance.reduce((sum, s) => sum + (s.attendancePercentage || 0), 0) / withAttendance.length) : 0;
  const above = withAttendance.filter(s => (s.attendancePercentage || 0) >= 75).length;
  const below = withAttendance.length - above;

  return (
    <AppShell>
      <Navbar title="Reports" />
      <section className="content">
        <div className="page-header">
          <div><h1>Attendance Reports</h1><p>Review attendance performance across the class.</p></div>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn btn-secondary" onClick={fetchData} disabled={loading}><RefreshCw size={16} className={loading ? "spin" : ""} /></button>
            <button className="btn btn-primary" onClick={() => window.print()}><Printer size={16} /> Print Report</button>
          </div>
        </div>

        {loading ? (
          <div className="stats-grid">
            {[1,2,3,4].map(i => <div key={i} className="stat-card"><div className="skeleton" style={{ height: 40, width: 60, borderRadius: 6 }} /></div>)}
          </div>
        ) : error ? (
          <div className="card" style={{ textAlign: "center", padding: 40 }}>
            <p style={{ color: "var(--danger)", marginBottom: 12 }}>{error}</p>
            <button className="btn btn-primary" onClick={fetchData}><RefreshCw size={16} /> Retry</button>
          </div>
        ) : (
          <>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon stat-icon-blue"><Users size={20} /></div>
                <div className="stat-header">Total Students</div>
                <div className="stat-value">{total}</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon stat-icon-cyan"><TrendingUp size={20} /></div>
                <div className="stat-header">Average Attendance</div>
                <div className="stat-value">{average}%</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon stat-icon-green"><CheckCircle size={20} /></div>
                <div className="stat-header">Meeting Requirement</div>
                <div className="stat-value">{above}</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon stat-icon-orange"><AlertTriangle size={20} /></div>
                <div className="stat-header">Needs Attention</div>
                <div className="stat-value">{below}</div>
              </div>
            </div>

            <div className="card">
              <div className="card-title">Student Attendance Summary</div>
              <div className="table-container">
                <table>
                  <thead><tr><th>Roll</th><th>Student</th><th>Department</th><th>Semester</th><th>Section</th><th>Attendance</th><th>Status</th></tr></thead>
                  <tbody>
                    {students.length === 0 ? (
                      <tr><td colSpan={7} style={{ textAlign: "center", padding: 40, color: "var(--text-muted)" }}>No students found.</td></tr>
                    ) : students.map(s => {
                      const pct = s.attendancePercentage || 0;
                      return (
                        <tr key={s._id}>
                          <td><strong>{s.rollNumber}</strong></td>
                          <td><a href={`/students/${s._id}`} style={{ color: "var(--primary)" }}>{s.name}</a></td>
                          <td>{s.department || "—"}</td>
                          <td>{s.semester || "—"}</td>
                          <td>{s.section || "—"}</td>
                          <td>{pct > 0 ? `${pct}%` : "—"}</td>
                          <td>
                            {pct > 0 ? (
                              <span className={`badge ${pct >= 75 ? "badge-present" : "badge-warning"}`}>{pct >= 75 ? "Good" : "Warning"}</span>
                            ) : (
                              <span className="badge" style={{ color: "var(--text-muted)" }}>N/A</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </section>
    </AppShell>
  );
}
