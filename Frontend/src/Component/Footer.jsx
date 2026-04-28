import React from 'react';

const Footer = () => {
  return (
    <footer className="flex flex-col items-center justify-center w-full py-6 bg-gradient-to-r from-slate-100 via-blue-50 to-blue-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 text-gray-800 dark:text-gray-200 transition-colors duration-300">
      
      {/* Tagline */}
      <p className="mt-3 text-center text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-6 px-6 max-w-xl">
        A marketplace for students, by students. Sell smart, buy smarter 💼📱📚
      </p>

      {/* Footer Links */}
      <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-sm text-gray-700 dark:text-gray-300 font-medium">
        <a href="#" className="hover:text-blue-600 hover:underline transition duration-200 px-2">
          Brand Guidelines
        </a>
        <span className="hidden sm:inline h-4 w-px bg-gray-300 dark:bg-gray-600"></span>
        <a href="#" className="hover:text-blue-600 hover:underline transition duration-200 px-2">
          Privacy Policy
        </a>
        <span className="hidden sm:inline h-4 w-px bg-gray-300 dark:bg-gray-600"></span>
        <a href="#" className="hover:text-blue-600 hover:underline transition duration-200 px-2">
          Terms of Service
        </a>
      </div>

      {/* Copyright */}
      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-6">
        © {new Date().getFullYear()} MMMUT Buy & Sell. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
