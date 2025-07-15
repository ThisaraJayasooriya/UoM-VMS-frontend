import React, { useEffect, useState } from "react";
import { FaUsers, FaUserPlus, FaArrowDown, FaArrowUp, FaChartLine } from "react-icons/fa";

const DashboardCard = ({ icon: Icon, title, count, change, changeColor }) => (
  <div className="bg-[linear-gradient(135deg,rgba(33,42,49,0.95),rgba(18,78,102,0.90))] p-6 rounded-xl shadow-md border border-[#124E66]/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg text-white min-h-[140px]">
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 rounded-lg bg-white/10 border border-white/20">
        <Icon className="text-white text-xl" />
      </div>
      <div className={`px-2 py-1 rounded text-xs font-medium ${changeColor} flex items-center`}>
        <FaChartLine className="mr-1 text-xs" /> {change}
      </div>
    </div>
    <div className="space-y-2">
      <p className="text-sm font-medium text-blue-100/80">{title}</p>
      <h2 className="text-3xl font-bold">{count}</h2>
    </div>
  </div>
);

const SecurityDashboard = () => {
  const [userName, setUserName] = useState("");
  const [stats, setStats] = useState([
    { 
      icon: FaUsers, 
      title: "Total Visitors", 
      count: 0, 
      change: "+0%", 
      changeColor: "text-emerald-300" 
    },
    { 
      icon: FaUserPlus, 
      title: "Expected Visitors", 
      count: 0, 
      change: "+0%", 
      changeColor: "text-emerald-300" 
    },
    { 
      icon: FaArrowDown, 
      title: "Total Checked-in", 
      count: 0, 
      change: "+0%", 
      changeColor: "text-emerald-300" 
    },
    { 
      icon: FaArrowUp, 
      title: "Total Checked-out", 
      count: 0, 
      change: "+0%", 
      changeColor: "text-red-300" 
    },
  ]);

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
            icon: FaUsers, 
            title: "Total Visitors", 
            count: data.totalVisitorsToday ?? 0, 
            change: "+0%", 
            changeColor: "text-emerald-300" 
          },
          { 
            icon: FaUserPlus, 
            title: "Expected Visitors", 
            count: data.expectedVisitorsToday ?? 0, 
            change: "+0%", 
            changeColor: "text-emerald-300" 
          },
          { 
            icon: FaArrowDown, 
            title: "Total Checked-in", 
            count: data.totalCheckedIn ?? 0, 
            change: "+0%", 
            changeColor: "text-emerald-300" 
          },
          { 
            icon: FaArrowUp, 
            title: "Total Checked-out", 
            count: data.totalCheckedOut ?? 0, 
            change: "+0%", 
            changeColor: "text-red-300" 
          },
        ]);
      } catch (error) {
        console.error("Failed to fetch visitor stats:", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="pt-25 px-4 lg:px-10">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#212A31] mb-2">
          Welcome back, {userName || "Security Personnel"}! 👋
        </h1>
        <p className="text-[#748D92]">Here's what's happening in your security dashboard today.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
        {stats.map((stat, index) => (
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