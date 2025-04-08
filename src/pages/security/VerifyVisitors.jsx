import { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';

const VerifyVisitors = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialVisitCode = queryParams.get('code') || '';

  // Sample visitor data
  const [visitors, setVisitors] = useState([
    {
      name: 'Joe Root',
      visitCode: 'V00125',
      email: 'joe@email.com',
      vehicleNumber: 'AB1234',
      phone: '0712345678',
      nic: '20012345678',
      host: 'George Smith',
      status: 'Awaiting Check-In'
    },
    {
      name: 'Jane Doe',
      visitCode: 'V00126',
      email: 'jane@email.com',
      vehicleNumber: 'CD5678',
      phone: '0712345679',
      nic: '20012345679',
      host: 'John Doe',
      status: 'Awaiting Check-In'
    },
    // Add more sample visitors as needed
  ]);

  const [filteredVisitors, setFilteredVisitors] = useState(visitors);
  const [searchTerm, setSearchTerm] = useState(initialVisitCode);
  const [actionResult, setActionResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Filter visitors based on search term
  useEffect(() => {
    if (searchTerm) {
      const filtered = visitors.filter((visitor) =>
        visitor.visitCode.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredVisitors(filtered);

      // Show alert if no visitors match the search term
      if (filtered.length === 0) {
        window.alert('⚠ Invalid Visit code. Please enter a valid code.');
      }
    } else {
      setFilteredVisitors(visitors); // Reset to all visitors when no search term
    }
  }, [searchTerm, visitors]);

  // Show alerts after state updates
  useEffect(() => {
    if (actionResult) {
      window.alert(actionResult.message);
      setActionResult(null); // Reset the action result
    }
  }, [actionResult]);

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    setSearchTerm(searchTerm);
    console.log('Searching for visitor with code:', searchTerm);
  };
  
  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle clear search
  const handleClearSearch = () => {
    setSearchTerm('');
  };

  // Handle check-in
  const handleCheckIn = async () => {
    if (!searchTerm) {
      setActionResult({ message: '⚠ Please enter a visit code.' });
      return;
    }

    setIsLoading(true); // Start loading state

    // Simulate an API call or delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const visitorIndex = visitors.findIndex(
      (visitor) => visitor.visitCode === searchTerm
    );

    if (visitorIndex !== -1) {
      const updatedVisitors = [...visitors];
      updatedVisitors[visitorIndex].status = 'Checked-In';
      setVisitors(updatedVisitors);
      setActionResult({ message: '✅ Checked-In Successfully!' });
    } else {
      setActionResult({ message: '⚠ Invalid Visit code. Please enter a valid code.' });
    }

    setIsLoading(false); // End loading state
  };

  // Handle check-out
  const handleCheckOut = async () => {
    if (!searchTerm) {
      setActionResult({ message: '⚠ Please enter a visit code.' });
      return;
    }

    setIsLoading(true); // Start loading state

    // Simulate an API call or delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const visitorIndex = visitors.findIndex(
      (visitor) => visitor.visitCode === searchTerm
    );

    if (visitorIndex !== -1) {
      const updatedVisitors = [...visitors];
      updatedVisitors[visitorIndex].status = 'Checked-Out';
      setVisitors(updatedVisitors);
      setActionResult({ message: '✅ Checked-Out Successfully!' });
    } else {
      setActionResult({ message: '⚠ Invalid Visit code. Please enter a valid code.' });
    }

    setIsLoading(false); // End loading state
  };

  return (
    <div className="flex flex-col flex-1 pt-20">
      <div className="max-w-4xl mx-auto w-full bg-gray-200 rounded-lg p-6">
        
        {/* Search Form */}
        <div className="bg-blue bg-opacity-20 rounded-lg p-8 mb-6">
          <p className="text-xl mb-4 text-center text-white">Enter Visitor Code</p>
          <form onSubmit={handleSearch} className="flex justify-center">
            <div className="relative w-64">
              <input
                type="text"
                value={searchTerm}
                onChange={handleInputChange}
                placeholder="Enter visitor code"
                className="w-full px-4 py-2 rounded-full pr-10 color-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-darkblue2 focus:border-transparent"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-500"
                >
                  ×
                </button>
              )}
            </div>
            <button
              type="submit"
              className="ml-2 bg-darkblue2 text-white px-4 py-2 rounded-lg"
              disabled={isLoading}
            >
              Search
            </button>
          </form>
        </div>
        
        {/* Visitor Details */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Visitor Details</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="text-left bg-blue text-white">
                  <th className="p-3 rounded-tl-lg">Name</th>
                  <th className="p-3">Visitor Code</th>
                  <th className="p-3">E-mail Address</th>
                  <th className="p-3">Vehicle Number</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">NIC</th>
                  <th className="p-3">Host</th>
                  <th className="p-3 rounded-tr-lg">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredVisitors.map((visitor, index) => (
                  <tr key={index} className={index % 2 === 0 ? "bg-blue-100" : "bg-white"}>
                    <td className="p-3">{visitor.name}</td>
                    <td className="p-3">{visitor.visitCode}</td>
                    <td className="p-3">{visitor.email}</td>
                    <td className="p-3">{visitor.vehicleNumber}</td>
                    <td className="p-3">{visitor.phone}</td>
                    <td className="p-3">{visitor.nic}</td>
                    <td className="p-3">{visitor.host}</td>
                    <td className="p-3">{visitor.status}</td>
                  </tr>
                ))}
                {filteredVisitors.length === 0 && (
                  <tr className="bg-white">
                    <td colSpan="8" className="p-3 text-center">No visitors found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <button
            onClick={handleCheckIn}
            className="bg-blue text-white px-6 py-3 rounded-lg text-lg"
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Check-In"}
          </button>
          <button
            onClick={handleCheckOut}
            className="bg-blue text-white px-6 py-3 rounded-lg text-lg"
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Check-Out"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyVisitors;