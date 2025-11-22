"use client"

import { useNavigate } from "react-router-dom"
import { useEffect } from "react"

export default function Landing() {
  const navigate = useNavigate()

  // Add custom animations to document head
  useEffect(() => {
    if (typeof document !== 'undefined' && !document.querySelector('#landing-animations')) {
      const style = document.createElement('style')
      style.id = 'landing-animations'
      style.textContent = `
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
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
        
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        
        .animate-fade-in-left {
          animation: fadeInLeft 0.8s ease-out forwards;
        }
        
        .animate-fade-in-right {
          animation: fadeInRight 0.8s ease-out forwards;
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-scale-in {
          animation: scaleIn 0.6s ease-out forwards;
        }
        
        .animation-delay-200 {
          animation-delay: 0.2s;
          opacity: 0;
        }
        
        .animation-delay-400 {
          animation-delay: 0.4s;
          opacity: 0;
        }
        
        .animation-delay-600 {
          animation-delay: 0.6s;
          opacity: 0;
        }
        
        .animation-delay-800 {
          animation-delay: 0.8s;
          opacity: 0;
        }
      `
      document.head.appendChild(style)
    }
  }, [])

  return (
    <div className="space-y-0">
      {/* Hero Section - ENHANCED WITH IMAGE */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-purple-100 to-purple-500 rounded-full opacity-10 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-green-400 to-blue-500 rounded-full opacity-10 animate-pulse"></div>
          
          {/* Additional floating elements */}
          <div className="absolute top-20 right-1/4 w-20 h-20 bg-purple-200 rounded-full opacity-20 animate-float" style={{animationDelay: '0s'}}></div>
          <div className="absolute bottom-40 left-1/4 w-16 h-16 bg-blue-200 rounded-full opacity-20 animate-float" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/3 right-10 w-12 h-12 bg-green-200 rounded-full opacity-20 animate-float" style={{animationDelay: '2s'}}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 w-full">
          {/* Grid layout for text + image */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-center md:text-left space-y-8">
              <div className="animate-fade-in-left">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight mb-6">
                  Master Your Interviews with{" "}
                  <span className="bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
                    AI-Powered
                  </span>{" "}
                  Platform
                </h1>
                <p className="text-lg md:text-xl text-gray-600 font-semibold leading-relaxed">
                  Practice realistic mock interviews with real-time emotion detection, body language analysis, and personalized
                  feedback based on your resume. Build confidence and land your dream job. Just start (No SignUp required)
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start items-center pt-4 animate-fade-in-left animation-delay-200">
                <button
                  onClick={() => navigate("/dashboard")}
                  className="px-8 py-4 bg-gradient-to-r from-purple-500 to-purple-700 text-white text-lg font-semibold rounded-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 min-w-[200px]"
                >
                  Start Free Practice 
                </button>
                <button
                  onClick={() => navigate("/how-to-use")}
                  className="px-8 py-4 border-2 border-gray-300 text-black text-lg font-semibold rounded-lg hover:border-purple-500 hover:text-purple-600 transition-all duration-300 min-w-[200px]"
                >
                  Learn How It Works
                </button>
              </div>
              
              <div className="pt-4 animate-fade-in-left animation-delay-400">
                <p className="text-sm text-gray-500 mb-4">Tested by job seekers </p>
                <div className="flex flex-wrap justify-center md:justify-start items-center gap-8 opacity-60">
                  <div className="text-2xl font-bold text-gray-400">LLM</div>
                  <div className="text-2xl font-bold text-gray-400">Microsoft</div>
                  <div className="text-2xl font-bold text-gray-400">Amazon</div>
                  <div className="text-2xl font-bold text-gray-400">Meta</div>
                </div>
              </div>
            </div>

            {/* Right Image - NEW ADDITION */}
            <div className="relative animate-fade-in-right animation-delay-400">
              <div className="relative z-10">
                {/* Decorative background blob */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-blue-500 rounded-3xl transform rotate-6 scale-105 opacity-20 animate-pulse"></div>
                
                {/* Main image container */}
                <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden transform hover:scale-105 transition-transform duration-500">
                  <img 
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&h=700&fit=crop&crop=faces"
                    alt="Student preparing for interview"
                    className="w-full h-auto object-cover"
                  />
                  
                  {/* Floating badge overlay */}
                  <div className="absolute top-6 right-6 bg-white rounded-2xl shadow-xl p-4 animate-float" style={{animationDelay: '0.5s'}}>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-sm font-bold text-gray-900">95% Success</div>
                        <div className="text-xs text-gray-500">Interview Rate</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Floating stats badge */}
                  <div className="absolute bottom-6 left-6 bg-white rounded-2xl shadow-xl p-4 animate-float" style={{animationDelay: '1s'}}>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-700 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-sm font-bold text-gray-900">AI Powered</div>
                        <div className="text-xs text-gray-500">Real-time Analysis</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Decorative elements around image */}
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-purple-300 rounded-full opacity-30 blur-xl animate-pulse"></div>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-blue-300 rounded-full opacity-30 blur-xl animate-pulse" style={{animationDelay: '1s'}}></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section  */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Why Choose{" "}
              <span className="bg-gradient-to-r from-purple-500 to-purple-600 bg-clip-text text-transparent">
                Ready2Hire
              </span>
              ?
            </h2>
            <p className="text-xl text-gray-500 max-w-3xl mx-auto">
              Advanced AI technology meets personalized coaching to give you the edge in your interview preparation
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="group bg-white p-8 rounded-2xl shadow-lg border border-purple-400 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 animate-scale-in animation-delay-200">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Real-time Feedback</h3>
              <p className="text-gray-600 leading-relaxed">
                Get instant analysis on eye contact, confidence, body language, and speaking pace during your practice
                sessions. Our AI provides actionable insights to improve your performance immediately.
              </p>
            </div>

            <div className="group bg-white p-8 rounded-2xl shadow-lg border border-purple-400  hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 animate-scale-in animation-delay-400">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Resume Analysis</h3>
              <p className="text-gray-600 leading-relaxed">
                Upload your resume and receive personalized interview questions tailored to your skills and experience. 
                Practice questions that are actually relevant to your career path.
              </p>
            </div>

            <div className="group bg-white p-8 rounded-2xl shadow-lg border border-purple-400 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 animate-scale-in animation-delay-600">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Multiple Question Types</h3>
              <p className="text-gray-600 leading-relaxed">
                Practice with HR questions, behavioral questions, and domain-specific technical questions for
                comprehensive preparation. Simulate real interview scenarios across different roles.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section - ENHANCED ANIMATIONS */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">How It Works</h2>
            <p className="text-xl text-gray-500 max-w-3xl mx-auto">
              Simple steps to interview success
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "1", title: "Upload Resume", desc: "Share your expertise with  AI", icon: "📄" },
              { step: "2", title: "Choose Questions", desc: "Select your interview type", icon: "🎯" },
              { step: "3", title: "Practice Live", desc: "Record yourself answering", icon: "🎥" },
              { step: "4", title: "Get Feedback", desc: "Receive detailed insights", icon: "📊" }
            ].map((item, index) => (
              <div key={index} className={`text-center group animate-fade-in-up animation-delay-${(index + 2) * 200}`}>
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto shadow-lg group-hover:shadow-xl transition-shadow group-hover:scale-110 transform transition-transform duration-300">
                    <span className="text-3xl">{item.icon}</span>
                  </div>
                  <div className="absolute -top-2 -left-2 w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-700 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {item.step}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-purple-500 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in-up">
            <h2 className="text-4xl font-bold mb-4">Proven Results</h2>
            <p className="text-xl text-blue-100">Join in the list of successful candidates</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 text-center">
            <div className="animate-scale-in animation-delay-200">
              <div className="text-4xl md:text-5xl font-bold mb-2">40+</div>
              <div className="text-blue-100">Practice Sessions</div>
            </div>
            <div className="animate-scale-in animation-delay-400">
              <div className="text-4xl md:text-5xl font-bold mb-2">95%</div>
              <div className="text-blue-100">Success Rate</div>
            </div>
            <div className="animate-scale-in animation-delay-600">
              <div className="text-4xl md:text-5xl font-bold mb-2">24/7</div>
              <div className="text-blue-100">Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 animate-fade-in-up">
            Are you ready?
          </h2>
          <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto animate-fade-in-up animation-delay-200">
            Start practicing today and build the confidence you need to succeed. It's free to get started!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animation-delay-400">
            <button
              onClick={() => navigate("/dashboard")}
              className="px-8 py-4 bg-gradient-to-r from-purple-500 to-purple-700 text-white text-lg font-semibold rounded-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
            >
              Start Free Practice Now
            </button>
            <button
              onClick={() => navigate("/contact")}
              className="px-8 py-4 border-2 border-gray-300 text-gray-700 text-lg font-semibold rounded-lg hover:border-purple-500 hover:text-purple-600  transition-all duration-300"
            >
              Contact Support
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
