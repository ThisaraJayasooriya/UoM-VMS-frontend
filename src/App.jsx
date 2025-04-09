import { Routes, Route, BrowserRouter, useLocation } from "react-router-dom";
import Home from "./pages/common/Home";
import About from "./pages/common/About";
import SignUp from "./pages/common/Signup"; 
import Login from "./pages/common/Login"; 
import HomeNavbar from "./components/home/HomeNavbar";
import MainNavbar from "./components/home/MainNavbar";
import ContactUs from "./pages/common/ContactUs";
import PrivacyPolicy from "./pages/common/PrivacyPolicy";
import LoginPage from "./pages/LoginPage";
import MeetingRequests from "./pages/host/MeetingRequests";
import HostLayout from "./pages/host/HostLayout";
import HostDashboard from "./pages/host/HostDashboard";
import HostProfile from "./pages/host/HostProfile";
import SecurityLayout from "./pages/security/SecurityLayout";
import SecurityDashboard from "./pages/security/SecurityDashboard";
import VerifyVisitors from "./pages/security/VerifyVisitors";
import SecurityProfile from "./pages/security/SecurityProfile";
import SecuritySettings from "./pages/security/SecuritySettings";
import { useState } from "react"; // ✅ Add this
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserDetails from "./pages/admin/UserDetails";
import VisitorLogbook from "./pages/admin/VisitorLogbook";
import StaffRegistration from "./pages/admin/StaffRegistration";
import AdminReports from "./pages/admin/AdminReports";
import Profile from "./pages/admin/AdminProfile";
import Settings from "./pages/admin/AdminSettings";


function App() {
  // ✅ Shared user state
  const [userData, setUserData] = useState({
    visitor: [],
    host: [],
    security: [],
    admin: [],
  });

  const addUser = (role, user) => {
    setUserData((prev) => ({
      ...prev,
      [role]: [...prev[role], user],
    }));
  };

  return (
    <div>
      <BrowserRouter>
        
        <Routes> 
    
          <Route path="/*" element={<MainComponent />} />
          <Route path="/roles" element={<LoginPage />} />
          <Route path="/host" element={<HostLayout />}>
            <Route index element={<HostDashboard />} />
            <Route path="meeting" element={<MeetingRequests />} />
            <Route path="profile" element={<HostProfile />} />
          </Route>
          <Route path="/security" element={<SecurityLayout />} >
            <Route index element={<SecurityDashboard />} />
            <Route path="visitor" element={<VerifyVisitors />} />
            <Route path="profile" element={<SecurityProfile />} />
            <Route path="settings" element={<SecuritySettings />} />
          </Route>
          <Route path="/admin" element={<AdminLayout />} >
            <Route index element={<AdminDashboard />} />
            <Route path="userdetails" element={<UserDetails userData={userData} />} /> {/* ✅ pass userData */}
            <Route path="staffregistration" element={<StaffRegistration addUser={addUser} />} /> {/* ✅ pass addUser */}
            <Route path="visitorlogbook" element={<VisitorLogbook />} />
            <Route path="adminreports" element={<AdminReports />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
 );
}



function MainComponent() {
  const location = useLocation();
  const { pathname } = location;

  // Routes that should NOT display a navbar
  const noNavbarRoutes = ["/signup", "/login"];

  return (
    <>
      {!noNavbarRoutes.includes(pathname) && (
        pathname === "/" ? <HomeNavbar /> : <MainNavbar />
      )}

      <Routes>
        <Route index element={<Home/>} />
        <Route path="about" element={<About />} />
        <Route path="signup" element={<SignUp />} />
        <Route path="login" element={<Login />} />
        <Route path="contact" element={<ContactUs />} />
        <Route path="privacy-policy" element={<PrivacyPolicy />} />
      </Routes>
    </>

  );
}

export default App;
