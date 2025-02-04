import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import VerifierInterface from "./rightdraw-interfaces/VerifierInterface";
import DesignerInterface from "./rightdraw-interfaces/DesignerInterface";
import ApproverInterface from "./rightdraw-interfaces/ApproverInterface";
import AdminInterface from "./rightdraw-interfaces/AdminInterface";

const RightDrawWrapper = () => {
  const navigate = useNavigate();
  const { role } = useParams(); // Get the role from URL params
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;

  // Redirect if no user
  if (!user) {
    navigate("/login");
    return null;
  }

  // Check if user has roles
  if (!Array.isArray(user.role) || user.role.length === 0) {
    console.error("User roles are undefined or empty");
    return <div>Invalid User Role</div>;
  }

  // Check if the requested role is one of the user's assigned roles
  if (!user.role.includes(role)) {
    console.error("User does not have access to this role interface");
    navigate("/"); // Redirect to home if role is not authorized
    return null;
  }

  // Render interface based on URL role parameter
  switch (role) {
    case "CADesigner":
      return <DesignerInterface />;
    case "Verifier":
      return <VerifierInterface />;
    case "Approver":
      return <ApproverInterface />;
    case "Admin":
      return <AdminInterface />;
    default:
      navigate("/"); // Redirect to home if role is invalid
      return null;
  }
};

export default RightDrawWrapper;
