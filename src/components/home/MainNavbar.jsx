import { Link } from "react-router-dom";
import vlogo from "../../assets/v.png"; // Make sure the path is correct

function MainNavbar() {
  return (
    <nav className="bg-[#212A31] p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img src={vlogo} alt="V Logo" className="w-16 md:w-20" />
        </Link>

        {/* Navigation Links */}
        <div className="space-x-6">
          <Link to="/" className="text-white hover:text-gray-300">Home</Link>
          <Link to="/about" className="text-white hover:text-gray-300">About Us</Link>
          <Link to="/contact" className="text-white hover:text-gray-300">Contact Us</Link>
          <Link to="/login" className="text-white hover:text-gray-300">Log In</Link>
          <Link to="/signup" className="text-white hover:text-gray-300">Sign Up</Link>
        </div>
      </div>
    </nav>
  );
}

export default MainNavbar;
