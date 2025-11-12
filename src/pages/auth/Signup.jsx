import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Signup() {
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    companyname: '',
    password: '',
  })
  const [message, setMessage] = useState('')
  const [isError, setIsError] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    // TODO: Implement signup API call
    setMessage('Signup functionality to be implemented')
    setIsError(false)
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-lg w-[400px] max-w-[90%]">
        <h2 className="text-center text-gray-800 text-2xl mb-6">Create Account</h2>

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
            Full Name
          </label>
          <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg h-12 pl-2.5 mb-4 transition-colors focus-within:border-primary focus-within:bg-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="mr-2.5 text-gray-600"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5.121 17.804A9 9 0 1118.88 17.804M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Enter your Full Name"
              className="ml-2.5 rounded-lg border-none w-[85%] h-1/2 outline-none bg-transparent text-gray-800"
              id="fullname"
              value={formData.fullname}
              onChange={handleChange}
              required
            />
          </div>

          <label className="block text-sm font-medium mb-1 mt-2.5 text-gray-700">
            Email
          </label>
          <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg h-12 pl-2.5 mb-4 transition-colors focus-within:border-primary focus-within:bg-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="mr-2.5 text-gray-600"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 12H8m8 0a4 4 0 11-8 0 4 4 0 018 0zM4 8l8 5 8-5M4 8v8a4 4 0 004 4h8a4 4 0 004-4V8"
              />
            </svg>
            <input
              type="email"
              placeholder="Enter your Email"
              className="ml-2.5 rounded-lg border-none w-[85%] h-1/2 outline-none bg-transparent text-gray-800"
              id="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <label className="block text-sm font-medium mb-1 mt-2.5 text-gray-700">
            Company Name
          </label>
          <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg h-12 pl-2.5 mb-4 transition-colors focus-within:border-primary focus-within:bg-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="mr-2.5 text-gray-600"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 21h18M9 8h6m-6 4h6m-6 4h6M4 21V9a2 2 0 012-2h12a2 2 0 012 2v12"
              />
            </svg>
            <input
              type="text"
              placeholder="Enter your Company Name"
              className="ml-2.5 rounded-lg border-none w-[85%] h-1/2 outline-none bg-transparent text-gray-800"
              id="companyname"
              value={formData.companyname}
              onChange={handleChange}
              required
            />
          </div>

          <label className="block text-sm font-medium mb-1 mt-2.5 text-gray-700">
            Password
          </label>
          <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg h-12 pl-2.5 mb-4 transition-colors focus-within:border-primary focus-within:bg-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="mr-2.5 text-gray-600"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 15v2m6 4H6a2 2 0 01-2-2v-6a2 2 0 012-2h12a2 2 0 012 2v6a2 2 0 01-2 2zm-6-10a4 4 0 00-4 4v2h8v-2a4 4 0 00-4-4z"
              />
            </svg>
            <input
              type="password"
              placeholder="Enter your Password"
              className="ml-2.5 rounded-lg border-none w-[85%] h-1/2 outline-none bg-transparent text-gray-800"
              id="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="my-5 bg-gray-900 border-none text-white text-base font-medium rounded-lg h-12 w-full cursor-pointer hover:bg-gray-800"
          >
            Sign Up
          </button>

          <p className="text-center mt-4 text-gray-800 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 no-underline font-medium hover:underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}

