"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

export default function Dashboard() {
  const navigate = useNavigate()
  const [sessions, setSessions] = useState([])
  const [analytics, setAnalytics] = useState({
    totalSessions: 0,
    averageScore: 0,
    totalTime: 0,
    bestScore: 0,
    recentImprovement: 0,
    sessionsByType: { behavioral: 0, hr: 0, technical: 0 }
  })
  const [loading, setLoading] = useState(true)
  const [showNewSession, setShowNewSession] = useState(false)
  const [selectedType, setSelectedType] = useState("behavioral")
  const [resume, setResume] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [resumeAnalysis, setResumeAnalysis] = useState(null)

  useEffect(() => {
    fetchSessions()
  }, [])

  const fetchSessions = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5001"
      const response = await fetch(`${apiUrl}/api/sessions`)
      const data = await response.json()
      setSessions(data.sessions || [])
      setAnalytics(data.analytics || {
        totalSessions: 0,
        averageScore: 0,
        totalTime: 0,
        bestScore: 0,
        recentImprovement: 0,
        sessionsByType: { behavioral: 0, hr: 0, technical: 0 }
      })
    } catch (err) {
      console.error("Error fetching sessions:", err)
    } finally {
      setLoading(false)
    }
  }

  const generateSampleData = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5001"
      const response = await fetch(`${apiUrl}/api/sessions/generate-sample`, {
        method: "POST",
      })
      const data = await response.json()
      console.log("Sample data generated:", data)
      // Refresh sessions after generating sample data
      fetchSessions()
    } catch (err) {
      console.error("Error generating sample data:", err)
    }
  }

  const handleResumeUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const formData = new FormData()
    formData.append("resume", file)

    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5001"
      const response = await fetch(`${apiUrl}/api/resume/upload`, {
        method: "POST",
        body: formData,
      })
      const data = await response.json()
      setResume(file.name)
      setResumeAnalysis(data.analysis)
    } catch (err) {
      console.error("Error uploading resume:", err)
    } finally {
      setUploading(false)
    }
  }

  const startInterview = (type) => {
    localStorage.setItem("interviewType", type)
    navigate("/interview")
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome to InterviewPro!</p>
      </div>

      {/* Resume Upload Section */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <h2 className="text-xl font-semibold mb-6">Your Resume</h2>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <label className="flex items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary transition">
              <div className="text-center">
                <p className="font-medium">Upload PDF Resume</p>
                <p className="text-sm text-gray-600">Get personalized questions based on your experience</p>
              </div>
              <input type="file" accept=".pdf" onChange={handleResumeUpload} disabled={uploading} className="hidden" />
            </label>
          </div>
          {resume && (
            <div className="text-right">
              <p className="text-sm font-medium text-green-600">✓ {resume}</p>
              {resumeAnalysis && (
                <div className="mt-2 text-xs text-gray-600 space-y-1">
                  <p>Skills: {resumeAnalysis.skills?.slice(0, 3).join(", ")}</p>
                  <p>Experience: {resumeAnalysis.yearsExperience} years</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Start New Interview */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-12">
        <h2 className="text-xl font-semibold mb-6">Start New Interview</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              type: "behavioral",
              title: "Behavioral",
              desc: "Practice common behavioral questions about past experiences",
            },
            { type: "hr", title: "HR Round", desc: "Prepare for HR screening questions and general inquiries" },
            { type: "technical", title: "Technical", desc: "Answer domain-specific technical questions" },
          ].map((q) => (
            <button
              key={q.type}
              onClick={() => startInterview(q.type)}
              className="p-6 border-2 border-gray-200 rounded-lg hover:border-primary hover:shadow-lg transition text-left"
            >
              <h3 className="font-semibold mb-2">{q.title}</h3>
              <p className="text-sm text-gray-600">{q.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-sm">Total Sessions</p>
          <p className="text-3xl font-bold text-primary mt-2">{analytics.totalSessions}</p>
          <div className="mt-2 text-xs text-gray-500">
            <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-1"></span>
            Behavioral: {analytics.sessionsByType.behavioral} |
            <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-1 ml-1"></span>
            HR: {analytics.sessionsByType.hr} |
            <span className="inline-block w-2 h-2 bg-purple-500 rounded-full mr-1 ml-1"></span>
            Technical: {analytics.sessionsByType.technical}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-sm">Average Score</p>
          <p className="text-3xl font-bold text-primary mt-2">{analytics.averageScore}%</p>
          <div className="mt-2 text-xs">
            <span className={`font-medium ${analytics.recentImprovement >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {analytics.recentImprovement >= 0 ? '↗' : '↘'} {Math.abs(analytics.recentImprovement)}% from last session
            </span>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-sm">Total Time</p>
          <p className="text-3xl font-bold text-primary mt-2">{analytics.totalTime}m</p>
          <div className="mt-2 text-xs text-gray-500">
            Best Score: <span className="font-medium text-green-600">{analytics.bestScore}%</span>
          </div>
        </div>
      </div>

      {/* Generate Sample Data Button (for testing) */}
      {analytics.totalSessions === 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-blue-800 text-sm mb-2">No sessions found. Want to see the dashboard with sample data?</p>
          <button
            onClick={generateSampleData}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition"
          >
            Generate Sample Sessions
          </button>
        </div>
      )}

      {/* Previous Sessions */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Previous Sessions</h2>
          {sessions.length > 0 && (
            <div className="text-sm text-gray-600">
              Total: {sessions.length} sessions
            </div>
          )}
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2 text-gray-600">Loading sessions...</span>
          </div>
        ) : sessions.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-400 text-6xl mb-4">📊</div>
            <p className="text-gray-600 text-lg mb-2">No sessions yet</p>
            <p className="text-gray-500 text-sm">Start your first interview practice to see detailed analytics and progress tracking!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sessions.map((session, index) => (
              <div
                key={session._id}
                className="flex justify-between items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-3 h-3 rounded-full ${
                    session.type === 'behavioral' ? 'bg-blue-500' :
                    session.type === 'hr' ? 'bg-green-500' : 'bg-purple-500'
                  }`}></div>
                  <div>
                    <p className="font-semibold capitalize flex items-center gap-2">
                      {session.type} Interview
                      {index === 0 && <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Latest</span>}
                    </p>
                    <p className="text-sm text-gray-600">
                      {new Date(session.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-4">
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">{session.duration}min</span>
                    </div>
                    <div className={`text-lg font-bold px-3 py-1 rounded-full ${
                      session.score >= 90 ? 'bg-green-100 text-green-800' :
                      session.score >= 75 ? 'bg-yellow-100 text-yellow-800' :
                      session.score >= 60 ? 'bg-orange-100 text-orange-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {session.score}%
                    </div>
                  </div>
                  {session.feedback?.overall && (
                    <p className="text-xs text-gray-500 mt-1 max-w-xs truncate">
                      {session.feedback.overall}
                    </p>
                  )}
                </div>
              </div>
            ))}
            
            {/* Performance Trend */}
            {sessions.length >= 2 && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-800 mb-2">Performance Trend</h3>
                <div className="flex items-center gap-2 text-sm">
                  {analytics.recentImprovement >= 0 ? (
                    <>
                      <span className="text-green-600 font-medium">📈 Improving</span>
                      <span className="text-gray-600">+{analytics.recentImprovement}% since first session</span>
                    </>
                  ) : (
                    <>
                      <span className="text-orange-600 font-medium">📉 Room for improvement</span>
                      <span className="text-gray-600">{analytics.recentImprovement}% since first session</span>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
