"use client";

import { useState } from "react";
import AppShell from "@/components/AppShell";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";

const students = [
  { id: 1, roll: "AU001", name: "Aarav Sharma", attendance: 92 },
  { id: 2, roll: "AU002", name: "Riya Das", attendance: 88 },
  { id: 3, roll: "AU003", name: "Aditya Roy", attendance: 72 },
  { id: 4, roll: "AU004", name: "Sneha Paul", attendance: 81 },
  { id: 5, roll: "AU005", name: "Rahul Sen", attendance: 69 },
  { id: 6, roll: "AU006", name: "Ananya Roy", attendance: 95 },
  { id: 7, roll: "AU007", name: "Soham Das", attendance: 84 },
  { id: 8, roll: "AU008", name: "Priya Sharma", attendance: 76 },
];

const initial = students.map((s, i) => ({ studentId: s.id, status: i === 2 || i === 4 ? "Absent" : "Present" }));

export default function AttendancePage() {
  const { user } = useAuth();
  const [records, setRecords] = useState(initial);
  const [search, setSearch] = useState("");
  const role = user?.role?.toUpperCase() || "CR";
  const canEdit = role === "CR" || role === "ADMIN";

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) || s.roll.toLowerCase().includes(search.toLowerCase())
  );

  const present = records.filter(r => r.status === "Present").length;
  const total = records.length;
  const absent = total - present;
  const pct = total ? Math.round((present / total) * 100) : 0;

  const setStatus = (id: number, status: string) => {
    setRecords(records.map(r => r.studentId === id ? { ...r, status } : r));
  };

  const markAllPresent = () => {
    setRecords(records.map(r => ({ ...r, status: "Present" })));
  };

  return (
    <AppShell>
      <Navbar title="Mark Attendance" />
      <section className="content">
        <div className="page-header">
          <div><h1>Mark Attendance</h1><p>Record attendance for today&apos;s class.</p></div>
        </div>

        <div className="card">
          <div className="filters">
            <div><label>Date</label><input type="date" className="form-control" /></div>
            <div><label>Subject</label><select className="form-control"><option>Data Structures</option><option>Database Management</option><option>Operating Systems</option><option>Computer Networks</option></select></div>
            <div><label>Period</label><select className="form-control"><option>1st Period</option><option>2nd Period</option><option>3rd Period</option><option>4th Period</option></select></div>
          </div>
        </div>

        <div className="card">
          <div className="page-header">
            <div className="search-box"><input type="text" placeholder="Search student..." value={search} onChange={e => setSearch(e.target.value)} /></div>
            {canEdit && <button className="btn btn-secondary" onClick={markAllPresent}>✓ Mark All Present</button>}
          </div>
          <div className="table-container">
            <table>
              <thead><tr><th>Roll No</th><th>Student</th><th>Attendance</th><th>Status</th></tr></thead>
              <tbody>
                {filtered.map(s => {
                  const rec = records.find(r => r.studentId === s.id);
                  return (
                    <tr key={s.id}>
                      <td>{s.roll}</td>
                      <td><strong>{s.name}</strong></td>
                      <td>{s.attendance}%</td>
                      <td>
                        {canEdit ? (
                          <div className="attendance-buttons">
                            <button className={`attendance-btn present ${rec?.status === "Present" ? "selected" : ""}`} onClick={() => setStatus(s.id, "Present")}>Present</button>
                            <button className={`attendance-btn absent ${rec?.status === "Absent" ? "selected" : ""}`} onClick={() => setStatus(s.id, "Absent")}>Absent</button>
                          </div>
                        ) : (
                          <span className={`badge ${rec?.status === "Present" ? "badge-present" : "badge-warning"}`}>{rec?.status || "Absent"}</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <div className="stats-grid">
            <div className="stat-card"><div className="stat-header">Total Students</div><div className="stat-value">{total}</div></div>
            <div className="stat-card"><div className="stat-header">Present</div><div className="stat-value">{present}</div></div>
            <div className="stat-card"><div className="stat-header">Absent</div><div className="stat-value">{absent}</div></div>
            <div className="stat-card"><div className="stat-header">Percentage</div><div className="stat-value">{pct}%</div></div>
          </div>
          {canEdit && <button className="btn btn-primary" onClick={() => alert("Attendance saved!")}>Save Attendance</button>}
        </div>
      </section>
    </AppShell>
  );
}
