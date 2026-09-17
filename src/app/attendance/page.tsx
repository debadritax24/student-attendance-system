"use client";

import { useState, useEffect } from "react";
import AppShell from "@/components/AppShell";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import { CheckCheck, RefreshCw } from "lucide-react";

interface Student {
  _id: string;
  rollNumber: string;
  name: string;
}

interface Subject {
  _id: string;
  code: string;
  name: string;
}

interface TimetableEntry {
  day: string;
  period: number;
  startTime: string;
  endTime: string;
  subject: string;
}

export default function AttendancePage() {
  const { user } = useAuth();
  const role = user?.role?.toUpperCase() || "CR";
  const canEdit = role === "CR" || role === "ADMIN";

  const [students, setStudents] = useState<Student[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [timetable, setTimetable] = useState<TimetableEntry[]>([]);
  const [records, setRecords] = useState<Record<string, "PRESENT" | "ABSENT">>({});
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const today = new Date().toISOString().split("T")[0];
  const dayName = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][new Date().getDay()];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const [studentsRes, subjectsRes, timetableRes] = await Promise.all([
          fetch("/api/students?limit=200", { credentials: "include" }),
          fetch("/api/subjects?limit=200", { credentials: "include" }),
          fetch(`/api/timetable?section=CSE-III-E&day=${dayName}`, { credentials: "include" }),
        ]);
        const studentsData = await studentsRes.json();
        const subjectsData = await subjectsRes.json();
        const timetableData = await timetableRes.json();

        if (studentsData.success) setStudents(studentsData.data.items || []);
        if (subjectsData.success) setSubjects(subjectsData.data.items || []);
        if (timetableData.success) setTimetable(timetableData.data || []);
      } catch {
        setError("Failed to load data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) || s.rollNumber.toLowerCase().includes(search.toLowerCase())
  );

  const present = Object.values(records).filter(r => r === "PRESENT").length;
  const total = students.length;
  const absent = total - present;
  const pct = total ? Math.round((present / total) * 100) : 0;

  const setStatus = (id: string, status: "PRESENT" | "ABSENT") => {
    setRecords(prev => ({ ...prev, [id]: prev[id] === status ? ("" as any) : status }));
  };

  const markAllPresent = () => {
    const all: Record<string, "PRESENT"> = {};
    students.forEach(s => { all[s._id] = "PRESENT"; });
    setRecords(all);
  };

  const saveAttendance = async () => {
    if (!selectedSubject) {
      alert("Please select a subject.");
      return;
    }
    setSaving(true);
    try {
      const bulkRecords = students
        .filter(s => records[s._id])
        .map(s => ({ student: s._id, status: records[s._id] }));

      if (bulkRecords.length === 0) {
        alert("No attendance marked yet.");
        setSaving(false);
        return;
      }

      const res = await fetch("/api/attendance/bulk", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject: selectedSubject, date: today, records: bulkRecords }),
      });
      const data = await res.json();
      if (data.success) {
        alert("Attendance saved successfully!");
        setRecords({});
      } else {
        alert(data.error || "Failed to save attendance");
      }
    } catch {
      alert("Network error.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppShell>
      <Navbar title="Mark Attendance" />
      <section className="content">
        <div className="page-header">
          <div><h1>Mark Attendance</h1><p>Record attendance for today&apos;s class.</p></div>
          <button className="btn btn-secondary" onClick={() => window.location.reload()} disabled={loading}><RefreshCw size={16} className={loading ? "spin" : ""} /> Refresh</button>
        </div>

        <div className="card">
          <div className="filters">
            <div><label>Date</label><input type="date" className="form-control" value={today} readOnly /></div>
            <div><label>Subject</label>
              <select className="form-control" value={selectedSubject} onChange={e => setSelectedSubject(e.target.value)}>
                <option value="">Select Subject</option>
                {subjects.map(s => <option key={s._id} value={s._id}>{s.name} ({s.code})</option>)}
              </select>
            </div>
            <div><label>Period</label>
              <select className="form-control" value={selectedPeriod} onChange={e => setSelectedPeriod(e.target.value)}>
                <option value="">Select Period</option>
                {timetable.map(t => <option key={t.period} value={t.period}>Period {t.period}: {t.startTime} - {t.endTime}</option>)}
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="card" style={{ padding: 40, textAlign: "center", color: "var(--text-muted)" }}>Loading students...</div>
        ) : error ? (
          <div className="card" style={{ padding: 40, textAlign: "center" }}>
            <p style={{ color: "var(--danger)", marginBottom: 12 }}>{error}</p>
            <button className="btn btn-primary" onClick={() => window.location.reload()}><RefreshCw size={16} /> Retry</button>
          </div>
        ) : (
          <div className="card">
            <div className="page-header">
              <div className="search-box"><input type="text" placeholder="Search student..." value={search} onChange={e => setSearch(e.target.value)} /></div>
              {canEdit && <button className="btn btn-secondary" onClick={markAllPresent}><CheckCheck size={16} /> Mark All Present</button>}
            </div>
            <div className="table-container">
              <table>
                <thead><tr><th>Roll No</th><th>Student</th><th>Status</th></tr></thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr><td colSpan={3} style={{ textAlign: "center", padding: 40, color: "var(--text-muted)" }}>No students found.</td></tr>
                  ) : filtered.map(s => (
                    <tr key={s._id}>
                      <td>{s.rollNumber}</td>
                      <td><strong>{s.name}</strong></td>
                      <td>
                        {canEdit ? (
                          <div className="attendance-buttons">
                            <button className={`attendance-btn present ${records[s._id] === "PRESENT" ? "selected" : ""}`} onClick={() => setStatus(s._id, "PRESENT")}>Present</button>
                            <button className={`attendance-btn absent ${records[s._id] === "ABSENT" ? "selected" : ""}`} onClick={() => setStatus(s._id, "ABSENT")}>Absent</button>
                          </div>
                        ) : (
                          <span className={`badge ${records[s._id] === "PRESENT" ? "badge-present" : "badge-warning"}`}>{records[s._id] || "Absent"}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="card">
          <div className="stats-grid">
            <div className="stat-card"><div className="stat-header">Total Students</div><div className="stat-value">{total}</div></div>
            <div className="stat-card"><div className="stat-header">Marked</div><div className="stat-value">{Object.keys(records).length}</div></div>
            <div className="stat-card"><div className="stat-header">Present</div><div className="stat-value">{present}</div></div>
            <div className="stat-card"><div className="stat-header">Absent</div><div className="stat-value">{total - present}</div></div>
          </div>
          {canEdit && (
            <button className="btn btn-primary" style={{ marginTop: 16 }} disabled={saving || Object.keys(records).length === 0} onClick={saveAttendance}>
              {saving ? "Saving..." : "Save Attendance"}
            </button>
          )}
        </div>
      </section>
    </AppShell>
  );
}
