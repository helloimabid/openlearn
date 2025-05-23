"use client";

import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Mail,
  Lock,
  User,
  ArrowLeft,
  Eye,
  EyeOff,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "../contexts/auth-context";
import logoImage from "../assets/images/logo.png";

export default function AuthPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signIn, signUp, signInWithProvider, signInWithOAuth } =
    useAuth();
  // State declarations
  const [tab, setTab] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null); // For inline login errors
  const [isLoading, setIsLoading] = useState(false);

  // Renamed from showSuccessModal and successMessage will be removed
  const [showAuthFeedbackModal, setShowAuthFeedbackModal] = useState(false);
  const [authFeedbackModalConfig, setAuthFeedbackModalConfig] = useState({
    type: "", // 'success' or 'error'
    title: "",
    message: "",
    email: null,
  });

  useEffect(() => {
    if (user && !showAuthFeedbackModal) {
      if (location.pathname === "/auth") {
        const from = location.state?.from?.pathname || "/dashboard";
        navigate(from, { replace: true });
      }
    }
  }, [
    user,
    navigate,
    location.state,
    location.pathname,
    showAuthFeedbackModal,
  ]);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    rememberMe: false,
    agreeToTerms: false,
  });

  useEffect(() => {
    // Parse URL query parameters
    const params = new URLSearchParams(location.search);
    const tabParam = params.get("tab");
    if (tabParam === "signup") {
      setTab("signup");
    }
  }, [location]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error when user types
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent event bubbling
    
    // Prevent multiple submissions
    if (isSubmitting) return;
    
    setError(null); // Clear inline errors for login
    setIsSubmitting(true);

    try {
      if (tab === "login") {
        const { error: signInError } = await signIn(
          formData.email,
          formData.password
        );
        if (signInError) {
          setError(signInError.message || "Failed to sign in."); // Use inline error for login
        }
        // Successful login will trigger user state change and useEffect for navigation
      } else {
        // Signup logic
        if (formData.password !== formData.confirmPassword) {
          setAuthFeedbackModalConfig({
            type: "error",
            title: "Signup Failed",
            message: "Passwords do not match. Please try again.",
          });
          setShowAuthFeedbackModal(true);
          setIsSubmitting(false); // Stop submission
          return; // Exit handleSubmit
        }

        // Call signUp and wait for the response
        const result = await signUp(
          formData.email,
          formData.password,
          {
            firstName: formData.firstName,
            lastName: formData.lastName,
          }
        );

        // Check if there was an error in the response
        if (result.error) {
          setAuthFeedbackModalConfig({
            type: "error",
            title: "Signup Failed",
            message:
              result.error ||
              "An error occurred during signup. Please try again.",
          });
          setShowAuthFeedbackModal(true);
          return;
        }

        // If we get here, signup was successful
        setAuthFeedbackModalConfig({
          type: "success",
          title: "Account Created!",
          message:
            "We've sent a confirmation email. Please check your inbox and click the verification link to activate your account.",
          email: formData.email,
        });
        setShowAuthFeedbackModal(true);
        
        // Clear the form after successful signup
        setFormData({
          firstName: "",
          lastName: "",
          email: formData.email, // Keep email for reference
          password: "",
          confirmPassword: "",
          rememberMe: false,
          agreeToTerms: false,
        });
      }
    } catch (err) {
      console.error('Authentication error:', err);
      // Only show error in login tab or if we don't have an error state yet
      if (tab === "login" && !error) {
        setError(
          err.message || "An unexpected error occurred. Please try again."
        );
      } else if (tab === "signup") {
        // Handle signup errors in the modal
        setAuthFeedbackModalConfig({
          type: "error",
          title: "Signup Failed",
          message: err.message || "An unexpected error occurred during signup.",
        });
        setShowAuthFeedbackModal(true);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSocialLogin = async (provider) => {
    try {
      await signInWithProvider(provider);
    } catch (error) {
      console.error(`${provider} login error:`, error.message);
      setError(`Failed to sign in with ${provider}. Please try again.`);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await signInWithOAuth("google");
    } catch (error) {
      console.error("Google login error:", error.message);
      setError(
        error.message || "Failed to sign in with Google. Please try again."
      );
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a192f] to-[#164e63] flex flex-col items-center justify-center p-4">
      <div className="fixed inset-0 top-0 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-[30%] -left-40 w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-3xl"></div>
      </div>
      <a
        href="/"
        className="fixed z-20 flex items-center gap-2 p-2 text-white transition-all duration-200 rounded-md top-2 left-2 sm:top-4 sm:left-4 sm:p-3 hover:text-teal-400 hover:bg-white/5"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="text-sm sm:text-base">Back to Home</span>
      </a>
      <div className="relative z-10 w-full max-w-md">
        <div className="flex justify-center mb-8"></div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-full">
            <div className="grid grid-cols-2 w-full bg-[#1e293b]/50 border-0 rounded-t-lg overflow-hidden">
              <button
                className={`py-3 relative overflow-hidden ${
                  tab === "login"
                    ? "text-white font-semibold"
                    : "text-gray-300 hover:text-white transition-colors"
                }`}
                onClick={() => setTab("login")}
              >
                {tab === "login" && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-teal-500 to-teal-600"
                    layoutId="tab-background"
                    initial={false}
                  />
                )}
                <span className="relative z-10">Login</span>
              </button>
              <button
                className={`py-3 relative overflow-hidden ${
                  tab === "signup"
                    ? "text-white font-semibold"
                    : "text-gray-300 hover:text-white transition-colors"
                }`}
                onClick={() => setTab("signup")}
              >
                {tab === "signup" && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-teal-500 to-teal-600"
                    layoutId="tab-background"
                    initial={false}
                  />
                )}
                <span className="relative z-10">Sign Up</span>
              </button>
            </div>
            {error && tab === "login" && (
              <div className="flex items-center gap-2 p-3 mt-4 text-white border rounded-md bg-red-500/20 border-red-500/50">
                <AlertCircle className="flex-shrink-0 w-5 h-5" />
                <span>{error}</span>
              </div>
            )}
            <AnimatePresence mode="wait">
              {tab === "login" ? (
                <motion.div
                  key="login"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="bg-gradient-to-br from-[#1e293b]/70 to-[#1e293b]/40 border border-gray-700/50 backdrop-blur-sm text-white rounded-b-xl shadow-xl"
                >
                  <div className="p-6 border-b border-gray-700/50">
                    <div className="flex flex-col items-center mb-6">
                      <img
                        src={logoImage}
                        alt="OpenLearn Logo"
                        className="w-auto h-16 mb-4"
                      />
                    </div>
                    <motion.h2
                      variants={itemVariants}
                      className="text-2xl font-bold"
                    >
                      Welcome back
                    </motion.h2>
                    <motion.p
                      variants={itemVariants}
                      className="mt-2 text-gray-400"
                    >
                      Enter your credentials to access your account
                    </motion.p>
                  </div>
                  <div className="p-6">
                    <form onSubmit={handleSubmit}>
                      <div className="space-y-5">
                        <motion.div
                          variants={itemVariants}
                          className="space-y-2"
                        >
                          <label
                            htmlFor="email"
                            className="block text-sm font-medium"
                          >
                            Email
                          </label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                            <input
                              id="email"
                              name="email"
                              placeholder="your.email@example.com"
                              type="email"
                              value={formData.email}
                              onChange={handleChange}
                              className="pl-10 bg-[#0a192f]/50 border border-gray-700 text-white w-full p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                              required
                            />
                          </div>
                        </motion.div>

                        <motion.div
                          variants={itemVariants}
                          className="space-y-2"
                        >
                          <label
                            htmlFor="password"
                            className="block text-sm font-medium"
                          >
                            Password
                          </label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                            <input
                              id="password"
                              name="password"
                              placeholder="••••••••"
                              type={showPassword ? "text" : "password"}
                              value={formData.password}
                              onChange={handleChange}
                              className="pl-10 bg-[#0a192f]/50 border border-gray-700 text-white w-full p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                              required
                            />
                            <button
                              type="button"
                              onClick={togglePasswordVisibility}
                              className="absolute right-3 top-3.5 text-gray-400 hover:text-white transition-colors"
                              aria-label={
                                showPassword ? "Hide password" : "Show password"
                              }
                            >
                              {showPassword ? (
                                <EyeOff className="w-5 h-5" />
                              ) : (
                                <Eye className="w-5 h-5" />
                              )}
                            </button>
                          </div>
                        </motion.div>

                        <motion.div
                          variants={itemVariants}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id="rememberMe"
                              name="rememberMe"
                              checked={formData.rememberMe}
                              onChange={handleChange}
                              className="h-4 w-4 rounded border-gray-700 bg-[#0a192f]/50 text-teal-500 focus:ring-teal-500 focus:ring-offset-0"
                            />
                            <label htmlFor="rememberMe" className="text-sm">
                              Remember me
                            </label>
                          </div>
                          <Link
                            to="/auth/forgot-password"
                            className="text-sm text-teal-400 transition-colors hover:text-teal-300"
                          >
                            Forgot password?
                          </Link>
                        </motion.div>
                      </div>

                      <motion.button
                        variants={itemVariants}
                        className={`w-full mt-6 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white p-3 rounded-lg font-medium transition-all duration-300 transform hover:translate-y-[-2px] flex items-center justify-center ${
                          isSubmitting ? "opacity-80 cursor-not-allowed" : ""
                        }`}
                        disabled={isSubmitting}
                        type="submit"
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
                        {isSubmitting ? "Signing In..." : "Sign In"}
                      </motion.button>
                    </form>
                  </div>
                  <div className="p-6 border-t border-gray-700/50">
                    <div className="relative w-full">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-700"></div>
                      </div>
                      <div className="relative flex justify-center text-xs">
                        <span className="bg-[#1e293b] px-2 text-gray-400">
                          Or continue with
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-center w-full mt-5">
                      <motion.button
                        variants={itemVariants}
                        className="bg-[#1e293b] border border-gray-700 text-white hover:bg-[#0f172a]/80 transition-all duration-300 p-3 rounded-lg flex items-center justify-center gap-2 w-64 font-medium"
                        onClick={handleGoogleSignIn}
                        disabled={isLoading}
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24">
                          <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            fill="#4285F4"
                          />
                          <path
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            fill="#34A853"
                          />
                          <path
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            fill="#FBBC05"
                          />
                          <path
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            fill="#EA4335"
                          />
                        </svg>
                        {isLoading ? "Signing in..." : "Google"}
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="signup"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="bg-gradient-to-br from-[#1e293b]/70 to-[#1e293b]/40 border border-gray-700/50 backdrop-blur-sm text-white rounded-b-xl shadow-xl"
                >
                  <div className="p-6 border-b border-gray-700/50">
                    <div className="flex flex-col items-center mb-6">
                      <img
                        src={logoImage}
                        alt="OpenLearn Logo"
                        className="w-auto h-16 mb-4"
                      />
                    </div>
                    <motion.h2
                      variants={itemVariants}
                      className="text-2xl font-bold"
                    >
                      Create an account
                    </motion.h2>
                    <motion.p
                      variants={itemVariants}
                      className="mt-2 text-gray-400"
                    >
                      Enter your details to create your account
                    </motion.p>
                  </div>
                  <div className="p-6">
                    <form onSubmit={handleSubmit}>
                      <div className="space-y-5">
                        <motion.div
                          variants={itemVariants}
                          className="grid grid-cols-2 gap-4"
                        >
                          <div className="space-y-2">
                            <label
                              htmlFor="firstName"
                              className="block text-sm font-medium"
                            >
                              First name
                            </label>
                            <div className="relative">
                              <User className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                              <input
                                id="firstName"
                                name="firstName"
                                placeholder="eg. shahkamal"
                                value={formData.firstName}
                                onChange={handleChange}
                                className="pl-10 bg-[#0a192f]/50 border border-gray-700 text-white w-full p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                                required
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label
                              htmlFor="lastName"
                              className="block text-sm font-medium"
                            >
                              Last name
                            </label>
                            <input
                              id="lastName"
                              name="lastName"
                              placeholder="eg. sajid"
                              value={formData.lastName}
                              onChange={handleChange}
                              className="bg-[#0a192f]/50 border border-gray-700 text-white w-full p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                              required
                            />
                          </div>
                        </motion.div>

                        <motion.div
                          variants={itemVariants}
                          className="space-y-2"
                        >
                          <label
                            htmlFor="signupEmail"
                            className="block text-sm font-medium"
                          >
                            Email
                          </label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                            <input
                              id="signupEmail"
                              name="email"
                              placeholder="eg. shahkamal@gmail.com"
                              type="email"
                              value={formData.email}
                              onChange={handleChange}
                              className="pl-10 bg-[#0a192f]/50 border border-gray-700 text-white w-full p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                              required
                            />
                          </div>
                        </motion.div>

                        <motion.div
                          variants={itemVariants}
                          className="space-y-2"
                        >
                          <label
                            htmlFor="signupPassword"
                            className="block text-sm font-medium"
                          >
                            Password
                          </label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                            <input
                              id="signupPassword"
                              name="password"
                              placeholder="••••••••"
                              type={showPassword ? "text" : "password"}
                              value={formData.password}
                              onChange={handleChange}
                              className="pl-10 bg-[#0a192f]/50 border border-gray-700 text-white w-full p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                              required
                            />
                            <button
                              type="button"
                              onClick={togglePasswordVisibility}
                              className="absolute right-3 top-3.5 text-gray-400 hover:text-white transition-colors"
                              aria-label={
                                showPassword ? "Hide password" : "Show password"
                              }
                            >
                              {showPassword ? (
                                <EyeOff className="w-5 h-5" />
                              ) : (
                                <Eye className="w-5 h-5" />
                              )}
                            </button>
                          </div>
                        </motion.div>

                        <motion.div
                          variants={itemVariants}
                          className="space-y-2"
                        >
                          <label
                            htmlFor="confirmPassword"
                            className="block text-sm font-medium"
                          >
                            Confirm Password
                          </label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                            <input
                              id="confirmPassword"
                              name="confirmPassword"
                              placeholder="••••••••"
                              type={showPassword ? "text" : "password"}
                              value={formData.confirmPassword}
                              onChange={handleChange}
                              className="pl-10 bg-[#0a192f]/50 border border-gray-700 text-white w-full p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                              required
                            />
                          </div>
                        </motion.div>

                        <motion.div
                          variants={itemVariants}
                          className="flex items-center space-x-2"
                        >
                          <input
                            type="checkbox"
                            id="agreeToTerms"
                            name="agreeToTerms"
                            checked={formData.agreeToTerms}
                            onChange={handleChange}
                            className="h-4 w-4 rounded border-gray-700 bg-[#0a192f]/50 text-teal-500 focus:ring-teal-500 focus:ring-offset-0"
                            required
                          />
                          <label htmlFor="agreeToTerms" className="text-sm">
                            I agree to the{" "}
                            <a
                              href="#"
                              className="text-teal-400 underline transition-colors hover:text-teal-300"
                            >
                              terms and conditions
                            </a>
                          </label>
                        </motion.div>
                      </div>

                      <motion.button
                        variants={itemVariants}
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full px-6 py-3 text-white transition-all duration-300 rounded-lg ${
                          isSubmitting
                            ? "bg-teal-700 cursor-not-allowed"
                            : "bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700"
                        }`}
                        onClick={(e) => {
                          e.preventDefault();
                          handleSubmit(e);
                        }}
                      >
                        {isSubmitting ? (
                          <span className="flex items-center justify-center">
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
                            Processing...
                          </span>
                        ) : (
                          "Create Account"
                        )}
                      </motion.button>
                    </form>
                  </div>
                  <div className="p-6 border-t border-gray-700/50">
                    <div className="relative w-full">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-700"></div>
                      </div>
                      <div className="relative flex justify-center text-xs">
                        <span className="bg-[#1e293b] px-2 text-gray-400">
                          Or continue with
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-center w-full mt-5">
                      <motion.button
                        variants={itemVariants}
                        className="bg-[#1e293b] border border-gray-700 text-white hover:bg-[#0f172a]/80 transition-all duration-300 p-3 rounded-lg flex items-center justify-center gap-2 w-64 font-medium"
                        onClick={handleGoogleSignIn}
                        disabled={isLoading}
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24">
                          <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            fill="#4285F4"
                          />
                          <path
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            fill="#34A853"
                          />
                          <path
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            fill="#FBBC05"
                          />
                          <path
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            fill="#EA4335"
                          />
                        </svg>
                        {isLoading ? "Signing in..." : "Google"}
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
      <AnimatePresence>
        {showAuthFeedbackModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-md p-6 text-white bg-gradient-to-br from-[#1e293b]/90 to-[#1e293b]/70 border border-gray-700/50 backdrop-blur-sm rounded-xl shadow-xl"
            >
              <div className="flex flex-col items-center text-center">
                <div
                  className={`flex items-center justify-center w-16 h-16 mb-4 rounded-full ${
                    authFeedbackModalConfig.type === "success"
                      ? "bg-gradient-to-br from-teal-500/30 to-teal-400/10"
                      : "bg-gradient-to-br from-red-500/30 to-red-400/10"
                  }`}
                >
                  {authFeedbackModalConfig.type === "success" ? (
                    <Mail className="w-8 h-8 text-teal-400" />
                  ) : (
                    <AlertCircle className="w-8 h-8 text-red-400" />
                  )}
                </div>
                <h3 className="mb-2 text-xl font-bold">
                  {authFeedbackModalConfig.title}
                </h3>
                <p className="mb-6 text-gray-300">
                  {authFeedbackModalConfig.message}
                  {authFeedbackModalConfig.type === "success" &&
                    authFeedbackModalConfig.email && (
                      <>
                        {" "}
                        To{" "}
                        <span className="font-medium text-teal-400">
                          {authFeedbackModalConfig.email}
                        </span>
                        .
                      </>
                    )}
                </p>
                <div className="flex gap-3">
                  {authFeedbackModalConfig.type === "success" ? (
                    <>
                      <button
                        onClick={() => {
                          setShowAuthFeedbackModal(false);
                          setTab("login");
                          setFormData({
                            firstName: "",
                            lastName: "",
                            email: "",
                            password: "",
                            confirmPassword: "",
                            rememberMe: false,
                            agreeToTerms: false,
                          });
                        }}
                        className="px-6 py-2 text-white transition-colors bg-teal-500 rounded-lg hover:bg-teal-600"
                      >
                        Go to Login
                      </button>
                      <button
                        onClick={() => setShowAuthFeedbackModal(false)}
                        className="px-6 py-2 text-gray-300 transition-colors border border-gray-600 rounded-lg hover:text-white hover:border-gray-500"
                      >
                        Close
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setShowAuthFeedbackModal(false);
                          setFormData((prev) => ({
                            ...prev,
                            password: "",
                            confirmPassword: "",
                          }));
                        }}
                        className="px-6 py-2 text-white transition-colors bg-red-500 rounded-lg hover:bg-red-600"
                      >
                        Try Again
                      </button>
                      <button
                        onClick={() => setShowAuthFeedbackModal(false)}
                        className="px-6 py-2 text-gray-300 transition-colors border border-gray-600 rounded-lg hover:text-white hover:border-gray-500"
                      >
                        Close
                      </button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
