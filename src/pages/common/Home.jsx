import React from 'react';
import { FaCalendarCheck, FaUserCheck, FaBell } from "react-icons/fa";
import FeatureCard from "../../components/home/FeatureCard";
import StreamlineSteps from '../../components/home/StreamlineSteps'; 
import Footer from "../../components/home/Footer";
import bgImage from "../../assets/bg.jpg";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div>
      {/* Background Container */}
      <div 
        className="relative h-screen w-full bg-cover bg-center flex items-center"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-[#032139]/80"></div>

        {/* Content */}
        <div className="relative w-11/12 mx-auto text-white z-10">
          <div className="flex flex-col gap-16 justify-center h-[calc(100vh-8rem)]">
            <div className="mt-36">
              <p className="text-6xl font-light font-[Abhaya Libre] mb-4">Visitor Management System</p>
              <p className="text-lg font-[Abhaya Libre]">University of Moratuwa</p>
            </div>

            <div>
              <p className="text-lg text-white/50">
                Streamline your visit with <br />
                seamless pre-registration and secure check-in.
              </p>
            </div>
            <div className="flex justify-end gap-2 mt-8">
              <button 
                className="px-20 py-3 bg-white text-black font-bold border border-black rounded-md"
                onClick={() => navigate("/signup")}
              >
                Sign Up
              </button>
              <button 
                className="px-20 py-3 bg-[#124E66] text-white font-bold border border-white rounded-md"
                onClick={() => navigate("/login")}
              >
                Log In
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="flex justify-center gap-8 py-28 bg-[#dde2e6]">
        <FeatureCard
          icon={<FaCalendarCheck />}
          title="Sign Up & Request Appointments"
          description="Create an account and request appointments with your host."
        />
        <FeatureCard
          icon={<FaUserCheck />}
          title="Secure Check-In"
          description="Verify your identity at the security desk using your unique code."
        />
        <FeatureCard
          icon={<FaBell />}
          title="Real-Time Notifications"
          description="Hosts receive instant notifications when visitors arrive."
        />
      </div>

      <StreamlineSteps />
      <Footer />
    </div>
  );
}

export default Home;
