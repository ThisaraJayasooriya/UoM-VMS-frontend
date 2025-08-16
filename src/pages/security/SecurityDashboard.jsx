import React, { useEffect, useState } from "react";
import {
  FaUsers,
  FaUserPlus,
  FaArrowDown,
  FaArrowUp,
  FaChartLine,
} from "react-icons/fa";

const DashboardCard = ({ icon: Icon, title, count, change, changeColor }) => (
  <div
    className="relative bg-white/95 backdrop-blur-sm border border-gray-200/50 
      rounded-3xl p-6 shadow-[0_8px_32px_rgba(18,78,102,0.12)] 
      transition-all duration-500 ease-out
      hover:shadow-[0_12px_40px_rgba(18,78,102,0.2)] 
      hover:border-[#124E66]/20 hover:-translate-y-1
      group overflow-hidden min-h-[160px] animate-fadeIn"
  >
    {/* Gradient hover overlay */}
    <div className="absolute inset-0 bg-gradient-to-br from-[#124E66]/5 via-transparent to-[#2D7D9A]/3 opacity-0 
        group-hover:opacity-100 transition-opacity duration-500"></div>

    {/* Content */}
    <div className="relative z-10">
      <div className="flex justify-between items-start mb-6">
        {/* Icon */}
        <div className="relative">
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg
              group-hover:scale-110 transition-transform duration-300
              ${
                title.includes("Checked-in")
                  ? "bg-gradient-to-br from-green-500 to-green-600"
                  : title.includes("Checked-out")
                  ? "bg-gradient-to-br from-red-500 to-red-600"
                  : title.includes("Expected")
                  ? "bg-gradient-to-br from-blue-500 to-blue-600"
                  : "bg-gradient-to-br from-[#124E66] to-[#2D7D9A]"
              }`}
          >
            <Icon className="text-white text-xl" />
          </div>
          <div className="absolute -inset-1 bg-gradient-to-br from-[#124E66] to-[#2D7D9A] rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
        </div>

        {/* Change badge */}
        <div
          className={`px-3 py-1.5 rounded-full text-xs font-semibold ${changeColor} 
            bg-gray-50 border border-gray-200/60 flex items-center gap-1.5
            shadow-sm group-hover:shadow-md transition-shadow duration-300`}
        >
          <FaChartLine className="text-xs" />
          <span>{change}</span>
        </div>
      </div>

      {/* Text */}
      <div className="space-y-3">
        <p className="text-sm font-medium text-gray-600 uppercase tracking-wide leading-tight">
          {title}
        </p>
        <h2
          className={`text-3xl font-bold tracking-tight transition-colors duration-300
            ${
              title.includes("Checked-in")
                ? "text-green-600"
                : title.includes("Checked-out")
                ? "text-red-600"
                : "text-[#124E66]"
            }`}
        >
          {count > 0 ? count.toLocaleString() : <span className="text-gray-400 text-base">No records</span>}
        </h2>
      </div>
    </div>

    {/* Accent line */}
    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#124E66] to-[#2D7D9A] 
        transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
  </div>
);

const SecurityDashboard = () => {
  const [userName, setUserName] = useState("");
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("userData"));
    if (storedUser?.username) {
      setUserName(storedUser.username);
    }

    const fetchStats = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/security/stats");
        const data = await response.json();
        setStats([
          {
            icon: FaUserPlus,
            title: "Expected Visitors",
            count: data.expectedVisitorsToday ?? 0,
            change: "+0%",
            changeColor: "text-emerald-500",
          },
          {
            icon: FaArrowDown,
            title: "Total Checked-in",
            count: data.totalCheckedIn ?? 0,
            change: "+0%",
            changeColor: "text-green-500",
          },
          {
            icon: FaArrowUp,
            title: "Total Checked-out",
            count: data.totalCheckedOut ?? 0,
            change: "+0%",
            changeColor: "text-red-500",
          },
          {
            icon: FaUsers,
            title: "Total Visitors",
            count: data.totalVisitorsToday ?? 0,
            change: "+0%",
            changeColor: "text-blue-500",
          },
        ]);
      } catch (error) {
        console.error("Failed to fetch visitor stats:", error);
      } finally {
        setTimeout(() => setLoading(false), 500);
      }
    };

    fetchStats();
  }, []);

  // Skeleton Loader
  const SkeletonCard = () => (
    <div className="relative bg-white/80 border border-gray-200/50 rounded-3xl p-6 shadow-[0_8px_32px_rgba(18,78,102,0.12)] min-h-[160px] animate-pulse overflow-hidden">
      <div className="flex justify-between items-start mb-6">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gray-200 to-gray-300" />
        <div className="px-8 py-2 rounded-full bg-gray-200" />
      </div>
      <div className="space-y-3">
        <div className="h-4 w-1/3 bg-gray-200 rounded" />
        <div className="h-8 w-2/3 bg-gray-200 rounded" />
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-gray-200 to-gray-300" />
    </div>
  );

  return (
    <div className="pt-24 px-4 lg:px-10">
      {/* Welcome Section */}
      <div className="mb-8 animate-fadeIn">
        <h1 className="text-4xl font-extrabold text-[#124E66] mb-1">
          Welcome back, {userName || "Security Personnel"}!
        </h1>
        <p className="text-lg text-[#5f767c]">
          Here's your visitor overview for today.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="pt-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {loading
          ? Array(4).fill(0).map((_, idx) => <SkeletonCard key={idx} />)
          : stats.map((stat, index) => (
              <DashboardCard
                key={index}
                icon={stat.icon}
                title={stat.title}
                count={stat.count}
                change={stat.change}
                changeColor={stat.changeColor}
              />
            ))}
      </div>
    </div>
  );
};

export default SecurityDashboard;
