import { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';

const VerifyVisitors = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialVisitCode = queryParams.get('code') || '';

  const [visitors, setVisitors] = useState([
    {
      name: 'Joe Root',
      visitCode: 'V00125',
      nic: '20012345678',
      vehicleNumber: 'AB1234',
      host: 'George Smith',
      status: 'Awaiting Check-In'
    },
    {
      name: 'Jane Doe',
      visitCode: 'V00126',
      nic: '20012345679',
      vehicleNumber: 'CD5678',
      host: 'John Doe',
      status: 'Awaiting Check-In'
    },
  ]);

  const [activities, setActivities] = useState([
    {
      id: 1,
      visitCode: 'V00125',
      name: 'Joe Root',
      action: 'Checked-In',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: 2,
      visitCode: 'V00126',
      name: 'Jane Doe',
      action: 'Checked-Out',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
    },
  ]);

  const [searchTerm, setSearchTerm] = useState(initialVisitCode);
  const [filteredVisitor, setFilteredVisitor] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });

  useEffect(() => {
    const term = searchTerm.trim().toLowerCase();
    if (term) {
      const match = visitors.find(v =>
        v.visitCode.toLowerCase() === term || v.nic.toLowerCase() === term
      );
      setFilteredVisitor(match || null);
    } else {
      setFilteredVisitor(null);
    }
  }, [searchTerm, visitors]);

  useEffect(() => {
    // Hide alert after 5 seconds
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
    const term = searchTerm.trim().toLowerCase();
    if (!term) return;

    setIsLoading(true);
    await new Promise(res => setTimeout(res, 1000));

    const index = visitors.findIndex(v =>
      v.visitCode.toLowerCase() === term || v.nic.toLowerCase() === term
    );

    if (index !== -1) {
      const updatedVisitors = [...visitors];
      const visitorName = updatedVisitors[index].name;
      updatedVisitors[index].status = type === 'in' ? 'Checked-In' : 'Checked-Out';
      setVisitors(updatedVisitors);

      const newActivity = {
        id: activities.length + 1,
        visitCode: updatedVisitors[index].visitCode,
        name: visitorName,
        action: type === 'in' ? 'Checked-In' : 'Checked-Out',
        timestamp: new Date().toISOString(),
      };

      setActivities([newActivity, ...activities]);
      
      // Show success alert
      showAlert(
        `${visitorName} has been successfully ${type === 'in' ? 'checked in' : 'checked out'}.`,
        type === 'in' ? 'success-in' : 'success-out'
      );
    }

    setSearchTerm('');
    setIsLoading(false);
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <div className="flex flex-col flex-1 pt-16 px-4 max-w-5xl mx-auto text-darkblue2">
      {/* Header */}
      <h1 className="text-2xl font-bold mb-6 text-center text-blue">Visitor Management System</h1>
      
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
      <div className="bg-blue3 shadow-lg rounded-xl p-6 mb-8 border border-blue2/20">
        <h2 className="text-xl font-semibold mb-5 text-center text-blue">Verify Visitor</h2>
        <form onSubmit={(e) => e.preventDefault()} className="flex items-center gap-4 justify-center">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              value={searchTerm}
              onChange={handleInputChange}
              placeholder="Enter Visit Code or NIC"
              className="px-5 py-3 rounded-full border border-blue2/30 w-full focus:outline-none focus:ring-2 focus:ring-blue shadow-sm bg-white text-darkblue placeholder-customgray/70"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-customgray hover:text-darkblue text-xl font-bold"
              >
                ×
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Visitor Card */}
      {filteredVisitor && (
        <div className="bg-white shadow-md rounded-xl p-6 mb-8 border border-blue3 transition-all duration-300 ease-in-out">
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-lg font-semibold text-blue">Visitor Details</h3>
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
              <span className="text-sm text-customgray">Name</span>
              <span className="font-medium text-darkblue">{filteredVisitor.name}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-customgray">Visitor Code</span>
              <span className="font-medium text-darkblue">{filteredVisitor.visitCode}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-customgray">NIC</span>
              <span className="font-medium text-darkblue">{filteredVisitor.nic}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-customgray">Vehicle Number</span>
              <span className="font-medium text-darkblue">{filteredVisitor.vehicleNumber}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-customgray">Host</span>
              <span className="font-medium text-darkblue">{filteredVisitor.host}</span>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
        <button
          onClick={() => handleAction('in')}
          className="bg-blue hover:bg-blue/90 text-white px-8 py-3 rounded-lg shadow-md transition-all duration-200 font-medium disabled:opacity-60 disabled:cursor-not-allowed"
          disabled={isLoading || (filteredVisitor?.status === 'Checked-In')}
        >
          {isLoading ? 'Processing...' : 'Check-In Visitor'}
        </button>
        <button
          onClick={() => handleAction('out')}
          className="bg-blue2 hover:bg-blue2/90 text-white px-8 py-3 rounded-lg shadow-md transition-all duration-200 font-medium disabled:opacity-60 disabled:cursor-not-allowed"
          disabled={isLoading || (filteredVisitor?.status === 'Checked-Out')}
        >
          {isLoading ? 'Processing...' : 'Check-Out Visitor'}
        </button>
      </div>

      {/* Recent Activities */}
      <div className="bg-blue3 shadow-md rounded-xl p-6 mb-6">
        <h3 className="text-lg font-semibold mb-5 text-blue flex items-center">
          <span className="mr-2">Recent Activities</span>
          {activities.length > 0 && (
            <span className="bg-blue text-white text-xs rounded-full px-2 py-1">
              {activities.length}
            </span>
          )}
        </h3>
        {activities.length === 0 ? (
          <div className="text-center py-8 text-customgray">
            <p>No recent activity recorded</p>
          </div>
        ) : (
          <ul className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {activities.map((activity) => (
              <li key={activity.id} className="bg-white p-4 rounded-lg border border-blue2/20 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-darkblue">{activity.name}</p>
                    <p className="text-xs text-customgray mt-1">Code: {activity.visitCode}</p>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                    activity.action === 'Checked-In'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {activity.action}
                  </span>
                </div>
                <p className="text-xs text-customgray mt-2 italic">{formatTime(activity.timestamp)}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default VerifyVisitors;