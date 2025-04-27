import { useState } from 'react';
import { FiSearch, FiDownload, FiCalendar, FiFilter } from 'react-icons/fi';
import { BsArrowsExpand } from 'react-icons/bs';

const VisitorHistoryReport = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState({
    start: '',
    end: ''
  });
  const [activeFilter, setActiveFilter] = useState('All');

  const historyData = [
    {
      id: 1,
      visitor: 'John Doe',
      host: 'Sarah Smith',
      purpose: 'Business Meeting',
      checkIn: '2023-06-15 14:00',
      checkOut: '2023-06-15 15:30',
      duration: '1h 30m',
      department: 'Computer Science',
      status: 'Completed'
    },
    {
      id: 2,
      visitor: 'Jane Smith',
      host: 'Michael Johnson',
      purpose: 'Interview',
      checkIn: '2023-06-15 10:00',
      checkOut: '2023-06-15 11:45',
      duration: '1h 45m',
      department: 'Engineering',
      status: 'Completed'
    },
    {
      id: 3,
      visitor: 'Robert Chen',
      host: 'Sarah Smith',
      purpose: 'Client Visit',
      checkIn: '2023-06-16 09:30',
      checkOut: '2023-06-16 11:00',
      duration: '1h 30m',
      department: 'Administration',
      status: 'Completed'
    },
    {
      id: 4,
      visitor: 'Emily Wilson',
      host: 'David Brown',
      purpose: 'Delivery',
      checkIn: '2023-06-17 13:15',
      checkOut: '2023-06-17 13:45',
      duration: '30m',
      department: 'Facilities',
      status: 'Completed'
    },
  ];

  const filters = ['All', 'Completed', 'Early Departure', 'No Show'];

  const filteredData = historyData.filter(entry => {
    const matchesFilter = activeFilter === 'All' || entry.status === activeFilter;
    const matchesSearch = entry.visitor.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         entry.host.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         entry.purpose.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDate = (!dateRange.start || entry.checkIn >= dateRange.start) && 
                       (!dateRange.end || entry.checkIn <= dateRange.end);
    
    return matchesFilter && matchesSearch && matchesDate;
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
      <h1 className="text-2xl font-bold text-[#212A31] mb-6">Visitor History Report</h1>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-[#748D92]" />
            </div>
            <input
              type="text"
              placeholder="Search visitors, hosts or purpose..."
              className="pl-10 pr-4 py-2 w-full border border-[#D3D9D2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#124E66]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiCalendar className="text-[#748D92]" />
              </div>
              <input
                type="date"
                className="pl-10 pr-4 py-2 border border-[#D3D9D2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#124E66]"
                value={dateRange.start}
                onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                placeholder="Start date"
              />
            </div>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiCalendar className="text-[#748D92]" />
              </div>
              <input
                type="date"
                className="pl-10 pr-4 py-2 border border-[#D3D9D2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#124E66]"
                value={dateRange.end}
                onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                placeholder="End date"
              />
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-[#D3D9D2] text-[#2E3944] rounded-lg hover:bg-[#F8F9FA] transition-colors">
            <FiFilter />
            <span>Filter</span>
          </button>
          
          <button className="flex items-center justify-center gap-2 px-4 py-2 bg-[#124E66] text-white rounded-lg hover:bg-[#0E3D52] transition-colors">
            <FiDownload />
            <span>Export</span>
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {filters.map(filter => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeFilter === filter
                ? 'bg-[#124E66] text-white'
                : 'bg-white text-[#2E3944] hover:bg-[#D3D9D2]'
            }`}
          >
            {filter}
          </button>
        ))}
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
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#2E3944] uppercase tracking-wider">
                  Purpose
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#2E3944] uppercase tracking-wider">
                  Visit Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#2E3944] uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#2E3944] uppercase tracking-wider">
                  Status
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
                    {entry.department}
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#2E3944]">
                    {entry.duration}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      entry.status === 'Completed' 
                        ? 'bg-green-100 text-green-800' 
                        : entry.status === 'Early Departure'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                    }`}>
                      {entry.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-[#F8F9FA] px-6 py-3 flex flex-col md:flex-row justify-between items-center border-t border-[#D3D9D2]">
          <div className="text-sm text-[#748D92] mb-2 md:mb-0">
            Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredData.length}</span> of <span className="font-medium">{historyData.length}</span> entries
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-[#D3D9D2] rounded text-sm text-[#2E3944] hover:bg-[#D3D9D2]">
              Previous
            </button>
            <button className="px-3 py-1 border border-[#D3D9D2] rounded text-sm text-[#2E3944] hover:bg-[#D3D9D2]">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisitorHistoryReport;