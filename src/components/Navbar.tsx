"use client";

import { useAuth } from "@/context/AuthContext";
import { useSidebar } from "@/context/SidebarContext";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { Menu, Bell, Calendar } from "lucide-react";
import Link from "next/link";

interface NavbarProps {
  title: string;
}

export default function Navbar({ title }: NavbarProps) {
  const { user } = useAuth();
  const { toggleSidebar } = useSidebar();

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(new Date());

  const getInitials = (n?: string) => {
    if (!n) return "U";
    return n
      .split(" ")
      .map((w) => w[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  const role = user?.role?.toUpperCase() || "CR";

  return (
    <header className="navbar">
      <div className="navbar-left">
        <button
          type="button"
          className="mobile-menu-btn"
          onClick={toggleSidebar}
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
        <h2 className="navbar-page-title">{title}</h2>
        <div className="navbar-date-pill">
          <Calendar size={13} />
          <span>{formattedDate}</span>
        </div>
      </div>

      <div className="navbar-right">
        {/* Theme Toggle Button */}
        <ThemeToggle />

        {/* Notifications */}
        <button
          type="button"
          className="btn-secondary"
          style={{ width: 36, height: 36, borderRadius: "50%", padding: 0, position: "relative" }}
          aria-label="Notifications"
          title="Notifications"
        >
          <Bell size={16} />
          <span
            style={{
              position: "absolute",
              top: 7,
              right: 8,
              width: 7,
              height: 7,
              borderRadius: "50%",
              backgroundColor: "var(--accent)",
            }}
          />
        </button>

        {/* User Pill */}
        <Link
          href="/profile"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "4px 10px 4px 4px",
            borderRadius: "var(--radius-full)",
            border: "1px solid var(--border)",
            backgroundColor: "var(--bg-surface)",
          }}
        >
          <div className="avatar" style={{ width: 30, height: 30, fontSize: "0.75rem" }}>
            {getInitials(user?.name)}
          </div>
          <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.1 }}>
            <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--text-primary)" }}>
              {user?.name?.split(" ")[0] || "User"}
            </span>
            <span style={{ fontSize: "0.68rem", color: "var(--text-muted)", textTransform: "uppercase" }}>
              {role}
            </span>
          </div>
        </Link>
      </div>
    </header>
  );
}
