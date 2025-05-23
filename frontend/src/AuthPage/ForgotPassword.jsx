"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { BookOpen, Mail, ArrowLeft, CheckCircle } from "lucide-react"
import { useAuth } from "../contexts/auth-context"
import { useLocation, useNavigate, Link } from "react-router-dom";
export default function ForgotPassword() {
  const { resetPassword } = useAuth()
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    setSuccess(false)

    try {
      await resetPassword(email)
      setSuccess(true)
    } catch (error) {
      setError(error.message || "Failed to send reset password email. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a192f] to-[#164e63] flex flex-col items-center justify-center p-4">
      <div className="fixed inset-0 top-0 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-[30%] -left-40 w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-3xl"></div>
      </div>

      <Link to="/auth" className="absolute z-10 flex items-center gap-2 text-white top-6 left-6 hover:text-teal-400">
        <ArrowLeft className="w-5 h-5" />
        <span>Back to Login</span>
      </Link>

      <div className="relative z-10 w-full max-w-md">
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2">
            <BookOpen className="w-8 h-8 text-teal-400" />
            <span className="text-xl font-bold text-white">EduBengali</span>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-br from-[#1e293b]/70 to-[#1e293b]/40 border border-gray-700/50 backdrop-blur-sm text-white rounded-xl shadow-xl"
        >
          <div className="p-6 border-b border-gray-700/50">
            <h2 className="text-2xl font-bold">Reset Your Password</h2>
            <p className="mt-2 text-gray-400">
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>
          <div className="p-6">
            {success ? (
              <div className="py-8 text-center">
                <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
                <h3 className="mb-2 text-xl font-bold">Email Sent!</h3>
                <p className="mb-6 text-gray-300">
                  Check your inbox for instructions to reset your password. If you don't see it, check your spam folder.
                </p>
                <a
                  href="/auth"
                  className="inline-block px-6 py-2 font-medium text-white transition-all duration-300 rounded-lg bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700"
                >
                  Return to Login
                </a>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="space-y-5">
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-medium">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                      <input
                        id="email"
                        name="email"
                        placeholder="your.email@example.com"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 bg-[#0a192f]/50 border border-gray-700 text-white w-full p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                        required
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="flex items-center gap-2 p-3 text-white border rounded-md bg-red-500/20 border-red-500/50">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="flex-shrink-0 w-5 h-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>{error}</span>
                    </div>
                  )}

                  <button
                    className={`w-full mt-6 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white p-3 rounded-lg font-medium transition-all duration-300 transform hover:translate-y-[-2px] flex items-center justify-center ${
                      isSubmitting ? "opacity-80 cursor-not-allowed" : ""
                    }`}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <svg
                        className="w-5 h-5 mr-2 -ml-1 text-white animate-spin"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    ) : null}
                    {isSubmitting ? "Sending..." : "Send Reset Link"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
