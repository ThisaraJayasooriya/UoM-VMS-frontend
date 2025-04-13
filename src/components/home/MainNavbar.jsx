import { Link } from "react-router-dom";
import vlogo from "../../assets/v.png"; // Make sure the path is correct

function MainNavbar() {
  return (
    <nav className="bg-gradient-to-r from-darkblue to-blue text-white p-6 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img src={vlogo} alt="V Logo" className="w-16 md:w-20" />
        </Link>

        {/* Navigation Links */}
        <div className="space-x-6 text-base font-medium">
          <Link to="/" className="hover:text-gray-300 transition">Home</Link>
          <Link to="/about" className="hover:text-gray-300 transition">About Us</Link>
          <Link to="/contact" className="hover:text-gray-300 transition">Contact Us</Link>
          <Link to="/login" className="hover:text-gray-300 transition">Log In</Link>
          <Link to="/signup" className="hover:text-gray-300 transition">Sign Up</Link>
        </div>
      </div>
    </nav>
  );
}

export default MainNavbar;
