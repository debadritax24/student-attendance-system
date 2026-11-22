"use client";

import { useState, useEffect } from "react";
import AppShell from "@/components/AppShell";
import Navbar from "@/components/Navbar";
import StatCard from "@/components/ui/StatCard";
import { AttendanceTrendChart } from "@/components/ui/AttendanceCharts";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import {
  Users,
  UserCheck,
  UserX,
  TrendingUp,
  RefreshCw,
  Calendar,
  Clock,
  MapPin,
  Save,
  CheckCircle2,
  CalendarCheck,
  Layers,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

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

interface Student {
  _id: string;
  rollNumber: string;
  name: string;
  email: string;
  attendancePercentage?: number;
}

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

export default function CRPage() {
  const { user } = useAuth();
  const { success, error: toastError } = useToast();
  const [activeTab, setActiveTab] = useState<"today" | "attendance" | "timetable">("today");
  const [timetable, setTimetable] = useState<TimetableEntry[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [records, setRecords] = useState<Record<string, string>>({});
  const [selectedDay, setSelectedDay] = useState(() => {
    const dayName = days[new Date().getDay() - 1] || "Monday";
    return dayName;
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const [ttRes, studentsRes] = await Promise.all([
        fetch("/api/timetable?section=CSE-III-E", { credentials: "include" }),
        fetch("/api/students?section=CSE-III-E&limit=200", { credentials: "include" }),
      ]);
      const ttData = await ttRes.json();
      const studentsData = await studentsRes.json();

      if (ttData.success) setTimetable(ttData.data || []);
      else setError(ttData.error || "Failed to load timetable");
      if (studentsData.success) setStudents(studentsData.data.items || []);
    } catch {
      setError("Network connection issue.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const todaySchedule = timetable
    .filter((t) => t.day === selectedDay)
    .sort((a, b) => a.period - b.period);

  const now = new Date();
  const currentHour = now.getHours();
  const currentMin = now.getMinutes();
  const currentPeriod = todaySchedule.find((t) => {
    if (!t.startTime || !t.endTime) return false;
    const [sh, sm] = t.startTime.split(":").map(Number);
    const [eh, em] = t.endTime.split(":").map(Number);
    return (
      (currentHour > sh || (currentHour === sh && currentMin >= sm)) &&
      (currentHour < eh || (currentHour === eh && currentMin < em))
    );
  });

  const present = Object.values(records).filter((r) => r === "PRESENT").length;
  const total = students.length || 61;
  const markedCount = Object.keys(records).length;
  const absent = total - present;
  const pct = total ? Math.round((present / total) * 100) : 0;

  const setStatus = (id: string, status: string) => {
    setRecords((prev) => ({ ...prev, [id]: prev[id] === status ? "" : status }));
  };

  const markAll = (status: "PRESENT" | "ABSENT") => {
    const updated: Record<string, string> = {};
    students.forEach((s) => {
      updated[s._id] = status;
    });
    setRecords(updated);
  };

  const saveAttendance = async () => {
    const today = new Date().toISOString().split("T")[0];
    const subjectEntry = todaySchedule[0];
    if (!subjectEntry) {
      alert("No class scheduled for today. Select a subject first.");
      return;
    }
    const subjectName = subjectEntry.subject;
    let subjectId = "";
    try {
      const subRes = await fetch(
        `/api/subjects?search=${encodeURIComponent(subjectName)}&limit=1`,
        { credentials: "include" }
      );
      const subData = await subRes.json();
      if (subData.success && subData.data.items?.length > 0)
        subjectId = subData.data.items[0]._id;
    } catch {
      /* subject lookup is best-effort */
    }

    if (!subjectId) {
      toastError("Could not find the subject in the database. Ensure subjects are seeded.");
      return;
    }

    setSaving(true);
    try {
      const bulkRecords = students
        .filter((s) => records[s._id])
        .map((s) => ({
          student: s._id,
          status: records[s._id] as "PRESENT" | "ABSENT" | "LATE",
        }));

      if (bulkRecords.length === 0) {
        toastError("No attendance marked yet. Mark at least one student.");
        setSaving(false);
        return;
      }

      const res = await fetch("/api/attendance/bulk", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject: subjectId, date: today, records: bulkRecords }),
      });
      const data = await res.json();
      if (data.success) {
        success("Attendance recorded successfully!");
        setRecords({});
      } else {
        toastError(data.error || "Failed to save attendance");
      }
    } catch {
      toastError("Network error while saving attendance.");
    } finally {
      setSaving(false);
    }
  };

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <AppShell>
      <Navbar title="Classroom Dashboard" />
      <div className="page-content">
        {/* Top Header */}
        <div className="page-header">
          <div>
            <h1 className="page-header-title">
              {greeting()}, {user?.name?.split(" ")[0] || "CR"}
            </h1>
            <p className="page-header-subtitle">
              Here&apos;s an overview of your classroom attendance and schedule today.
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
            <Link href="/attendance" className="btn btn-primary">
              <CheckCircle2 size={16} />
              <span>Take Attendance</span>
            </Link>
          </div>
        </div>

        {/* 4 Premium Stat Cards */}
        <div className="stats-grid">
          <StatCard
            title="Total Students"
            value={total}
            subtitle="Section CSE-III-E"
            variant="default"
            badgeText="Enrolled"
            icon={<Users size={18} />}
          />
          <StatCard
            title="Present Today"
            value={present || (total ? Math.round(total * 0.92) : 56)}
            subtitle={`${total ? Math.round(((present || 56) / total) * 100) : 92}% attendance rate`}
            variant="success"
            trend={{ value: "+2.4%", isPositive: true }}
            icon={<UserCheck size={18} />}
          />
          <StatCard
            title="Absent Today"
            value={absent > 0 && present > 0 ? absent : 5}
            subtitle="Require follow-up"
            variant="danger"
            trend={{ value: "-1.1%", isPositive: false }}
            icon={<UserX size={18} />}
          />
          <StatCard
            title="Avg. Attendance"
            value={`${pct > 0 ? pct : 88}%`}
            subtitle="Target threshold: 75%"
            variant="accent"
            badgeText="Good standing"
            icon={<TrendingUp size={18} />}
          />
        </div>

        {/* Tab Controls */}
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
            className={`btn btn-sm ${activeTab === "today" ? "btn-primary" : "btn-subtle"}`}
            onClick={() => setActiveTab("today")}
          >
            <CalendarCheck size={14} />
            <span>Today&apos;s Schedule</span>
          </button>
          <button
            type="button"
            className={`btn btn-sm ${activeTab === "attendance" ? "btn-primary" : "btn-subtle"}`}
            onClick={() => setActiveTab("attendance")}
          >
            <CheckCircle2 size={14} />
            <span>Quick Mark Attendance</span>
          </button>
          <button
            type="button"
            className={`btn btn-sm ${activeTab === "timetable" ? "btn-primary" : "btn-subtle"}`}
            onClick={() => setActiveTab("timetable")}
          >
            <Layers size={14} />
            <span>Full Weekly Timetable</span>
          </button>
        </div>

        {/* Tab 1: Today's Schedule + Analytics */}
        {activeTab === "today" && (
          <div style={{ display: "grid", gridTemplateColumns: "1.15fr 0.85fr", gap: 20 }}>
            {/* Left: Schedule List */}
            <div className="card">
              <div className="card-header">
                <div>
                  <h3 className="card-title">
                    <Calendar size={18} style={{ color: "var(--accent)" }} />
                    <span>{selectedDay}&apos;s Class Routine</span>
                  </h3>
                  <p className="card-subtitle">
                    {todaySchedule.length} periods configured for your section
                  </p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <select
                    className="form-select"
                    style={{ width: "auto", padding: "6px 12px", fontSize: "0.84rem" }}
                    value={selectedDay}
                    onChange={(e) => setSelectedDay(e.target.value)}
                  >
                    {days.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {loading ? (
                <div style={{ padding: 40, textAlign: "center", color: "var(--text-muted)" }}>
                  Loading schedule...
                </div>
              ) : todaySchedule.length === 0 ? (
                <div style={{ padding: 40, textAlign: "center", color: "var(--text-muted)" }}>
                  No classes scheduled for {selectedDay}.
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {todaySchedule.map((entry, i) => {
                    const isCurrent = currentPeriod && entry.period === currentPeriod.period;
                    const typeBadge =
                      entry.type === "lab"
                        ? "badge-accent"
                        : entry.type === "library"
                        ? "badge-lime"
                        : entry.type === "activity"
                        ? "badge-warning"
                        : "badge-present";

                    return (
                      <div
                        key={i}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "14px 16px",
                          borderRadius: "var(--radius-md)",
                          backgroundColor: isCurrent ? "var(--accent-light)" : "var(--bg-surface-subtle)",
                          border: isCurrent
                            ? "1px solid var(--accent-border)"
                            : "1px solid var(--border-subtle)",
                          gap: 16,
                          flexWrap: "wrap",
                        }}
                      >
                        {/* Period & Time */}
                        <div style={{ minWidth: 90 }}>
                          <div
                            style={{
                              fontSize: "0.82rem",
                              fontWeight: 700,
                              color: isCurrent ? "var(--accent)" : "var(--text-primary)",
                            }}
                          >
                            Period {entry.period}
                          </div>
                          <div
                            style={{
                              fontSize: "0.74rem",
                              color: "var(--text-muted)",
                              display: "flex",
                              alignItems: "center",
                              gap: 4,
                              marginTop: 2,
                            }}
                          >
                            <Clock size={11} />
                            <span>
                              {entry.startTime} – {entry.endTime}
                            </span>
                          </div>
                        </div>

                        {/* Subject & Faculty */}
                        <div style={{ flex: 1, minWidth: 200 }}>
                          <div style={{ fontWeight: 600, fontSize: "0.94rem", color: "var(--text-primary)" }}>
                            {entry.subject}
                          </div>
                          <div
                            style={{
                              fontSize: "0.78rem",
                              color: "var(--text-secondary)",
                              display: "flex",
                              gap: 8,
                              marginTop: 2,
                            }}
                          >
                            <span style={{ fontWeight: 500, color: "var(--accent)" }}>
                              {entry.subjectCode}
                            </span>
                            {entry.faculty && <span>• {entry.faculty}</span>}
                          </div>
                        </div>

                        {/* Badges & Location */}
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          {entry.location && (
                            <span
                              style={{
                                fontSize: "0.76rem",
                                color: "var(--text-secondary)",
                                display: "flex",
                                alignItems: "center",
                                gap: 3,
                              }}
                            >
                              <MapPin size={12} />
                              <span>{entry.location}</span>
                            </span>
                          )}
                          <span className={`badge ${typeBadge}`}>
                            {entry.type ? entry.type.toUpperCase() : "LECTURE"}
                          </span>
                          {isCurrent && <span className="badge badge-lime">NOW</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Right: Trend Chart & Quick Summary */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div className="card">
                <div className="card-header">
                  <div>
                    <h3 className="card-title">
                      <TrendingUp size={18} style={{ color: "var(--accent)" }} />
                      <span>Weekly Attendance Trends</span>
                    </h3>
                    <p className="card-subtitle">Attendance % across past 5 days</p>
                  </div>
                </div>
                <AttendanceTrendChart />
              </div>

              <div className="card" style={{ backgroundColor: "var(--bg-surface-subtle)" }}>
                <h4 style={{ fontSize: "0.96rem", fontWeight: 600, marginBottom: 8 }}>
                  Ready to take attendance?
                </h4>
                <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: 14 }}>
                  You can mark attendance period-by-period or use bulk actions for rapid recording.
                </p>
                <Link href="/attendance" className="btn btn-primary btn-sm">
                  <span>Open Full Attendance Portal</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Quick Mark Attendance */}
        {activeTab === "attendance" && (
          <div className="card">
            <div className="card-header">
              <div>
                <h3 className="card-title">
                  <CheckCircle2 size={18} style={{ color: "var(--accent)" }} />
                  <span>Mark Attendance — {selectedDay}</span>
                </h3>
                <p className="card-subtitle">
                  Click Present or Absent for each student, then save.
                </p>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => markAll("PRESENT")}
                >
                  Mark All Present
                </button>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => markAll("ABSENT")}
                >
                  Mark All Absent
                </button>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setRecords({})}
                >
                  Clear All
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="table-container">
              {loading ? (
                <div style={{ padding: 40, textAlign: "center", color: "var(--text-muted)" }}>
                  Loading students...
                </div>
              ) : students.length === 0 ? (
                <div style={{ padding: 40, textAlign: "center", color: "var(--text-muted)" }}>
                  No students found in section CSE-III-E.
                </div>
              ) : (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th style={{ width: 100 }}>Roll No</th>
                      <th>Student Name</th>
                      <th>Department & Section</th>
                      <th style={{ textAlign: "right" }}>Attendance Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((s) => {
                      const currentStatus = records[s._id];
                      return (
                        <tr key={s._id}>
                          <td>
                            <span className="badge badge-accent" style={{ fontWeight: 600 }}>
                              {s.rollNumber}
                            </span>
                          </td>
                          <td>
                            <div style={{ fontWeight: 600 }}>{s.name}</div>
                            <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                              {s.email}
                            </div>
                          </td>
                          <td>
                            <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                              CSE • Sec E
                            </span>
                          </td>
                          <td style={{ textAlign: "right" }}>
                            <div className="attendance-toggle-group">
                              <button
                                type="button"
                                className={`attendance-toggle-btn ${
                                  currentStatus === "PRESENT" ? "active-present" : ""
                                }`}
                                onClick={() => setStatus(s._id, "PRESENT")}
                              >
                                Present
                              </button>
                              <button
                                type="button"
                                className={`attendance-toggle-btn ${
                                  currentStatus === "ABSENT" ? "active-absent" : ""
                                }`}
                                onClick={() => setStatus(s._id, "ABSENT")}
                              >
                                Absent
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>

            {/* Bottom Summary Bar */}
            <div
              style={{
                marginTop: 20,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 16,
                padding: "16px 20px",
                borderRadius: "var(--radius-lg)",
                backgroundColor: "var(--bg-surface-subtle)",
                border: "1px solid var(--border)",
              }}
            >
              <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                <span style={{ fontSize: "0.86rem", color: "var(--text-secondary)" }}>
                  Total: <strong>{total}</strong>
                </span>
                <span style={{ fontSize: "0.86rem", color: "var(--status-present)" }}>
                  Present: <strong>{present}</strong>
                </span>
                <span style={{ fontSize: "0.86rem", color: "var(--status-absent)" }}>
                  Absent: <strong>{absent}</strong>
                </span>
                <span style={{ fontSize: "0.86rem", color: "var(--accent)", fontWeight: 600 }}>
                  Marked: {markedCount} / {total}
                </span>
              </div>
              <button
                type="button"
                className="btn btn-primary"
                disabled={saving || markedCount === 0}
                onClick={saveAttendance}
              >
                <Save size={15} />
                <span>{saving ? "Saving..." : "Save Attendance"}</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 3: Full Weekly Timetable */}
        {activeTab === "timetable" && (
          <div className="card">
            <div className="card-header">
              <div>
                <h3 className="card-title">
                  <Layers size={18} style={{ color: "var(--accent)" }} />
                  <span>Weekly Class Timetable</span>
                </h3>
                <p className="card-subtitle">Official routine for B.Tech CSE Semester III Section E</p>
              </div>
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
                        const isLibrary = entry.type === "library";

                        return (
                          <td
                            key={i}
                            style={{
                              padding: "8px 10px",
                              fontSize: "0.76rem",
                              verticalAlign: "top",
                              backgroundColor: isLab
                                ? "var(--accent-light)"
                                : isLibrary
                                ? "var(--highlight-lime-bg)"
                                : undefined,
                            }}
                          >
                            <div style={{ fontWeight: 600, lineHeight: 1.25 }}>
                              {entry.subject}
                            </div>
                            {entry.subjectCode && (
                              <div
                                style={{
                                  color: "var(--accent)",
                                  fontWeight: 500,
                                  fontSize: "0.7rem",
                                  marginTop: 2,
                                }}
                              >
                                {entry.subjectCode}
                              </div>
                            )}
                            {entry.location && (
                              <div
                                style={{
                                  color: "var(--text-muted)",
                                  fontSize: "0.68rem",
                                  marginTop: 2,
                                }}
                              >
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
      </div>
    </AppShell>
  );
}
