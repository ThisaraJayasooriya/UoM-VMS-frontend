import React from "react";

const ContactUs = () => {
  return (
    <div className="bg-[#D3D9D4] min-h-screen p-6">
      {/* Header section with adjusted padding */}
      <div className="pl-4 md:pl-10">
        <h2 className="text-3xl font-bold text-teal-900 mb-2">Contact Us</h2>
        <p className="text-lg text-gray-700 mb-8">General Contact Information</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Side - Contact Info */}
        <div className="space-y-6 pl-4 md:pl-10">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-blue-500 text-2xl">📍</span>
              <h3 className="text-xl font-semibold text-gray-800">Address</h3>
            </div>
            <p className="text-gray-800 ml-8">
              University of Moratuwa<br />
              Bandaranayake Mawatha<br />
              Moratuwa 10400
            </p>
          </div>

          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-blue-500 text-2xl">📞</span>
              <h3 className="text-xl font-semibold text-gray-800">Telephone</h3>
            </div>
            <p className="text-gray-800 ml-8">
              +94 112 640 051<br />
              +94 112 650 301
            </p>
          </div>

          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-blue-500 text-2xl">📧</span>
              <h3 className="text-xl font-semibold text-gray-800">Email</h3>
            </div>
            <p className="text-gray-800 ml-8">info [AT] uom.lk</p>
          </div>
        </div>

        {/* Right Side - Google Map */}
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Our Location</h3>
          <div className="w-full h-64 rounded-md overflow-hidden shadow-lg">
            <iframe
              title="University of Moratuwa Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15844.847939135187!2d79.900867!3d6.7951276!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae245416b7f34b5%3A0x7bd32721ab02560e!2sUniversity%20of%20Moratuwa!5e0!3m2!1sen!2slk!4v1712500000000!5m2!1sen!2slk"
              width="100%"
              height="100%"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
