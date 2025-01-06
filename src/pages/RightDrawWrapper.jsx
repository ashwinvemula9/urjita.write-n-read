import React from 'react';
import { useAuth } from '../context/AuthContext';
import ReviewerInterface from './rightdraw-interfaces/ReviewerInterface';
import DesignerInterface from './rightdraw-interfaces/DesignerInterface';

const RightDrawWrapper = () => {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  switch (user.userType) {
    case 'designer':
      return <DesignerInterface />;
    case 'reviewer':
      return <ReviewerInterface />;
    case 'approver':
      // TODO: Create and render ApproverInterface component
      return <div>Approver Interface Coming Soon</div>;
    default:
      return <div>Access Denied</div>;
  }
};

export default RightDrawWrapper;