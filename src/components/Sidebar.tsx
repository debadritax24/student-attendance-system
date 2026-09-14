"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useSidebar } from "@/context/SidebarContext";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  TrendingUp,
  CheckCircle,
  Clock,
  User,
  Settings,
  LogOut,
  LayoutList,
} from "lucide-react";

export default function Sidebar({ open, onClose }: { open?: boolean; onClose?: () => void }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const role = user?.role;

  const isActive = (path: string) => pathname === path ? "nav-item active" : "nav-item";

  return (
    <>
      <div className={`sidebar-overlay ${open ? "active" : ""}`} onClick={onClose} />
      <aside className={`sidebar ${open ? "open" : ""}`}>
        <div className="sidebar-brand">
          <div className="brand-icon">
            <LayoutList size={18} strokeWidth={2.5} />
          </div>
          <h2>Attendify</h2>
        </div>

        <div className="nav-section">
          <div className="nav-title">Main</div>
          {role === "ADMIN" && (
            <>
              <Link href="/admin" className={isActive("/admin")} onClick={onClose}>
                <LayoutDashboard size={18} /> Dashboard
              </Link>
              <Link href="/students" className={isActive("/students")} onClick={onClose}>
                <Users size={18} /> Students
              </Link>
              <Link href="/subjects" className={isActive("/subjects")} onClick={onClose}>
                <BookOpen size={18} /> Subjects
              </Link>
              <Link href="/reports" className={isActive("/reports")} onClick={onClose}>
                <TrendingUp size={18} /> Reports
              </Link>
            </>
          )}
          {role === "CR" && (
            <>
              <Link href="/cr" className={isActive("/cr")} onClick={onClose}>
                <LayoutDashboard size={18} /> Dashboard
              </Link>
              <Link href="/attendance" className={isActive("/attendance")} onClick={onClose}>
                <CheckCircle size={18} /> Attendance
              </Link>
              <Link href="/students" className={isActive("/students")} onClick={onClose}>
                <Users size={18} /> Students
              </Link>
              <Link href="/subjects" className={isActive("/subjects")} onClick={onClose}>
                <BookOpen size={18} /> Subjects
              </Link>
              <Link href="/reports" className={isActive("/reports")} onClick={onClose}>
                <TrendingUp size={18} /> Reports
              </Link>
              <Link href="/history" className={isActive("/history")} onClick={onClose}>
                <Clock size={18} /> History
              </Link>
            </>
          )}
          {role === "STUDENT" && (
            <>
              <Link href="/dashboard" className={isActive("/dashboard")} onClick={onClose}>
                <LayoutDashboard size={18} /> Dashboard
              </Link>
              <Link href="/attendance" className={isActive("/attendance")} onClick={onClose}>
                <CheckCircle size={18} /> Attendance
              </Link>
              <Link href="/subjects" className={isActive("/subjects")} onClick={onClose}>
                <BookOpen size={18} /> Subjects
              </Link>
              <Link href="/history" className={isActive("/history")} onClick={onClose}>
                <Clock size={18} /> History
              </Link>
            </>
          )}
        </div>

        <div className="nav-section">
          <div className="nav-title">Account</div>
          <Link href="/profile" className={isActive("/profile")} onClick={onClose}>
            <User size={18} /> Profile
          </Link>
          <Link href="/settings" className={isActive("/settings")} onClick={onClose}>
            <Settings size={18} /> Settings
          </Link>
          <a href="#" onClick={(e) => { e.preventDefault(); logout(); onClose?.(); }} className="nav-item">
            <LogOut size={18} /> Logout
          </a>
        </div>
      </aside>
    </>
  );
}
