import { useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import {
  FaEdit,
  FaThLarge,
  FaUniversity,
  FaUtensils,
  FaShoppingBag,
  FaChartLine,
  FaStar,
  FaUserCircle,
  FaCog,
  FaSignOutAlt,
  FaStore,
  FaExclamationTriangle
} from 'react-icons/fa';

const Header = ({ user }) => {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isCategoryMenuOpen, setCategoryMenuOpen] = useState(false);
  const [isProfileOpen, setProfileOpen] = useState(false);
  const { auth } = usePage().props;

  // Use auth.user instead of the prop to ensure we get the latest data
  const currentUser = auth?.user || user || { name: 'John Doe', email: 'john@example.com', profile_picture: null };
  const userInitial = currentUser.name.charAt(0).toUpperCase();
  const isEmailVerified = currentUser.email_verified_at !== null;

  // Handle logout function
  const handleLogout = () => {
    router.post(route('logout'), {}, {
      onSuccess: () => {
        console.log('Successfully logged out');
      },
      onError: (errors) => {
        console.error('Logout failed:', errors);
      }
    });
  };

  // Update the profile picture display logic
  const getProfilePictureUrl = () => {
    console.log('Current user:', currentUser); // Debug log
    console.log('Profile picture:', currentUser.profile_picture); // Debug log

    // First check the accessor
    if (currentUser.profile_image) {
      return currentUser.profile_image;
    }

    // Check for profile_picture field
    if (currentUser.profile_picture) {
      // If it's already a full URL, return as is
      if (currentUser.profile_picture.startsWith('http')) {
        return currentUser.profile_picture;
      }
      // If it starts with profile-pictures/, add storage prefix
      if (currentUser.profile_picture.startsWith('profile-pictures/')) {
        return `/storage/${currentUser.profile_picture}`;
      }
      // If it's just the filename, add the full path
      return `/storage/profile-pictures/${currentUser.profile_picture}`;
    }

    // Fallback to avatar
    if (currentUser.avatar) {
      return currentUser.avatar;
    }

    return null;
  };

  return (
    <header className="pb-6 bg-white lg:pb-0 relative">
      {/* Email Verification Banner */}
      {!isEmailVerified && (
        <div className="bg-yellow-50 border-b border-yellow-200">
          <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center">
                <FaExclamationTriangle className="w-5 h-5 text-yellow-600 mr-2" />
                <span className="text-sm text-yellow-800">
                  Please verify your email address to access all features.
                </span>
              </div>
              <Link
                href={route('verification.notice')}
                className="text-sm text-yellow-800 underline hover:text-yellow-900"
              >
                Verify Email
              </Link>
            </div>
          </div>
        </div>
      )}

      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="hidden lg:flex items-center justify-end space-x-6 py-2 border-b border-gray-100">
          <span className="text-sm text-gray-600">Privacy & Policy</span>
          <span className="text-sm text-gray-600">Terms & Conditions</span>
          <span className="text-sm text-gray-600">Contact</span>
        </div>

        <nav className="flex items-center justify-between h-16 lg:h-20">
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center space-x-2">
              <img
                className="w-auto h-8 lg:h-10"
                src="https://cimacleaners.com.au/wp-content/uploads/2025/05/10-scaled.png"
                alt="STUDIFY Logo"
              />
            </Link>
          </div>

          <div className="hidden lg:flex lg:items-center lg:ml-auto lg:space-x-6">
            <div className="flex items-center space-x-2 text-base font-medium text-black hover:text-blue-600 cursor-pointer">
              <FaEdit />
              <span>Write a Review</span>
            </div>

            <div className="relative group">
              <div className="flex items-center space-x-2 text-base font-medium text-black hover:text-blue-600 cursor-pointer">
                <FaThLarge />
                <span>Categories</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              <div className="absolute left-0 z-50 w-[500px] p-6 mt-4 bg-white border border-gray-100 rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 ease-in-out pointer-events-none group-hover:pointer-events-auto">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 uppercase mb-4">Popular Categories</h3>
                    <ul className="space-y-3">
                      <li className="flex items-center text-gray-600 hover:text-blue-600 cursor-pointer">
                        <FaUniversity className="w-5 h-5 mr-3 text-blue-600" /> Programming
                      </li>
                      <li className="flex items-center text-gray-600 hover:text-blue-600 cursor-pointer">
                        <FaUtensils className="w-5 h-5 mr-3 text-blue-600" /> Design
                      </li>
                      <li className="flex items-center text-gray-600 hover:text-blue-600 cursor-pointer">
                        <FaShoppingBag className="w-5 h-5 mr-3 text-blue-600" /> Business
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 uppercase mb-4">Browse By</h3>
                    <ul className="space-y-3">
                      <li className="flex items-center text-gray-600 hover:text-blue-600 cursor-pointer">
                        <FaChartLine className="w-5 h-5 mr-3 text-blue-600" /> Trending Now
                      </li>
                      <li className="flex items-center text-gray-600 hover:text-blue-600 cursor-pointer">
                        <FaStar className="w-5 h-5 mr-3 text-blue-600" /> New Additions
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <button
                onClick={() => setProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-3 hover:bg-gray-50 rounded-lg p-2 transition-colors"
              >
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200 relative">
                  {getProfilePictureUrl() ? (
                    <img
                      src={getProfilePictureUrl()}
                      alt="Profile"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.error('Failed to load profile picture:', getProfilePictureUrl());
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                      onLoad={() => {
                        console.log('Profile picture loaded successfully:', getProfilePictureUrl());
                      }}
                    />
                  ) : null}
                  <div className="w-full h-full flex items-center justify-center bg-blue-600 text-white text-xl font-bold" style={{display: getProfilePictureUrl() ? 'none' : 'flex'}}>
                    {userInitial}
                  </div>
                  {/* Verification status indicator */}
                  {isEmailVerified && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white">
                      <svg className="w-2 h-2 text-white ml-0.5 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
                <span className="text-base font-medium text-gray-700">{currentUser.name.split(' ')[0]}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 w-48 mt-2 py-2 bg-white border border-gray-100 rounded-lg shadow-lg z-50">
                  {!isEmailVerified && (
                    <>
                      <Link
                        href={route('verification.notice')}
                        className="block px-4 py-2 text-sm text-yellow-600 hover:bg-yellow-50"
                        onClick={() => setProfileOpen(false)}
                      >
                        <FaExclamationTriangle className="mr-2 inline" /> Verify Email
                      </Link>
                      <hr className="my-2 border-gray-200" />
                    </>
                  )}
                  <Link
                    href={route('profile.edit')}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setProfileOpen(false)}
                  >
                    <FaUserCircle className="mr-2 inline" /> Profile
                  </Link>
                  <Link
                    href={route('dashboard')}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setProfileOpen(false)}
                  >
                    <FaCog className="mr-2 inline" /> Dashboard
                  </Link>
                  <hr className="my-2 border-gray-200" />
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <FaSignOutAlt className="mr-2 inline" /> Sign out
                  </button>
                </div>
              )}
            </div>

            <Link
              href="/teacher/home"
              className="inline-flex items-center px-6 py-3 text-base font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
            >
              <FaStore className="mr-2" /> For Instructors
            </Link>
          </div>

          <button
            type="button"
            className="inline-flex p-2 text-black lg:hidden hover:bg-gray-100 rounded-md transition-colors"
            onClick={() => setMenuOpen(!isMenuOpen)}
          >
            <svg
              className={`w-6 h-6 ${isMenuOpen ? 'hidden' : 'block'}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8h16M4 16h16" />
            </svg>
            <svg
              className={`w-6 h-6 ${isMenuOpen ? 'block' : 'hidden'}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </nav>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav className="pt-4 pb-6 bg-white border border-gray-200 rounded-md shadow-md lg:hidden">
            <div className="flex flex-col px-6 space-y-4">
              <div className="flex items-center space-x-3 py-4 border-b border-gray-100">
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200 relative">
                  {getProfilePictureUrl() ? (
                    <img
                      src={getProfilePictureUrl()}
                      alt="Profile"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div className="w-full h-full flex items-center justify-center bg-blue-600 text-white text-xl font-bold" style={{display: getProfilePictureUrl() ? 'none' : 'flex'}}>
                    {userInitial}
                  </div>
                  {isEmailVerified && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white">
                      <svg className="w-2 h-2 text-white ml-0.5 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{currentUser.name}</p>
                  <p className="text-xs text-gray-500">{currentUser.email}</p>
                  {!isEmailVerified && (
                    <p className="text-xs text-yellow-600">Email not verified</p>
                  )}
                </div>
              </div>

              {!isEmailVerified && (
                <Link
                  href={route('verification.notice')}
                  className="flex items-center text-base font-medium text-yellow-600 hover:text-yellow-700"
                  onClick={() => setMenuOpen(false)}
                >
                  <FaExclamationTriangle className="mr-2" /> Verify Email
                </Link>
              )}

              <div className="flex items-center text-base font-medium text-black hover:text-blue-600">
                <FaEdit className="mr-2" /> Write a Review
              </div>

              <Link
                href={route('profile.edit')}
                className="flex items-center text-base font-medium text-gray-700 hover:text-blue-600"
                onClick={() => setMenuOpen(false)}
              >
                <FaUserCircle className="mr-2" /> Profile
              </Link>

              <Link
                href={route('dashboard')}
                className="flex items-center text-base font-medium text-gray-700 hover:text-blue-600"
                onClick={() => setMenuOpen(false)}
              >
                <FaCog className="mr-2" /> Dashboard
              </Link>

              <button
                onClick={handleLogout}
                className="flex items-center text-left text-base font-medium text-red-600 hover:text-red-700"
              >
                <FaSignOutAlt className="mr-2" /> Sign out
              </button>

              <Link
                href="/teacher/home"
                className="inline-flex justify-center w-full px-4 py-3 text-base font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700"
                onClick={() => setMenuOpen(false)}
              >
                <FaStore className="mr-2" /> For Instructors
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
