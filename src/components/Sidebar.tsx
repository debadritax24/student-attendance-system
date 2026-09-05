"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  const isActive = (path: string) => pathname === path ? "nav-item active" : "nav-item";

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-icon">A</div>
        <h2>Attendify</h2>
      </div>

      <div className="nav-section">
        <div className="nav-title">Main</div>
        <Link href="/dashboard" className={isActive("/dashboard")}>📊 Dashboard</Link>
        <Link href="/attendance" className={isActive("/attendance")}>✓ Attendance</Link>
        <Link href="/students" className={isActive("/students")}>👥 Students</Link>
        <Link href="/subjects" className={isActive("/subjects")}>📚 Subjects</Link>
        <Link href="/reports" className={isActive("/reports")}>📈 Reports</Link>
        <Link href="/history" className={isActive("/history")}>🕒 History</Link>
      </div>

      <div className="nav-section">
        <div className="nav-title">Account</div>
        <Link href="/profile" className={isActive("/profile")}>👤 Profile</Link>
        <Link href="/settings" className={isActive("/settings")}>⚙ Settings</Link>
        <a href="#" onClick={(e) => { e.preventDefault(); logout(); }} className="nav-item">⇥ Logout</a>
      </div>
    </aside>
  );
}
