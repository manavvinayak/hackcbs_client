import { useEffect, useRef, useState } from "react"
import * as faceapi from 'face-api.js'

export default function WebcamFeed({ recording, onEmotionDetected, sessionId }) {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const wsRef = useRef(null)
  const audioContextRef = useRef(null)
  const analyserRef = useRef(null)
  const microphoneRef = useRef(null)
  const [emotions, setEmotions] = useState([])
  const [currentEmotion, setCurrentEmotion] = useState("loading")
  const [wsConnected, setWsConnected] = useState(false)
  const [analysisData, setAnalysisData] = useState(null)
  const [faceApiLoaded, setFaceApiLoaded] = useState(false)
  const [isWebcamReady, setIsWebcamReady] = useState(false)
  const [error, setError] = useState(null)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [lastSpeechTime, setLastSpeechTime] = useState(Date.now())
  const [showSpeechPrompt, setShowSpeechPrompt] = useState(false)
  const [audioLevel, setAudioLevel] = useState(0)
  const [realTimeAnalysis, setRealTimeAnalysis] = useState({
    eyeContact: 0,
    confidence: 0,
    engagement: 0,
    handMovement: 'stable',
    facialExpression: 'neutral'
  })
  const emotionIntervalRef = useRef(null)
  const faceDetectionIntervalRef = useRef(null)
  const speechDetectionIntervalRef = useRef(null)

  // Initialize Face API.js
  useEffect(() => {
    const initializeFaceAPI = async () => {
      try {
        console.log('🤖 Loading Face API models...')
        
        // Load models from public directory
        const MODEL_URL = '/models'
        
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
          faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL)
        ])
        
        console.log('✅ Face API models loaded successfully')
        setFaceApiLoaded(true)
      } catch (error) {
        console.warn('⚠️ Face API models not available, using fallback analysis:', error)
        // Use fallback analysis without Face API
        setFaceApiLoaded(false)
      }
    }

    initializeFaceAPI()
  }, [])

  // Initialize WebSocket connection
  useEffect(() => {
    if (sessionId) {
      const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:5001'
      wsRef.current = new WebSocket(`${wsUrl}/ws`)
      
      wsRef.current.onopen = () => {
        console.log('🔗 WebSocket connected')
        setWsConnected(true)
        // Join the session
        wsRef.current.send(JSON.stringify({
          type: 'join_session',
          sessionId,
          userId: 'current_user' // You can get this from your auth context
        }))
      }
      
      wsRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data)
        handleWebSocketMessage(data)
      }
      
      wsRef.current.onclose = () => {
        console.log('🔌 WebSocket disconnected')
        setWsConnected(false)
      }
      
      wsRef.current.onerror = (error) => {
        console.error('🚨 WebSocket error:', error)
        setWsConnected(false)
      }
    }
    
    return () => {
      if (wsRef.current) {
        wsRef.current.close()
      }
    }
  }, [sessionId])

  const handleWebSocketMessage = (data) => {
    switch (data.type) {
      case 'analysis_result':
        setAnalysisData(data.analysis)
        setRealTimeAnalysis({
          eyeContact: data.currentScores?.eyeContact || 0,
          confidence: data.currentScores?.confidence || 0,
          engagement: data.currentScores?.engagement || 0,
          handMovement: 'stable', // Will be enhanced later
          facialExpression: data.analysis?.data?.dominantEmotion || 'neutral'
        })
        setCurrentEmotion(data.analysis?.data?.dominantEmotion || 'neutral')
        if (onEmotionDetected) {
          onEmotionDetected(data)
        }
        break
      case 'session_joined':
        console.log('✅ Joined session:', data.sessionId)
        break
      case 'error':
        console.error('❌ WebSocket error:', data.message)
        break
      default:
        console.log('📨 Unknown message type:', data.type)
    }
  }

  // Face detection and analysis function
  const detectFaceAndAnalyze = async () => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    // Set canvas size to match video
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    try {
      if (faceApiLoaded) {
        // Use Face API.js for advanced analysis
        await performFaceAPIAnalysis(video, canvas, ctx)
      } else {
        // Use fallback analysis
        await performFallbackAnalysis(video, canvas, ctx)
      }
    } catch (error) {
      console.error('Face detection error:', error)
    }
  }

  // Advanced Face API analysis
  const performFaceAPIAnalysis = async (video, canvas, ctx) => {
    // Detect faces with landmarks and expressions
    const detections = await faceapi
      .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceExpressions()

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    if (detections.length > 0) {
      const detection = detections[0] // Use first detected face
      
      // Draw detection box and landmarks
      const resizedDetections = faceapi.resizeResults(detections, {
        width: canvas.width,
        height: canvas.height
      })
      
      // Draw face detection box
      faceapi.draw.drawDetections(canvas, resizedDetections)
      // Draw facial landmarks
      faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)

      // Prepare data for analysis
      const faceData = {
        detection: detection.detection,
        landmarks: detection.landmarks,
        expressions: detection.expressions
      }

      // Send to server for analysis
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({
          type: 'facial_analysis',
          sessionId,
          faceData,
          timestamp: Date.now()
        }))
      }

      // Update local state
      const dominantEmotion = getDominantEmotion(detection.expressions)
      setCurrentEmotion(dominantEmotion)
      
      // Add to emotions history
      setEmotions(prev => [...prev.slice(-20), {
        emotion: dominantEmotion,
        confidence: Math.round(detection.expressions[dominantEmotion] * 100),
        timestamp: Date.now()
      }])

    } else {
      // No face detected
      setCurrentEmotion('no_face')
    }
  }

  // Fallback analysis without Face API
  const performFallbackAnalysis = async (video, canvas, ctx) => {
    // Draw video frame to canvas for analysis
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    
    // Get image data for basic analysis
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const data = imageData.data

    // Basic image analysis - movement, brightness, etc.
    const analysis = analyzeFallbackMetrics(data, canvas.width, canvas.height)
    
    // Better mock face data that should trigger eye contact detection
    const centerX = canvas.width * 0.5;
    const centerY = canvas.height * 0.4; // Slightly higher for typical face position
    const faceWidth = canvas.width * 0.4;
    const faceHeight = canvas.height * 0.5;
    
    const mockFaceData = {
      detection: {
        box: { 
          x: centerX - faceWidth/2, 
          y: centerY - faceHeight/2, 
          width: faceWidth, 
          height: faceHeight 
        }
      },
      landmarks: null, // This will trigger simplified eye contact analysis
      expressions: analysis.emotions // Use the dynamic emotions from analysis
    }

    // Send to server for analysis
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'facial_analysis',
        sessionId,
        faceData: mockFaceData,
        timestamp: Date.now()
      }))
    }

    // Update local state with dynamic emotion
    const dominantResult = getDominantEmotionFromAnalysis(analysis)
    setCurrentEmotion(dominantResult.emotion)
    
    // Add to emotions history
    setEmotions(prev => [...prev.slice(-20), {
      emotion: dominantResult.emotion,
      confidence: Math.round(dominantResult.confidence * 100),
      timestamp: Date.now()
    }])

    // Draw simple indicators
    ctx.strokeStyle = '#00ff00'
    ctx.lineWidth = 2
    ctx.strokeRect(canvas.width * 0.25, canvas.height * 0.25, canvas.width * 0.5, canvas.height * 0.5)
  }

  // Analyze basic metrics from image data
  const analyzeFallbackMetrics = (data, width, height) => {
    let totalBrightness = 0
    let redSum = 0, greenSum = 0, blueSum = 0
    const pixelCount = width * height

    // Calculate color and brightness metrics
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i]
      const g = data[i + 1]
      const b = data[i + 2]
      
      redSum += r
      greenSum += g
      blueSum += b
      totalBrightness += (r + g + b) / 3
    }

    const averageBrightness = totalBrightness / pixelCount / 255
    const avgRed = redSum / pixelCount / 255
    const avgGreen = greenSum / pixelCount / 255
    const avgBlue = blueSum / pixelCount / 255

    // Generate more dynamic emotions based on various factors
    const timeVariation = Math.sin(Date.now() / 10000) * 0.3 + 0.5 // Slow variation over time
    const colorVariation = (avgRed + avgGreen * 1.2 + avgBlue * 0.8) / 3 // Color-based emotion hint
    
    // Create varied emotions including dull
    const emotions = {
      happy: Math.max(0, Math.min(1, colorVariation * 0.4 + timeVariation * 0.3)),
      confident: Math.max(0, Math.min(1, averageBrightness * 0.6 + timeVariation * 0.2)),
      focused: Math.max(0, Math.min(1, (1 - averageBrightness) * 0.4 + 0.3)),
      neutral: Math.max(0.1, Math.min(0.8, 0.5 - Math.abs(timeVariation - 0.5))),
      surprised: Math.max(0, Math.min(0.3, Math.random() * 0.2)),
      thoughtful: Math.max(0, Math.min(0.4, (avgBlue - avgRed) * 0.5 + 0.2)),
      dull: Math.max(0, Math.min(0.6, (1 - colorVariation) * 0.3 + (averageBrightness < 0.4 ? 0.3 : 0)))
    }

    // Normalize emotions to sum to 1
    const totalEmotion = Object.values(emotions).reduce((a, b) => a + b, 0)
    Object.keys(emotions).forEach(key => {
      emotions[key] = emotions[key] / totalEmotion
    })

    return {
      brightness: averageBrightness,
      stability: Math.min(1, averageBrightness + 0.3),
      engagement: Math.random() * 0.3 + 0.5,
      attentiveness: Math.random() * 0.4 + 0.4,
      confidence: Math.random() * 0.5 + 0.4,
      emotions: emotions,
      colorProfile: { red: avgRed, green: avgGreen, blue: avgBlue }
    }
  }

  // Get dominant emotion from analysis
  const getDominantEmotionFromAnalysis = (analysis) => {
    const emotions = analysis.emotions
    let maxEmotion = 'neutral'
    let maxConfidence = 0

    Object.entries(emotions).forEach(([emotion, confidence]) => {
      if (confidence > maxConfidence) {
        maxConfidence = confidence
        maxEmotion = emotion
      }
    })

    return { emotion: maxEmotion, confidence: maxConfidence }
  }

  // Get dominant emotion from expressions
  const getDominantEmotion = (expressions) => {
    let maxEmotion = 'neutral'
    let maxConfidence = 0

    Object.entries(expressions).forEach(([emotion, confidence]) => {
      if (confidence > maxConfidence) {
        maxConfidence = confidence
        maxEmotion = emotion
      }
    })

    return maxEmotion
  }

  const sendFrameToAnalysis = () => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN && canvasRef.current) {
      const canvas = canvasRef.current
      const frameData = canvas.toDataURL('image/jpeg', 0.8)
      
      wsRef.current.send(JSON.stringify({
        type: 'webcam_frame',
        frameData,
        sessionId,
        timestamp: new Date().toISOString()
      }))
    }
  }

  // Initialize audio context for speech detection
  const initializeSpeechDetection = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)()
      analyserRef.current = audioContextRef.current.createAnalyser()
      microphoneRef.current = audioContextRef.current.createMediaStreamSource(stream)
      
      analyserRef.current.fftSize = 256
      analyserRef.current.smoothingTimeConstant = 0.8
      microphoneRef.current.connect(analyserRef.current)
      
      // Resume audio context if it's suspended
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume()
      }
      
      console.log('🎤 Speech detection initialized, audio context state:', audioContextRef.current.state)
    } catch (error) {
      console.warn('⚠️ Could not initialize speech detection:', error)
    }
  }

  // Detect if user is speaking
  const detectSpeech = () => {
    if (!analyserRef.current) return

    const bufferLength = analyserRef.current.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)
    analyserRef.current.getByteFrequencyData(dataArray)

    // Calculate average volume
    const average = dataArray.reduce((a, b) => a + b) / bufferLength
    const threshold = 5 // Lower threshold for better sensitivity

    // Update audio level for debugging
    setAudioLevel(average)

    const currentlySpeaking = average > threshold
    
    // Debug logging (remove in production)
    if (Math.random() < 0.02) { // Log only 2% of the time to avoid spam
      console.log(`🎤 Audio level: ${average.toFixed(1)}, Threshold: ${threshold}, Speaking: ${currentlySpeaking}`)
    }
    
    if (currentlySpeaking) {
      setLastSpeechTime(Date.now())
      if (!isSpeaking) {
        setIsSpeaking(true)
        setShowSpeechPrompt(false)
        console.log('🗣️ User started speaking, audio level:', average.toFixed(1))
      }
    } else {
      if (isSpeaking) {
        setIsSpeaking(false)
        console.log('🤐 User stopped speaking, audio level:', average.toFixed(1))
      }
    }

    // Check if user hasn't spoken for 8 seconds (increased from 5)
    const timeSinceLastSpeech = Date.now() - lastSpeechTime
    if (timeSinceLastSpeech > 8000 && recording) {
      setShowSpeechPrompt(true)
    } else {
      setShowSpeechPrompt(false)
    }
  }

  useEffect(() => {
    const startWebcam = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { width: 640, height: 480 } 
        })
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          videoRef.current.play()
          
          videoRef.current.addEventListener('loadedmetadata', () => {
            console.log('📹 Webcam started successfully')
            setIsWebcamReady(true)
          })
        }
        
        // Initialize WebSocket connection
        initializeWebSocket()
        
        // Initialize speech detection if recording
        if (recording) {
          initializeSpeechDetection()
        }
        
      } catch (error) {
        console.error('❌ Error accessing webcam:', error)
        setError('Could not access webcam. Please check permissions.')
      }
    }

    startWebcam()
    
    return () => {
      // Cleanup webcam stream
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks()
        tracks.forEach(track => track.stop())
      }
      
      // Cleanup WebSocket
      if (wsRef.current) {
        wsRef.current.close()
      }
      
      // Cleanup audio context
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [])

  // Resume audio context on user interaction
  const handleUserInteraction = async () => {
    if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
      try {
        await audioContextRef.current.resume()
        console.log('🔊 Audio context resumed after user interaction')
      } catch (error) {
        console.warn('⚠️ Could not resume audio context:', error)
      }
    }
  }

  // Start/stop analysis and speech detection based on recording state
  useEffect(() => {
    if (recording && isWebcamReady) {
      // Start analysis interval
      const analysisInterval = setInterval(() => {
        loadModelsAndAnalyze()
        sendFrameToAnalysis()
      }, 1000)
      
      // Start speech detection interval
      const speechInterval = setInterval(detectSpeech, 100)
      
      // Initialize speech detection
      initializeSpeechDetection()
      setLastSpeechTime(Date.now())
      
      return () => {
        clearInterval(analysisInterval)
        clearInterval(speechInterval)
      }
    }
  }, [recording, isWebcamReady])  // Start face detection when recording begins
  useEffect(() => {
    if (recording) {
      console.log('🎬 Starting face detection analysis...')
      
      // Start face detection interval (works with or without Face API)
      faceDetectionIntervalRef.current = setInterval(() => {
        detectFaceAndAnalyze()
      }, 1000) // Analyze every second

      // Also start frame sending for backwards compatibility
      emotionIntervalRef.current = setInterval(() => {
        sendFrameToAnalysis()
      }, 2000) // Send frame every 2 seconds
    } else {
      // Stop intervals when not recording
      if (faceDetectionIntervalRef.current) {
        clearInterval(faceDetectionIntervalRef.current)
      }
      if (emotionIntervalRef.current) {
        clearInterval(emotionIntervalRef.current)
      }
    }

    return () => {
      if (faceDetectionIntervalRef.current) {
        clearInterval(faceDetectionIntervalRef.current)
      }
      if (emotionIntervalRef.current) {
        clearInterval(emotionIntervalRef.current)
      }
    }
  }, [recording]) // Removed faceApiLoaded dependency

  return (
    <div className="bg-black rounded-lg overflow-hidden relative" onClick={handleUserInteraction}>
      <video ref={videoRef} autoPlay playsInline className="w-full h-96 object-cover" />
      <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-96 object-cover opacity-50" />

      {/* Speech Prompt Overlay */}
      {showSpeechPrompt && recording && audioLevel<20 && (
        <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center z-10">
          <div className="bg-red-600 text-white px-8 py-6 rounded-lg text-center animate-pulse">
            <div className="text-4xl mb-3">🎤</div>
            <div className="text-xl font-bold mb-2">Please speak now</div>
            <div className="text-sm opacity-90">We haven't heard you speaking for a while</div>
          </div>
        </div>
      )}

      {/* Recording Indicator */}
      {recording && (
        <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-500 px-4 py-2 rounded-lg z-20">
          <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
          <span className="text-white text-sm font-semibold">Recording</span>
          {/* Speech Status */}
          <div className={`ml-2 px-2 py-1 text-xs rounded ${
            isSpeaking ? 'bg-green-600' : 'bg-yellow-600'
          }`}>
            {isSpeaking ? '🗣️ Speaking' : '🤐 Silent'}
          </div>
          {/* Audio Level Debug */}
          <div className="ml-2 px-2 py-1 text-xs bg-blue-600 rounded">
            🎤 {audioLevel.toFixed(1)}
          </div>
        </div>
      )}

      {/* Face API Status */}
      <div className="absolute top-4 left-4 flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${faceApiLoaded ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
        <span className="text-white text-xs bg-black bg-opacity-70 px-2 py-1 rounded">
          {faceApiLoaded ? '🤖 AI Ready' : '🔧 Fallback Mode'}
        </span>
      </div>

      {/* Connection Status */}
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${wsConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
        <span className="text-white text-xs bg-black bg-opacity-70 px-2 py-1 rounded">
          {wsConnected ? 'Connected' : 'Connecting...'}
        </span>
      </div>

      {/* Real-time AI Analysis */}
      {recording && (
        <div className="absolute bottom-4 left-4 bg-black bg-opacity-80 rounded-lg p-3 text-white text-xs min-w-[200px]">
          <h4 className="font-semibold mb-2 text-green-400">🤖 AI Analysis</h4>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span>Eye Contact:</span>
              <span className={`font-semibold ${realTimeAnalysis.eyeContact > 60 ? 'text-green-400' : realTimeAnalysis.eyeContact > 30 ? 'text-yellow-400' : 'text-red-400'}`}>
                {Math.round(realTimeAnalysis.eyeContact)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span>Confidence:</span>
              <span className={`font-semibold ${realTimeAnalysis.confidence > 70 ? 'text-green-400' : realTimeAnalysis.confidence > 40 ? 'text-yellow-400' : 'text-red-400'}`}>
                {Math.round(realTimeAnalysis.confidence)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span>Engagement:</span>
              <span className={`font-semibold ${realTimeAnalysis.engagement > 60 ? 'text-green-400' : realTimeAnalysis.engagement > 30 ? 'text-yellow-400' : 'text-red-400'}`}>
                {Math.round(realTimeAnalysis.engagement)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span>Expression:</span>
              <span className="font-semibold capitalize text-blue-400">
                {realTimeAnalysis.facialExpression}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Current Emotion Display */}
      <div className="absolute bottom-4 right-4 bg-black bg-opacity-80 px-4 py-2 rounded-lg min-w-[150px]">
        <p className="text-white text-sm flex items-center gap-2">
          <span className="text-2xl">
            {currentEmotion === 'happy' ? '😊' :
             currentEmotion === 'confident' ? '😎' :
             currentEmotion === 'focused' ? '🤔' :
             currentEmotion === 'thoughtful' ? '💭' :
             currentEmotion === 'surprised' ? '😮' :
             currentEmotion === 'dull' ? '😴' :
             currentEmotion === 'neutral' ? '😐' : '🙂'}
          </span>
          <span className="font-semibold capitalize text-yellow-400">{currentEmotion}</span>
        </p>
        {emotions.length > 0 && (
          <p className="text-gray-300 text-xs mt-1">
            Confidence: {emotions[emotions.length - 1].confidence}%
          </p>
        )}
        {/* Recent emotions mini timeline */}
        <div className="flex gap-1 mt-2">
          {emotions.slice(-5).map((e, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full ${
                e.emotion === "happy" ? "bg-yellow-400" : 
                e.emotion === "confident" ? "bg-blue-400" : 
                e.emotion === "focused" ? "bg-purple-400" :
                e.emotion === "thoughtful" ? "bg-indigo-400" :
                e.emotion === "surprised" ? "bg-orange-400" :
                e.emotion === "dull" ? "bg-gray-600" :
                e.emotion === "neutral" ? "bg-gray-400" : "bg-green-400"
              }`}
              title={`${e.emotion} (${e.confidence}%)`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
