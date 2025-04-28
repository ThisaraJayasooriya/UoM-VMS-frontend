import { useState } from "react";
import { useNavigate } from "react-router-dom";



const VisitorSettings= () => {

  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState({
    name: "Nick Admin",
    employeeId: "A0001",
    designation: "System Administrator",
    nicNumber: "9478521V",
    email: "admin@email.com",
    phone: "0712345678",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({ ...userProfile });

  const handleEdit = () => {
    setIsEditing(true);
    setEditedProfile({ ...userProfile });
  };

  const handleSave = () => {
    setUserProfile({ ...editedProfile });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };



  return (
    <div className="flex flex-col flex-1 pt-20">
      <div className="max-w-4xl mx-auto w-full">
        <div className="bg-blue3 bg-opacity-60 rounded-lg p-8">
          <div className="flex flex-col md:flex-row items-center mb-8">
            <div className="w-36 h-36 bg-blue2 rounded-full mb-4 md:mb-0 md:mr-8"></div>
            <div>
              <h2 className="text-2xl font-bold">{userProfile.name}</h2>
              <p className="text-lg">{userProfile.designation}</p>
              <p className="text-lg">ID: {userProfile.employeeId}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="flex flex-col">
              <label className="text-lg mb-2">Name</label>
              {isEditing ? (
                <input
                  name="name"
                  value={editedProfile.name}
                  onChange={handleChange}
                  className="bg-blue text-white p-3 rounded-lg"
                />
              ) : (
                <div className="bg-blue text-white p-3 rounded-lg">
                  {userProfile.name}
                </div>
              )}
            </div>

            <div className="flex flex-col">
              <label className="text-lg mb-2">Employee ID</label>
              <div className="bg-blue text-white p-3 rounded-lg">
                {userProfile.employeeId}
              </div>
            </div>

            <div className="flex flex-col">
              <label className="text-lg mb-2">Designation</label>
              {isEditing ? (
                <input
                  name="designation"
                  value={editedProfile.designation}
                  onChange={handleChange}
                  className="bg-blue text-white p-3 rounded-lg"
                />
              ) : (
                <div className="bg-blue text-white p-3 rounded-lg">
                  {userProfile.designation}
                </div>
              )}
            </div>

            <div className="flex flex-col">
              <label className="text-lg mb-2">NIC Number</label>
              {isEditing ? (
                <input
                  name="nicNumber"
                  value={editedProfile.nicNumber}
                  onChange={handleChange}
                  className="bg-blue text-white p-3 rounded-lg"
                />
              ) : (
                <div className="bg-blue text-white p-3 rounded-lg">
                  {userProfile.nicNumber}
                </div>
              )}
            </div>

            <div className="flex flex-col">
              <label className="text-lg mb-2">Email Address</label>
              {isEditing ? (
                <input
                  name="email"
                  value={editedProfile.email}
                  onChange={handleChange}
                  className="bg-blue text-white p-3 rounded-lg"
                />
              ) : (
                <div className="bg-blue text-white p-3 rounded-lg">
                  {userProfile.email}
                </div>
              )}
            </div>

            <div className="flex flex-col">
              <label className="text-lg mb-2">Phone Number</label>
              {isEditing ? (
                <input
                  name="phone"
                  value={editedProfile.phone}
                  onChange={handleChange}
                  className="bg-blue text-white p-3 rounded-lg"
                />
              ) : (
                <div className="bg-blue text-white p-3 rounded-lg">
                  {userProfile.phone}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex space-x-4">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    className="bg-blue text-white px-6 py-2 rounded-lg"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="bg-gray-500 text-white px-6 py-2 rounded-lg"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                    <div className=" px-6 py-4 border-t border-[#D3D9D2] mt-8 ">
                      <button
                        className="bg-[#124E66] text-white px-4 py-2 rounded-md hover:bg-[#0E3D52] transition-colors duration-200 mr-3"
                        onClick={() => navigate("/visitor/editprofile")}
                      >
                        Edit Profile
                      </button>
                      <button className="bg-[#748D92] text-white px-4 py-2 rounded-md hover:bg-[#5A7176] transition-colors duration-200"
                      onClick={() => navigate("/login")}>
                        Log Out
                      </button>
                    </div>
                </>
              )}
            </div>
            <div className="text-sm text-gray-600">Last Login: 13.25pm</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisitorSettings;
