import { Routes, Route, BrowserRouter, useLocation } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Common Pages
import Home from "./pages/common/Home";
import About from "./pages/common/About";
import SignUp from "./pages/common/Signup"; 
import Login from "./pages/common/Login"; 
import ContactUs from "./pages/common/ContactUs";
import PrivacyPolicy from "./pages/common/PrivacyPolicy";
import ForgotPassword from "./pages/common/ForgotPassword";
import EmailSent from "./pages/common/ResetPWemail";
import SMSSent from "./pages/common/ResetPWsms";
import ResetPassword from "./pages/common/ResetPW";
import SuccessfulPWreset from "./pages/common/SuccessfulPWreset";

// Home Components
import HomeNavbar from "./components/home/HomeNavbar";
import MainNavbar from "./components/home/MainNavbar";

// Admin Pages
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserDetails from "./pages/admin/UserDetails";
import VisitorLogbook from "./pages/admin/VisitorLogbook";
import VisitorHistoryReport from "./pages/admin/VisitorHistoryReport";
import StaffRegistration from "./pages/admin/StaffRegistration";
import Settings from "./pages/admin/AdminSettings";
import AdminInsights from "./pages/admin/AdminInsights.jsx";

// Host Pages

import MeetingRequests from "./pages/host/MeetingRequests";
import HostLayout from "./pages/host/HostLayout";
import HostDashboard from "./pages/host/HostDashboard";
import HostProfile from "./pages/host/HostProfile";
import VisitLog from "./pages/host/VisitLog.jsx";
import Appointments from "./pages/host/Appointments.jsx";
import AppointmentDetails from "./pages/host/AppointmentDetails.jsx";

// Security Pages
import SecurityLayout from "./pages/security/SecurityLayout";
import SecurityDashboard from "./pages/security/SecurityDashboard";
import VerifyVisitors from "./pages/security/VerifyVisitors";
import SecurityProfile from "./pages/security/SecurityProfile";
import { useState } from "react";

// Visitor Pages

import VisitorLayout from "./pages/visitor/VisitorLayout";
import VisitorDashboard from "./pages/visitor/VisitorDashboard.jsx";
import VisitorAppointment from "./pages/visitor/VisitorAppointment.jsx";
import Visithistory from "./pages/visitor/Visithistory.jsx";
import UpcomingVisit from "./pages/visitor/AppointmentStatus.jsx";
import VisitorFeedback from "./pages/visitor/VisitorFeedback.jsx";
import VisitorProfile from "./pages/visitor/VisitorSettings.jsx"; 
import AppointmentStatus from "./pages/visitor/AppointmentStatus.jsx";
import HostAvailableTimeSlots from "./pages/visitor/HostAvailableTimeSlots.jsx";
import VisitorSettings from "./pages/visitor/VisitorSettings.jsx";
import VisitorEditProfile from "./pages/visitor/VisitorEditProfile.jsx";

// Other
import LoginPage from "./pages/LoginPage";




function App() {
  return (
    <div>
      <BrowserRouter>
        <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />

        <Routes>
          {/* Common Routes */}
          <Route path="/*" element={<MainComponent />} />
          <Route path="/roles" element={<LoginPage />} />

          {/* Host Routes */}
          <Route path="/host" element={<HostLayout />}>
            <Route index element={<HostDashboard />} />
            <Route path="meeting" element={<MeetingRequests />} />
            <Route path="profile" element={<HostProfile />} />
            <Route path="visitlog" element={<VisitLog />} />
            <Route path="appointments" element={<Appointments />} />
            <Route path="appointmentdetails" element={<AppointmentDetails />} />
          </Route>

          {/* Security Routes */}
          <Route path="/security" element={<SecurityLayout />}>
            <Route index element={<SecurityDashboard />} />
            <Route path="visitor" element={<VerifyVisitors />} />
            <Route path="profile" element={<SecurityProfile />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="userdetails" element={<UserDetails />} />
            <Route path="staffregistration" element={<StaffRegistration />} />
            <Route path="visitorlogbook" element={<VisitorLogbook />} />
            <Route path="visitorhistoryreport" element={<VisitorHistoryReport />} />
            <Route path="admininsights" element={<AdminInsights />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* Visitor Routes */}
          <Route path="/visitor" element={<VisitorLayout />}>
            <Route index element={<VisitorDashboard />} />
            <Route path="appointment" element={<VisitorAppointment />} />
            <Route path="history" element={<Visithistory />} />
            <Route path="Status" element={<AppointmentStatus/>} />
            <Route path="feedback" element={<VisitorFeedback />} />
            <Route path="HostAvailableTime" element={<HostAvailableTimeSlots/>} />
            <Route path="settings" element={<VisitorSettings />} /> 
            <Route path="editprofile" element={<VisitorEditProfile/>} /> 


          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

function MainComponent() {
  const location = useLocation();
  const { pathname } = location;

  const noNavbarRoutes = [
    "/signup", 
    "/login", 
    "/forgot-password", 
    "/reset-password",
    "/successful-reset",
    "/email-sent", 
    "/sms-sent"
  ];

  return (
    <>
      {!noNavbarRoutes.includes(pathname) && (
        pathname === "/" ? <HomeNavbar /> : <MainNavbar />
      )}

      <Routes>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="signup" element={<SignUp />} />
        <Route path="login" element={<Login />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="reset-password" element={<ResetPassword />} />
        <Route path="successful-reset" element={<SuccessfulPWreset />} />
        <Route path="email-sent" element={<EmailSent />} />
        <Route path="sms-sent" element={<SMSSent />} />
        <Route path="contact" element={<ContactUs />} />
        <Route path="privacy-policy" element={<PrivacyPolicy />} />
      </Routes>
    </>
  );
}

export default App;