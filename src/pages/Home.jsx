import React from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import AdminInterface from "./rightdraw-interfaces/AdminInterface";
import FeatureGroup from "../components/features/FeatureGroup";
import { getFeatures } from "../config/features";

const Home = () => {
  const navigate = useNavigate();
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  // If user is an Admin, show AdminInterface
  if (user && Array.isArray(user.role) && user.role.includes("Admin")) {
    return <AdminInterface />;
  }

  const features = getFeatures(user);

  return user ? (
    <div className="min-h-screen bg-gradient-to-b from-neutral-900 to-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-white mb-3">
            Welcome back, {user.full_name}
          </h1>
          <p className="text-lg text-neutral-300">
            Select a tool to get started with your project
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <FeatureGroup
              key={index}
              feature={{
                ...feature,
                icon: feature.title === "RightDraw" ? null : feature.icon,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  ) : null;
};

export default Home;
