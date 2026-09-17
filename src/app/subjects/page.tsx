"use client";

import { useState, useEffect } from "react";
import AppShell from "@/components/AppShell";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import { BookOpen, Plus, Trash2, RefreshCw } from "lucide-react";

interface Subject {
  _id: string;
  code: string;
  name: string;
  department: string;
  semester: number;
  section: string;
  createdBy?: string;
}

export default function SubjectsPage() {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newSubject, setNewSubject] = useState({ name: "", code: "" });
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
      setError("Network error.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSubjects(); }, []);
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
        setNewSubject({ name: "", code: "" });
        fetchSubjects();
      } else {
        alert(data.error || "Failed to add subject");
      }
    } catch {
      alert("Network error.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this subject? This action cannot be undone.")) return;
    try {
      const res = await fetch(`/api/subjects/${id}`, { method: "DELETE", credentials: "include" });
      const data = await res.json();
      if (data.success) fetchSubjects();
      else alert(data.error || "Failed to delete subject");
    } catch {
      alert("Network error.");
    }
  };

  const role = user?.role?.toUpperCase() || "STUDENT";
  const canManage = role === "ADMIN" || role === "CR";

  return (
    <AppShell>
      <Navbar title="Subjects" />
      <section className="content">
        <div className="page-header">
          <div><h1>Subjects</h1><p>Manage subjects and class information.</p></div>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn btn-secondary" onClick={fetchSubjects} disabled={loading}><RefreshCw size={16} className={loading ? "spin" : ""} /></button>
            {canManage && <button className="btn btn-primary" onClick={() => setShowModal(true)}><Plus size={16} /> Add Subject</button>}
          </div>
        </div>

        <div className="card">
          <div className="filters">
            <div className="search-box"><input type="text" placeholder="Search subjects..." value={search} onChange={e => setSearch(e.target.value)} /></div>
          </div>
        </div>

        {loading ? (
          <div style={{ padding: 40, textAlign: "center", color: "var(--text-muted)" }}>Loading subjects...</div>
        ) : error ? (
          <div className="card" style={{ textAlign: "center", padding: 40 }}>
            <p style={{ color: "var(--danger)", marginBottom: 12 }}>{error}</p>
            <button className="btn btn-primary" onClick={fetchSubjects}><RefreshCw size={16} /> Retry</button>
          </div>
        ) : (
          <div className="grid-2">
            {subjects.length === 0 ? (
              <div className="card"><h3>No subjects found</h3><p style={{ color: "var(--text-muted)" }}>Try another search or add a new subject.</p></div>
            ) : subjects.map(s => (
              <div className="card subject-card" key={s._id}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 15 }}>
                  <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                    <div className="stat-icon stat-icon-blue" style={{ flexShrink: 0 }}>
                      <BookOpen size={20} />
                    </div>
                    <div>
                      <span className="badge badge-primary">{s.code}</span>
                      <h2 style={{ marginTop: 8, fontSize: 22, textTransform: "uppercase", letterSpacing: "0.04em" }}>{s.name}</h2>
                    </div>
                  </div>
                  {canManage && <button className="btn btn-danger" onClick={() => handleDelete(s._id)}><Trash2 size={14} /></button>}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginTop: 20 }}>
                  <div><small style={{ color: "var(--text-muted)", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em" }}>Semester</small><strong style={{ display: "block", color: "var(--text)" }}>{s.semester || "—"}</strong></div>
                  <div><small style={{ color: "var(--text-muted)", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em" }}>Section</small><strong style={{ display: "block", color: "var(--text)" }}>{s.section || "—"}</strong></div>
                  <div><small style={{ color: "var(--text-muted)", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em" }}>Department</small><strong style={{ display: "block", color: "var(--text)" }}>{s.department || "—"}</strong></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {showModal && (
          <div className="modal-overlay active" onClick={() => setShowModal(false)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <div className="modal-header"><h2>Add Subject</h2><button className="modal-close" onClick={() => setShowModal(false)}>×</button></div>
              <form onSubmit={handleAdd}>
                <div className="form-group"><label>Subject Name</label><input className="form-control" required value={newSubject.name} onChange={e => setNewSubject({ ...newSubject, name: e.target.value })} /></div>
                <div className="form-group"><label>Subject Code</label><input className="form-control" required value={newSubject.code} onChange={e => setNewSubject({ ...newSubject, code: e.target.value })} /></div>
                <button type="submit" className="btn btn-primary btn-full" disabled={saving}>{saving ? "Adding..." : "Add Subject"}</button>
              </form>
            </div>
          </div>
        )}
      </section>
    </AppShell>
  );
}
