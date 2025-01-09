import React from 'react';
import { useAuth } from '../context/AuthContext';
import ReviewerInterface from './rightdraw-interfaces/ReviewerInterface';
import DesignerInterface from './rightdraw-interfaces/DesignerInterface';
import AdminInterface from './rightdraw-interfaces/AdminInterface'
const RightDrawWrapper = () => {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  switch (user.userType) {
    case 'CADesigner':
      return <DesignerInterface />;
    case 'Reviewer':
      return <ReviewerInterface />;
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