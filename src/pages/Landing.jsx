"use client"

import { useNavigate } from "react-router-dom"

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className="space-y-20 py-20">
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 text-center space-y-8">
        <h1 className="text-5xl font-bold text-gray-900 leading-tight">
          Master Your Interviews with <span className="text-primary">Ready2Hire</span> Feedback
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Practice realistic mock interviews with real-time emotion detection, body language analysis, and personalized
          feedback based on your resume.
        </p>
        <button
          onClick={() => navigate("/dashboard")}
          className="px-8 py-4 bg-primary text-white text-lg font-semibold rounded-lg hover:bg-blue-600 transition"
        >
          Start Free Practice
        </button>
      </section>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose InterviewPro?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-primary">
            <h3 className="text-lg font-semibold mb-3">Real-time Feedback</h3>
            <p className="text-gray-600">
              Get instant analysis on eye contact, confidence, body language, and speaking pace during your practice
              sessions.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-primary">
            <h3 className="text-lg font-semibold mb-3">Resume Analysis</h3>
            <p className="text-gray-600">
              Upload your resume and receive personalized interview questions tailored to your skills and experience.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-primary">
            <h3 className="text-lg font-semibold mb-3">Multiple Question Types</h3>
            <p className="text-gray-600">
              Practice with HR questions, behavioral questions, and domain-specific technical questions for
              comprehensive preparation.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
