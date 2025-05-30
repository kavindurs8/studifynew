import React from "react";

const Footer = () => {
  return (
    <section className="py-10 bg-gray-50 sm:pt-16 lg:pt-24">
      <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
        <div className="grid grid-cols-2 md:col-span-3 lg:grid-cols-6 gap-y-16 gap-x-12">
          {/* Logo & Description */}
          <div className="col-span-2 md:col-span-3 lg:col-span-2 lg:pr-8">
            <img
              className="w-auto h-9"
              src="https://cimacleaners.com.au/wp-content/uploads/2025/05/10-scaled.png"
              alt="Logo"
            />
            <p className="text-base leading-relaxed text-gray-600 mt-7">
              Scoreness is a trusted rating and review platform where users evaluate and compare both physical businesses and online services.
            </p>
            <ul className="flex items-center space-x-3 mt-9">
              {[
                // Twitter
                <svg key="twitter" className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.633 7.997c.013.175..."></path>
                </svg>,
                // Facebook
                <svg key="facebook" className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M13.397 20.997v-8.196..."></path>
                </svg>,
                // Instagram
                <svg key="instagram" className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.999 7.377a4.623 4.623..."></path>
                  <circle cx="16.806" cy="7.207" r="1.078"></circle>
                  <path d="M20.533 6.111A4.605..."></path>
                </svg>,
                // GitHub
                <svg key="github" className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12.026 2c-5.509 0-9.974..."
                  ></path>
                </svg>
              ].map((icon, index) => (
                <li key={index}>
                  <a
                    href="#"
                    className="flex items-center justify-center text-white transition-all duration-200 bg-gray-800 rounded-full w-7 h-7 hover:bg-blue-600 focus:bg-blue-600"
                  >
                    {icon}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Scoreness Links */}
          <div>
            <p className="text-sm font-semibold tracking-widest text-gray-400 uppercase">
              Scoreness
            </p>
            <ul className="mt-6 space-y-4">
              <li><a href="/categories" className="flex text-base text-black hover:text-blue-600">Categories</a></li>
              <li><a href="/login" className="flex text-base text-black hover:text-blue-600">Sign-Up</a></li>
              <li><a href="/" className="flex text-base text-black hover:text-blue-600">For Customer</a></li>
              <li><a href="/register" className="flex text-base text-black hover:text-blue-600">For Business</a></li>
            </ul>
          </div>

          {/* Help Links */}
          <div>
            <p className="text-sm font-semibold tracking-widest text-gray-400 uppercase">Help</p>
            <ul className="mt-6 space-y-4">
              <li><a href="/contact" className="flex text-base text-black hover:text-blue-600">Contact Us</a></li>
              <li><a href="/help" className="flex text-base text-black hover:text-blue-600">Get Help</a></li>
              <li><a href="/terms" className="flex text-base text-black hover:text-blue-600">Terms & Conditions</a></li>
              <li><a href="/privacy" className="flex text-base text-black hover:text-blue-600">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="col-span-2 md:col-span-1 lg:col-span-2 lg:pl-8">
            <p className="text-sm font-semibold tracking-widest text-gray-400 uppercase">Subscribe to newsletter</p>
            <form action="#" method="POST" className="mt-6">
              <label htmlFor="email" className="sr-only">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                className="block w-full p-4 text-black placeholder-gray-500 bg-white border border-gray-200 rounded-md focus:outline-none focus:border-blue-600"
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center px-6 py-4 mt-3 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Footer Bottom */}
        <hr className="mt-16 mb-10 border-gray-200" />
        <p className="text-sm text-center text-gray-600">
          © Copyright 2025, All Rights Reserved by Scoreness – Developed By Code Burg Technologies
        </p>
      </div>
    </section>
  );
};

export default Footer;
