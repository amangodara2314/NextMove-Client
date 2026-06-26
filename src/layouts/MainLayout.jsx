import React from "react";
import Header from "../components/Header";
import { Outlet } from "react-router-dom";
import FloatingSidebar from "../components/FloatingSidebar";

function MainLayout() {
  return (
    <div className="h-dvh w-full">
      <FloatingSidebar />
      <main className="h-full">
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;
