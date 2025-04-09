import { FaUsers, FaUserPlus, FaSignInAlt, FaSignOutAlt } from "react-icons/fa";
import DashboardCard from "../../components/common/DashboardCard";
//import Headerbar from "../components/Headerbar";

const SecurityDashboard = () => {
  return (
   
    <div className="flex flex-col flex-1 pl-30 pt-20">
        
      <h1 className="text-2xl font-bold mb-5 ml-40">Hi, Kevin! 👋</h1>
      <div className="grid grid-cols-2 gap-24 ">
        <DashboardCard icon={<FaUsers />} title="Total Visitors" count={25} />
        <DashboardCard icon={<FaUserPlus />} title="Expected Visitors" count={5} />
        <DashboardCard icon={<FaSignInAlt />} title="Total Checked-in" count={10} />
        <DashboardCard icon={<FaSignOutAlt />} title="Total Checked-out" count={7} />
      </div>
    </div>
    
  );
};

export default SecurityDashboard;
