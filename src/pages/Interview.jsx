"use client"

import { useState, useEffect, useRef } from "react"
import WebcamFeed from "../components/WebcamFeed"
import FeedbackPanel from "../components/FeedbackPanel"
import AIFeedbackPanel from "../components/AIFeedbackPanel"
import QuestionDisplay from "../components/QuestionDisplay"
import hark from "hark" // NEW: Speech detection library

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
  const [scoreHistory, setScoreHistory] = useState([])
  const [lastDetectionTime, setLastDetectionTime] = useState(Date.now())
  const [userPresent, setUserPresent] = useState(true)
  const [faceDetected, setFaceDetected] = useState(false) // NEW: Track actual face detection
  const [lastSpeechTime, setLastSpeechTime] = useState(Date.now())
  const [isSpeaking, setIsSpeaking] = useState(false) // NEW: Track actual speech
  const [showSpeakAlert, setShowSpeakAlert] = useState(false)
  const [silenceDuration, setSilenceDuration] = useState(0)
  const [interviewCompleted, setInterviewCompleted] = useState(false)
  const [sessionAnswers, setSessionAnswers] = useState([])
  const [submittingSession, setSubmittingSession] = useState(false)
  
  const mediaRecorderRef = useRef(null)
  const chunksRef = useRef([])
  const speechEventsRef = useRef(null) // NEW: Speech detection reference
  const audioStreamRef = useRef(null) // NEW: Audio stream reference

  const interviewType = localStorage.getItem("interviewType") || "behavioral"

  useEffect(() => {
    // Generate session ID
    const newSessionId = `interview_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    setSessionId(newSessionId)
    
    fetchQuestions()
    
    return () => {
      // Cleanup speech detection on unmount
      if (speechEventsRef.current) {
        speechEventsRef.current.stop()
      }
      if (audioStreamRef.current) {
        audioStreamRef.current.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  const fetchQuestions = async () => {
    try {
      setLoading(true)
      setError(null)
      console.log(`🔍 Fetching questions for type: ${interviewType}`)
      
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5001"
      const response = await fetch(`${apiUrl}/api/questions?type=${interviewType}`)
      
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
      console.error("❌ Error fetching questions:", err)
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

  // NEW: Setup speech detection using hark
  const setupSpeechDetection = (stream) => {
    try {
      const speechEvents = hark(stream, {
        threshold: -50, // Audio threshold
        interval: 100    // Check every 100ms
      })

      speechEvents.on('speaking', () => {
        console.log('🗣️ User started speaking')
        setIsSpeaking(true)
        setLastSpeechTime(Date.now())
        setSilenceDuration(0)
        setShowSpeakAlert(false)
      })

      speechEvents.on('stopped_speaking', () => {
        console.log('🔇 User stopped speaking')
        setIsSpeaking(false)
      })

      speechEventsRef.current = speechEvents
      console.log('✅ Speech detection setup complete')
    } catch (err) {
      console.error('❌ Error setting up speech detection:', err)
    }
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true })
      audioStreamRef.current = stream
      
      // NEW: Setup speech detection
      setupSpeechDetection(stream)
      
      mediaRecorderRef.current = new MediaRecorder(stream)
      chunksRef.current = []

      mediaRecorderRef.current.ondataavailable = (e) => {
        chunksRef.current.push(e.data)
      }

      mediaRecorderRef.current.onstart = () => {
        setRecording(true)
        setSessionStart(Date.now())
        setEmotionData([])
        setLastSpeechTime(Date.now())
        setIsSpeaking(false)
        setSilenceDuration(0)
        setShowSpeakAlert(false)
      }

      mediaRecorderRef.current.start()
    } catch (err) {
      console.error("Error accessing webcam:", err)
      alert("Could not access camera/microphone. Please check permissions.")
    }
  }

  const stopRecording = async () => {
    return new Promise((resolve) => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.onstop = async () => {
          setRecording(false)
          setRecordingStopped(true)
          
          // Stop speech detection
          if (speechEventsRef.current) {
            speechEventsRef.current.stop()
            speechEventsRef.current = null
          }
          
          // Stop audio stream
          if (audioStreamRef.current) {
            audioStreamRef.current.getTracks().forEach(track => track.stop())
            audioStreamRef.current = null
          }
          
          const blob = new Blob(chunksRef.current, { type: "audio/webm" })
          await analyzeFeedback(blob)
          resolve()
        }
        mediaRecorderRef.current.stop()
      } else {
        setRecording(false)
        setRecordingStopped(true)
        resolve()
      }
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

  // IMPROVED: Better AI analysis handling
  const handleAIAnalysis = (analysisResult) => {
    console.log('🤖 AI Analysis received:', analysisResult)
    
    const currentTime = Date.now()
    
    // IMPROVED: Only update if face is actually detected
    if (analysisResult.faceDetected === true) {
      setFaceDetected(true)
      setLastDetectionTime(currentTime)
      setUserPresent(true)
      
      if (analysisResult.analysis) {
        setAiAnalysisData(analysisResult.analysis.data)
      }
      
      // IMPROVED: Only update scores when face is present
      if (analysisResult.currentScores) {
        const updatedScores = {
          eyeContact: Math.min(100, analysisResult.currentScores.eyeContact || 0),
          confidence: Math.min(100, analysisResult.currentScores.confidence || 0),
          engagement: Math.min(100, analysisResult.currentScores.engagement || 0)
        }
        
        setRealTimeScores(updatedScores)
        
        // Store score with speech and presence data
        setScoreHistory(prev => [...prev, {
          ...updatedScores,
          timestamp: currentTime,
          userPresent: true,
          faceDetected: true,
          speechActive: isSpeaking
        }])
      }
      
      if (analysisResult.recommendations) {
        setAiRecommendations(analysisResult.recommendations)
      }
    } else {
      // Face NOT detected
      setFaceDetected(false)
      console.log('👁️ No face detected in frame')
    }
  }

  // IMPROVED: Cleaner score decay and monitoring
  useEffect(() => {
    if (!recording) return

    const monitorInterval = setInterval(() => {
      const now = Date.now()
      const timeSinceLastDetection = now - lastDetectionTime
      const timeSinceLastSpeech = now - lastSpeechTime
      
      // Update silence duration
      const currentSilence = Math.floor(timeSinceLastSpeech / 1000)
      setSilenceDuration(currentSilence)
      
      // Show "Please speak now" alert after 30 seconds of silence
      if (currentSilence > 30 && !isSpeaking && !showSpeakAlert) {
        setShowSpeakAlert(true)
        console.log('⚠️ User has been silent for 30+ seconds')
      }
      
      // FIXED: Auto-skip question after 3 minutes (180 seconds) of silence
      if (currentSilence > 180 && !interviewCompleted) {
        console.log('⏭️ Auto-skipping question due to 3 minutes of silence')
        setShowSpeakAlert(false)
        nextQuestion()
        return
      }
      
      // IMPROVED: Decay scores when face NOT detected (user away from camera)
      if (timeSinceLastDetection > 2000 && faceDetected) {
        setFaceDetected(false)
        setUserPresent(false)
        console.log('👤 User moved away from camera')
      }
      
      // Apply decay when user is not present
      if (!faceDetected && userPresent === false) {
        setRealTimeScores(prev => {
          const decayRate = 0.95 // 5% decrease per second
          
          const newScores = {
            eyeContact: Math.max(0, Math.floor(prev.eyeContact * decayRate)),
            confidence: Math.max(0, Math.floor(prev.confidence * decayRate)),
            engagement: Math.max(0, Math.floor(prev.engagement * decayRate))
          }
          
          // Store decreased score in history
          setScoreHistory(prevHistory => [...prevHistory, {
            ...newScores,
            timestamp: now,
            userPresent: false,
            faceDetected: false,
            speechActive: isSpeaking
          }])
          
          return newScores
        })
      }
      
      // Decay engagement if not speaking for long periods
      if (currentSilence > 60 && faceDetected) {
        setRealTimeScores(prev => ({
          ...prev,
          engagement: Math.max(0, Math.floor(prev.engagement * 0.98))
        }))
      }
      
    }, 1000) // Check every second
    
    return () => clearInterval(monitorInterval)
  }, [recording, lastDetectionTime, lastSpeechTime, faceDetected, userPresent, isSpeaking, showSpeakAlert, interviewCompleted])

  const startNewAnalysis = () => {
    // Reset analysis data
    setAiAnalysisData(null)
    setAiRecommendations([])
    setRealTimeScores({
      eyeContact: 0,
      confidence: 0,
      engagement: 0
    })
    setScoreHistory([])
    setLastDetectionTime(Date.now())
    setLastSpeechTime(Date.now())
    setUserPresent(true)
    setFaceDetected(false)
    setIsSpeaking(false)
    setShowSpeakAlert(false)
    setSilenceDuration(0)
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
    if (feedback || scoreHistory.length > 0) {
      const questionScores = calculateAverageScores()
      setSessionAnswers(prev => [...prev, {
        questionId: questions[currentQuestionIndex]?._id,
        question: questions[currentQuestionIndex]?.text,
        feedback: feedback,
        scores: questionScores,
        emotionData: [...emotionData],
        timestamp: Date.now(),
        silenceDuration: silenceDuration
      }])
    }
    
    if (recording) {
      await stopRecording()
    }
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setFeedback(null)
      setRecordingStopped(false)
      setScoreHistory([]) // Reset for new question
      setEmotionData([])
      setLastSpeechTime(Date.now())
      setSilenceDuration(0)
      setShowSpeakAlert(false)
    } else {
      
      setInterviewCompleted(true)
      console.log('🎯 Interview completed! All questions answered.')
    }
  }

  // IMPROVED: Calculate average scores from score history
  const calculateAverageScores = () => {
    if (scoreHistory.length === 0) {
      return { eyeContact: 0, confidence: 0, engagement: 0 }
    }
    
    // Only count scores when user was present and face detected
    const validScores = scoreHistory.filter(score => score.faceDetected && score.userPresent)
    
    if (validScores.length === 0) {
      return { eyeContact: 0, confidence: 0, engagement: 0 }
    }
    
    const totals = validScores.reduce((acc, score) => ({
      eyeContact: acc.eyeContact + score.eyeContact,
      confidence: acc.confidence + score.confidence,
      engagement: acc.engagement + score.engagement
    }), { eyeContact: 0, confidence: 0, engagement: 0 })
    
    return {
      eyeContact: Math.round(totals.eyeContact / validScores.length),
      confidence: Math.round(totals.confidence / validScores.length),
      engagement: Math.round(totals.engagement / validScores.length)
    }
  }

  const submitInterview = async () => {
    try {
      setSubmittingSession(true)
      const duration = Math.floor((Date.now() - sessionStart) / 60000) // duration in minutes
      
      const averageScores = calculateAverageScores()
      const averageScore = Math.round((averageScores.eyeContact + averageScores.confidence + averageScores.engagement) / 3)
      
      // Create comprehensive feedback
      const overallFeedback = {
        overall: `Completed ${questions.length} questions with ${averageScore}% average performance`,
        eyeContact: `Average eye contact: ${averageScores.eyeContact}% (Current: ${realTimeScores.eyeContact}%)`,
        confidence: `Average confidence level: ${averageScores.confidence}% (Current: ${realTimeScores.confidence}%)`,
        engagement: `Average engagement score: ${averageScores.engagement}% (Current: ${realTimeScores.engagement}%)`,
        emotionAnalysis: emotionData.length > 0 ? `Detected ${emotionData.length} emotion changes` : 'Limited emotion data',
        speechAnalysis: `Total silence duration: ${Math.floor(silenceDuration / 60)} minutes`,
        sessionData: {
          questionsAnswered: sessionAnswers.length,
          totalQuestions: questions.length,
          interviewType: interviewType,
          totalDataPoints: scoreHistory.length,
          validDataPoints: scoreHistory.filter(s => s.faceDetected).length,
          sessionDuration: duration
        }
      }

      const sessionData = {
        type: interviewType,
        duration: duration || 1,
        score: Math.max(averageScore, 60),
        feedback: overallFeedback,
        answers: sessionAnswers,
        realTimeScores: realTimeScores,
        averageScores: averageScores,
        scoreHistory: scoreHistory,
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
        setScoreHistory([])
        
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
          
          {/* IMPROVED: Better status indicators */}
          <div className="bg-gray-100 rounded-lg p-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Face Detection:</span>
              <span className={`px-3 py-1 rounded-full ${faceDetected ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {faceDetected ? '✅ Detected' : '❌ Not Detected'}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Speech Activity:</span>
              <span className={`px-3 py-1 rounded-full ${isSpeaking ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-700'}`}>
                {isSpeaking ? '🗣️ Speaking' : '🔇 Silent'}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Silence Duration:</span>
              <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700">
                {silenceDuration}s / 180s
              </span>
            </div>
          </div>
          
          {/* Speech Alert */}
          {showSpeakAlert && recording && (
            <div className="bg-yellow-100 border border-yellow-400 rounded-lg p-4 mb-4 animate-pulse">
              <div className="flex items-center">
                <div className="text-yellow-600 text-xl mr-3">🗣️</div>
                <div>
                  <h4 className="font-semibold text-yellow-800">Please Speak Now</h4>
                  <p className="text-yellow-700 text-sm">
                    You've been silent for {silenceDuration} seconds. 
                    {silenceDuration > 150 ? ` Question will auto-skip in ${180 - silenceDuration} seconds.` : ' Please start speaking to continue.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-4">
            {!recording && !recordingStopped && !interviewCompleted && (
              <button
                onClick={startRecording}
                className="flex-1 py-3 rounded-lg text-white font-semibold transition"
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-1px)'
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.3)'
                }}
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
                      <div className="text-xs text-gray-400 mt-1">
                        {faceDetected ? '🟢 Detected' : '🔴 Not Detected'}
                      </div>
                    </div>
                    <div className="text-center p-3 bg-white rounded border">
                      <div className="font-semibold text-green-600">{realTimeScores.confidence}%</div>
                      <div className="text-gray-600">Confidence</div>
                      <div className="text-xs text-gray-400 mt-1">
                        {faceDetected ? '🟢 Detected' : '🔴 Not Detected'}
                      </div>
                    </div>
                    <div className="text-center p-3 bg-white rounded border">
                      <div className="font-semibold text-purple-600">{realTimeScores.engagement}%</div>
                      <div className="text-gray-600">Engagement</div>
                      <div className="text-xs text-gray-400 mt-1">
                        {isSpeaking ? '🗣️ Speaking' : '🔇 Silent'}
                      </div>
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
                      setScoreHistory([])
                      setLastDetectionTime(Date.now())
                      setLastSpeechTime(Date.now())
                      setUserPresent(true)
                      setFaceDetected(false)
                      setIsSpeaking(false)
                      setShowSpeakAlert(false)
                      setSilenceDuration(0)
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
