import { Outlet } from 'react-router-dom';
// import Navbar from './Navbar';

export default function Layout() {
  return (
    <div>
      {/* <Navbar /> */}
      <main className="container mx-auto px-4">
        <Outlet />
      </main>
    </div>
  );
}