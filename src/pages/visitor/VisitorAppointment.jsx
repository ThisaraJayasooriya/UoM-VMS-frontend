import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  makeAppointment, 
  getAllHosts, 
  getAllFaculties, 
  getDepartmentsByFaculty 
} from "../../services/appoinment.api.js";

function VisitorAppointment() {
  const [hosts, setHosts] = useState([]);
  const [filteredHosts, setFilteredHosts] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedFaculty, setSelectedFaculty] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [hostId, sethostId] = useState("");
  const [errors, setErrors] = useState({
    firstname: "",
    lastname: "",
    contact: "",
    hostId: "",
    vehicle: "",
    category: "",
    reason: "",
  });
  const [isFormValid, setIsFormValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitSuccess, setIsSubmitSuccess] = useState(false);

  // Load faculties and all hosts on component mount
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // Load faculties and hosts in parallel
        const [facultyList, hostsData] = await Promise.all([
          getAllFaculties(),
          getAllHosts()
        ]);
        
        setFaculties(facultyList);
        setHosts(hostsData);
        setFilteredHosts(hostsData);
      } catch (error) {
        console.error("Failed to load initial data:", error);
      }
    };
    loadInitialData();
  }, []);
  
  // Handle faculty selection - load departments for that faculty
  useEffect(() => {
    const loadDepartments = async () => {
      if (selectedFaculty) {
        try {
          // Reset department and host selection
          setSelectedDepartment("");
          sethostId("");
          
          // Get departments for selected faculty
          const departmentsList = await getDepartmentsByFaculty(selectedFaculty);
          setDepartments(departmentsList);
          
          // Filter hosts by faculty
          const hostsInFaculty = hosts.filter(host => host.faculty === selectedFaculty);
          setFilteredHosts(hostsInFaculty);
        } catch (error) {
          console.error("Failed to load departments:", error);
        }
      } else {
        // Reset everything if no faculty is selected
        setDepartments([]);
        setFilteredHosts(hosts);
        sethostId("");
      }
    };
    
    loadDepartments();
  }, [selectedFaculty, hosts]);
  
  // Handle department selection - filter hosts by department
  useEffect(() => {
    if (selectedDepartment && selectedFaculty) {
      // Filter hosts by both faculty and department
      const filteredByDept = hosts.filter(host => 
        host.faculty === selectedFaculty && 
        host.department === selectedDepartment
      );
      setFilteredHosts(filteredByDept);
      
      // Reset host selection
      sethostId("");
    } else if (selectedFaculty) {
      // If only faculty is selected
      const filteredByFaculty = hosts.filter(host => host.faculty === selectedFaculty);
      setFilteredHosts(filteredByFaculty);
    }
  }, [selectedDepartment, selectedFaculty, hosts]);

  const [visitorId, setvisitorId] = useState("");
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("userData"));
    if (storedUser && storedUser.id) {
      setvisitorId(storedUser.id);
    }
  }, []);

  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [contact, setContact] = useState("");
  const [vehicleRequired, setVehicleRequired] = useState(false);
  const [vehicle, setVehicle] = useState("");
  const [category, setCategory] = useState("");
  const [reason, setReason] = useState("");

  const navigate = useNavigate();
  
  // Form validation that runs whenever form fields change
  useEffect(() => {
    validateForm();
  }, [firstname, lastname, contact, hostId, category, reason, vehicleRequired, vehicle]);

  const validateForm = () => {
    const newErrors = {};
    let valid = true;
    
    // Validate required fields
    if (!firstname.trim()) {
      newErrors.firstname = "First name is required";
      valid = false;
    }
    
    if (!lastname.trim()) {
      newErrors.lastname = "Last name is required";
      valid = false;
    }
    
    // Validate contact number - Must be exactly 10 digits and start with 07
    const phoneRegex = /^(0\d{9})$/;
    if (!contact.trim()) {
      newErrors.contact = "Contact number is required";
      valid = false;
    } else if (contact.length !== 10) {
      newErrors.contact = `Contact number must be exactly 10 digits (currently ${contact.length})`;
      valid = false;
    } else if (!phoneRegex.test(contact.trim())) {
      newErrors.contact = "Enter a valid Sri Lankan phone number (e.g. 0712345678)";
      valid = false;
    }
    
    if (!hostId) {
      newErrors.hostId = "Please select a host";
      valid = false;
    }
    
    if (vehicleRequired && !vehicle.trim()) {
      newErrors.vehicle = "Vehicle number is required";
      valid = false;
    }
    
    if (!category) {
      newErrors.category = "Please select a category";
      valid = false;
    }
    
    if (!reason.trim()) {
      newErrors.reason = "Reason is required";
      valid = false;
    }
    
    setErrors(newErrors);
    setIsFormValid(valid);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Run validation before submission
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    const appointmentData = {
      visitorId,
      firstname,
      lastname,
      contact: contact.trim(),
      hostId,
      vehicle,
      category,
      reason,
    };

    try {
      const result = await makeAppointment(appointmentData);
      console.log("Appointment submitted:", result);
      
      // Set success state
      setIsSubmitSuccess(true);
      
      // Reset form after successful submission
      setFirstname("");
      setLastname("");
      setContact("");
      sethostId("");
      setSelectedFaculty("");
      setSelectedDepartment("");
      setVehicleRequired(false);
      setVehicle("");
      setCategory("");
      setReason("");
      setErrors({});
      
      // Automatically hide success message after 5 seconds
      setTimeout(() => {
        setIsSubmitSuccess(false);
      }, 5000);

    } catch (err) {
      console.error("Error submitting appointment:", err);
      alert("Could not submit appointment. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pt-20 px-4 lg:px-20">
      <div className="bg-white p-6 rounded-xl shadow-2xl mt-8 mx-auto max-w-2xl overflow-hidden">
        <div className="bg-[#212A31] py-6 px-8 text-center -mt-6 -mx-6 mb-6">
          <h1 className="text-2xl font-bold text-white">Book an Appointment</h1>
          <p className="text-[#D3D9D2] mt-2">Please fill out all required information</p>
        </div>
        
        {/* Success Message */}
        {isSubmitSuccess && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6" role="alert">
            <strong className="font-bold">Success!</strong>
            <span className="block sm:inline"> Your appointment has been submitted successfully.</span>
          </div>
        )}
        
        <form className="flex flex-col gap-6 p-4" onSubmit={handleSubmit}>
          {/* First & Last Name */}
          <div className="flex gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="First Name *"
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
                className="w-full bg-gray-100 px-4 py-3 rounded-md border border-[#D3D9D2] focus:ring-2 focus:ring-[#124E66] focus:outline-none"
                required
              />
            </div>
            <div className="flex-1">
              <input
                type="text"
                placeholder="Last Name *"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                className="w-full bg-gray-100 px-4 py-3 rounded-md border border-[#D3D9D2] focus:ring-2 focus:ring-[#124E66] focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Contact */}
          <div>
            <div className="relative">
              <input
                type="text"
                placeholder="Contact (10 digits only) *"
                value={contact}
                onChange={(e) => {
                  // Only allow numbers and limit to 10 characters
                  const value = e.target.value.replace(/\D/g, "").slice(0, 10);
                  setContact(value);
                }}
                className={`w-full bg-gray-100 px-4 py-3 rounded-md border ${contact.length > 0 && contact.length < 10 ? 'border-[#748D92]' : 'border-[#D3D9D2]'} focus:ring-2 focus:ring-[#124E66] focus:outline-none`}
                required
                pattern=".{10,10}"
                title="Contact number must be exactly 10 digits"
              />
              <div className="absolute right-3 top-3 text-xs text-[#748D92]">
                {contact.length}/10
              </div>
            </div>
            {contact.length > 0 && contact.length < 10 && (
              <p className="text-[#748D92] text-xs mt-1">Contact number must be exactly 10 digits</p>
            )}
          </div>

          {/* Faculty Selection */}
          <div className="mb-4">
            <label className="block text-[#748D92] text-sm mb-2">Select Faculty *</label>
            <select
              onChange={(e) => setSelectedFaculty(e.target.value)}
              value={selectedFaculty}
              className="w-full bg-gray-100 px-4 py-3 rounded-md border border-[#D3D9D2] focus:ring-2 focus:ring-[#124E66] focus:outline-none"
            >
              <option value="">All Faculties</option>
              {faculties.map((faculty) => (
                <option key={faculty} value={faculty}>
                  {faculty}
                </option>
              ))}
            </select>
            {selectedFaculty && (
              <p className="text-xs text-[#124E66] mt-1">
                Selected Faculty: {selectedFaculty}
              </p>
            )}
          </div>
          
          {/* Department Selection - Only show if faculty is selected */}
          {selectedFaculty && (
            <div className="mb-4">
              <label className="block text-[#748D92] text-sm mb-2">Select Department *</label>
              <select
                onChange={(e) => setSelectedDepartment(e.target.value)}
                value={selectedDepartment}
                className="w-full bg-gray-100 px-4 py-3 rounded-md border border-[#D3D9D2] focus:ring-2 focus:ring-[#124E66] focus:outline-none"
              >
                <option value="">All Departments in {selectedFaculty}</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
              {selectedDepartment && (
                <p className="text-xs text-[#124E66] mt-1">
                  Selected Department: {selectedDepartment}
                </p>
              )}
            </div>
          )}

          {/* Host Selection - Only show after department is selected */}
          {selectedDepartment && (
            <div className="mb-4">
              <label className="block text-[#748D92] text-sm mb-2">Select Host *</label>
              <select
                onChange={(e) => sethostId(e.target.value)}
                value={hostId}
                className="w-full bg-gray-100 px-4 py-3 rounded-md border border-[#D3D9D2] focus:ring-2 focus:ring-[#124E66] focus:outline-none"
                required
              >
                <option value="">Select a Host *</option>
                {filteredHosts.length > 0 ? (
                  filteredHosts.map((host) => (
                    <option key={host._id} value={host._id}>
                      {host.name} ({host.department})
                    </option>
                  ))
                ) : (
                  <option disabled>No hosts available</option>
                )}
              </select>
              {filteredHosts.length === 0 && (
                <p className="text-[#748D92] text-xs mt-1">No hosts found in {selectedDepartment} department</p>
              )}
            </div>
          )}

          {/* Vehicle Entry */}
          <div className="mt-4 text-[#748D92]">
            <p className="mb-2">Vehicle Entry Required?</p>
            <div className="flex items-center gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  checked={vehicleRequired}
                  onChange={() => setVehicleRequired(true)}
                  className="mr-2 accent-[#124E66]"
                />
                Yes
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  checked={!vehicleRequired}
                  onChange={() => setVehicleRequired(false)}
                  className="mr-2 accent-[#124E66]"
                />
                No
              </label>
            </div>
            {vehicleRequired && (
              <div>
                <input
                  type="text"
                  name="vehicleNumber"
                  placeholder="Add Vehicle Number *"
                  value={vehicle}
                  onChange={(e) => setVehicle(e.target.value)}
                  className="mt-2 w-full bg-gray-100 px-4 py-3 rounded-md border border-[#D3D9D2] focus:ring-2 focus:ring-[#124E66] focus:outline-none"
                  required={vehicleRequired}
                />
              </div>
            )}
          </div>

          {/* Category */}
          <div>
            <select
              name="appointmentCategory"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-4 w-full bg-gray-100 px-4 py-3 rounded-md border border-[#D3D9D2] focus:ring-2 focus:ring-[#124E66] focus:outline-none"
              required
            >
              <option value="">Select Appointment Category *</option>
              <option value="Official">Official</option>
              <option value="Private">Private</option>
            </select>
          </div>

          {/* Reason */}
          <div>
            <textarea
              name="reason"
              placeholder="Reason *"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full bg-gray-100 px-4 py-3 rounded-md border border-[#D3D9D2] focus:ring-2 focus:ring-[#124E66] focus:outline-none h-24"
              required
            />
          </div>

          {/* Form Notes */}
          <div className="mt-2 text-[#748D92] text-sm">
            <p>* Required fields</p>
          </div>
          
          {/* Action Buttons */}
          <div className="mt-4 flex flex-col sm:flex-row gap-3">
            
            <button
              type="submit"
              disabled={isLoading || contact.length !== 10 || !isFormValid}
              className={`flex-1 flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white ${contact.length === 10 && isFormValid ? 'bg-[#124E66] hover:bg-[#1F5F7B]' : 'bg-gray-400 cursor-not-allowed'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#124E66] transition-all duration-300`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </>
              ) : (
                'Submit Appointment'
              )}
            </button>
          </div>
        </form>
        
        <div className="bg-[#F8F9FA] px-8 py-4 text-center border-t border-[#D3D9D2] -mb-6 -mx-6 mt-6">
          <p className="text-sm text-[#748D92]">
            Your appointment will be reviewed by the host
          </p>
        </div>
      </div>
      
      <p className="mt-8 text-center text-sm text-gray-600">
        Need help? Contact support
      </p>
    </div>
  );
}

export default VisitorAppointment;
