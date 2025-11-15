"use client"

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-16">
      <div className="max-w-6xl mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold bg-black bg-clip-text text-transparent mb-6">
            About InterviewPro
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Revolutionizing interview preparation through AI-powered feedback and real-time analysis
          </p>
        </div>

        {/* Mission Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-4">
                We believe that everyone deserves the opportunity to succeed in their career journey. InterviewPro was created 
                to democratize access to high-quality interview preparation, making it possible for anyone to practice and improve 
                their interview skills with cutting-edge AI technology.
              </p>
              <p className="text-gray-700 text-lg leading-relaxed">
                Our platform combines advanced emotion detection, body language analysis, and personalized feedback to help 
                candidates build confidence and improve their performance in real interviews.
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Why We Started</h3>
              <p className="text-blue-100 leading-relaxed">
                Traditional interview preparation methods are often expensive, inaccessible, and lack personalized feedback. 
                We wanted to create a solution that provides instant, actionable insights to help people improve their 
                interview performance effectively.
              </p>
            </div>
          </div>
        </div>

        {/* Features Showcase */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">What Makes Us Different</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">AI-Powered Analysis</h3>
              <p className="text-gray-600">
                Advanced computer vision and machine learning algorithms analyze your facial expressions, 
                eye contact, and body language in real-time.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Resume-Based Questions</h3>
              <p className="text-gray-600">
                Upload your resume and receive personalized interview questions tailored to your specific 
                skills, experience, and career background.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Instant Feedback</h3>
              <p className="text-gray-600">
                Get immediate, actionable feedback on your performance with detailed insights on areas 
                for improvement and strengths to build upon.
              </p>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white mb-12">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-6">Built by Innovators</h2>
            <p className="text-blue-100 text-lg max-w-3xl mx-auto leading-relaxed">
              Our team combines expertise in artificial intelligence, user experience design, and career development 
              to create a platform that truly makes a difference in people's professional lives. We're passionate 
              about using technology to level the playing field and help everyone reach their potential.
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid md:grid-cols-4 gap-8 text-center">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="text-3xl font-bold text-blue-600 mb-2">10K+</div>
            <div className="text-gray-600">Practice Sessions</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="text-3xl font-bold text-purple-600 mb-2">95%</div>
            <div className="text-gray-600">Success Rate</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="text-3xl font-bold text-green-600 mb-2">500+</div>
            <div className="text-gray-600">Companies</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="text-3xl font-bold text-orange-600 mb-2">24/7</div>
            <div className="text-gray-600">Available</div>
          </div>
        </div>
      </div>
    </div>
  )
}