"use client";

import { useState } from "react";
import AppShell from "@/components/AppShell";
import Navbar from "@/components/Navbar";

const historyData = [
  { date: "2026-09-05", subject: "Data Structures", period: "1st Period", present: 108, absent: 12, percentage: 90, markedBy: "Debadrita Goswami" },
  { date: "2026-09-04", subject: "Database Management", period: "2nd Period", present: 104, absent: 16, percentage: 87, markedBy: "Debadrita Goswami" },
  { date: "2026-09-03", subject: "Operating Systems", period: "3rd Period", present: 98, absent: 22, percentage: 82, markedBy: "Debadrita Goswami" },
  { date: "2026-09-02", subject: "Computer Networks", period: "1st Period", present: 112, absent: 8, percentage: 93, markedBy: "Debadrita Goswami" },
];

export default function HistoryPage() {
  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState("");
  const [date, setDate] = useState("");

  const filtered = historyData.filter(r => {
    const matchSearch = r.subject.toLowerCase().includes(search.toLowerCase());
    const matchSubject = !subject || r.subject === subject;
    const matchDate = !date || r.date === date;
    return matchSearch && matchSubject && matchDate;
  });

  return (
    <AppShell>
      <Navbar title="Attendance History" />
      <section className="content">
        <div className="page-header">
          <div><h1>Attendance History</h1><p>View previously recorded attendance.</p></div>
        </div>

        <div className="card">
          <div className="filters">
            <input type="date" className="form-control" value={date} onChange={e => setDate(e.target.value)} />
            <select className="form-control" value={subject} onChange={e => setSubject(e.target.value)}>
              <option value="">All Subjects</option>
              <option>Data Structures</option><option>Database Management</option><option>Operating Systems</option><option>Computer Networks</option>
            </select>
            <div className="search-box"><input type="text" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} /></div>
          </div>
        </div>

        <div className="card">
          <div className="table-container">
            <table>
              <thead><tr><th>Date</th><th>Subject</th><th>Period</th><th>Present</th><th>Absent</th><th>Percentage</th><th>Marked By</th></tr></thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={7} style={{ textAlign: "center", padding: 40 }}>No records found.</td></tr>
                ) : filtered.map((r, i) => (
                  <tr key={i}>
                    <td>{r.date}</td>
                    <td><strong>{r.subject}</strong></td>
                    <td>{r.period}</td>
                    <td><span className="badge badge-present">{r.present}</span></td>
                    <td><span className="badge badge-absent">{r.absent}</span></td>
                    <td><strong>{r.percentage}%</strong></td>
                    <td>{r.markedBy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
