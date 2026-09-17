"use client";

import { useState, useEffect } from "react";
import AppShell from "@/components/AppShell";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import { Users, TrendingUp, CheckCircle, AlertTriangle, Plus, RefreshCw } from "lucide-react";

interface Student {
  _id: string;
  rollNumber: string;
  name: string;
  email: string;
  department: string;
  semester: number;
  section: string;
  active: boolean;
  attendancePercentage?: number;
}

function getInitials(name: string) {
  return name.split(" ").map(w => w[0]).join("").substring(0, 2).toUpperCase();
}

export default function StudentsPage() {
  const { user } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");
  const [semester, setSemester] = useState("");
  const [section, setSection] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editStudent, setEditStudent] = useState<Student | null>(null);
  const [newStudent, setNewStudent] = useState({ name: "", rollNumber: "", email: "", department: "CSE", semester: 5, section: "A" });
  const [saving, setSaving] = useState(false);

  const fetchStudents = async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (department) params.set("department", department);
      if (semester) params.set("semester", semester);
      if (section) params.set("section", section);
      params.set("limit", "200");
      const res = await fetch(`/api/students?${params}`, { credentials: "include" });
      const data = await res.json();
      if (data.success) setStudents(data.data.items || []);
      else setError(data.error || "Failed to load students");
    } catch {
      setError("Network error.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStudents(); }, []);
  useEffect(() => {
    const t = setTimeout(() => fetchStudents(), 300);
    return () => clearTimeout(t);
  }, [search, department, semester, section]);

  const role = user?.role?.toUpperCase() || "CR";
  const total = students.length;
  const average = total ? Math.round(students.reduce((sum, s) => sum + (s.attendancePercentage || 0), 0) / total) : 0;
  const above = students.filter(s => (s.attendancePercentage || 0) >= 75).length;

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/students", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newStudent),
      });
      const data = await res.json();
      if (data.success) {
        setShowAdd(false);
        setNewStudent({ name: "", rollNumber: "", email: "", department: "CSE", semester: 5, section: "A" });
        fetchStudents();
      } else {
        alert(data.error || "Failed to add student");
      }
    } catch {
      alert("Network error.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editStudent) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/students/${editStudent._id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editStudent.name, email: editStudent.email, department: editStudent.department, semester: editStudent.semester, section: editStudent.section }),
      });
      const data = await res.json();
      if (data.success) {
        setShowEdit(false);
        setEditStudent(null);
        fetchStudents();
      } else {
        alert(data.error || "Failed to update student");
      }
    } catch {
      alert("Network error.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this student? This action cannot be undone.")) return;
    try {
      const res = await fetch(`/api/students/${id}`, { method: "DELETE", credentials: "include" });
      const data = await res.json();
      if (data.success) fetchStudents();
      else alert(data.error || "Failed to delete student");
    } catch {
      alert("Network error.");
    }
  };

  return (
    <AppShell>
      <Navbar title="Students" />
      <section className="content">
        <div className="page-header">
          <div><h1>Students</h1><p>Manage students and monitor their attendance.</p></div>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn btn-secondary" onClick={fetchStudents} disabled={loading}><RefreshCw size={16} className={loading ? "spin" : ""} /></button>
            {role === "ADMIN" && <button className="btn btn-primary" onClick={() => setShowAdd(true)}><Plus size={16} /> Add Student</button>}
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon stat-icon-blue"><Users size={20} /></div>
            <div className="stat-header">Total Students</div>
            <div className="stat-value">{total}</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon stat-icon-cyan"><TrendingUp size={20} /></div>
            <div className="stat-header">Average Attendance</div>
            <div className="stat-value">{average}%</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon stat-icon-green"><CheckCircle size={20} /></div>
            <div className="stat-header">Above 75%</div>
            <div className="stat-value">{above}</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon stat-icon-orange"><AlertTriangle size={20} /></div>
            <div className="stat-header">Below 75%</div>
            <div className="stat-value">{total - above}</div>
          </div>
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
              <option value="3">3</option><option value="4">4</option><option value="5">5</option>
            </select>
            <select className="form-control" value={section} onChange={e => setSection(e.target.value)}>
              <option value="">All Sections</option>
              <option value="A">A</option><option value="B">B</option>
            </select>
          </div>
        </div>

        <div className="card">
          <div className="table-container">
            {loading ? (
              <div style={{ padding: 40, textAlign: "center", color: "var(--text-muted)" }}>Loading students...</div>
            ) : error ? (
              <div style={{ padding: 40, textAlign: "center" }}>
                <p style={{ color: "var(--danger)", marginBottom: 12 }}>{error}</p>
                <button className="btn btn-primary" onClick={fetchStudents}><RefreshCw size={16} /> Retry</button>
              </div>
            ) : (
              <table>
                <thead><tr><th>Roll No</th><th>Student</th><th>Department</th><th>Semester</th><th>Section</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>
                  {students.length === 0 ? (
                    <tr><td colSpan={7} style={{ textAlign: "center", padding: 40, color: "var(--text-muted)" }}>No students found.</td></tr>
                  ) : students.map(s => (
                    <tr key={s._id}>
                      <td><strong>{s.rollNumber}</strong></td>
                      <td>
                        <div className="user">
                          <div className="avatar">{getInitials(s.name)}</div>
                          <div><strong style={{ color: "var(--text)" }}>{s.name}</strong><small style={{ display: "block", color: "var(--text-muted)" }}>{s.email || "—"}</small></div>
                        </div>
                      </td>
                      <td>{s.department || "—"}</td><td>{s.semester || "—"}</td><td>{s.section || "—"}</td>
                      <td><span className={`badge ${s.active ? "badge-present" : "badge-absent"}`}>{s.active ? "Active" : "Inactive"}</span></td>
                      <td>
                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                          <a href={`/students/${s._id}`} className="btn btn-secondary">View</a>
                          {role !== "STUDENT" && <button className="btn btn-secondary" onClick={() => { setEditStudent({ ...s }); setShowEdit(true); }}>Edit</button>}
                          {role === "ADMIN" && <button className="btn btn-danger" onClick={() => handleDelete(s._id)}>Delete</button>}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {showAdd && (
          <div className="modal-overlay active" onClick={() => setShowAdd(false)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <div className="modal-header"><h2>Add Student</h2><button className="modal-close" onClick={() => setShowAdd(false)}>×</button></div>
              <form onSubmit={handleAdd}>
                <div className="form-group"><label>Student Name</label><input className="form-control" required value={newStudent.name} onChange={e => setNewStudent({ ...newStudent, name: e.target.value })} /></div>
                <div className="form-group"><label>Roll Number</label><input className="form-control" required value={newStudent.rollNumber} onChange={e => setNewStudent({ ...newStudent, rollNumber: e.target.value })} /></div>
                <div className="form-group"><label>Email</label><input type="email" className="form-control" value={newStudent.email} onChange={e => setNewStudent({ ...newStudent, email: e.target.value })} /></div>
                <div className="form-group"><label>Department</label><select className="form-control" value={newStudent.department} onChange={e => setNewStudent({ ...newStudent, department: e.target.value })}><option>CSE</option><option>ECE</option><option>IT</option></select></div>
                <div className="form-group"><label>Semester</label><select className="form-control" value={newStudent.semester} onChange={e => setNewStudent({ ...newStudent, semester: Number(e.target.value) })}><option value={3}>3</option><option value={4}>4</option><option value={5}>5</option></select></div>
                <div className="form-group"><label>Section</label><select className="form-control" value={newStudent.section} onChange={e => setNewStudent({ ...newStudent, section: e.target.value })}><option>A</option><option>B</option></select></div>
                <button type="submit" className="btn btn-primary btn-full" disabled={saving}>{saving ? "Adding..." : "Add Student"}</button>
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
                <div className="form-group"><label>Email</label><input type="email" className="form-control" value={editStudent.email || ""} onChange={e => setEditStudent({ ...editStudent, email: e.target.value })} /></div>
                <div className="form-group"><label>Department</label><select className="form-control" value={editStudent.department || "CSE"} onChange={e => setEditStudent({ ...editStudent, department: e.target.value })}><option>CSE</option><option>ECE</option><option>IT</option></select></div>
                <div className="form-group"><label>Semester</label><select className="form-control" value={editStudent.semester || 5} onChange={e => setEditStudent({ ...editStudent, semester: Number(e.target.value) })}><option value={3}>3</option><option value={4}>4</option><option value={5}>5</option></select></div>
                <div className="form-group"><label>Section</label><select className="form-control" value={editStudent.section || "A"} onChange={e => setEditStudent({ ...editStudent, section: e.target.value })}><option>A</option><option>B</option></select></div>
                <button type="submit" className="btn btn-primary btn-full" disabled={saving}>{saving ? "Updating..." : "Update Student"}</button>
              </form>
            </div>
          </div>
        )}
      </section>
    </AppShell>
  );
}
