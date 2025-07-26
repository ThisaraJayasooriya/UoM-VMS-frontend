import { useState, useEffect, useCallback, useMemo, useContext } from 'react';
import { FiSearch, FiDownload, FiTrash2, FiX } from 'react-icons/fi';
import { BsThreeDotsVertical, BsArrowLeft, BsArrowRight } from 'react-icons/bs';
import { FaSpinner } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useAuth } from '../../App'; // Adjust path to match your project structure

const VisitorLogbook = () => {
  const { authState } = useAuth();
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [openMenuId, setOpenMenuId] = useState(null);
  const [logEntries, setLogEntries] = useState([]);
  const [totalEntries, setTotalEntries] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [startDate, setStartDate] = useState(() => {
    const yesterday = new Date();
    yesterday.setUTCDate(yesterday.getUTCDate() - 1);
    yesterday.setUTCHours(0, 0, 0, 0);
    return yesterday;
  });
  const [endDate, setEndDate] = useState(() => {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    return today;
  });

  // Debug component renders
  useEffect(() => {
    console.log('VisitorLogbook rendered, openMenuId:', openMenuId);
  });

  const toggleMenu = useCallback((id) => {
    console.log('Toggling menu for ID:', id, 'Previous openMenuId:', openMenuId);
    if (openMenuId !== id) {
      setTimeout(() => setOpenMenuId(id), 100); // Debounce to prevent rapid toggling
    } else {
      setOpenMenuId(null);
    }
  }, [openMenuId]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openMenuId && !event.target.closest('.action-menu-container')) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openMenuId]);

  const fetchLogEntries = async () => {
    try {
      setLoading(true);
      const query = new URLSearchParams();
      const normalizedStartDate = new Date(startDate);
      normalizedStartDate.setUTCHours(0, 0, 0, 0);
      const normalizedEndDate = new Date(endDate);
      normalizedEndDate.setUTCHours(23, 59, 59, 999);
      query.append('startDate', normalizedStartDate.toISOString());
      query.append('endDate', normalizedEndDate.toISOString());
      query.append('page', currentPage);
      query.append('limit', itemsPerPage);

      console.log('Fetching logs with query:', query.toString());

      const response = await fetch(`http://localhost:5000/api/logbook?${query.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch visitor log data');
      const { logEntries, total } = await response.json();

      console.log('API response data:', logEntries);
      console.log('Total entries:', total);

      const mappedEntries = logEntries.map(entry => ({
        id: entry.visitorId,
        visitor: entry.name || 'Unknown',
        host: entry.host || 'Unknown',
        purpose: entry.purpose || 'Unknown',
        checkIn: entry.checkInTime ? new Date(entry.checkInTime) : null,
        checkOut: entry.checkOutTime ? new Date(entry.checkOutTime) : null,
        email: entry.email || 'N/A',
        status: entry.status || 'Awaiting Check-In',
        createdAt: entry.createdAt ? new Date(entry.createdAt) : null,
      })).sort((a, b) => {
        const aTime = a.checkIn || a.createdAt || 0;
        const bTime = b.checkIn || b.createdAt || 0;
        return bTime - aTime;
      });

      setLogEntries(mappedEntries);
      setTotalEntries(total);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
      console.error('Fetch error:', err);
    }
  };

  useEffect(() => {
    fetchLogEntries();
  }, [startDate, endDate, currentPage]);

  const filters = ['All', 'Awaiting Check-In', 'Checked-In', 'Checked-Out'];

  const formatDate = (date) => {
    if (!date || !(date instanceof Date) || isNaN(date)) return '-';
    return date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatTime = (date) => {
    if (!date || !(date instanceof Date) || isNaN(date)) return '-';
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const filteredEntries = useMemo(() => {
    return logEntries.filter(entry => {
      const matchesFilter = activeFilter === 'All' || entry.status === activeFilter;
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = searchQuery
        ? (
            (entry.visitor && entry.visitor.toLowerCase().includes(searchLower)) ||
            (entry.host && entry.host.toLowerCase().includes(searchLower)) ||
            (entry.purpose && entry.purpose.toLowerCase().includes(searchLower)) ||
            (entry.email && entry.email.toLowerCase().includes(searchLower)) ||
            (formatDate(entry.checkIn || entry.createdAt).toLowerCase().includes(searchLower))
          )
        : true;
      return matchesFilter && matchesSearch;
    });
  }, [logEntries, activeFilter, searchQuery]);

  const totalPages = Math.ceil(totalEntries / itemsPerPage);

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const sortedEntries = useMemo(() => {
    return [...filteredEntries].sort((a, b) => {
      if (!sortColumn) return 0;
      const aValue = a[sortColumn] instanceof Date ? a[sortColumn].getTime() : a[sortColumn];
      const bValue = b[sortColumn] instanceof Date ? b[sortColumn].getTime() : b[sortColumn];
      return sortDirection === 'asc' ? aValue > bValue ? 1 : -1 : aValue < bValue ? 1 : -1;
    });
  }, [filteredEntries, sortColumn, sortDirection]);

  const handleDelete = async (id) => {
    setDeleteConfirmId(id);
    setOpenMenuId(null);
  };

  const confirmDelete = async () => {
    if (deleteConfirmId) {
      try {
        const token = localStorage.getItem('authToken');
        console.log('Token for DELETE request:', token);

        if (!token || !authState.isAuthenticated) {
          setError('Please log in to delete log entries.');
          setTimeout(() => {
            setError(null);
            window.location.href = '/login';
          }, 2000);
          setDeleteConfirmId(null);
          return;
        }

        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          const exp = payload.exp * 1000;
          if (Date.now() > exp) {
            setError('Your session has expired. Please log in again.');
            localStorage.removeItem('authToken');
            setTimeout(() => {
              setError(null);
              window.location.href = '/login';
            }, 2000);
            setDeleteConfirmId(null);
            return;
          }
        } catch (decodeError) {
          console.error('Token decode error:', decodeError);
          setError('Invalid token. Please log in again.');
          setTimeout(() => {
            setError(null);
            window.location.href = '/login';
          }, 2000);
          setDeleteConfirmId(null);
          return;
        }

        const response = await fetch(`http://localhost:5000/api/logbook/${deleteConfirmId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: 'Server error' }));
          throw new Error(errorData.message || 'Failed to delete entry');
        }

        setLogEntries(logEntries.filter(entry => entry.id !== deleteConfirmId));
        setDeleteConfirmId(null);
        setOpenMenuId(null);
        setMessage('Entry deleted successfully');
        setTimeout(() => setMessage(null), 3000);
      } catch (err) {
        console.error('Delete error:', err);
        setError(err.message);
        setTimeout(() => setError(null), 3000);
        setDeleteConfirmId(null);
      }
    }
  };

  const cancelDelete = () => {
    setDeleteConfirmId(null);
  };

  const exportToPDF = () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
    });

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('Visitor Logbook Export', 14, 15);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 22);
    doc.text(`Date Range: ${formatDate(startDate)} - ${formatDate(endDate)}`, 14, 28);

    const headers = [['Visitor ID', 'Visitor', 'Host', 'Purpose', 'Date', 'Check In', 'Check Out', 'Email', 'Status']];
    const data = filteredEntries.map(entry => [
      entry.id || 'N/A',
      entry.visitor || 'Unknown',
      entry.host || 'Not Assigned',
      entry.purpose || 'Not Specified',
      formatDate(entry.checkIn || entry.createdAt),
      formatTime(entry.checkIn),
      formatTime(entry.checkOut),
      entry.email || 'N/A',
      entry.status || 'Awaiting Check-In',
    ]);

    doc.autoTable({
      head: headers,
      body: data,
      startY: 34,
      theme: 'grid',
      margin: { top: 34, left: 14, right: 14, bottom: 20 },
      styles: {
        font: 'helvetica',
        fontSize: 9,
        textColor: [40, 40, 40],
        lineColor: [200, 200, 200],
        lineWidth: 0.1,
        cellPadding: 2,
        overflow: 'linebreak',
      },
      headStyles: {
        fillColor: [18, 78, 102],
        textColor: [255, 255, 255],
        fontSize: 10,
        fontStyle: 'bold',
        halign: 'center',
      },
      bodyStyles: {
        fillColor: [255, 255, 255],
        textColor: [40, 40, 40],
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
      columnStyles: {
        0: { cellWidth: 25, halign: 'left' },
        1: { cellWidth: 30, halign: 'left' },
        2: { cellWidth: 25, halign: 'left' },
        3: { cellWidth: 35, halign: 'left' },
        4: { cellWidth: 25, halign: 'center' },
        5: { cellWidth: 20, halign: 'center' },
        6: { cellWidth: 20, halign: 'center' },
        7: { cellWidth: 40, halign: 'left' },
        8: { cellWidth: 25, halign: 'center' },
      },
      didDrawPage: (data) => {
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
          doc.setPage(i);
          doc.setFontSize(8);
          doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.width - 20, doc.internal.pageSize.height - 10, { align: 'right' });
        }
      },
    });

    doc.save('visitor_logbook.pdf');
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center">
        <FaSpinner className="animate-spin text-[#124E66] text-2xl" />
      </div>
    );
  }

  if (error) {
    return <div className="p-6 text-red-600">Error: {error}</div>;
  }

  return (
    <div className="flex-1 overflow-auto p-6 bg-[#F8F9FA] mt-10">
      {message && <div className="mb-6 p-4 bg-green-100 text-green-800 rounded-lg">{message}</div>}
      {error && <div className="mb-6 p-4 bg-red-100 text-red-800 rounded-lg">Error: {error}</div>}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-lg font-medium text-[#2E3944] mb-4">Confirm Deletion</h2>
            <p className="text-sm text-[#2E3944] mb-4">Are you sure you want to delete this entry?</p>
            <div className="flex gap-2">
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Yes, Delete
              </button>
              <button
                onClick={cancelDelete}
                className="px-4 py-2 bg-gray-300 text-[#2E3944] rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto items-end">
          <div className="relative w-full sm:w-72">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-[#748D92]" />
            </div>
            <input
              type="text"
              placeholder="Search visitors, hosts, or email..."
              className="pl-10 pr-4 py-2 w-full border border-[#D3D9D2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#124E66]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#748D92] hover:text-[#124E66]"
              >
                <FiX />
              </button>
            )}
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex flex-col">
              <label className="text-sm text-[#2E3944] mb-1">Start Date</label>
              <DatePicker
                selected={startDate}
                onChange={(date) => {
                  const normalizedDate = new Date(date);
                  normalizedDate.setUTCHours(0, 0, 0, 0);
                  setStartDate(normalizedDate);
                }}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                maxDate={endDate}
                className="p-2 border border-[#D3D9D2] rounded-lg w-full sm:w-40"
                dateFormat="MM/dd/yyyy"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm text-[#2E3944] mb-1">End Date</label>
              <DatePicker
                selected={endDate}
                onChange={(date) => {
                  const normalizedDate = new Date(date);
                  normalizedDate.setUTCHours(0, 0, 0, 0);
                  setEndDate(normalizedDate);
                }}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}
                maxDate={new Date()}
                className="p-2 border border-[#D3D9D2] rounded-lg w-full sm:w-40"
                dateFormat="MM/dd/yyyy"
              />
            </div>
          </div>
          <button
            onClick={exportToPDF}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-[#124E66] text-white rounded-lg hover:bg-[#0E3D52] transition-colors w-full sm:w-auto"
          >
            <FiDownload />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
        <div className="text-sm text-[#2E3944] font-medium">
          Date Range: {filteredEntries.length > 0
            ? `${formatDate(startDate)} - ${formatDate(endDate)}`
            : 'No data'}
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
            aria-label={`Filter by ${filter}`}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-[#D3D9D2] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[#D3D9D2]">
            <thead className="bg-[#F8F9FA] sticky top-0">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#2E3944] uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('id')}>
                  Visitor ID {sortColumn === 'id' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#2E3944] uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('visitor')}>
                  Visitor {sortColumn === 'visitor' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#2E3944] uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('host')}>
                  Host {sortColumn === 'host' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#2E3944] uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('purpose')}>
                  Purpose {sortColumn === 'purpose' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#2E3944] uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('checkIn')}>
                  Date {sortColumn === 'checkIn' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#2E3944] uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('checkIn')}>
                  Check In {sortColumn === 'checkIn' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#2E3944] uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('checkOut')}>
                  Check Out {sortColumn === 'checkOut' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#2E3944] uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('email')}>
                  Email {sortColumn === 'email' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-[#2E3944] uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-[#D3D9D2]">
              {sortedEntries.length === 0 ? (
                <tr>
                  <td colSpan="9" className="px-6 py-4 text-center text-sm text-[#2E3944]">
                    No visitor logs found
                  </td>
                </tr>
              ) : (
                sortedEntries.map((entry, index) => (
                  <tr key={`${entry.id}-${index}`} className="hover:bg-[#F8F9FA] even:bg-[#F8F9FA]/50">
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
                      {formatDate(entry.checkIn || entry.createdAt)}
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
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative action-menu-container">
                      <button
                        onClick={() => toggleMenu(`${entry.id}-${index}`)}
                        className="text-[#748D92] hover:text-[#124E66]"
                        aria-label={`Actions for ${entry.visitor}`}
                      >
                        <BsThreeDotsVertical />
                      </button>
                      {openMenuId === `${entry.id}-${index}` && (
                        <div className="absolute right-0 top-10 z-[100] mt-2 w-48 bg-white rounded-md shadow-lg border border-[#D3D9D2]">
                          <div className="py-1">
                            <button
                              onClick={() => handleDelete(entry.id)}
                              className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-[#F8F9FA] w-full text-left"
                            >
                              <FiTrash2 className="mr-2" /> Delete
                            </button>
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="bg-[#F8F9FA] px-6 py-3 flex flex-col md:flex-row justify-between items-center border-t border-[#D3D9D2]">
          <div className="text-sm text-[#748D92] mb-2 md:mb-0">
            Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-medium">{Math.min(currentPage * itemsPerPage, totalEntries)}</span> of <span className="font-medium">{totalEntries}</span> entries
          </div>
          <div className="flex gap-2 items-center">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              className="px-3 py-1 border border-[#D3D9D2] rounded text-sm text-[#2E3944] hover:bg-[#D3D9D2] disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={currentPage === 1}
            >
              <BsArrowLeft />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 border border-[#D3D9D2] rounded text-sm ${currentPage === page ? 'bg-[#124E66] text-white' : 'text-[#2E3944] hover:bg-[#D3D9D2]'}`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              className="px-3 py-1 border border-[#D3D9D2] rounded text-sm text-[#2E3944] hover:bg-[#D3D9D2] disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={currentPage === totalPages}
            >
              <BsArrowRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisitorLogbook;