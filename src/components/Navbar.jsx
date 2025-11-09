"use client"

import { Link } from "react-router-dom"

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 cursor-pointer">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">I</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900">InterviewPro</h1>
        </Link>
        <div className="flex items-center gap-6">
          <Link
            to="/dashboard"
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </nav>
  )
}
