"use client";

import { ReactNode } from "react";
import Sidebar from "@/components/Sidebar";
import { useSidebar } from "@/context/SidebarContext";

export default function AppShell({ children }: { children: ReactNode }) {
  const { isCollapsed } = useSidebar();

  return (
    <div className="app-layout">
      <Sidebar />
      <div className={`main-wrapper ${isCollapsed ? "sidebar-collapsed" : ""}`}>
        {children}
      </div>
    </div>
  );
}
