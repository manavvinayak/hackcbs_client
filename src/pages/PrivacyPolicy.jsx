"use client"

import { useNavigate } from "react-router-dom"

export default function PrivacyPolicy() {
  const navigate = useNavigate()

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 50%, #ddd6fe 100%)',
      padding: '3rem 1.5rem',
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    },
    mainContent: {
      maxWidth: '1200px',
      margin: '0 auto'
    },
    heroSection: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '4rem',
      alignItems: 'center',
      marginBottom: '5rem'
    },
    leftContent: {
      position: 'relative',
      zIndex: 2
    },
    title: {
      fontSize: '3.5rem',
      fontWeight: '800',
      color: '#1e293b',
      marginBottom: '1.5rem',
      lineHeight: '1.1',
      letterSpacing: '-0.02em'
    },
    subtitle: {
      fontSize: '1.1rem',
      color: '#64748b',
      lineHeight: '1.8',
      marginBottom: '2rem'
    },
    readMoreButton: {
      background: 'white',
      color: '#667eea',
      border: '2px solid #e2e8f0',
      borderRadius: '12px',
      padding: '0.875rem 2rem',
      fontSize: '1rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
    },
    illustrationContainer: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      perspective: '1000px'
    },
    laptop: {
      width: '100%',
      maxWidth: '500px',
      position: 'relative',
      transform: 'rotateY(-15deg) rotateX(5deg)',
      transformStyle: 'preserve-3d'
    },
    laptopScreen: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      borderRadius: '20px 20px 0 0',
      padding: '2rem',
      boxShadow: '0 20px 60px rgba(102, 126, 234, 0.3)',
      position: 'relative'
    },
    laptopBase: {
      background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)',
      height: '30px',
      borderRadius: '0 0 20px 20px',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
    },
    document: {
      background: 'white',
      borderRadius: '12px',
      padding: '1.5rem',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
      position: 'relative',
      transform: 'translateZ(20px)'
    },
    floatingElement: {
      position: 'absolute',
      animation: 'float 3s ease-in-out infinite'
    },
    contentSection: {
      background: 'white',
      borderRadius: '32px',
      padding: '4rem 3rem',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      border: '1px solid #f1f5f9'
    },
    sectionTitle: {
      fontSize: '2rem',
      fontWeight: '700',
      color: '#1e293b',
      marginBottom: '1.5rem',
      marginTop: '2.5rem'
    },
    sectionSubtitle: {
      fontSize: '1.5rem',
      fontWeight: '600',
      color: '#334155',
      marginBottom: '1rem',
      marginTop: '2rem'
    },
    paragraph: {
      fontSize: '1.05rem',
      lineHeight: '1.8',
      color: '#475569',
      marginBottom: '1.5rem'
    },
    list: {
      fontSize: '1.05rem',
      lineHeight: '1.8',
      color: '#475569',
      marginBottom: '1.5rem',
      paddingLeft: '1.5rem'
    },
    listItem: {
      marginBottom: '0.75rem'
    },
    highlight: {
      background: 'linear-gradient(135deg, #667eea20 0%, #764ba220 100%)',
      padding: '1.5rem',
      borderRadius: '16px',
      borderLeft: '4px solid #667eea',
      marginBottom: '2rem'
    },
    badge: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '0.5rem 1rem',
      borderRadius: '20px',
      fontSize: '0.875rem',
      fontWeight: '600',
      display: 'inline-block',
      marginBottom: '1rem'
    }
  }

  const animationKeyframes = `
    @keyframes float {
      0%, 100% {
        transform: translateY(0px);
      }
      50% {
        transform: translateY(-20px);
      }
    }
  `

  // Add CSS animation
  if (typeof document !== 'undefined' && !document.querySelector('#privacy-styles')) {
    const style = document.createElement('style')
    style.id = 'privacy-styles'
    style.textContent = animationKeyframes
    document.head.appendChild(style)
  }

  return (
    <div style={styles.container}>
      <div style={styles.mainContent}>
        {/* Hero Section */}
        <div style={styles.heroSection}>
          {/* Left Content */}
          <div style={styles.leftContent}>
            <h1 style={styles.title}>
              Terms and<br />conditions
            </h1>
            <p style={styles.subtitle}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
            <button 
              style={styles.readMoreButton}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(102, 126, 234, 0.2)'
                e.currentTarget.style.borderColor = '#667eea'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)'
                e.currentTarget.style.borderColor = '#e2e8f0'
              }}
              onClick={() => {
                document.getElementById('content-section')?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              Read more
            </button>
          </div>

          {/* Right Illustration */}
          <div style={styles.illustrationContainer}>
            {/* Floating gear icon */}
            <div style={{
              ...styles.floatingElement,
              top: '10%',
              left: '5%',
              animationDelay: '0s'
            }}>
              <div style={{
                width: '60px',
                height: '60px',
                background: 'white',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 10px 30px rgba(102, 126, 234, 0.2)'
              }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="#667eea">
                  <path d="M12 15.5A3.5 3.5 0 0 1 8.5 12 3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5 3.5 3.5 0 0 1-3.5 3.5m7.43-2.53c.04-.32.07-.64.07-.97 0-.33-.03-.66-.07-1l2.11-1.63c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.31-.61-.22l-2.49 1c-.52-.39-1.06-.73-1.69-.98l-.37-2.65A.506.506 0 0 0 14 2h-4c-.25 0-.46.18-.5.42l-.37 2.65c-.63.25-1.17.59-1.69.98l-2.49-1c-.22-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64L4.57 11c-.04.34-.07.67-.07 1 0 .33.03.65.07.97l-2.11 1.66c-.19.15-.25.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1.01c.52.4 1.06.74 1.69.99l.37 2.65c.04.24.25.42.5.42h4c.25 0 .46-.18.5-.42l.37-2.65c.63-.26 1.17-.59 1.69-.99l2.49 1.01c.22.08.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.66z"/>
                </svg>
              </div>
            </div>

            {/* Floating plant */}
            <div style={{
              ...styles.floatingElement,
              top: '5%',
              right: '0%',
              animationDelay: '1s'
            }}>
              <div style={{
                width: '80px',
                height: '100px',
                background: 'white',
                borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'center',
                boxShadow: '0 10px 30px rgba(102, 126, 234, 0.15)',
                padding: '1rem'
              }}>
                <div style={{
                  fontSize: '2rem'
                }}>🌿</div>
              </div>
            </div>

            {/* Floating checkmark */}
            <div style={{
              ...styles.floatingElement,
              bottom: '15%',
              left: '0%',
              animationDelay: '0.5s'
            }}>
              <div style={{
                width: '50px',
                height: '50px',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 10px 30px rgba(16, 185, 129, 0.3)'
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
              </div>
            </div>

            {/* Laptop with document */}
            <div style={styles.laptop}>
              <div style={styles.laptopScreen}>
                <div style={styles.document}>
                  <div style={{
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    color: '#1e293b',
                    marginBottom: '0.75rem',
                    textAlign: 'center'
                  }}>
                    TERMS & CONDITIONS
                  </div>
                  <div style={{height: '2px', background: '#e2e8f0', marginBottom: '0.75rem'}}></div>
                  {[1, 2, 3, 4, 5, 6].map((line) => (
                    <div key={line} style={{
                      height: '6px',
                      background: line % 3 === 0 ? '#c7d2fe' : '#e0e7ff',
                      marginBottom: '0.5rem',
                      borderRadius: '3px',
                      width: line % 2 === 0 ? '90%' : '100%'
                    }}></div>
                  ))}
                  <div style={{
                    display: 'flex',
                    gap: '0.5rem',
                    marginTop: '1rem'
                  }}>
                    <div style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: '#667eea'
                    }}></div>
                    <div style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: '#94a3b8'
                    }}></div>
                    <div style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: '#94a3b8'
                    }}></div>
                  </div>
                </div>
              </div>
              <div style={styles.laptopBase}></div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div id="content-section" style={styles.contentSection}>
          <span style={styles.badge}>Last Updated: November 22, 2025</span>
          
          <h2 style={styles.sectionTitle}>Privacy Policy for InterviewPro</h2>
          
          <p style={styles.paragraph}>
            Welcome to InterviewPro. We are committed to protecting your personal information and your right to privacy. 
            This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our 
            AI-powered interview preparation platform.
          </p>

          <div style={styles.highlight}>
            <p style={{...styles.paragraph, marginBottom: 0}}>
              <strong>Important:</strong> By using InterviewPro, you agree to the collection and use of information in accordance 
              with this policy. If you do not agree with our policies and practices, please do not use our service.
            </p>
          </div>

          <h3 style={styles.sectionSubtitle}>1. Information We Collect</h3>
          
          <p style={styles.paragraph}>
            We collect several types of information to provide and improve our service:
          </p>

          <ul style={styles.list}>
            <li style={styles.listItem}>
              <strong>Personal Information:</strong> Name, email address, phone number, and professional details you provide during registration
            </li>
            <li style={styles.listItem}>
              <strong>Resume Data:</strong> Information from uploaded resumes including work experience, education, and skills
            </li>
            <li style={styles.listItem}>
              <strong>Interview Session Data:</strong> Video recordings, audio transcripts, facial expressions, and response content during practice sessions
            </li>
            <li style={styles.listItem}>
              <strong>Performance Metrics:</strong> Scores, feedback, analysis reports, and progress tracking data
            </li>
            <li style={styles.listItem}>
              <strong>Usage Data:</strong> Information about how you interact with our platform, including access times, pages viewed, and features used
            </li>
            <li style={styles.listItem}>
              <strong>Device Information:</strong> IP address, browser type, operating system, and device identifiers
            </li>
          </ul>

          <h3 style={styles.sectionSubtitle}>2. How We Use Your Information</h3>

          <p style={styles.paragraph}>
            We use the collected information for various purposes:
          </p>

          <ul style={styles.list}>
            <li style={styles.listItem}>To provide and maintain our AI-powered interview preparation service</li>
            <li style={styles.listItem}>To analyze your interview performance using computer vision and machine learning</li>
            <li style={styles.listItem}>To generate personalized feedback and recommendations</li>
            <li style={styles.listItem}>To improve our AI models and platform features</li>
            <li style={styles.listItem}>To track your progress and display analytics</li>
            <li style={styles.listItem}>To send you notifications about your sessions and updates</li>
            <li style={styles.listItem}>To provide customer support and respond to your inquiries</li>
            <li style={styles.listItem}>To detect, prevent, and address technical issues or fraudulent activity</li>
          </ul>

          <h3 style={styles.sectionSubtitle}>3. AI Analysis and Data Processing</h3>

          <p style={styles.paragraph}>
            Our platform uses advanced artificial intelligence to analyze your interview sessions:
          </p>

          <ul style={styles.list}>
            <li style={styles.listItem}>
              <strong>Computer Vision:</strong> We analyze facial expressions, eye contact, and body language during video interviews
            </li>
            <li style={styles.listItem}>
              <strong>Natural Language Processing:</strong> We evaluate your verbal responses for content quality and communication effectiveness
            </li>
            <li style={styles.listItem}>
              <strong>Machine Learning Models:</strong> Our AI has been trained on thousands of interview scenarios to provide accurate feedback
            </li>
            <li style={styles.listItem}>
              <strong>Data Security:</strong> All video and audio data is encrypted and processed securely in compliance with industry standards
            </li>
          </ul>

          <div style={styles.highlight}>
            <p style={{...styles.paragraph, marginBottom: 0}}>
              <strong>Note:</strong> While our AI analysis is highly accurate, it may occasionally make mistakes. 
              We recommend reviewing all feedback carefully and contacting us if you notice any issues.
            </p>
          </div>

          <h3 style={styles.sectionSubtitle}>4. Data Sharing and Disclosure</h3>

          <p style={styles.paragraph}>
            We do not sell your personal information. We may share your information only in the following circumstances:
          </p>

          <ul style={styles.list}>
            <li style={styles.listItem}>
              <strong>With Your Consent:</strong> When you explicitly authorize us to share specific information
            </li>
            <li style={styles.listItem}>
              <strong>Service Providers:</strong> With trusted third-party companies that help us operate our platform (cloud storage, analytics, etc.)
            </li>
            <li style={styles.listItem}>
              <strong>Legal Requirements:</strong> When required by law, court order, or government regulation
            </li>
            <li style={styles.listItem}>
              <strong>Business Transfers:</strong> In connection with any merger, acquisition, or sale of company assets
            </li>
          </ul>

          <h3 style={styles.sectionSubtitle}>5. Data Retention</h3>

          <p style={styles.paragraph}>
            We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy:
          </p>

          <ul style={styles.list}>
            <li style={styles.listItem}>Active account data is retained while your account is active</li>
            <li style={styles.listItem}>Interview session recordings are stored for 12 months unless you request earlier deletion</li>
            <li style={styles.listItem}>Performance analytics and progress data are retained to track your improvement over time</li>
            <li style={styles.listItem}>You can request deletion of your data at any time by contacting our support team</li>
          </ul>

          <h3 style={styles.sectionSubtitle}>6. Your Rights and Choices</h3>

          <p style={styles.paragraph}>
            You have certain rights regarding your personal information:
          </p>

          <ul style={styles.list}>
            <li style={styles.listItem}>
              <strong>Access:</strong> Request copies of your personal data
            </li>
            <li style={styles.listItem}>
              <strong>Correction:</strong> Request correction of inaccurate or incomplete information
            </li>
            <li style={styles.listItem}>
              <strong>Deletion:</strong> Request deletion of your personal data
            </li>
            <li style={styles.listItem}>
              <strong>Opt-Out:</strong> Unsubscribe from marketing communications
            </li>
            <li style={styles.listItem}>
              <strong>Data Portability:</strong> Request transfer of your data to another service
            </li>
            <li style={styles.listItem}>
              <strong>Objection:</strong> Object to processing of your personal information
            </li>
          </ul>

          <h3 style={styles.sectionSubtitle}>7. Security Measures</h3>

          <p style={styles.paragraph}>
            We implement industry-standard security measures to protect your information:
          </p>

          <ul style={styles.list}>
            <li style={styles.listItem}>End-to-end encryption for video and audio data transmission</li>
            <li style={styles.listItem}>Secure cloud storage with regular backups</li>
            <li style={styles.listItem}>Access controls and authentication protocols</li>
            <li style={styles.listItem}>Regular security audits and vulnerability assessments</li>
            <li style={styles.listItem}>Employee training on data protection and privacy practices</li>
          </ul>

          <h3 style={styles.sectionSubtitle}>8. Cookies and Tracking Technologies</h3>

          <p style={styles.paragraph}>
            We use cookies and similar tracking technologies to enhance your experience:
          </p>

          <ul style={styles.list}>
            <li style={styles.listItem}>Essential cookies for platform functionality</li>
            <li style={styles.listItem}>Analytics cookies to understand usage patterns</li>
            <li style={styles.listItem}>Preference cookies to remember your settings</li>
            <li style={styles.listItem}>You can control cookie preferences through your browser settings</li>
          </ul>

          <h3 style={styles.sectionSubtitle}>9. Children's Privacy</h3>

          <p style={styles.paragraph}>
            InterviewPro is not intended for users under the age of 16. We do not knowingly collect personal information 
            from children. If you believe we have inadvertently collected information from a child, please contact us immediately.
          </p>

          <h3 style={styles.sectionSubtitle}>10. International Data Transfers</h3>

          <p style={styles.paragraph}>
            Your information may be transferred to and processed in countries other than your country of residence. 
            We ensure appropriate safeguards are in place to protect your data in compliance with applicable laws.
          </p>

          <h3 style={styles.sectionSubtitle}>11. Changes to This Privacy Policy</h3>

          <p style={styles.paragraph}>
            We may update this Privacy Policy from time to time. We will notify you of any changes by:
          </p>

          <ul style={styles.list}>
            <li style={styles.listItem}>Posting the new Privacy Policy on this page</li>
            <li style={styles.listItem}>Updating the "Last Updated" date at the top</li>
            <li style={styles.listItem}>Sending you an email notification for significant changes</li>
            <li style={styles.listItem}>Displaying a prominent notice on our platform</li>
          </ul>

          <h3 style={styles.sectionSubtitle}>12. Contact Us</h3>

          <p style={styles.paragraph}>
            If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, 
            please contact us:
          </p>

          <div style={styles.highlight}>
            <p style={styles.paragraph}>
              <strong>Email:</strong> privacy@interviewpro.com<br />
              <strong>Support:</strong> support@interviewpro.com<br />
              <strong>Address:</strong> InterviewPro Inc., 123 Tech Street, San Francisco, CA 94105, USA<br />
              <strong>Phone:</strong> +1 (555) 123-4567
            </p>
            <p style={{...styles.paragraph, marginBottom: 0}}>
              We typically respond to all inquiries within 48 hours.
            </p>
          </div>

          <h3 style={styles.sectionSubtitle}>13. GDPR Compliance (For EU Users)</h3>

          <p style={styles.paragraph}>
            If you are located in the European Economic Area (EEA), you have additional rights under GDPR:
          </p>

          <ul style={styles.list}>
            <li style={styles.listItem}>Right to be informed about data collection and use</li>
            <li style={styles.listItem}>Right to access your personal data</li>
            <li style={styles.listItem}>Right to rectification of inaccurate data</li>
            <li style={styles.listItem}>Right to erasure ("right to be forgotten")</li>
            <li style={styles.listItem}>Right to restrict processing</li>
            <li style={styles.listItem}>Right to data portability</li>
            <li style={styles.listItem}>Right to object to processing</li>
            <li style={styles.listItem}>Rights related to automated decision-making and profiling</li>
          </ul>

          <h3 style={styles.sectionSubtitle}>14. California Privacy Rights (CCPA)</h3>

          <p style={styles.paragraph}>
            If you are a California resident, you have specific rights under the California Consumer Privacy Act (CCPA):
          </p>

          <ul style={styles.list}>
            <li style={styles.listItem}>Right to know what personal information is collected</li>
            <li style={styles.listItem}>Right to know whether personal information is sold or disclosed</li>
            <li style={styles.listItem}>Right to say no to the sale of personal information</li>
            <li style={styles.listItem}>Right to access your personal information</li>
            <li style={styles.listItem}>Right to equal service and price</li>
            <li style={styles.listItem}>Right to delete personal information</li>
          </ul>

          <div style={{
            marginTop: '4rem',
            padding: '2rem',
            background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
            borderRadius: '20px',
            border: '1px solid #0ea5e9',
            textAlign: 'center'
          }}>
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              color: '#0c4a6e',
              marginBottom: '1rem'
            }}>
              Questions About Our Privacy Policy?
            </h3>
            <p style={{
              color: '#0c4a6e',
              fontSize: '1rem',
              marginBottom: '1.5rem'
            }}>
              We're here to help! Contact our privacy team anytime for clarification or concerns.
            </p>
            <button style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              padding: '1rem 2rem',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 10px 25px rgba(102, 126, 234, 0.25)'
            }}
            onClick={() => navigate('/contact')}>
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
