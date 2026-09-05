"use client";

import { useState, useEffect } from "react";
import AppShell from "@/components/AppShell";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";

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

export default function StudentsPage() {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");
  const [semester, setSemester] = useState("");
  const [section, setSection] = useState("");
  const [studentList, setStudentList] = useState(students);
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editStudent, setEditStudent] = useState<any>(null);
  const [newStudent, setNewStudent] = useState({ name: "", roll: "", email: "", department: "CSE", semester: 5, section: "A" });

  const role = user?.role?.toUpperCase() || "CR";
  const filtered = studentList.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.roll.toLowerCase().includes(search.toLowerCase());
    const matchDept = !department || s.department === department;
    const matchSem = !semester || String(s.semester) === semester;
    const matchSec = !section || s.section === section;
    return matchSearch && matchDept && matchSem && matchSec;
  });

  const total = studentList.length;
  const average = total ? Math.round(studentList.reduce((sum, s) => sum + s.attendance, 0) / total) : 0;
  const above = studentList.filter(s => s.attendance >= 75).length;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    setStudentList([...studentList, { ...newStudent, id: Date.now(), attendance: 100 }]);
    setShowAdd(false);
    setNewStudent({ name: "", roll: "", email: "", department: "CSE", semester: 5, section: "A" });
  };

  const handleEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editStudent) return;
    setStudentList(studentList.map(s => s.id === editStudent.id ? editStudent : s));
    setShowEdit(false);
  };

  const handleDelete = (id: number) => {
    if (confirm("Delete this student?")) {
      setStudentList(studentList.filter(s => s.id !== id));
    }
  };

  return (
    <AppShell>
      <Navbar title="Students" />
      <section className="content">
        <div className="page-header">
          <div><h1>Students</h1><p>Manage students and monitor their attendance.</p></div>
          {role === "ADMIN" && <button className="btn btn-primary" onClick={() => setShowAdd(true)}>+ Add Student</button>}
        </div>

        <div className="stats-grid">
          <div className="stat-card"><div className="stat-header">Total Students</div><div className="stat-value">{total}</div></div>
          <div className="stat-card"><div className="stat-header">Average Attendance</div><div className="stat-value">{average}%</div></div>
          <div className="stat-card"><div className="stat-header">Above 75%</div><div className="stat-value">{above}</div></div>
          <div className="stat-card"><div className="stat-header">Below 75%</div><div className="stat-value">{total - above}</div></div>
        </div>

        <div className="card">
          <div className="filters">
            <div className="search-box">
              <input type="text" placeholder="Search by name or roll number..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <select className="form-control" value={department} onChange={e => setDepartment(e.target.value)}>
              <option value="">All Departments</option>
              <option value="CSE">CSE</option><option value="ECE">ECE</option><option value="IT">IT</option>
            </select>
            <select className="form-control" value={semester} onChange={e => setSemester(e.target.value)}>
              <option value="">All Semesters</option>
              <option value="5">Semester 5</option><option value="4">Semester 4</option><option value="3">Semester 3</option>
            </select>
            <select className="form-control" value={section} onChange={e => setSection(e.target.value)}>
              <option value="">All Sections</option>
              <option value="A">Section A</option><option value="B">Section B</option>
            </select>
          </div>
        </div>

        <div className="card">
          <div className="table-container">
            <table>
              <thead><tr><th>Roll No</th><th>Student</th><th>Department</th><th>Semester</th><th>Section</th><th>Attendance</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={8} style={{ textAlign: "center", padding: 40 }}>No students found.</td></tr>
                ) : filtered.map(s => (
                  <tr key={s.id}>
                    <td><strong>{s.roll}</strong></td>
                    <td>
                      <div className="user">
                        <div className="avatar">{getInitials(s.name)}</div>
                        <div><strong>{s.name}</strong><small style={{ display: "block", color: "#64748b" }}>{s.email}</small></div>
                      </div>
                    </td>
                    <td>{s.department}</td><td>{s.semester}</td><td>{s.section}</td>
                    <td>
                      <strong>{s.attendance}%</strong>
                      <div className="progress"><div className="progress-bar" style={{ width: `${s.attendance}%` }}></div></div>
                    </td>
                    <td><span className={`badge ${s.attendance >= 75 ? "badge-present" : "badge-warning"}`}>{s.attendance >= 75 ? "Good" : "Warning"}</span></td>
                    <td>
                      <div style={{ display: "flex", gap: 6 }}>
                        <a href={`/students/${s.id}`} className="btn btn-secondary">View</a>
                        {role !== "STUDENT" && <button className="btn btn-secondary" onClick={() => { setEditStudent({ ...s }); setShowEdit(true); }}>Edit</button>}
                        {role === "ADMIN" && <button className="btn btn-danger" onClick={() => handleDelete(s.id)}>Delete</button>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {showAdd && (
          <div className="modal-overlay active" onClick={() => setShowAdd(false)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <div className="modal-header"><h2>Add Student</h2><button className="modal-close" onClick={() => setShowAdd(false)}>×</button></div>
              <form onSubmit={handleAdd}>
                <div className="form-group"><label>Student Name</label><input className="form-control" required value={newStudent.name} onChange={e => setNewStudent({ ...newStudent, name: e.target.value })} /></div>
                <div className="form-group"><label>Roll Number</label><input className="form-control" required value={newStudent.roll} onChange={e => setNewStudent({ ...newStudent, roll: e.target.value })} /></div>
                <div className="form-group"><label>Email</label><input type="email" className="form-control" required value={newStudent.email} onChange={e => setNewStudent({ ...newStudent, email: e.target.value })} /></div>
                <div className="form-group"><label>Department</label><select className="form-control" value={newStudent.department} onChange={e => setNewStudent({ ...newStudent, department: e.target.value })}><option>CSE</option><option>ECE</option><option>IT</option></select></div>
                <div className="form-group"><label>Semester</label><select className="form-control" value={newStudent.semester} onChange={e => setNewStudent({ ...newStudent, semester: Number(e.target.value) })}><option value={3}>3</option><option value={4}>4</option><option value={5}>5</option></select></div>
                <div className="form-group"><label>Section</label><select className="form-control" value={newStudent.section} onChange={e => setNewStudent({ ...newStudent, section: e.target.value })}><option>A</option><option>B</option></select></div>
                <button type="submit" className="btn btn-primary btn-full">Add Student</button>
              </form>
            </div>
          </div>
        )}

        {showEdit && editStudent && (
          <div className="modal-overlay active" onClick={() => setShowEdit(false)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <div className="modal-header"><h2>Edit Student</h2><button className="modal-close" onClick={() => setShowEdit(false)}>×</button></div>
              <form onSubmit={handleEdit}>
                <div className="form-group"><label>Student Name</label><input className="form-control" required value={editStudent.name} onChange={e => setEditStudent({ ...editStudent, name: e.target.value })} /></div>
                <div className="form-group"><label>Email</label><input type="email" className="form-control" required value={editStudent.email} onChange={e => setEditStudent({ ...editStudent, email: e.target.value })} /></div>
                <div className="form-group"><label>Department</label><select className="form-control" value={editStudent.department} onChange={e => setEditStudent({ ...editStudent, department: e.target.value })}><option>CSE</option><option>ECE</option><option>IT</option></select></div>
                <div className="form-group"><label>Semester</label><select className="form-control" value={editStudent.semester} onChange={e => setEditStudent({ ...editStudent, semester: Number(e.target.value) })}><option value={3}>3</option><option value={4}>4</option><option value={5}>5</option></select></div>
                <div className="form-group"><label>Section</label><select className="form-control" value={editStudent.section} onChange={e => setEditStudent({ ...editStudent, section: e.target.value })}><option>A</option><option>B</option></select></div>
                <button type="submit" className="btn btn-primary btn-full">Update Student</button>
              </form>
            </div>
          </div>
        )}
      </section>
    </AppShell>
  );
}
