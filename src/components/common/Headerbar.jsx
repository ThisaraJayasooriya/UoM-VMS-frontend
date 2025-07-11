import { FaBars, FaBell, FaEnvelope, FaUserCircle } from "react-icons/fa";

function Headerbar({ toggleSidebar, userName, userRole, pageTitle, pageSubtitle, type, onUserClick}) {
  return (
    <div className="w-full h-30 bg-gradient-to-r from-darkblue to-blue text-white p-8">
      <div className="flex justify-between">
        <div className="flex items-center space-x-4">
          <button className="text-2xl cursor-pointer" onClick={toggleSidebar}>
            <FaBars />
          </button>
        </div>

        <div className="flex items-center space-x-6">
          <FaEnvelope className="text-lg cursor-pointer" />
          <div className="relative">
            <FaBell className="text-lg cursor-pointer" />
            {/* Notification Dot */}
            <span className="absolute top-0 right-0 bg-red-500 w-2.5 h-2.5 rounded-full"></span>
          </div>
          <div className="flex items-center space-x-2 cursor-pointer  hover:bg-opacity-20 p-2 rounded-lg transition-colors" onClick={onUserClick}>
            <FaUserCircle className="text-xl" />
            <div>
              <p className="text-sm font-semibold">{userName}</p>
              <p className="text-xs text-gray-300">{userRole}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-blue3 flex justify-between items-center p-4 rounded-xl shadow-md mx-30 mt-5">
        <h1 className="text-2xl font-bold text-black">{type || pageTitle }</h1>
        <p className="text-gray-600">{pageSubtitle}</p>
      </div>
    </div>
  );
}

export default Headerbar;