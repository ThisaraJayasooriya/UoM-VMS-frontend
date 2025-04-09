import  { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";

const MeetingRequests = () => {
  // Dummy data to simulate meeting requests from a database
  const [meetingRequests, setMeetingRequests] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // Simulate fetching data from a database
  useEffect(() => {
    const dummyData = [
      { id: "M0001", title: "Team Meeting", timeAgo: "2 hours ago", phone: "0113567854", email: "john@gmail.com", visitorName: "John Wick" },
      { id: "M0002", title: "Project Discussion", timeAgo: "5 hours ago", phone: "0113567854", email: "kevin@gmail.com", visitorName: "Kevin Levin" },
      { id: "M0003", title: "Client Call", timeAgo: "1 day ago", phone: "0113567854", email: "james@gmail.com", visitorName: "James Bond" },
      { id: "M0004", title: "Official Meeting", timeAgo: "3 days ago", phone: "0113567854", email: "nick@gmail.com", visitorName: "Nick Leo" },
    ];
    setMeetingRequests(dummyData); // Set the dummy data to the state
  }, []);

  return (
    <div className="relative">
      {/* Wrapper for header and content */}
      <div
        className={`pt-20 px-4 lg:px-20 transition-all duration-300 ${
          isPopupOpen ? "blur-sm pointer-events-none" : ""
        }`}
      >
        {/* Header */}
        <h5 className="text-2xl font-bold mb-10 ml-15">
          You have {meetingRequests.length} meeting requests
        </h5>

        {/* Meeting Requests */}
        <div className="flex flex-col items-center gap-4">
          {meetingRequests.map((request) => (
            <button
              key={request.id}
              className="bg-blue2 text-white rounded-2xl px-6 py-3 flex justify-between w-200 cursor-pointer hover:bg-customgray transition duration-300"
              onClick={() => setIsPopupOpen(true)}
            >
              <span className="text-sm">{request.id}</span>
              <span className="font-semibold mx-3 flex items-center text-2xl">
                {request.title}
              </span>
              <span className="text-sm text-black">{request.timeAgo}...</span>
            </button>
          ))}
        </div>
      </div>

      {/* Popup */}
      {isPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Dark Overlay */}
          <div className="absolute inset-0  bg-opacity-50 backdrop-blur-sm"></div>

          {/* Popup Content */}
          <div className="relative bg-white p-6 rounded-lg w-96 z-10 shadow-lg">
          <button
              onClick={() => setIsPopupOpen(false)}
              className="absolute top-2 right-2  text-white px-4 py-2 rounded hover:bg-gray-300 transition duration-300 cursor-pointer"
              >
              <FaTimes className="text-black text" />
            </button>
            <h3 className="text-2xl font-bold mb-4 flex justify-center">Meeting Details</h3>
           
            <p className="mb-4">Here you can display meeting details.</p>
            
          </div>
        </div>
      )}
    </div>
  );
};

export default MeetingRequests;