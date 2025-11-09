import { useState, useEffect } from 'react';

// Simple implementations to avoid import issues
const Card = ({ children, className = "" }) => (
  <div className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ children, className = "" }) => (
  <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>
    {children}
  </div>
);

const CardTitle = ({ children, className = "" }) => (
  <h3 className={`text-2xl font-semibold leading-none tracking-tight ${className}`}>
    {children}
  </h3>
);

const CardContent = ({ children, className = "" }) => (
  <div className={`p-6 pt-0 ${className}`}>
    {children}
  </div>
);

const Badge = ({ children, className = "", variant = "default" }) => {
  const variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/80",
    outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
  };
  
  return (
    <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${variants[variant]} ${className}`}>
      {children}
    </div>
  );
};

const Progress = ({ value = 0, className = "" }) => (
  <div className={`relative h-2 w-full overflow-hidden rounded-full bg-secondary ${className}`}>
    <div 
      className="h-full w-full flex-1 bg-primary transition-all"
      style={{ transform: `translateX(-${100 - value}%)` }}
    />
  </div>
);

export default function AIFeedbackPanel({ analysisData, recommendations, realTimeScores }) {
  const [feedbackHistory, setFeedbackHistory] = useState([]);
  
  useEffect(() => {
    if (analysisData) {
      setFeedbackHistory(prev => [...prev.slice(-10), analysisData]);
    }
  }, [analysisData]);

  const getScoreColor = (score) => {
    if (score >= 70) return 'text-green-500';
    if (score >= 50) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreBadgeColor = (score) => {
    if (score >= 70) return 'bg-green-100 text-green-800';
    if (score >= 50) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="space-y-4">
      {/* Real-time Scores */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            🎯 Real-time Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Eye Contact */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Eye Contact</span>
              <Badge className={getScoreBadgeColor(realTimeScores?.eyeContact || 0)}>
                {Math.round(realTimeScores?.eyeContact || 0)}%
              </Badge>
            </div>
            <Progress value={realTimeScores?.eyeContact || 0} className="h-2" />
            <p className="text-xs text-gray-600 mt-1">
              {realTimeScores?.eyeContact > 60 ? 'Excellent eye contact!' : 
               realTimeScores?.eyeContact > 30 ? 'Try to look at the camera more' : 
               'Focus on maintaining eye contact'}
            </p>
          </div>

          {/* Confidence */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Confidence</span>
              <Badge className={getScoreBadgeColor(realTimeScores?.confidence || 0)}>
                {Math.round(realTimeScores?.confidence || 0)}%
              </Badge>
            </div>
            <Progress value={realTimeScores?.confidence || 0} className="h-2" />
            <p className="text-xs text-gray-600 mt-1">
              {realTimeScores?.confidence > 70 ? 'Very confident demeanor!' : 
               realTimeScores?.confidence > 40 ? 'Good confidence level' : 
               'Try to appear more confident'}
            </p>
          </div>

          {/* Engagement */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Engagement</span>
              <Badge className={getScoreBadgeColor(realTimeScores?.engagement || 0)}>
                {Math.round(realTimeScores?.engagement || 0)}%
              </Badge>
            </div>
            <Progress value={realTimeScores?.engagement || 0} className="h-2" />
            <p className="text-xs text-gray-600 mt-1">
              {realTimeScores?.engagement > 60 ? 'Highly engaged!' : 
               realTimeScores?.engagement > 30 ? 'Show more engagement' : 
               'Increase your enthusiasm and interest'}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      {recommendations && recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              💡 Live Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recommendations.slice(0, 3).map((rec, index) => (
                <div key={index} className="border-l-4 border-blue-500 pl-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className="text-xs">
                      {rec.type || rec.category}
                    </Badge>
                    {rec.priority && (
                      <Badge 
                        className={`text-xs ${
                          rec.priority === 'high' ? 'bg-red-100 text-red-800' :
                          rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {rec.priority}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm font-medium text-gray-800">
                    {rec.message || rec.suggestion}
                  </p>
                  {rec.action && (
                    <p className="text-xs text-gray-600 mt-1">
                      💡 {rec.action}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Facial Expression Analysis */}
      {analysisData && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              😊 Expression Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Current Expression:</span>
                <Badge className="capitalize">
                  {analysisData.dominantEmotion || 'neutral'}
                </Badge>
              </div>
              
              {analysisData.expressions && (
                <div className="space-y-1">
                  {Object.entries(analysisData.expressions)
                    .sort(([,a], [,b]) => b - a)
                    .slice(0, 3)
                    .map(([emotion, confidence]) => (
                      <div key={emotion} className="flex justify-between text-xs">
                        <span className="capitalize">{emotion}:</span>
                        <span>{Math.round(confidence * 100)}%</span>
                      </div>
                    ))
                  }
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Session Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            📊 Session Stats
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Analysis Points:</p>
              <p className="font-semibold">{feedbackHistory.length}</p>
            </div>
            <div>
              <p className="text-gray-600">Session Time:</p>
              <p className="font-semibold">{Math.floor(Date.now() / 60000)} min</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}