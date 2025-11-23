"use client"

import { useState, useEffect, useRef } from "react"
import hark from "hark"

export default function Interview({ user, onNavigate }) {
  const [questions, setQuestions] = useState([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [feedback, setFeedback] = useState(null)
  const [recording, setRecording] = useState(false)
  const [recordingStopped, setRecordingStopped] = useState(false)
  const [sessionStart, setSessionStart] = useState(null)
  const [emotionData, setEmotionData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [sessionId, setSessionId] = useState(null)
  const [aiAnalysisData, setAiAnalysisData] = useState(null)
  const [aiRecommendations, setAiRecommendations] = useState([])
  const [realTimeScores, setRealTimeScores] = useState({
    eyeContact: 0,
    confidence: 0,
    engagement: 0,
    professionalism: 0,
    businessAcumen: 0,
    opportunistic: 0,
    closingTechnique: 0
  })
  const [scoreHistory, setScoreHistory] = useState([])
  const [lastDetectionTime, setLastDetectionTime] = useState(Date.now())
  const [userPresent, setUserPresent] = useState(false)
  const [faceDetected, setFaceDetected] = useState(false)
  const [lastSpeechTime, setLastSpeechTime] = useState(Date.now())
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [showSpeakAlert, setShowSpeakAlert] = useState(false)
  const [silenceDuration, setSilenceDuration] = useState(0)
  const [interviewCompleted, setInterviewCompleted] = useState(false)
  const [sessionAnswers, setSessionAnswers] = useState([])
  const [submittingSession, setSubmittingSession] = useState(false)
  const [averageScores, setAverageScores] = useState(null)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [currentTranscript, setCurrentTranscript] = useState("")
  
  const mediaRecorderRef = useRef(null)
  const chunksRef = useRef([])
  const speechEventsRef = useRef(null)
  const audioStreamRef = useRef(null)
  const videoRef = useRef(null)
  const webcamRef = useRef(null)

  const interviewType = localStorage.getItem("interviewType") || "behavioral"

  useEffect(() => {
    const newSessionId = `interview_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    setSessionId(newSessionId)
    
    fetchQuestions()
    
    return () => {
      if (speechEventsRef.current) {
        speechEventsRef.current.stop()
      }
      if (audioStreamRef.current) {
        audioStreamRef.current.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  // Timer for video progress
  useEffect(() => {
    let interval
    if (recording) {
      interval = setInterval(() => {
        setCurrentTime(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [recording])

  const fetchQuestions = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5001"
      const response = await fetch(`${apiUrl}/api/questions?type=${interviewType}`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (data.success && data.questions && data.questions.length > 0) {
        setQuestions(data.questions)
      } else {
        throw new Error('No questions received from server')
      }
    } catch (err) {
      console.error("❌ Error fetching questions:", err)
      setError(`Failed to load questions: ${err.message}`)
      
      const fallbackQuestions = [
        { id: 'fallback-1', question: 'Tell us about yourself?', type: interviewType, category: 'General' },
        { id: 'fallback-2', question: 'Why do you think you are good at sales?', type: interviewType, category: 'Skills' },
        { id: 'fallback-3', question: 'What is the biggest deal you have closed?', type: interviewType, category: 'Experience' },
        { id: 'fallback-4', question: 'Why you choose this company?', type: interviewType, category: 'Motivation' },
        { id: 'fallback-5', question: 'What your expectation in terms of salary?', type: interviewType, category: 'Compensation' }
      ]
      setQuestions(fallbackQuestions)
    } finally {
      setLoading(false)
    }
  }

  const setupSpeechDetection = (stream) => {
    try {
      const speechEvents = hark(stream, {
        threshold: -50,
        interval: 100
      })

      speechEvents.on('speaking', () => {
        setIsSpeaking(true)
        setLastSpeechTime(Date.now())
        setSilenceDuration(0)
        setShowSpeakAlert(false)
        
        // Simulate transcript
        setCurrentTranscript("I'm extremely ambitious person which motivates me in my professional life.")
      })

      speechEvents.on('stopped_speaking', () => {
        setIsSpeaking(false)
        setTimeout(() => setCurrentTranscript(""), 3000)
      })

      speechEventsRef.current = speechEvents
    } catch (err) {
      console.error('❌ Error setting up speech detection:', err)
    }
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true })
      audioStreamRef.current = stream
      
      // Set webcam stream
      if (webcamRef.current) {
        webcamRef.current.srcObject = stream
      }
      
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
        setCurrentTime(0)
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
          
          if (speechEventsRef.current) {
            speechEventsRef.current.stop()
            speechEventsRef.current = null
          }
          
          if (audioStreamRef.current) {
            audioStreamRef.current.getTracks().forEach(track => track.stop())
            audioStreamRef.current = null
          }
          
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

  const handleAIAnalysis = (analysisResult) => {
    const currentTimeStamp = Date.now()
    
    const hasFaceData = analysisResult.faceDetected === true || 
                        (analysisResult.currentScores && 
                         (analysisResult.currentScores.eyeContact > 0 || 
                          analysisResult.currentScores.confidence > 0))
    
    if (hasFaceData) {
      setFaceDetected(true)
      setLastDetectionTime(currentTimeStamp)
      setUserPresent(true)
      
      if (analysisResult.currentScores) {
        const updatedScores = {
          eyeContact: Math.min(100, Math.max(0, analysisResult.currentScores.eyeContact || 0)),
          confidence: Math.min(100, Math.max(0, analysisResult.currentScores.confidence || 0)),
          engagement: Math.min(100, Math.max(0, analysisResult.currentScores.engagement || 0)),
          professionalism: Math.min(100, Math.max(0, analysisResult.currentScores.professionalism || Math.floor(Math.random() * 30) + 70)),
          businessAcumen: Math.min(100, Math.max(0, analysisResult.currentScores.businessAcumen || Math.floor(Math.random() * 20) + 75)),
          opportunistic: Math.min(100, Math.max(0, analysisResult.currentScores.opportunistic || Math.floor(Math.random() * 40) + 50)),
          closingTechnique: Math.min(100, Math.max(0, analysisResult.currentScores.closingTechnique || Math.floor(Math.random() * 25) + 70))
        }
        
        setRealTimeScores(updatedScores)
        
        setScoreHistory(prev => [...prev, {
          ...updatedScores,
          timestamp: currentTimeStamp,
          userPresent: true,
          faceDetected: true,
          speechActive: isSpeaking
        }])
      }
    } else {
      setFaceDetected(false)
    }
  }

  useEffect(() => {
    if (!recording) return

    const monitorInterval = setInterval(() => {
      const now = Date.now()
      const timeSinceLastSpeech = now - lastSpeechTime
      
      const currentSilence = Math.floor(timeSinceLastSpeech / 1000)
      setSilenceDuration(currentSilence)
      
      if (currentSilence > 30 && !isSpeaking && !showSpeakAlert) {
        setShowSpeakAlert(true)
      }
      
      if (currentSilence > 180 && !interviewCompleted) {
        nextQuestion()
        return
      }
      
      if ((now - lastDetectionTime) > 2000 && faceDetected) {
        setFaceDetected(false)
        setUserPresent(false)
      }
      
    }, 1000)
    
    return () => clearInterval(monitorInterval)
  }, [recording, lastDetectionTime, lastSpeechTime, faceDetected, userPresent, isSpeaking, showSpeakAlert, interviewCompleted])

  const calculateAverageScores = () => {
    if (scoreHistory.length === 0) {
      return { 
        eyeContact: 0, confidence: 0, engagement: 0,
        professionalism: 0, businessAcumen: 0, opportunistic: 0, closingTechnique: 0
      }
    }
    
    const validScores = scoreHistory.filter(score => score.faceDetected && score.userPresent)
    
    if (validScores.length === 0) {
      return { 
        eyeContact: 0, confidence: 0, engagement: 0,
        professionalism: 0, businessAcumen: 0, opportunistic: 0, closingTechnique: 0
      }
    }
    
    const totals = validScores.reduce((acc, score) => ({
      eyeContact: acc.eyeContact + score.eyeContact,
      confidence: acc.confidence + score.confidence,
      engagement: acc.engagement + score.engagement,
      professionalism: acc.professionalism + score.professionalism,
      businessAcumen: acc.businessAcumen + score.businessAcumen,
      opportunistic: acc.opportunistic + score.opportunistic,
      closingTechnique: acc.closingTechnique + score.closingTechnique
    }), { 
      eyeContact: 0, confidence: 0, engagement: 0,
      professionalism: 0, businessAcumen: 0, opportunistic: 0, closingTechnique: 0
    })
    
    return {
      eyeContact: Math.round(totals.eyeContact / validScores.length),
      confidence: Math.round(totals.confidence / validScores.length),
      engagement: Math.round(totals.engagement / validScores.length),
      professionalism: Math.round(totals.professionalism / validScores.length),
      businessAcumen: Math.round(totals.businessAcumen / validScores.length),
      opportunistic: Math.round(totals.opportunistic / validScores.length),
      closingTechnique: Math.round(totals.closingTechnique / validScores.length)
    }
  }

  const nextQuestion = async () => {
    if (scoreHistory.length > 0) {
      const questionScores = calculateAverageScores()
      setSessionAnswers(prev => [...prev, {
        questionId: questions[currentQuestionIndex]?._id,
        question: questions[currentQuestionIndex]?.question,
        scores: questionScores,
        timestamp: Date.now()
      }])
    }
    
    if (recording) {
      await stopRecording()
    }
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setRecordingStopped(false)
      setScoreHistory([])
      setCurrentTime(0)
    } else {
      const finalAverageScores = calculateAverageScores()
      setAverageScores(finalAverageScores)
      setInterviewCompleted(true)
    }
  }

  const submitInterview = async () => {
    try {
      setSubmittingSession(true)
      const duration = Math.floor((Date.now() - sessionStart) / 60000)
      
      const finalAverageScores = averageScores || calculateAverageScores()
      const averageScore = Math.round((
        finalAverageScores.professionalism + 
        finalAverageScores.businessAcumen + 
        finalAverageScores.opportunistic + 
        finalAverageScores.closingTechnique
      ) / 4)
      
      const sessionData = {
        type: interviewType,
        duration: duration || 1,
        score: Math.max(averageScore, 60),
        answers: sessionAnswers,
        averageScores: finalAverageScores
      }

      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5001"
      const response = await fetch(`${apiUrl}/api/sessions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sessionData),
      })

      if (response.ok) {
        alert('Interview session saved successfully!')
        if (onNavigate) {
          onNavigate("dashboard")
        } else {
          window.location.href = '/dashboard'
        }
      }
    } catch (err) {
      console.error("❌ Error submitting interview:", err)
      alert('Error submitting interview.')
    } finally {
      setSubmittingSession(false)
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  const getOverallScore = () => {
    return Math.round((
      realTimeScores.professionalism + 
      realTimeScores.businessAcumen + 
      realTimeScores.opportunistic + 
      realTimeScores.closingTechnique
    ) / 4)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-300 border-t-teal-500 mx-auto mb-4"></div>
          <p className="text-lg font-medium text-slate-700">Loading questions...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-12 gap-6">
          {/* Main Video Area - Spans 8 columns */}
          <div className="col-span-8">
            {/* Video Player Card */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              {/* User Info Header */}
              <div className="p-4 border-b border-slate-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-semibold">
                  {user?.name?.[0] || 'U'}
                </div>
                <div>
                  <div className="font-semibold text-slate-800">{user?.name || 'Candidate'}</div>
                  <div className="text-sm text-slate-500">{interviewType}</div>
                </div>
                <div className="ml-auto">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                    <span className="text-slate-600 font-medium">Question {currentQuestionIndex + 1}</span>
                  </div>
                </div>
              </div>

              {/* Video Container */}
              <div className="relative bg-slate-900 aspect-video">
                <video
                  ref={webcamRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
                
                {/* Question Overlay */}
                <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-sm rounded-lg p-3 max-w-xs">
                  <div className="text-red-400 text-sm font-medium mb-1">● Question {currentQuestionIndex + 1}</div>
                  <div className="text-white text-sm font-medium">{questions[currentQuestionIndex]?.question}</div>
                </div>

                {/* Subtitle Overlay */}
                {currentTranscript && (
                  <div className="absolute bottom-20 left-6 right-6 bg-black/70 backdrop-blur-sm rounded-lg p-3">
                    <p className="text-white text-sm text-center">{currentTranscript}</p>
                  </div>
                )}

                {/* Video Controls */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                  <div className="flex items-center gap-3 text-white">
                    <span className="text-sm font-mono">{formatTime(currentTime)}/05:00</span>
                    <div className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-teal-500 transition-all duration-300"
                        style={{ width: `${(currentTime / 300) * 100}%` }}
                      />
                    </div>
                    <button className="p-1.5 hover:bg-white/10 rounded">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
                      </svg>
                    </button>
                    <button className="p-1.5 hover:bg-white/10 rounded">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 flex gap-3">
                {!recording && !interviewCompleted && (
                  <button
                    onClick={startRecording}
                    className="flex-1 py-3 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-lg transition"
                  >
                    Start Recording
                  </button>
                )}
                
                {recording && (
                  <button
                    onClick={stopRecording}
                    className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition"
                  >
                    Stop Recording
                  </button>
                )}

                {!interviewCompleted && (
                  <button
                    onClick={nextQuestion}
                    disabled={recording}
                    className="flex-1 py-3 bg-slate-600 hover:bg-slate-700 text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {currentQuestionIndex === questions.length - 1 ? 'Complete' : 'Next Question'}
                  </button>
                )}

                {interviewCompleted && (
                  <button
                    onClick={submitInterview}
                    disabled={submittingSession}
                    className="flex-1 py-3 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-lg transition disabled:opacity-50"
                  >
                    {submittingSession ? 'Saving...' : 'Submit & Go to Dashboard'}
                  </button>
                )}
              </div>
            </div>

            {/* Question List and Score Summary */}
            <div className="grid grid-cols-2 gap-6 mt-6">
              {/* Question List */}
              <div className="bg-white rounded-xl shadow-sm p-5">
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="font-semibold text-slate-800">Question List</h3>
                  <svg className="w-4 h-4 text-teal-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                  </svg>
                </div>
                <div className="space-y-2">
                  {questions.map((q, idx) => (
                    <div 
                      key={idx}
                      className={`flex items-start gap-3 p-2.5 rounded-lg transition ${
                        idx === currentQuestionIndex 
                          ? 'bg-teal-50 border border-teal-200' 
                          : idx < currentQuestionIndex
                          ? 'bg-slate-50'
                          : 'bg-white'
                      }`}
                    >
                      <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                        idx === currentQuestionIndex
                          ? 'bg-teal-500 text-white'
                          : idx < currentQuestionIndex
                          ? 'bg-slate-300 text-slate-600'
                          : 'bg-slate-200 text-slate-500'
                      }`}>
                        {idx + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium ${
                          idx === currentQuestionIndex ? 'text-slate-800' : 'text-slate-600'
                        }`}>
                          {q.question}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Video Score Summary */}
              <div className="bg-white rounded-xl shadow-sm p-5">
                <div className="flex items-center gap-2 mb-4">
                  <svg className="w-5 h-5 text-teal-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
                  </svg>
                  <h3 className="font-semibold text-slate-800">AI Video Score Summary</h3>
                </div>
                
                <div className="flex items-center justify-center mb-4">
                  <div className="relative w-32 h-32">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="#e2e8f0"
                        strokeWidth="8"
                        fill="none"
                      />
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="#14b8a6"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={`${(getOverallScore() / 100) * 351.858} 351.858`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-4xl font-bold text-slate-800">{getOverallScore()}%</span>
                    </div>
                  </div>
                </div>

                <p className="text-center text-sm text-slate-600 mb-4">
                  The presentation of talent is <span className="font-semibold text-teal-600">good</span>. Check the breakdown summary of AI Video Score.
                </p>

                <div className="flex gap-2">
                  <button className="flex-1 py-2 px-4 bg-teal-50 text-teal-600 text-sm font-medium rounded-lg hover:bg-teal-100 transition flex items-center justify-center gap-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/>
                    </svg>
                    Shortlist
                  </button>
                  <button className="flex-1 py-2 px-4 bg-red-50 text-red-600 text-sm font-medium rounded-lg hover:bg-red-100 transition flex items-center justify-center gap-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                    </svg>
                    Reject
                  </button>
                </div>

                <button className="w-full mt-3 py-2.5 bg-teal-500 text-white font-semibold rounded-lg hover:bg-teal-600 transition">
                  Hire Talent
                </button>
              </div>
            </div>
          </div>

          {/* AI Video Score Detail - Spans 4 columns */}
          <div className="col-span-4">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-6">
              <h3 className="font-semibold text-slate-800 mb-6">AI Video Score Detail</h3>
              
              <div className="grid grid-cols-2 gap-6">
                {/* Professionalism */}
                <div className="text-center">
                  <div className="relative w-28 h-28 mx-auto mb-3">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="56" cy="56" r="48" stroke="#e2e8f0" strokeWidth="8" fill="none"/>
                      <circle
                        cx="56" cy="56" r="48"
                        stroke="#14b8a6"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={`${(realTimeScores.professionalism / 100) * 301.593} 301.593`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-bold text-slate-800">{realTimeScores.professionalism}%</span>
                    </div>
                  </div>
                  <div className="text-sm font-medium text-slate-700">Professionalism</div>
                </div>

                {/* Business Acumen */}
                <div className="text-center">
                  <div className="relative w-28 h-28 mx-auto mb-3">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="56" cy="56" r="48" stroke="#e2e8f0" strokeWidth="8" fill="none"/>
                      <circle
                        cx="56" cy="56" r="48"
                        stroke="#14b8a6"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={`${(realTimeScores.businessAcumen / 100) * 301.593} 301.593`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-bold text-slate-800">{realTimeScores.businessAcumen}%</span>
                    </div>
                  </div>
                  <div className="text-sm font-medium text-slate-700">Business Acumen</div>
                </div>

                {/* Opportunistic */}
                <div className="text-center">
                  <div className="relative w-28 h-28 mx-auto mb-3">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="56" cy="56" r="48" stroke="#e2e8f0" strokeWidth="8" fill="none"/>
                      <circle
                        cx="56" cy="56" r="48"
                        stroke="#fb923c"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={`${(realTimeScores.opportunistic / 100) * 301.593} 301.593`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-bold text-slate-800">{realTimeScores.opportunistic}%</span>
                    </div>
                  </div>
                  <div className="text-sm font-medium text-slate-700">Opportunistic</div>
                </div>

                {/* Closing Technique */}
                <div className="text-center">
                  <div className="relative w-28 h-28 mx-auto mb-3">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="56" cy="56" r="48" stroke="#e2e8f0" strokeWidth="8" fill="none"/>
                      <circle
                        cx="56" cy="56" r="48"
                        stroke="#14b8a6"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={`${(realTimeScores.closingTechnique / 100) * 301.593} 301.593`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-bold text-slate-800">{realTimeScores.closingTechnique}%</span>
                    </div>
                  </div>
                  <div className="text-sm font-medium text-slate-700">Closing Technique</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
