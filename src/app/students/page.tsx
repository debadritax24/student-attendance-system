"use client";

import { useState, useEffect } from "react";
import AppShell from "@/components/AppShell";
import Navbar from "@/components/Navbar";
import StatCard from "@/components/ui/StatCard";
import Modal from "@/components/ui/Modal";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import {
  Users,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  Plus,
  RefreshCw,
  Search,
  Eye,
  Edit2,
  Trash2,
  GraduationCap,
} from "lucide-react";
import Link from "next/link";

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
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();
}

export default function StudentsPage() {
  const { user } = useAuth();
  const { success, error: toastError } = useToast();
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
  const [newStudent, setNewStudent] = useState({
    name: "",
    rollNumber: "",
    email: "",
    department: "CSE",
    semester: 3,
    section: "E",
  });
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
      setError("Network connection issue.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    const t = setTimeout(() => fetchStudents(), 300);
    return () => clearTimeout(t);
  }, [search, department, semester, section]);

  const role = user?.role?.toUpperCase() || "CR";
  const canManage = role === "ADMIN" || role === "CR";
  const total = students.length;
  const average = total
    ? Math.round(
        students.reduce((sum, s) => sum + (s.attendancePercentage || 0), 0) / total
      )
    : 86;
  const above = students.filter((s) => (s.attendancePercentage || 0) >= 75).length;
  const below = total - above;

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
        setNewStudent({
          name: "",
          rollNumber: "",
          email: "",
          department: "CSE",
          semester: 3,
          section: "E",
        });
        success("Student enrolled successfully!");
        fetchStudents();
      } else {
        toastError(data.error || "Failed to add student");
      }
    } catch {
      toastError("Network error while adding student.");
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
        body: JSON.stringify({
          name: editStudent.name,
          email: editStudent.email,
          department: editStudent.department,
          semester: editStudent.semester,
          section: editStudent.section,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setShowEdit(false);
        setEditStudent(null);
        success("Student profile updated!");
        fetchStudents();
      } else {
        toastError(data.error || "Failed to update student");
      }
    } catch {
      toastError("Network error while updating student.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this student? This action cannot be undone.")) return;
    try {
      const res = await fetch(`/api/students/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        success("Student record removed.");
        fetchStudents();
      } else {
        toastError(data.error || "Failed to delete student");
      }
    } catch {
      toastError("Network error while deleting student.");
    }
  };

  return (
    <AppShell>
      <Navbar title="Student Directory" />
      <div className="page-content">
        {/* Header */}
        <div className="page-header">
          <div>
            <h1 className="page-header-title">Student Directory</h1>
            <p className="page-header-subtitle">
              Manage student enrollment, monitor eligibility, and view attendance histories.
            </p>
          </div>
          <div className="page-header-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={fetchStudents}
              disabled={loading}
            >
              <RefreshCw size={15} className={loading ? "spin" : ""} />
              <span>Refresh</span>
            </button>
            {canManage && (
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setShowAdd(true)}
              >
                <Plus size={16} />
                <span>Add Student</span>
              </button>
            )}
          </div>
        </div>

        {/* 4 Stat Cards */}
        <div className="stats-grid">
          <StatCard
            title="Total Students"
            value={total}
            subtitle="Enrolled in class"
            variant="default"
            icon={<Users size={18} />}
          />
          <StatCard
            title="Average Attendance"
            value={`${average}%`}
            subtitle="Overall class standing"
            variant="accent"
            icon={<TrendingUp size={18} />}
          />
          <StatCard
            title="Meeting Requirement"
            value={above}
            subtitle=">= 75% attendance"
            variant="success"
            badgeText="Eligible"
            icon={<CheckCircle size={18} />}
          />
          <StatCard
            title="Needs Attention"
            value={below}
            subtitle="Below 75% threshold"
            variant="danger"
            badgeText="At Risk"
            icon={<AlertTriangle size={18} />}
          />
        </div>

        {/* Search & Filter Toolbar */}
        <div className="card" style={{ marginBottom: 20 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr 1fr 1fr",
              gap: 12,
              alignItems: "center",
            }}
          >
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

            <select
              className="form-select"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            >
              <option value="">All Departments</option>
              <option value="CSE">CSE</option>
              <option value="ECE">ECE</option>
              <option value="IT">IT</option>
            </select>

            <select
              className="form-select"
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
            >
              <option value="">All Semesters</option>
              <option value="3">Semester 3</option>
              <option value="4">Semester 4</option>
              <option value="5">Semester 5</option>
            </select>

            <select
              className="form-select"
              value={section}
              onChange={(e) => setSection(e.target.value)}
            >
              <option value="">All Sections</option>
              <option value="A">Section A</option>
              <option value="B">Section B</option>
              <option value="E">Section E</option>
            </select>
          </div>
        </div>

        {/* Students Table */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">
                <GraduationCap size={18} style={{ color: "var(--accent)" }} />
                <span>Enrolled Students</span>
              </h3>
              <p className="card-subtitle">Showing {students.length} students</p>
            </div>
          </div>

          <div className="table-container">
            {loading ? (
              <div style={{ padding: 40, textAlign: "center", color: "var(--text-muted)" }}>
                Loading students roster...
              </div>
            ) : students.length === 0 ? (
              <div style={{ padding: 40, textAlign: "center", color: "var(--text-muted)" }}>
                No students found matching your criteria.
              </div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th style={{ width: 130 }}>Roll No</th>
                    <th>Student Name & Email</th>
                    <th>Dept & Semester</th>
                    <th>Section</th>
                    <th>Attendance %</th>
                    <th>Status</th>
                    <th style={{ textAlign: "right", width: 140 }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((s) => {
                    const pct = s.attendancePercentage ?? 85;
                    const isAbove = pct >= 75;

                    return (
                      <tr key={s._id}>
                        <td>
                          <span className="badge badge-accent" style={{ fontWeight: 600 }}>
                            {s.rollNumber}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <div className="avatar" style={{ width: 30, height: 30, fontSize: "0.75rem" }}>
                              {getInitials(s.name)}
                            </div>
                            <div>
                              <div style={{ fontWeight: 600 }}>{s.name}</div>
                              <div style={{ fontSize: "0.76rem", color: "var(--text-muted)" }}>
                                {s.email || "—"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                            {s.department || "CSE"} • Sem {s.semester || 3}
                          </span>
                        </td>
                        <td>
                          <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                            Sec {s.section || "E"}
                          </span>
                        </td>
                        <td>
                          <span
                            className={`badge ${isAbove ? "badge-present" : "badge-absent"}`}
                            style={{ fontWeight: 700 }}
                          >
                            {pct}%
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${s.active !== false ? "badge-lime" : "badge-warning"}`}>
                            {s.active !== false ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td style={{ textAlign: "right" }}>
                          <div style={{ display: "inline-flex", gap: 6 }}>
                            <Link
                              href={`/students/${s._id}`}
                              className="btn btn-secondary btn-sm"
                              title="View Profile"
                            >
                              <Eye size={13} />
                            </Link>
                            {canManage && (
                              <button
                                type="button"
                                className="btn btn-secondary btn-sm"
                                onClick={() => {
                                  setEditStudent({ ...s });
                                  setShowEdit(true);
                                }}
                                title="Edit Student"
                              >
                                <Edit2 size={13} />
                              </button>
                            )}
                            {role === "ADMIN" && (
                              <button
                                type="button"
                                className="btn btn-danger btn-sm"
                                onClick={() => handleDelete(s._id)}
                                title="Delete Student"
                              >
                                <Trash2 size={13} />
                              </button>
                            )}
                          </div>
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

      {/* Add Student Modal */}
      <Modal
        isOpen={showAdd}
        onClose={() => setShowAdd(false)}
        title="Add New Student"
        subtitle="Enroll a new student into the college attendance directory."
      >
        <form onSubmit={handleAdd}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              className="form-input"
              required
              placeholder="e.g. Ayan Das"
              value={newStudent.name}
              onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Roll Number</label>
            <input
              className="form-input"
              required
              placeholder="e.g. 23CSE062"
              value={newStudent.rollNumber}
              onChange={(e) => setNewStudent({ ...newStudent, rollNumber: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              placeholder="e.g. student@college.edu"
              value={newStudent.email}
              onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Department</label>
              <select
                className="form-select"
                value={newStudent.department}
                onChange={(e) => setNewStudent({ ...newStudent, department: e.target.value })}
              >
                <option value="CSE">CSE</option>
                <option value="ECE">ECE</option>
                <option value="IT">IT</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Semester</label>
              <select
                className="form-select"
                value={newStudent.semester}
                onChange={(e) =>
                  setNewStudent({ ...newStudent, semester: Number(e.target.value) })
                }
              >
                <option value={3}>3</option>
                <option value={4}>4</option>
                <option value={5}>5</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Section</label>
              <select
                className="form-select"
                value={newStudent.section}
                onChange={(e) => setNewStudent({ ...newStudent, section: e.target.value })}
              >
                <option value="E">E</option>
                <option value="A">A</option>
                <option value="B">B</option>
              </select>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 12 }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setShowAdd(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? "Saving..." : "Enroll Student"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Student Modal */}
      {showEdit && editStudent && (
        <Modal
          isOpen={showEdit}
          onClose={() => {
            setShowEdit(false);
            setEditStudent(null);
          }}
          title="Edit Student Profile"
          subtitle={`Updating information for ${editStudent.name} (${editStudent.rollNumber}).`}
        >
          <form onSubmit={handleEdit}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                className="form-input"
                required
                value={editStudent.name}
                onChange={(e) => setEditStudent({ ...editStudent, name: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-input"
                value={editStudent.email || ""}
                onChange={(e) => setEditStudent({ ...editStudent, email: e.target.value })}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
              <div className="form-group">
                <label className="form-label">Department</label>
                <select
                  className="form-select"
                  value={editStudent.department || "CSE"}
                  onChange={(e) =>
                    setEditStudent({ ...editStudent, department: e.target.value })
                  }
                >
                  <option value="CSE">CSE</option>
                  <option value="ECE">ECE</option>
                  <option value="IT">IT</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Semester</label>
                <select
                  className="form-select"
                  value={editStudent.semester || 3}
                  onChange={(e) =>
                    setEditStudent({ ...editStudent, semester: Number(e.target.value) })
                  }
                >
                  <option value={3}>3</option>
                  <option value={4}>4</option>
                  <option value={5}>5</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Section</label>
                <select
                  className="form-select"
                  value={editStudent.section || "E"}
                  onChange={(e) =>
                    setEditStudent({ ...editStudent, section: e.target.value })
                  }
                >
                  <option value="E">E</option>
                  <option value="A">A</option>
                  <option value="B">B</option>
                </select>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 12 }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setShowEdit(false);
                  setEditStudent(null);
                }}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? "Saving..." : "Update Details"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </AppShell>
  );
}
