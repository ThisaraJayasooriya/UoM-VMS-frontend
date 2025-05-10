import { FaUsers, FaUserPlus, FaSignInAlt, FaSignOutAlt,FaClipboardList } from "react-icons/fa";
import DashboardCard from "../../components/common/DashboardCard";
import HostCalendar from "../../components/host/HostCalendar";
import { useState, useEffect } from "react";


function HostDashboard() {
  const [userName, setUserName] = useState(""); // 🔹 new state for username

   // 🔹 Load userName from localStorage on mount
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("userData")); // adjust key based on your login
    if (storedUser && storedUser.username) {
      setUserName(storedUser.username);
    }
  }, []);
return (
    <div className="pt-20 px-4 lg:px-20">
        <h1 className="text-2xl font-bold mb-5 text-center lg:text-left">Hi, {userName}! 👋</h1>
        <div className="flex flex-col lg:flex-row lg:space-x-20 space-y-4 lg:space-y-0">
        <div className="mb-4 lg:mb-0">
          <DashboardCard icon={<FaClipboardList />} title="Total Meeting Requests" count={5} textcolor="text-blue-600"/>
        </div>
        <div className="mb-4 lg:mb-0">
          <DashboardCard icon={<FaUsers />} title="Total Appointments" count={25} textcolor="text-green-600" />
        </div>
        </div>

        <div className="flex flex-col items-center bg-blue3 mt-20 w-full h-full p-8">
            <h1 className="text-2xl font-bold mt-5 mb-5">Upcoming Appointments</h1>
            <div className="w-full bg-white shadow-xl">
                <HostCalendar />
            </div>
        </div>
    </div>
)
}

export default HostDashboard
