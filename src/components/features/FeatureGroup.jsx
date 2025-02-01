import React from "react";
import SubFeatureCard from "./SubFeatureCard";

const FeatureGroup = ({ feature }) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <div className="flex items-center gap-4 mb-6">
        {feature.icon && (
          <div className="p-3 bg-blue-50 rounded-xl">
            <feature.icon className="w-6 h-6 text-blue-600" />
          </div>
        )}
        <div>
          <h2 className="text-2xl font-semibold text-neutral-800">
            {feature.title}
          </h2>
          <p className="text-neutral-600">{feature.description}</p>
        </div>
      </div>

      {feature.subFeatures && feature.subFeatures.length > 0 && (
        <div className="grid grid-cols-1 gap-4">
          {feature.subFeatures.map((subFeature, index) => (
            <SubFeatureCard key={index} feature={subFeature} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FeatureGroup;
