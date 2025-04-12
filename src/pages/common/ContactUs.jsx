import React from "react";
import {
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaClock,
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaYoutube,
} from "react-icons/fa";

const ContactUs = () => {
  return (
    <div className="bg-gradient-to-b from-[#D3D9D2] to-[#EBEFEA] min-h-screen">
      {/* Hero Section */}
      <div className="bg-[#124E66] text-white py-16 px-6 md:px-10 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-2">Get In Touch</h1>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information Card */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-[#212A31] text-white p-6">
              <h2 className="text-2xl font-bold">Contact Information</h2>
              <p className="text-[#D3D9D2]">Reach out to us through these channels</p>
            </div>

            <div className="p-6 space-y-8">
              <div className="flex items-start space-x-4">
                <div className="bg-[#124E66] text-white p-3 rounded-full">
                  <FaMapMarkerAlt className="text-xl" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[#2E3944]">Address</h3>
                  <p className="text-[#748D92] mt-1">
                    University of Moratuwa<br />
                    Bandaranayake Mawatha<br />
                    Moratuwa 10400
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-[#124E66] text-white p-3 rounded-full">
                  <FaPhone className="text-xl" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[#2E3944]">Telephone</h3>
                  <p className="text-[#748D92] mt-1">
                    +94 112 640 051<br />
                    +94 112 650 301
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-[#124E66] text-white p-3 rounded-full">
                  <FaEnvelope className="text-xl" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[#2E3944]">Email</h3>
                  <p className="text-[#748D92] mt-1">info@uom.lk</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-[#124E66] text-white p-3 rounded-full">
                  <FaClock className="text-xl" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[#2E3944]">Opening Hours</h3>
                  <p className="text-[#748D92] mt-1">
                    Daily: 5:00 AM - 10:00 PM<br />
                    (Subject to change on public holidays)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Map and Social Media Section */}
          <div className="space-y-8">
            {/* Map Card */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-[#212A31] text-white p-6">
                <h2 className="text-2xl font-bold">Our Location</h2>
              </div>
              <div className="h-80 w-full">
                <iframe
                  title="University of Moratuwa Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15844.847939135187!2d79.900867!3d6.7951276!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae245416b7f34b5%3A0x7bd32721ab02560e!2sUniversity%20of%20Moratuwa!5e0!3m2!1sen!2slk!4v1712500000000!5m2!1sen!2slk"
                  width="100%"
                  height="100%"
                  allowFullScreen=""
                  loading="lazy"
                  className="border-0"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>

            {/* Social Media Card */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-[#212A31] text-white p-6">
                <h2 className="text-2xl font-bold">Connect With Us</h2>
              </div>
              <div className="p-6">
                <div className="flex justify-center space-x-6">
                  <a href="#" className="bg-[#124E66] text-white p-3 rounded-full hover:bg-[#2E3944] transition">
                    <FaFacebook className="text-xl" />
                  </a>
                  <a href="#" className="bg-[#124E66] text-white p-3 rounded-full hover:bg-[#2E3944] transition">
                    <FaTwitter className="text-xl" />
                  </a>
                  <a href="#" className="bg-[#124E66] text-white p-3 rounded-full hover:bg-[#2E3944] transition">
                    <FaLinkedin className="text-xl" />
                  </a>
                  <a href="#" className="bg-[#124E66] text-white p-3 rounded-full hover:bg-[#2E3944] transition">
                    <FaYoutube className="text-xl" />
                  </a>
                </div>
                <p className="text-center mt-4 text-[#748D92]">
                  Follow us on social media for the latest updates
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form Section */}
        <div className="mt-16 bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-[#212A31] text-white p-6">
            <h2 className="text-2xl font-bold">Send Us a Message</h2>
          </div>
          <div className="p-6 md:p-8">
            <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-[#2E3944] font-medium mb-2">Full Name</label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-4 py-2 border border-[#D3D9D2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#124E66]"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-[#2E3944] font-medium mb-2">Email Address</label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-2 border border-[#D3D9D2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#124E66]"
                  placeholder="your.email@example.com"
                />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="subject" className="block text-[#2E3944] font-medium mb-2">Subject</label>
                <input
                  type="text"
                  id="subject"
                  className="w-full px-4 py-2 border border-[#D3D9D2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#124E66]"
                  placeholder="Subject of your message"
                />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="message" className="block text-[#2E3944] font-medium mb-2">Message</label>
                <textarea
                  id="message"
                  rows="4"
                  className="w-full px-4 py-2 border border-[#D3D9D2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#124E66]"
                  placeholder="Your message here..."
                ></textarea>
              </div>
              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="bg-[#124E66] hover:bg-[#2E3944] text-white font-medium py-3 px-6 rounded-lg transition duration-300"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
