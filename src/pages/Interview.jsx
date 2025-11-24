"use client"

import { useState, useEffect, useRef } from "react"
import WebcamFeed from "../components/WebcamFeed"
import FeedbackPanel from "../components/FeedbackPanel"
import AIFeedbackPanel from "../components/AIFeedbackPanel"
import QuestionDisplay from "../components/QuestionDisplay"
import hark from "hark"

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
  
  const mediaRecorderRef = useRef(null)
  const chunksRef = useRef([])
  const speechEventsRef = useRef(null)
  const audioStreamRef = useRef(null)

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

  const setupSpeechDetection = (stream) => {
    try {
      const speechEvents = hark(stream, {
        threshold: -50,
        interval: 100
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
          
          if (speechEventsRef.current) {
            speechEventsRef.current.stop()
            speechEventsRef.current = null
          }
          
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

  const handleAIAnalysis = (analysisResult) => {
    console.log('🤖 AI Analysis received:', analysisResult)
    
    const currentTime = Date.now()
    
    const hasFaceData = analysisResult.faceDetected === true || 
                        (analysisResult.currentScores && 
                         (analysisResult.currentScores.eyeContact > 0 || 
                          analysisResult.currentScores.confidence > 0))
    
    if (hasFaceData) {
      setFaceDetected(true)
      setLastDetectionTime(currentTime)
      setUserPresent(true)
      
      if (analysisResult.analysis) {
        setAiAnalysisData(analysisResult.analysis.data)
      }
      
      if (analysisResult.currentScores) {
        const updatedScores = {
          eyeContact: Math.min(100, Math.max(0, analysisResult.currentScores.eyeContact || 0)),
          confidence: Math.min(100, Math.max(0, analysisResult.currentScores.confidence || 0)),
          engagement: Math.min(100, Math.max(0, analysisResult.currentScores.engagement || 0))
        }
        
        setRealTimeScores(updatedScores)
        
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
      setFaceDetected(false)
      console.log('👁️ No face detected in current frame')
    }
  }

  useEffect(() => {
    if (!recording) return

    const monitorInterval = setInterval(() => {
      const now = Date.now()
      const timeSinceLastDetection = now - lastDetectionTime
      const timeSinceLastSpeech = now - lastSpeechTime
      
      const currentSilence = Math.floor(timeSinceLastSpeech / 1000)
      setSilenceDuration(currentSilence)
      
      if (currentSilence > 30 && !isSpeaking && !showSpeakAlert) {
        setShowSpeakAlert(true)
        console.log('⚠️ User has been silent for 30+ seconds')
      }
      
      if (currentSilence > 180 && !interviewCompleted) {
        console.log('⏭️ Auto-skipping question due to 3 minutes of silence')
        setShowSpeakAlert(false)
        nextQuestion()
        return
      }
      
      if (timeSinceLastDetection > 2000 && faceDetected) {
        setFaceDetected(false)
        setUserPresent(false)
        console.log('👤 User moved away from camera')
      }
      
      if (!faceDetected && userPresent === false) {
        setRealTimeScores(prev => {
          const decayRate = 0.95
          
          const newScores = {
            eyeContact: Math.max(0, Math.floor(prev.eyeContact * decayRate)),
            confidence: Math.max(0, Math.floor(prev.confidence * decayRate)),
            engagement: Math.max(0, Math.floor(prev.engagement * decayRate))
          }
          
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
      
      if (currentSilence > 60 && faceDetected) {
        setRealTimeScores(prev => ({
          ...prev,
          engagement: Math.max(0, Math.floor(prev.engagement * 0.98))
        }))
      }
      
    }, 1000)
    
    return () => clearInterval(monitorInterval)
  }, [recording, lastDetectionTime, lastSpeechTime, faceDetected, userPresent, isSpeaking, showSpeakAlert, interviewCompleted])

  const startNewAnalysis = () => {
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
    setUserPresent(false)
    setFaceDetected(false)
    setIsSpeaking(false)
    setShowSpeakAlert(false)
    setSilenceDuration(0)
    setEmotionData([])
    setFeedback(null)
    setRecordingStopped(false)
    
    const newSessionId = `interview_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    setSessionId(newSessionId)
    
    startRecording()
  }

  const continueExistingAnalysis = () => {
    setRecordingStopped(false)
    startRecording()
  }

  const calculateAverageScores = () => {
    if (scoreHistory.length === 0) {
      return { eyeContact: 0, confidence: 0, engagement: 0 }
    }
    
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

  const nextQuestion = async () => {
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
      setScoreHistory([])
      setEmotionData([])
      setLastSpeechTime(Date.now())
      setSilenceDuration(0)
      setShowSpeakAlert(false)
    } else {
      const finalAverageScores = calculateAverageScores()
      setAverageScores(finalAverageScores)
      setInterviewCompleted(true)
      console.log('🎯 Interview completed! Final average scores:', finalAverageScores)
    }
  }

  const submitInterview = async () => {
    try {
      setSubmittingSession(true)
      const duration = Math.floor((Date.now() - sessionStart) / 60000)
      
      const finalAverageScores = averageScores || calculateAverageScores()
      const averageScore = Math.round((finalAverageScores.eyeContact + finalAverageScores.confidence + finalAverageScores.engagement) / 3)
      
      const overallFeedback = {
        overall: `Completed ${questions.length} questions with ${averageScore}% average performance`,
        eyeContact: `Average eye contact: ${finalAverageScores.eyeContact}%`,
        confidence: `Average confidence level: ${finalAverageScores.confidence}%`,
        engagement: `Average engagement score: ${finalAverageScores.engagement}%`,
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
        averageScores: finalAverageScores,
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
        
        setInterviewCompleted(false)
        setSessionAnswers([])
        setEmotionData([])
        setCurrentQuestionIndex(0)
        setScoreHistory([])
        
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-200 border-t-teal-500 mx-auto mb-4"></div>
          <p className="text-lg font-medium text-slate-700">Loading {interviewType} questions...</p>
          <p className="text-sm text-slate-500 mt-2">Preparing your interview session</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="text-center max-w-md bg-white rounded-2xl shadow-lg p-8">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-slate-800 mb-3">Unable to Load Questions</h2>
          <p className="text-slate-600 mb-6">{error}</p>
          <div className="flex gap-3 justify-center">
            <button 
              onClick={fetchQuestions}
              className="px-6 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition font-medium"
            >
              Try Again
            </button>
            <button 
              onClick={() => onNavigate("dashboard")}
              className="px-6 py-3 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition font-medium"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!questions.length) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="text-center bg-white rounded-2xl shadow-lg p-8">
          <div className="text-slate-400 text-6xl mb-4">📝</div>
          <h2 className="text-2xl font-bold text-slate-800 mb-3">No Questions Available</h2>
          <p className="text-slate-600 mb-6">We couldn't find any {interviewType} questions.</p>
          <button 
            onClick={() => onNavigate("dashboard")}
            className="px-6 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition font-medium"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  const getOverallScore = () => {
    const eyeContact = Math.round(realTimeScores.eyeContact || 0)
    const confidence = Math.round(realTimeScores.confidence || 0)
    const engagement = Math.round(realTimeScores.engagement || 0)
    return Math.round((eyeContact + confidence + engagement) / 3)
  }

  return (
    <div className="min-h-screen bg-slate-50 py-6">
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="grid grid-cols-12 gap-6">
          {/* Main Content Area - 8 columns */}
          <div className="col-span-12 lg:col-span-8 space-y-6">
            {/* Question Display */}
            <QuestionDisplay question={questions[currentQuestionIndex]} />
            
            {/* Webcam Feed */}
            <WebcamFeed 
              recording={recording} 
              onEmotionDetected={handleAIAnalysis} 
              sessionId={sessionId}
            />
            
            {/* Status Panel */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
              <h3 className="text-sm font-semibold text-slate-700 mb-4 uppercase tracking-wide">Session Status</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-600">Face Detection</span>
                  <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                    faceDetected 
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                      : 'bg-slate-100 text-slate-600 border border-slate-200'
                  }`}>
                    {faceDetected ? '✓ Detected' : '○ Not Detected'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-600">Speech Activity</span>
                  <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                    isSpeaking 
                      ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                      : 'bg-slate-100 text-slate-600 border border-slate-200'
                  }`}>
                    {isSpeaking ? '● Speaking' : '○ Silent'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-600">Silence Duration</span>
                  <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                    {silenceDuration}s / 180s
                  </span>
                </div>
              </div>
            </div>
            
            {/* Speak Alert */}
            {showSpeakAlert && recording && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 shadow-sm">
                <div className="flex items-start">
                  <div className="flex-shrink-0 text-amber-500 text-xl mr-3 mt-0.5">⚠️</div>
                  <div>
                    <h4 className="font-semibold text-amber-900 mb-1">Please Start Speaking</h4>
                    <p className="text-sm text-amber-800">
                      You've been silent for {silenceDuration} seconds.
                      {silenceDuration > 150 && ` Question will auto-skip in ${180 - silenceDuration} seconds.`}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Control Buttons */}
            <div className="flex gap-3">
              {!recording && !recordingStopped && !interviewCompleted && (
                <button
                  onClick={startRecording}
                  className="flex-1 py-3.5 rounded-xl bg-teal-500 text-white font-semibold hover:bg-teal-600 transition-all shadow-sm hover:shadow-md"
                >
                  Start Recording
                </button>
              )}
              
              {recording && !interviewCompleted && (
                <button
                  onClick={stopRecording}
                  className="flex-1 py-3.5 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition-all shadow-sm hover:shadow-md"
                >
                  Stop Recording
                </button>
              )}
              
              {!recording && recordingStopped && !interviewCompleted && (
                <>
                  <button
                    onClick={startNewAnalysis}
                    className="flex-1 py-3.5 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-all shadow-sm hover:shadow-md"
                  >
                    🔄 Start New Analysis
                  </button>
                  <button
                    onClick={continueExistingAnalysis}
                    className="flex-1 py-3.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all shadow-sm hover:shadow-md"
                  >
                    ▶ Continue Analysis
                  </button>
                </>
              )}
              
              {!interviewCompleted && (
                <button
                  onClick={nextQuestion}
                  disabled={recording}
                  className="flex-1 py-3.5 rounded-xl bg-slate-600 text-white font-semibold hover:bg-slate-700 transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {currentQuestionIndex === questions.length - 1 ? 'Complete Interview' : 'Next Question'} 
                  <span className="ml-2 text-sm opacity-80">({currentQuestionIndex + 1}/{questions.length})</span>
                </button>
              )}

              {interviewCompleted && (
                <div className="w-full">
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 mb-4 shadow-sm">
                    <div className="flex items-start mb-4">
                      <div className="flex-shrink-0 text-emerald-600 text-3xl mr-4">✓</div>
                      <div>
                        <h3 className="text-xl font-bold text-emerald-900 mb-1">Interview Completed!</h3>
                        <p className="text-emerald-700">You have successfully answered all {questions.length} questions.</p>
                      </div>
                    </div>
                    
                    {/* Final Average Scores */}
                    <div className="bg-white rounded-lg p-4 mb-4 border border-emerald-100">
                      <h4 className="text-sm font-semibold text-slate-700 mb-3 uppercase tracking-wide">Final Average Performance</h4>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-blue-600 mb-1">
                            {averageScores?.eyeContact || 0}%
                          </div>
                          <div className="text-xs text-slate-600 font-medium">Eye Contact</div>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl font-bold text-emerald-600 mb-1">
                            {averageScores?.confidence || 0}%
                          </div>
                          <div className="text-xs text-slate-600 font-medium">Confidence</div>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl font-bold text-purple-600 mb-1">
                            {averageScores?.engagement || 0}%
                          </div>
                          <div className="text-xs text-slate-600 font-medium">Engagement</div>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-slate-200">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-slate-800 mb-1">
                            {Math.round((
                              (averageScores?.eyeContact || 0) + 
                              (averageScores?.confidence || 0) + 
                              (averageScores?.engagement || 0)
                            ) / 3)}%
                          </div>
                          <div className="text-xs text-slate-600 font-medium uppercase tracking-wide">Overall Score</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <button
                      onClick={submitInterview}
                      disabled={submittingSession}
                      className="flex-1 py-3.5 rounded-xl bg-teal-500 text-white font-semibold hover:bg-teal-600 transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submittingSession ? (
                        <>
                          <span className="inline-block animate-spin mr-2">⏳</span>
                          Saving Session...
                        </>
                      ) : (
                        '💾 Submit & Go to Dashboard'
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
                        setAverageScores(null)
                        setLastDetectionTime(Date.now())
                        setLastSpeechTime(Date.now())
                        setUserPresent(false)
                        setFaceDetected(false)
                        setIsSpeaking(false)
                        setShowSpeakAlert(false)
                        setSilenceDuration(0)
                      }}
                      disabled={submittingSession}
                      className="px-6 py-3.5 rounded-xl bg-slate-200 text-slate-700 font-semibold hover:bg-slate-300 transition-all shadow-sm disabled:opacity-50"
                    >
                      🔄 Restart
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Question List - NEW ADDITION FROM IMAGE */}
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
                        {q.question || q.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar - 4 columns */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
            {/* AI Score Summary - NEW DESIGN FROM IMAGE */}
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-6">
              <div className="flex items-center gap-2 mb-4">
                <svg className="w-5 h-5 text-teal-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
                </svg>
                <h3 className="font-semibold text-slate-800">AI Video Score Summary</h3>
              </div>
              
              <div className="flex items-center justify-center mb-4">
                <div className="relative w-32 h-32">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="64" cy="64" r="56" stroke="#e2e8f0" strokeWidth="8" fill="none"/>
                    <circle
                      cx="64" cy="64" r="56"
                      stroke="#14b8a6"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${Math.round((getOverallScore() / 100) * 351.858)} 351.858`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-4xl font-bold text-slate-800">{Math.round(getOverallScore())}%</span>
                  </div>
                </div>
              </div>

              <p className="text-center text-sm text-slate-600 mb-4">
                The presentation of talent is <span className="font-semibold text-teal-600">
                  {getOverallScore() >= 80 ? 'excellent' : getOverallScore() >= 60 ? 'good' : 'needs improvement'}
                </span>. Check the breakdown summary.
              </p>

              {/* Score Detail Circles - NEW DESIGN FROM IMAGE */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <div className="relative w-20 h-20 mx-auto mb-2">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="40" cy="40" r="35" stroke="#e2e8f0" strokeWidth="6" fill="none"/>
                      <circle
                        cx="40" cy="40" r="35"
                        stroke="#14b8a6"
                        strokeWidth="6"
                        fill="none"
                        strokeDasharray={`${Math.round((Math.round(realTimeScores.eyeContact) / 100) * 219.911)} 219.911`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg font-bold text-slate-800">{Math.round(realTimeScores.eyeContact)}%</span>
                    </div>
                  </div>
                  <div className="text-xs font-medium text-slate-700">Eye Contact</div>
                </div>

                <div className="text-center">
                  <div className="relative w-20 h-20 mx-auto mb-2">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="40" cy="40" r="35" stroke="#e2e8f0" strokeWidth="6" fill="none"/>
                      <circle
                        cx="40" cy="40" r="35"
                        stroke="#14b8a6"
                        strokeWidth="6"
                        fill="none"
                        strokeDasharray={`${Math.round((Math.round(realTimeScores.confidence) / 100) * 219.911)} 219.911`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg font-bold text-slate-800">{Math.round(realTimeScores.confidence)}%</span>
                    </div>
                  </div>
                  <div className="text-xs font-medium text-slate-700">Confidence</div>
                </div>

                <div className="text-center">
                  <div className="relative w-20 h-20 mx-auto mb-2">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="40" cy="40" r="35" stroke="#e2e8f0" strokeWidth="6" fill="none"/>
                      <circle
                        cx="40" cy="40" r="35"
                        stroke="#fb923c"
                        strokeWidth="6"
                        fill="none"
                        strokeDasharray={`${Math.round((Math.round(realTimeScores.engagement) / 100) * 219.911)} 219.911`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg font-bold text-slate-800">{Math.round(realTimeScores.engagement)}%</span>
                    </div>
                  </div>
                  <div className="text-xs font-medium text-slate-700">Engagement</div>
                </div>
              </div>
            </div>

            {/* AIFeedbackPanel */}
            <AIFeedbackPanel 
              analysisData={aiAnalysisData}
              recommendations={aiRecommendations}
              realTimeScores={realTimeScores}
            />

            {/* FeedbackPanel */}
            <FeedbackPanel feedback={feedback} emotionData={emotionData} />
          </div>
        </div>
      </div>
    </div>
  )
}
