export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4 text-center">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">404</h2>
        <p className="text-gray-600 mb-6">Page not found</p>
        <a
          href="/"
          className="inline-block px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-lg transition"
        >
          Go back home
        </a>
      </div>
    </div>
  )
}
