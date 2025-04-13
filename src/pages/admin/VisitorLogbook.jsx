import { useState } from 'react';
import { FiSearch, FiDownload, FiEdit, FiTrash2, FiMail, FiLogOut } from 'react-icons/fi';
import { BsArrowsExpand, BsThreeDotsVertical } from 'react-icons/bs';

const VisitorLogbook = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [openMenuId, setOpenMenuId] = useState(null);

  const toggleMenu = (id) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const logEntries = [
    {
      id: 1,
      visitor: 'John Doe',
      host: 'Sarah Smith',
      purpose: 'Business Meeting',
      checkIn: '2023-06-15 14:00',
      checkOut: '2023-06-15 15:30',
      email: 'john@example.com',
      status: 'Checked out'
    },
    {
      id: 2,
      visitor: 'Jane Smith',
      host: 'Michael Johnson',
      purpose: 'Interview',
      checkIn: '2023-06-15 10:00',
      checkOut: '',
      email: 'jane@example.com',
      status: 'Checked in'
    },
    {
      id: 3,
      visitor: 'Robert Chen',
      host: 'Sarah Smith',
      purpose: 'Client Visit',
      checkIn: '2023-06-16 09:30',
      checkOut: '2023-06-16 11:00',
      email: 'robert@example.com',
      status: 'Checked out'
    },
    {
      id: 4,
      visitor: 'Emily Wilson',
      host: 'David Brown',
      purpose: 'Delivery',
      checkIn: '',
      checkOut: '',
      email: 'emily@example.com',
      status: 'Expected'
    },
  ];

  const filters = ['All', 'Expected', 'Checked in', 'Checked out'];

  const filteredEntries = logEntries.filter(entry => {
    const matchesFilter = activeFilter === 'All' || entry.status === activeFilter;
    const matchesSearch = entry.visitor.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         entry.host.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         entry.purpose.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

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
              placeholder="Search date, visitors or hosts..."
              className="pl-10 pr-4 py-2 w-full border border-[#D3D9D2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#124E66]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <button className="flex items-center justify-center gap-2 px-4 py-2 bg-[#124E66] text-white rounded-lg hover:bg-[#0E3D52] transition-colors">
            <FiDownload />
            <span className="hidden sm:inline">Export</span>
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
                  <div className="flex items-center gap-1">
                    Visitor
                    <button className="text-[#748D92] hover:text-[#124E66]">
                      <BsArrowsExpand size={14} />
                    </button>
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#2E3944] uppercase tracking-wider">
                 Visitor ID
                </th>

                <th className="px-6 py-3 text-left text-xs font-medium text-[#2E3944] uppercase tracking-wider">
                  Host
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#2E3944] uppercase tracking-wider">
                  Purpose
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#2E3944] uppercase tracking-wider">
                  Check In
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#2E3944] uppercase tracking-wider">
                  Check Out
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#2E3944] uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-[#2E3944] uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-[#D3D9D2]">
              {filteredEntries.map((entry) => (
                <tr key={entry.id} className="hover:bg-[#F8F9FA]">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#212A31]">
                    {entry.visitor}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#2E3944]">
                   {entry.id}
                    </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#2E3944]">
                    {entry.host}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#2E3944]">
                    {entry.purpose}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#2E3944]">
                    {formatTime(entry.checkIn)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#2E3944]">
                    {formatTime(entry.checkOut)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#2E3944]">
                    {entry.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
                    <button
                      onClick={() => toggleMenu(entry.id)}
                      className="text-[#748D92] hover:text-[#124E66]"
                    >
                      <BsThreeDotsVertical />
                    </button>

                    {openMenuId === entry.id && (
                      <div className="absolute right-0 z-10 mt-2 w-48 bg-white rounded-md shadow-lg border border-[#D3D9D2]">
                        <div className="py-1">
                          <button className="flex items-center px-4 py-2 text-sm text-[#2E3944] hover:bg-[#F8F9FA] w-full text-left">
                            <FiEdit className="mr-2" /> Edit
                          </button>
                          <button className="flex items-center px-4 py-2 text-sm text-[#2E3944] hover:bg-[#F8F9FA] w-full text-left">
                            <FiLogOut className="mr-2" /> Check Out
                          </button>
                          
                          <button className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-[#F8F9FA] w-full text-left">
                            <FiTrash2 className="mr-2" /> Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-[#F8F9FA] px-6 py-3 flex flex-col md:flex-row justify-between items-center border-t border-[#D3D9D2]">
          <div className="text-sm text-[#748D92] mb-2 md:mb-0">
            Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredEntries.length}</span> of <span className="font-medium">{logEntries.length}</span> entries
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

export default VisitorLogbook;
