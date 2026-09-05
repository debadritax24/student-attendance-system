"use client";

import { useParams } from "next/navigation";
import AppShell from "@/components/AppShell";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";

const students = [
  { id: 1, roll: "AU001", name: "Aarav Sharma", email: "aarav@example.com", department: "CSE", semester: 5, section: "A", attendance: 92 },
  { id: 2, roll: "AU002", name: "Riya Das", email: "riya@example.com", department: "CSE", semester: 5, section: "A", attendance: 88 },
  { id: 3, roll: "AU003", name: "Aditya Roy", email: "aditya@example.com", department: "CSE", semester: 5, section: "A", attendance: 72 },
  { id: 4, roll: "AU004", name: "Sneha Paul", email: "sneha@example.com", department: "CSE", semester: 5, section: "A", attendance: 81 },
  { id: 5, roll: "AU005", name: "Rahul Sen", email: "rahul@example.com", department: "CSE", semester: 5, section: "A", attendance: 69 },
  { id: 6, roll: "AU006", name: "Ananya Roy", email: "ananya@example.com", department: "CSE", semester: 5, section: "A", attendance: 95 },
  { id: 7, roll: "AU007", name: "Soham Das", email: "soham@example.com", department: "CSE", semester: 5, section: "A", attendance: 84 },
  { id: 8, roll: "AU008", name: "Priya Sharma", email: "priya@example.com", department: "CSE", semester: 5, section: "A", attendance: 76 },
];

function getInitials(name: string) {
  return name.split(" ").map(w => w[0]).join("").substring(0, 2).toUpperCase();
}

export default function StudentDetailPage() {
  const params = useParams();
  const id = Number(params.id);
  const student = students.find(s => s.id === id);
  const { user } = useAuth();

  if (!student) {
    return (
      <AppShell>
        <Navbar title="Student Details" />
        <section className="content">
          <div className="card"><h2>Student not found</h2><a href="/students" style={{ color: "#6366f1" }}>← Back to Students</a></div>
        </section>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <Navbar title="Student Details" />
      <section className="content">
        <div className="page-header">
          <div>
            <a href="/students" style={{ color: "#6366f1" }}>← Back to Students</a>
            <h1 style={{ marginTop: 10 }}>{student.name}</h1>
            <p>{student.roll} | {student.department} | Semester {student.semester} | Section {student.section}</p>
          </div>
        </div>

        <div className="card">
          <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
            <div className="avatar" style={{ width: 70, height: 70, fontSize: 22 }}>{getInitials(student.name)}</div>
            <div>
              <h2>{student.name}</h2>
              <p style={{ color: "#64748b" }}>{student.email}</p>
            </div>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card"><div className="stat-header">Overall Attendance</div><div className="stat-value">{student.attendance}%</div></div>
          <div className="stat-card"><div className="stat-header">Total Classes</div><div className="stat-value">120</div></div>
          <div className="stat-card"><div className="stat-header">Present</div><div className="stat-value">108</div></div>
          <div className="stat-card"><div className="stat-header">Absent</div><div className="stat-value">12</div></div>
        </div>

        {student.attendance < 75 && (
          <div className="card" style={{ background: "#fff7ed" }}>
            <strong>⚠ Attendance Warning</strong>
            <p>This student&apos;s attendance is below 75%. Immediate attention may be required.</p>
          </div>
        )}

        <div className="card">
          <div className="card-title">Subject-wise Attendance</div>
          <div className="table-container">
            <table>
              <thead><tr><th>Subject</th><th>Total Classes</th><th>Present</th><th>Absent</th><th>Attendance</th></tr></thead>
              <tbody>
                <tr><td>Data Structures</td><td>42</td><td>39</td><td>3</td><td><span className="badge badge-present">93%</span></td></tr>
                <tr><td>Database Management</td><td>38</td><td>32</td><td>6</td><td><span className="badge badge-present">84%</span></td></tr>
                <tr><td>Operating Systems</td><td>40</td><td>27</td><td>13</td><td><span className="badge badge-warning">68%</span></td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
