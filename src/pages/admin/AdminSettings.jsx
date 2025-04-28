import React, { useState } from 'react';
import { FiUser, FiMail, FiPhone, FiLock } from 'react-icons/fi';

const SettingsPage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('view');
  const [profile, setProfile] = useState({
    name: 'Kevin Decker',
    userId: 'S0001',
    designation: 'Admin',
    nicNumber: '9574823V',
    email: 'kevind@email.com',
    phone: '0113567854'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  return (
    <div className="pt-20 px-4 lg:px-20">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-xl overflow-hidden">

        {/* Tabs */}
        <div className="flex justify-center gap-8 p-6 bg-gray-100 border-b">
          <button
            className={`text-lg px-8 py-4 rounded-full font-semibold transition-all ${
              activeTab === 'view'
                ? 'bg-[#124E66] text-white shadow-md'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
            onClick={() => {
              setActiveTab('view');
              setIsEditing(false);
            }}
          >
            See My Profile
          </button>
          <button
            className={`text-lg px-8 py-4 rounded-full font-semibold transition-all ${
              activeTab === 'edit'
                ? 'bg-[#124E66] text-white shadow-md'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
            onClick={() => {
              setActiveTab('edit');
              setIsEditing(true);
            }}
          >
            Edit My Profile
          </button>
        </div>

        {/* Profile Content */}
        <div className="p-8">
          <div className="flex flex-col md:flex-row gap-6 items-center mb-8">
            <div className="w-24 h-24 rounded-full bg-[#124E66] text-white flex items-center justify-center text-3xl font-bold">
              {profile.name.charAt(0)}
            </div>
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-bold text-gray-800">{profile.name}</h3>
              <p className="text-gray-500">{profile.designation}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">User ID</label>
              <input
                type="text"
                name="userId"
                value={profile.userId}
                disabled
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Full Name</label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
              ) : (
                <p className="p-3 bg-gray-50 rounded-lg">{profile.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Designation</label>
              {isEditing ? (
                <input
                  type="text"
                  name="designation"
                  value={profile.designation}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
              ) : (
                <p className="p-3 bg-gray-50 rounded-lg">{profile.designation}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">NIC Number</label>
              {isEditing ? (
                <input
                  type="text"
                  name="nicNumber"
                  value={profile.nicNumber}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
              ) : (
                <p className="p-3 bg-gray-50 rounded-lg">{profile.nicNumber}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
              ) : (
                <p className="p-3 bg-gray-50 rounded-lg">{profile.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Phone Number</label>
              {isEditing ? (
                <input
                  type="tel"
                  name="phone"
                  value={profile.phone}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
              ) : (
                <p className="p-3 bg-gray-50 rounded-lg">{profile.phone}</p>
              )}
            </div>
          </div>

          {isEditing && (
            <div className="text-center mt-10">
              <button
                onClick={handleSave}
                className="bg-[#124E66] hover:bg-[#0e3a4f] text-white px-10 py-4 rounded-full text-lg font-semibold shadow-lg transition-all"
              >
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
