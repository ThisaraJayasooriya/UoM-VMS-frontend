import { useState, useEffect } from 'react';
import { FiSearch, FiDownload, FiTrash2, FiEye, FiX } from 'react-icons/fi';
import { BsThreeDotsVertical, BsArrowLeft, BsArrowRight } from 'react-icons/bs';
import { FaStar, FaRegStar, FaSpinner } from 'react-icons/fa';

const VisitorFeedbackReview = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [openMenuId, setOpenMenuId] = useState(null);
  const [feedbackEntries, setFeedbackEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [showDetails, setShowDetails] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  // Move formatDate up to avoid reference error
  const formatDate = (datetime) => {
    if (!datetime) return '-';
    const date = new Date(datetime);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const toggleMenu = (id) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const fetchFeedback = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/feedback', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch feedback: ${response.statusText}`);
      }

      const data = await response.json();
      setFeedbackEntries(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/feedback/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete feedback');
      }

      setFeedbackEntries(feedbackEntries.filter(entry => entry._id !== id));
      setOpenMenuId(null);
      setShowDeleteConfirm(null);
      setMessage('Feedback deleted successfully');
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleViewDetails = (entry) => {
    setShowDetails(entry);
  };

  const filters = ['All', '5 Stars', '4 Stars', '3 Stars', '2 Stars', '1 Star'];

  const filteredEntries = feedbackEntries.filter(entry => {
    const matchesFilter = activeFilter === 'All' || entry.rating === parseInt(activeFilter.split(' ')[0]);
    const matchesSearch = 
      entry.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      entry.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.experience?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      formatDate(entry.createdAt).toLowerCase().includes(searchQuery.toLowerCase());
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

  const sortedEntries = [...currentEntries].sort((a, b) => {
    if (!sortColumn) return 0;
    const aValue = a[sortColumn] instanceof Date ? a[sortColumn].getTime() : a[sortColumn];
    const bValue = b[sortColumn] instanceof Date ? b[sortColumn].getTime() : b[sortColumn];
    return sortDirection === 'asc' ? (aValue > bValue ? 1 : -1) : (aValue < bValue ? 1 : -1);
  });

  const renderStars = (rating) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          star <= rating ? (
            <FaStar key={star} className="text-[#124E66] text-lg" />
          ) : (
            <FaRegStar key={star} className="text-[#748D92] text-lg" />
          )
        ))}
      </div>
    );
  };

  const averageRating = feedbackEntries.length > 0 
    ? (feedbackEntries.reduce((sum, entry) => sum + entry.rating, 0) / feedbackEntries.length).toFixed(1) 
    : 0;

  const exportToPDF = () => {
    console.log('Export function triggered');
    const { jsPDF } = window.jspdf;
    if (!jsPDF) {
      console.error('jsPDF is not defined. Check script loading in index.html');
      return;
    }
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text('Visitor Feedback Review Export', 10, 10);
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 10, 20);

    if (sortedEntries.length === 0) {
      doc.text('No feedback data available to export.', 10, 30);
    } else {
      const tableData = sortedEntries.map(entry => [
        entry._id.slice(-6),
        entry.name,
        entry.email,
        `${entry.rating} stars`,
        entry.experience,
        formatDate(entry.createdAt)
      ]);
      doc.autoTable({
        head: [['ID', 'Name', 'Email', 'Rating', 'Experience', 'Submitted At']],
        body: tableData,
        startY: 30,
        theme: 'striped',
        margin: { top: 30, left: 10, right: 10 },
        styles: { fontSize: 10 },
        headStyles: { fillColor: [18, 78, 102] }
      });
    }

    doc.save('visitor_feedback_review.pdf');
  };

  if (loading) {
    return (
      <div className="flex-1 overflow-auto p-6 bg-[#F8F9FA] mt-10 flex items-center justify-center">
        <FaSpinner className="animate-spin text-[#124E66] text-2xl" />
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto p-6 bg-[#F8F9FA] mt-10">
      {/* Success/Error Message */}
      {message && <div className="mb-6 p-4 bg-green-100 text-green-800 rounded-lg">{message}</div>}
      {error && <div className="mb-6 p-4 bg-red-100 text-red-800 rounded-lg">Error: {error}</div>}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-lg font-medium text-[#2E3944] mb-4">Confirm Deletion</h2>
            <p className="text-sm text-[#2E3944] mb-4">Are you sure you want to delete this feedback from {showDeleteConfirm.name}?</p>
            <div className="flex gap-4">
              <button
                onClick={() => handleDelete(showDeleteConfirm._id)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 bg-[#124E66] text-white rounded-lg hover:bg-[#0E3D52] transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Feedback Summary */}
      <div className="mb-6 p-4 bg-white rounded-lg shadowed border border-[#D3D9D2]">
        <p className="text-sm text-[#2E3944]">
          Total Feedback: <span className="font-medium">{feedbackEntries.length}</span> | 
          Average Rating: <span className="font-medium">{averageRating} / 5</span>
        </p>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-[#748D92]" />
            </div>
            <input
              type="text"
              placeholder="Search name, email, experience, or date..."
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
          <button
            onClick={exportToPDF}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-[#124E66] text-white rounded-lg hover:bg-[#0E3D52] transition-colors"
          >
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
                  onClick={() => handleSort('_id')}>
                  Feedback ID {sortColumn === '_id' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#2E3944] uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('name')}>
                  Name {sortColumn === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#2E3944] uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('email')}>
                  Email {sortColumn === 'email' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#2E3944] uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('rating')}>
                  Rating {sortColumn === 'rating' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#2E3944] uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('experience')}>
                  Experience {sortColumn === 'experience' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#2E3944] uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('createdAt')}>
                  Submitted At {sortColumn === 'createdAt' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-[#2E3944] uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-[#D3D9D2]">
              {sortedEntries.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-sm text-[#2E3944]">
                    No feedback found
                  </td>
                </tr>
              ) : (
                sortedEntries.map((entry) => (
                  <tr key={entry._id} className="hover:bg-[#F8F9FA] even:bg-[#F8F9FA]/50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#2E3944]">
                      {entry._id.slice(-6)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#212A31]">
                      {entry.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#2E3944]">
                      {entry.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#2E3944]">
                      {renderStars(entry.rating)}
                    </td>
                    <td className="px-6 py-4 text-sm text-[#2E3944] max-w-xs">
                      <span className="line-clamp-2 hover:line-clamp-none cursor-pointer"
                        onClick={() => handleViewDetails(entry)}
                        title={entry.experience}>
                        {entry.experience}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#2E3944]">
                      {formatDate(entry.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
                      <button
                        onClick={() => toggleMenu(entry._id)}
                        className="text-[#748D92] hover:text-[#124E66]"
                        aria-label={`Actions for ${entry.name}`}
                      >
                        <BsThreeDotsVertical />
                      </button>
                      {openMenuId === entry._id && (
                        <div className="absolute right-0 z-10 mt-2 w-48 bg-white rounded-md shadow-lg border border-[#D3D9D2]">
                          <div className="py-1">
                            <button
                              onClick={() => handleViewDetails(entry)}
                              className="flex items-center px-4 py-2 text-sm text-[#2E3944] hover:bg-[#F8F9FA] w-full text-left"
                              aria-label={`View details for ${entry.name}`}
                            >
                              <FiEye className="mr-2" /> View Details
                            </button>
                            <button
                              onClick={() => setShowDeleteConfirm(entry)}
                              className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-[#F8F9FA] w-full text-left"
                              aria-label={`Delete feedback from ${entry.name}`}
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

        {/* Details Modal */}
        {showDetails && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <h2 className="text-lg font-medium text-[#2E3944] mb-4">{showDetails.name}'s Feedback</h2>
              <p className="text-sm text-[#2E3944] mb-4">
                <strong>Email:</strong> {showDetails.email}<br />
                <strong>Rating:</strong> {renderStars(showDetails.rating)}<br />
                <strong>Experience:</strong> {showDetails.experience}
              </p>
              <button
                onClick={() => setShowDetails(null)}
                className="px-4 py-2 bg-[#124E66] text-white rounded-lg hover:bg-[#0E3D52] transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}

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

export default VisitorFeedbackReview;