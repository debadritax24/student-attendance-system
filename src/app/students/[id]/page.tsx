"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import Navbar from "@/components/Navbar";
import { AlertTriangle, ArrowLeft, BookOpen, CheckCircle, XCircle, TrendingUp, RefreshCw } from "lucide-react";

interface Student {
  _id: string;
  rollNumber: string;
  name: string;
  email: string;
  department: string;
  semester: number;
  section: string;
  active: boolean;
}

interface AttendanceSummary {
  total: number;
  present: number;
  absent: number;
  late: number;
  percentage: number;
}

interface SubjectStat {
  subject: string;
  code: string;
  total: number;
  present: number;
  absent: number;
  percentage: number;
}

function getInitials(name: string) {
  return name.split(" ").map(w => w[0]).join("").substring(0, 2).toUpperCase();
}

export default function StudentDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [student, setStudent] = useState<Student | null>(null);
  const [summary, setSummary] = useState<AttendanceSummary | null>(null);
  const [subjectStats, setSubjectStats] = useState<SubjectStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const [studentRes, historyRes] = await Promise.all([
        fetch(`/api/students/${id}`, { credentials: "include" }),
        fetch(`/api/attendance/history/${id}`, { credentials: "include" }),
      ]);
      const studentData = await studentRes.json();
      const historyData = await historyRes.json();

      if (studentData.success) setStudent(studentData.data);
      else setError(studentData.error || "Student not found");

      if (historyData.success) {
        setSummary(historyData.data.summary);
        const bySubject: Record<string, { subject: string; code: string; total: number; present: number; absent: number }> = {};
        for (const rec of historyData.data.records) {
          const subName = rec.subject?.name || "Unknown";
          const subCode = rec.subject?.code || "—";
          if (!bySubject[subName]) bySubject[subName] = { subject: subName, code: subCode, total: 0, present: 0, absent: 0 };
          bySubject[subName].total++;
          if (rec.status === "PRESENT" || rec.status === "LATE") bySubject[subName].present++;
          else bySubject[subName].absent++;
        }
        setSubjectStats(
          Object.values(bySubject).map(s => ({ ...s, percentage: s.total ? Math.round((s.present / s.total) * 100) : 0 }))
        );
      }
    } catch {
      setError("Failed to load student data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (id) fetchData(); }, [id]);

  if (loading) {
    return (
      <AppShell>
        <Navbar title="Student Details" />
        <section className="content">
          <div className="card" style={{ padding: 40, textAlign: "center", color: "var(--text-muted)" }}>Loading student details...</div>
        </section>
      </AppShell>
    );
  }

  if (error || !student) {
    return (
      <AppShell>
        <Navbar title="Student Details" />
        <section className="content">
          <div className="card">
            <h2>{error || "Student not found"}</h2>
            <a href="/students" style={{ color: "var(--primary)" }}><ArrowLeft size={16} /> Back to Students</a>
          </div>
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
            <a href="/students" style={{ color: "var(--primary)", display: "inline-flex", alignItems: "center", gap: 6 }}><ArrowLeft size={16} /> Back to Students</a>
            <h1 style={{ marginTop: 10 }}>{student.name}</h1>
            <p>{student.rollNumber} | {student.department || "—"} | Semester {student.semester || "—"} | Section {student.section || "—"}</p>
          </div>
          <button className="btn btn-secondary" onClick={fetchData} disabled={loading}><RefreshCw size={16} className={loading ? "spin" : ""} /> Refresh</button>
        </div>

        <div className="card">
          <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
            <div className="avatar" style={{ width: 70, height: 70, fontSize: 22 }}>{getInitials(student.name)}</div>
            <div>
              <h2 style={{ fontSize: 32, textTransform: "uppercase", letterSpacing: "0.04em" }}>{student.name}</h2>
              <p style={{ color: "var(--text-secondary)" }}>{student.email || "No email"}</p>
            </div>
          </div>
        </div>

        {summary && (
          <>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon stat-icon-cyan"><TrendingUp size={20} /></div>
                <div className="stat-header">Overall Attendance</div>
                <div className="stat-value">{summary.percentage}%</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon stat-icon-blue"><BookOpen size={20} /></div>
                <div className="stat-header">Total Classes</div>
                <div className="stat-value">{summary.total}</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon stat-icon-green"><CheckCircle size={20} /></div>
                <div className="stat-header">Present</div>
                <div className="stat-value">{summary.present + summary.late}</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon stat-icon-red"><XCircle size={20} /></div>
                <div className="stat-header">Absent</div>
                <div className="stat-value">{summary.absent}</div>
              </div>
            </div>

            {summary.percentage < 75 && (
              <div className="card warning-card">
                <div className="warning-card-content">
                  <AlertTriangle size={20} />
                  <div>
                    <strong>Attendance Warning</strong>
                    <p>This student&apos;s attendance is below 75%. Immediate attention may be required.</p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        <div className="card">
          <div className="card-title">Subject-wise Attendance</div>
          <div className="table-container">
            {subjectStats.length === 0 ? (
              <div style={{ padding: 30, textAlign: "center", color: "var(--text-muted)" }}>No attendance records yet.</div>
            ) : (
              <table>
                <thead><tr><th>Subject</th><th>Code</th><th>Total Classes</th><th>Present</th><th>Absent</th><th>Attendance</th></tr></thead>
                <tbody>
                  {subjectStats.map(s => (
                    <tr key={s.code}>
                      <td><strong>{s.subject}</strong></td>
                      <td>{s.code}</td>
                      <td>{s.total}</td>
                      <td>{s.present}</td>
                      <td>{s.absent}</td>
                      <td>
                        <span className={`badge ${s.percentage >= 75 ? "badge-present" : s.percentage >= 60 ? "badge-warning" : "badge-absent"}`}>
                          {s.percentage}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </section>
    </AppShell>
  );
}
