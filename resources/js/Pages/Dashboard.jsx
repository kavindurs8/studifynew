import AppLayout from '@/Layouts/AppLayout';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const DashboardHeroSection = () => {
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
              EXPAND YOUR<br className="hidden md:block" />
              <span className="text-yellow-300">KNOWLEDGE</span><br className="hidden md:block" />
              TODAY!
            </h1>

            {/* Subheading */}
            <p className="mt-4 sm:mt-6 text-lg sm:text-xl leading-relaxed text-white">
              STUDIFY is your trusted learning platform where you can access thousands of courses and expand your skills.
            </p>

            {/* Search Bar with Autocomplete */}
            <div className="mt-6 sm:mt-8">
              <div className="relative w-full max-w-lg">
                <input
                  type="text"
                  placeholder="Search for courses..."
                  className="w-full py-3 sm:py-4 px-4 sm:px-5 pl-10 sm:pl-12 text-sm sm:text-base text-black placeholder-gray-500 bg-white border-0 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-white"
                />
                <div className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-blue-600">
                  <FontAwesomeIcon icon={faSearch} className="text-base sm:text-lg" />
                </div>
                <button
                  type="button"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-3 py-1 sm:px-4 sm:py-2 rounded-md text-sm hover:bg-blue-700 transition-colors"
                >
                  Search
                </button>
              </div>
            </div>

            {/* Stats Section */}
            <div className="mt-8 grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-white">10K+</p>
                <p className="text-sm text-blue-200">Courses</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">50K+</p>
                <p className="text-sm text-blue-200">Students</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">100+</p>
                <p className="text-sm text-blue-200">Instructors</p>
              </div>
            </div>
          </div>

          {/* Right Column: Image (spans 2 columns) */}
          <div className="hidden sm:block mt-8 lg:mt-0 lg:col-span-2 relative">
            <div className="relative">
              <img
                className="w-full h-auto rounded-lg"
                src="/images/hero-person.png"
                alt="Learning Expert"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'http://cima.wuaze.com/wp-content/uploads/2022/11/Image-2.png';
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default function Dashboard() {
    return (
        <AppLayout title="Dashboard - STUDIFY">
            <DashboardHeroSection />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h2 className="text-2xl font-bold mb-4">Welcome back!</h2>
                            <p>Continue your learning journey...</p>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
