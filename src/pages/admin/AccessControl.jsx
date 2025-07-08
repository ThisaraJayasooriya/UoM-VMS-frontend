import React, { useState, useEffect } from 'react';
import { FaUserTimes, FaUserCheck, FaSearch, FaBan, FaCheck } from 'react-icons/fa';

const AccessControl = () => {
  // State management for blocked users and UI
  const [blockedUsers, setBlockedUsers] = useState([]); // Stores blocked users data
  const [searchTerm, setSearchTerm] = useState(''); // Search input value
  const [isLoading, setIsLoading] = useState(true); // Loading state

  // Fetch blocked users on component mount
  useEffect(() => {
    const fetchBlockedUsers = async () => {
      try {
        // Simulate API call with timeout
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mock data 
        const mockData = [
          { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Visitor', blockedOn: '2023-05-15', reason: 'Multiple failed login attempts' },
          { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Host', blockedOn: '2023-05-10', reason: 'Suspicious activity' },
          { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Visitor', blockedOn: '2023-05-05', reason: 'Policy violation' },
        ];
        
        setBlockedUsers(mockData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching blocked users:', error);
        setIsLoading(false);
      }
    };

    fetchBlockedUsers();
  }, []);

  // Handle unblocking a user
  const handleUnblockUser = (userId) => {
    setBlockedUsers(blockedUsers.filter(user => user.id !== userId));
  };

  // Filter users based on search term
  const filteredUsers = blockedUsers.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-24">
      {/* Blocked Users List Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-[#124E66] mb-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-[#212A31]">Blocked Users</h2>
          {/* Search Input */}
          <div className="relative w-64">
            <input
              type="text"
              placeholder="Search users..."
              className="w-full pl-10 pr-4 py-2 border border-[#124E66] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#000000]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-3 text-[#124E66]" />
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#124E66]"></div>
          </div>
        ) : 
        /* Empty State */
        filteredUsers.length === 0 ? (
          <div className="text-center py-10">
            <FaUserCheck className="mx-auto text-4xl text-[#124E66] mb-4" />
            <p className="text-lg text-[#212A31]">No blocked users found</p>
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="mt-2 text-[#124E66] hover:underline"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          /* Users Table */
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[#D3D9D2]">
              <thead className="bg-[#124E66]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#ffffff] uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#ffffff] uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#ffffff] uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#ffffff] uppercase tracking-wider">Blocked On</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#ffffff] uppercase tracking-wider">Reason</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#ffffff] uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-[#ffffff] divide-y divide-[#aec9ff]">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-[#eaf4ff]">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#212A31]">{user.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#212A31]">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#212A31]">{user.role}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#212A31]">{user.blockedOn}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#212A31]">{user.reason}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#212A31]">
                      <button
                        onClick={() => handleUnblockUser(user.id)}
                        className="text-[#124E66] hover:text-[#142025] flex items-center"
                      >
                        <FaCheck className="mr-1" /> Unblock
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Block New User Form Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-[#124E66]">
        <h2 className="text-xl font-semibold text-[#212A31] mb-4">Block New User</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* User Search */}
          <div>
            <label className="block text-sm font-medium text-[#212A31] mb-1">Search User</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Enter name or email..."
                className="w-full pl-10 pr-4 py-2 border border-[#124E66] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#124E66]"
              />
              <FaSearch className="absolute left-3 top-3 text-[#124E66]" />
            </div>
          </div>
          
          {/* Blocking Reason */}
          <div>
            <label className="block text-sm font-medium text-[#212A31] mb-1">Reason for Blocking</label>
            <select className="w-full px-4 py-2 border border-[#124E66] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#124E66]">
              <option value="">Select a reason</option>
              <option value="suspicious">Suspicious Activity</option>
              <option value="violation">Policy Violation</option>
              <option value="spam">Spam/Abuse</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          {/* Additional Notes */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-[#212A31] mb-1">Additional Notes</label>
            <textarea
              className="w-full px-4 py-2 border border-[#124E66] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#124E66]"
              rows="3"
              placeholder="Add any additional details..."
            ></textarea>
          </div>
          
          {/* Submit Button */}
          <div className="md:col-span-2 flex justify-end">
            <button className="px-4 py-2 bg-[#124E66] text-white rounded-lg hover:bg-[#212A31] transition-colors flex items-center">
              <FaBan className="mr-2" /> Block User
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessControl;