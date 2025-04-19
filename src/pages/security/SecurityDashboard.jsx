import React from "react";
import { FaUsers, FaUserPlus, FaArrowDown, FaArrowUp } from "react-icons/fa";

const colors = {
  darkblue: "#212A31",
  blue: "#124E66",
  blue2: "#748D92",
  blue3: "#D3D9D4",
};

const DashboardCard = ({ icon: Icon, title, count, bgColor, iconBgColor }) => (
  <div
    className="rounded-2xl shadow-lg w-full min-w-[280px] max-w-[330px] h-40 flex items-center px-6 py-5 transform transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl cursor-pointer"
    style={{ backgroundColor: bgColor }}
  >
    <div
      className="text-blue p-4 rounded-xl text-2xl mr-5 flex items-center justify-center"
      style={{ backgroundColor: iconBgColor }}
    >
      <Icon />
    </div>
    <div className="text-white">
      <h3 className="text-base md:text-lg font-medium opacity-90">{title}</h3>
      <p className="text-4xl font-bold mt-1">{count}</p>
    </div>
  </div>
);

const SecurityDashboard = () => {
  const stats = [
    { icon: FaUsers, title: "Total Visitors", count: 25 },
    { icon: FaUserPlus, title: "Expected Visitors", count: 5 },
    { icon: FaArrowDown, title: "Total Checked-in", count: 10 },
    { icon: FaArrowUp, title: "Total Checked-out", count: 7 },
  ];

  return (
    <main className="flex items-center justify-center min-h-[calc(100vh-112px)] px-4 lg:px-8 pb-8 pt-4" style={{ backgroundColor: "#ffffff" }}>
      <section className="rounded-2xl shadow-lg w-full max-w-5xl p-8 flex flex-col" style={{ backgroundColor: colors.blue3 }}>
        <div className="flex items-center mb-8">
          <div className="w-1 h-8 rounded mr-3" style={{ backgroundColor: colors.blue }}></div>
          <h1 className="text-2xl font-bold" style={{ color: colors.darkblue }}>Hi, Kevin! 👋</h1>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 place-items-center flex-1">
          {stats.map(({ icon, title, count }) => (
            <DashboardCard
              key={title}
              icon={icon}
              title={title}
              count={count}
              bgColor={colors.blue2}
              iconBgColor={colors.blue3}
            />
          ))}
        </div>
      </section>
    </main>
  );
};

export default SecurityDashboard;
