"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

interface SidebarContextType {
  sidebarOpen: boolean; // For mobile drawer
  isCollapsed: boolean; // For desktop collapsed state
  toggleSidebar: () => void;
  closeSidebar: () => void;
  toggleCollapse: () => void;
  setCollapsed: (collapsed: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType>({
  sidebarOpen: false,
  isCollapsed: false,
  toggleSidebar: () => {},
  closeSidebar: () => {},
  toggleCollapse: () => {},
  setCollapsed: () => {},
});

export function useSidebar() {
  return useContext(SidebarContext);
}

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("attendify_sidebar_collapsed");
    if (saved === "true") {
      setIsCollapsed(true);
    }
  }, []);

  const toggleSidebar = useCallback(() => setSidebarOpen((prev) => !prev), []);
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  const toggleCollapse = useCallback(() => {
    setIsCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem("attendify_sidebar_collapsed", String(next));
      return next;
    });
  }, []);

  const setCollapsed = useCallback((val: boolean) => {
    setIsCollapsed(val);
    localStorage.setItem("attendify_sidebar_collapsed", String(val));
  }, []);

  return (
    <SidebarContext.Provider
      value={{
        sidebarOpen,
        isCollapsed,
        toggleSidebar,
        closeSidebar,
        toggleCollapse,
        setCollapsed,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}
