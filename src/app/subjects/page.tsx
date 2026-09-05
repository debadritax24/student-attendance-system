"use client";

import { useState } from "react";
import AppShell from "@/components/AppShell";
import Navbar from "@/components/Navbar";

const initialSubjects = [
  { id: 1, name: "Data Structures", code: "CS501", faculty: "Dr. Ankit Sen", semester: 5, section: "A", classes: 42 },
  { id: 2, name: "Database Management", code: "CS502", faculty: "Dr. Priya Roy", semester: 5, section: "A", classes: 38 },
  { id: 3, name: "Operating Systems", code: "CS503", faculty: "Dr. Rahul Das", semester: 5, section: "A", classes: 40 },
  { id: 4, name: "Computer Networks", code: "CS504", faculty: "Dr. Sneha Paul", semester: 5, section: "A", classes: 36 },
];

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState(initialSubjects);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newSubject, setNewSubject] = useState({ name: "", code: "", faculty: "" });

  const filtered = subjects.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) || s.code.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    setSubjects([...subjects, { ...newSubject, id: Date.now(), semester: 5, section: "A", classes: 0 }]);
    setShowModal(false);
    setNewSubject({ name: "", code: "", faculty: "" });
  };

  const handleDelete = (id: number) => {
    if (confirm("Delete this subject?")) {
      setSubjects(subjects.filter(s => s.id !== id));
    }
  };

  return (
    <AppShell>
      <Navbar title="Subjects" />
      <section className="content">
        <div className="page-header">
          <div><h1>Subjects</h1><p>Manage subjects and class information.</p></div>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Add Subject</button>
        </div>

        <div className="card">
          <div className="filters">
            <div className="search-box"><input type="text" placeholder="Search subjects..." value={search} onChange={e => setSearch(e.target.value)} /></div>
          </div>
        </div>

        <div className="grid-2">
          {filtered.length === 0 ? (
            <div className="card"><h3>No subjects found</h3><p style={{ color: "#64748b" }}>Try another search.</p></div>
          ) : filtered.map(s => (
            <div className="card" key={s.id}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 15 }}>
                <div>
                  <span className="badge badge-primary">{s.code}</span>
                  <h2 style={{ marginTop: 12 }}>{s.name}</h2>
                  <p style={{ color: "#64748b", marginTop: 5 }}>{s.faculty}</p>
                </div>
                <button className="btn btn-danger" onClick={() => handleDelete(s.id)}>Delete</button>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginTop: 20 }}>
                <div><small style={{ color: "#64748b" }}>Semester</small><strong style={{ display: "block" }}>{s.semester}</strong></div>
                <div><small style={{ color: "#64748b" }}>Section</small><strong style={{ display: "block" }}>{s.section}</strong></div>
                <div><small style={{ color: "#64748b" }}>Classes</small><strong style={{ display: "block" }}>{s.classes}</strong></div>
              </div>
            </div>
          ))}
        </div>

        {showModal && (
          <div className="modal-overlay active" onClick={() => setShowModal(false)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <div className="modal-header"><h2>Add Subject</h2><button className="modal-close" onClick={() => setShowModal(false)}>×</button></div>
              <form onSubmit={handleAdd}>
                <div className="form-group"><label>Subject Name</label><input className="form-control" required value={newSubject.name} onChange={e => setNewSubject({ ...newSubject, name: e.target.value })} /></div>
                <div className="form-group"><label>Subject Code</label><input className="form-control" required value={newSubject.code} onChange={e => setNewSubject({ ...newSubject, code: e.target.value })} /></div>
                <div className="form-group"><label>Faculty</label><input className="form-control" required value={newSubject.faculty} onChange={e => setNewSubject({ ...newSubject, faculty: e.target.value })} /></div>
                <button type="submit" className="btn btn-primary btn-full">Add Subject</button>
              </form>
            </div>
          </div>
        )}
      </section>
    </AppShell>
  );
}
