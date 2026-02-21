'use client';

import { useState } from 'react';
import { Star, Send, MessageSquare, User, Mail } from 'lucide-react';

interface FeedbackBoxProps {
  brandName: string;
}

export default function FeedbackBox({ brandName }: FeedbackBoxProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rating: 0,
    feedback: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleRatingClick = (rating: number) => {
    setFormData(prev => ({ ...prev, rating }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSubmitted(true);

    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', email: '', rating: 0, feedback: '' });
    }, 3000);
  };

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, i) => (
      <button
        key={i}
        type="button"
        onClick={() => handleRatingClick(i + 1)}
        className={`w-8 h-8 transition-colors ${i < formData.rating ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-300'
          }`}
      >
        <Star className={`w-full h-full ${i < formData.rating ? 'fill-current' : ''}`} />
      </button>
    ));
  };

  const isFormValid = formData.name && formData.email && formData.rating > 0 && formData.feedback;

  if (isSubmitted) {
    return (
      <section className="bg-gradient-to-r from-green-50 to-emerald-50 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Thank You!</h2>
            <p className="text-gray-600 text-lg">
              Your feedback about {brandName} has been submitted successfully. We appreciate your input!
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gradient-to-r from-blue-50 to-indigo-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Share Your Feedback</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Help us improve our {brandName} brand page. Your feedback is valuable to us and helps other car buyers make informed decisions.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name and Email Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Your Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your email address"
                  />
                </div>
              </div>
            </div>

            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Rate this {brandName} brand page *
              </label>
              <div className="flex items-center space-x-1">
                {renderStars()}
                <span className="ml-3 text-sm text-gray-600">
                  {formData.rating > 0 ? `${formData.rating} out of 5 stars` : 'Click to rate'}
                </span>
              </div>
            </div>

            {/* Feedback Message */}
            <div>
              <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 mb-2">
                Your Feedback *
              </label>
              <textarea
                id="feedback"
                name="feedback"
                value={formData.feedback}
                onChange={handleInputChange}
                required
                rows={5}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder={`Share your thoughts about our ${brandName} brand page. What did you like? What could be improved? Any suggestions for better content or features?`}
              />
              <p className="mt-2 text-sm text-gray-500">
                Minimum 10 characters. Be specific and constructive.
              </p>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={!isFormValid || isSubmitting}
                className={`w-full flex items-center justify-center space-x-2 py-3 px-6 rounded-lg font-semibold transition-all ${isFormValid && !isSubmitting
                    ? 'bg-blue-600 text-white hover:bg-blue-700 transform hover:scale-105'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Submit Feedback</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Additional Info */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                  <MessageSquare className="w-5 h-5 text-blue-600" />
                </div>
                <h4 className="font-semibold text-gray-900 text-sm">Quick Response</h4>
                <p className="text-xs text-gray-600">We review all feedback within 24 hours</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mb-2">
                  <Star className="w-5 h-5 text-green-600" />
                </div>
                <h4 className="font-semibold text-gray-900 text-sm">Quality Improvement</h4>
                <p className="text-xs text-gray-600">Your input helps us enhance user experience</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mb-2">
                  <User className="w-5 h-5 text-purple-600" />
                </div>
                <h4 className="font-semibold text-gray-900 text-sm">Privacy Protected</h4>
                <p className="text-xs text-gray-600">Your information is secure and confidential</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
