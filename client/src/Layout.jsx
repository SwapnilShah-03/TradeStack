import React from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { Backdrop, CircularProgress } from "@mui/material";
import { useNavigation } from "react-router-dom";

export default function Layout() {
  const navigation = useNavigation();
  return (
    <>
      <Header />
      <Toaster
        position="bottom-right"
        toastOptions={{ duration: 4000 }}
        containerClassName="font-Poppins"
      />
      {navigation.state === "loading" ? (
        <Backdrop
          sx={{
            color: "#fff",
          }}
          open={true}
        >
          <div className="flex flex-col items-center justify-center gap-3 text-xs sm:text-base">
            <CircularProgress color="inherit" />
            Have patience, we are loading your data...
          </div>
        </Backdrop>
      ) : (
        <Outlet />
      )}
      {navigation.state !== "loading" && <Footer />}
    </>
  );
}
