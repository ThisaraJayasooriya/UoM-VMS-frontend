import { useState, useEffect, useCallback, useMemo } from 'react';
import { FiSearch, FiDownload, FiEdit, FiTrash2, FiLogOut, FiX } from 'react-icons/fi';
import { BsArrowsExpand, BsThreeDotsVertical, BsArrowLeft, BsArrowRight } from 'react-icons/bs';
import { FaSpinner } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const VisitorLogbook = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [openMenuId, setOpenMenuId] = useState(null);
  const [logEntries, setLogEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [editEntry, setEditEntry] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [startDate, setStartDate] = useState(() => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday;
  });
  const [endDate, setEndDate] = useState(new Date());

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
      if (startDate) query.append('startDate', startDate.toISOString());
      if (endDate) query.append('endDate', endDate.toISOString());
      const response = await fetch(`http://localhost:5000/api/logbook?${query.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch visitor log data');
      const data = await response.json();

      // Check for duplicate IDs and log date fields
      const ids = data.map(entry => entry.visitorId);
      const uniqueIds = new Set(ids);
      if (ids.length !== uniqueIds.size) {
        console.warn('Duplicate visitor IDs detected:', ids);
      }
      console.log('API response data:', data); // Debug API response

      // Remove duplicates and validate dates
      const mappedEntries = [...new Map(data.map(entry => [entry.visitorId, {
        id: entry.visitorId,
        visitor: entry.name || 'Unknown',
        host: entry.host || 'Unknown',
        purpose: entry.purpose || 'Unknown',
        checkIn: entry.checkInTime ? new Date(entry.checkInTime) : null,
        checkOut: entry.checkOutTime ? new Date(entry.checkOutTime) : null,
        email: entry.email || 'N/A',
        status: entry.status || 'Awaiting Check-In',
        createdAt: entry.createdAt ? new Date(entry.createdAt) : null,
      }])).values()].sort((a, b) => {
        const aTime = a.checkIn || a.createdAt || 0;
        const bTime = b.checkIn || b.createdAt || 0;
        return bTime - aTime;
      });
      setLogEntries(mappedEntries);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
      console.error('Fetch error:', err);
    }
  };

  useEffect(() => {
    fetchLogEntries();
  }, [startDate, endDate]);

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

  const filteredEntries = logEntries.filter(entry => {
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

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEntries = filteredEntries.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredEntries.length / itemsPerPage);

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const sortedEntries = useMemo(() => {
    return [...currentEntries].sort((a, b) => {
      if (!sortColumn) return 0;
      const aValue = a[sortColumn] instanceof Date ? a[sortColumn].getTime() : a[sortColumn];
      const bValue = b[sortColumn] instanceof Date ? b[sortColumn].getTime() : b[sortColumn];
      return sortDirection === 'asc' ? aValue > bValue ? 1 : -1 : aValue < bValue ? 1 : -1;
    });
  }, [currentEntries, sortColumn, sortDirection]);

  const handleDelete = async (id) => {
    setDeleteConfirmId(id);
  };

  const confirmDelete = async () => {
    if (deleteConfirmId) {
      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/api/logbook/${deleteConfirmId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : '',
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
        setError(`Delete failed: ${err.message}`);
        setTimeout(() => setError(null), 3000);
        console.error('Delete error:', err);
        setDeleteConfirmId(null);
      }
    }
  };

  const cancelDelete = () => {
    setDeleteConfirmId(null);
  };

  const handleCheckOut = async (id) => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/logbook/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify({
          checkOutTime: new Date().toISOString(),
          status: 'Checked-Out',
        }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Server error' }));
        throw new Error(errorData.message || 'Failed to check out');
      }
      const updatedEntry = await response.json();
      console.log('Check out response:', updatedEntry);
      setLogEntries(logEntries.map(entry => entry.id === id ? { ...entry, ...updatedEntry } : entry));
      setOpenMenuId(null);
      setMessage('Checked out successfully');
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      setError(`Check out failed: ${err.message}`);
      setTimeout(() => setError(null), 3000);
      console.error('Check out error:', err);
    }
  };

  const handleEdit = (id) => {
    const entryToEdit = logEntries.find(entry => entry.id === id);
    setEditEntry({ ...entryToEdit, purpose: entryToEdit.purpose });
    setOpenMenuId(null);
    console.log('Editing entry:', entryToEdit);
  };

  const handleSaveEdit = async () => {
    if (editEntry) {
      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/api/logbook/${editEntry.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : '',
          },
          body: JSON.stringify({
            purpose: editEntry.purpose,
          }),
        });
        if (!response.ok) {
          const errorData = await response.text().then(text => {
            try { return JSON.parse(text); } catch { return { message: text || 'Server error' }; }
          }).catch(() => ({ message: 'Server error' }));
          throw new Error(errorData.message || 'Failed to update entry');
        }
        const updatedEntry = await response.json();
        console.log('Edit response:', updatedEntry);
        setLogEntries(logEntries.map(entry => entry.id === editEntry.id ? { 
          ...entry, 
          purpose: updatedEntry.purpose || entry.purpose 
        } : entry));
        setEditEntry(null);
        setMessage('Entry updated successfully');
        setTimeout(() => setMessage(null), 3000);
      } catch (err) {
        setError(`Edit failed: ${err.message}`);
        setTimeout(() => setError(null), 3000);
        console.error('Edit error:', err);
      }
    }
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
      {editEntry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-lg font-medium text-[#2E3944] mb-4">Edit Entry</h2>
            <div className="mb-4">
              <label className="block text-sm text-[#2E3944] mb-1">Purpose</label>
              <input
                type="text"
                value={editEntry.purpose || ''}
                onChange={(e) => setEditEntry({ ...editEntry, purpose: e.target.value })}
                className="w-full p-2 border border-[#D3D9D2] rounded-lg"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 bg-[#124E66] text-white rounded-lg hover:bg-[#0E3D52]"
              >
                Save
              </button>
              <button
                onClick={() => setEditEntry(null)}
                className="px-4 py-2 bg-gray-300 text-[#2E3944] rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
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
              placeholder="Search date, visitors, hosts, or email..."
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
                onChange={(date) => setStartDate(date)}
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
                onChange={(date) => setEndDate(date)}
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
                  <div className="flex items-center gap-1">
                    Visitor
                    <BsArrowsExpand size={14} />
                  </div> {sortColumn === 'visitor' && (sortDirection === 'asc' ? '↑' : '↓')}
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
                sortedEntries.map((entry) => (
                  <tr key={entry.id} className="hover:bg-[#F8F9FA] even:bg-[#F8F9FA]/50">
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
                        onClick={() => toggleMenu(entry.id)}
                        className="text-[#748D92] hover:text-[#124E66]"
                        aria-label={`Actions for ${entry.visitor}`}
                      >
                        <BsThreeDotsVertical />
                      </button>
                      {openMenuId === entry.id && (
                        <div className="absolute right-0 top-10 z-[100] mt-2 w-48 bg-white rounded-md shadow-lg border border-[#D3D9D2]">
                          <div className="py-1">
                            <button
                              onClick={() => handleEdit(entry.id)}
                              className="flex items-center px-4 py-2 text-sm text-[#2E3944] hover:bg-[#F8F9FA] w-full text-left"
                            >
                              <FiEdit className="mr-2" /> Edit
                            </button>
                            {entry.status !== 'Checked-Out' && (
                              <button
                                onClick={() => handleCheckOut(entry.id)}
                                className="flex items-center px-4 py-2 text-sm text-[#2E3944] hover:bg-[#F8F9FA] w-full text-left"
                              >
                                <FiLogOut className="mr-2" /> Check Out
                              </button>
                            )}
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
            Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to <span className="font-medium">{Math.min(indexOfLastItem, filteredEntries.length)}</span> of <span className="font-medium">{filteredEntries.length}</span> entries
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