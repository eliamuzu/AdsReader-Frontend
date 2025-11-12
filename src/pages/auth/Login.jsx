import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [isError, setIsError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!email || !password) {
      setMessage('Email and password are required')
      setIsError(true)
      return
    }

    setIsLoading(true)
    setMessage('Signing in, please wait...')

    try {
      // Note: API expects password_hash field name, but value is the plain password
      const result = await login(email, password)
      if (result.success) {
        setMessage('Signed in successfully')
        setIsError(false)
        navigate('/home')
      } else {
        setMessage(result.message || 'Sign-in failed')
        setIsError(true)
      }
    } catch (err) {
      console.error('Sign-in error:', err)
      setMessage('An unexpected error occurred. Please try again.')
      setIsError(true)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-lg w-[400px] max-w-[90%]">
        <h2 className="text-center text-gray-800 text-2xl mb-6">Login</h2>
        
        {message && (
          <div
            className={`mb-4 p-3 rounded text-sm ${
              isError ? 'bg-red-50 text-red-800 border border-red-200' : 'bg-green-50 text-green-800 border border-green-200'
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label className="block text-sm font-medium mb-1 mt-2.5 text-gray-700">
            Email
          </label>
          <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg h-12 pl-2.5 mb-4 transition-colors focus-within:border-primary focus-within:bg-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              viewBox="0 0 32 32"
              height="20"
              className="mr-2.5 text-gray-600"
            >
              <g data-name="Layer 3" id="Layer_3">
                <path d="m30.853 13.87a15 15 0 0 0 -29.729 4.082 15.1 15.1 0 0 0 12.876 12.918 15.6 15.6 0 0 0 2.016.13 14.85 14.85 0 0 0 7.715-2.145 1 1 0 1 0 -1.031-1.711 13.007 13.007 0 1 1 5.458-6.529 2.149 2.149 0 0 1 -4.158-.759v-10.856a1 1 0 0 0 -2 0v1.726a8 8 0 1 0 .2 10.325 4.135 4.135 0 0 0 7.83.274 15.2 15.2 0 0 0 .823-7.455zm-14.853 8.13a6 6 0 1 1 6-6 6.006 6.006 0 0 1 -6 6z"></path>
              </g>
            </svg>
            <input
              type="email"
              placeholder="Enter your Email"
              className="ml-2.5 rounded-lg border-none w-[85%] h-1/2 outline-none bg-transparent text-gray-800"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <label className="block text-sm font-medium mb-1 mt-2.5 text-gray-700">
            Password
          </label>
          <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg h-12 pl-2.5 mb-4 transition-colors focus-within:border-primary focus-within:bg-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              viewBox="-64 0 512 512"
              height="20"
              className="mr-2.5 text-gray-600"
            >
              <path d="m336 512h-288c-26.453125 0-48-21.523438-48-48v-224c0-26.476562 21.546875-48 48-48h288c26.453125 0 48 21.523438 48 48v224c0 26.476562-21.546875 48-48 48zm-288-288c-8.8125 0-16 7.167969-16 16v224c0 8.832031 7.1875 16 16 16h288c8.8125 0 16-7.167969 16-16v-224c0-8.832031-7.1875-16-16-16zm0 0"></path>
              <path d="m304 224c-8.832031 0-16-7.167969-16-16v-80c0-52.929688-43.070312-96-96-96s-96 43.070312-96 96v80c0 8.832031-7.167969 16-16 16s-16-7.167969-16-16v-80c0-70.59375 57.40625-128 128-128s128 57.40625 128 128v80c0 8.832031-7.167969 16-16 16zm0 0"></path>
            </svg>
            <input
              type="password"
              placeholder="Enter your Password"
              className="ml-2.5 rounded-lg border-none w-[85%] h-1/2 outline-none bg-transparent text-gray-800"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="my-5 bg-gray-900 border-none text-white text-base font-medium rounded-lg h-12 w-full cursor-pointer hover:bg-gray-800 disabled:opacity-50"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                Signing in...
              </span>
            ) : (
              'Sign In'
            )}
          </button>

          <p className="text-center mt-4 text-gray-800 text-sm">
            <Link to="/forgot-password" className="text-blue-600 no-underline font-medium hover:underline">
              Forgot password?
            </Link>
          </p>
          <p className="text-center mt-2 text-gray-800 text-sm">
            Don't have an account?{' '}
            <Link to="/signup" className="text-blue-600 no-underline font-medium hover:underline">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}

