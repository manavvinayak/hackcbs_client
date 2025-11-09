"use client"

import { Link } from "react-router-dom"

export default function Navbar() {
  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-3 cursor-pointer group">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
            <span className="text-white font-bold text-lg">I</span>
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            InterviewPro
          </h1>
        </Link>
        
        <div className="hidden md:flex items-center gap-8">
          <Link
            to="/"
            className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
          >
            Home
          </Link>
          <Link
            to="/about"
            className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
          >
            About Us
          </Link>
          <Link
            to="/how-to-use"
            className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
          >
            How to Use
          </Link>
          <Link
            to="/contact"
            className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
          >
            Contact
          </Link>
          <Link
            to="/dashboard"
            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all font-medium"
          >
            Dashboard
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button className="text-gray-700 hover:text-blue-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  )
}
