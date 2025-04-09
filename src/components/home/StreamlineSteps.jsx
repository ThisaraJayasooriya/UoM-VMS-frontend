import React from "react";
import { FaRegEdit, FaEnvelope, FaUserCheck, FaSmile } from "react-icons/fa";

const steps = [
  {
    icon: <FaRegEdit className="text-3xl text-[#124666]" />,
    title: "Pre-Register Your Visit",
    description: "Fill out the pre-registration form with your details.",
  },
  {
    icon: <FaEnvelope className="text-3xl text-[#124666]" />,
    title: "Receive Confirmation",
    description: "Get a unique confirmation code via SMS or email.",
  },
  {
    icon: <FaUserCheck className="text-3xl text-[#124666]" />,
    title: "Check-In at the Security Desk",
    description: "Provide your code to security personnel for verification.",
  },
  {
    icon: <FaSmile className="text-3xl text-[#124666]" />,
    title: "Enjoy Your Visit",
    description: "Your host will be notified of your arrival.",
  },
];

const StreamlineSteps = () => {
  return (
    <div className="w-full text-center bg-gradient-to-r from-[#124666] via-[#187599] to-[#208983] py-20 text-white">
      <h2 className="text-4xl font-bold mb-10">How We Streamline Your Visit</h2>
      <div className="flex justify-center gap-8 px-12">
        {steps.map((step, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-lg w-64 flex flex-col items-center gap-3 shadow-lg text-[#124666]"
          >
            <div className="step-icon">{step.icon}</div>
            <h4 className="text-xl font-semibold">{step.title}</h4>
            <p className="text-sm text-[#124666]/70 text-center">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StreamlineSteps;