import { FaArrowLeft } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import logo from "../../assets/Logo.png";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ items, hide, onItemClick }) => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    // Clear localStorage to log out the user
    localStorage.removeItem('authToken');
    localStorage.removeItem('visitorData');
    localStorage.removeItem('authRemember');
    // Navigate to the homepage
    navigate('/');
  };

  return (
    <div className="h-screen w-64 bg-gradient-to-b from-darkblue to-blue text-white flex flex-col border border-zinc-500 shadow-xl">
      <div className="p-6 pl-15 pb-30">
        <img
          src={logo}
          alt="Logo"
          className="w-20 h-8 cursor-pointer"
          onClick={handleLogoClick}
        />
      </div>
      <nav className="flex-1">
        <ul>
          {items.map((item, index) => (
            <li key={index}>
              <NavLink
                to={item.route}
                onClick={() => onItemClick(item.route)}
                className={({ isActive }) =>
                  `p-4 flex items-center space-x-2 rounded-lg mx-2 cursor-pointer ${
                    isActive
                      ? "bg-blue3 text-black"
                      : "hover:bg-blue3 hover:text-black"
                  }`
                }
                end={index === 0} // Apply exact match only to the first item ("Dashboard")
              >
                {item.icon}
                <span>{item.description}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div
        className="p-4 flex items-center space-x-2 text-gray-400 cursor-pointer hover:text-black"
        onClick={hide}
      >
        <FaArrowLeft />
        <span>Go Back</span>
      </div>
    </div>
  );
};

export default Sidebar;