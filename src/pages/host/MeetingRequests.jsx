import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchPendingAppointments,
  updateAppointmentStatus,
} from "../../services/appointmentService";
import { 
  FaTimes, 
  FaUser, 
  FaPhone, 
  FaEnvelope,
  FaClock,
  FaCalendarAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaBell,
  FaEye,
  FaArrowLeft
} from "react-icons/fa";
import { 
  HiOutlineDocumentText,
  HiOutlineUserGroup,
  HiOutlineClock
} from "react-icons/hi";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";

const MeetingRequests = () => {
  const navigate = useNavigate();
  const [meetingRequests, setMeetingRequests] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [showAllSlots, setShowAllSlots] = useState(false);
  const [endTime, setEndTime] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [duration, setDuration] = useState(30);
  const [hostId, setHostId] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [showConfirmDecline, setShowConfirmDecline] = useState(false);
  const [declineRequestId, setDeclineRequestId] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("userData")); // adjust key based on your login
    if (storedUser && storedUser.id) {
      setHostId(storedUser.id);
    }
  }, []);

  useEffect(() => {
    const loadRequests = async () => {
      try {
        setIsInitialLoading(true);
        // Add a small delay to show the loading animation
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const data = await fetchPendingAppointments(hostId);
        const formatted = data.map((a) => ({
          id: a._id,
          aId: a.appointmentId,
          title: a.reason,
          visitorName: a.firstname + " " + a.lastname,
          phone: a.contact || "N/A",

          timeAgo: new Date(a.requestedAt).toLocaleString(),
        }));
        setMeetingRequests(formatted);
      } catch (error) {
        console.error("Failed to fetch meeting requests:", error);
      } finally {
        setIsInitialLoading(false);
      }
    };

    if (hostId) loadRequests();
  }, [hostId]);

  useEffect(() => {
    if (startTime && duration) {
      const start = new Date(`1970-01-01T${startTime}:00`);
      const end = new Date(start.getTime() + duration * 60000);
      setEndTime(end.toTimeString().slice(0, 5));
    }
  }, [startTime, duration]);

  const handleButtonClick = (meeting) => {
    setSelectedMeeting(meeting);
    setIsPopupOpen(true);
  };

  const handleAccept = async (data) => {
    setIsProcessing(true);
    try {
      await updateAppointmentStatus(data.id, {
        status: "accepted",
        date: data.date,
        startTime: data.startTime,
        endTime: data.endTime,
        responseType: data.responseType,
      });

      setMeetingRequests((prev) => prev.filter((item) => item.id !== data.id));
      setIsPopupOpen(false);
      // Reset form
      setSelectedDate("");
      setStartTime("");
      setShowAllSlots(false);
    } catch (error) {
      console.error("Failed to accept appointment:", error);
      alert("Error accepting appointment. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async (id) => {
    setIsProcessing(true);
    try {
      await updateAppointmentStatus(id, {
        status: "rejected",
      });
      setMeetingRequests((prev) => prev.filter((item) => item.id !== id));
      setIsPopupOpen(false);
      setShowConfirmDecline(false);
      setDeclineRequestId(null);
    } catch (error) {
      console.error("Failed to reject appointment:", error);
      alert("Error rejecting appointment. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeclineClick = (id) => {
    setDeclineRequestId(id);
    setShowConfirmDecline(true);
  };

  const confirmDecline = () => {
    if (declineRequestId) {
      handleReject(declineRequestId);
    }
  };

  const cancelDecline = () => {
    setShowConfirmDecline(false);
    setDeclineRequestId(null);
  };

  const saveAccept = () => {
    if (!showAllSlots && (!selectedDate || !startTime)) {
      alert("Please select date and time for the appointment.");
      return;
    }
    
    handleAccept({
      ...selectedMeeting,
      responseType: showAllSlots ? "allSlots" : "exactSlot",
      date: selectedDate,
      startTime,
      endTime,
    });
  };

  // Helper function to get time ago string
  const getTimeAgoString = (timeString) => {
    const now = new Date();
    const requestTime = new Date(timeString);
    const diffMs = now - requestTime;
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffDays > 0) return `${diffDays}d ago`;
    if (diffHours > 0) return `${diffHours}h ago`;
    if (diffMinutes > 0) return `${diffMinutes}m ago`;
    return "Just now";
  };

  // Helper function to get priority styling
  const getPriorityColor = (timeString) => {
    const now = new Date();
    const requestTime = new Date(timeString);
    const hoursDiff = (now - requestTime) / (1000 * 60 * 60);
    
    if (hoursDiff > 24) return "bg-red-50 text-red-700 border-red-200";
    if (hoursDiff > 12) return "bg-yellow-50 text-yellow-700 border-yellow-200";
    return "bg-green-50 text-green-700 border-green-200";
  };

  // Skeleton Loading Component
  const SkeletonLoader = () => (
    <div className="space-y-4 animate-pulse">
      {[...Array(3)].map((_, index) => (
        <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gray-300 rounded-full animate-pulse"></div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-3">
                <div className="h-6 w-20 bg-gray-300 rounded-full animate-pulse"></div>
              </div>
              <div className="mb-3 p-4 bg-gray-100 rounded-lg">
                <div className="h-4 w-32 bg-gray-300 rounded animate-pulse mb-2"></div>
                <div className="h-6 w-3/4 bg-gray-300 rounded animate-pulse"></div>
              </div>
              <div className="mb-3">
                <div className="h-4 w-48 bg-gray-300 rounded animate-pulse"></div>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-4 w-16 bg-gray-300 rounded animate-pulse"></div>
                <div className="h-4 w-20 bg-gray-300 rounded animate-pulse"></div>
                <div className="h-4 w-24 bg-gray-300 rounded animate-pulse"></div>
              </div>
            </div>
            <div className="w-20">
              <div className="h-10 w-full bg-gray-300 rounded-lg animate-pulse"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  // Add custom styles for animations
const styles = `
  @keyframes fadeIn {
    from { 
      opacity: 0; 
      transform: translateY(20px);
    }
    to { 
      opacity: 1; 
      transform: translateY(0);
    }
  }
  
  @keyframes slideUp {
    from { 
      opacity: 0;
      transform: translateY(30px);
    }
    to { 
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes slideIn {
    from { 
      opacity: 0;
      transform: translateX(30px);
    }
    to { 
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  @keyframes bounceGentle {
    0%, 100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-8px);
    }
  }
  
  @keyframes pulseSlow {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.8;
    }
  }
  
  .animate-fade-in {
    animation: fadeIn 0.8s ease-out forwards;
  }
  
  .animate-slide-up {
    animation: slideUp 0.8s ease-out forwards;
  }
  
  .animate-slide-in {
    animation: slideIn 0.6s ease-out forwards;
  }
  
  .animate-bounce-gentle {
    animation: bounceGentle 2s ease-in-out infinite;
  }
  
  .animate-pulse-slow {
    animation: pulseSlow 2s ease-in-out infinite;
  }
`;

// Inject styles into the document
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = styles;
  document.head.appendChild(styleElement);
}

  return (
    <div className="pt-20 px-4 lg:px-16 max-w-6xl mx-auto">
      {/* Back Button */}
      <div className="mb-4 animate-fade-in">
        <button
          onClick={() => window.history.length > 1 ? window.history.back() : window.location.assign('/host/dashboard')}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-darkblue rounded-lg font-medium shadow-sm border border-gray-200 transition-colors mb-2"
          aria-label="Back"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          Back
        </button>
      </div>
      {/* Main Content */}
      <div className={`transition-all duration-300 ${
        isPopupOpen ? "blur-sm pointer-events-none" : ""
      }`}>
        
        {/* Page Header */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue/10 rounded-xl animate-pulse-slow">
                <FaBell className="text-blue text-xl animate-bounce-gentle" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-darkblue">Pending Requests</h1>
                <p className="text-customgray mt-1">Review and respond to visitor appointment requests</p>
              </div>
            </div>
            {meetingRequests.length > 0 && !isInitialLoading && (
              <div className="bg-blue text-white px-4 py-2 rounded-full font-semibold flex items-center gap-2 animate-slide-in">
                <HiOutlineUserGroup />
                {meetingRequests.length} Pending
              </div>
            )}
          </div>
        </div>
        
        {/* Meeting Requests */}
        {isInitialLoading ? (
          <div className="animate-fade-in">
            <SkeletonLoader />
          </div>
        ) : meetingRequests.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm animate-fade-in">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <HiOutlineDocumentText className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-darkblue2 mb-2">No meeting requests</h3>
            <p className="text-customgray">You're all caught up! No pending requests at the moment.</p>
          </div>
        ) : (
          <div className="space-y-4 animate-slide-up">
            {meetingRequests.map((request) => (
              <div
                key={request.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-blue/30 group"
              >
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    {/* Left Section - Main Info */}
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-12 h-12 bg-blue/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <FaUser className="text-blue" />
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                          <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(request.timeAgo)} flex-shrink-0`}>
                            {getTimeAgoString(request.timeAgo)}
                          </div>
                        </div>
                        
                        {/* Purpose - Made more prominent */}
                        <div className="mb-3 p-4 bg-blue/5 border-l-4 border-blue rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <HiOutlineDocumentText className="text-blue w-5 h-5" />
                            <span className="font-semibold text-darkblue text-sm">Meeting Purpose</span>
                          </div>
                          <h3 className="text-lg font-bold text-darkblue2 leading-relaxed group-hover:text-blue transition-colors">
                            {request.title}
                          </h3>
                        </div>
                        
                        {/* Visitor name - Made less prominent */}
                        <div className="mb-3">
                          <span className="text-sm text-customgray">Requested by: </span>
                          <span className="font-medium text-darkblue2">{request.visitorName}</span>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-customgray">
                          <div className="flex items-center gap-1">
                            <span className="bg-blue text-white px-2 py-1 text-xs rounded-full font-medium">
                              {request.aId}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <FaPhone className="text-blue w-3 h-3" />
                            <span>{request.phone}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <FaClock className="text-blue w-3 h-3" />
                            <span>{new Date(request.timeAgo).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Section - Actions */}
                    <div className="flex flex-col sm:flex-row gap-3 lg:flex-col lg:w-40">
                      <button
                        onClick={() => handleButtonClick(request)}
                        className="px-4 py-2 bg-blue text-white rounded-lg hover:bg-darkblue transition-colors font-medium flex items-center justify-center gap-2"
                      >
                        <FaEye />
                        Review
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Meeting Request Modal - Smaller and Clearer */}
      {isPopupOpen && selectedMeeting && !showConfirmDecline && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
          
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg z-10 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-darkblue via-blue to-darkblue2 text-white px-5 py-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Review Request</h3>
                  <p className="text-blue3/80 text-xs mt-1">ID: {selectedMeeting.aId}</p>
                </div>
                <button 
                  onClick={() => setIsPopupOpen(false)}
                  disabled={isProcessing}
                  className="p-1.5 hover:bg-white/20 rounded-lg transition-colors disabled:opacity-50"
                >
                  <FaTimes className="text-white text-sm" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-5 space-y-4">
              {/* Meeting Details - Clearer Display */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Meeting Details
                </label>
                <div className="bg-blue-50 border-l-4 border-blue rounded-lg p-4">
                  {/* Purpose - Most prominent */}
                  <div className="mb-3">
                    <span className="text-xs text-blue-600 font-medium uppercase tracking-wide">Purpose</span>
                    <h4 className="text-base font-bold text-darkblue mt-1 leading-tight">{selectedMeeting.title}</h4>
                  </div>
                  
                  {/* Visitor Info - Secondary but clear */}
                  <div className="grid grid-cols-1 gap-2 text-sm">
                    <div className="flex items-center">
                      <span className="text-gray-600 font-medium">Visitor:</span>
                      <span className="text-gray-800 font-semibold pl-4">{selectedMeeting.visitorName}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-600 font-medium">Contact:</span>
                      <span className="text-gray-800 font-semibold pl-4">{selectedMeeting.phone}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Scheduling Options */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Scheduling
                </label>
                
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <FormControlLabel
                    control={
                      <Switch
                        checked={showAllSlots}
                        onChange={() => setShowAllSlots(!showAllSlots)}
                        disabled={isProcessing}
                        size="small"
                        sx={{
                          '& .MuiSwitch-switchBase.Mui-checked': {
                            color: '#124E66',
                          },
                          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                            backgroundColor: '#124E66',
                          },
                        }}
                      />
                    }
                    label={
                      <span className="text-sm text-gray-800">
                        Let visitor choose available slots
                      </span>
                    }
                  />
                  
                  {!showAllSlots && (
                    <div className="mt-3 space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Date</label>
                          <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            disabled={isProcessing}
                            className="w-full p-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue/20 focus:border-blue transition-all disabled:bg-gray-100"
                            min={new Date().toISOString().split('T')[0]}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Start Time</label>
                          <input
                            type="time"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            disabled={isProcessing}
                            className="w-full p-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue/20 focus:border-blue transition-all disabled:bg-gray-100"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-2">Duration</label>
                        <div className="grid grid-cols-4 gap-2">
                          {[30, 60, 90, 120].map((mins) => (
                            <button
                              key={mins}
                              onClick={() => setDuration(mins)}
                              disabled={isProcessing}
                              className={`px-2 py-2 text-xs font-medium rounded-md border-2 transition-all disabled:opacity-50 ${
                                duration === mins 
                                  ? 'bg-blue text-white border-blue shadow-md' 
                                  : 'bg-white text-gray-700 border-gray-200 hover:border-blue hover:shadow-sm'
                              }`}
                            >
                              {mins === 30 ? '30m' : mins === 60 ? '1h' : mins === 90 ? '1.5h' : '2h'}
                            </button>
                          ))}
                        </div>
                      </div>

                      {startTime && selectedDate && (
                        <div className="p-2.5 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-green-800 font-medium">
                              Meeting: {new Date(selectedDate).toLocaleDateString()} • {startTime} - {endTime}
                            </span>
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                              {duration}min
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-5 py-3 flex items-center justify-between border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                <span className="text-xs text-gray-600">
                  {showAllSlots ? 'Visitor will choose slots' : 'Set specific time'}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleDeclineClick(selectedMeeting.id)}
                  disabled={isProcessing}
                  className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isProcessing ? "Processing..." : "Decline"}
                </button>
                <button
                  onClick={saveAccept}
                  disabled={isProcessing || (!showAllSlots && (!selectedDate || !startTime))}
                  className="px-4 py-2 text-sm bg-blue text-white rounded-lg hover:bg-darkblue transition-colors font-medium shadow-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isProcessing ? "Processing..." : "Accept"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Decline Confirmation Modal - Same style as Appointments component */}
      {showConfirmDecline && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-opacity-50 backdrop-blur-sm"></div>
          
          <div className="relative bg-white p-6 rounded-lg w-115 z-10 shadow-lg border-black border-solid border-1">
            <button
              onClick={cancelDecline}
              disabled={isProcessing}
              className="absolute top-2 right-2 text-white px-4 py-2 rounded hover:bg-gray-300 transition duration-300 cursor-pointer disabled:cursor-not-allowed"
            >
              <FaTimes className="text-black text" />
            </button>
            
            <h3 className="text-2xl font-bold mb-4 flex justify-center m-1 text-red-600">
              Decline Meeting Request
            </h3>
            
            <div className="mb-6">
              {meetingRequests.find(req => req.id === declineRequestId) && (
                <>
                  <p className="text-lg font-semibold text-center mb-2">
                    {meetingRequests.find(req => req.id === declineRequestId).aId}
                  </p>
                  <p className="text-center text-gray-600 mb-4">
                    Visitor: {meetingRequests.find(req => req.id === declineRequestId).visitorName}
                  </p>
                  <p className="text-center text-gray-600 mb-4">
                    Purpose: {meetingRequests.find(req => req.id === declineRequestId).title}
                  </p>
                </>
              )}
              
              <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
                <p className="text-red-800 text-center font-medium">
                  ⚠️ Are you sure you want to decline this meeting request?
                </p>
                <p className="text-red-600 text-center text-sm mt-2">
                  This action cannot be undone.
                </p>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3">
              <button
                onClick={cancelDecline}
                disabled={isProcessing}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 font-semibold cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Keep Request
              </button>
              <button
                onClick={confirmDecline}
                disabled={isProcessing}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-semibold cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
              >
                {isProcessing ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Declining...
                  </>
                ) : (
                  'Yes, Decline Request'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MeetingRequests;
