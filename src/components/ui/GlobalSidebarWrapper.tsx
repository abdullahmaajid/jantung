"use client";

// GlobalSidebarWrapper.tsx
// Wrapper client component agar NavigationSidebar bisa dirender
// di root layout yang server-side.
// Sidebar ini muncul di SEMUA halaman secara global.

import useHeartStore from "@/store/heartStore";
import NavigationSidebar from "@/components/ui/NavigationSidebar";

export default function GlobalSidebarWrapper() {
  const isSidebarVisible = useHeartStore((state) => state.isSidebarVisible);

  return <NavigationSidebar isVisible={isSidebarVisible} />;
}
