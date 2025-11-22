"use client"

import { Link } from "react-router-dom"
import { useState } from "react"

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200 relative">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-3 cursor-pointer group" onClick={closeMobileMenu}>
          <div className="w-10 h-10 bg-purple-800 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
            <span className="text-white font-bold text-lg">R</span>
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-purple-700 bg-clip-text text-transparent">
            Ready2Hire
          </h1>
        </Link>
        
        {/* Desktop menu */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            to="/"
            className="text-gray-700 hover:text-purple-700 font-medium transition-colors"
          >
            Home
          </Link>
          
          <Link
            to="/how-to-use"
            className="text-gray-700 hover:text-purple-700 font-medium transition-colors"
          >
            How to Use
          </Link>
         
          <Link
            to="/contact"
            className="text-gray-700 hover:text-purple-700 font-medium transition-colors"
          >
            Contact
          </Link>
          <Link
            to="/dashboard"
            className="px-6 py-2 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all font-medium"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button 
            onClick={toggleMobileMenu}
            className="text-gray-700 hover:text-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 rounded-lg p-1 transition-colors"
            aria-label="Toggle mobile menu"
          >
            <svg className={`w-6 h-6 transition-transform duration-200 ${isMobileMenuOpen ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
          onClick={closeMobileMenu}
        />
      )}

      {/* Mobile menu */}
      <div className={`md:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 transform transition-all duration-300 ease-in-out ${
        isMobileMenuOpen 
          ? 'translate-y-0 opacity-100 visible' 
          : '-translate-y-2 opacity-0 invisible'
      }`}>
        <div className="px-4 py-6 space-y-4">
          <Link
            to="/"
            onClick={closeMobileMenu}
            className="block text-gray-700 hover:text-purple-700 font-medium transition-colors py-2 px-4 rounded-lg hover:bg-purple-50"
          >
            Home
          </Link>
          
          <Link
            to="/how-to-use"
            onClick={closeMobileMenu}
            className="block text-gray-700 hover:text-purple-700 font-medium transition-colors py-2 px-4 rounded-lg hover:bg-purple-50"
          >
            How to Use
          </Link>
         
          <Link
            to="/contact"
            onClick={closeMobileMenu}
            className="block text-gray-700 hover:text-purple-700 font-medium transition-colors py-2 px-4 rounded-lg hover:bg-purple-50"
          >
            Contact
          </Link>
          
          <Link
            to="/dashboard"
            onClick={closeMobileMenu}
            className="block w-full text-center px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all font-medium mt-4"
          >
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  )
}
