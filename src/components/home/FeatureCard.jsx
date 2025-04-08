import React from "react";

const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className="bg-white rounded-lg p-5 flex items-center gap-4 w-[350px] shadow-lg transition-transform duration-300 hover:-translate-y-1">
      <div className="text-3xl text-[#124E66]">{icon}</div>
      <div>
        <h3 className="text-lg font-bold text-[#124E66]">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  );
};

export default FeatureCard;
