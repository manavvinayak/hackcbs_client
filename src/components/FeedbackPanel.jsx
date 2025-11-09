export default function FeedbackPanel({ feedback, emotionData }) {
  const getAverageEmotion = () => {
    if (!emotionData || emotionData.length === 0) return null
    const avgConfidence = Math.round(emotionData.reduce((acc, e) => acc + e.confidence, 0) / emotionData.length)
    return avgConfidence
  }

  const getEmotionColor = (emotion) => {
    switch (emotion) {
      case "confident":
        return "text-green-600 bg-green-50"
      case "neutral":
        return "text-yellow-600 bg-yellow-50"
      case "uncertain":
        return "text-red-600 bg-red-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  if (!feedback) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 h-fit sticky top-4">
        <h3 className="font-semibold mb-4">Real-time Feedback</h3>
        <p className="text-gray-600 text-sm mb-3">Complete your answer to receive feedback on:</p>
        <ul className="space-y-2 text-sm text-gray-600">
          <li className="flex items-center gap-2">
            <span className="text-primary">✓</span> Eye Contact
          </li>
          <li className="flex items-center gap-2">
            <span className="text-primary">✓</span> Speaking Pace
          </li>
          <li className="flex items-center gap-2">
            <span className="text-primary">✓</span> Confidence Level
          </li>
          <li className="flex items-center gap-2">
            <span className="text-primary">✓</span> Body Language
          </li>
          <li className="flex items-center gap-2">
            <span className="text-primary">✓</span> Emotion Detection
          </li>
        </ul>
        {emotionData.length > 0 && (
          <div className={`mt-4 p-3 rounded text-sm ${getEmotionColor(emotionData[emotionData.length - 1].emotion)}`}>
            <p className="font-medium">Live Analysis</p>
            <p className="text-xs mt-1">Detections: {emotionData.length}</p>
            <p className="text-xs">Avg Confidence: {getAverageEmotion()}%</p>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 h-fit sticky top-4">
      <h3 className="font-semibold mb-4">Your Feedback</h3>
      <div className="space-y-4">
        {/* Eye Contact Score */}
        {feedback.eyeContact && (
          <div>
            <div className="flex justify-between items-center mb-1">
              <p className="text-sm font-medium">Eye Contact</p>
              <span className="text-xs font-semibold text-primary">{feedback.eyeContact}%</span>
            </div>
            <div className="w-full bg-gray-200 h-2 rounded overflow-hidden">
              <div
                className="bg-green-500 h-full rounded transition-all"
                style={{ width: `${feedback.eyeContact}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Confidence Score */}
        {feedback.confidence && (
          <div>
            <div className="flex justify-between items-center mb-1">
              <p className="text-sm font-medium">Confidence</p>
              <span className="text-xs font-semibold text-primary">{feedback.confidence}%</span>
            </div>
            <div className="w-full bg-gray-200 h-2 rounded overflow-hidden">
              <div
                className="bg-blue-500 h-full rounded transition-all"
                style={{ width: `${feedback.confidence}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Emotion Detection */}
        {feedback.emotion && (
          <div className={`p-3 rounded text-sm ${getEmotionColor(feedback.emotion)}`}>
            <p className="font-medium">Emotion Detected</p>
            <p className="capitalize mt-1">{feedback.emotion}</p>
          </div>
        )}

        {/* Speaking Pace */}
        {feedback.pace && (
          <div>
            <p className="text-sm font-medium mb-2">Speaking Pace: {feedback.pace}/5</p>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className={`h-2 flex-1 rounded ${i <= feedback.pace ? "bg-primary" : "bg-gray-200"}`} />
              ))}
            </div>
            <p className="text-xs text-gray-600 mt-1">{feedback.paceComment}</p>
          </div>
        )}

        {/* Body Language */}
        {feedback.bodyLanguage && (
          <div className="p-3 bg-purple-50 rounded text-sm text-purple-900">
            <p className="font-medium mb-1">Body Language</p>
            <p>{feedback.bodyLanguage}</p>
          </div>
        )}

        {/* Suggestion */}
        {feedback.suggestion && (
          <div className="p-3 bg-blue-50 rounded text-sm text-blue-900 border-l-4 border-primary">
            <p className="font-medium mb-1">💡 Suggestion</p>
            <p>{feedback.suggestion}</p>
          </div>
        )}
      </div>
    </div>
  )
}
