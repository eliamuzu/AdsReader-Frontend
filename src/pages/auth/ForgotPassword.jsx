import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    // TODO: Implement forgot password API call
    setMessage('Password reset link sent to your email')
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-lg w-[400px] max-w-[90%]">
        <h2 className="text-center text-gray-800 text-2xl mb-6">Forgot Password</h2>

        {message && (
          <div className="mb-4 p-3 rounded text-sm bg-green-50 text-green-800 border border-green-200">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-2.5 my-2 border border-gray-300 rounded text-base"
          />
          <button
            type="submit"
            className="w-full bg-gray-900 text-white p-2.5 border-none rounded cursor-pointer text-base hover:bg-gray-800"
          >
            Send Reset Link
          </button>
        </form>

        <p className="text-center mt-4 text-gray-800 text-sm">
          <Link to="/login" className="text-blue-600 no-underline font-medium hover:underline">
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  )
}

