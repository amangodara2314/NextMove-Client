import React from "react";
import Header from "../components/Header";
import { Outlet } from "react-router-dom";
import { AppSidebar } from "../components/sidebar/AppSidebar";
import { SidebarProvider } from "../components/ui/sidebar";

function MainLayout() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />

        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  );
}

export default MainLayout;
