import React from "react";
import Header from "./components/Header";
import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";

export default function Layout() {
  return (
    <div>
      <Header />
      <Toaster position="bottom-right" toastOptions={{ duration: 4000 }} />
      <Outlet />
    </div>
  );
}
