import React from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";

export default function Layout() {
  return (
    <>
      <Header />
      <Toaster
        position="bottom-right"
        toastOptions={{ duration: 4000 }}
        containerClassName="font-Poppins"
      />
      <Outlet />
      <Footer />
    </>
  );
}
