import { FileText } from "lucide-react";

export const getRoleFeatures = (user) => {
  if (!user || !user.role) return [];

  const roleFeatures = [];
  const roles = Array.isArray(user.role) ? user.role : [user.role];

  roles.forEach((role) => {
    let feature = {
      icon: FileText,
      path: "/right-draw",
    };

    switch (role) {
      case "CADesigner":
        feature = {
          ...feature,
          title: "Design PCB",
          description: "Create and manage PCB designs",
        };
        break;
      case "Verifier":
        feature = {
          ...feature,
          title: "Verify PCB",
          description: "Review and verify PCB designs",
        };
        break;
      case "Approver":
        feature = {
          ...feature,
          title: "Approve PCB",
          description: "Approve PCB designs for production",
        };
        break;
      default:
        return;
    }
    roleFeatures.push(feature);
  });

  return roleFeatures;
};

export const getFeatures = (user) => [
  {
    title: "RightDraw",
    description: "PCB Design and Management Tools",
    icon: FileText,
    subFeatures: getRoleFeatures(user),
  },
  // Add new main features here
  // Example:
  // {
  //   title: "AutoDraw",
  //   description: "Automated PCB Design Tools",
  //   icon: FileText,
  //   subFeatures: getAutoDrawFeatures(user),
  // },
];
