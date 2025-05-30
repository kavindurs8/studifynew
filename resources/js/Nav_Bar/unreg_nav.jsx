import { useState } from 'react';
import {
  FaEdit,
  FaThLarge,
  FaUniversity,
  FaUtensils,
  FaShoppingBag,
  FaChartLine,
  FaStar,
  FaUser,
  FaStore
} from 'react-icons/fa';
import { Link } from '@inertiajs/react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  return (
    <header className="pb-6 bg-white lg:pb-0 relative">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Top Bar */}
        <div className="hidden lg:flex items-center justify-end space-x-6 py-2 border-b border-gray-100">
          <Link href="/privacy-policy" className="text-sm text-gray-600 hover:text-blue-600">Privacy & Policy</Link>
          <Link href="/terms-conditions" className="text-sm text-gray-600 hover:text-blue-600">Terms & Conditions</Link>
          <Link href="/contact-us" className="text-sm text-gray-600 hover:text-blue-600">Contact</Link>
        </div>

        <nav className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center space-x-2">
              <img className="w-auto h-8 lg:h-10" src="https://cimacleaners.com.au/wp-content/uploads/2025/05/10-scaled.png" alt="Logo" />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:ml-auto lg:space-x-6">
            <Link href="/review" className="flex items-center space-x-2 text-base font-medium text-black hover:text-blue-600">
              <FaEdit />
              <span>Write a Review</span>
            </Link>

            {/* Categories Dropdown */}
            <div className="relative group">
              <button className="flex items-center space-x-2 text-base font-medium text-black transition-all duration-200 hover:text-blue-600">
                <FaThLarge />
                <span>Categories</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute left-0 z-50 w-[500px] p-6 mt-4 bg-white border border-gray-100 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-in-out">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 uppercase mb-4">Popular Categories</h3>
                    <ul className="space-y-3">
                      <li>
                        <Link href="/category/banks" className="flex items-center text-gray-600 hover:text-blue-600">
                          <FaUniversity className="w-5 h-5 mr-3 text-blue-600" /> Banks & Finance
                        </Link>
                      </li>
                      <li>
                        <Link href="/category/restaurants" className="flex items-center text-gray-600 hover:text-blue-600">
                          <FaUtensils className="w-5 h-5 mr-3 text-blue-600" /> Restaurants
                        </Link>
                      </li>
                      <li>
                        <Link href="/category/shopping" className="flex items-center text-gray-600 hover:text-blue-600">
                          <FaShoppingBag className="w-5 h-5 mr-3 text-blue-600" /> Shopping
                        </Link>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 uppercase mb-4">Browse By</h3>
                    <ul className="space-y-3">
                      <li>
                        <Link href="/categories/trending" className="flex items-center text-gray-600 hover:text-blue-600">
                          <FaChartLine className="w-5 h-5 mr-3 text-blue-600" /> Trending Now
                        </Link>
                      </li>
                      <li>
                        <Link href="/categories/new" className="flex items-center text-gray-600 hover:text-blue-600">
                          <FaStar className="w-5 h-5 mr-3 text-blue-600" /> New Additions
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <Link href="/login" className="flex items-center space-x-2 text-base font-medium text-black hover:text-blue-600">
              <FaUser />
              <span>Sign in</span>
            </Link>

            <Link href="/teacher/home" className="inline-flex items-center px-6 py-3 text-base font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors">
              <FaStore className="mr-2" /> For Instructors
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="inline-flex p-2 text-black transition-all duration-200 rounded-md lg:hidden focus:bg-gray-100 hover:bg-gray-100"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8h16M4 16h16" />
              </svg>
            )}
          </button>
        </nav>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav className="pt-4 pb-6 bg-white border border-gray-200 rounded-md shadow-md lg:hidden">
            <div className="flow-root">
              <div className="flex flex-col px-6 -my-2 space-y-1">
                <div className="py-2">
                  <button onClick={() => setIsCategoryOpen(!isCategoryOpen)} className="flex items-center justify-between w-full text-base font-medium text-black">
                    <span>Categories</span>
                    <svg className={`w-4 h-4 transform transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {isCategoryOpen && (
                    <div className="mt-2 space-y-2 pl-4">
                      <Link href="/category/banks" className="flex items-center py-2 text-sm text-gray-700 hover:text-blue-600">
                        <FaUniversity className="w-4 h-4 mr-3 text-blue-600" /> Banks & Finance
                      </Link>
                    </div>
                  )}
                </div>

                <Link href="/review" className="py-2 text-base font-medium text-black hover:text-blue-600">Write a Review</Link>
                <Link href="/login" className="py-2 text-base font-medium text-black hover:text-blue-600">Sign in</Link>
              </div>
            </div>

            <div className="px-6 mt-6">
              <Link href="/teacher/home" className="inline-flex justify-center w-full px-4 py-3 text-base font-semibold text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700">
                For Instructors
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
