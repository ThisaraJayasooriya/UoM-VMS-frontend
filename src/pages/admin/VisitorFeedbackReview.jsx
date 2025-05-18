import { useState, useEffect } from 'react';
import { FiSearch, FiDownload, FiTrash2, FiEye } from 'react-icons/fi';
import { BsArrowsExpand, BsThreeDotsVertical } from 'react-icons/bs';
import { FaStar, FaRegStar } from 'react-icons/fa';

const VisitorFeedbackReview = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [openMenuId, setOpenMenuId] = useState(null);
  const [feedbackEntries, setFeedbackEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null); // For success/error messages

  const toggleMenu = (id) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  // Fetch feedback data from backend
  const fetchFeedback = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/feedback', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
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

  // Delete feedback
  const handleDelete = async (id) => {
    try {
      console.log(`Attempting to delete feedback with ID: ${id}`);
      const response = await fetch(`http://localhost:5000/api/feedback/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete feedback');
      }

      // Refresh feedback list
      setFeedbackEntries(feedbackEntries.filter(entry => entry._id !== id));
      setOpenMenuId(null); // Close dropdown
      setMessage('Feedback deleted successfully');
      setTimeout(() => setMessage(null), 3000); // Clear message after 3 seconds
      console.log(`Successfully deleted feedback with ID: ${id}`);
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(null), 3000);
      console.error('Delete error:', err.message);
    }
  };

  const filters = ['All', '5 Stars', '4 Stars', '3 Stars', '2 Stars', '1 Star'];

  const filteredEntries = feedbackEntries.filter(entry => {
    const matchesFilter = activeFilter === 'All' || entry.rating === parseInt(activeFilter.split(' ')[0]);
    const matchesSearch = 
      entry.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      entry.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.experience.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

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

  const renderStars = (rating) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          star <= rating ? (
            <FaStar key={star} className="text-[#124E66]" />
          ) : (
            <FaRegStar key={star} className="text-[#748D92]" />
          )
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex-1 overflow-auto p-6 bg-[#F8F9FA] mt-10 flex items-center justify-center">
        <div className="text-[#2E3944]">Loading feedback...</div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto p-6 bg-[#F8F9FA] mt-10">
      {/* Success/Error Message */}
      {message && (
        <div className="mb-6 p-4 bg-green-100 text-green-800 rounded-lg">
          {message}
        </div>
      )}
      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-800 rounded-lg">
          Error: {error}
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-[#748D92]" />
            </div>
            <input
              type="text"
              placeholder="Search name, email or experience..."
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

      <div className="bg-white rounded-xl shadow-sm border border-[#D3D9D2] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[#D3D9D2]">
            <thead className="bg-[#F8F9FA]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#2E3944] uppercase tracking-wider">
                  Feedback ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#2E3944] uppercase tracking-wider">
                  <div className="flex items-center gap-1">
                    Name
                    <button className="text-[#748D92] hover:text-[#124E66]">
                      <BsArrowsExpand size={14} />
                    </button>
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#2E3944] uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#2E3944] uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#2E3944] uppercase tracking-wider">
                  Experience
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#2E3944] uppercase tracking-wider">
                  Submitted At
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-[#2E3944] uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-[#D3D9D2]">
              {filteredEntries.map((entry) => (
                <tr key={entry._id} className="hover:bg-[#F8F9FA]">
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
                  <td className="px-6 py-4 text-sm text-[#2E3944]">
                    <span className="line-clamp-2">{entry.experience}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#2E3944]">
                    {formatDate(entry.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
                    <button
                      onClick={() => toggleMenu(entry._id)}
                      className="text-[#748D92] hover:text-[#124E66]"
                    >
                      <BsThreeDotsVertical />
                    </button>

                    {openMenuId === entry._id && (
                      <div className="absolute right-0 z-10 mt-2 w-48 bg-white rounded-md shadow-lg border border-[#D3D9D2]">
                        <div className="py-1">
                          
                          <button
                            onClick={() => handleDelete(entry._id)}
                            className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-[#F8F9FA] w-full text-left"
                          >
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
            Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredEntries.length}</span> of <span className="font-medium">{feedbackEntries.length}</span> entries
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

export default VisitorFeedbackReview;