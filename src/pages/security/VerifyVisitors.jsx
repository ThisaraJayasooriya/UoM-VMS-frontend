import { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';

// Custom scrollbar styles
const customScrollbarStyle = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: linear-gradient(to bottom, #124E66, #2D7D9A);
    border-radius: 10px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(to bottom, #0F3A4F, #124E66);
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = customScrollbarStyle;
  document.head.appendChild(styleElement);
}

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
  const [filteredHost, setFilteredHost] = useState(null);

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
            setFilteredHost(null);
            return;
          }
          const data = await response.json();
          setFilteredVisitor(data.visitor);
          setFilteredHost(data.staff); // Assuming the host data is included in the response
        } catch (error) {
          console.error("Error searching for visitor:", error);
          setFilteredVisitor(null);
          setFilteredHost(null);
        }
      };
      fetchVisitor();
    } else {
      setFilteredVisitor(null);
      setFilteredHost(null);

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
    <div className="pt-15">
    <div className="pt-15 px-4 lg:px-10 max-w-6xl mx-auto min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      {/* Alert */}
      {alert.show && (
        <div className={`mb-6 py-4 px-6 rounded-2xl flex items-center justify-between shadow-lg backdrop-blur-sm border transition-all duration-500 ${
          alert.type === 'success-in' ? 'bg-emerald-50/90 text-emerald-700 border-emerald-200/60' : 
          alert.type === 'success-out' ? 'bg-blue-50/90 text-blue-700 border-blue-200/60' :
          'bg-amber-50/90 text-amber-700 border-amber-200/60'
        }`}>
          <div className="flex items-center">
            <span className={`flex-shrink-0 inline-flex items-center justify-center h-10 w-10 rounded-xl mr-4 shadow-sm ${
              alert.type === 'success-in' ? 'bg-emerald-100 text-emerald-600' : 
              alert.type === 'success-out' ? 'bg-blue-100 text-blue-600' : 
              'bg-amber-100 text-amber-600'
            }`}>
              {alert.type.includes('success') ? (
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
              ) : (
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                </svg>
              )}
            </span>
            <p className="font-medium">{alert.message}</p>
          </div>
          <button 
            onClick={() => setAlert({ show: false, message: '', type: '' })}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1 rounded-lg hover:bg-white/50"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
            </svg>
          </button>
        </div>
      )}
      
      {/* Search Box */}
      <div className="relative bg-white/95 backdrop-blur-sm p-8 rounded-3xl shadow-[0_8px_32px_rgba(18,78,102,0.12)] 
                      border border-gray-200/50 mb-8 group hover:shadow-[0_12px_40px_rgba(18,78,102,0.15)] 
                      transition-all duration-500">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#124E66]/5 via-transparent to-[#2D7D9A]/3 
                        rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        <div className="relative z-10">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-[#124E66] mb-2">Verify Visitor</h2>
            <p className="text-gray-600">Enter appointment ID or NIC to verify visitor details</p>
          </div>
          
          <div className="flex items-center gap-4 justify-center">
            <div className="relative w-full max-w-lg">
              <div className="relative">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" 
                     fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleInputChange}
                  placeholder="Enter Appointment ID or NIC"
                  className="pl-12 pr-12 py-4 rounded-2xl border-2 border-gray-200 w-full 
                           focus:outline-none focus:border-[#124E66] focus:ring-4 focus:ring-[#124E66]/10 
                           shadow-sm bg-white text-[#212A31] placeholder-gray-500 
                           transition-all duration-300 font-medium"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#124E66] 
                             text-xl font-bold transition-colors duration-200 p-1 rounded-lg hover:bg-gray-100"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Visitor Card */}
      {filteredVisitor && (
        <div className="relative bg-white/95 backdrop-blur-sm p-8 rounded-3xl shadow-[0_8px_32px_rgba(18,78,102,0.12)] 
                        border border-gray-200/50 mb-8 group hover:shadow-[0_12px_40px_rgba(18,78,102,0.15)] 
                        transition-all duration-500 overflow-hidden">
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#124E66]/5 via-transparent to-[#2D7D9A]/3 
                          opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          {/* Status accent line */}
          <div className={`absolute top-0 left-0 right-0 h-1 ${
            filteredVisitor.status === 'Checked-In' 
              ? 'bg-gradient-to-r from-emerald-500 to-emerald-600' 
              : filteredVisitor.status === 'Checked-Out'
              ? 'bg-gradient-to-r from-red-500 to-red-600'
              : 'bg-gradient-to-r from-amber-500 to-amber-600'
          }`}></div>
          
          <div className="relative z-10">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-2xl font-bold text-[#124E66] mb-1">Visitor Details</h3>
                <p className="text-gray-600">Verified visitor information</p>
              </div>
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${
                  filteredVisitor.status === 'Checked-In' 
                    ? 'bg-emerald-500' 
                    : filteredVisitor.status === 'Checked-Out'
                    ? 'bg-red-500'
                    : 'bg-amber-500'
                } animate-pulse`}></div>
                <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${
                  filteredVisitor.status === 'Checked-In' 
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                    : filteredVisitor.status === 'Checked-Out'
                    ? 'bg-red-50 text-red-700 border-red-200'
                    : 'bg-amber-50 text-amber-700 border-amber-200'
                }`}>
                  {filteredVisitor.status}
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { label: 'Name', value: filteredVisitor.name },
                { label: 'Visitor ID', value: filteredVisitor.visitorId },
                { label: 'NIC', value: filteredVisitor.nic },
                { label: 'Vehicle Number', value: filteredVisitor.vehicleNumber },
                { label: 'Appointment Date', value: filteredVisitor.date },
                { label: 'Host Name', value: filteredHost?.name }
              ].map((item, index) => (
                <div key={index} className="bg-gray-50/70 p-4 rounded-2xl border border-gray-100 
                                          hover:bg-gray-50 transition-colors duration-200">
                  <span className="text-sm font-medium text-gray-500 uppercase tracking-wide block mb-2">
                    {item.label}
                  </span>
                  <span className="font-semibold text-[#124E66] text-lg block">
                    {item.value || 'N/A'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-center gap-6 mb-8">
        <button
          onClick={() => handleAction('in')}
          className="group relative bg-gradient-to-r from-[#124E66] to-[#2D7D9A] hover:from-[#0F3A4F] hover:to-[#124E66] 
                   text-white px-8 py-4 rounded-2xl transition-all duration-300 font-semibold 
                   disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_20px_rgba(18,78,102,0.3)]
                   hover:shadow-[0_8px_30px_rgba(18,78,102,0.4)] hover:-translate-y-1 min-w-[180px]
                   border border-white/20 overflow-hidden"
          disabled={isLoading || (filteredVisitor?.status === 'Checked-In')}
        >
          <div className="absolute inset-0 bg-white/10 transform scale-x-0 group-hover:scale-x-100 
                          transition-transform duration-300 origin-left"></div>
          <div className="relative z-10 flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/>
            </svg>
            <span>{isLoading ? 'Processing...' : 'Check-In Visitor'}</span>
          </div>
        </button>
        
        <button
          onClick={() => handleAction('out')}
          className="group relative bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 
                   text-white px-8 py-4 rounded-2xl transition-all duration-300 font-semibold 
                   disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_20px_rgba(239,68,68,0.3)]
                   hover:shadow-[0_8px_30px_rgba(239,68,68,0.4)] hover:-translate-y-1 min-w-[180px]
                   border border-white/20 overflow-hidden"
          disabled={isLoading || (filteredVisitor?.status === 'Checked-Out')}
        >
          <div className="absolute inset-0 bg-white/10 transform scale-x-0 group-hover:scale-x-100 
                          transition-transform duration-300 origin-left"></div>
          <div className="relative z-10 flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
            <span>{isLoading ? 'Processing...' : 'Check-Out Visitor'}</span>
          </div>
        </button>
      </div>

      {/* Recent Activities */}
      <div className="relative bg-white/95 backdrop-blur-sm p-8 rounded-3xl shadow-[0_8px_32px_rgba(18,78,102,0.12)] 
                      border border-gray-200/50 group hover:shadow-[0_12px_40px_rgba(18,78,102,0.15)] 
                      transition-all duration-500 overflow-hidden">
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#124E66]/5 via-transparent to-[#2D7D9A]/3 
                        opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-2xl font-bold text-[#124E66] mb-1 flex items-center gap-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                Recent Activities
              </h3>
              <p className="text-gray-600">Latest visitor check-in/out activities</p>
            </div>
            {activities.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="bg-gradient-to-r from-[#124E66] to-[#2D7D9A] text-white text-sm 
                               rounded-full px-3 py-1 font-semibold shadow-lg">
                  {activities.length}
                </span>
              </div>
            )}
          </div>
          
          {activities.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                        d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                </svg>
              </div>
              <p className="text-gray-500 font-medium">No recent activity recorded</p>
              <p className="text-gray-400 text-sm mt-1">Activities will appear here once visitors are processed</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
              {activities.map((activity, index) => (
                <div key={index} 
                     className="group/item bg-gradient-to-r from-white to-gray-50/50 p-6 rounded-2xl 
                              border border-gray-200/60 shadow-sm hover:shadow-md hover:border-[#124E66]/20 
                              transition-all duration-300 hover:-translate-y-0.5">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        activity.action === 'Checked-In'
                          ? 'bg-emerald-100 text-emerald-600'
                          : 'bg-red-100 text-red-600'
                      }`}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          {activity.action === 'Checked-In' ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                  d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/>
                          ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                          )}
                        </svg>
                      </div>
                      <div>
                        <p className="font-semibold text-[#124E66] text-lg">{activity.name}</p>
                        <p className="text-sm text-gray-500">ID: {activity.visitorId}</p>
                      </div>
                    </div>
                    <span className={`text-sm px-3 py-1.5 rounded-full font-semibold border ${
                      activity.action === 'Checked-In'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-red-50 text-red-700 border-red-200'
                    }`}>
                      {activity.action}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <span>{formatTime(activity.timestamp)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
    </div>
  );
};

export default VerifyVisitors;
