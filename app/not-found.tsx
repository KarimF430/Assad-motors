export const runtime = 'nodejs'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-6">
            <span className="text-4xl font-bold text-red-600">404</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h1>
          <p className="text-gray-600 mb-8">Sorry, we couldn't find the page you're looking for.</p>
        </div>
        <div className="space-y-4">
          <a
            href="/"
            className="inline-flex items-center justify-center w-full px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
          >
            Go to Homepage
          </a>
          <a
            href="/"
            className="inline-flex items-center justify-center w-full px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
          >
            Back to Home
          </a>
        </div>
      </div>
    </div>
  )
}
