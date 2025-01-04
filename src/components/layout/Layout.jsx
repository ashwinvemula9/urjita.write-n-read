import { Outlet } from 'react-router-dom';
// import Navbar from './Navbar';
import { ToastContainer } from 'react-toastify';

export default function Layout() {
  return (
    <>
      {/* <Navbar /> */}
      <ToastContainer/>
      <main>
        <Outlet />
      </main>
    </>
  );
}