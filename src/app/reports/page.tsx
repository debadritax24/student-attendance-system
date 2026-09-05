"use client";

import AppShell from "@/components/AppShell";
import Navbar from "@/components/Navbar";

const students = [
  { id: 1, roll: "AU001", name: "Aarav Sharma", department: "CSE", attendance: 92 },
  { id: 2, roll: "AU002", name: "Riya Das", department: "CSE", attendance: 88 },
  { id: 3, roll: "AU003", name: "Aditya Roy", department: "CSE", attendance: 72 },
  { id: 4, roll: "AU004", name: "Sneha Paul", department: "CSE", attendance: 81 },
  { id: 5, roll: "AU005", name: "Rahul Sen", department: "CSE", attendance: 69 },
  { id: 6, roll: "AU006", name: "Ananya Roy", department: "CSE", attendance: 95 },
  { id: 7, roll: "AU007", name: "Soham Das", department: "CSE", attendance: 84 },
  { id: 8, roll: "AU008", name: "Priya Sharma", department: "CSE", attendance: 76 },
];

export default function ReportsPage() {
  const total = students.length;
  const average = total ? Math.round(students.reduce((sum, s) => sum + s.attendance, 0) / total) : 0;
  const above = students.filter(s => s.attendance >= 75).length;

  return (
    <AppShell>
      <Navbar title="Reports" />
      <section className="content">
        <div className="page-header">
          <div><h1>Attendance Reports</h1><p>Review attendance performance across the class.</p></div>
          <button className="btn btn-primary" onClick={() => window.print()}>Print Report</button>
        </div>

        <div className="stats-grid">
          <div className="stat-card"><div className="stat-header">Total Students</div><div className="stat-value">{total}</div></div>
          <div className="stat-card"><div className="stat-header">Average Attendance</div><div className="stat-value">{average}%</div></div>
          <div className="stat-card"><div className="stat-header">Meeting Requirement</div><div className="stat-value">{above}</div></div>
          <div className="stat-card"><div className="stat-header">Needs Attention</div><div className="stat-value">{total - above}</div></div>
        </div>

        <div className="card">
          <div className="card-title">Student Attendance Summary</div>
          <div className="table-container">
            <table>
              <thead><tr><th>Roll</th><th>Student</th><th>Department</th><th>Attendance</th><th>Status</th></tr></thead>
              <tbody>
                {students.map(s => (
                  <tr key={s.id}>
                    <td><strong>{s.roll}</strong></td>
                    <td>{s.name}</td>
                    <td>{s.department}</td>
                    <td>{s.attendance}%</td>
                    <td><span className={`badge ${s.attendance >= 75 ? "badge-present" : "badge-warning"}`}>{s.attendance >= 75 ? "Good" : "Warning"}</span></td>
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
