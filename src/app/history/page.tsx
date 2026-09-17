"use client";

import { useState, useEffect } from "react";
import AppShell from "@/components/AppShell";
import Navbar from "@/components/Navbar";
import { Clock, RefreshCw } from "lucide-react";

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

  useEffect(() => { fetchHistory(); fetchSubjects(); }, []);
  useEffect(() => { fetchHistory(); }, [subjectFilter, dateFrom, dateTo]);

  const filtered = records.filter(r => {
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
      <section className="content">
        <div className="page-header">
          <div><h1>Attendance History</h1><p>View previously recorded attendance.</p></div>
          <button className="btn btn-secondary" onClick={fetchHistory} disabled={loading}><RefreshCw size={16} className={loading ? "spin" : ""} /> Refresh</button>
        </div>

        <div className="card">
          <div className="filters">
            <div><label>From</label><input type="date" className="form-control" value={dateFrom} onChange={e => setDateFrom(e.target.value)} /></div>
            <div><label>To</label><input type="date" className="form-control" value={dateTo} onChange={e => setDateTo(e.target.value)} /></div>
            <div><label>Subject</label>
              <select className="form-control" value={subjectFilter} onChange={e => setSubjectFilter(e.target.value)}>
                <option value="">All Subjects</option>
                {subjects.map(s => <option key={s._id} value={s._id}>{s.name} ({s.code})</option>)}
              </select>
            </div>
            <div className="search-box"><input type="text" placeholder="Search by student or subject..." value={search} onChange={e => setSearch(e.target.value)} /></div>
          </div>
        </div>

        <div className="card">
          <div className="table-container">
            {loading ? (
              <div style={{ padding: 40, textAlign: "center", color: "var(--text-muted)" }}>Loading history...</div>
            ) : error ? (
              <div style={{ padding: 40, textAlign: "center" }}>
                <p style={{ color: "var(--danger)", marginBottom: 12 }}>{error}</p>
                <button className="btn btn-primary" onClick={fetchHistory}><RefreshCw size={16} /> Retry</button>
              </div>
            ) : (
              <table>
                <thead><tr><th>Date</th><th>Subject</th><th>Student</th><th>Status</th><th>Marked By</th><th>Note</th></tr></thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr><td colSpan={6} style={{ textAlign: "center", padding: 40, color: "var(--text-muted)" }}>No records found.</td></tr>
                  ) : filtered.map(r => (
                    <tr key={r._id}>
                      <td>{new Date(r.date).toLocaleDateString("en-IN")}</td>
                      <td><strong>{r.subject?.name || "—"}</strong><br /><small style={{ color: "var(--text-muted)" }}>{r.subject?.code || ""}</small></td>
                      <td>{r.student?.name || "—"}<br /><small style={{ color: "var(--text-muted)" }}>{r.student?.rollNumber || ""}</small></td>
                      <td>
                        <span className={`badge ${r.status === "PRESENT" ? "badge-present" : r.status === "LATE" ? "badge-warning" : "badge-absent"}`}>
                          {r.status}
                        </span>
                      </td>
                      <td>{r.markedBy?.name || "—"}</td>
                      <td>{r.note || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </section>
    </AppShell>
  );
}
