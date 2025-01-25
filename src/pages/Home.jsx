import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { FileText } from 'lucide-react';
import {FeatureCard} from '../components/common/FeatureCard';



const Home = () => {
  const navigate = useNavigate();
  console.log("IN HOME");
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;
  if(!user){
    navigate("/login");
  }
  

  
  let description = "";
  if(user.role === "CADesigner"){
    description = "Design and manage components.";
  }else if(user.role === "admin"){
    description = "Manage users and permissions with our advanced user management tools.";
  }else if(user.role === "Verifier"){
    description = "Verify the designs";
  }else if(user.role === "Approver"){
    description = "Approve the designs";
  }




  const features = [
    {
      title: 'RightDraw',
      description: description,
      icon: FileText,
      path: '/right-draw'
    },
  ];

  return user ? (
    <div className="bg-neutral-900 h-full">
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome back, {user.role}</h1>
          <p className="text-neutral-400">Select a tool to get started with your project</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              {...feature}
              onClick={() => navigate(feature.path)}
            />
          ))}
        </div>
      </div>
    </div>
  ) : null;
};

export default Home;