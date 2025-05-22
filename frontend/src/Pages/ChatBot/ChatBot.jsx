import { useState, useEffect, useRef } from "react";
import {
  SendHorizonal,
  Paperclip,
  Mic,
  Bot,
  User,
  Calculator,
  Atom,
  Dna,
  Microscope,
  Menu,
  X,
} from "lucide-react";

// Inline SVG for FaTrophy
const FaTrophyIcon = (props) => (
  <svg
    stroke="currentColor"
    fill="currentColor"
    strokeWidth="0"
    viewBox="0 0 576 512"
    height="1em"
    width="1em"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M552 64H448V48C448 21.49 426.51 0 400 0H176c-26.51 0-48 21.49-48 48v16H24C10.745 64 0 74.745 0 88v56C0 154.755 10.745 160 24 160h20v272C44 448.512 60.512 464 76.001 464h80c17.672 0 32-14.328 32-32V320h176v112c0 17.672 14.328 32 32 32h80c15.488 0 32-15.488 32-32V160h20c13.255 0 24-5.245 24-16V88c0-13.255-10.745-24-24-24zM160 432H96V160h64v272zm0-304H96V96h64v32zm256 304h-64V160h64v272zm0-304h-64V96h64v32z"></path>
  </svg>
);

// ChatBot component now reads Gemini API key from environment variable
const ChatBot = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [loading, setLoading] = useState(true); // Initial page load
  const [isBotTyping, setIsBotTyping] = useState(false); // For Gemini API response loading
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toastifyLoaded, setToastifyLoaded] = useState(false);

  const recognitionRef = useRef(null);
  const fileInputRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  // Retrieve the API key from environment variables
  // In a Create React App, environment variables must start with REACT_APP_
  // For Vite, it would be import.meta.env.VITE_GEMINI_API_KEY
  const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;

  useEffect(() => {
    // Load Toastify JS and CSS from CDN
    if (
      !document.querySelector(
        'script[src="https://cdn.jsdelivr.net/npm/toastify-js"]'
      )
    ) {
      const toastifyCSS = document.createElement("link");
      toastifyCSS.rel = "stylesheet";
      toastifyCSS.href =
        "https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css";
      document.head.appendChild(toastifyCSS);

      const toastifyScript = document.createElement("script");
      toastifyScript.src = "https://cdn.jsdelivr.net/npm/toastify-js";
      toastifyScript.onload = () => {
        setToastifyLoaded(true);
      };
      toastifyScript.onerror = () => {
        console.error("Failed to load Toastify script from CDN.");
      };
      document.body.appendChild(toastifyScript);
    } else {
      if (window.Toastify) {
        setToastifyLoaded(true);
      }
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    if (!SpeechRecognition) {
      showToast("আপনার ব্রাউজার স্পিচ রেকগনিশন সাপোর্ট করে না।", "error");
    } else {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = "bn-BD";

      recognitionRef.current.onresult = (event) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setInput(transcript);
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error:", event);
        setIsRecording(false);
        showToast(
          `স্পিচ রেকগনিশন ব্যর্থ হয়েছে: ${event.error.replace(/_/g, " ")}`,
          "error"
        );
        if (mediaRecorderRef.current?.state === "recording") {
          mediaRecorderRef.current.start();
        }
        audioChunksRef.current = [];
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };
    }

    const handleResize = () => {
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
        textareaRef.current.style.height = `${Math.min(
          textareaRef.current.scrollHeight,
          120
        )}px`;
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", handleResize);
      if (recognitionRef.current && recognitionRef.current.abort) {
        recognitionRef.current.abort();
      }
      if (mediaRecorderRef.current?.state === "recording") {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  const showToast = (text, type = "info", duration = 3000) => {
    if (toastifyLoaded && window.Toastify) {
      let backgroundColor;
      switch (type) {
        case "error":
          backgroundColor = "#ff0000";
          break;
        case "success":
          backgroundColor = "#4CAF50";
          break;
        case "warning":
          backgroundColor = "#ffcc00";
          break;
        default:
          backgroundColor = "#3498db";
      }
      window
        .Toastify({
          text: text,
          duration: duration,
          gravity: "top",
          position: "right",
          style: {
            background: backgroundColor,
            color: type === "warning" ? "#000000" : "#ffffff",
          },
          stopOnFocus: true,
        })
        .showToast();
    } else {
      console.warn(
        "Toastify not loaded yet, or failed to load. Message:",
        text
      );
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        120
      )}px`;
    }
  }, [input]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isBotTyping]);

  const toggleRecording = async () => {
    if (!recognitionRef.current) {
      showToast("স্পিচ রেকগনিশন এই ব্রাউজারে সমর্থিত নয়।", "warning");
      return;
    }

    if (!isRecording) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });

        recognitionRef.current.start();
        setIsRecording(true);

        mediaRecorderRef.current = new MediaRecorder(stream);
        audioChunksRef.current = [];

        mediaRecorderRef.current.ondataavailable = (e) => {
          if (e.data.size > 0) {
            audioChunksRef.current.push(e.data);
          }
        };

        mediaRecorderRef.current.onstop = () => {
          stream.getTracks().forEach((track) => track.stop());
        };

        mediaRecorderRef.current.start();
      } catch (err) {
        showToast(
          "মাইক্রোফোন অ্যাক্সেস অনুমতি দেওয়া হয়নি বা কোনো ত্রুটি ঘটেছে।",
          "error"
        );
        console.error("Error accessing microphone or starting recording:", err);
        setIsRecording(false);
      }
    } else {
      if (recognitionRef.current) recognitionRef.current.stop();
      if (mediaRecorderRef.current?.state === "recording") {
        mediaRecorderRef.current.stop();
      }
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userInput = input.trim();
    const userMessage = {
      from: "user",
      type: "text",
      content: userInput,
    };

    setMessages((prevMessages) => {
      const updatedMessages = [...prevMessages, userMessage];
      sendToGeminiAPI(updatedMessages, userInput);
      return updatedMessages;
    });

    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const sendToGeminiAPI = async (currentMessages, currentUserInput) => {
    // Use the geminiApiKey read from process.env at the component level
    if (!geminiApiKey) {
      showToast(
        "API Key configure করা হয়নি। অনুগ্রহ করে অ্যাডমিনকে জানান।",
        "error"
      );
      setIsBotTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          from: "bot",
          type: "text",
          content: "দুঃখিত, API Key ছাড়া আমি উত্তর দিতে পারবো না।",
        },
      ]);
      return;
    }
    setIsBotTyping(true);

    try {
      const historyForAPI = currentMessages
        .filter((msg) => msg.type === "text")
        .map((msg) => ({
          role: msg.from === "user" ? "user" : "model",
          parts: [{ text: msg.content }],
        }));

      const payload = {
        contents: historyForAPI,
      };

      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`;

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Gemini API error details:", errorData);
        const errorMessage =
          errorData?.error?.message ||
          `API অনুরোধ ব্যর্থ হয়েছে (স্ট্যাটাস ${response.status})`;
        showToast(`দুঃখিত, একটি সমস্যা হয়েছে: ${errorMessage}`, "error", 4000);
        setMessages((prev) => [
          ...prev,
          {
            from: "bot",
            type: "text",
            content: "দুঃখিত, আমি এই মুহূর্তে উত্তর দিতে পারছি না।",
          },
        ]);
        setIsBotTyping(false);
        return;
      }

      const result = await response.json();

      if (
        result.candidates &&
        result.candidates.length > 0 &&
        result.candidates[0].content &&
        result.candidates[0].content.parts &&
        result.candidates[0].content.parts.length > 0
      ) {
        const botText = result.candidates[0].content.parts[0].text;
        const botMessage = {
          from: "bot",
          type: "text",
          content: botText,
        };
        setMessages((prevMessages) => [...prevMessages, botMessage]);
      } else if (result.promptFeedback && result.promptFeedback.blockReason) {
        console.error("Prompt blocked by API:", result.promptFeedback);
        const blockReasonText = result.promptFeedback.blockReason
          .replace(/_/g, " ")
          .toLowerCase();
        const safetyRatingsInfo =
          result.promptFeedback.safetyRatings
            ?.map(
              (r) =>
                `${r.category
                  .replace("HARM_CATEGORY_", "")
                  .toLowerCase()}: ${r.probability.toLowerCase()}`
            )
            .join(", ") || "";
        const blockMessage = `আপনার অনুরোধটি প্রক্রিয়া করা যায়নি। কারণ: ${blockReasonText}. ${
          safetyRatingsInfo ? `(${safetyRatingsInfo})` : ""
        }`;
        showToast(blockMessage, "warning", 5000);
        setMessages((prev) => [
          ...prev,
          {
            from: "bot",
            type: "text",
            content: "দুঃখিত, আপনার অনুরোধটি আমি প্রক্রিয়া করতে পারিনি।",
          },
        ]);
      } else {
        console.error("Unexpected Gemini API response structure:", result);
        showToast("আমি একটি অপ্রত্যাশিত উত্তর পেয়েছি।", "error");
        setMessages((prev) => [
          ...prev,
          {
            from: "bot",
            type: "text",
            content: "আমি একটি অপ্রত্যাশিত উত্তর পেয়েছি।",
          },
        ]);
      }
    } catch (error) {
      console.error("Error sending message to Gemini:", error);
      showToast("বার্তা পাঠাতে একটি নেটওয়ার্ক ত্রুটি ঘটেছে।", "error");
      setMessages((prev) => [
        ...prev,
        {
          from: "bot",
          type: "text",
          content: "দুঃখিত, একটি নেটওয়ার্ক সমস্যা হয়েছে।",
        },
      ]);
    } finally {
      setIsBotTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      const fileArray = Array.from(files).map((file) => ({
        type: "file",
        content: file.name,
        from: "user",
        fileData: file,
      }));
      setMessages((prev) => [...prev, ...fileArray]);
      showToast(
        "ফাইল(গুলি) সংযুক্ত হয়েছে। বর্তমানে, ফাইল সামগ্রী চ্যাটে প্রক্রিয়া করা হয় না।"
      );
    }
  };

  const selectSubject = (subject) => {
    setSelectedSubject(subject);
    setMobileMenuOpen(false);
    const subjectName = getSubjectName(subject);
    const userMessageText = `আমি ${subjectName} সম্পর্কে জানতে চাই।`;

    const userMessage = {
      type: "text",
      content: userMessageText,
      from: "user",
    };

    setMessages((prevMessages) => {
      const updatedMessages = [...prevMessages, userMessage];
      sendToGeminiAPI(updatedMessages, userMessageText);
      return updatedMessages;
    });
  };

  const getSubjectName = (subject) => {
    switch (subject) {
      case "physics":
        return "পদার্থবিজ্ঞান";
      case "chemistry":
        return "রসায়ন";
      case "biology":
        return "জীববিজ্ঞান";
      case "math":
        return "গণিত";
      default:
        return "";
    }
  };

  // Loading screen
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center p-4 h-screen pt-16 text-white bg-gradient-to-br from-[#1a2e4c] to-[#0f172a]">
        <div className="relative flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32">
          <div className="absolute w-full h-full border-4 border-teal-500 rounded-full animate-spin border-t-transparent"></div>
          <div className="absolute w-3/4 border-4 border-teal-400 rounded-full h-3/4 animate-spin border-t-transparent animation-delay-200"></div>
          <FaTrophyIcon className="w-8 h-8 text-teal-400 animate-pulse sm:w-10 sm:h-10 md:w-12 md:h-12" />
        </div>
        <p className="mt-6 text-base font-semibold tracking-wider animate-pulse sm:text-lg md:text-xl">
          জ্ঞান অর্জনের নতুন পথ...
        </p>
        <p className="mt-2 text-xs text-slate-400">অনুগ্রহ করে অপেক্ষা করুন।</p>
      </div>
    );
  }

  // Initial API Key Check (runs once after loading is false)
  // Moved here to ensure it runs after initial loading screen
  if (!loading && !geminiApiKey) {
    return (
      <div className="flex flex-col justify-center items-center p-4 h-screen text-white bg-gradient-to-br from-[#1a2e4c] to-[#0f172a]">
        <h1 className="mb-4 text-2xl font-bold text-red-500">
          Configuration Error
        </h1>
        <p className="text-center">
          Gemini API key configure করা হয়নি।
          <br />
          অনুগ্রহ করে{" "}
          <code className="px-1 bg-red-700 rounded">
            REACT_APP_GEMINI_API_KEY
          </code>{" "}
          এনভায়রনমেন্ট ভেরিয়েবল সেট করুন
          <br />
          এবং অ্যাপ্লিকেশনটি পুনরায় তৈরি করুন।
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-[#1a2e4c] to-[#0f172a] pt-16 flex justify-center items-center">
        <div className="container flex flex-col h-[calc(100vh-4rem)] max-w-4xl w-full px-2 mx-auto sm:px-4 shadow-2xl rounded-lg overflow-hidden">
          {messages.length > 0 && (
            <div className="absolute z-50 p-2 top-2 right-2 md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 bg-[#1a2e4c]/80 backdrop-blur-sm rounded-full border border-teal-500/30 shadow-lg"
              >
                {mobileMenuOpen ? (
                  <X size={20} className="text-white" />
                ) : (
                  <Menu size={20} className="text-white" />
                )}
              </button>
            </div>
          )}

          {mobileMenuOpen && (
            <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 backdrop-blur-sm md:hidden">
              <div className="bg-[#1a2e4c]/90 p-6 rounded-xl w-[90%] max-w-sm border border-teal-500/30">
                <h3 className="mb-4 text-lg font-medium text-center text-white">
                  বিষয় নির্বাচন করুন
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {["physics", "chemistry", "biology", "math"].map(
                    (subjectKey) => (
                      <button
                        key={subjectKey}
                        onClick={() => selectSubject(subjectKey)}
                        className="flex flex-col items-center justify-center p-3 bg-[#1e3a5f]/50 hover:bg-[#1e3a5f] rounded-xl transition-all duration-300 border border-[#2a4a7f]/30"
                      >
                        <div className="w-10 h-10 bg-[#1e3a5f] rounded-full flex items-center justify-center mb-2">
                          {subjectKey === "physics" && (
                            <Microscope className="w-5 h-5 text-teal-400" />
                          )}
                          {subjectKey === "chemistry" && (
                            <Atom className="w-5 h-5 text-teal-400" />
                          )}
                          {subjectKey === "biology" && (
                            <Dna className="w-5 h-5 text-teal-400" />
                          )}
                          {subjectKey === "math" && (
                            <Calculator className="w-5 h-5 text-teal-400" />
                          )}
                        </div>
                        <span className="text-xs text-white">
                          {getSubjectName(subjectKey)}
                        </span>
                      </button>
                    )
                  )}
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2 mt-4 text-white transition-colors bg-teal-600 rounded-lg hover:bg-teal-700"
                >
                  বন্ধ করুন
                </button>
              </div>
            </div>
          )}

          <div className="flex flex-col items-center justify-center py-4 text-center sm:py-6 md:py-8 shrink-0">
            <h1 className="mb-2 text-xl font-bold text-transparent sm:text-2xl md:text-3xl bg-gradient-to-r from-teal-400 via-white to-teal-400 bg-clip-text bg-size-200 animate-text-shimmer">
              জ্ঞান সহায়ক
            </h1>
            <div className="w-16 h-1 mb-3 rounded-full sm:w-20 md:w-24 bg-gradient-to-r from-teal-500 to-teal-300 sm:mb-4 md:mb-6"></div>

            {messages.length === 0 && (
              <>
                <p className="max-w-2xl mb-2 text-sm text-white/80 sm:mb-3 md:mb-4 sm:text-base">
                  পদার্থবিজ্ঞান, রসায়ন, জীববিজ্ঞান বা গণিত - কোন বিষয়ে সাহায্য
                  প্রয়োজন?
                </p>
                <p className="mb-3 text-sm font-medium text-teal-400 sm:mb-4 md:mb-6 sm:text-base">
                  একটি বিষয় নির্বাচন করুন অথবা আপনার প্রশ্ন নিচে লিখুন।
                </p>
                <div className="grid w-full grid-cols-2 gap-2 px-2 mt-2 md:grid-cols-4 sm:gap-3 md:gap-4 sm:mt-4 sm:px-4">
                  {["physics", "chemistry", "biology", "math"].map(
                    (subjectKey) => (
                      <button
                        key={subjectKey}
                        onClick={() => selectSubject(subjectKey)}
                        className="flex flex-col items-center justify-center p-2 sm:p-3 md:p-4 bg-[#1e3a5f]/50 hover:bg-[#1e3a5f] rounded-xl transition-all duration-300 border border-[#2a4a7f]/30 hover:border-teal-500/50 hover:shadow-lg hover:shadow-teal-500/10 group"
                      >
                        <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-[#1e3a5f] rounded-full flex items-center justify-center mb-1 sm:mb-2 group-hover:bg-[#2a4a7f] transition-all duration-300">
                          {subjectKey === "physics" && (
                            <Microscope className="w-4 h-4 text-teal-400 sm:w-5 sm:h-5 md:w-6 md:h-6 group-hover:text-teal-300" />
                          )}
                          {subjectKey === "chemistry" && (
                            <Atom className="w-4 h-4 text-teal-400 sm:w-5 sm:h-5 md:w-6 md:h-6 group-hover:text-teal-300" />
                          )}
                          {subjectKey === "biology" && (
                            <Dna className="w-4 h-4 text-teal-400 sm:w-5 sm:h-5 md:w-6 md:h-6 group-hover:text-teal-300" />
                          )}
                          {subjectKey === "math" && (
                            <Calculator className="w-4 h-4 text-teal-400 sm:w-5 sm:h-5 md:w-6 md:h-6 group-hover:text-teal-300" />
                          )}
                        </div>
                        <span className="text-xs text-white sm:text-sm">
                          {getSubjectName(subjectKey)}
                        </span>
                      </button>
                    )
                  )}
                </div>
              </>
            )}
          </div>

          {messages.length > 0 || isBotTyping ? (
            <div className="flex overflow-y-auto flex-col flex-1 px-2 sm:px-4 py-2 sm:py-4 space-y-3 sm:space-y-4 w-full bg-[#1a2e4c]/30 backdrop-blur-sm rounded-t-xl custom-scrollbar">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${
                    msg.from === "bot" ? "justify-start" : "justify-end"
                  }`}
                >
                  <div
                    className={`flex items-start gap-1 sm:gap-2 max-w-[85%] sm:max-w-[80%] ${
                      msg.from === "bot" ? "flex-row" : "flex-row-reverse"
                    }`}
                  >
                    <div
                      className={`shrink-0 w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center ${
                        msg.from === "bot" ? "bg-teal-600" : "bg-blue-600"
                      }`}
                    >
                      {msg.from === "bot" ? (
                        <Bot size={14} className="text-white sm:size-5" />
                      ) : (
                        <User size={14} className="text-white sm:size-5" />
                      )}
                    </div>
                    <div
                      className={`p-2.5 sm:p-4 rounded-2xl shadow-md backdrop-blur-sm ${
                        msg.from === "bot"
                          ? "bg-gradient-to-r from-teal-700/90 to-teal-900/90 text-white border border-teal-600/30"
                          : "bg-gradient-to-r from-blue-600/90 to-blue-800/90 text-white border border-blue-500/30"
                      }`}
                    >
                      {msg.type === "text" ? (
                        <p className="text-xs leading-relaxed whitespace-pre-wrap sm:text-sm">
                          {msg.content}
                        </p>
                      ) : msg.type === "file" ? (
                        <div className="flex items-center gap-1 sm:gap-2">
                          <Paperclip size={14} className="sm:size-4" />
                          <span className="text-xs sm:text-sm truncate max-w-[150px] sm:max-w-[200px]">
                            {msg.content}
                          </span>
                        </div>
                      ) : msg.type === "audio" ? (
                        <audio
                          controls
                          src={msg.content}
                          className="w-full max-w-xs rounded"
                        ></audio>
                      ) : null}
                    </div>
                  </div>
                </div>
              ))}
              {isBotTyping && (
                <div className="flex justify-start">
                  <div className="flex items-start gap-1 sm:gap-2 max-w-[85%] sm:max-w-[80%]">
                    <div className="flex items-center justify-center w-6 h-6 bg-teal-600 rounded-full shrink-0 sm:w-8 sm:h-8">
                      <Bot size={14} className="text-white sm:size-5" />
                    </div>
                    <div className="p-2.5 sm:p-4 rounded-2xl shadow-md backdrop-blur-sm bg-gradient-to-r from-teal-700/90 to-teal-900/90 text-white border border-teal-600/30">
                      <p className="text-xs italic leading-relaxed sm:text-sm">
                        বট লিখছে...
                      </p>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          ) : (
            <div className="flex-1"></div>
          )}

          <div className="p-2 sm:p-4 bg-[#1a2e4c]/50 backdrop-blur-sm border-t border-white/5 rounded-b-xl mt-auto shrink-0">
            <div className="relative flex items-end w-full gap-1 sm:gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                className="flex-shrink-0 p-2 sm:p-2.5 text-white bg-teal-600 hover:bg-teal-700 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-teal-400 shadow-md hover:shadow-teal-500/20"
                title="ফাইল সংযুক্ত করুন"
              >
                <Paperclip size={16} className="sm:size-5" />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                multiple
                className="hidden"
                onChange={handleFileChange}
                accept="image/*,application/pdf,.doc,.docx,.txt"
              />
              <button
                type="button"
                onClick={toggleRecording}
                className={`flex-shrink-0 p-2 sm:p-2.5 text-white rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-teal-400 shadow-md ${
                  isRecording
                    ? "bg-red-600 hover:bg-red-700 animate-pulse"
                    : "bg-teal-600 hover:bg-teal-700 hover:shadow-teal-500/20"
                }`}
                title={
                  isRecording ? "রেকর্ডিং বন্ধ করুন" : "ভয়েস ইনপুট শুরু করুন"
                }
              >
                <Mic size={16} className="sm:size-5" />
              </button>
              <div className="relative flex items-center flex-1">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  rows={1}
                  placeholder="আপনার প্রশ্ন লিখুন..."
                  className="px-3 sm:px-5 py-2.5 sm:py-3 w-full rounded-2xl border border-teal-500/20 bg-[#1a2e4c]/70 text-white placeholder-white/50 resize-none focus:outline-none focus:ring-2 focus:ring-teal-400/50 shadow-inner shadow-black/20 text-xs sm:text-sm leading-tight"
                  style={{
                    minHeight: "44px",
                    maxHeight: "120px",
                    overflowY: "auto",
                  }}
                />
              </div>
              <button
                type="button"
                onClick={handleSend}
                disabled={!input.trim() || isBotTyping}
                className={`p-2 sm:p-2.5 text-white rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-teal-400 shadow-md ${
                  input.trim() && !isBotTyping
                    ? "bg-teal-600 hover:bg-teal-700 hover:shadow-teal-500/20"
                    : "bg-teal-600/50 cursor-not-allowed"
                }`}
                title="বার্তা পাঠান"
              >
                <SendHorizonal size={16} className="sm:size-5" />
              </button>
            </div>
          </div>
        </div>

        {isRecording && (
          <div
            className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={toggleRecording}
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-500 rounded-full flex items-center justify-center animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.7)]">
              <Mic size={30} className="text-white sm:size-10" />
            </div>
            <p className="mt-4 text-sm font-medium text-white sm:text-base">
              রেকর্ডিং চলছে... থামাতে ট্যাপ করুন।
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default ChatBot;

/*
// How to use this component:
// 1. Ensure you have REACT_APP_GEMINI_API_KEY set in your .env file for Create React App
//    (e.g., REACT_APP_GEMINI_API_KEY=your_actual_api_key)
//    For Vite, use VITE_GEMINI_API_KEY and access it via import.meta.env.VITE_GEMINI_API_KEY.
//
// 2. Import and use the ChatBot component in your application:
//
// import React from 'react';
// import ChatBot from './ChatBot'; // Assuming ChatBot.jsx is in the same directory
// import './App.css'; // Or your main CSS file
//
// function App() {
//   return (
//     <div className="App">
//       {/* Optional: Add a header or other layout elements around the ChatBot *\/}
//       {/* <header className="App-header"><h1>My Chat Application</h1></header> *\/}
//       <ChatBot />
//       {/* Optional: Add a footer *\/}
//       {/* <footer><p>&copy; 2024 My Chat App</p></footer> *\/}
//     </div>
//   );
// }
//
// export default App;
*/
