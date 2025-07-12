import { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';

const VerifyVisitors = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialVisitorId = queryParams.get('id') || ''; 

  const [visitors, setVisitors] = useState([]);
  const [activities, setActivities] = useState([]);
  const [searchTerm, setSearchTerm] = useState(initialVisitorId);
  const [filteredVisitor, setFilteredVisitor] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });

  // Fetch recent activities on component mount
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/verify-visitors/activities");
        const data = await response.json();
        setActivities(data);
      } catch (error) {
        console.error("Error fetching activities:", error);
      }
    };
    fetchActivities();
  }, []);

  // Search for visitor when searchTerm changes
  useEffect(() => {
    const term = searchTerm.trim();
    console.log("Searching for visitor with term:", term);
    if (term) {
      const fetchVisitor = async () => {
        try {
          const response = await fetch(`http://localhost:5000/api/verify-visitors/search?term=${term}`);
          if (!response.ok) {
            setFilteredVisitor(null);
            return;
          }
          const data = await response.json();
          setFilteredVisitor(data);
        } catch (error) {
          console.error("Error searching for visitor:", error);
          setFilteredVisitor(null);
        }
      };
      fetchVisitor();
    } else {
      setFilteredVisitor(null);
    }
  }, [searchTerm]);

  // Hide alert after 5 seconds
  useEffect(() => {
    if (alert.show) {
      const timer = setTimeout(() => {
        setAlert({ show: false, message: '', type: '' });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  const handleInputChange = (e) => setSearchTerm(e.target.value);
  const handleClearSearch = () => setSearchTerm('');

  const showAlert = (message, type) => {
    setAlert({ show: true, message, type });
  };

  const handleAction = async (type) => {
    const term = searchTerm.trim();
    if (!term || !filteredVisitor) return;

    setIsLoading(true);
    try {
      const endpoint = type === 'in'
        ? `http://localhost:5000/api/verify-visitors/${filteredVisitor.appointmentId}/checkin` 
        : `http://localhost:5000/api/verify-visitors/${filteredVisitor.appointmentId}/checkout`; 
      const response = await fetch(endpoint, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        const errorData = await response.json();
        showAlert(errorData.message || `Failed to ${type === 'in' ? 'check in' : 'check out'} visitor`, 'error');
        setIsLoading(false);
        return;
      }

      const updatedVisitor = await response.json();
      setFilteredVisitor(updatedVisitor.visitor);

      // Update activities
      const newActivity = {
        visitorId: updatedVisitor.visitor.visitorId, 
        name: updatedVisitor.visitor.name,
        action: type === 'in' ? 'Checked-In' : 'Checked-Out',
        timestamp: new Date().toISOString(),
      };
      setActivities([newActivity, ...activities]);

      showAlert(
        `${updatedVisitor.visitor.name} has been successfully ${type === 'in' ? 'checked in' : 'checked out'}.`,
        type === 'in' ? 'success-in' : 'success-out'
      );
      setSearchTerm('');
    } catch (error) {
      showAlert(`Error: ${error.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <div className="pt-20 px-4 lg:px-10 max-w-5xl mx-auto">
      {/* Alert */}
      {alert.show && (
        <div className={`mb-6 py-3 px-4 rounded-lg flex items-center justify-between ${
          alert.type === 'success-in' ? 'bg-green-100 text-green-800 border border-green-200' : 
          alert.type === 'success-out' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
          'bg-yellow-100 text-yellow-800 border border-yellow-200'
        }`}>
          <div className="flex items-center">
            <span className={`flex-shrink-0 inline-flex item-center justify-center h-8 w-8 rounded-full mr-3 ${
              alert.type === 'success-in' ? 'bg-green-200' : 
              alert.type === 'success-out' ? 'bg-blue-200' : 
              'bg-yellow-200'
            }`}>
              {alert.type.includes('success') ? (
                <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
              ) : (
                <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                </svg>
              )}
            </span>
            <p>{alert.message}</p>
          </div>
          <button 
            onClick={() => setAlert({ show: false, message: '', type: '' })}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
            </svg>
          </button>
        </div>
      )}
      
      {/* Search Box */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-[#124E66] mb-8">
        <h2 className="text-xl font-semibold mb-5 text-center text-[#212A31]">Verify Visitor</h2>
        <div className="flex items-center gap-4 justify-center">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              value={searchTerm}
              onChange={handleInputChange}
              placeholder="Enter Appointment ID or NIC"
              className="px-5 py-3 rounded-lg border border-[#124E66] w-full focus:outline-none focus:ring-2 focus:ring-[#124E66] shadow-sm bg-white text-[#212A31] placeholder-gray-500"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#124E66] text-xl font-bold"
              >
                ×
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Visitor Card */}
      {filteredVisitor && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-[#124E66] mb-8 transition-all duration-300">
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-lg font-semibold text-[#212A31]">Visitor Details</h3>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              filteredVisitor.status === 'Checked-In' 
                ? 'bg-green-100 text-green-700' 
                : filteredVisitor.status === 'Checked-Out'
                ? 'bg-red-100 text-red-700'
                : 'bg-yellow-100 text-yellow-700'
            }`}>
              {filteredVisitor.status}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">Name</span>
              <span className="font-medium text-[#212A31]">{filteredVisitor.name}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">Visitor ID</span>
              <span className="font-medium text-[#212A31]">{filteredVisitor.visitorId}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">NIC</span>
              <span className="font-medium text-[#212A31]">{filteredVisitor.nic}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">Vehicle Number</span>
              <span className="font-medium text-[#212A31]">{filteredVisitor.vehicleNumber}</span>
            </div>
            
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
        <button
          onClick={() => handleAction('in')}
          className="bg-[#124E66] hover:bg-[#212A31] text-white px-8 py-3 rounded-lg transition-all duration-200 font-medium disabled:opacity-60 disabled:cursor-not-allowed border border-[#124E66]"
          disabled={isLoading || (filteredVisitor?.status === 'Checked-In')}
        >
          {isLoading ? 'Processing...' : 'Check-In Visitor'}
        </button>
        <button
          onClick={() => handleAction('out')}
          className="bg-[#124E66] hover:bg-[#212A31] text-white px-8 py-3 rounded-lg transition-all duration-200 font-medium disabled:opacity-60 disabled:cursor-not-allowed border border-[#124E66]"
          disabled={isLoading || (filteredVisitor?.status === 'Checked-Out')}
        >
          {isLoading ? 'Processing...' : 'Check-Out Visitor'}
        </button>
      </div>

      {/* Recent Activities */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-[#124E66]">
        <h3 className="text-lg font-semibold mb-5 text-[#212A31] flex items-center">
          <span className="mr-2">Recent Activities</span>
          {activities.length > 0 && (
            <span className="bg-[#124E66] text-white text-xs rounded-full px-2 py-1">
              {activities.length}
            </span>
          )}
        </h3>
        {activities.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No recent activity recorded</p>
          </div>
        ) : (
          <ul className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {activities.map((activity, index) => (
              <li key={index} className="bg-blue-50 p-4 rounded-lg border border-[#124E66] shadow-sm hover:bg-blue-100 transition-colors duration-200">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-[#212A31]">{activity.name}</p>
                    <p className="text-xs text-gray-500 mt-1">ID: {activity.visitorId}</p>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                    activity.action === 'Checked-In'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {activity.action}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-2 italic">{formatTime(activity.timestamp)}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default VerifyVisitors;