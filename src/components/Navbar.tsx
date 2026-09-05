"use client";

import { useAuth } from "@/context/AuthContext";

export default function Navbar({ title }: { title: string }) {
  const { user } = useAuth();

  return (
    <header className="navbar">
      <div className="page-title">{title}</div>
      <div className="nav-right">
        <div className="notification">
          🔔
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
