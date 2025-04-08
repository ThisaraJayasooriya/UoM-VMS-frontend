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


function App() {
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
   
