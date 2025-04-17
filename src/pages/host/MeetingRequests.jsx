import { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { CgMenuLeftAlt } from "react-icons/cg";
import { LuContact } from "react-icons/lu";
import { FaPenToSquare } from "react-icons/fa6";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";

const MeetingRequests = () => {
  const [meetingRequests, setMeetingRequests] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState(null); // State to store the selected meeting details
  const [showAllSlots, setShowAllSlots] = useState(false); // default OFF
  const [endTime, setEndTime] = useState(""); // Calculated end time
  const [selectedDate, setSelectedDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [duration, setDuration] = useState(30);

  useEffect(() => {
    const dummyData = [
      {
        id: "M0001",
        title: "Team Meeting",
        timeAgo: "2 hours ago",
        phone: "0113567854",
        email: "john@gmail.com",
        visitorName: "John Wick",
      },
      {
        id: "M0002",
        title: "Project Discussion",
        timeAgo: "5 hours ago",
        phone: "0113567854",
        email: "kevin@gmail.com",
        visitorName: "Kevin Levin",
      },
      {
        id: "M0003",
        title: "Client Call",
        timeAgo: "1 day ago",
        phone: "0113567854",
        email: "james@gmail.com",
        visitorName: "James Bond",
      },
      {
        id: "M0004",
        title: "Official Meeting",
        timeAgo: "3 days ago",
        phone: "0113567854",
        email: "nick@gmail.com",
        visitorName: "Nick Leo",
      },
    ];
    setMeetingRequests(dummyData);
  }, []);

  // Calculate end time whenever startTime or duration changes
  useEffect(() => {
    if (startTime && duration) {
      // Ensure startTime is in "HH:mm" format
      const startTimeObj = new Date(`1970-01-01T${startTime}:00`);
      const endTimeObj = new Date(startTimeObj.getTime() + duration * 60000);
      const formattedEndTime = endTimeObj.toTimeString().slice(0, 5);
      setEndTime(formattedEndTime);
    }
  }, [startTime, duration]);

  const handleButtonClick = (meeting) => {
    setSelectedMeeting(meeting); // Set the selected meeting details
    setIsPopupOpen(true); // Open the popup
  };

  const handleAccept = (data) => {
    console.log("Accepted with:", data);
    setIsPopupOpen(false);
  };

  const handleReject = (id) => {
    console.log("Rejected request:", id);
    setIsPopupOpen(false);
  };

  const saveAccept = () => {
    handleAccept({
      ...selectedMeeting,
      responseType: showAllSlots ? "allSlots" : "exactSlot",
      startTime,
      endTime,
    });
  };

  if (!open) return null;

  return (
    <div className="relative">
      <div
        className={`pt-20 px-4 lg:px-20 transition-all duration-300 ${
          isPopupOpen ? "blur-sm pointer-events-none" : ""
        }`}
      >
        <h5 className="text-2xl font-bold mb-10 ml-15">
          You have {meetingRequests.length} meeting requests
        </h5>

        <div className="flex flex-col items-center gap-4">
          {meetingRequests.map((request) => (
            <button
              key={request.id}
              className="bg-blue2 text-white rounded-2xl px-6 py-3 flex justify-between w-200 cursor-pointer hover:bg-customgray transition duration-300"
              onClick={() => handleButtonClick(request)} // Pass the entire meeting object
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

      {isPopupOpen && selectedMeeting && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-opacity-50 backdrop-blur-sm"></div>

          <div className="relative bg-white p-6 rounded-lg w-115 z-10 shadow-lg border-black border-solid border-1 ">
            <button
              onClick={() => setIsPopupOpen(false)}
              className="absolute top-2 right-2 text-white px-4 py-2   rounded hover:bg-gray-300 transition duration-300 cursor-pointer"
            >
              <FaTimes className="text-black text" />
            </button>
            <h3 className="text-2xl font-bold mb-4 flex justify-center m-1">
              Meeting Details ({selectedMeeting.id})
            </h3>
            <div className="flex flex-col gap-5 ">
              <div className="flex gap-4 ml-12 items-center">
                <div>
                  <CgMenuLeftAlt className="text-2xl" />
                </div>
                <div>
                  <p>
                    <strong>Name</strong>
                  </p>
                  <p>{selectedMeeting.visitorName}</p>
                </div>
              </div>
              <div className="flex gap-4 ml-12 items-center">
                <div>
                  <LuContact className="text-2xl" />
                </div>
                <div>
                  <p>
                    <strong>Contact Info</strong>
                  </p>
                  <p>{selectedMeeting.email}</p>
                  <p>{selectedMeeting.phone}</p>
                </div>
              </div>
              <div className="flex gap-4 ml-12 items-center">
                <div>
                  <FaPenToSquare className="text-2xl" />
                </div>
                <div>
                  <p>
                    <strong>Purpose</strong>
                  </p>
                  <p>{selectedMeeting.title}</p>
                </div>
              </div>
              <hr />
              <div>
                {/* Toggle */}
                <div className="flex items-center justify-between ">
                  <FormControlLabel
                    control={
                      <Switch
                        checked={showAllSlots}
                        onChange={() => setShowAllSlots(!showAllSlots)}
                        color="primary"
                      />
                    }
                    label="Open all free time slots to visitor"
                    className="text-lg"
                  />
                </div>
              </div>
              <div>
                {/* Exact time slot section (only when toggle is OFF) */}
                {!showAllSlots && (
                  <div className=" flex gap-2 items-center mb-4">
                    <div className="mb-4">
                      <label className="block font-semibold">Select Date <br /><br /></label>
                      <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block font-semibold">
                        Select Start Time
                      </label>
                      <input
                        type="time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block font-semibold">
                        Appointment Duration
                      </label>
                      <select
                        value={duration}
                        onChange={(e) => setDuration(Number(e.target.value))}
                        className="w-full p-2 border rounded bg-gray-100"
                      >
                        <option value={30}>30 minutes</option>
                        <option value={60}>1 hour</option>
                        <option value={90}>1.5 hours</option>
                      </select>
                    </div>

                   
                  </div>
                  
                )}
              </div>
            </div>
            {/* Buttons */}
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => handleReject(selectedMeeting.id)}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Reject
              </button>
              <button
                onClick={saveAccept}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Accept
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MeetingRequests;
