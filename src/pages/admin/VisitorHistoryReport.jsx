import { useState, useEffect } from 'react';
import { FiSearch, FiDownload, FiCalendar } from 'react-icons/fi';

const VisitorHistoryReport = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from backend
  useEffect(() => {
    const fetchHistoryData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        const response = await fetch(
          `http://localhost:5000/api/visitor-history?searchQuery=${encodeURIComponent(searchQuery)}&selectedDate=${encodeURIComponent(selectedDate)}`,
          {
            method: 'GET',
            credentials: 'include', // Include cookies for CORS
            headers: {
              'Authorization': token ? `Bearer ${token}` : '',
            },
          }
        );
        if (!response.ok) {
          throw new Error('Failed to fetch visitor history data');
        }
        const data = await response.json();
        
        console.log('Raw backend response:', data); // Debug raw response

        // Map backend data to frontend format (as fallback)
        const mappedData = data.map(entry => ({
          id: entry.id || 'Unknown',
          visitor: entry.visitor || 'Unknown',
          host: entry.host || 'Not Assigned',
          purpose: entry.purpose || 'Not Specified',
          checkIn: entry.checkIn ? new Date(entry.checkIn).toISOString() : null,
          checkOut: entry.checkOut ? new Date(entry.checkOut).toISOString() : null,
        }));

        console.log('Fetched and mapped data:', mappedData); // Debug frontend data

        setHistoryData(mappedData);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch visitor history');
        setLoading(false);
        console.error('Fetch error:', err);
      }
    };

    fetchHistoryData();
  }, [searchQuery, selectedDate]);

  // Filter data (minimal, as backend handles most filtering)
  const filteredData = historyData.filter(entry => {
    const matchesSearch = 
      (entry.visitor?.toLowerCase().includes(searchQuery.toLowerCase()) || '') ||
      (entry.id?.toString().includes(searchQuery) || '');
    const matchesDate = !selectedDate || entry.checkIn?.startsWith(selectedDate);
    
    return matchesSearch && matchesDate;
  });

  const formatDate = (datetime) => {
    if (!datetime) return '-';
    const date = new Date(datetime);
    if (isNaN(date)) return '-';
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatTime = (datetime) => {
    if (!datetime) return '-';
    const date = new Date(datetime);
    if (isNaN(date)) return '-';
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const exportToPDF = () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text('Visitor History Report', 10, 10);

    const headers = [['Visitor ID', 'Visitor', 'Host', 'Purpose', 'Check In', 'Check Out']];
    const data = filteredData.map(entry => [
      entry.id,
      entry.visitor,
      entry.host,
      entry.purpose,
      `${formatDate(entry.checkIn)} ${formatTime(entry.checkIn)}`,
      entry.checkOut ? `${formatDate(entry.checkOut)} ${formatTime(entry.checkOut)}` : '-',
    ]);

    doc.autoTable({
      head: headers,
      body: data,
      startY: 20,
      theme: 'striped',
      margin: { top: 20 },
      styles: { fontSize: 10 },
      headStyles: { fillColor: [18, 78, 102] },
    });

    doc.save('visitor_history_report.pdf');
  };

  return (
    <div className="flex-1 overflow-auto p-6 bg-[#F8F9FA] mt-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-[#748D92]" />
            </div>
            <input
              type="text"
              placeholder="Search by visitor name or ID..."
              className="pl-10 pr-4 py-2 w-full border border-[#D3D9D2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#124E66]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiCalendar className="text-[#748D92]" />
            </div>
            <input
              type="date"
              className="pl-10 pr-4 py-2 border border-[#D3D9D2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#124E66]"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              placeholder="Select date"
            />
          </div>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={exportToPDF}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-[#124E66] text-white rounded-lg hover:bg-[#0E3D52] transition-colors"
          >
            <FiDownload />
            <span>Export</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-[#D3D9D2] overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-4 text-center text-[#2E3944]">Loading...</div>
          ) : error ? (
            <div className="p-4 text-center text-red-500">{error}</div>
          ) : filteredData.length === 0 ? (
            <div className="p-4 text-center text-[#2E3944]">No visitor history found</div>
          ) : (
            <table className="min-w-full divide-y divide-[#D3D9D2]">
              <thead className="bg-[#F8F9FA]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#2E3944] uppercase tracking-wider">
                    Visitor ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#2E3944] uppercase tracking-wider">
                    Visitor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#2E3944] uppercase tracking-wider">
                    Host
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#2E3944] uppercase tracking-wider">
                    Purpose
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#2E3944] uppercase tracking-wider">
                    Visit Date & Time
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-[#D3D9D2]">
                {filteredData.map((entry) => (
                  <tr key={entry.id} className="hover:bg-[#F8F9FA]">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#2E3944]">
                      {entry.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#212A31]">
                      {entry.visitor}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#2E3944]">
                      {entry.host || 'Not Assigned'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#2E3944]">
                      {entry.purpose}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#2E3944]">
                      <div>{formatDate(entry.checkIn)}</div>
                      <div className="text-xs text-[#748D92]">
                        {formatTime(entry.checkIn)} - {formatTime(entry.checkOut)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default VisitorHistoryReport;