"use client";

import { useState, useEffect } from "react";
import AppShell from "@/components/AppShell";
import Navbar from "@/components/Navbar";
import { RefreshCw, Search, Calendar, BookOpen } from "lucide-react";

interface AttendanceRecord {
  _id: string;
  date: string;
  status: string;
  note: string;
  student: { _id: string; name: string; rollNumber: string } | null;
  subject: { _id: string; name: string; code: string } | null;
  markedBy: { _id: string; name: string } | null;
}

interface SubjectOption {
  _id: string;
  code: string;
  name: string;
}

export default function HistoryPage() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [subjects, setSubjects] = useState<SubjectOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const fetchHistory = async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      params.set("limit", "200");
      if (subjectFilter) params.set("subject", subjectFilter);
      if (dateFrom) params.set("from", dateFrom);
      if (dateTo) params.set("to", dateTo);
      const res = await fetch(`/api/attendance?${params}`, { credentials: "include" });
      const data = await res.json();
      if (data.success) setRecords(data.data.items || []);
      else setError(data.error || "Failed to load history");
    } catch {
      setError("Network error.");
    } finally {
      setLoading(false);
    }
  };

  const fetchSubjects = async () => {
    try {
      const res = await fetch("/api/subjects?limit=200", { credentials: "include" });
      const data = await res.json();
      if (data.success) setSubjects(data.data.items || []);
    } catch {}
  };

  useEffect(() => {
    fetchHistory();
    fetchSubjects();
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [subjectFilter, dateFrom, dateTo]);

  const filtered = records.filter((r) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      r.student?.name?.toLowerCase().includes(q) ||
      r.student?.rollNumber?.toLowerCase().includes(q) ||
      r.subject?.name?.toLowerCase().includes(q) ||
      r.subject?.code?.toLowerCase().includes(q)
    );
  });

  return (
    <AppShell>
      <Navbar title="Attendance History" />
      <div className="page-content">
        <div className="page-header">
          <div>
            <h1 className="page-header-title">Attendance Archives</h1>
            <p className="page-header-subtitle">
              Inspect past attendance records, timestamps, and session markers.
            </p>
          </div>
          <div className="page-header-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={fetchHistory}
              disabled={loading}
            >
              <RefreshCw size={15} className={loading ? "spin" : ""} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="card" style={{ marginBottom: 20 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: 12,
            }}
          >
            <div>
              <label className="form-label" style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <Calendar size={13} style={{ color: "var(--accent)" }} />
                <span>From Date</span>
              </label>
              <input
                type="date"
                className="form-input"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </div>

            <div>
              <label className="form-label" style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <Calendar size={13} style={{ color: "var(--accent)" }} />
                <span>To Date</span>
              </label>
              <input
                type="date"
                className="form-input"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>

            <div>
              <label className="form-label" style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <BookOpen size={13} style={{ color: "var(--accent)" }} />
                <span>Subject</span>
              </label>
              <select
                className="form-select"
                value={subjectFilter}
                onChange={(e) => setSubjectFilter(e.target.value)}
              >
                <option value="">All Subjects</option>
                {subjects.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name} ({s.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="form-label" style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <Search size={13} style={{ color: "var(--accent)" }} />
                <span>Search</span>
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="Student or course..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Records Table */}
        <div className="card">
          <div className="table-container">
            {loading ? (
              <div style={{ padding: 40, textAlign: "center", color: "var(--text-muted)" }}>
                Loading session archives...
              </div>
            ) : filtered.length === 0 ? (
              <div style={{ padding: 40, textAlign: "center", color: "var(--text-muted)" }}>
                No attendance logs found for the selected timeframe.
              </div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th style={{ width: 120 }}>Date</th>
                    <th>Student Name</th>
                    <th>Roll No</th>
                    <th>Course</th>
                    <th>Recorded By</th>
                    <th style={{ textAlign: "right", width: 120 }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r) => {
                    const isPresent = r.status === "PRESENT";
                    return (
                      <tr key={r._id}>
                        <td style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>
                          {r.date ? r.date.split("T")[0] : "—"}
                        </td>
                        <td style={{ fontWeight: 600 }}>{r.student?.name || "—"}</td>
                        <td>
                          <span className="badge badge-accent">{r.student?.rollNumber || "—"}</span>
                        </td>
                        <td>
                          <span style={{ fontWeight: 500 }}>{r.subject?.name || "—"}</span>
                          {r.subject?.code && (
                            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginLeft: 6 }}>
                              ({r.subject.code})
                            </span>
                          )}
                        </td>
                        <td style={{ color: "var(--text-muted)", fontSize: "0.82rem" }}>
                          {r.markedBy?.name || "CR"}
                        </td>
                        <td style={{ textAlign: "right" }}>
                          <span className={`badge ${isPresent ? "badge-present" : "badge-absent"}`}>
                            {r.status}
                          </span>
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
