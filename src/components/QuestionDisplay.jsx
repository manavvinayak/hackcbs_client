export default function QuestionDisplay({ question }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <p className="text-sm text-gray-600 mb-2">Question</p>
      <h2 className="text-xl font-semibold text-gray-900">{question.question}</h2>
      <p className="text-sm text-gray-600 mt-4">
        Category: <span className="font-medium capitalize">{question.category}</span>
      </p>
    </div>
  )
}