"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/auth-context";
import { useLanguage } from "../contexts/language-context";
import logoImage from "../assets/images/logo.png";
import "./lab-notice.css";
import {
  ChevronRight,
  BookOpen,
  Mic,
  Beaker,
  Atom,
  Dna,
  Calculator,
  ArrowRight,
  CheckCircle,
  Menu,
  X,
  ExternalLink,
} from "lucide-react";

export default function LandingPage() {
  const { user } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLabNotice, setShowLabNotice] = useState(true);

  // Track scroll position for header styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "bn" : "en");
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: (i = 0) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.6,
        ease: [0.43, 0.13, 0.23, 0.96],
      },
    }),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a192f] to-[#164e63] text-white overflow-hidden">
      {/* Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-[#0a192f]/90 backdrop-blur-md py-3 shadow-lg"
            : "bg-transparent py-6"
        }`}
      >
        <div className="container flex items-center justify-between px-4 mx-auto">
          <div className="flex items-center gap-2">
            <img src={logoImage} alt="OpenLearn Logo" className="w-auto h-16" />
          </div>

          {/* Desktop Navigation */}
          <div className="items-center hidden gap-6 md:flex">
            <nav>
              <ul className="flex gap-6">
                <li>
                  <a
                    href="#features"
                    className="text-gray-300 transition-colors hover:text-teal-400"
                  >
                    {t("nav.features")}
                  </a>
                </li>
                <li>
                  <a
                    href="#how-it-works"
                    className="text-gray-300 transition-colors hover:text-teal-400"
                  >
                    {t("nav.howItWorks")}
                  </a>
                </li>
                <li>
                  <a
                    href="#benefits"
                    className="text-gray-300 transition-colors hover:text-teal-400"
                  >
                    {t("nav.benefits")}
                  </a>
                </li>
              </ul>
            </nav>

            {user ? (
              <Link
                to="/dashboard"
                className="flex items-center px-4 py-2 text-white transition-colors bg-teal-500 rounded-md hover:bg-teal-600"
              >
                {t("nav.dashboard")}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            ) : (
              <>
                <Link
                  to="/auth"
                  className="px-4 py-2 text-teal-400 transition-colors border border-teal-400 rounded-md hover:bg-teal-400/10"
                >
                  {t("nav.login")}
                </Link>
                <Link
                  to="/auth?tab=signup"
                  className="px-4 py-2 text-white transition-colors bg-teal-500 rounded-md hover:bg-teal-600"
                >
                  {t("nav.signup")}
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="text-white md:hidden"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              className="md:hidden absolute top-full left-0 right-0 bg-[#0a192f]/95 backdrop-blur-md"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <div className="container flex flex-col gap-4 px-4 py-6 mx-auto">
                <nav>
                  <ul className="flex flex-col gap-4">
                    <li>
                      <a
                        href="#features"
                        className="block py-2 text-gray-300 transition-colors hover:text-teal-400"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {t("nav.features")}
                      </a>
                    </li>
                    <li>
                      <a
                        href="#how-it-works"
                        className="block py-2 text-gray-300 transition-colors hover:text-teal-400"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {t("nav.howItWorks")}
                      </a>
                    </li>
                    <li>
                      <a
                        href="#benefits"
                        className="block py-2 text-gray-300 transition-colors hover:text-teal-400"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {t("nav.benefits")}
                      </a>
                    </li>
                  </ul>
                </nav>

                <button
                  className="py-2 text-left text-white transition-colors hover:text-teal-400"
                  onClick={() => {
                    toggleLanguage();
                    setMobileMenuOpen(false);
                  }}
                >
                  {language === "en" ? "বাংলা" : "English"}
                </button>

                <div className="flex flex-col gap-3 mt-2">
                  {user ? (
                    <Link
                      to="/dashboard"
                      className="flex items-center justify-center px-4 py-2 text-center text-white transition-colors bg-teal-500 rounded-md hover:bg-teal-600"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {t("nav.dashboard")}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  ) : (
                    <>
                      <Link
                        to="/auth"
                        className="px-4 py-2 text-center text-teal-400 transition-colors border border-teal-400 rounded-md hover:bg-teal-400/10"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {t("nav.login")}
                      </Link>
                      <Link
                        to="/auth?tab=signup"
                        className="px-4 py-2 text-center text-white transition-colors bg-teal-500 rounded-md hover:bg-teal-600"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {t("nav.signup")}
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Virtual Lab Notice Banner */}
      {showLabNotice && (
        <div className="fixed left-0 right-0 z-40 px-4 top-24 md:top-28">
          <motion.div
            className="max-w-5xl mx-auto overflow-hidden border rounded-lg shadow-lg bg-gradient-to-r from-purple-500/20 to-purple-700/20 backdrop-blur-md border-purple-500/30 shadow-purple-900/20"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative p-4 md:p-5">
              <button
                onClick={() => setShowLabNotice(false)}
                className="absolute text-purple-200 transition-colors top-2 right-2 hover:text-white"
                aria-label="Close notification"
              >
                <X size={20} />
              </button>

              <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 p-2 rounded-full bg-purple-500/30">
                    <Beaker className="w-6 h-6 text-purple-300" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {t("labNotice.title")}
                    </h3>
                    <p className="text-purple-200">
                      {t("labNotice.description")}
                    </p>
                  </div>
                </div>

                <a
                  href="https://amarlabratory.netlify.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-2 text-white transition-colors bg-purple-600 rounded-md shadow-md group hover:bg-purple-700 shadow-purple-900/30"
                >
                  {t("labNotice.cta")}
                  <ExternalLink
                    size={16}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </a>
              </div>
            </div>

            {/* Animated Border */}
            <div className="w-full h-1 bg-gradient-to-r from-purple-500 via-violet-500 to-purple-500 background-animate"></div>
          </motion.div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative flex items-center min-h-screen px-4 pt-24">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-3xl"></div>
          <div className="absolute top-[30%] -left-40 w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-blue-500/5 rounded-full blur-3xl"></div>
        </div>

        <div className="container relative z-10 mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div initial="hidden" animate="visible" variants={fadeIn}>
              <motion.h1
                className="mb-6 text-4xl font-bold leading-tight sm:text-5xl md:text-6xl"
                variants={fadeIn}
                custom={0}
              >
                {t("hero.title")}
              </motion.h1>

              <motion.p
                className="max-w-2xl mx-auto mb-10 text-lg text-gray-300 sm:text-xl"
                variants={fadeIn}
                custom={1}
              >
                {t("hero.subtitle")}
              </motion.p>

              <motion.div
                className="flex flex-col justify-center gap-5 sm:flex-row"
                variants={fadeIn}
                custom={2}
              >
                <Link
                  to="/chatbot"
                  className="group bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white px-8 py-4 text-lg rounded-md flex items-center justify-center shadow-lg shadow-teal-900/20 transform transition-all duration-300 hover:translate-y-[-2px] hover:shadow-xl hover:shadow-teal-900/30"
                >
                  {t("hero.learnScience")}
                  <ChevronRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                </Link>

                <Link
                  to="/english"
                  className="group border-2 border-purple-400 text-purple-300 hover:text-purple-200 hover:border-purple-300 hover:bg-purple-400/10 px-8 py-4 text-lg rounded-md flex items-center justify-center shadow-lg shadow-purple-900/10 transform transition-all duration-300 hover:translate-y-[-2px] hover:shadow-xl hover:shadow-purple-900/20"
                >
                  {t("hero.practiceEnglish")}
                  <Mic className="w-5 h-5 ml-2 transition-transform group-hover:scale-110" />
                </Link>
              </motion.div>
            </motion.div>

            <motion.div
              className="flex justify-center mt-20"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            ></motion.div>
          </div>
        </div>

        <div className="absolute left-0 right-0 flex items-center justify-center w-full mx-auto bottom-8 animate-bounce">
          <div className="flex flex-col items-center">
            <span className="mb-2 text-sm text-gray-400">
              {t("hero.scrollToExplore")}
            </span>
            <ArrowRight className="w-5 h-5 text-gray-400 transform rotate-90" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container px-4 py-24 mx-auto">
        <div className="mb-16 text-center">
          <motion.span
            className="inline-block px-3 py-1 mb-4 text-sm text-teal-400 rounded-full bg-teal-500/20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {t("features.title")}
          </motion.span>
          <motion.h2
            className="mb-6 text-3xl font-bold sm:text-4xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {t("features.subtitle")}
          </motion.h2>
          <motion.p
            className="max-w-2xl mx-auto text-gray-300"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {t("features.description")}
          </motion.p>
        </div>

        <div className="grid gap-10 md:grid-cols-2">
          {/* Bengali Science Chatbot */}
          <motion.div
            className="group bg-gradient-to-br from-[#1e293b]/70 to-[#1e293b]/40 border border-gray-700/50 backdrop-blur-sm overflow-hidden rounded-xl shadow-xl relative"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            whileHover={{ translateY: -5 }}
          >
            <div className="absolute inset-0 transition-opacity duration-500 opacity-0 bg-teal-500/5 group-hover:opacity-100"></div>
            <div className="p-8">
              <div className="flex items-center justify-center w-16 h-16 mb-6 shadow-lg rounded-2xl bg-gradient-to-br from-teal-500/30 to-teal-400/10 shadow-teal-900/10">
                <Beaker className="w-8 h-8 text-teal-400" />
              </div>
              <h3 className="mb-4 text-2xl font-bold transition-colors group-hover:text-teal-400">
                {t("features.scienceTopics.title")}
              </h3>
              <p className="mb-6 text-gray-300">
                {t("features.scienceTopics.description")}
              </p>
              <div className="flex flex-wrap gap-3 mb-6">
                <div className="flex items-center gap-2 bg-[#164e63]/50 px-3 py-2 rounded-full">
                  <Atom className="w-4 h-4 text-teal-400" />
                  <span className="text-sm">
                    {t("features.scienceTopics.physics")}
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-[#164e63]/50 px-3 py-2 rounded-full">
                  <Beaker className="w-4 h-4 text-teal-400" />
                  <span className="text-sm">
                    {t("features.scienceTopics.chemistry")}
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-[#164e63]/50 px-3 py-2 rounded-full">
                  <Dna className="w-4 h-4 text-teal-400" />
                  <span className="text-sm">
                    {t("features.scienceTopics.biology")}
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-[#164e63]/50 px-3 py-2 rounded-full">
                  <Calculator className="w-4 h-4 text-teal-400" />
                  <span className="text-sm">
                    {t("features.scienceTopics.math")}
                  </span>
                </div>
              </div>
              <button className="group bg-teal-500 hover:bg-teal-600 text-white px-5 py-2.5 rounded-lg flex items-center shadow-md shadow-teal-900/20 transition-all duration-300">
                {t("features.scienceTopics.cta")}
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </motion.div>

          {/* English Practice Conversation Tool */}
          <motion.div
            className="group bg-gradient-to-br from-[#1e293b]/70 to-[#1e293b]/40 border border-gray-700/50 backdrop-blur-sm overflow-hidden rounded-xl shadow-xl relative"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            whileHover={{ translateY: -5 }}
          >
            <div className="absolute inset-0 transition-opacity duration-500 opacity-0 bg-purple-500/5 group-hover:opacity-100"></div>
            <div className="p-8">
              <div className="flex items-center justify-center w-16 h-16 mb-6 shadow-lg rounded-2xl bg-gradient-to-br from-purple-500/30 to-purple-400/10 shadow-purple-900/10">
                <Mic className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="mb-4 text-2xl font-bold transition-colors group-hover:text-purple-400">
                {t("features.conversationPractice.title")}
              </h3>
              <p className="mb-6 text-gray-300">
                {t("features.conversationPractice.description")}
              </p>
              <div className="relative h-16 mb-6">
                <div className="absolute inset-0 flex items-center justify-center gap-1">
                  {[...Array(20)].map((_, i) => (
                    <div
                      key={i}
                      className="w-1 rounded-full bg-purple-400/80 animate-pulse"
                      style={{
                        height: `${Math.sin(i / 2) * 30 + 10}px`,
                        animationDelay: `${i * 0.1}s`,
                        animationDuration: `${0.8 + Math.random() * 1}s`,
                      }}
                    ></div>
                  ))}
                </div>
              </div>
              <button className="group bg-purple-500 hover:bg-purple-600 text-white px-5 py-2.5 rounded-lg flex items-center shadow-md shadow-purple-900/20 transition-all duration-300">
                {t("features.conversationPractice.cta")}
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="relative px-4 py-24">
        <div className="absolute inset-0 bg-[#0a192f] opacity-50"></div>
        <div className="container relative z-10 mx-auto">
          <div className="mb-16 text-center">
            <motion.span
              className="inline-block px-3 py-1 mb-4 text-sm text-blue-400 rounded-full bg-blue-500/20"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              {t("howItWorks.title")}
            </motion.span>
            <motion.h2
              className="mb-6 text-3xl font-bold sm:text-4xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {t("howItWorks.subtitle")}
            </motion.h2>
            <motion.p
              className="max-w-2xl mx-auto text-gray-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {t("howItWorks.description")}
            </motion.p>
          </div>

          <div className="mb-20">
            <h3 className="mb-10 text-2xl font-bold text-center text-teal-400">
              {t("howItWorks.bengaliSectionTitle")}
            </h3>
            <div className="grid gap-8 md:grid-cols-3">
              {[
                {
                  title: t("howItWorks.step1.title"),
                  description: t("howItWorks.step1.description"),
                  icon: <BookOpen className="w-10 h-10 text-teal-400" />,
                  delay: 0,
                },
                {
                  title: t("howItWorks.step2.title"),
                  description: t("howItWorks.step2.description"),
                  icon: <Beaker className="w-10 h-10 text-teal-400" />,
                  delay: 0.2,
                },
                {
                  title: t("howItWorks.step3.title"),
                  description: t("howItWorks.step3.description"),
                  icon: <CheckCircle className="w-10 h-10 text-teal-400" />,
                  delay: 0.4,
                },
              ].map((step, index) => (
                <motion.div
                  key={index}
                  className="relative"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: step.delay }}
                >
                  <div className="bg-gradient-to-br from-[#1e293b]/70 to-[#1e293b]/40 border border-teal-500/20 backdrop-blur-sm h-full rounded-xl shadow-xl overflow-hidden group hover:border-teal-500/50 transition-all duration-300">
                    <div className="flex flex-col items-center p-8 text-center">
                      <div className="flex items-center justify-center w-24 h-24 mb-6 transition-all duration-300 rounded-full shadow-lg bg-gradient-to-br from-teal-500/30 to-teal-400/5 shadow-teal-900/10 group-hover:shadow-teal-900/30">
                        {step.icon}
                      </div>
                      <div className="absolute flex items-center justify-center w-12 h-12 font-bold text-white bg-teal-500 rounded-full shadow-lg -top-4 -left-4 shadow-teal-900/20">
                        {index + 1}
                      </div>
                      <h4 className="mb-3 text-xl font-bold text-teal-400">
                        {step.title}
                      </h4>
                      <p className="text-gray-300">{step.description}</p>
                    </div>
                  </div>
                  {index < 2 && (
                    <div className="absolute z-10 hidden transform -translate-y-1/2 md:block top-1/2 -right-8">
                      <div className="p-3 rounded-full shadow-md bg-gradient-to-r from-teal-500/20 to-teal-400/10">
                        <ArrowRight className="w-6 h-6 text-teal-400" />
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-10 text-2xl font-bold text-center text-purple-400">
              {t("howItWorks.englishSectionTitle")}
            </h3>
            <div className="grid gap-8 md:grid-cols-3">
              {[
                {
                  title: t("howItWorks.englishStep1.title"),
                  description: t("howItWorks.englishStep1.description"),
                  icon: <BookOpen className="w-10 h-10 text-purple-400" />,
                  delay: 0,
                },
                {
                  title: t("howItWorks.englishStep2.title"),
                  description: t("howItWorks.englishStep2.description"),
                  icon: <Mic className="w-10 h-10 text-purple-400" />,
                  delay: 0.2,
                },
                {
                  title: t("howItWorks.englishStep3.title"),
                  description: t("howItWorks.englishStep3.description"),
                  icon: <CheckCircle className="w-10 h-10 text-purple-400" />,
                  delay: 0.4,
                },
              ].map((step, index) => (
                <motion.div
                  key={index}
                  className="relative"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: step.delay }}
                >
                  <div className="bg-gradient-to-br from-[#1e293b]/70 to-[#1e293b]/40 border border-purple-500/20 backdrop-blur-sm h-full rounded-xl shadow-xl overflow-hidden group hover:border-purple-500/50 transition-all duration-300">
                    <div className="flex flex-col items-center p-8 text-center">
                      <div className="flex items-center justify-center w-24 h-24 mb-6 transition-all duration-300 rounded-full shadow-lg bg-gradient-to-br from-purple-500/30 to-purple-400/5 shadow-purple-900/10 group-hover:shadow-purple-900/30">
                        {step.icon}
                      </div>
                      <div className="absolute flex items-center justify-center w-12 h-12 font-bold text-white bg-purple-500 rounded-full shadow-lg -top-4 -left-4 shadow-purple-900/20">
                        {index + 1}
                      </div>
                      <h4 className="mb-3 text-xl font-bold text-purple-400">
                        {step.title}
                      </h4>
                      <p className="text-gray-300">{step.description}</p>
                    </div>
                  </div>
                  {index < 2 && (
                    <div className="absolute z-10 hidden transform -translate-y-1/2 md:block top-1/2 -right-8">
                      <div className="p-3 rounded-full shadow-md bg-gradient-to-r from-purple-500/20 to-purple-400/10">
                        <ArrowRight className="w-6 h-6 text-purple-400" />
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="container px-4 py-24 mx-auto">
        <div className="mb-16 text-center">
          <motion.span
            className="inline-block px-3 py-1 mb-4 text-sm text-green-400 rounded-full bg-green-500/20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {t("benefits.title")}
          </motion.span>
          <motion.h2
            className="mb-6 text-3xl font-bold sm:text-4xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {t("benefits.subtitle")}
          </motion.h2>
          <motion.p
            className="max-w-2xl mx-auto text-gray-300"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {t("benefits.description")}
          </motion.p>
        </div>

        <div className="grid max-w-6xl grid-cols-1 gap-8 px-4 mx-auto sm:grid-cols-2 lg:grid-cols-3 justify-items-center">
          {[
            {
              title: t("benefits.benefit1.title"),
              description: t("benefits.benefit1.description"),
              color: "from-teal-500/20 to-teal-500/5",
              borderColor: "border-teal-500/30",
              hoverBorderColor: "hover:border-teal-500/60",
              textColor: "text-teal-400",
              shadowColor: "shadow-teal-900/10",
              hoverShadowColor: "group-hover:shadow-teal-900/30",
              delay: 0,
            },
            {
              title: t("benefits.benefit2.title"),
              description: t("benefits.benefit2.description"),
              color: "from-purple-500/20 to-purple-500/5",
              borderColor: "border-purple-500/30",
              hoverBorderColor: "hover:border-purple-500/60",
              textColor: "text-purple-400",
              shadowColor: "shadow-purple-900/10",
              hoverShadowColor: "group-hover:shadow-purple-900/30",
              delay: 0.1,
            },
            {
              title: t("benefits.benefit3.title"),
              description: t("benefits.benefit3.description"),
              color: "from-blue-500/20 to-blue-500/5",
              borderColor: "border-blue-500/30",
              hoverBorderColor: "hover:border-blue-500/60",
              textColor: "text-blue-400",
              shadowColor: "shadow-blue-900/10",
              hoverShadowColor: "group-hover:shadow-blue-900/30",
              delay: 0.2,
            },
          ].map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: benefit.delay }}
            >
              <div
                className={`bg-gradient-to-br from-[#1e293b]/70 to-[#1e293b]/40 border ${benefit.borderColor} ${benefit.hoverBorderColor} backdrop-blur-sm rounded-xl shadow-xl group transition-all duration-300 h-full hover:transform hover:-translate-y-1`}
              >
                <div className="p-8">
                  <div
                    className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${benefit.color} flex items-center justify-center mb-6 shadow-lg ${benefit.shadowColor} ${benefit.hoverShadowColor} transition-all duration-300`}
                  >
                    <span className={`text-2xl font-bold ${benefit.textColor}`}>
                      {index + 1}
                    </span>
                  </div>
                  <h3 className={`text-xl font-bold mb-3 ${benefit.textColor}`}>
                    {benefit.title}
                  </h3>
                  <p className="text-gray-300">{benefit.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="relative px-4 py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-900/30 to-purple-900/30 backdrop-blur-sm"></div>
        <div className="container relative z-10 mx-auto">
          <motion.div
            className="max-w-4xl mx-auto bg-gradient-to-br from-[#1e293b]/80 to-[#1e293b]/60 border border-gray-700/50 backdrop-blur-sm rounded-2xl p-10 md:p-14 shadow-2xl text-center"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="mb-6 text-3xl font-bold md:text-4xl">
              {t("cta.title")}
            </h2>
            <p className="max-w-2xl mx-auto mb-10 text-gray-300">
              {t("cta.subtitle")}
            </p>
            <div className="flex flex-col justify-center gap-5 sm:flex-row">
              <a
                href="/auth?tab=signup"
                className="group bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white px-8 py-4 text-lg rounded-md flex items-center justify-center shadow-lg shadow-teal-900/20 transform transition-all duration-300 hover:translate-y-[-2px] hover:shadow-xl hover:shadow-teal-900/30"
              >
                {t("cta.getStarted")}
                <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
              </a>
              <a
                href="#features"
                className="group border-2 border-white/30 text-white hover:border-white/50 hover:bg-white/5 px-8 py-4 text-lg rounded-md flex items-center justify-center shadow-lg shadow-teal-900/10 transform transition-all duration-300 hover:translate-y-[-2px]"
              >
                {t("cta.learnMore")}
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0a192f] py-16 px-4 border-t border-gray-800">
        <div className="container mx-auto">
          <div className="grid gap-10 md:grid-cols-4">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <img
                  src={logoImage}
                  alt="OpenLearn Logo"
                  className="w-auto h-16"
                />
              </div>
              <p className="mb-6 text-gray-400">{t("footer.description")}</p>
              <div className="flex gap-4">
                <a
                  href="#"
                  className="text-gray-400 transition-colors hover:text-teal-400"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-gray-400 transition-colors hover:text-teal-400"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-gray-400 transition-colors hover:text-teal-400"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h4 className="mb-6 text-lg font-bold">
                {t("footer.navigation.title")}
              </h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 transition-colors hover:text-teal-400"
                  >
                    {t("footer.navigation.home")}
                  </a>
                </li>
                <li>
                  <a
                    href="#features"
                    className="text-gray-400 transition-colors hover:text-teal-400"
                  >
                    {t("footer.navigation.features")}
                  </a>
                </li>
                <li>
                  <a
                    href="#how-it-works"
                    className="text-gray-400 transition-colors hover:text-teal-400"
                  >
                    {t("footer.navigation.howItWorks")}
                  </a>
                </li>
                <li>
                  <a
                    href="#benefits"
                    className="text-gray-400 transition-colors hover:text-teal-400"
                  >
                    {t("footer.navigation.benefits")}
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="mb-6 text-lg font-bold">
                {t("footer.contact.title")}
              </h4>
              <ul className="space-y-3">
                <li className="flex items-start text-gray-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mt-1 mr-2"
                  >
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                  <span>{t("footer.contact.email")}</span>
                </li>
                <li className="flex items-start text-gray-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mt-1 mr-2"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  <span>{t("footer.contact.phone")}</span>
                </li>
                <li className="flex items-start text-gray-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mt-1 mr-2"
                  >
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <span>{t("footer.contact.address")}</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="mb-6 text-lg font-bold">
                {t("footer.language.title")}
              </h4>
              <button
                className="border border-teal-400 text-teal-400 hover:bg-teal-400/10 transition-colors px-5 py-2.5 rounded-md mb-6 w-full sm:w-auto"
                onClick={toggleLanguage}
              >
                {language === "en"
                  ? t("footer.language.switchToBengali")
                  : t("footer.language.switchToEnglish")}
              </button>
            </div>
          </div>

          <div className="pt-8 mt-12 text-center text-gray-400 border-t border-gray-800">
            <p>
              &copy; {new Date().getFullYear()} {t("footer.copyright")}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
