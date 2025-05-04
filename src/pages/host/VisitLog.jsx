import { useState } from 'react';
import { FiSearch, FiDownload, FiEye } from 'react-icons/fi';

const VisitLog = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1); // Track current page
  const logsPerPage = 5; // Number of logs to show per page

  const dummyLogs = [
    {
      id: 'A001',
      visitor: 'Dr. Emily Carter',
      purpose: 'Project Discussion',
      date: '2024-04-10',
      time: '10:00 AM - 11:00 AM',
      status: 'Completed',
    },
    {
      id: 'A002',
      visitor: 'Prof. Alan Lee',
      purpose: 'Consultation',
      date: '2024-03-22',
      time: '1:00 PM - 2:00 PM',
      status: 'Cancelled',
    },
    {
      id: 'A003',
      visitor: 'Ms. Rachel Green',
      purpose: 'Collaboration Talk',
      date: '2024-03-10',
      time: '2:30 PM - 3:15 PM',
      status: 'Completed',
    },
    {
      id: 'A004',
      visitor: 'Mr. John Smith',
      purpose: 'Technical Interview',
      date: '2024-04-05',
      time: '9:00 AM - 10:00 AM',
      status: 'Completed',
    },
    {
      id: 'A005',
      visitor: 'Ms. Clara Oswald',
      purpose: 'Workshop Facilitation',
      date: '2024-04-01',
      time: '11:00 AM - 12:30 PM',
      status: 'Completed',
    },
    {
      id: 'A006',
      visitor: 'Dr. Alex Turner',
      purpose: 'Lab Visit',
      date: '2024-03-18',
      time: '3:00 PM - 4:00 PM',
      status: 'Cancelled',
    },
    {
      id: 'A007',
      visitor: 'Mr. Nathan Drake',
      purpose: 'Product Demo',
      date: '2024-04-12',
      time: '1:30 PM - 2:30 PM',
      status: 'Completed',
    },
    {
      id: 'A008',
      visitor: 'Ms. Sara Connor',
      purpose: 'System Review',
      date: '2024-03-25',
      time: '10:00 AM - 11:00 AM',
      status: 'Completed',
    },
    {
      id: 'A009',
      visitor: 'Dr. Henry Morgan',
      purpose: 'Research Collaboration',
      date: '2024-04-03',
      time: '2:00 PM - 3:00 PM',
      status: 'Cancelled',
    },
    {
      id: 'A010',
      visitor: 'Mr. Leo Fitz',
      purpose: 'Equipment Inspection',
      date: '2024-04-15',
      time: '9:30 AM - 10:30 AM',
      status: 'Completed',
    },
    {
      id: 'A011',
      visitor: 'Ms. Daisy Johnson',
      purpose: 'Security Audit',
      date: '2024-04-17',
      time: '4:00 PM - 5:00 PM',
      status: 'Completed',
    },
    {
      id: 'A012',
      visitor: 'Prof. Xavier Reed',
      purpose: 'Academic Review',
      date: '2024-03-28',
      time: '12:00 PM - 1:00 PM',
      status: 'Cancelled',
    },
    {
      id: 'A013',
      visitor: 'Ms. Wanda Maximoff',
      purpose: 'Counseling Session',
      date: '2024-04-20',
      time: '3:15 PM - 4:15 PM',
      status: 'Completed',
    },
    {
      id: 'A014',
      visitor: 'Mr. Steve Rogers',
      purpose: 'Alumni Meeting',
      date: '2024-04-22',
      time: '1:00 PM - 2:00 PM',
      status: 'Completed',
    },
    {
      id: 'A015',
      visitor: 'Ms. Natasha Romanoff',
      purpose: 'Safety Briefing',
      date: '2024-03-15',
      time: '11:00 AM - 12:00 PM',
      status: 'Cancelled',
    },
    {
      id: 'A016',
      visitor: 'Dr. Bruce Banner',
      purpose: 'Energy Research',
      date: '2024-03-19',
      time: '10:30 AM - 11:30 AM',
      status: 'Completed',
    },
    {
      id: 'A017',
      visitor: 'Mr. Tony Stark',
      purpose: 'Tech Consultation',
      date: '2024-04-25',
      time: '9:00 AM - 10:00 AM',
      status: 'Completed',
    },
    {
      id: 'A018',
      visitor: 'Ms. Carol Danvers',
      purpose: 'Outreach Planning',
      date: '2024-04-08',
      time: '2:00 PM - 3:00 PM',
      status: 'Completed',
    },
    {
      id: 'A019',
      visitor: 'Mr. Peter Parker',
      purpose: 'Student Mentoring',
      date: '2024-04-11',
      time: '12:00 PM - 1:00 PM',
      status: 'Cancelled',
    },
    {
      id: 'A020',
      visitor: 'Ms. Monica Rambeau',
      purpose: 'IT Support Meeting',
      date: '2024-04-27',
      time: '3:30 PM - 4:30 PM',
      status: 'Completed',
    },
  ];
  

  const filters = ['All', 'Completed', 'Cancelled'];

  const filteredLogs = dummyLogs.filter(log => {
    const matchesFilter = activeFilter === 'All' || log.status === activeFilter;
    const matchesSearch =
      log.visitor?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.purpose?.toLowerCase().includes(searchQuery.toLowerCase());

    const logDate = new Date(log.date);
    const from = startDate ? new Date(startDate) : null;
    const to = endDate ? new Date(endDate) : null;

    const matchesDate =
      (!from || logDate >= from) &&
      (!to || logDate <= to);

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
              placeholder="Search visitor or purpose..."
              className="pl-10 pr-4 py-2 w-full border border-[#D3D9D2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#124E66]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

         
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

      <div className="flex flex-wrap items-center gap-4 mb-6">
        <label className="text-sm text-[#2E3944]">
          From:{' '}
          <input
            type="date"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            className="border border-[#D3D9D2] rounded-lg px-2 py-1 ml-2"
          />
        </label>
        <label className="text-sm text-[#2E3944]">
          To:{' '}
          <input
            type="date"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
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
              {currentLogs.map(log => (
                <tr key={log.id} className="hover:bg-[#F8F9FA]">
                  <td className="px-6 py-4 text-sm text-[#2E3944]">{log.id}</td>
                  <td className="px-6 py-4 text-sm text-[#2E3944]">{log.visitor}</td>
                  <td className="px-6 py-4 text-sm text-[#2E3944]">{log.purpose}</td>
                  <td className="px-6 py-4 text-sm text-[#2E3944]">{log.date}</td>
                  <td className="px-6 py-4 text-sm text-[#2E3944]">{log.time}</td>
                  <td className="px-6 py-4 text-sm text-[#2E3944]">{log.status}</td>
                  
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-[#F8F9FA] px-6 py-3 flex flex-col md:flex-row justify-between items-center border-t border-[#D3D9D2]">
          <div className="text-sm text-[#748D92] mb-2 md:mb-0">
            Showing <span className="font-medium">{indexOfFirstLog + 1}</span> to{' '}
            <span className="font-medium">{indexOfLastLog}</span> of{' '}
            <span className="font-medium">{filteredLogs.length}</span> entries
          </div>
          <div className="flex gap-2">
            <button
              onClick={prevPage}
              className="px-3 py-1 border border-[#D3D9D2] rounded text-sm text-[#2E3944] hover:bg-[#D3D9D2]"
            >
              Previous
            </button>
            <button
              onClick={nextPage}
              className="px-3 py-1 border border-[#D3D9D2] rounded text-sm text-[#2E3944] hover:bg-[#D3D9D2]"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisitLog;
