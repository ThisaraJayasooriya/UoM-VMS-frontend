import { useState } from 'react';
import { FiSearch, FiDownload, FiCalendar } from 'react-icons/fi';

const VisitorHistoryReport = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  const historyData = [
    {
      id: 1,
      visitor: 'John Doe',
      host: 'Sarah Smith',
      purpose: 'Business Meeting',
      checkIn: '2023-06-15 14:00',
      checkOut: '2023-06-15 15:30'
    },
    {
      id: 2,
      visitor: 'Jane Smith',
      host: 'Michael Johnson',
      purpose: 'Interview',
      checkIn: '2023-06-15 10:00',
      checkOut: '2023-06-15 11:45'
    },
    {
      id: 3,
      visitor: 'Robert Chen',
      host: 'Sarah Smith',
      purpose: 'Client Visit',
      checkIn: '2023-06-16 09:30',
      checkOut: '2023-06-16 11:00'
    },
    {
      id: 4,
      visitor: 'Emily Wilson',
      host: 'David Brown',
      purpose: 'Delivery',
      checkIn: '2023-06-17 13:15',
      checkOut: '2023-06-17 13:45'
    },
  ];

  const filteredData = historyData.filter(entry => {
    const matchesSearch = entry.visitor.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         entry.id.toString().includes(searchQuery);
    const matchesDate = !selectedDate || entry.checkIn.startsWith(selectedDate);
    
    return matchesSearch && matchesDate;
  });

  const formatDate = (datetime) => {
    if (!datetime) return '-';
    const date = new Date(datetime);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatTime = (datetime) => {
    if (!datetime) return '-';
    const date = new Date(datetime);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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
          <button className="flex items-center justify-center gap-2 px-4 py-2 bg-[#124E66] text-white rounded-lg hover:bg-[#0E3D52] transition-colors">
            <FiDownload />
            <span>Export</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-[#D3D9D2] overflow-hidden">
        <div className="overflow-x-auto">
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
                    {entry.host}
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
        </div>
      </div>
    </div>
  );
};

export default VisitorHistoryReport;