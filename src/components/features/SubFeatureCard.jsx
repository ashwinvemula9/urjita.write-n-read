import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const SubFeatureCard = ({ feature }) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    // Extract role from feature title and create path
    navigate(`/right-draw/${feature.role}`);
  };

  return (
    <button
      onClick={handleNavigate}
      className="w-full group bg-neutral-50 hover:bg-neutral-100
                 p-4 rounded-xl transition-all duration-200 
                 border border-neutral-200 hover:border-neutral-300
                 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
    >
      <div className="flex items-start gap-4">
        <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
          <feature.icon className="w-5 h-5 text-blue-600" />
        </div>
        <div className="flex-1 text-left">
          <div className="text-sm font-medium text-neutral-800 mb-1">
            {feature.title}
          </div>
          <div className="text-xs text-neutral-600 line-clamp-2 mb-2">
            {feature.description}
          </div>
          <div className="flex items-center text-xs text-blue-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
            <span>Launch</span>
            <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </button>
  );
};

export default SubFeatureCard;
