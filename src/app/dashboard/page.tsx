"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";

export default function DashboardPage() {
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  return (
    <AppShell>
      <Navbar title="Dashboard" />
      <section className="content">
        <div className="page-header">
          <div>
            <h1>Good Evening, {user?.name?.split(" ")[0] || "User"} 👋</h1>
            <p>Here&apos;s what&apos;s happening with attendance today.</p>
          </div>
          <a href="/attendance" className="btn btn-primary">+ Mark Attendance</a>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-header">Total Students</div>
            <div className="stat-value">120</div>
            <div className="stat-change success">Active students</div>
          </div>
          <div className="stat-card">
            <div className="stat-header">Present Today</div>
            <div className="stat-value">108</div>
            <div className="stat-change success">+5 from yesterday</div>
          </div>
          <div className="stat-card">
            <div className="stat-header">Absent Today</div>
            <div className="stat-value">12</div>
            <div className="stat-change danger">10% absent</div>
          </div>
          <div className="stat-card">
            <div className="stat-header">Attendance</div>
            <div className="stat-value">90%</div>
            <div className="stat-change success">+2.4% this week</div>
          </div>
        </div>

        <div className="card">
          <div className="card-title">Students With Low Attendance</div>
          <div className="table-container">
            <table>
              <thead>
                <tr><th>Roll No</th><th>Student</th><th>Department</th><th>Attendance</th><th>Status</th></tr>
              </thead>
              <tbody>
                <tr>
                  <td>AU003</td><td>Aditya Roy</td><td>CSE</td><td>72%</td>
                  <td><span className="badge badge-warning">Warning</span></td>
                </tr>
                <tr>
                  <td>AU005</td><td>Rahul Sen</td><td>CSE</td><td>69%</td>
                  <td><span className="badge badge-absent">Critical</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
