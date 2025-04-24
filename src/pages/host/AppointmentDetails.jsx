import React from "react";
import envelope from "../../assets/envelope.png";
import check from "../../assets/check.png";
import { useNavigate } from "react-router-dom";

function AppointmentDetails() {
  const navigate = useNavigate();
  return (
    <div className="pt-30 px-4 lg:px-20">
      <div className="flex flex-col lg:flex-row lg:space-x-20 space-y-4 lg:space-y-0">
        <div
          className="bg-gray-100 p-5 rounded-lg shadow-xl  space-x-4 w-90 h-50 m-auto ml-20 mb-10 transition-transform duration-300 hover:-translate-y-1 cursor-pointer"
          onClick={() => {
            navigate("/host/meeting", {
              state: {
                name: "Meeting Requests",
              },
            });
          }}
        >
          <img src={envelope} alt="envelope" className="w-15 h-15" />
          <p className="text-2xl font-bold">Meeting Request</p>
          <p className="font-light">
            View and respond to <br />
            incoming requests
          </p>
        </div>
        <div className="bg-gray-100 p-6 rounded-lg shadow-xl  space-x-4 w-90 h-50 m-auto ml-20 mb-10 transition-transform duration-300 hover:-translate-y-1 cursor-pointer"
        onClick={() => {
            navigate("/host/appointments", {
              state: {
                name: "Confirmed Appointments"
              },
            });
          }}>
          <img src={check} alt="envelope" className="w-12 h-12" />
          <p className="text-2xl font-bold">Confirmed Appointments</p>
          <p className="font-light">
            Review your upcoming
            <br />
            meetings
          </p>
        </div>
      </div>
    </div>
  );
}

export default AppointmentDetails;
