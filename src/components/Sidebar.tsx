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
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { sidebarOpen, closeSidebar, isCollapsed, toggleCollapse } = useSidebar();
  const role = user?.role?.toUpperCase() || "CR";

  const isActive = (path: string) => (pathname === path ? "active" : "");

  const getInitials = (n?: string) => {
    if (!n) return "U";
    return n
      .split(" ")
      .map((w) => w[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <>
      <div
        className={`sidebar-overlay ${sidebarOpen ? "active" : ""}`}
        onClick={closeSidebar}
        aria-hidden="true"
      />
      <aside className={`sidebar ${sidebarOpen ? "open" : ""} ${isCollapsed ? "collapsed" : ""}`}>
        {/* Brand Header */}
        <div className="sidebar-header">
          <Link href={role === "ADMIN" ? "/admin" : role === "CR" ? "/cr" : "/dashboard"} className="sidebar-brand">
            <div className="brand-mark">
              <Sparkles size={18} strokeWidth={2.3} />
              <div className="brand-dot" />
            </div>
            {!isCollapsed && (
              <div className="brand-text">
                <span className="brand-name">Attendify</span>
                <span className="brand-badge">College Edition</span>
              </div>
            )}
          </Link>
          <button
            type="button"
            className="sidebar-collapse-toggle"
            onClick={toggleCollapse}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {/* Navigation Sections */}
        <div className="sidebar-nav">
          <div className="nav-group">
            <div className="nav-group-title">{isCollapsed ? "•••" : "Main Menu"}</div>
            <ul className="nav-links">
              {role === "ADMIN" && (
                <>
                  <li>
                    <Link href="/admin" className={`nav-link ${isActive("/admin")}`} onClick={closeSidebar} title="Dashboard">
                      <span className="nav-link-icon"><LayoutDashboard size={18} /></span>
                      <span className="nav-link-text">Dashboard</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/students" className={`nav-link ${isActive("/students")}`} onClick={closeSidebar} title="Students">
                      <span className="nav-link-icon"><Users size={18} /></span>
                      <span className="nav-link-text">Students</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/subjects" className={`nav-link ${isActive("/subjects")}`} onClick={closeSidebar} title="Subjects">
                      <span className="nav-link-icon"><BookOpen size={18} /></span>
                      <span className="nav-link-text">Subjects</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/reports" className={`nav-link ${isActive("/reports")}`} onClick={closeSidebar} title="Reports">
                      <span className="nav-link-icon"><TrendingUp size={18} /></span>
                      <span className="nav-link-text">Reports</span>
                    </Link>
                  </li>
                </>
              )}

              {role === "CR" && (
                <>
                  <li>
                    <Link href="/cr" className={`nav-link ${isActive("/cr")}`} onClick={closeSidebar} title="Dashboard">
                      <span className="nav-link-icon"><LayoutDashboard size={18} /></span>
                      <span className="nav-link-text">Dashboard</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/attendance" className={`nav-link ${isActive("/attendance")}`} onClick={closeSidebar} title="Attendance">
                      <span className="nav-link-icon"><CheckCircle size={18} /></span>
                      <span className="nav-link-text">Attendance</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/students" className={`nav-link ${isActive("/students")}`} onClick={closeSidebar} title="Students">
                      <span className="nav-link-icon"><Users size={18} /></span>
                      <span className="nav-link-text">Students</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/subjects" className={`nav-link ${isActive("/subjects")}`} onClick={closeSidebar} title="Subjects">
                      <span className="nav-link-icon"><BookOpen size={18} /></span>
                      <span className="nav-link-text">Subjects</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/reports" className={`nav-link ${isActive("/reports")}`} onClick={closeSidebar} title="Reports">
                      <span className="nav-link-icon"><TrendingUp size={18} /></span>
                      <span className="nav-link-text">Reports</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/history" className={`nav-link ${isActive("/history")}`} onClick={closeSidebar} title="History">
                      <span className="nav-link-icon"><Clock size={18} /></span>
                      <span className="nav-link-text">History</span>
                    </Link>
                  </li>
                </>
              )}

              {role === "STUDENT" && (
                <>
                  <li>
                    <Link href="/dashboard" className={`nav-link ${isActive("/dashboard")}`} onClick={closeSidebar} title="Dashboard">
                      <span className="nav-link-icon"><LayoutDashboard size={18} /></span>
                      <span className="nav-link-text">Dashboard</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/attendance" className={`nav-link ${isActive("/attendance")}`} onClick={closeSidebar} title="Attendance">
                      <span className="nav-link-icon"><CheckCircle size={18} /></span>
                      <span className="nav-link-text">Attendance</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/subjects" className={`nav-link ${isActive("/subjects")}`} onClick={closeSidebar} title="Subjects">
                      <span className="nav-link-icon"><BookOpen size={18} /></span>
                      <span className="nav-link-text">Subjects</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/history" className={`nav-link ${isActive("/history")}`} onClick={closeSidebar} title="History">
                      <span className="nav-link-icon"><Clock size={18} /></span>
                      <span className="nav-link-text">History</span>
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>

          <div className="nav-group">
            <div className="nav-group-title">{isCollapsed ? "•••" : "Preferences"}</div>
            <ul className="nav-links">
              <li>
                <Link href="/profile" className={`nav-link ${isActive("/profile")}`} onClick={closeSidebar} title="Profile">
                  <span className="nav-link-icon"><User size={18} /></span>
                  <span className="nav-link-text">Profile</span>
                </Link>
              </li>
              <li>
                <Link href="/settings" className={`nav-link ${isActive("/settings")}`} onClick={closeSidebar} title="Settings">
                  <span className="nav-link-icon"><Settings size={18} /></span>
                  <span className="nav-link-text">Settings</span>
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => { logout(); closeSidebar(); }}
                  className="nav-link"
                  style={{ width: "100%", textAlign: "left" }}
                  title="Logout"
                >
                  <span className="nav-link-icon"><LogOut size={18} /></span>
                  <span className="nav-link-text">Logout</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer User Card */}
        <div className="sidebar-footer">
          <Link href="/profile" className="user-mini-card" onClick={closeSidebar}>
            <div className="avatar">
              {getInitials(user?.name)}
            </div>
            {!isCollapsed && (
              <div className="user-mini-info">
                <div className="user-mini-name">{user?.name || "User"}</div>
                <div className="user-mini-role">
                  {role === "CR" ? "Class Representative" : role === "ADMIN" ? "Administrator" : "Student"}
                </div>
              </div>
            )}
          </Link>
        </div>
      </aside>
    </>
  );
}
