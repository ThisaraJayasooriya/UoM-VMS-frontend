import { useEffect, useState, createContext, useContext } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
import ResetPW from "./pages/common/ResetPW";
import SuccessfulPWreset from "./pages/common/SuccessfulPWreset";

// Home Components
import HomeNavbar from "./components/home/HomeNavbar";
import MainNavbar from "./components/home/MainNavbar";

// Admin Pages
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import VisitorLogbook from "./pages/admin/VisitorLogbook";
import VisitorHistoryReport from "./pages/admin/VisitorHistoryReport";
import AdminReports from "./pages/admin/AdminReports";
import AdminInsights from "./pages/admin/AdminInsights.jsx";
import Settings from "./pages/admin/AdminSettings";

// User Details Pages
import UserDetailsMain from "./pages/admin/userdetails/UserDetailsMain";
import VisitorDetails from "./pages/admin/userdetails/VisitorDetails";
import HostDetails from "./pages/admin/userdetails/HostDetails";
import SecurityDetails from "./pages/admin/userdetails/SecurityDetails";
import AdminDetails from "./pages/admin/userdetails/AdminDetails";

// Add User Pages
import AddVisitor from "./pages/admin/adduser/AddVisitor";
import AddHost from "./pages/admin/adduser/AddHost";
import AddSecurity from "./pages/admin/adduser/AddSecurity";
import AddAdmin from "./pages/admin/adduser/AddAdmin";

// Host Pages
import HostLayout from "./pages/host/HostLayout";
import MeetingRequests from "./pages/host/MeetingRequests";
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

// Visitor Pages
import VisitorLayout from "./pages/visitor/VisitorLayout";
import VisitorDashboard from "./pages/visitor/VisitorDashboard.jsx";
import VisitorAppointment from "./pages/visitor/VisitorAppointment.jsx";
import Visithistory from "./pages/visitor/Visithistory.jsx";
import AppointmentStatus from "./pages/visitor/AppointmentStatus.jsx";
import VisitorFeedback from "./pages/visitor/VisitorFeedback.jsx";
import VisitorProfile from "./pages/visitor/VisitorSettings.jsx";
import HostAvailableTimeSlots from "./pages/visitor/HostAvailableTimeSlots.jsx";
import VisitorSettings from "./pages/visitor/VisitorSettings.jsx";
import VisitorEditProfile from "./pages/visitor/VisitorEditProfile.jsx";

// Other
import LoginPage from "./pages/LoginPage";
import StaffDashboard from "./pages/StaffDashboard";

// Create AuthContext to share authentication status
const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

// Debug Component
const TokenDebugger = () => {
  useEffect(() => {
    console.log("Current token on mount:", localStorage.getItem("authToken"));

    const interval = setInterval(() => {
      console.log("Token check:", localStorage.getItem("authToken"));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return null;
};

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [authState, setAuthState] = useState({ isAuthenticated: false, userType: null, role: null });
  const [token, setToken] = useState(localStorage.getItem("authToken")); // Track token changes

  // Monitor localStorage.removeItem calls
  useEffect(() => {
    const originalRemoveItem = localStorage.removeItem;
    localStorage.removeItem = function (key) {
      if (key === "authToken") {
        console.group("Token Removal Detected");
        console.log("Attempt to remove authToken detected!");
        console.trace("Removal Stack Trace");
        console.groupEnd();
      }
      return originalRemoveItem.apply(this, arguments);
    };

    return () => {
      localStorage.removeItem = originalRemoveItem;
    };
  }, []);

  // Enhanced storage event listener
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "authToken") {
        console.group("Auth Token Change");
        console.log("Action:", e.newValue ? "SET" : "CLEARED");
        console.log("Old Value:", e.oldValue);
        console.log("New Value:", e.newValue);
        console.log("URL:", window.location.href);
        console.trace("Change Origin");
        console.groupEnd();

        if (!e.newValue) {
          const stack = new Error().stack;
          if (!stack.includes("Login.jsx") && !stack.includes("AuthService")) {
            console.warn("UNEXPECTED TOKEN CLEARING DETECTED!");
          }
        }
        // Update token state when it changes
        setToken(e.newValue);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Token verification when token changes
  useEffect(() => {
    const verifyToken = async () => {
      const currentToken = localStorage.getItem("authToken");
      const rememberMe = localStorage.getItem("authRemember") === "true";
      console.log("Starting token verification:", { token: currentToken, rememberMe });

      if (currentToken) {
        try {
          const verifyUrl = `${import.meta.env.VITE_API_BASE_URL}/api/auth/visitor/verify`;
          console.log("Verify URL being called:", verifyUrl);
          const response = await fetch(verifyUrl, {
            headers: { Authorization: `Bearer ${currentToken}` },
          });

          console.log("Verify response status:", response.status);
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const data = await response.json();
          console.log("Verify response data:", data);

          if (data.success) {
            console.log("Token verification successful, navigating based on user type and role");
            localStorage.setItem("userData", JSON.stringify(data.user));
            localStorage.setItem("rememberMe", data.rememberMe);

            // Update auth state
            setAuthState({
              isAuthenticated: true,
              userType: data.userType,
              role: data.role,
            });

            // Only navigate if not already on a valid route
            const currentPath = location.pathname;
            const validRoutes = ["/admin", "/host", "/security", "/visitor"];
            const isOnValidRoute = validRoutes.some(route => currentPath.startsWith(route));

            if (!isOnValidRoute) {
              if (data.userType === "visitor") {
                navigate("/visitor");
              } else if (data.userType === "staff") {
                switch (data.role.toLowerCase()) {
                  case "admin":
                    navigate("/admin");
                    break;
                  case "host":
                    navigate("/host");
                    break;
                  case "security":
                    navigate("/security");
                    break;
                  default:
                    console.warn("Unknown role:", data.role);
                    navigate("/login");
                }
              }
            }
          } else {
            console.log("Token verification failed:", data.message || "No message provided");
            if (!rememberMe) {
              console.log("Clearing localStorage (rememberMe: false)");
              localStorage.removeItem("authToken");
              localStorage.removeItem("userData");
              localStorage.removeItem("authRemember");
            }
            setAuthState({ isAuthenticated: false, userType: null, role: null });
          }
        } catch (error) {
          console.error("Token verification error:", error.message);
          console.log("Error details:", error);
          if (!rememberMe) {
            console.log("Clearing localStorage (rememberMe: false)");
            localStorage.removeItem("authToken");
            localStorage.removeItem("userData");
            localStorage.removeItem("authRemember");
          }
          setAuthState({ isAuthenticated: false, userType: null, role: null });
        }
      } else {
        console.log("No token found in localStorage");
        setAuthState({ isAuthenticated: false, userType: null, role: null });
      }
      console.log("Finished token verification, setting checkingAuth to false");
      setCheckingAuth(false);
    };

    verifyToken();
  }, [token, navigate, location.pathname]); // Re-run when token changes

  // Show loading state while checking auth
  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#124E66] to-[#2E3944] flex items-center justify-center">
        <div className="text-white text-center">
          <svg
            className="animate-spin h-12 w-12 mx-auto mb-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p>Checking authentication status...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ checkingAuth, authState }}>
      <div>
        <TokenDebugger />
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

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="userdetails" element={<UserDetailsMain />}>
              <Route path="visitor" element={<VisitorDetails />} />
              <Route path="host" element={<HostDetails />} />
              <Route path="security" element={<SecurityDetails />} />
              <Route path="admin" element={<AdminDetails />} />
            </Route>
            <Route path="userdetails/add-visitor" element={<AddVisitor />} />
            <Route path="userdetails/add-host" element={<AddHost />} />
            <Route path="userdetails/add-security" element={<AddSecurity />} />
            <Route path="userdetails/add-admin" element={<AddAdmin />} />
            <Route path="visitorlogbook" element={<VisitorLogbook />} />
            <Route path="visitorhistoryreport" element={<VisitorHistoryReport />} />
            <Route path="adminreports" element={<AdminReports />} />
            <Route path="adminInsights" element={<AdminInsights />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* Staff Dashboard Route */}
          <Route path="/staff/:role" element={<StaffDashboard />} />

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

          {/* Visitor Routes */}
          <Route path="/visitor" element={<VisitorLayout />}>
            <Route index element={<VisitorDashboard />} />
            <Route path="appointment" element={<VisitorAppointment />} />
            <Route path="history" element={<Visithistory />} />
            <Route path="Status" element={<AppointmentStatus />} />
            <Route path="feedback" element={<VisitorFeedback />} />
            <Route path="HostAvailableTime" element={<HostAvailableTimeSlots />} />
            <Route path="settings" element={<VisitorSettings />} />
            <Route path="editprofile" element={<VisitorEditProfile />} />
          </Route>
        </Routes>
      </div>
    </AuthContext.Provider>
  );
}

function MainComponent() {
  const location = useLocation();
  const { pathname } = location;

  const noNavbarRoutes = [
    "/signup",
    "/login",
    "/forgot-password",
    "/reset-password/:token",
    "/successful-reset",
    "/email-sent",
    "/sms-sent",
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
        <Route path="reset-password/:token" element={<ResetPW />} />
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