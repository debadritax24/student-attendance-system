"use client";

import { useState, useEffect } from "react";
import AppShell from "@/components/AppShell";
import Navbar from "@/components/Navbar";
import { Users, UserCheck, UserX, TrendingUp, RefreshCw, Clock } from "lucide-react";

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

const students = [
  { id: 1, roll: "AU7-007-001", name: "Aarav Sharma", email: "aarav@attendify.com", attendance: 92 },
  { id: 2, roll: "AU7-007-002", name: "Riya Das", email: "riya@attendify.com", attendance: 88 },
  { id: 3, roll: "AU7-007-003", name: "Aditya Roy", email: "aditya@attendify.com", attendance: 72 },
  { id: 4, roll: "AU7-007-004", name: "Sneha Paul", email: "sneha@attendify.com", attendance: 81 },
  { id: 5, roll: "AU7-007-005", name: "Rahul Sen", email: "rahul@attendify.com", attendance: 69 },
  { id: 6, roll: "AU7-007-006", name: "Ananya Roy", email: "ananya@attendify.com", attendance: 95 },
  { id: 7, roll: "AU7-007-007", name: "Soham Das", email: "soham@attendify.com", attendance: 84 },
  { id: 8, roll: "AU7-007-008", name: "Priya Sharma", email: "priya@attendify.com", attendance: 76 },
];

const initialRecords = students.map((s, i) => ({ studentId: s.id, status: i === 2 || i === 4 ? "Absent" : "Present" }));

export default function CRPage() {
  const [activeTab, setActiveTab] = useState<"today" | "attendance" | "timetable">("today");
  const [timetable, setTimetable] = useState<TimetableEntry[]>([]);
  const [records, setRecords] = useState(initialRecords);
  const [selectedDay, setSelectedDay] = useState("Monday");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const dayName = days[new Date().getDay() - 1] || "Monday";
    setSelectedDay(dayName);
  }, []);

  useEffect(() => {
    fetch("/api/timetable?section=CSE-III-E")
      .then(r => r.json())
      .then(d => {
        if (d.success) setTimetable(d.data);
        else setError(d.error || "Failed to load timetable");
        setLoading(false);
      })
      .catch(() => { setError("Network error — could not reach the server."); setLoading(false); });
  }, []);

  const todaySchedule = timetable.filter(t => t.day === selectedDay).sort((a, b) => a.period - b.period);
  const now = new Date();
  const currentHour = now.getHours();
  const currentMin = now.getMinutes();
  const currentPeriod = todaySchedule.find(t => {
    if (!t.startTime || !t.endTime) return false;
    const [sh, sm] = t.startTime.split(":").map(Number);
    const [eh, em] = t.endTime.split(":").map(Number);
    return (currentHour > sh || (currentHour === sh && currentMin >= sm)) &&
           (currentHour < eh || (currentHour === eh && currentMin < em));
  });

  const present = records.filter(r => r.status === "Present").length;
  const total = records.length;
  const absent = total - present;
  const pct = total ? Math.round((present / total) * 100) : 0;

  const setStatus = (id: number, status: string) => {
    setRecords(records.map(r => r.studentId === id ? { ...r, status } : r));
  };

  return (
    <AppShell>
      <Navbar title="CR Dashboard" />
      <section className="content">
        <div className="page-header">
          <div><h1>CR Dashboard</h1><p>Manage attendance for B.TECH CSE III E (Section AU7-007)</p></div>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon stat-icon-blue"><Users size={20} /></div>
            <div className="stat-header">Total Students</div>
            <div className="stat-value">{total}</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon stat-icon-green"><UserCheck size={20} /></div>
            <div className="stat-header">Present Today</div>
            <div className="stat-value">{present}</div>
            <div className="stat-change success">+{present} from roll</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon stat-icon-red"><UserX size={20} /></div>
            <div className="stat-header">Absent Today</div>
            <div className="stat-value">{absent}</div>
            <div className="stat-change danger">{absent > 0 ? `${Math.round((absent/total)*100)}% absent` : "All present"}</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon stat-icon-cyan"><TrendingUp size={20} /></div>
            <div className="stat-header">Attendance</div>
            <div className="stat-value">{pct}%</div>
          </div>
        </div>

        <div className="tab-buttons">
          <button className={`btn ${activeTab === "today" ? "btn-primary" : "btn-secondary"}`} onClick={() => setActiveTab("today")}>Today&apos;s Schedule</button>
          <button className={`btn ${activeTab === "attendance" ? "btn-primary" : "btn-secondary"}`} onClick={() => setActiveTab("attendance")}>Mark Attendance</button>
          <button className={`btn ${activeTab === "timetable" ? "btn-primary" : "btn-secondary"}`} onClick={() => setActiveTab("timetable")}>Full Timetable</button>
        </div>

        {activeTab === "today" && (
          <div className="card">
            <div className="card-title" style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
              {selectedDay}&apos;s Schedule
              <select className="form-control" style={{ width: "auto", display: "inline-block", padding: "4px 8px", fontSize: 13 }} value={selectedDay} onChange={e => setSelectedDay(e.target.value)}>
                {days.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            {loading ? (
              <p style={{ color: "var(--text-muted)", padding: 20 }}>Loading schedule...</p>
            ) : error ? (
              <div style={{ padding: 20, textAlign: "center" }}>
                <p style={{ color: "var(--danger)", marginBottom: 12 }}>{error}</p>
                <button className="btn btn-primary" onClick={() => window.location.reload()}><RefreshCw size={16} /> Retry</button>
              </div>
            ) : todaySchedule.length === 0 ? (
              <p style={{ color: "var(--text-muted)", padding: 20 }}>No classes scheduled for {selectedDay}.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {todaySchedule.map((entry, i) => {
                  const isCurrent = currentPeriod && entry.period === currentPeriod.period;
                  return (
                    <div key={i} className={`schedule-item ${isCurrent ? "schedule-item-active" : ""}`}>
                      <div style={{ minWidth: 80, textAlign: "center" }}>
                        <div style={{ fontWeight: 700, color: "var(--primary)", fontSize: 13 }}>Period {entry.period}</div>
                        <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{entry.startTime} - {entry.endTime}</div>
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, color: "var(--text)" }}>{entry.subject}</div>
                        <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{entry.subjectCode}</div>
                        {entry.faculty && <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{entry.faculty}</div>}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                        <span className={`badge ${entry.type === "lab" ? "badge-primary" : entry.type === "library" ? "badge-success" : entry.type === "activity" ? "badge-warning" : "badge-present"}`}>
                          {entry.type === "lab" ? "Lab" : entry.type === "library" ? "Library" : entry.type === "activity" ? "Activity" : "Lecture"}
                        </span>
                        {entry.location && <span style={{ fontSize: 11, color: "var(--success)" }}>{entry.location}</span>}
                        {isCurrent && <span className="badge badge-primary">NOW</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === "attendance" && (
          <div className="card">
            <div className="card-title">Mark Attendance — {selectedDay}</div>
            <div className="table-container">
              <table>
                <thead><tr><th>Roll No</th><th>Student</th><th>Attendance %</th><th>Status</th></tr></thead>
                <tbody>
                  {students.map(s => {
                    const rec = records.find(r => r.studentId === s.id);
                    return (
                      <tr key={s.id}>
                        <td>{s.roll}</td>
                        <td><strong>{s.name}</strong></td>
                        <td>{s.attendance}%</td>
                        <td>
                          <div className="attendance-buttons">
                            <button className={`attendance-btn present ${rec?.status === "Present" ? "selected" : ""}`} onClick={() => setStatus(s.id, "Present")}>Present</button>
                            <button className={`attendance-btn absent ${rec?.status === "Absent" ? "selected" : ""}`} onClick={() => setStatus(s.id, "Absent")}>Absent</button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div style={{ marginTop: 16, display: "flex", gap: 12, alignItems: "center" }}>
              <div className="stats-grid" style={{ flex: 1, marginBottom: 0 }}>
                <div className="stat-card"><div className="stat-header">Total</div><div className="stat-value">{total}</div></div>
                <div className="stat-card"><div className="stat-header">Present</div><div className="stat-value">{present}</div></div>
                <div className="stat-card"><div className="stat-header">Absent</div><div className="stat-value">{absent}</div></div>
                <div className="stat-card"><div className="stat-header">Percentage</div><div className="stat-value">{pct}%</div></div>
              </div>
            </div>
            <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => alert("Attendance saved successfully!")}>Save Attendance</button>
          </div>
        )}

        {activeTab === "timetable" && (
          <div className="card">
            <div className="card-title">B.TECH CSE III E — Full Timetable</div>
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
                    {["1\n9:30", "2\n10:30", "3\n11:30", "4\n12:30", "5\n13:30", "6\n14:30", "7\n15:30", "8\n16:30"].map((p, i) => (
                      <th key={i} style={{ whiteSpace: "pre-line", textAlign: "center", fontSize: 11 }}>{p}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {days.map(day => (
                    <tr key={day}>
                      <td><strong>{day}</strong></td>
                      {Array.from({ length: 8 }, (_, i) => {
                        const entry = timetable.find(t => t.day === day && t.period === i + 1);
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
      </section>
    </AppShell>
  );
}
