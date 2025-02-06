import React from "react";
import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TOAST_CONFIG = {
  position: "top-center",
  autoClose: 4000,
  hideProgressBar: true,
  newestOnTop: true,
  closeOnClick: true,
  rtl: false,
  pauseOnFocusLoss: true,
  draggable: true,
  draggablePercent: 80,
  pauseOnHover: true,
  theme: "dark",
  style: {
    borderRadius: "8px",
    padding: "12px",
    opacity: 0.98,
  },
  bodyStyle: {
    fontWeight: "500",
    textAlign: "left",
    marginRight: "40px",
  },
  closeButton: (
    <span
      style={{
        cursor: "pointer",
        fontSize: "20px",
        color: "#d9d9d9",
      }}
    >
      &#10005;
    </span>
  ),
};

const Layout = () => {
  const [showDashboard, setShowDashboard] = useState(false);
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  return (
    <div className="min-h-screen  bg-neutral-900 ">
      {!isLoginPage && (
        <Navbar
          showDashboard={showDashboard}
          setShowDashboard={setShowDashboard}
        />
      )}
      <ToastContainer {...TOAST_CONFIG} />

      <main>
        {" "}
        {/* 2rem matches navbar height */}
        <Outlet context={{ showDashboard, setShowDashboard }} />
      </main>
    </div>
  );
};

export default Layout;
