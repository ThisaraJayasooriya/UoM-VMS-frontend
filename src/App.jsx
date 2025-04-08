import { Routes, Route, BrowserRouter, useLocation } from "react-router-dom";
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
          
          <Route path="/" element={<LoginPage />} />
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

export default App
