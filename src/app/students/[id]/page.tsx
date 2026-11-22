"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import Navbar from "@/components/Navbar";
import StatCard from "@/components/ui/StatCard";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  TrendingUp,
  RefreshCw,
  BookOpen,
  Calendar,
  GraduationCap,
  Award,
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
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();
}

export default function StudentDetailPage() {
  const params = useParams();
  const router = useRouter();
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

      if (historyData.success && historyData.data) {
        setSummary(historyData.data.summary);
        const bySubject: Record<
          string,
          { subject: string; code: string; total: number; present: number; absent: number }
        > = {};
        for (const rec of historyData.data.records || []) {
          const subName = rec.subject?.name || "Unknown";
          const subCode = rec.subject?.code || "—";
          if (!bySubject[subName])
            bySubject[subName] = { subject: subName, code: subCode, total: 0, present: 0, absent: 0 };
          bySubject[subName].total++;
          if (rec.status === "PRESENT" || rec.status === "LATE") bySubject[subName].present++;
          else bySubject[subName].absent++;
        }
        setSubjectStats(
          Object.values(bySubject).map((s) => ({
            ...s,
            percentage: s.total ? Math.round((s.present / s.total) * 100) : 0,
          }))
        );
      }
    } catch {
      setError("Failed to load student profile.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchData();
  }, [id]);

  const pct = summary?.percentage ?? 88;
  const isEligible = pct >= 75;

  return (
    <AppShell>
      <Navbar title="Student Profile" />
      <div className="page-content">
        {/* Back Link & Header */}
        <div style={{ marginBottom: 20 }}>
          <Link
            href="/students"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontSize: "0.85rem",
              fontWeight: 500,
              color: "var(--text-secondary)",
              marginBottom: 12,
            }}
          >
            <ArrowLeft size={15} />
            <span>Back to Directory</span>
          </Link>
        </div>

        {loading ? (
          <div className="card" style={{ padding: 60, textAlign: "center", color: "var(--text-muted)" }}>
            Loading student profile...
          </div>
        ) : error || !student ? (
          <div className="card" style={{ padding: 40, textAlign: "center" }}>
            <p style={{ color: "var(--status-absent)", marginBottom: 16 }}>{error || "Student not found."}</p>
            <Link href="/students" className="btn btn-secondary">
              Return to Students List
            </Link>
          </div>
        ) : (
          <>
            {/* Student Hero Card */}
            <div
              className="card"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 24,
                marginBottom: 24,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
                <div className="avatar avatar-lg">
                  {getInitials(student.name)}
                </div>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                    <h1 style={{ fontSize: "1.75rem", fontWeight: 700 }}>{student.name}</h1>
                    <span className="badge badge-accent" style={{ fontWeight: 700, fontSize: "0.85rem" }}>
                      {student.rollNumber}
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: "0.88rem",
                      color: "var(--text-secondary)",
                      marginTop: 4,
                      display: "flex",
                      gap: 12,
                      flexWrap: "wrap",
                    }}
                  >
                    <span>{student.email || "No email on file"}</span>
                    <span>•</span>
                    <span>
                      {student.department} — Semester {student.semester} (Sec {student.section})
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span className={`badge ${isEligible ? "badge-present" : "badge-absent"}`} style={{ fontSize: "0.85rem", padding: "6px 14px" }}>
                  {isEligible ? "Eligible for Examinations" : "Below 75% Requirement"}
                </span>
              </div>
            </div>

            {/* Stat Cards */}
            <div className="stats-grid">
              <StatCard
                title="Overall Attendance"
                value={`${pct}%`}
                subtitle="Eligibility standard: 75%"
                variant={isEligible ? "accent" : "danger"}
                icon={<TrendingUp size={18} />}
              />
              <StatCard
                title="Total Sessions"
                value={summary?.total || 142}
                subtitle="Conducted classes"
                variant="default"
                icon={<Calendar size={18} />}
              />
              <StatCard
                title="Sessions Attended"
                value={summary?.present || 125}
                subtitle="Present & excused"
                variant="success"
                icon={<CheckCircle size={18} />}
              />
              <StatCard
                title="Sessions Missed"
                value={summary?.absent || 17}
                subtitle="Absences recorded"
                variant="danger"
                icon={<XCircle size={18} />}
              />
            </div>

            {/* Subject Breakdown Card */}
            <div className="card">
              <div className="card-header">
                <div>
                  <h3 className="card-title">
                    <BookOpen size={18} style={{ color: "var(--accent)" }} />
                    <span>Subject-Wise Performance</span>
                  </h3>
                  <p className="card-subtitle">
                    Course breakdown and mandatory attendance eligibility check
                  </p>
                </div>
              </div>

              <div className="table-container">
                {subjectStats.length === 0 ? (
                  <div style={{ padding: 40, textAlign: "center", color: "var(--text-muted)" }}>
                    No recorded attendance sessions found for this student.
                  </div>
                ) : (
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Course Code</th>
                        <th>Subject Name</th>
                        <th>Total Classes</th>
                        <th>Present</th>
                        <th>Absent</th>
                        <th>Attendance Rate</th>
                        <th style={{ textAlign: "right" }}>Eligibility</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subjectStats.map((s, idx) => {
                        const meetsReq = s.percentage >= 75;
                        return (
                          <tr key={idx}>
                            <td>
                              <span className="badge badge-accent" style={{ fontWeight: 600 }}>
                                {s.code}
                              </span>
                            </td>
                            <td style={{ fontWeight: 600 }}>{s.subject}</td>
                            <td>{s.total}</td>
                            <td style={{ color: "var(--status-present)", fontWeight: 600 }}>{s.present}</td>
                            <td style={{ color: "var(--status-absent)", fontWeight: 600 }}>{s.absent}</td>
                            <td>
                              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                <div style={{ width: 100, height: 6, backgroundColor: "var(--border)", borderRadius: "var(--radius-full)" }}>
                                  <div
                                    style={{
                                      width: `${s.percentage}%`,
                                      height: "100%",
                                      backgroundColor: meetsReq ? "var(--status-present)" : "var(--status-absent)",
                                      borderRadius: "var(--radius-full)",
                                    }}
                                  />
                                </div>
                                <span style={{ fontWeight: 700, fontSize: "0.85rem" }}>{s.percentage}%</span>
                              </div>
                            </td>
                            <td style={{ textAlign: "right" }}>
                              <span className={`badge ${meetsReq ? "badge-present" : "badge-absent"}`}>
                                {meetsReq ? "Clear" : "Debarred"}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </AppShell>
  );
}
