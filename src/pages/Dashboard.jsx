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
  const [showQuiz, setShowQuiz] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [quizAnswers, setQuizAnswers] = useState({})
  const [quizLoading, setQuizLoading] = useState(false)
  const [quizResult, setQuizResult] = useState(null)

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 50%, #d1d5db 100%)',
      padding: '3rem 1.5rem',
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    },
    mainContent: {
      maxWidth: '1400px',
      margin: '0 auto'
    },
    heroSection: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      borderRadius: '32px',
      padding: '4rem 3rem',
      marginBottom: '3rem',
      color: 'white',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: '0 25px 60px rgba(102, 126, 234, 0.3)',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '3rem',
      alignItems: 'center'
    },
    heroContent: {
      position: 'relative',
      zIndex: 2
    },
    heroBadge: {
      background: 'rgba(255, 255, 255, 0.2)',
      padding: '0.5rem 1rem',
      borderRadius: '20px',
      fontSize: '0.875rem',
      fontWeight: '800',
      display: 'inline-block',
      marginRight: '0.5rem',
      marginBottom: '1rem'
    },
    heroTitle: {
      fontSize: '3.5rem',
      fontWeight: '800',
      marginBottom: '1rem',
      lineHeight: '1.1',
      letterSpacing: '-0.02em',
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    },
    heroSubtitle: {
      fontSize: '1.2rem',
      opacity: 0.9,
      marginBottom: '2rem',
      fontWeight: '400',
      lineHeight: '1.6'
    },
    heroVisual: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    blob3D: {
      width: '400px',
      height: '400px',
      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%)',
      borderRadius: '40% 60% 70% 30% / 40% 50% 60% 50%',
      position: 'relative',
      animation: 'morph 8s ease-in-out infinite',
      boxShadow: 'inset 0 0 100px rgba(255, 255, 255, 0.1)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    card: {
      background: 'white',
      borderRadius: '24px',
      padding: '2.5rem',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      border: '1px solid #f1f5f9',
      transition: 'all 0.3s ease',
      marginBottom: '2rem'
    },
    sectionTitle: {
      fontSize: '1.75rem',
      fontWeight: '700',
      color: '#1e293b',
      marginBottom: '2rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem'
    },
    grid: {
      display: 'grid',
      gap: '2rem'
    },
    gridCols3: {
      gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))'
    },
    gridCols4: {
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))'
    },
    primaryButton: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '16px',
      padding: '1rem 2rem',
      fontSize: '1rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      boxShadow: '0 10px 25px rgba(102, 126, 234, 0.25)'
    },
    secondaryButton: {
      background: 'transparent',
      color: 'white',
      border: '2px solid rgba(255, 255, 255, 0.3)',
      borderRadius: '16px',
      padding: '1rem 2rem',
      fontSize: '1rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    },
    processStep: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      borderRadius: '20px',
      padding: '3rem 2rem',
      color: 'white',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden'
    },
    stepNumber: {
      width: '48px',
      height: '48px',
      borderRadius: '50%',
      background: 'rgba(255, 255, 255, 0.2)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '1.25rem',
      fontWeight: '700',
      margin: '0 auto 1.5rem'
    },
    mockInterface: {
      background: 'rgba(255, 255, 255, 0.1)',
      borderRadius: '16px',
      padding: '1.5rem',
      textAlign: 'left',
      backdropFilter: 'blur(10px)'
    },
    statCard: {
      background: 'white',
      borderRadius: '20px',
      padding: '2rem',
      textAlign: 'center',
      position: 'relative',
      border: '1px solid #f1f5f9',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
    },
    statValue: {
      fontSize: '2.5rem',
      fontWeight: '800',
      color: '#1e293b',
      marginBottom: '0.5rem',
      lineHeight: '1'
    },
    statLabel: {
      fontSize: '0.875rem',
      color: '#64748b',
      fontWeight: '500',
      textTransform: 'uppercase',
      letterSpacing: '0.05em'
    },
    sessionCard: {
      background: 'white',
      borderRadius: '16px',
      padding: '2rem',
      border: '1px solid #e2e8f0',
      transition: 'all 0.3s ease',
      marginBottom: '1rem'
    },
    badge: {
      padding: '0.5rem 1rem',
      borderRadius: '20px',
      fontSize: '0.75rem',
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: '0.05em'
    },
    loadingSpinner: {
      width: '40px',
      height: '40px',
      border: '4px solid #e5e7eb',
      borderTop: '4px solid #667eea',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    },
    emptyState: {
      textAlign: 'center',
      padding: '4rem 2rem',
      color: '#64748b'
    }
  }

  const spinKeyframes = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    @keyframes morph {
      0%, 100% {
        border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%;
        transform: rotate(0deg);
      }
      25% {
        border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
      }
      50% {
        border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%;
        transform: rotate(90deg);
      }
      75% {
        border-radius: 70% 30% 40% 60% / 40% 50% 60% 50%;
      }
    }
    
    @keyframes float {
      0%, 100% {
        transform: translateY(0px);
      }
      50% {
        transform: translateY(-20px);
      }
    }
  `

  useEffect(() => {
    fetchSessions()
    if (!document.querySelector('#dashboard-styles')) {
      const style = document.createElement('style')
      style.id = 'dashboard-styles'
      style.textContent = spinKeyframes
      document.head.appendChild(style)
    }
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

  const getScoreColor = (score) => {
    if (score >= 90) return { bg: '#dcfce7', color: '#166534' }
    if (score >= 75) return { bg: '#fef3c7', color: '#92400e' }
    if (score >= 60) return { bg: '#fed7aa', color: '#9a3412' }
    return { bg: '#fecaca', color: '#b91c1c' }
  }

  const getTypeIcon = (type) => {
    switch(type) {
      case 'behavioral': return '🧠'
      case 'hr': return '👥'
      case 'technical': return '💻'
      default: return '📊'
    }
  }

  // Quiz questions for AI recommendation
  const quizQuestions = [
    {
      id: 1,
      question: "What is your primary career level?",
      type: "single",
      options: [
        { value: "entry", label: "Entry Level (0-2 years)" },
        { value: "mid", label: "Mid Level (2-5 years)" },
        { value: "senior", label: "Senior Level (5+ years)" },
        { value: "executive", label: "Executive/Leadership" }
      ]
    },
    {
      id: 2,
      question: "Which area do you feel least confident about?",
      type: "single",
      options: [
        { value: "technical", label: "Technical skills and coding" },
        { value: "behavioral", label: "Explaining past experiences" },
        { value: "communication", label: "General communication and fit" },
        { value: "negotiation", label: "Salary and benefits discussion" }
      ]
    },
    {
      id: 3,
      question: "What type of role are you primarily targeting?",
      type: "single",
      options: [
        { value: "engineering", label: "Software Engineering/Development" },
        { value: "product", label: "Product Management" },
        { value: "design", label: "Design/UX" },
        { value: "business", label: "Business/Consulting" },
        { value: "other", label: "Other" }
      ]
    },
    {
      id: 4,
      question: "How much interview experience do you have?",
      type: "single",
      options: [
        { value: "none", label: "No formal interview experience" },
        { value: "some", label: "A few interviews" },
        { value: "moderate", label: "Several interviews" },
        { value: "extensive", label: "Extensive interview experience" }
      ]
    },
    {
      id: 5,
      question: "What specific areas would you like to improve? (Select all that apply)",
      type: "multiple",
      options: [
        { value: "confidence", label: "Building confidence" },
        { value: "storytelling", label: "Storytelling and examples" },
        { value: "technical_depth", label: "Technical depth" },
        { value: "company_research", label: "Company research and fit" },
        { value: "salary_negotiation", label: "Salary negotiation" }
      ]
    }
  ]

  // Get AI recommendation using Gemini API
  const getAIRecommendation = async (answers) => {
    try {
      setQuizLoading(true)
      
      // Prepare the prompt for Gemini AI
      const prompt = `
Based on these interview preparation quiz responses, recommend the best interview type to start with:

User Profile:
- Career Level: ${answers[1]}
- Least Confident Area: ${answers[2]}
- Target Role: ${answers[3]}
- Interview Experience: ${answers[4]}
- Areas to Improve: ${Array.isArray(answers[5]) ? answers[5].join(', ') : answers[5]}

Available Interview Types:
1. Behavioral Interview: Focus on STAR method, past experiences, soft skills
2. HR Screening: Company fit, background, general communication
3. Technical Interview: Coding, system design, technical concepts

Provide a recommendation in this exact JSON format:
{
  "recommendedType": "behavioral" | "hr" | "technical",
  "confidence": 85,
  "reasoning": "Brief explanation why this is the best starting point",
  "nextSteps": "What to focus on after this interview type"
}

Consider their experience level and confidence gaps to suggest the most appropriate starting point.`

      // Replace 'YOUR_GEMINI_API_KEY' with your actual API key
      const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || 'YOUR_GEMINI_API_KEY'
      
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      })

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`)
      }

      const data = await response.json()
      const aiResponse = data.candidates[0].content.parts[0].text
      
      // Parse the JSON response from AI
      try {
        const recommendation = JSON.parse(aiResponse.replace(/```json|```/g, '').trim())
        setQuizResult(recommendation)
      } catch (parseError) {
        // Fallback if JSON parsing fails
        console.error('Failed to parse AI response:', parseError)
        setQuizResult({
          recommendedType: 'behavioral',
          confidence: 75,
          reasoning: 'Based on your responses, starting with behavioral interviews will help build foundational skills.',
          nextSteps: 'After mastering behavioral questions, move on to technical or HR interviews based on your target role.'
        })
      }

    } catch (error) {
      console.error('Error getting AI recommendation:', error)
      // Fallback recommendation logic
      const fallbackRecommendation = getFallbackRecommendation(answers)
      setQuizResult(fallbackRecommendation)
    } finally {
      setQuizLoading(false)
    }
  }

  // Fallback recommendation logic if AI fails
  const getFallbackRecommendation = (answers) => {
    const leastConfident = answers[2]
    const role = answers[3]
    const experience = answers[4]

    if (leastConfident === 'technical' || role === 'engineering') {
      return {
        recommendedType: 'technical',
        confidence: 80,
        reasoning: 'Your focus on technical skills suggests starting with technical interviews to build confidence in your core competency.',
        nextSteps: 'Follow up with behavioral interviews to round out your interview skills.'
      }
    } else if (leastConfident === 'communication' || experience === 'none') {
      return {
        recommendedType: 'hr',
        confidence: 85,
        reasoning: 'HR interviews are a great starting point to build general communication confidence and interview basics.',
        nextSteps: 'Progress to behavioral interviews to work on storytelling and examples.'
      }
    } else {
      return {
        recommendedType: 'behavioral',
        confidence: 90,
        reasoning: 'Behavioral interviews help you master storytelling and the STAR method, which are valuable for all interview types.',
        nextSteps: 'Apply these storytelling skills to technical or HR interviews based on your target roles.'
      }
    }
  }

  const handleQuizAnswer = (questionId, answer) => {
    const currentQ = quizQuestions[currentQuestion]
    if (currentQ.type === 'multiple') {
      const currentAnswers = quizAnswers[questionId] || []
      const newAnswers = currentAnswers.includes(answer) 
        ? currentAnswers.filter(a => a !== answer)
        : [...currentAnswers, answer]
      setQuizAnswers(prev => ({ ...prev, [questionId]: newAnswers }))
    } else {
      setQuizAnswers(prev => ({ ...prev, [questionId]: answer }))
    }
  }

  const nextQuestion = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    } else {
      // Quiz completed, get AI recommendation
      getAIRecommendation(quizAnswers)
    }
  }

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
    }
  }

  const resetQuiz = () => {
    setShowQuiz(false)
    setCurrentQuestion(0)
    setQuizAnswers({})
    setQuizResult(null)
  }

  const startQuiz = () => {
    setShowQuiz(true)
    setCurrentQuestion(0)
    setQuizAnswers({})
    setQuizResult(null)
  }

  return (
    <div style={styles.container}>
      <div style={styles.mainContent}>
        {/* ====== Hero Section with 3D Visual ====== */}
        <div style={styles.heroSection}>
          <div style={styles.heroContent}>
            <div>
              <span style={styles.heroBadge}>Interview</span>
              <span style={styles.heroBadge}>Analysis</span>
              <span style={styles.heroBadge}>Get result</span>
            </div>
            
            <h1 style={styles.heroTitle}>
              The future of<br />intelligence.
            </h1>
            <p style={styles.heroSubtitle}>
              Generate insights with depth and scale using AI InterviewPro
            </p>
            <div style={{
              display: 'flex',
              gap: '1rem',
              flexWrap: 'wrap'
            }}>
             
             
            </div>
          </div>

          <div style={styles.heroVisual}>
            <div style={styles.blob3D}>
              <div style={{
                width: '100%',
                height: '100%',
                backgroundImage: 'radial-gradient(circle, rgba(255, 255, 255, 0.3) 2px, transparent 2px)',
                backgroundSize: '20px 20px',
                borderRadius: 'inherit'
              }}></div>
            </div>
            <div style={{
              position: 'absolute',
              bottom: '20%',
              right: '10%',
              background: 'white',
              borderRadius: '50%',
              width: '80px',
              height: '80px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
              cursor: 'pointer',
              animation: 'float 3s ease-in-out infinite'
            }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="#667eea">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
          </div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '32px',
          padding: '4rem 2rem',
          marginBottom: '3rem',
          color: 'white',
          textAlign: 'center',
          boxShadow: '0 25px 60px rgba(102, 126, 234, 0.3)'
        }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: '800',
            marginBottom: '1rem',
            fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            letterSpacing: '-0.02em'
          }}>The modern research platform</h2>
          <p style={{
            fontSize: '1.2rem',
            opacity: 0.9,
            marginBottom: '4rem',
            maxWidth: '600px',
            margin: '0 auto 4rem',
            fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            fontWeight: '400',
            lineHeight: '1.6'
          }}>Our AI interview scheduler, conducts and analyzes findings so you can<br />gain a deeper understanding of your customers and product.</p>
          
          <div style={{...styles.grid, ...styles.gridCols3, gap: '2rem'}}>
            <div style={{
              ...styles.processStep,
              boxShadow: '0 15px 40px rgba(102, 126, 234, 0.3)'
            }}>
              <div style={styles.stepNumber}>01</div>
              <h3 style={{
                fontSize: '1.5rem', 
                fontWeight: '600', 
                marginBottom: '1rem',
                fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
              }}>Set your learning goals</h3>
              <p style={{opacity: 0.9, marginBottom: '2rem', lineHeight: '1.6'}}>Intelligent research objectives to make the most out of every interview.</p>
              
              <div style={styles.mockInterface}>
                <div style={{fontSize: '0.875rem', opacity: 0.8, marginBottom: '1rem'}}>What's your research objective?</div>
                <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem'}}>
                  <div style={{width: '4px', height: '4px', borderRadius: '50%', background: 'white'}}></div>
                  <span style={{fontSize: '0.875rem'}}>Smart suggestions</span>
                </div>
                <div style={{height: '1px', background: 'rgba(255, 255, 255, 0.2)', margin: '1rem 0'}}></div>
                <div style={{height: '1px', background: 'rgba(255, 255, 255, 0.2)', margin: '1rem 0'}}></div>
               
              </div>
            </div>
            
            <div style={{
              ...styles.processStep,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              boxShadow: '0 15px 40px rgba(102, 126, 234, 0.3)'
            }}>
              <div style={styles.stepNumber}>02</div>
              <h3 style={{
                fontSize: '1.5rem', 
                fontWeight: '600', 
                marginBottom: '1rem',
                fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
              }}>Conduct your interview</h3>
              <p style={{opacity: 0.9, marginBottom: '2rem', lineHeight: '1.6'}}>Intelligent research objectives to make the most out of every interview.</p>
              
              <div style={styles.mockInterface}>
                <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem'}}>
                  <span style={{fontSize: '1.25rem'}}>🎯</span>
                  <span style={{fontSize: '0.875rem', fontWeight: '500'}}>Helen Kim Practice</span>
                </div>
                <div style={{fontSize: '0.875rem', opacity: 0.8}}>Digital interviewer</div>
                <div style={{height: '1px', background: 'rgba(255, 255, 255, 0.2)', margin: '1rem 0'}}></div>
                
              </div>
            </div>
            
            <div style={{
              ...styles.processStep,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              boxShadow: '0 15px 40px rgba(102, 126, 234, 0.3)'
            }}>
              <div style={styles.stepNumber}>03</div>
              <h3 style={{
                fontSize: '1.5rem', 
                fontWeight: '600', 
                marginBottom: '1rem',
                fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
              }}>Analyze the results</h3>
              <p style={{opacity: 0.9, marginBottom: '2rem', lineHeight: '1.6'}}>Intelligent research objectives to make the most out of every interview.</p>
              
              <div style={styles.mockInterface}>
                <div style={{fontSize: '0.875rem', opacity: 0.8, marginBottom: '1rem'}}>Analyze the results</div>
                <div style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  background: 'conic-gradient(#10b981 0deg 216deg, #f59e0b 216deg 288deg, #ef4444 288deg 360deg)',
                  margin: '0 auto 1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative'
                }}>
                  <div style={{
                    width: '70px',
                    height: '70px',
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.875rem',
                    fontWeight: '600'
                  }}>85%</div>
                </div>
                
              </div>
            </div>
          </div>
        </div>

        {/* ====== Performance Analytics ====== */}
        {analytics.totalSessions > 0 && (
          <div style={{
            ...styles.card,
            background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
            marginBottom: '2rem'
          }}>
            <h2 style={{...styles.sectionTitle, marginBottom: '2rem'}}>
              📊 Performance Analytics
            </h2>
            <div style={{...styles.grid, ...styles.gridCols4}}>
              <div style={{
                ...styles.statCard,
                background: 'white'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  fontSize: '1.5rem'
                }}>🎯</div>
                <div style={styles.statValue}>{analytics.totalSessions}</div>
                <div style={styles.statLabel}>Total Sessions</div>
              </div>
              <div style={{
                ...styles.statCard,
                background: 'white'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  fontSize: '1.5rem'
                }}>📈</div>
                <div style={styles.statValue}>{analytics.averageScore}%</div>
                <div style={styles.statLabel}>Average Score</div>
                {analytics.recentImprovement !== 0 && (
                  <div style={{
                    fontSize: '0.8rem',
                    marginTop: '0.5rem',
                    color: analytics.recentImprovement >= 0 ? '#059669' : '#dc2626',
                    fontWeight: '500'
                  }}>
                    {analytics.recentImprovement >= 0 ? '↗' : '↘'} {Math.abs(analytics.recentImprovement)}%
                  </div>
                )}
              </div>
              <div style={{
                ...styles.statCard,
                background: 'white'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  fontSize: '1.5rem'
                }}>⏱️</div>
                <div style={styles.statValue}>{analytics.totalTime}m</div>
                <div style={styles.statLabel}>Practice Time</div>
              </div>
              <div style={{
                ...styles.statCard,
                background: 'white'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  fontSize: '1.5rem'
                }}>🏆</div>
                <div style={styles.statValue}>{analytics.bestScore}%</div>
                <div style={styles.statLabel}>Best Score</div>
              </div>
            </div>
          </div>
        )}

       
        {/* main part AI*/}
        <div style={{
          background: 'white',
          borderRadius: '32px',
          padding: '4rem 3rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          border: '1px solid #f1f5f9',
          marginBottom: '3rem'
        }}>
          <div style={{textAlign: 'center', marginBottom: '4rem'}}>
            <h2 style={{
              fontSize: '3rem',
              fontWeight: '800',
              color: '#1e293b',
              marginBottom: '1.5rem',
              lineHeight: '1.2'
            }}>
              Let's Start
            </h2>
            <p style={{
              color: '#64748b',
              fontSize: '1.2rem',
              lineHeight: '1.8',
              maxWidth: '700px',
              margin: '0 auto'
            }}>
              Choose your interview type and start practicing with our AI-powered platform.<br />
              Each session is designed to boost your confidence and skills.
            </p>
          </div>

          <div style={{...styles.grid, ...styles.gridCols3, gap: '2.5rem'}}>
            {[
              {
                type: "behavioral",
                title: "Behavioral Interview",
                desc: "Practice STAR method responses and behavioral questions",
                icon: "🧠",
                gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                bgGradient: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
                color: "#667eea",
                number: "01",
                features: ["STAR Method Training", "Common Scenarios", "Soft Skills Assessment"]
              },
              {
                type: "hr",
                title: "HR Screening",
                desc: "Prepare for HR questions about company fit and background",
                icon: "👥",
                gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                bgGradient: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
                color: "#667eea",
                number: "02",
                features: ["Company Culture Fit", "Background Check", "Salary Negotiation"]
              },
              {
                type: "technical",
                title: "Technical Interview",
                desc: "Challenge yourself with domain-specific technical questions",
                icon: "💻",
                gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                bgGradient: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
                color: "#667eea",
                number: "03",
                features: ["Coding Challenges", "System Design", "Technical Concepts"]
              }
            ].map((interview, index) => (
              <div
                key={interview.type}
                style={{
                  background: interview.bgGradient,
                  borderRadius: '28px',
                  padding: '3rem 2.5rem',
                  cursor: 'pointer',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  border: `2px solid transparent`,
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-12px) scale(1.02)'
                  e.currentTarget.style.boxShadow = '0 30px 70px rgba(0, 0, 0, 0.15)'
                  e.currentTarget.style.borderColor = interview.color
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)'
                  e.currentTarget.style.boxShadow = 'none'
                  e.currentTarget.style.borderColor = 'transparent'
                }}
                onClick={() => startInterview(interview.type)}
              >
                <div style={{
                  position: 'absolute',
                  top: '-50px',
                  right: '-50px',
                  width: '150px',
                  height: '150px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: '50%',
                  opacity: '0.1',
                  filter: 'blur(40px)'
                }}></div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '2.5rem',
                  position: 'relative',
                  zIndex: 1
                }}>
                  <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '20px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2rem',
                    boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)',
                    transition: 'all 0.3s ease'
                  }}>
                    {interview.icon}
                  </div>
                  <div style={{
                    background: 'white',
                    color: '#667eea',
                    padding: '0.5rem 1rem',
                    borderRadius: '16px',
                    fontSize: '1.25rem',
                    fontWeight: '800',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
                  }}>
                    {interview.number}
                  </div>
                </div>

                <h3 style={{
                  fontSize: '1.75rem',
                  fontWeight: '800',
                  color: '#1e293b',
                  marginBottom: '1rem',
                  lineHeight: '1.2'
                }}>
                  {interview.title}
                </h3>
                <p style={{
                  color: '#64748b',
                  fontSize: '1rem',
                  lineHeight: '1.7',
                  marginBottom: '2rem'
                }}>
                  {interview.desc}
                </p>

                <div style={{marginBottom: '2.5rem'}}>
                  {interview.features.map((feature, idx) => (
                    <div key={idx} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      marginBottom: '1rem',
                      padding: '0.75rem',
                      background: 'white',
                      borderRadius: '12px',
                      transition: 'all 0.3s ease'
                    }}>
                      <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        flexShrink: 0
                      }}></div>
                      <span style={{
                        fontSize: '0.95rem',
                        color: '#475569',
                        fontWeight: '500'
                      }}>{feature}</span>
                    </div>
                  ))}
                </div>

                <button style={{
                  width: '100%',
                  background: interview.gradient,
                  color: 'white',
                  border: 'none',
                  borderRadius: '16px',
                  padding: '1.25rem',
                  fontSize: '1.1rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: `0 10px 25px ${interview.color}30`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.75rem'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = `0 15px 35px ${interview.color}40`
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = `0 10px 25px ${interview.color}30`
                }}>
                  Start Practice
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </button>

                <div style={{
                  position: 'absolute',
                  bottom: '-30px',
                  left: '-30px',
                  width: '100px',
                  height: '100px',
                  background: interview.gradient,
                  borderRadius: '50%',
                  opacity: '0.08'
                }}></div>
              </div>
            ))}
          </div>

          {/* AI Quiz Section */}
          {!showQuiz ? (
            <div style={{
              marginTop: '4rem',
              padding: '2.5rem',
              background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
              borderRadius: '24px',
              border: '2px dashed #cbd5e1',
              textAlign: 'center'
            }}>
              <div style={{fontSize: '2.5rem', marginBottom: '1rem'}}>🎯</div>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#1e293b',
                marginBottom: '0.75rem'
              }}>
                Not sure where to start?
              </h3>
              <p style={{
                color: '#64748b',
                fontSize: '1rem',
                marginBottom: '1.5rem'
              }}>
                Try our AI-powered recommendation quiz to find the perfect interview type for you
              </p>
              <button 
                onClick={startQuiz}
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '1rem 2rem',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  boxShadow: '0 10px 25px rgba(102, 126, 234, 0.25)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 15px 35px rgba(102, 126, 234, 0.35)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 10px 25px rgba(102, 126, 234, 0.25)'
                }}
              >
                Take the Quiz 🚀
              </button>
            </div>
          ) : (
            /* Quiz Interface */
            <div style={{
              marginTop: '4rem',
              background: 'white',
              borderRadius: '32px',
              padding: '3rem',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e2e8f0'
            }}>
              {!quizResult ? (
                <>
                  {/* Quiz Header */}
                  <div style={{
                    textAlign: 'center',
                    marginBottom: '3rem'
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '2rem'
                    }}>
                      <h2 style={{
                        fontSize: '2rem',
                        fontWeight: '700',
                        color: '#1e293b',
                        margin: 0
                      }}>
                         Interview Quiz
                      </h2>
                      <button
                        onClick={resetQuiz}
                        style={{
                          background: 'transparent',
                          border: '2px solid #e2e8f0',
                          borderRadius: '12px',
                          padding: '0.5rem 1rem',
                          cursor: 'pointer',
                          color: '#64748b'
                        }}
                      >
                        ✕ Close
                      </button>
                    </div>
                    <div style={{
                      background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
                      borderRadius: '12px',
                      padding: '1rem',
                      marginBottom: '1rem'
                    }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '0.9rem',
                        color: '#64748b',
                        marginBottom: '0.5rem'
                      }}>
                        <span>Question {currentQuestion + 1} of {quizQuestions.length}</span>
                        <span>{Math.round(((currentQuestion) / quizQuestions.length) * 100)}% Complete</span>
                      </div>
                      <div style={{
                        background: '#e2e8f0',
                        borderRadius: '8px',
                        height: '8px',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          height: '100%',
                          width: `${((currentQuestion) / quizQuestions.length) * 100}%`,
                          transition: 'width 0.3s ease'
                        }}></div>
                      </div>
                    </div>
                  </div>

                  {/* Current Question */}
                  {quizQuestions[currentQuestion] && (
                    <div style={{marginBottom: '3rem'}}>
                      <h3 style={{
                        fontSize: '1.5rem',
                        fontWeight: '600',
                        color: '#1e293b',
                        marginBottom: '2rem',
                        textAlign: 'center'
                      }}>
                        {quizQuestions[currentQuestion].question}
                      </h3>
                      
                      <div style={{
                        display: 'grid',
                        gap: '1rem',
                        maxWidth: '600px',
                        margin: '0 auto'
                      }}>
                        {quizQuestions[currentQuestion].options.map((option) => {
                          const isSelected = quizQuestions[currentQuestion].type === 'multiple'
                            ? (quizAnswers[quizQuestions[currentQuestion].id] || []).includes(option.value)
                            : quizAnswers[quizQuestions[currentQuestion].id] === option.value
                          
                          return (
                            <button
                              key={option.value}
                              onClick={() => handleQuizAnswer(quizQuestions[currentQuestion].id, option.value)}
                              style={{
                                background: isSelected 
                                  ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                                  : 'white',
                                color: isSelected ? 'white' : '#374151',
                                border: `2px solid ${isSelected ? '#667eea' : '#e2e8f0'}`,
                                borderRadius: '16px',
                                padding: '1.25rem 1.5rem',
                                fontSize: '1rem',
                                fontWeight: '500',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                textAlign: 'left',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem'
                              }}
                              onMouseEnter={(e) => {
                                if (!isSelected) {
                                  e.currentTarget.style.borderColor = '#667eea'
                                  e.currentTarget.style.transform = 'translateY(-2px)'
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (!isSelected) {
                                  e.currentTarget.style.borderColor = '#e2e8f0'
                                  e.currentTarget.style.transform = 'translateY(0)'
                                }
                              }}
                            >
                              <div style={{
                                width: '20px',
                                height: '20px',
                                borderRadius: '50%',
                                border: `2px solid ${isSelected ? 'white' : '#cbd5e1'}`,
                                background: isSelected ? 'white' : 'transparent',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0
                              }}>
                                {isSelected && (
                                  <div style={{
                                    width: '8px',
                                    height: '8px',
                                    borderRadius: '50%',
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                                  }}></div>
                                )}
                              </div>
                              {option.label}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* Navigation Buttons */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    maxWidth: '600px',
                    margin: '0 auto'
                  }}>
                    <button
                      onClick={prevQuestion}
                      disabled={currentQuestion === 0}
                      style={{
                        background: currentQuestion === 0 ? '#f1f5f9' : 'white',
                        color: currentQuestion === 0 ? '#94a3b8' : '#374151',
                        border: '2px solid #e2e8f0',
                        borderRadius: '12px',
                        padding: '0.75rem 1.5rem',
                        fontSize: '1rem',
                        fontWeight: '500',
                        cursor: currentQuestion === 0 ? 'not-allowed' : 'pointer',
                        opacity: currentQuestion === 0 ? 0.5 : 1
                      }}
                    >
                      ← Previous
                    </button>
                    
                    <button
                      onClick={nextQuestion}
                      disabled={!quizAnswers[quizQuestions[currentQuestion]?.id]}
                      style={{
                        background: quizAnswers[quizQuestions[currentQuestion]?.id] 
                          ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                          : '#f1f5f9',
                        color: quizAnswers[quizQuestions[currentQuestion]?.id] ? 'white' : '#94a3b8',
                        border: 'none',
                        borderRadius: '12px',
                        padding: '0.75rem 1.5rem',
                        fontSize: '1rem',
                        fontWeight: '600',
                        cursor: quizAnswers[quizQuestions[currentQuestion]?.id] ? 'pointer' : 'not-allowed',
                        opacity: quizAnswers[quizQuestions[currentQuestion]?.id] ? 1 : 0.5,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      {currentQuestion === quizQuestions.length - 1 ? (
                        <>Get Recommendation 🎯</>
                      ) : (
                        <>Next →</>
                      )}
                    </button>
                  </div>
                </>
              ) : (
                /* Quiz Results */
                <div style={{textAlign: 'center'}}>
                  {quizLoading ? (
                    <div>
                      <div style={{fontSize: '4rem', marginBottom: '2rem'}}>🤖</div>
                      <h2 style={{
                        fontSize: '2rem',
                        fontWeight: '700',
                        color: '#1e293b',
                        marginBottom: '1rem'
                      }}>
                        AI is analyzing your responses...
                      </h2>
                      <div style={styles.loadingSpinner}></div>
                    </div>
                  ) : (
                    <div>
                      <div style={{fontSize: '4rem', marginBottom: '2rem'}}>✨</div>
                      <h2 style={{
                        fontSize: '2.5rem',
                        fontWeight: '700',
                        color: '#1e293b',
                        marginBottom: '1rem'
                      }}>
                        Perfect Match Found!
                      </h2>
                      
                      <div style={{
                        background: `linear-gradient(135deg, ${
                          quizResult.recommendedType === 'behavioral' ? '#667eea 0%, #764ba2 100%' :
                          quizResult.recommendedType === 'hr' ? '#8b5cf6 0%, #ec4899 100%' :
                          '#f59e0b 0%, #ef4444 100%'
                        })`,
                        borderRadius: '24px',
                        padding: '3rem',
                        color: 'white',
                        marginBottom: '2rem',
                        maxWidth: '600px',
                        margin: '0 auto 2rem'
                      }}>
                        <div style={{fontSize: '3rem', marginBottom: '1rem'}}>
                          {getTypeIcon(quizResult.recommendedType)}
                        </div>
                        <h3 style={{
                          fontSize: '2rem',
                          fontWeight: '700',
                          marginBottom: '1rem',
                          textTransform: 'capitalize'
                        }}>
                          {quizResult.recommendedType} Interview
                        </h3>
                        <div style={{
                          background: 'rgba(255, 255, 255, 0.2)',
                          borderRadius: '16px',
                          padding: '1.5rem',
                          marginBottom: '2rem'
                        }}>
                          <div style={{fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.5rem'}}>
                            {quizResult.confidence}% Confidence Match
                          </div>
                          <p style={{fontSize: '1.1rem', lineHeight: '1.6'}}>
                            {quizResult.reasoning}
                          </p>
                        </div>
                        <button
                          onClick={() => startInterview(quizResult.recommendedType)}
                          style={{
                            background: 'white',
                            color: '#1e293b',
                            border: 'none',
                            borderRadius: '16px',
                            padding: '1rem 2rem',
                            fontSize: '1.1rem',
                            fontWeight: '700',
                            cursor: 'pointer',
                            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)'
                          }}
                        >
                          Start {quizResult.recommendedType} Interview 🚀
                        </button>
                      </div>
                      
                      <div style={{
                        background: '#f8fafc',
                        borderRadius: '20px',
                        padding: '2rem',
                        marginBottom: '2rem',
                        textAlign: 'left'
                      }}>
                        <h4 style={{
                          fontSize: '1.25rem',
                          fontWeight: '600',
                          color: '#1e293b',
                          marginBottom: '1rem'
                        }}>
                          📚 Next Steps:
                        </h4>
                        <p style={{
                          color: '#64748b',
                          fontSize: '1rem',
                          lineHeight: '1.6'
                        }}>
                          {quizResult.nextSteps}
                        </p>
                      </div>
                      
                      <div style={{
                        display: 'flex',
                        gap: '1rem',
                        justifyContent: 'center'
                      }}>
                        <button
                          onClick={resetQuiz}
                          style={{
                            background: 'white',
                            color: '#64748b',
                            border: '2px solid #e2e8f0',
                            borderRadius: '12px',
                            padding: '0.75rem 1.5rem',
                            fontSize: '1rem',
                            fontWeight: '500',
                            cursor: 'pointer'
                          }}
                        >
                          Take Quiz Again
                        </button>
                        <button
                          onClick={() => setShowQuiz(false)}
                          style={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '12px',
                            padding: '0.75rem 1.5rem',
                            fontSize: '1rem',
                            fontWeight: '600',
                            cursor: 'pointer'
                          }}
                        >
                          Explore All Types
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ====== Session Breakdown ====== */}
        {analytics.totalSessions > 0 && (
          <div style={styles.card}>
            <h2 style={styles.sectionTitle}>
              <span>📈</span>
              Session Breakdown
            </h2>
            <div style={{...styles.grid, ...styles.gridCols3}}>
              {Object.entries(analytics.sessionsByType).map(([type, count]) => (
                <div key={type} style={{
                  ...styles.statCard,
                  background: 'white',
                  border: '2px solid #e5e7eb'
                }}>
                  <div style={{fontSize: '2rem', marginBottom: '1rem'}}>
                    {getTypeIcon(type)}
                  </div>
                  <div style={styles.statValue}>{count}</div>
                  <div style={{...styles.statLabel, textTransform: 'capitalize'}}>
                    {type} Sessions
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

       
        {/* resume upload */}
        <div style={{
          background: 'white',
          borderRadius: '32px',
          padding: '3rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          border: '1px solid #f1f5f9',
          marginBottom: '3rem'
        }}>
          <div style={{
            textAlign: 'center',
            marginBottom: '2.5rem'
          }}>
            <h2 style={{
              fontSize: '2.5rem',
              fontWeight: '700',
              color: '#1e293b',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem'
            }}>
              <span style={{fontSize: '2rem'}}>📄</span>
              Resume Analysis
            </h2>
            <p style={{
              color: '#64748b',
              fontSize: '1.1rem',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              Upload your resume to unlock personalized interview questions tailored to your experience
            </p>
          </div>

          <div style={{
            border: '3px dashed #cbd5e1',
            borderRadius: '24px',
            padding: '3.5rem 2rem',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
            position: 'relative',
            overflow: 'hidden'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#667eea'
            e.currentTarget.style.background = 'linear-gradient(135deg, #f0f4ff 0%, #e5edff 100%)'
            e.currentTarget.style.transform = 'translateY(-4px)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#cbd5e1'
            e.currentTarget.style.background = 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'
            e.currentTarget.style.transform = 'translateY(0)'
          }}>
            <label style={{
              cursor: 'pointer',
              display: 'block',
              width: '100%'
            }}>
              {!resume ? (
                <div>
                  <div style={{
                    width: '100px',
                    height: '100px',
                    margin: '0 auto 1.5rem',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 20px 40px rgba(102, 126, 234, 0.3)'
                  }}>
                    <span style={{fontSize: '3rem'}}>📤</span>
                  </div>
                  <h3 style={{
                    fontSize: '1.5rem',
                    fontWeight: '700',
                    marginBottom: '0.75rem',
                    color: '#1e293b'
                  }}>
                    Upload Your Resume
                  </h3>
                  <p style={{
                    color: '#64748b',
                    fontSize: '1rem',
                    marginBottom: '1.5rem',
                    lineHeight: '1.6'
                  }}>
                    Get personalized interview questions based on your experience
                  </p>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: 'white',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '12px',
                    fontSize: '0.875rem',
                    color: '#64748b',
                    border: '1px solid #e2e8f0'
                  }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                      <polyline points="13 2 13 9 20 9"></polyline>
                    </svg>
                    PDF format only, max 5MB
                  </div>
                </div>
              ) : (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'white',
                  padding: '2rem',
                  borderRadius: '20px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
                }}>
                  <div style={{display: 'flex', alignItems: 'center', gap: '1.5rem'}}>
                    <div style={{
                      width: '80px',
                      height: '80px',
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '2.5rem'
                    }}>
                      ✅
                    </div>
                    <div style={{textAlign: 'left'}}>
                      <p style={{
                        fontWeight: '700',
                        color: '#059669',
                        marginBottom: '0.5rem',
                        fontSize: '1.25rem'
                      }}>
                        {resume}
                      </p>
                      <p style={{fontSize: '0.9rem', color: '#64748b'}}>
                        Resume uploaded successfully • Ready for analysis
                      </p>
                    </div>
                  </div>
                  {resumeAnalysis && (
                    <div style={{
                      background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
                      padding: '1.5rem',
                      borderRadius: '16px',
                      border: '1px solid #0ea5e9',
                      textAlign: 'left',
                      minWidth: '280px'
                    }}>
                      <div style={{
                        fontSize: '0.875rem',
                        color: '#0c4a6e',
                        marginBottom: '0.75rem',
                        fontWeight: '600'
                      }}>
                        <strong>📊 Analysis Results:</strong>
                      </div>
                      <div style={{fontSize: '0.875rem', color: '#0c4a6e', marginBottom: '0.5rem'}}>
                        <strong>Skills:</strong> {resumeAnalysis.skills?.slice(0, 3).join(", ")}
                      </div>
                      <div style={{fontSize: '0.875rem', color: '#0c4a6e'}}>
                        <strong>Experience:</strong> {resumeAnalysis.yearsExperience} years
                      </div>
                    </div>
                  )}
                </div>
              )}
              <input 
                type="file" 
                accept=".pdf" 
                onChange={handleResumeUpload} 
                disabled={uploading}
                style={{display: 'none'}}
              />
            </label>
            {uploading && (
              <div style={{
                marginTop: '1.5rem',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '1rem'
              }}>
                <div style={styles.loadingSpinner}></div>
                <span style={{
                  color: '#667eea',
                  fontWeight: '600',
                  fontSize: '1rem'
                }}>Analyzing your resume...</span>
              </div>
            )}
          </div>
        </div>


        {/* ====== Practice History ====== */}
        <div style={styles.card}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem'}}>
            <h2 style={{...styles.sectionTitle, marginBottom: 0}}>
              <span>📚</span>
              Practice History
            </h2>
            {sessions.length > 0 && (
              <div style={{
                ...styles.badge,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white'
              }}>
                {sessions.length} Sessions
              </div>
            )}
          </div>

          {loading ? (
            <div style={{...styles.emptyState, padding: '3rem'}}>
              <div style={styles.loadingSpinner}></div>
              <p style={{marginTop: '1rem', fontSize: '1.1rem'}}>Loading your practice sessions...</p>
            </div>
          ) : sessions.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={{fontSize: '5rem'}}>🎯</div>
              <h3 style={{fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem', color: '#374151'}}>
                Ready to Start?
              </h3>
              <p style={{fontSize: '1.1rem', marginBottom: '0.5rem'}}>No practice sessions yet</p>
              <p style={{fontSize: '0.9rem', color: '#9ca3af'}}>
                Choose an interview type above to begin your journey!
              </p>
            </div>
          ) : (
            <div>
              <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                {sessions.map((session, index) => {
                  const scoreColors = getScoreColor(session.score)
                  return (
                    <div
                      key={session._id}
                      style={{
                        ...styles.sessionCard,
                        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)'
                        e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.1)'
                        e.currentTarget.style.borderColor = '#667eea'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)'
                        e.currentTarget.style.boxShadow = 'none'
                        e.currentTarget.style.borderColor = '#e5e7eb'
                      }}
                    >
                      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                        <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                          <div style={{fontSize: '2rem'}}>
                            {getTypeIcon(session.type)}
                          </div>
                          <div>
                            <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem'}}>
                              <h3 style={{
                                fontSize: '1.1rem',
                                fontWeight: '600',
                                color: '#1f2937',
                                textTransform: 'capitalize'
                              }}>
                                {session.type} Interview
                              </h3>
                              {index === 0 && (
                                <div style={{
                                  ...styles.badge,
                                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                  color: 'white'
                                }}>
                                  Latest
                                </div>
                              )}
                            </div>
                            <p style={{
                              fontSize: '0.85rem',
                              color: '#6b7280'
                            }}>
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
                        <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                          <div style={{textAlign: 'right'}}>
                            <div style={{fontSize: '0.85rem', color: '#6b7280', marginBottom: '0.25rem'}}>
                              <strong>{session.duration}min</strong> practice
                            </div>
                            {session.feedback?.overall && (
                              <p style={{
                                fontSize: '0.75rem',
                                color: '#9ca3af',
                                maxWidth: '200px',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                              }}>
                                "{session.feedback.overall}"
                              </p>
                            )}
                          </div>
                          <div style={{
                            background: scoreColors.bg,
                            color: scoreColors.color,
                            padding: '0.75rem 1rem',
                            borderRadius: '12px',
                            fontWeight: '700',
                            fontSize: '1.1rem',
                            minWidth: '60px',
                            textAlign: 'center'
                          }}>
                            {session.score}%
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {sessions.length >= 2 && (
                <div style={{
                  marginTop: '2rem',
                  padding: '1.5rem',
                  background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
                  borderRadius: '16px',
                  border: '1px solid #0ea5e9'
                }}>
                  <h3 style={{
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    color: '#0c4a6e',
                    marginBottom: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <span>📊</span>
                    Performance Trend
                  </h3>
                  <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                    {analytics.recentImprovement >= 0 ? (
                      <>
                        <span style={{fontSize: '1.2rem'}}>📈</span>
                        <span style={{color: '#059669', fontWeight: '600'}}>Improving!</span>
                        <span style={{color: '#0c4a6e'}}>
                          +{analytics.recentImprovement}% growth since first session
                        </span>
                      </>
                    ) : (
                      <>
                        <span style={{fontSize: '1.2rem'}}>📉</span>
                        <span style={{color: '#ea580c', fontWeight: '600'}}>Room for improvement</span>
                        <span style={{color: '#0c4a6e'}}>
                          {analytics.recentImprovement}% change since first session
                        </span>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
