import React from "react";
import Header from "../components/Header";
import { Outlet } from "react-router-dom";
import FloatingSidebar from "../components/FloatingSidebar";

function MainLayout() {
  return (
    <div className="flex max-h-dvh w-full">
      <FloatingSidebar />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;
