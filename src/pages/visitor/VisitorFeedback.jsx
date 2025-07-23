import { useState } from 'react';
import { FaStar, FaRegStar, FaPaperPlane, FaTimes } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';

const VisitorFeedbackForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    experience: '',
    rating: 0,
    isSubmitting: false,
    submissionStatus: null // 'success' or 'error'
  });

  const [hoverRating, setHoverRating] = useState(0);
  const location = useLocation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormData(prev => ({ ...prev, isSubmitting: true, submissionStatus: null }));

    try {
      const response = await fetch('http://localhost:5000/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          rating: formData.rating,
          experience: formData.experience,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit feedback');
      }

      // Reset form after successful submission
      setFormData({
        name: '',
        email: '',
        experience: '',
        rating: 0,
        isSubmitting: false,
        submissionStatus: 'success'
      });
    } catch (error) {
      setFormData(prev => ({
        ...prev,
        isSubmitting: false,
        submissionStatus: 'error'
      }));
    }
  };

  const handleClear = () => {
    setFormData({
      name: '',
      email: '',
      experience: '',
      rating: 0,
      isSubmitting: false,
      submissionStatus: null
    });
  };

  return (
    <div className="flex-1 overflow-auto pt-20">
      <div className="max-w-2xl mx-auto p-6">
        {/* Submission Status Message */}
        {formData.submissionStatus === 'success' && (
          <div className="mb-6 p-4 bg-green-100 text-green-800 rounded-lg">
            Thank you! Your feedback has been submitted successfully.
          </div>
        )}
        {formData.submissionStatus === 'error' && (
          <div className="mb-6 p-4 bg-red-100 text-red-800 rounded-lg">
            Failed to submit feedback. Please try again.
          </div>
        )}

        {/* Feedback Form Card */}
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
          {/* Form Header */}
          <div className="bg-[#124E66] p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">Feedback Form</h1>
                <p className="text-sm opacity-90 mt-1">
                  We value your feedback to improve our services
                </p>
              </div>
              <div className="w-16 h-16 bg-[#748D92] rounded-full flex items-center justify-center">
                <FaPaperPlane className="text-2xl" />
              </div>
            </div>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Name Field */}
            <div className="space-y-2">
              <label className="block text-[#212A31] font-medium">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 border border-[#D3D9D2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#124E66] transition-all"
                required
              />
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label className="block text-[#212A31] font-medium">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 border border-[#D3D9D2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#124E66] transition-all"
                placeholder="Enter your email"
                required
              />
            </div>

            {/* Rating System */}
            <div className="space-y-2">
              <label className="block text-[#212A31] font-medium">Rating</label>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormData({ ...formData, rating: star })}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="text-2xl focus:outline-none"
                  >
                    {star <= (hoverRating || formData.rating) ? (
                      <FaStar className="text-[#124E66]" />
                    ) : (
                      <FaRegStar className="text-[#748D92]" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Experience Field */}
            <div className="space-y-2">
              <label className="block text-[#212A31] font-medium">Your Feedback About Our VMS</label>
              <textarea
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                rows="5"
                className="w-full p-3 border border-[#D3D9D2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#124E66] transition-all"
                placeholder="Tell us about your experience..."
                required
              />
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={handleClear}
                className="px-6 py-2 flex items-center space-x-2 text-[#2E3944] hover:text-[#124E66] transition-colors"
              >
                <FaTimes />
                <span>Clear</span>
              </button>
              <button
                type="submit"
                disabled={formData.isSubmitting}
                className={`px-6 py-2 bg-[#124E66] text-white rounded-lg hover:bg-[#0E3D52] transition-colors flex items-center space-x-2 ${
                  formData.isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {formData.isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <FaPaperPlane />
                    <span>SUBMIT</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VisitorFeedbackForm;