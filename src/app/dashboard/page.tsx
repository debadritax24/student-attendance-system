"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import Navbar from "@/components/Navbar";
import StatCard from "@/components/ui/StatCard";
import { AttendanceTrendChart, SubjectBarChart } from "@/components/ui/AttendanceCharts";
import { useAuth } from "@/context/AuthContext";
import {
  Users,
  UserCheck,
  UserX,
  TrendingUp,
  Plus,
  RefreshCw,
  AlertTriangle,
  BookOpen,
  CalendarCheck,
  ArrowRight,
  Award,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";

interface DashboardStats {
  students: number;
  subjects: number;
  attendance: number;
  present: number;
  absent: number;
  late: number;
  overallPercentage: number;
}

interface LowAttendanceStudent {
  _id: string;
  rollNumber: string;
  name: string;
  department: string;
  percentage: number;
}

interface SubjectStat {
  name: string;
  code: string;
  percentage: number;
  total: number;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [lowAttendance, setLowAttendance] = useState<LowAttendanceStudent[]>([]);
  const [subjectStats, setSubjectStats] = useState<SubjectStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const isStudent = user?.role === "STUDENT";

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const [statsRes, studentsRes, subjectsRes] = await Promise.all([
        fetch("/api/stats/dashboard", { credentials: "include" }),
        fetch("/api/students?limit=200", { credentials: "include" }),
        fetch("/api/subjects?limit=10", { credentials: "include" }),
      ]);
      const statsData = await statsRes.json();
      const studentsData = await studentsRes.json();
      const subjectsData = await subjectsRes.json();

      if (statsData.success) setStats(statsData.data);
      if (studentsData.success) {
        const items = studentsData.data.items || [];
        const low = items
          .map((s: any) => ({
            _id: s._id,
            rollNumber: s.rollNumber,
            name: s.name,
            department: s.department,
            percentage: s.attendancePercentage || 0,
          }))
          .filter((s: any) => s.percentage > 0 && s.percentage < 75)
          .sort((a: any, b: any) => a.percentage - b.percentage)
          .slice(0, 5);
        setLowAttendance(low);
      }
      if (subjectsData.success && subjectsData.data.items) {
        const dummyRates = [92, 85, 78, 88, 94, 73, 86, 90];
        setSubjectStats(
          subjectsData.data.items.slice(0, 6).map((sub: any, i: number) => ({
            name: sub.name,
            code: sub.code,
            percentage: dummyRates[i % dummyRates.length],
            total: 24,
          }))
        );
      }
    } catch {
      setError("Failed to load dashboard metrics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  // Student portal view
  if (isStudent) {
    const studentPct = 88;
    const isEligible = studentPct >= 75;

    return (
      <AppShell>
        <Navbar title="Student Dashboard" />
        <div className="page-content">
          <div className="page-header">
            <div>
              <h1 className="page-header-title">
                {greeting()}, {user?.name || "Student"}
              </h1>
              <p className="page-header-subtitle">
                Track your personal attendance, subject eligibility, and semester performance.
              </p>
            </div>
            <div className="page-header-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={fetchData}
                disabled={loading}
              >
                <RefreshCw size={15} className={loading ? "spin" : ""} />
                <span>Refresh</span>
              </button>
            </div>
          </div>

          {/* Student Stat Cards */}
          <div className="stats-grid">
            <StatCard
              title="Overall Attendance"
              value={`${studentPct}%`}
              subtitle="Target requirement: 75%"
              variant="accent"
              badgeText={isEligible ? "Eligible" : "Warning"}
              icon={<TrendingUp size={18} />}
            />
            <StatCard
              title="Classes Attended"
              value="142"
              subtitle="Out of 161 total sessions"
              variant="success"
              trend={{ value: "+4 this wk", isPositive: true }}
              icon={<UserCheck size={18} />}
            />
            <StatCard
              title="Classes Missed"
              value="19"
              subtitle="Excused & unexcused"
              variant="danger"
              icon={<UserX size={18} />}
            />
            <StatCard
              title="Semester Standing"
              value="Good"
              subtitle="Safe from exam debarment"
              variant="default"
              badgeText="Exams Clear"
              icon={<Award size={18} />}
            />
          </div>

          {/* Subject Breakdown & Chart Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 20 }}>
            <div className="card">
              <div className="card-header">
                <div>
                  <h3 className="card-title">
                    <BookOpen size={18} style={{ color: "var(--accent)" }} />
                    <span>Subject-Wise Attendance Breakdown</span>
                  </h3>
                  <p className="card-subtitle">Minimum 75% attendance mandatory in each course</p>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {[
                  { name: "Database Management Systems", code: "CSE11108", pct: 92, faculty: "Mr. Victor Das" },
                  { name: "Principles of Programming Language", code: "CSE11103", pct: 86, faculty: "Dr. Arnab Sinha" },
                  { name: "Data Structures and Algorithms", code: "CSE11104", pct: 79, faculty: "Mr. Subhra Prokash Dutta" },
                  { name: "Switching Circuits & Logic Design", code: "CSE11105", pct: 90, faculty: "Dr. Shukla Banik" },
                  { name: "Engineering Mathematics - III C", code: "SDS11510", pct: 72, faculty: "Faculty" },
                ].map((s, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: "12px 14px",
                      borderRadius: "var(--radius-md)",
                      backgroundColor: "var(--bg-surface-subtle)",
                      border: "1px solid var(--border-subtle)",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <div>
                        <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>{s.name}</span>
                        <span style={{ fontSize: "0.78rem", color: "var(--accent)", marginLeft: 8, fontWeight: 500 }}>{s.code}</span>
                      </div>
                      <span className={`badge ${s.pct >= 75 ? "badge-present" : "badge-absent"}`}>
                        {s.pct}%
                      </span>
                    </div>
                    <div className="hero-progress-track" style={{ height: 6, backgroundColor: "var(--border)" }}>
                      <div
                        className="hero-progress-fill"
                        style={{
                          width: `${s.pct}%`,
                          backgroundColor: s.pct >= 75 ? "var(--status-present)" : "var(--status-absent)",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <div>
                  <h3 className="card-title">
                    <TrendingUp size={18} style={{ color: "var(--accent)" }} />
                    <span>My Weekly Activity</span>
                  </h3>
                  <p className="card-subtitle">Daily attendance performance</p>
                </div>
              </div>
              <AttendanceTrendChart />
            </div>
          </div>
        </div>
      </AppShell>
    );
  }

  // General / CR / Admin Dashboard View
  const totalStudents = stats?.students || 61;
  const avgAttendance = stats?.overallPercentage || 88;
  const presentCount = stats?.present || 56;
  const absentCount = stats?.absent || 5;

  return (
    <AppShell>
      <Navbar title="Dashboard" />
      <div className="page-content">
        {/* Header */}
        <div className="page-header">
          <div>
            <h1 className="page-header-title">
              {greeting()}, {user?.name?.split(" ")[0] || "User"}
            </h1>
            <p className="page-header-subtitle">
              Here&apos;s an overview of your classroom attendance today.
            </p>
          </div>
          <div className="page-header-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={fetchData}
              disabled={loading}
            >
              <RefreshCw size={15} className={loading ? "spin" : ""} />
              <span>Refresh</span>
            </button>
            <Link href="/attendance" className="btn btn-primary">
              <Plus size={16} />
              <span>Mark Attendance</span>
            </Link>
          </div>
        </div>

        {/* 4 Statistics Cards */}
        <div className="stats-grid">
          <StatCard
            title="Total Students"
            value={totalStudents}
            subtitle="Section CSE-III-E"
            variant="default"
            badgeText="Enrolled"
            icon={<Users size={18} />}
          />
          <StatCard
            title="Present Today"
            value={presentCount}
            subtitle={`${Math.round((presentCount / (totalStudents || 1)) * 100)}% active rate`}
            variant="success"
            trend={{ value: "+3.1%", isPositive: true }}
            icon={<UserCheck size={18} />}
          />
          <StatCard
            title="Absent Today"
            value={absentCount}
            subtitle="Unexcused absentees"
            variant="danger"
            trend={{ value: "-1.2%", isPositive: false }}
            icon={<UserX size={18} />}
          />
          <StatCard
            title="Average Attendance"
            value={`${avgAttendance}%`}
            subtitle="Target threshold: 75%"
            variant="accent"
            badgeText="Good standing"
            icon={<TrendingUp size={18} />}
          />
        </div>

        {/* Main Charts & Analytics Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 20, marginBottom: 24 }}>
          {/* Attendance Trend Chart */}
          <div className="card">
            <div className="card-header">
              <div>
                <h3 className="card-title">
                  <TrendingUp size={18} style={{ color: "var(--accent)" }} />
                  <span>Attendance Overview</span>
                </h3>
                <p className="card-subtitle">Daily classroom attendance percentage</p>
              </div>
            </div>
            <AttendanceTrendChart />
          </div>

          {/* Subject-Wise Attendance Bar Chart */}
          <div className="card">
            <div className="card-header">
              <div>
                <h3 className="card-title">
                  <BookOpen size={18} style={{ color: "var(--accent)" }} />
                  <span>Subject-Wise Attendance</span>
                </h3>
                <p className="card-subtitle">Attendance rate by course code</p>
              </div>
            </div>
            {subjectStats.length > 0 ? (
              <SubjectBarChart data={subjectStats} />
            ) : (
              <div style={{ padding: 40, textAlign: "center", color: "var(--text-muted)" }}>
                Loading subject stats...
              </div>
            )}
          </div>
        </div>

        {/* Bottom Section: Low Attendance Alerts & Quick Actions */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          {/* Low Attendance Alert Card */}
          <div className="card">
            <div className="card-header">
              <div>
                <h3 className="card-title">
                  <AlertTriangle size={18} style={{ color: "var(--status-absent)" }} />
                  <span>Students Below 75% Requirement</span>
                </h3>
                <p className="card-subtitle">Requires immediate CR intervention</p>
              </div>
              <span className="badge badge-absent">{lowAttendance.length} At Risk</span>
            </div>

            {lowAttendance.length === 0 ? (
              <div style={{ padding: 24, textAlign: "center", color: "var(--text-muted)" }}>
                <CheckCircle2 size={24} style={{ color: "var(--status-present)", margin: "0 auto 8px" }} />
                <p>All students currently meet the 75% attendance threshold.</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {lowAttendance.map((s) => (
                  <div
                    key={s._id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "10px 14px",
                      borderRadius: "var(--radius-md)",
                      backgroundColor: "var(--bg-surface-subtle)",
                      border: "1px solid var(--border-subtle)",
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>{s.name}</div>
                      <div style={{ fontSize: "0.76rem", color: "var(--text-muted)" }}>
                        {s.rollNumber} • {s.department}
                      </div>
                    </div>
                    <span className="badge badge-absent" style={{ fontWeight: 700 }}>
                      {s.percentage}%
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions & Classroom Schedule Banner */}
          <div className="card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <div className="card-header">
                <div>
                  <h3 className="card-title">
                    <CalendarCheck size={18} style={{ color: "var(--accent)" }} />
                    <span>Quick Class Routine</span>
                  </h3>
                  <p className="card-subtitle">Manage sessions and student records</p>
                </div>
              </div>
              <p style={{ fontSize: "0.92rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                Record attendance period-by-period, view enrolled students, or download semester compliance reports.
              </p>
            </div>

            <div style={{ display: "flex", gap: 10, marginTop: 20, flexWrap: "wrap" }}>
              <Link href="/attendance" className="btn btn-primary" style={{ flex: 1 }}>
                <span>Take Attendance</span>
                <ArrowRight size={15} />
              </Link>
              <Link href="/reports" className="btn btn-secondary">
                <span>View Reports</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
