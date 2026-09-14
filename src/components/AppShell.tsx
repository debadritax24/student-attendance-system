"use client";

import { ReactNode } from "react";
import Sidebar from "@/components/Sidebar";
import { useSidebar } from "@/context/SidebarContext";

export default function AppShell({ children }: { children: ReactNode }) {
  const { sidebarOpen, closeSidebar } = useSidebar();

  return (
    <div className="app">
      <Sidebar open={sidebarOpen} onClose={closeSidebar} />
      <main className="main">
        {children}
      </main>
    </div>
  );
}
