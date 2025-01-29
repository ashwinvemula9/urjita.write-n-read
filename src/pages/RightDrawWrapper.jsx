import React from 'react';
import VerifierInterface from './rightdraw-interfaces/VerifierInterface';
import DesignerInterface from './rightdraw-interfaces/DesignerInterface';
import ApproverInterface from './rightdraw-interfaces/ApproverInterface';
import AdminInterface from './rightdraw-interfaces/AdminInterface'
import { useNavigate } from 'react-router-dom';

const RightDrawWrapper = () => {
  const navigate = useNavigate();
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;

  // Redirect if no user
  if (!user) {
    navigate("/login");
    return null; // Add return statement to prevent further execution
  }

  // Add check for user.role
  if (!user.role[0]) {
    console.error("User role is undefined");
    return <div>Invalid User Role</div>;
  }

  console.log("Current user role:", user.role);

  switch (user.role[0]) {
    case 'CADesigner':
      return <DesignerInterface />;
    case 'Verifier':
      return <VerifierInterface />;
    case 'Approver':
      return <ApproverInterface />;
    case 'Admin':
      return <AdminInterface />;
    default:
      return <div>Access Denied: Invalid Role</div>;
  }
};

export default RightDrawWrapper;