import { useState, useEffect } from "react";
import { FiSearch, FiDownload, FiEye, FiFlag } from "react-icons/fi";
import { HiOutlineDocumentText, HiOutlineClipboardList } from "react-icons/hi";
import { fetchAllAppointments } from "../../services/appointmentService";
import { reportBadVisitor } from "../../services/reportVisitorService";
// Dummy report API (replace with real API call)

function formatTo12Hour(time24) {
  const [hourStr, minuteStr] = time24.split(":");
  const hour = parseInt(hourStr, 10);
  const minute = parseInt(minuteStr, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${hour12}:${minute.toString().padStart(2, "0")} ${ampm}`;
}

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

const VisitLog = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const logsPerPage = 5;
  const [appointments, setAppointments] = useState([]);
  const [hostId, setHostId] = useState("");
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // Report Visitor Modal State
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportCategory, setReportCategory] = useState("");
  const [isReporting, setIsReporting] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(false);
  const [reportAppointmentId, setReportAppointmentId] = useState("");
  const [error, setError] = useState("");

  // Open report modal
  const handleOpenReport = (appointmentId) => {
    setReportReason("");
    setReportCategory("");
    setReportSuccess(false);
    setError("");
    setReportAppointmentId(appointmentId);
    setIsReportModalOpen(true);
  };

  // Submit report
  const handleSubmitReport = async () => {
    if (!reportReason || !reportCategory) {
      setError("Please provide both a reason and a category.");
      return;
    }
    setIsReporting(true);
    setError("");
    try {
      const badVisitorReport = {
        appointmentId: reportAppointmentId,
        reason: reportReason,
        category: reportCategory,
        hostId: hostId,
      };
      console.log("bad visitor report", badVisitorReport);

      await reportBadVisitor(badVisitorReport);
      setReportSuccess(true);
      setTimeout(() => {
        setIsReportModalOpen(false);
      }, 1200);
      console.log("Report submitted successfully");
    } catch (e) {
      setError("Failed to submit report. Please try again.");
    } finally {
      setIsReporting(false);
    }
  };

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
        await new Promise((resolve) => setTimeout(resolve, 800));

        const data = await fetchAllAppointments(hostId);
        const formatted = data.map((a) => ({
          id: a._id,
          vId: a.visitorId?.visitorId || "N/A",
          aId: a.appointmentId,
          purpose: a.reason,
          visitorName: (a.firstname || "Unknown") + " " + (a.lastname || ""),
          date: a.response ? formatDate(a.response.date) : "N/A",
          time: a.response
            ? `${formatTo12Hour(a.response.startTime)} - ${formatTo12Hour(
                a.response.endTime
              )}`
            : "N/A",
          status: a.status,
        }));
        setAppointments(formatted);
      } catch (error) {
        console.error("Failed to fetch visit logs:", error);
      } finally {
        setIsInitialLoading(false);
      }
    };

    if (hostId) loadRequests();
  }, [hostId]);

  const filters = ["All", "Completed", "Incompleted"];
  console.log(appointments.map((a) => a.status));

  const filteredLogs = appointments.filter((log) => {
    const matchesFilter =
      activeFilter === "All" ||
      log.status?.toLowerCase() === activeFilter.toLowerCase();
    const matchesSearch =
      log.visitorName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.purpose?.toLowerCase().includes(searchQuery.toLowerCase());

    const logDate = new Date(log.date);
    const from = startDate ? new Date(startDate) : null;
    const to = endDate ? new Date(endDate) : null;

    const matchesDate = (!from || logDate >= from) && (!to || logDate <= to);

    return matchesFilter && matchesSearch && matchesDate;
  });

  // Get the logs for the current page
  const indexOfLastLog = currentPage * logsPerPage;
  const indexOfFirstLog = indexOfLastLog - logsPerPage;
  const currentLogs = filteredLogs.slice(indexOfFirstLog, indexOfLastLog);

  // Change page
  const nextPage = () => {
    if (currentPage < Math.ceil(filteredLogs.length / logsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Skeleton Loading Component
  const SkeletonLoader = () => (
    <div className="bg-white rounded-xl shadow-sm border border-[#D3D9D2] overflow-hidden animate-pulse">
      {/* Header Skeleton */}
      <div className="bg-[#F8F9FA] overflow-x-auto">
        <table className="min-w-full divide-y divide-[#D3D9D2]">
          <thead>
            <tr>
              {[...Array(7)].map((_, index) => (
                <th key={index} className="px-6 py-3">
                  <div className="h-4 bg-gray-300 rounded animate-pulse"></div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-[#D3D9D2]">
            {[...Array(5)].map((_, rowIndex) => (
              <tr key={rowIndex}>
                {[...Array(7)].map((_, colIndex) => (
                  <td key={colIndex} className="px-6 py-4">
                    <div className="h-4 bg-gray-300 rounded animate-pulse"></div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer Skeleton */}
      <div className="bg-[#F8F9FA] px-6 py-3 flex justify-between items-center border-t border-[#D3D9D2]">
        <div className="h-4 w-48 bg-gray-300 rounded animate-pulse"></div>
        <div className="flex gap-2">
          <div className="h-8 w-20 bg-gray-300 rounded animate-pulse"></div>
          <div className="h-8 w-16 bg-gray-300 rounded animate-pulse"></div>
        </div>
      </div>
    </div>
  );

  // Inject CSS keyframes for animations
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      
      @keyframes slideUp {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
      
      @keyframes slideIn {
        from { opacity: 0; transform: translateX(20px); }
        to { opacity: 1; transform: translateX(0); }
      }
      
      @keyframes bounceGentle {
        0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
        40% { transform: translateY(-4px); }
        60% { transform: translateY(-2px); }
      }
      
      @keyframes pulseSlow {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.8; }
      }
      
      .animate-fade-in { animation: fadeIn 0.6s ease-out; }
      .animate-slide-up { animation: slideUp 0.5s ease-out; }
      .animate-slide-in { animation: slideIn 0.5s ease-out; }
      .animate-bounce-gentle { animation: bounceGentle 2s infinite; }
      .animate-pulse-slow { animation: pulseSlow 3s ease-in-out infinite; }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <div className="relative">
      <div className="pt-20 px-4 lg:px-20">
        {/* Show skeleton loader while initial loading */}
        {isInitialLoading ? (
          <div className="animate-slide-up">
            <SkeletonLoader />
          </div>
        ) : (
          <div className="animate-slide-up">
            {/* Filters and Search */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiSearch className="text-[#748D92]" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search visitor or purpose..."
                    className="pl-10 pr-4 py-2 w-full border border-[#D3D9D2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#124E66]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {filters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    activeFilter === filter
                      ? "bg-[#124E66] text-white"
                      : "bg-white text-[#2E3944] hover:bg-[#D3D9D2]"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-4 mb-6">
              <label className="text-sm text-[#2E3944]">
                From:{" "}
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="border border-[#D3D9D2] rounded-lg px-2 py-1 ml-2"
                />
              </label>
              <label className="text-sm text-[#2E3944]">
                To:{" "}
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="border border-[#D3D9D2] rounded-lg px-2 py-1 ml-2"
                />
              </label>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-[#D3D9D2] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-[#D3D9D2]">
                  <thead className="bg-[#F8F9FA]">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-bold text-[#2E3944] uppercase tracking-wider">
                        Visitor ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-[#2E3944] uppercase tracking-wider">
                        Appointment ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-[#2E3944] uppercase tracking-wider">
                        Visitor
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-[#2E3944] uppercase tracking-wider">
                        Purpose
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-[#2E3944] uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-[#2E3944] uppercase tracking-wider">
                        Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-[#2E3944] uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-[#D3D9D2]">
                    {currentLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-[#F8F9FA]">
                        <td className="px-6 py-4 text-sm text-[#2E3944]">
                          {log.vId}
                        </td>
                        <td className="px-6 py-4 text-sm text-[#2E3944] flex items-center gap-2">
                          {log.aId}
                          <button
                            title="Report Visitor"
                            onClick={() => handleOpenReport(log.aId)}
                            className="ml-2 p-1 rounded hover:bg-yellow-100 border border-yellow-200 text-yellow-700 transition-colors"
                          >
                            <FiFlag className="w-4 h-4" />
                          </button>
                        </td>
                        <td className="px-6 py-4 text-sm text-[#2E3944]">
                          {log.visitorName}
                        </td>
                        <td className="px-6 py-4 text-sm text-[#2E3944]">
                          {log.purpose}
                        </td>
                        <td className="px-6 py-4 text-sm text-[#2E3944]">
                          {log.date}
                        </td>
                        <td className="px-6 py-4 text-sm text-[#2E3944]">
                          {log.time}
                        </td>
                        <td className="px-6 py-4 text-sm text-[#2E3944]">
                          {log.status}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="bg-[#F8F9FA] px-6 py-3 flex flex-col md:flex-row justify-between items-center border-t border-[#D3D9D2]">
                <div className="text-sm text-[#748D92] mb-2 md:mb-0">
                  Showing{" "}
                  <span className="font-medium">{indexOfFirstLog + 1}</span> to{" "}
                  <span className="font-medium">
                    {Math.min(indexOfLastLog, filteredLogs.length)}
                  </span>{" "}
                  of <span className="font-medium">{filteredLogs.length}</span>{" "}
                  entries
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={prevPage}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border border-[#D3D9D2] rounded text-sm text-[#2E3944] hover:bg-[#D3D9D2] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={nextPage}
                    disabled={
                      currentPage >=
                      Math.ceil(filteredLogs.length / logsPerPage)
                    }
                    className="px-3 py-1 border border-[#D3D9D2] rounded text-sm text-[#2E3944] hover:bg-[#D3D9D2] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Report Visitor Modal */}
      {isReportModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md z-10 overflow-hidden border border-[#D3D9D2]">
            <div className="bg-gradient-to-r from-[#124E66] to-[#2E3944] text-white px-5 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Report Visitor</h3>
                <p className="text-[#748D92] text-sm mt-1">
                  Appointment ID: {reportAppointmentId}
                </p>
              </div>
              <button
                onClick={() => setIsReportModalOpen(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                disabled={isReporting}
              >
                <span className="text-white text-xl">×</span>
              </button>
            </div>
            <div className="p-6 space-y-5">
              {reportSuccess ? (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 font-semibold text-center">
                  Report submitted successfully!
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-[#2E3944] mb-2">
                      Category *
                    </label>
                    <select
                      className="w-full p-3 border border-[#D3D9D2] rounded-lg focus:ring-2 focus:ring-[#124E66] focus:border-[#124E66] transition-all disabled:bg-gray-100"
                      value={reportCategory}
                      onChange={(e) => setReportCategory(e.target.value)}
                      disabled={isReporting}
                    >
                      <option value="">Select category</option>
                      <option value="Disruptive Behavior">
                        Disruptive Behavior
                      </option>
                      <option value="Policy Violation">Policy Violation</option>
                      <option value="Security Concern">Security Concern</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#2E3944] mb-2">
                      Reason *
                    </label>
                    <textarea
                      className="w-full p-3 border border-[#D3D9D2] rounded-lg focus:ring-2 focus:ring-[#124E66] focus:border-[#124E66] transition-all disabled:bg-gray-100"
                      rows={3}
                      value={reportReason}
                      onChange={(e) => setReportReason(e.target.value)}
                      disabled={isReporting}
                      placeholder="Describe the issue with the visitor..."
                    />
                  </div>
                  {error && (
                    <div className="p-2 bg-red-50 border border-red-200 rounded text-red-700 text-sm font-medium">
                      {error}
                    </div>
                  )}
                </>
              )}
            </div>
            <div className="bg-[#F8F9FA] px-6 py-4 flex justify-end gap-3 border-t border-[#D3D9D2]">
              {!reportSuccess && (
                <button
                  onClick={handleSubmitReport}
                  disabled={isReporting}
                  className="px-4 py-2 text-sm bg-[#124E66] text-white rounded-lg hover:bg-[#2E3944] transition-colors font-medium shadow-sm disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isReporting ? (
                    <>
                      <svg
                        className="animate-spin w-4 h-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <FiFlag className="w-3 h-3" />
                      Submit Report
                    </>
                  )}
                </button>
              )}
              <button
                onClick={() => setIsReportModalOpen(false)}
                disabled={isReporting}
                className="px-4 py-2 text-sm bg-white border border-[#D3D9D2] rounded-lg hover:bg-[#F8F9FA] transition-colors font-medium text-[#2E3944]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VisitLog;
