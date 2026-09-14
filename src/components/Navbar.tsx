"use client";

import { useAuth } from "@/context/AuthContext";
import { useSidebar } from "@/context/SidebarContext";
import { Bell, Menu } from "lucide-react";

export default function Navbar({ title }: { title: string }) {
  const { user } = useAuth();
  const { toggleSidebar } = useSidebar();

  return (
    <header className="navbar">
      <div className="navbar-left">
        <button className="mobile-menu-btn" onClick={toggleSidebar} aria-label="Toggle menu">
          <Menu size={22} />
        </button>
        <div className="page-title">{title}</div>
      </div>
      <div className="nav-right">
        <div className="notification">
          <Bell size={18} />
          <span className="notification-dot"></span>
        </div>
        <div className="user">
          <div className="avatar">
            {user?.name ? user.name.split(" ").map((w: string) => w[0]).join("").substring(0, 2).toUpperCase() : "U"}
          </div>
          <div className="user-info">
            <strong>{user?.name || "User"}</strong>
            <small>{user?.role || ""}</small>
          </div>
        </div>
      </div>
    </header>
  );
}
