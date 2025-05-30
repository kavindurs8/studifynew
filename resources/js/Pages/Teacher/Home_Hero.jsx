import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const HeroSection = () => {
  return (
    <section className="w-full relative py-8 sm:py-12 lg:py-16 xl:py-24 bg-blue-800 overflow-hidden">
      {/* Background circle patterns */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full opacity-30 transform translate-x-1/3 -translate-y-1/4"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500 rounded-full opacity-20 transform -translate-x-1/3 translate-y-1/4"></div>

      {/* Content container with max width */}
      <div className="relative px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-12 items-start lg:items-center">
          {/* Left Column: Text Content (spans 3 columns) */}
          <div className="lg:col-span-3 max-w-2xl">
            {/* Bold headline with all caps for impact */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight text-white uppercase">
              UNLOCK YOUR<br className="hidden md:block" />
              <span className="text-yellow-300">LEARNING</span><br className="hidden md:block" />
              POTENTIAL!
            </h1>

            {/* Subheading */}
            <p className="mt-4 sm:mt-6 text-lg sm:text-xl leading-relaxed text-white">
              Join thousands of learners on STUDIFY - the premier educational platform connecting ambitious students with world-class instructors for personalized learning journeys.
            </p>

            {/* Search Bar with Autocomplete */}
            <div className="mt-6 sm:mt-8">
              <div className="relative w-full max-w-lg">
                <input
                  type="text"
                  placeholder="Find your perfect tutor or course..."
                  className="w-full py-3 sm:py-4 px-4 sm:px-5 pl-10 sm:pl-12 text-sm sm:text-base text-black placeholder-gray-500 bg-white border-0 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-white"
                />
                <div className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-blue-600">
                  <FontAwesomeIcon icon={faSearch} className="text-base sm:text-lg" />
                </div>
                <button
                  type="button"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-3 py-1 sm:px-4 sm:py-2 rounded-md text-sm hover:bg-blue-700 transition-colors"
                >
                  Explore
                </button>

                {/* Autocomplete results container - hidden by default */}
                <div className="absolute left-0 right-0 mt-1 bg-white rounded-md shadow-lg max-h-96 overflow-y-auto z-50 hidden">
                  <div className="p-4 text-center hidden">
                    <div className="inline-block animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-600"></div>
                    <span className="ml-2 text-sm text-gray-600">Searching...</span>
                  </div>
                  <div className="p-4 text-center hidden">
                    <span className="text-sm text-gray-600">No results found</span>
                  </div>
                  <div></div>
                </div>
              </div>

              <div className="mt-2 flex flex-wrap gap-2 text-xs text-blue-100">
                <span>Trending:</span>
                <a href="#" className="hover:text-white">Programming</a>
                <a href="#" className="hover:text-white">Business</a>
                <a href="#" className="hover:text-white">Design</a>
              </div>
            </div>

            {/* Widget: Next Step Cheatsheet - Improved spacing on mobile */}
            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
              {/* Widget Image - Smaller on mobile */}
              <div className="flex-shrink-0 w-24 sm:w-32 md:w-36">
                <img
                  src="http://cima.wuaze.com/wp-content/uploads/2022/07/widget-12.png"
                  alt="Study Success Guide"
                  className="w-full h-auto drop-shadow-lg"
                />
              </div>

              {/* Widget Content - Better spacing on mobile */}
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-1 sm:mb-2">Master Any Subject in 30 Days</h3>
                <p className="text-xs sm:text-sm text-blue-100 mb-3 sm:mb-4">
                  Get our proven study framework used by top students worldwide. Transform your learning speed and retention today!
                </p>

                {/* CTA Button - More compact on mobile */}
                <a
                  href="#"
                  className="inline-flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-bold text-white transition-all duration-200 bg-orange-500 border-0 rounded-md hover:bg-orange-600 shadow-lg"
                >
                  GET FREE GUIDE
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Image (spans 2 columns) - Hidden on mobile screens */}
          <div className="hidden sm:block mt-8 lg:mt-0 lg:col-span-2 relative">
            <div className="relative">
              <img
                className="w-full h-auto rounded-lg"
                src="/images/hero-person.png"
                alt="Successful Student"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'http://cima.wuaze.com/wp-content/uploads/2022/11/Image-2.png';
                }}
              />
            </div>
          </div>
        </div>

        {/* Stats Section - Adjusted for mobile */}
        <div className="mt-10 sm:mt-16 grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 text-center border-t border-blue-500 pt-6 sm:pt-8">
          <div className="p-2 sm:p-4">
            <p className="text-2xl sm:text-3xl font-bold text-white">10K+</p>
            <p className="text-xs sm:text-sm text-blue-200">Active Learners</p>
          </div>
          <div className="p-2 sm:p-4">
            <p className="text-2xl sm:text-3xl font-bold text-white">800+</p>
            <p className="text-xs sm:text-sm text-blue-200">Expert Tutors</p>
          </div>
          <div className="p-2 sm:p-4">
            <p className="text-2xl sm:text-3xl font-bold text-white">50+</p>
            <p className="text-xs sm:text-sm text-blue-200">Course Categories</p>
          </div>
          <div className="p-2 sm:p-4">
            <p className="text-2xl sm:text-3xl font-bold text-white">95%</p>
            <p className="text-xs sm:text-sm text-blue-200">Student Satisfaction</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
