import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Layout = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  return (
    <div className="min-h-screen  bg-neutral-900 ">
      {!isLoginPage && <Navbar />}
      <ToastContainer
        position="top-center" // Center it at the top
        autoClose={3000}
        hideProgressBar={true}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        style={{
          zIndex: 9999,
          top: "20px", // Some space from the top of the screen
        }}
        toastStyle={{
          minHeight: "80px",
          minWidth: "300px",
          maxWidth: "400px",
          borderRadius: "15px",
          backgroundColor: "#fff",
          color: "#333",
          fontSize: "16px",
          padding: "20px 25px",
          boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
          transition: "transform 0.3s ease-in-out",
        }}
      />

      <main>
        {" "}
        {/* 2rem matches navbar height */}
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
