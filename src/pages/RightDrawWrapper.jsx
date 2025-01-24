import React from 'react';
import VerifierInterface from './rightdraw-interfaces/VerifierInterface';
import DesignerInterface from './rightdraw-interfaces/DesignerInterface';
import AdminInterface from './rightdraw-interfaces/AdminInterface'
import { useNavigate } from 'react-router-dom';
const RightDrawWrapper = () => {
  const navigate = useNavigate();
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;
  if(!user){
   navigate("/login");
        }

  console.log({"in right draw wrapper":user});

  switch (user.role) {
    case 'CADesigner':
      return <DesignerInterface />;
    case 'Verifier':
      return <VerifierInterface />;
    case 'Approver':
      // TODO: Create and render ApproverInterface component
      return <div>Approver Interface Coming Soon</div>;
      case 'Admin':
        // TODO: Create and render ApproverInterface component
        return <AdminInterface/>;
    default:
      return <div>Access Denied</div>;
  }
};

export default RightDrawWrapper;