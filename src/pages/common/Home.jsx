import React from 'react';
import {
  FaCalendarCheck,
  FaUserCheck,
  FaBell,
  FaArrowRight,
} from "react-icons/fa";
import FeatureCard from "../../components/home/FeatureCard";
import StreamlineSteps from "../../components/home/StreamlineSteps";
import Footer from "../../components/home/Footer";
import bgImage from "../../assets/bg.jpg";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="overflow-x-hidden">
      {/* Hero Section */}
      <div
        className="relative h-screen w-full bg-cover bg-center flex items-center"
        style={{
          backgroundImage: `linear-gradient(rgba(3, 33, 57, 0.85), rgba(3, 33, 57, 0.85)), url(${bgImage})`,
          backgroundPosition: "center center",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="relative w-full px-6 z-10">
          <div className="max-w-6xl mx-auto flex flex-col justify-center items-start text-white pt-24">
            {/* Title & Subtitle */}
            <div className="mb-8 backdrop-blur-sm bg-white/5 p-6 rounded-lg shadow-md">
              <h1 className="text-4xl md:text-6xl font-semibold leading-tight font-[Abhaya Libre] mb-2 text-[#D3D9D4]">
                Visitor Management System
              </h1>
              <p className="text-lg md:text-xl font-[Abhaya Libre] text-[#B0BEC5]">
                University of Moratuwa
              </p>
            </div>

            {/* Description */}
            <p className="text-base md:text-lg text-[#D3D9D4] max-w-xl mt-4 leading-relaxed mb-10">
              Seamlessly manage visitor flow with secure pre-registration, identity verification,
              and instant host notifications — ensuring a smarter, safer, and smoother visit.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                className="px-8 py-4 bg-white text-[#124E66] font-bold rounded-md hover:bg-[#f0f0f0] transition-colors duration-300 flex items-center gap-2"
                onClick={() => navigate("/signup")}
              >
                Sign Up <FaArrowRight />
              </button>
              <button
                className="px-8 py-4 bg-[#124E66] text-white font-bold border border-[#124E66] rounded-md hover:bg-[#0e3d52] transition-colors duration-300 flex items-center gap-2"
                onClick={() => navigate("/login")}
              >
                Log In <FaArrowRight />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-gradient-to-b from-[#D3D9D4] to-[#f5f7f6]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-light text-[#124E66] mb-4">
              Key Features
            </h2>
            <div className="w-24 h-1 bg-[#748D92] mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<FaCalendarCheck className="text-4xl text-[#124E66] mb-4" />}
              title="Sign Up & Request Appointments"
              description="Create an account and request appointments with your host."
              bgColor="bg-white"
              borderColor="border-[#124E66]"
            />
            <FeatureCard
              icon={<FaUserCheck className="text-4xl text-[#124E66] mb-4" />}
              title="Secure Check-In"
              description="Verify your identity at the security desk using your unique code."
              bgColor="bg-white"
              borderColor="border-[#124E66]"
            />
            <FeatureCard
              icon={<FaBell className="text-4xl text-[#124E66] mb-4" />}
              title="Real-Time Notifications"
              description="Hosts receive instant notifications when visitors arrive."
              bgColor="bg-white"
              borderColor="border-[#124E66]"
            />
          </div>
        </div>
      </div>

      <StreamlineSteps />
      <Footer />
    </div>
  );
}

export default Home;
