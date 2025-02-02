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
        position="top-center" // Position the toast at the top-center of the screen.
        autoClose={4000} // Toast will auto-close after 4 seconds.
        hideProgressBar={true} // No progress bar, for a cleaner look.
        newestOnTop={true} // New toasts will appear above the older ones.
        closeOnClick={true} // Toast can be closed by clicking on it.
        rtl={false} // Left-to-right text direction.
        pauseOnHover={true} // Pauses the auto-close when hovered over.
        theme="light" // Light theme for a clean and modern look.
        style={{
          zIndex: 9999, // Ensures the toast is above other UI elements.
          top: "30px", // Adds space from the top of the screen.
          width: "100%", // Makes the toast container take up full width.
          maxWidth: "500px", // Limits the maximum width of the toast.
          margin: "0 auto", // Centers the toast horizontally.
        }}
        toastStyle={{
          minHeight: "80px", // Minimum height for the toast for a consistent look.
          borderRadius: "12px", // Rounded corners for a more modern appearance.
          backgroundColor: "#ffffff", // Clean white background.
          color: "#333", // Dark text for readability.
          fontSize: "16px", // Comfortable font size.
          padding: "18px 25px", // Sufficient padding for good spacing.
          boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)", // Soft shadow for depth.
          transition: "transform 0.3s ease, opacity 0.3s ease", // Smooth animations.
          display: "flex", // Flexbox layout to align items.
          alignItems: "center", // Vertically center the content.
          justifyContent: "space-between", // Space between the text and close button.
          opacity: 0.98, // Slight transparency for a soft, polished look.
        }}
        bodyStyle={{
          fontWeight: "500", // Medium weight for a balanced look.
          textAlign: "left", // Left-aligned for natural reading.
          marginRight: "40px", // Space for the close icon on the right.
        }}
        closeButton={
          <span
            style={{
              cursor: "pointer", // Make the close button clickable.
              fontSize: "20px", // Slightly larger close icon for better visibility.
              color: "#FF6F61", // Accent color for the close icon, giving it a modern look.
            }}
          >
            &#10005; {/* Custom close icon ("×") */}
          </span>
        }
        draggable={true} // Allow users to drag the toast around.
        draggablePercent={80} // Toast can be dragged up to 80% of its width.
        pauseOnFocusLoss={true} // Pause the auto-close when the window loses focus.
        onClick={() => console.log("Toast clicked!")} // Action when clicked.
        onClose={() => console.log("Toast closed!")} // Action when closed.
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
