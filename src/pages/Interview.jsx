"use client"

import { useState, useEffect, useRef } from "react"
import WebcamFeed from "../components/WebcamFeed"
import FeedbackPanel from "../components/FeedbackPanel"
import AIFeedbackPanel from "../components/AIFeedbackPanel"
import QuestionDisplay from "../components/QuestionDisplay"

export default function Interview({ user, onNavigate }) {
  const [questions, setQuestions] = useState([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [feedback, setFeedback] = useState(null)
  const [recording, setRecording] = useState(false)
  const [recordingStopped, setRecordingStopped] = useState(false)
  const [sessionStart, setSessionStart] = useState(null)
  const [emotionData, setEmotionData] = useState([])
  const [bodyLanguageScore, setBodyLanguageScore] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [sessionId, setSessionId] = useState(null)
  const [aiAnalysisData, setAiAnalysisData] = useState(null)
  const [aiRecommendations, setAiRecommendations] = useState([])
  const [realTimeScores, setRealTimeScores] = useState({
    eyeContact: 0,
    confidence: 0,
    engagement: 0
  })
  const [interviewCompleted, setInterviewCompleted] = useState(false)
  const [sessionAnswers, setSessionAnswers] = useState([])
  const [submittingSession, setSubmittingSession] = useState(false)
  const mediaRecorderRef = useRef(null)
  const chunksRef = useRef([])

  const interviewType = localStorage.getItem("interviewType") || "behavioral"

  useEffect(() => {
    // Generate session ID
    const newSessionId = `interview_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    setSessionId(newSessionId)
    
    fetchQuestions()
  }, [])

  const fetchQuestions = async () => {
    try {
      setLoading(true)
      setError(null)
      console.log(`🔍 Fetching questions for type: ${interviewType}`)
      
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5001"
      const token = localStorage.getItem("token")
      const response = await fetch(`${apiUrl}/api/questions?type=${interviewType}`)
      console.log("re2: ")
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('📝 Questions response:', data)
      
      if (data.success && data.questions && data.questions.length > 0) {
        setQuestions(data.questions)
        console.log(`✅ Loaded ${data.questions.length} questions`)
      } else {
        throw new Error('No questions received from server')
      }
    } catch (err) {
      console.error("❌ Error fetching questions:", err, data)
      setError(`Failed to load questions: ${err.message}`)
      
      // Fallback questions if API fails
      const fallbackQuestions = [
        {
          id: 'fallback-1',
          question: 'Tell me about yourself and your background.',
          type: interviewType,
          category: 'General'
        },
        {
          id: 'fallback-2', 
          question: 'What interests you about this role?',
          type: interviewType,
          category: 'Motivation'
        }
      ]
      setQuestions(fallbackQuestions)
      console.log('🔄 Using fallback questions')
    } finally {
      setLoading(false)
    }
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true })
      mediaRecorderRef.current = new MediaRecorder(stream)
      chunksRef.current = []

      mediaRecorderRef.current.ondataavailable = (e) => {
        chunksRef.current.push(e.data)
      }

      mediaRecorderRef.current.onstart = () => {
        setRecording(true)
        setSessionStart(Date.now())
        setEmotionData([])
      }

      mediaRecorderRef.current.start()
    } catch (err) {
      console.error("Error accessing webcam:", err)
    }
  }

  const stopRecording = async () => {
    return new Promise((resolve) => {
      mediaRecorderRef.current.onstop = async () => {
        setRecording(false)
        setRecordingStopped(true)
        const blob = new Blob(chunksRef.current, { type: "audio/webm" })
        await analyzeFeedback(blob)
        resolve()
      }
      mediaRecorderRef.current.stop()
    })
  }

  const analyzeFeedback = async (audioBlob) => {
    const formData = new FormData()
    formData.append("audio", audioBlob)
    formData.append("question", questions[currentQuestionIndex]?.text)
    formData.append("emotionData", JSON.stringify(emotionData))

    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5001"
      const token = localStorage.getItem("token")
      const response = await fetch(`${apiUrl}/api/analyze`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      })
      const data = await response.json()
      setFeedback(data)
    } catch (err) {
      console.error("Error analyzing feedback:", err)
    }
  }

  const handleEmotionDetected = (emotion) => {
    setEmotionData((prev) => [...prev, emotion])
  }

  const handleAIAnalysis = (analysisResult) => {
    console.log('🤖 AI Analysis received:', analysisResult)
    
    if (analysisResult.analysis) {
      setAiAnalysisData(analysisResult.analysis.data)
    }
    
    if (analysisResult.currentScores) {
      setRealTimeScores(analysisResult.currentScores)
    }
    
    if (analysisResult.recommendations) {
      setAiRecommendations(analysisResult.recommendations)
    }
  }

  const startNewAnalysis = () => {
    // Reset analysis data
    setAiAnalysisData(null)
    setAiRecommendations([])
    setRealTimeScores({
      eyeContact: 0,
      confidence: 0,
      engagement: 0
    })
    setEmotionData([])
    setFeedback(null)
    setRecordingStopped(false)
    
    // Generate new session ID
    const newSessionId = `interview_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    setSessionId(newSessionId)
    
    // Start recording immediately
    startRecording()
  }

  const continueExistingAnalysis = () => {
    // Keep existing analysis data and continue
    setRecordingStopped(false)
    startRecording()
  }

  const nextQuestion = async () => {
    // Save current question answer/feedback if available
    if (feedback) {
      setSessionAnswers(prev => [...prev, {
        questionId: questions[currentQuestionIndex]?._id,
        question: questions[currentQuestionIndex]?.text,
        feedback: feedback,
        emotionData: [...emotionData],
        timestamp: Date.now()
      }])
    }
    
    if (recording) {
      await stopRecording()
    }
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setFeedback(null)
      setRecordingStopped(false)
    } else {
      // All questions completed
      setInterviewCompleted(true)
      console.log('🎯 Interview completed! All questions answered.')
    }
  }

  const submitInterview = async () => {
    try {
      setSubmittingSession(true)
      const duration = Math.floor((Date.now() - sessionStart) / 60000) // duration in minutes
      
      // Calculate average scores from real-time analysis
      const averageScore = Math.round((realTimeScores.eyeContact + realTimeScores.confidence + realTimeScores.engagement) / 3)
      
      // Create comprehensive feedback
      const overallFeedback = {
        overall: `Completed ${questions.length} questions with ${averageScore}% average performance`,
        eyeContact: `Average eye contact: ${realTimeScores.eyeContact}%`,
        confidence: `Confidence level: ${realTimeScores.confidence}%`,
        engagement: `Engagement score: ${realTimeScores.engagement}%`,
        emotionAnalysis: emotionData.length > 0 ? `Detected ${emotionData.length} emotion changes` : 'Limited emotion data',
        sessionData: {
          questionsAnswered: sessionAnswers.length,
          totalQuestions: questions.length,
          interviewType: interviewType
        }
      }

      const sessionData = {
        type: interviewType,
        duration: duration || 1, // Ensure minimum duration
        score: Math.max(averageScore, 60), // Ensure minimum score of 60
        feedback: overallFeedback,
        answers: sessionAnswers,
        realTimeScores: realTimeScores,
        emotionData: emotionData
      }

      console.log('💾 Submitting session:', sessionData)

      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5001"
      const response = await fetch(`${apiUrl}/api/sessions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sessionData),
      })

      if (response.ok) {
        const result = await response.json()
        console.log('✅ Session saved successfully:', result)
        alert('Interview session saved successfully! Redirecting to dashboard...')
        
        // Reset interview state
        setInterviewCompleted(false)
        setSessionAnswers([])
        setEmotionData([])
        setCurrentQuestionIndex(0)
        
        // Navigate to dashboard
        if (onNavigate) {
          onNavigate("dashboard")
        } else {
          window.location.href = '/dashboard'
        }
      } else {
        const error = await response.json()
        console.error('❌ Error saving session:', error)
        alert('Error saving session. Please try again.')
      }
    } catch (err) {
      console.error("❌ Error submitting interview:", err)
      alert('Error submitting interview. Please check your connection and try again.')
    } finally {
      setSubmittingSession(false)
    }
  }

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-lg">Loading {interviewType} questions...</p>
          <p className="text-sm text-gray-600 mt-2">Preparing your interview session</p>
        </div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold mb-2">Unable to Load Questions</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="space-x-4">
            <button 
              onClick={fetchQuestions}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Try Again
            </button>
            <button 
              onClick={() => onNavigate("dashboard")}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Show empty state
  if (!questions.length) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="text-gray-400 text-6xl mb-4">📝</div>
          <h2 className="text-xl font-semibold mb-2">No Questions Available</h2>
          <p className="text-gray-600 mb-4">We couldn't find any {interviewType} questions.</p>
          <button 
            onClick={() => onNavigate("dashboard")}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid lg:grid-cols-4 gap-6">
        {/* Webcam and Question */}
        <div className="lg:col-span-2 space-y-6">
          <QuestionDisplay question={questions[currentQuestionIndex]} />
          <WebcamFeed 
            recording={recording} 
            onEmotionDetected={handleAIAnalysis} 
            sessionId={sessionId}
          />

          <div className="flex gap-4">
            {!recording && !recordingStopped && !interviewCompleted && (
              <button
                onClick={startRecording}
                className="flex-1 py-3 rounded-lg bg-primary text-white font-semibold hover:bg-blue-600 transition"
              >
                Start Recording
              </button>
            )}
            
            {recording && !interviewCompleted && (
              <button
                onClick={stopRecording}
                className="flex-1 py-3 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-700 transition"
              >
                Stop Recording
              </button>
            )}
            
            {!recording && recordingStopped && !interviewCompleted && (
              <>
                <button
                  onClick={startNewAnalysis}
                  className="flex-1 py-3 rounded-lg bg-green-500 text-white font-semibold hover:bg-green-600 transition"
                >
                  🔄 Start New Analysis
                </button>
                <button
                  onClick={continueExistingAnalysis}
                  className="flex-1 py-3 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600 transition"
                >
                  ▶️ Continue Analysis
                </button>
              </>
            )}
            
            {!interviewCompleted && (
              <button
                onClick={nextQuestion}
                disabled={recording}
                className="flex-1 py-3 rounded-lg bg-gray-600 text-white font-semibold hover:bg-gray-700 transition disabled:opacity-50"
              >
                {currentQuestionIndex === questions.length - 1 ? 'Complete Interview' : 'Next Question'} ({currentQuestionIndex + 1}/{questions.length})
              </button>
            )}

            {/* Interview Completed State */}
            {interviewCompleted && (
              <div className="w-full">
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-4">
                  <div className="flex items-center mb-3">
                    <div className="text-green-600 text-2xl mr-3">🎉</div>
                    <div>
                      <h3 className="text-lg font-semibold text-green-800">Interview Completed!</h3>
                      <p className="text-green-700 text-sm">You have successfully answered all {questions.length} questions.</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                    <div className="text-center p-3 bg-white rounded border">
                      <div className="font-semibold text-blue-600">{realTimeScores.eyeContact}%</div>
                      <div className="text-gray-600">Eye Contact</div>
                    </div>
                    <div className="text-center p-3 bg-white rounded border">
                      <div className="font-semibold text-green-600">{realTimeScores.confidence}%</div>
                      <div className="text-gray-600">Confidence</div>
                    </div>
                    <div className="text-center p-3 bg-white rounded border">
                      <div className="font-semibold text-purple-600">{realTimeScores.engagement}%</div>
                      <div className="text-gray-600">Engagement</div>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={submitInterview}
                    disabled={submittingSession}
                    className="flex-1 py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submittingSession ? (
                      <>
                        <span className="inline-block animate-spin mr-2">⏳</span>
                        Saving Session...
                      </>
                    ) : (
                      <>
                        💾 Submit Interview & Go to Dashboard
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={() => {
                      setInterviewCompleted(false)
                      setCurrentQuestionIndex(0)
                      setSessionAnswers([])
                      setFeedback(null)
                      setRecordingStopped(false)
                    }}
                    disabled={submittingSession}
                    className="px-6 py-3 rounded-lg bg-gray-500 text-white font-semibold hover:bg-gray-600 transition disabled:opacity-50"
                  >
                    🔄 Restart
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* AI Feedback Panel */}
        <div className="lg:col-span-1">
          <AIFeedbackPanel 
            analysisData={aiAnalysisData}
            recommendations={aiRecommendations}
            realTimeScores={realTimeScores}
          />
        </div>

        {/* Traditional Feedback Panel */}
        <div className="lg:col-span-1">
          <FeedbackPanel feedback={feedback} emotionData={emotionData} />
        </div>
      </div>
    </div>
  )
}
