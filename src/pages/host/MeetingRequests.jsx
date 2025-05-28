import { useState, useEffect } from "react";
import {
  fetchPendingAppointments,
  updateAppointmentStatus,
} from "../../services/appointmentService"; // ✅ Adjust path
import { FaTimes } from "react-icons/fa";
import { CgMenuLeftAlt } from "react-icons/cg";
import { LuContact } from "react-icons/lu";
import { FaPenToSquare } from "react-icons/fa6";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";

const MeetingRequests = () => {
  const [meetingRequests, setMeetingRequests] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [showAllSlots, setShowAllSlots] = useState(false);
  const [endTime, setEndTime] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [duration, setDuration] = useState(30);
  const [hostId, setHostId] = useState("");

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("userData")); // adjust key based on your login
    if (storedUser && storedUser.id) {
      setHostId(storedUser.id);
    }
  }, []);

  useEffect(() => {
    const loadRequests = async () => {
      try {
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
    } catch (error) {
      console.error("Failed to accept appointment:", error);
      alert("Error accepting appointment. Please try again.");
    }
  };

  const handleReject = (id) => {
    console.log("Rejected:", id);
    setIsPopupOpen(false);
  };

  const saveAccept = () => {
    handleAccept({
      ...selectedMeeting,
      responseType: showAllSlots ? "allSlots" : "exactSlot",
      date: selectedDate,
      startTime,
      endTime,
    });
  };

  return (
    <div className="relative">
      <div
        className={`pt-20 px-4 lg:px-20 transition-all duration-300 ${
          isPopupOpen ? "blur-sm pointer-events-none" : ""
        }`}
      >
        <h5 className="text-2xl font-bold mb-10">
          You have {meetingRequests.length} meeting requests
        </h5>
        <div className="flex flex-col items-center gap-4">
          {meetingRequests.map((request) => (
            <button
              key={request.id}
              className="bg-gray-200 w-200 border-l-4 border-[#124E66] shadow-md rounded-lg p-6 transition transform hover:scale-[1.02] cursor-pointer"
              onClick={() => handleButtonClick(request)}
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                <div className="flex flex-col items-start gap-4">
                  <p className="text-[#2E3944] text-2xl font-semibold">
                    <span className="text-[#124E66] text-2xl">📝</span> {request.title}
                  </p>
                  <p className="text-[#2E3944] mt-1">
                    <span className="font-medium">visitor:</span>{" "}
                    {request.visitorName}
                  </p>
                </div>
                <div className="mt-4 md:mt-0 flex flex-col items-end gap-4">
                  <span className=" bg-blue inline-block text-white px-3 py-1 text-sm rounded-full font-medium">
                    {request.aId}
                  </span>
                  <span className="text-[#748D94] text-sm">
                    {request.timeAgo}
                  </span>
                </div>
              </div>
              
            </button>
          ))}
        </div>
      </div>

      {isPopupOpen && selectedMeeting && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-opacity-50 backdrop-blur-sm"></div>
          <div className="relative bg-white p-6 rounded-lg w-115 z-10 shadow-lg border">
            <button
              onClick={() => setIsPopupOpen(false)}
              className="absolute top-2 right-2 text-white px-4 py-2   rounded hover:bg-gray-300 transition duration-300 cursor-pointer"
            >
              <FaTimes className="text-black" />
            </button>
            <h3 className="text-2xl font-bold mb-4 text-center">
              Meeting Details ({selectedMeeting.aId})
            </h3>
            <div className="flex flex-col gap-5">
              <div className="flex gap-4 ml-12 items-center">
                <CgMenuLeftAlt className="text-2xl" />
                <div>
                  <p>
                    <strong>Name</strong>
                  </p>
                  <p>{selectedMeeting.visitorName}</p>
                </div>
              </div>
              <div className="flex gap-4 ml-12 items-center">
                <LuContact className="text-2xl" />
                <div>
                  <p>
                    <strong>Contact Info</strong>
                  </p>
                  <p>{selectedMeeting.email}</p>
                  <p>{selectedMeeting.phone}</p>
                </div>
              </div>
              <div className="flex gap-4 ml-12 items-center">
                <FaPenToSquare className="text-2xl" />
                <div>
                  <p>
                    <strong>Purpose</strong>
                  </p>
                  <p>{selectedMeeting.title}</p>
                </div>
              </div>
              <hr />
              <FormControlLabel
                control={
                  <Switch
                    checked={showAllSlots}
                    onChange={() => setShowAllSlots(!showAllSlots)}
                    color="primary"
                  />
                }
                label="Open all free time slots to visitor"
              />
              {!showAllSlots && (
                <div className="flex gap-2 items-center mb-4">
                  <div className="mb-4">
                    <label className="block font-semibold">
                      Select Date
                      <br />
                      <br />
                    </label>
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
                      <option value={30}>30 min</option>
                      <option value={60}>1 hour</option>
                      <option value={90}>1.5 hours</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
            <div className="flex justify-end mt-4 gap-3">
              <button
                onClick={() => handleReject(selectedMeeting.id)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-semibold cursor-pointer"
              >
                Reject
              </button>
              <button
                onClick={saveAccept}
                className="px-4 py-2 bg-blue text-white rounded-md hover:bg-darkblue font-semibold cursor-pointer"
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
