"use client";

import { useState, useEffect } from "react";
import AppShell from "@/components/AppShell";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import {
  CheckCheck,
  RefreshCw,
  Search,
  Calendar,
  BookOpen,
  Clock,
  Save,
  CheckCircle2,
  XCircle,
  Users,
} from "lucide-react";

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
  const { success, error: toastError } = useToast();
  const role = user?.role?.toUpperCase() || "CR";
  const canEdit = role === "CR" || role === "ADMIN";

  const [students, setStudents] = useState<Student[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [timetable, setTimetable] = useState<TimetableEntry[]>([]);
  const [records, setRecords] = useState<Record<string, "PRESENT" | "ABSENT">>({});
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("");
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const dayName = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ][new Date().getDay()];

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
      if (subjectsData.success) {
        const subs = subjectsData.data.items || [];
        setSubjects(subs);
        if (subs.length > 0 && !selectedSubject) {
          setSelectedSubject(subs[0]._id);
        }
      }
      if (timetableData.success) setTimetable(timetableData.data || []);
    } catch {
      setError("Failed to load attendance roster.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filtered = students.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.rollNumber.toLowerCase().includes(search.toLowerCase())
  );

  const present = Object.values(records).filter((r) => r === "PRESENT").length;
  const total = students.length;
  const markedCount = Object.keys(records).length;
  const absent = total - present;
  const pct = total ? Math.round((present / total) * 100) : 0;

  const setStatus = (id: string, status: "PRESENT" | "ABSENT") => {
    if (!canEdit) return;
    setRecords((prev) => ({
      ...prev,
      [id]: prev[id] === status ? ("" as any) : status,
    }));
  };

  const markAll = (status: "PRESENT" | "ABSENT") => {
    if (!canEdit) return;
    const all: Record<string, "PRESENT" | "ABSENT"> = {};
    students.forEach((s) => {
      all[s._id] = status;
    });
    setRecords(all);
  };

  const saveAttendance = async () => {
    if (!canEdit) {
      toastError("You do not have permission to mark attendance.");
      return;
    }
    if (!selectedSubject) {
      toastError("Please select a subject from the dropdown.");
      return;
    }
    setSaving(true);
    try {
      const bulkRecords = students
        .filter((s) => records[s._id])
        .map((s) => ({ student: s._id, status: records[s._id] }));

      if (bulkRecords.length === 0) {
        toastError("No attendance has been marked yet.");
        setSaving(false);
        return;
      }

      const res = await fetch("/api/attendance/bulk", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: selectedSubject,
          date: selectedDate,
          records: bulkRecords,
        }),
      });
      const data = await res.json();
      if (data.success) {
        success(`Successfully saved attendance for ${bulkRecords.length} students!`);
        setRecords({});
      } else {
        toastError(data.error || "Failed to save attendance.");
      }
    } catch {
      toastError("Network error while saving attendance.");
    } finally {
      setSaving(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <AppShell>
      <Navbar title="Mark Attendance" />
      <div className="page-content">
        {/* Page Header */}
        <div className="page-header">
          <div>
            <h1 className="page-header-title">Classroom Attendance</h1>
            <p className="page-header-subtitle">
              Record period attendance for B.Tech CSE Semester III (Section E).
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
            <button
              type="button"
              className="btn btn-primary"
              disabled={saving || markedCount === 0 || !canEdit}
              onClick={saveAttendance}
            >
              <Save size={15} />
              <span>{saving ? "Saving..." : "Save Attendance"}</span>
            </button>
          </div>
        </div>

        {/* Filters Card: Date, Subject, Period */}
        <div className="card" style={{ marginBottom: 20 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 16,
            }}
          >
            <div>
              <label className="form-label" style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <Calendar size={14} style={{ color: "var(--accent)" }} />
                <span>Date</span>
              </label>
              <input
                type="date"
                className="form-input"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>

            <div>
              <label className="form-label" style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <BookOpen size={14} style={{ color: "var(--accent)" }} />
                <span>Subject</span>
              </label>
              <select
                className="form-select"
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
              >
                <option value="">Select Subject</option>
                {subjects.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name} ({s.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="form-label" style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <Clock size={14} style={{ color: "var(--accent)" }} />
                <span>Period (Optional)</span>
              </label>
              <select
                className="form-select"
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
              >
                <option value="">Select Period</option>
                {timetable.map((t) => (
                  <option key={t.period} value={t.period}>
                    Period {t.period}: {t.startTime} – {t.endTime} ({t.subject})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Attendance Summary Strip */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 16,
            padding: "16px 20px",
            borderRadius: "var(--radius-lg)",
            backgroundColor: "var(--bg-surface)",
            border: "1px solid var(--border)",
            marginBottom: 20,
            boxShadow: "var(--shadow-xs)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Users size={16} style={{ color: "var(--text-muted)" }} />
              <span style={{ fontSize: "0.88rem", color: "var(--text-secondary)" }}>
                Total: <strong>{total}</strong>
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <CheckCircle2 size={16} style={{ color: "var(--status-present)" }} />
              <span style={{ fontSize: "0.88rem", color: "var(--status-present)" }}>
                Present: <strong>{present}</strong>
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <XCircle size={16} style={{ color: "var(--status-absent)" }} />
              <span style={{ fontSize: "0.88rem", color: "var(--status-absent)" }}>
                Absent: <strong>{absent}</strong>
              </span>
            </div>
            <span className="badge badge-accent">
              Attendance: {pct}%
            </span>
          </div>

          {/* Quick Bulk Actions */}
          {canEdit && (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => markAll("PRESENT")}
              >
                <CheckCheck size={14} style={{ color: "var(--status-present)" }} />
                <span>Mark All Present</span>
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => markAll("ABSENT")}
              >
                <span>Mark All Absent</span>
              </button>
              <button
                type="button"
                className="btn btn-subtle btn-sm"
                onClick={() => setRecords({})}
              >
                <span>Clear</span>
              </button>
            </div>
          )}
        </div>

        {/* Search Bar + Student Table */}
        <div className="card">
          <div className="card-header">
            <div className="search-input-wrap">
              <Search size={15} className="search-icon" />
              <input
                type="text"
                className="search-input"
                placeholder="Search by student name or roll number..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <span style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
              Showing {filtered.length} of {students.length} students
            </span>
          </div>

          <div className="table-container">
            {loading ? (
              <div style={{ padding: 40, textAlign: "center", color: "var(--text-muted)" }}>
                Loading students roster...
              </div>
            ) : filtered.length === 0 ? (
              <div style={{ padding: 40, textAlign: "center", color: "var(--text-muted)" }}>
                No students match your search criteria.
              </div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th style={{ width: 120 }}>Roll No</th>
                    <th>Student Name</th>
                    <th>Section</th>
                    <th style={{ textAlign: "right", width: 220 }}>Attendance Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((s) => {
                    const status = records[s._id];
                    return (
                      <tr key={s._id}>
                        <td>
                          <span className="badge badge-accent" style={{ fontWeight: 600 }}>
                            {s.rollNumber}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <div className="avatar" style={{ width: 28, height: 28, fontSize: "0.72rem" }}>
                              {getInitials(s.name)}
                            </div>
                            <span style={{ fontWeight: 600 }}>{s.name}</span>
                          </div>
                        </td>
                        <td>
                          <span style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>
                            CSE • Sec E
                          </span>
                        </td>
                        <td style={{ textAlign: "right" }}>
                          {canEdit ? (
                            <div className="attendance-toggle-group">
                              <button
                                type="button"
                                className={`attendance-toggle-btn ${
                                  status === "PRESENT" ? "active-present" : ""
                                }`}
                                onClick={() => setStatus(s._id, "PRESENT")}
                              >
                                Present
                              </button>
                              <button
                                type="button"
                                className={`attendance-toggle-btn ${
                                  status === "ABSENT" ? "active-absent" : ""
                                }`}
                                onClick={() => setStatus(s._id, "ABSENT")}
                              >
                                Absent
                              </button>
                            </div>
                          ) : (
                            <span
                              className={`badge ${
                                status === "PRESENT"
                                  ? "badge-present"
                                  : status === "ABSENT"
                                  ? "badge-absent"
                                  : "badge-lime"
                              }`}
                            >
                              {status || "Not Marked"}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
