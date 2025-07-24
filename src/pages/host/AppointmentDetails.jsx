import React, { useEffect, useState } from "react";
import envelope from "../../assets/envelope.png";
import check from "../../assets/check.png";
import { useNavigate } from "react-router-dom";
import { fetchPendingAppointmentsCount, fetchAcceptedAppointmentsCount } from "../../services/appointmentService";

function AppointmentDetails() {
  const navigate = useNavigate();
  const [meetingRequestCount, setMeetingRequestCount] = useState(0);
  const [confirmedAppointmentsCount, setConfirmedAppointmentsCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Inject animation keyframes
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeIn { from { opacity: 0; transform: translateY(20px);} to { opacity: 1; transform: translateY(0);} }
      @keyframes pulseSmart { 0%,100%{box-shadow:0 0 0 0 #2563eb44;} 50%{box-shadow:0 0 0 8px #2563eb11;} }
      .animate-fade-in { animation: fadeIn 0.7s cubic-bezier(.4,0,.2,1); }
      .animate-pulse-smart { animation: pulseSmart 1.5s infinite; }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  useEffect(() => {
    setIsLoading(true);
    setError(false);
    const userData = JSON.parse(localStorage.getItem("userData"));
    const hostId = userData?.id;
    if (!hostId) { setIsLoading(false); setError(true); return; }
    Promise.all([
      fetchPendingAppointmentsCount(hostId).then((data) => data.count ?? data),
      fetchAcceptedAppointmentsCount(hostId).then((data) => data.count ?? data)
    ])
      .then(([pending, confirmed]) => {
        setMeetingRequestCount(pending);
        setConfirmedAppointmentsCount(confirmed);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
        setError(true);
      });
  }, []);

  // Skeleton loader
  const CardSkeleton = () => (
    <div className="bg-gray-100 p-6 rounded-lg shadow-xl w-full min-h-[180px] flex flex-col items-center justify-center animate-pulse">
      <div className="w-14 h-14 bg-gray-300 rounded-full mb-4"></div>
      <div className="h-6 w-32 bg-gray-300 rounded mb-2"></div>
      <div className="h-4 w-24 bg-gray-200 rounded mb-1"></div>
      <div className="h-4 w-20 bg-gray-200 rounded"></div>
    </div>
  );

  return (
    <div className="pt-35 px-4 lg:px-20 min-h-screen animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-30 max-w-4xl mx-auto">
        {/* Meeting Requests Card */}
        <div
          className="relative bg-gray-100 p-6 rounded-lg shadow-xl w-full min-h-[180px] flex flex-col items-center justify-center transition-transform duration-300 hover:-translate-y-1 cursor-pointer group"
          onClick={() => {
            if (!isLoading && !error) navigate("/host/meeting", { state: { name: "Meeting Requests" } });
          }}
        >
          {isLoading ? (
            <CardSkeleton />
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-full">
              <span className="text-red-500 text-3xl mb-2">!</span>
              <span className="text-red-500 font-semibold">Failed to load</span>
            </div>
          ) : (
            <>
              <div className="relative inline-block w-16 h-16 mb-2">
                <img src={envelope} alt="envelope" className="w-16 h-16" />
                {meetingRequestCount > 0 && (
                  <span
                    className="absolute -top-2 -right-2 bg-red-500 text-white text-[15px] font-extrabold px-2 py-1 rounded-full shadow-lg border-2 border-white z-10 min-w-[30px] min-h-[30px] flex items-center justify-center text-center select-none animate-pulse-smart"
                    title={`${meetingRequestCount} new meeting request${meetingRequestCount > 1 ? 's' : ''}`}
                  >
                    {meetingRequestCount}
                  </span>
                )}
              </div>
              <p className="text-2xl font-bold mt-2">Meeting Request</p>
              <p className="font-light text-center">
                View and respond to <br />
                incoming requests
              </p>
            </>
          )}
        </div>
        {/* Confirmed Appointments Card */}
        <div
          className="relative bg-gray-100 p-6 rounded-lg shadow-xl w-full min-h-[180px] flex flex-col items-center justify-center transition-transform duration-300 hover:-translate-y-1 cursor-pointer group"
          onClick={() => {
            if (!isLoading && !error) navigate("/host/appointments", { state: { name: "Confirmed Appointments" } });
          }}
        >
          {isLoading ? (
            <CardSkeleton />
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-full">
              <span className="text-red-500 text-3xl mb-2">!</span>
              <span className="text-red-500 font-semibold">Failed to load</span>
            </div>
          ) : (
            <>
              <div className="relative inline-block w-16 h-16 mb-2">
                <img src={check} alt="envelope" className="w-16 h-16" />
                {confirmedAppointmentsCount > 0 && (
                  <span
                    className="absolute -top-2 -right-2 bg-blue-600 text-white text-[15px] font-extrabold px-2 py-1 rounded-full shadow-lg border-2 border-white z-10 min-w-[30px] min-h-[30px] flex items-center justify-center text-center select-none animate-pulse-smart"
                    title={`${confirmedAppointmentsCount} confirmed appointment${confirmedAppointmentsCount > 1 ? 's' : ''}`}
                  >
                    {confirmedAppointmentsCount}
                  </span>
                )}
              </div>
              <p className="text-2xl font-bold mt-2">Confirmed Appointments</p>
              <p className="font-light text-center">
                Review your upcoming<br />meetings
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default AppointmentDetails;
