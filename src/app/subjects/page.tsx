"use client";

import { useState, useEffect } from "react";
import AppShell from "@/components/AppShell";
import Navbar from "@/components/Navbar";
import Modal from "@/components/ui/Modal";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import {
  BookOpen,
  Plus,
  Trash2,
  RefreshCw,
  Search,
  Edit2,
} from "lucide-react";

interface Subject {
  _id: string;
  code: string;
  name: string;
  department: string;
  semester: number;
  section: string;
  faculty?: string;
  totalClasses?: number;
}

export default function SubjectsPage() {
  const { user } = useAuth();
  const { success, error: toastError } = useToast();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [newSubject, setNewSubject] = useState({
    name: "",
    code: "",
    department: "CSE",
    semester: 3,
    section: "E",
    faculty: "",
  });
  const [saving, setSaving] = useState(false);

  const fetchSubjects = async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      params.set("limit", "200");
      const res = await fetch(`/api/subjects?${params}`, { credentials: "include" });
      const data = await res.json();
      if (data.success) setSubjects(data.data.items || []);
      else setError(data.error || "Failed to load subjects");
    } catch {
      setError("Network connection error.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  useEffect(() => {
    const t = setTimeout(() => fetchSubjects(), 300);
    return () => clearTimeout(t);
  }, [search]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/subjects", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSubject),
      });
      const data = await res.json();
      if (data.success) {
        setShowModal(false);
        setNewSubject({
          name: "",
          code: "",
          department: "CSE",
          semester: 3,
          section: "E",
          faculty: "",
        });
        success("Subject created successfully!");
        fetchSubjects();
      } else {
        toastError(data.error || "Failed to add subject");
      }
    } catch {
      toastError("Network error while adding subject.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSubject) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/subjects/${editingSubject._id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editingSubject.name,
          code: editingSubject.code,
          department: editingSubject.department,
          semester: editingSubject.semester,
          section: editingSubject.section,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setShowEditModal(false);
        setEditingSubject(null);
        success("Subject updated successfully!");
        fetchSubjects();
      } else {
        toastError(data.error || "Failed to update subject");
      }
    } catch {
      toastError("Network error while updating subject.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this subject? This action cannot be undone.")) return;
    try {
      const res = await fetch(`/api/subjects/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        success("Subject deleted successfully.");
        fetchSubjects();
      } else {
        toastError(data.error || "Failed to delete subject");
      }
    } catch {
      toastError("Network error while deleting subject.");
    }
  };

  const role = user?.role?.toUpperCase() || "STUDENT";
  const canManage = role === "ADMIN" || role === "CR";

  return (
    <AppShell>
      <Navbar title="Curriculum & Subjects" />
      <div className="page-content">
        {/* Header */}
        <div className="page-header">
          <div>
            <h1 className="page-header-title">Curriculum & Subjects</h1>
            <p className="page-header-subtitle">
              Manage courses, faculty assignments, and section class allocations.
            </p>
          </div>
          <div className="page-header-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={fetchSubjects}
              disabled={loading}
            >
              <RefreshCw size={15} className={loading ? "spin" : ""} />
              <span>Refresh</span>
            </button>
            {canManage && (
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setShowModal(true)}
              >
                <Plus size={16} />
                <span>Add Subject</span>
              </button>
            )}
          </div>
        </div>

        {/* Search Bar */}
        <div className="card" style={{ marginBottom: 24 }}>
          <div className="search-input-wrap" style={{ maxWidth: 400 }}>
            <Search size={15} className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search by subject name or course code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Subjects Grid */}
        {loading ? (
          <div className="card" style={{ padding: 60, textAlign: "center", color: "var(--text-muted)" }}>
            Loading subjects...
          </div>
        ) : error ? (
          <div className="card" style={{ padding: 40, textAlign: "center" }}>
            <p style={{ color: "var(--status-absent)", marginBottom: 16 }}>{error}</p>
            <button type="button" className="btn btn-primary" onClick={fetchSubjects}>
              <RefreshCw size={15} />
              <span>Retry</span>
            </button>
          </div>
        ) : subjects.length === 0 ? (
          <div className="card" style={{ padding: 60, textAlign: "center", color: "var(--text-muted)" }}>
            <BookOpen size={32} style={{ margin: "0 auto 12px", opacity: 0.5 }} />
            <h3>No subjects found</h3>
            <p style={{ marginTop: 4 }}>Try adjusting your search query or add a new subject.</p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
              gap: 20,
            }}
          >
            {subjects.map((s) => (
              <div
                key={s._id}
                className="card"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  gap: 16,
                }}
              >
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      gap: 12,
                      marginBottom: 12,
                    }}
                  >
                    <span className="badge badge-accent" style={{ fontWeight: 700, fontSize: "0.82rem" }}>
                      {s.code}
                    </span>
                    {canManage && (
                      <div style={{ display: "flex", gap: 6 }}>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => {
                            setEditingSubject({ ...s });
                            setShowEditModal(true);
                          }}
                          title="Edit Subject"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(s._id)}
                          title="Delete Subject"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    )}
                  </div>

                  <h3 style={{ fontSize: "1.18rem", fontWeight: 700, lineHeight: 1.3, marginBottom: 6 }}>
                    {s.name}
                  </h3>
                  <div style={{ fontSize: "0.84rem", color: "var(--text-secondary)" }}>
                    {s.faculty || "Faculty assignment pending"}
                  </div>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: 10,
                    paddingTop: 14,
                    borderTop: "1px solid var(--border-subtle)",
                  }}
                >
                  <div>
                    <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 600 }}>
                      Department
                    </span>
                    <strong style={{ display: "block", fontSize: "0.88rem", marginTop: 2 }}>
                      {s.department || "CSE"}
                    </strong>
                  </div>
                  <div>
                    <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 600 }}>
                      Semester
                    </span>
                    <strong style={{ display: "block", fontSize: "0.88rem", marginTop: 2 }}>
                      Sem {s.semester || 3}
                    </strong>
                  </div>
                  <div>
                    <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 600 }}>
                      Section
                    </span>
                    <strong style={{ display: "block", fontSize: "0.88rem", marginTop: 2 }}>
                      Sec {s.section || "E"}
                    </strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Subject Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Add Subject"
        subtitle="Register a new academic course in the college syllabus."
      >
        <form onSubmit={handleAdd}>
          <div className="form-group">
            <label className="form-label">Subject Name</label>
            <input
              className="form-input"
              required
              placeholder="e.g. Database Management Systems"
              value={newSubject.name}
              onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Course Code</label>
            <input
              className="form-input"
              required
              placeholder="e.g. CSE11108"
              value={newSubject.code}
              onChange={(e) => setNewSubject({ ...newSubject, code: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Faculty In-Charge</label>
            <input
              className="form-input"
              placeholder="e.g. Mr. Victor Das"
              value={newSubject.faculty}
              onChange={(e) => setNewSubject({ ...newSubject, faculty: e.target.value })}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Department</label>
              <select
                className="form-select"
                value={newSubject.department}
                onChange={(e) => setNewSubject({ ...newSubject, department: e.target.value })}
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
                value={newSubject.semester}
                onChange={(e) =>
                  setNewSubject({ ...newSubject, semester: Number(e.target.value) })
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
                value={newSubject.section}
                onChange={(e) => setNewSubject({ ...newSubject, section: e.target.value })}
              >
                <option value="E">E</option>
                <option value="A">A</option>
                <option value="B">B</option>
              </select>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 14 }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? "Creating..." : "Create Subject"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Subject Modal */}
      {showEditModal && editingSubject && (
        <Modal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setEditingSubject(null);
          }}
          title="Edit Subject"
          subtitle={`Updating course information for ${editingSubject.code}.`}
        >
          <form onSubmit={handleEdit}>
            <div className="form-group">
              <label className="form-label">Subject Name</label>
              <input
                className="form-input"
                required
                value={editingSubject.name}
                onChange={(e) =>
                  setEditingSubject({ ...editingSubject, name: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label className="form-label">Course Code</label>
              <input
                className="form-input"
                required
                value={editingSubject.code}
                onChange={(e) =>
                  setEditingSubject({ ...editingSubject, code: e.target.value })
                }
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
              <div className="form-group">
                <label className="form-label">Department</label>
                <select
                  className="form-select"
                  value={editingSubject.department || "CSE"}
                  onChange={(e) =>
                    setEditingSubject({ ...editingSubject, department: e.target.value })
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
                  value={editingSubject.semester || 3}
                  onChange={(e) =>
                    setEditingSubject({
                      ...editingSubject,
                      semester: Number(e.target.value),
                    })
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
                  value={editingSubject.section || "E"}
                  onChange={(e) =>
                    setEditingSubject({ ...editingSubject, section: e.target.value })
                  }
                >
                  <option value="E">E</option>
                  <option value="A">A</option>
                  <option value="B">B</option>
                </select>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 14 }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setShowEditModal(false);
                  setEditingSubject(null);
                }}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? "Saving..." : "Update Subject"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </AppShell>
  );
}
