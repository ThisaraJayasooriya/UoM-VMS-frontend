import { FaUsers, FaUserPlus, FaSignInAlt, FaSignOutAlt,FaClipboardList } from "react-icons/fa";
import DashboardCard from "../../components/common/DashboardCard";
import HostCalendar from "../../components/host/HostCalendar";


function HostDashboard() {
return (
    <div className="pt-20 px-4 lg:px-20">
        <h1 className="text-2xl font-bold mb-5 text-center lg:text-left">Hi, John! 👋</h1>
        <div className="flex flex-col lg:flex-row lg:space-x-20 space-y-4 lg:space-y-0">
        <div className="mb-4 lg:mb-0">
          <DashboardCard icon={<FaClipboardList />} title="Total Pre-Registers" count={5} />
        </div>
        <div className="mb-4 lg:mb-0">
          <DashboardCard icon={<FaUsers />} title="Total Visitors" count={25} />
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
