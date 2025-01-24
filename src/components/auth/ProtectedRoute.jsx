import { Navigate, useLocation } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;
  console.log("IN PROTECTED ROUTE", user?.role);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}