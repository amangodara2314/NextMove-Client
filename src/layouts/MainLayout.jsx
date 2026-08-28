import React from "react";
import Header from "../components/Header";
import { Outlet } from "react-router-dom";
import FloatingSidebar from "../components/FloatingSidebar";
import useRatings from "../hooks/useRatings";

function MainLayout() {
  useRatings();

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
