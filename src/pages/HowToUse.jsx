"use client"

export default function HowToUse() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 py-16">
      <div className="max-w-6xl mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-6">
            How to Use InterviewPro
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Get started with your interview preparation in just a few simple steps
          </p>
        </div>

        {/* Steps Section */}
        <div className="space-y-12 mb-16">
          {/* Step 1 */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    1
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 ml-4">Access Dashboard</h2>
                </div>
                <p className="text-gray-600 text-lg leading-relaxed mb-4">
                  Click on the "Dashboard" button in the navigation bar to access your interview preparation center. 
                  This is where you'll manage all your practice sessions and view your progress.
                </p>
                <ul className="text-gray-600 space-y-2">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    View your practice session history
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    Track your improvement over time
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    Start new interview sessions
                  </li>
                </ul>
              </div>
              <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl p-6 text-center">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <p className="text-gray-700 font-medium">Your Personal Dashboard</p>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="order-2 md:order-1">
                <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl p-6 text-center">
                  <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <svg className="w-12 h-12 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <p className="text-gray-700 font-medium">Upload Your Resume</p>
                </div>
              </div>
              <div className="order-1 md:order-2">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    2
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 ml-4">Upload Resume</h2>
                </div>
                <p className="text-gray-600 text-lg leading-relaxed mb-4">
                  Upload your resume to get personalized interview questions tailored to your skills and experience. 
                  Our AI analyzes your background to create relevant questions.
                </p>
                <ul className="text-gray-600 space-y-2">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                    Supports PDF, DOC, and DOCX formats
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                    AI extracts skills and experience
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                    Generates personalized questions
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    3
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 ml-4">Choose Question Type</h2>
                </div>
                <p className="text-gray-600 text-lg leading-relaxed mb-4">
                  Select from different types of interview questions to practice various aspects of the interview process. 
                  Each type focuses on different skills and scenarios.
                </p>
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                    <span className="w-3 h-3 bg-blue-500 rounded-full mr-3"></span>
                    <span className="font-medium text-blue-800">Technical Questions</span>
                  </div>
                  <div className="flex items-center p-3 bg-green-50 rounded-lg">
                    <span className="w-3 h-3 bg-green-500 rounded-full mr-3"></span>
                    <span className="font-medium text-green-800">HR Questions</span>
                  </div>
                  <div className="flex items-center p-3 bg-purple-50 rounded-lg">
                    <span className="w-3 h-3 bg-purple-500 rounded-full mr-3"></span>
                    <span className="font-medium text-purple-800">Behavioral Questions</span>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-green-100 to-blue-100 rounded-xl p-6 text-center">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-gray-700 font-medium">Select Question Category</p>
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="order-2 md:order-1">
                <div className="bg-gradient-to-br from-orange-100 to-red-100 rounded-xl p-6 text-center">
                  <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <svg className="w-12 h-12 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-gray-700 font-medium">Start Recording</p>
                </div>
              </div>
              <div className="order-1 md:order-2">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    4
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 ml-4">Practice Interview</h2>
                </div>
                <p className="text-gray-600 text-lg leading-relaxed mb-4">
                  Start your practice session! Answer questions while our AI analyzes your performance in real-time. 
                  Make sure your camera and microphone are enabled for the best experience.
                </p>
                <ul className="text-gray-600 space-y-2">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
                    Real-time emotion detection
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
                    Eye contact analysis
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
                    Body language assessment
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Step 5 */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    5
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 ml-4">Review Feedback</h2>
                </div>
                <p className="text-gray-600 text-lg leading-relaxed mb-4">
                  After completing your session, receive detailed feedback on your performance. Use these insights 
                  to improve your interview skills and build confidence for real interviews.
                </p>
                <ul className="text-gray-600 space-y-2">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></span>
                    Detailed performance metrics
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></span>
                    Areas for improvement
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></span>
                    Strengths and recommendations
                  </li>
                </ul>
              </div>
              <div className="bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl p-6 text-center">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <svg className="w-12 h-12 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <p className="text-gray-700 font-medium">Get Detailed Feedback</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tips Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
          <h2 className="text-3xl font-bold text-center mb-8">Pro Tips for Better Practice</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Technical Setup</h3>
              <ul className="space-y-3 text-blue-100">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-white rounded-full mr-3 mt-2 flex-shrink-0"></span>
                  <span>Ensure good lighting on your face</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-white rounded-full mr-3 mt-2 flex-shrink-0"></span>
                  <span>Use a quiet environment</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-white rounded-full mr-3 mt-2 flex-shrink-0"></span>
                  <span>Position camera at eye level</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-white rounded-full mr-3 mt-2 flex-shrink-0"></span>
                  <span>Test your audio quality</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Interview Best Practices</h3>
              <ul className="space-y-3 text-blue-100">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-white rounded-full mr-3 mt-2 flex-shrink-0"></span>
                  <span>Maintain eye contact with camera</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-white rounded-full mr-3 mt-2 flex-shrink-0"></span>
                  <span>Speak clearly and at moderate pace</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-white rounded-full mr-3 mt-2 flex-shrink-0"></span>
                  <span>Use confident body language</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-white rounded-full mr-3 mt-2 flex-shrink-0"></span>
                  <span>Practice regularly for improvement</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}