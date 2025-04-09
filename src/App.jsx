import { useState } from "react"; // ✅ Add this
import { Routes, Route, BrowserRouter } from "react-router-dom";

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

export default App;
