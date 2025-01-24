import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Layout = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <main className="h-[calc(100vh-2rem)]"> {/* 2rem matches navbar height */}
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;