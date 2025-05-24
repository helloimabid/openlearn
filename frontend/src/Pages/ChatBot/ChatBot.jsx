import { useState, useEffect, useRef }
from "react";
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
  FileText,
  AlertTriangle,
  Loader2, // For loading state
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

const MAX_IMAGE_SIZE_MB = 1.5; 
const MAX_TEXT_FILE_SIZE_MB = 1;
const MAX_PDF_DOCX_SIZE_MB = 2; // Increased slightly for potentially larger office docs

const ChatBot = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [loading, setLoading] = useState(true); // Initial page load
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toastifyLoaded, setToastifyLoaded] = useState(false);
  const [pdfJsLoaded, setPdfJsLoaded] = useState(false);
  const [mammothJsLoaded, setMammothJsLoaded] = useState(false);
  const [processingFile, setProcessingFile] = useState(null); // To show loading for specific file

  const recognitionRef = useRef(null);
  const fileInputRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;

  useEffect(() => {
    // Load Toastify
    if (!document.querySelector('script[src="https://cdn.jsdelivr.net/npm/toastify-js"]')) {
        const toastifyCSS = document.createElement("link");
        toastifyCSS.rel = "stylesheet";
        toastifyCSS.href = "https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css";
        document.head.appendChild(toastifyCSS);
        const toastifyScript = document.createElement("script");
        toastifyScript.src = "https://cdn.jsdelivr.net/npm/toastify-js";
        toastifyScript.onload = () => setToastifyLoaded(true);
        toastifyScript.onerror = () => console.error("Failed to load Toastify script.");
        document.body.appendChild(toastifyScript);
    } else if (window.Toastify) setToastifyLoaded(true);

    // Load pdf.js
    if (!window.pdfjsLib && !document.querySelector('script[src*="pdf.min.js"]')) {
        const pdfJsScript = document.createElement("script");
        pdfJsScript.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.11.338/pdf.min.js"; // Use a specific version
        pdfJsScript.onload = () => {
            window.pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.11.338/pdf.worker.min.js`;
            setPdfJsLoaded(true);
        };
        pdfJsScript.onerror = () => console.error("Failed to load pdf.js script.");
        document.body.appendChild(pdfJsScript);
    } else if (window.pdfjsLib) setPdfJsLoaded(true);
    
    // Load mammoth.js
    if (!window.mammoth && !document.querySelector('script[src*="mammoth.browser.min.js"]')) {
        const mammothJsScript = document.createElement("script");
        mammothJsScript.src = "https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js";
        mammothJsScript.onload = () => setMammothJsLoaded(true);
        mammothJsScript.onerror = () => console.error("Failed to load mammoth.js script.");
        document.body.appendChild(mammothJsScript);
    } else if (window.mammoth) setMammothJsLoaded(true);


    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const timer = setTimeout(() => setLoading(false), 2500); // Slightly longer for library loads

    if (!SpeechRecognition) {
      showToast("আপনার ব্রাউজার স্পিচ রেকগনিশন সাপোর্ট করে না।", "error");
    } else {
        recognitionRef.current = new SpeechRecognition();
        Object.assign(recognitionRef.current, { continuous: false, interimResults: false, lang: "bn-BD" });
        recognitionRef.current.onresult = (event) => { /* ... existing ... */ 
            let transcript = "";
            for (let i = event.resultIndex; i < event.results.length; i++) transcript += event.results[i][0].transcript;
            setInput(transcript);
        };
        recognitionRef.current.onerror = (event) => { /* ... existing ... */ 
            console.error("Speech recognition error:", event); setIsRecording(false);
            showToast(`স্পিচ রেকগনিশন ব্যর্থ হয়েছে: ${event.error.replace(/_/g, " ")}`, "error");
            if (mediaRecorderRef.current?.state === "recording") mediaRecorderRef.current.stop();
            audioChunksRef.current = [];
        };
        recognitionRef.current.onend = () => setIsRecording(false);
    }
    
    const handleResize = () => { /* ... existing ... */ 
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
        }
    };
    window.addEventListener("resize", handleResize); handleResize();

    return () => { /* ... existing ... */ 
        clearTimeout(timer); window.removeEventListener("resize", handleResize);
        if (recognitionRef.current?.abort) recognitionRef.current.abort();
        if (mediaRecorderRef.current?.state === "recording") mediaRecorderRef.current.stop();
    };
  }, []); 

  const showToast = (text, type = "info", duration = 3000) => { /* ... existing ... */ 
    if (toastifyLoaded && window.Toastify) {
      const colors = { error: "#ff0000", success: "#4CAF50", warning: "#ffcc00", info: "#3498db" };
      window.Toastify({
        text: text, duration: duration, gravity: "top", position: "right",
        style: { background: colors[type] || colors.info, color: type === 'warning' ? '#000000' : '#ffffff' },
        stopOnFocus: true,
      }).showToast();
    } else console.warn("Toastify not loaded. Message:", text);
  };

  useEffect(() => { /* ... existing auto-resize ... */ 
    if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
        textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);
  useEffect(() => { /* ... existing auto-scroll ... */ 
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isBotTyping]);

  const toggleRecording = async () => { /* ... existing ... */ 
    if (!recognitionRef.current) { showToast("স্পিচ রেকগনিশন এই ব্রাউজারে সমর্থিত নয়।", "warning"); return; }
    if (!isRecording) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        recognitionRef.current.start(); setIsRecording(true);
        mediaRecorderRef.current = new MediaRecorder(stream); audioChunksRef.current = [];
        mediaRecorderRef.current.ondataavailable = (e) => e.data.size > 0 && audioChunksRef.current.push(e.data);
        mediaRecorderRef.current.onstop = () => stream.getTracks().forEach(track => track.stop());
        mediaRecorderRef.current.start();
      } catch (err) {
        showToast("মাইক্রোফোন অ্যাক্সেস অনুমতি দেওয়া হয়নি বা কোনো ত্রুটি ঘটেছে।", "error");
        console.error("Microphone/recording error:", err); setIsRecording(false); 
      }
    } else {
      if(recognitionRef.current) recognitionRef.current.stop();
      if (mediaRecorderRef.current?.state === "recording") mediaRecorderRef.current.stop();
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(async (file) => { // Made async to handle promises from PDF/DOCX
        const fileId = Date.now() + "_" + file.name.replace(/[^a-zA-Z0-9.]/g, "_"); // Unique ID for message
        setProcessingFile(file.name); // Indicate which file is being processed

        const fileSizeMB = file.size / (1024 * 1024);
        const reader = new FileReader();

        if (['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
            if (fileSizeMB > MAX_IMAGE_SIZE_MB) {
                showToast(`ছবি "${file.name}" (${fileSizeMB.toFixed(2)}MB) অনুমোদিত সাইজ (${MAX_IMAGE_SIZE_MB}MB) অতিক্রম করেছে।`, "error");
                setProcessingFile(null); return;
            }
            reader.onload = (event) => {
                const base64Data = event.target.result.split(',')[1];
                setMessages(prev => [...prev, { 
                    id: fileId, from: "user", type: "image", 
                    content: { name: file.name, mimeType: file.type, base64Data },
                    uiPreview: event.target.result 
                }]);
                setProcessingFile(null);
            };
            reader.readAsDataURL(file);
        } else if (file.type === 'text/plain') {
            if (fileSizeMB > MAX_TEXT_FILE_SIZE_MB) {
                showToast(`টেক্সট ফাইল "${file.name}" (${fileSizeMB.toFixed(2)}MB) অনুমোদিত সাইজ (${MAX_TEXT_FILE_SIZE_MB}MB) অতিক্রম করেছে।`, "error");
                setProcessingFile(null); return;
            }
            reader.onload = (event) => {
                setMessages(prev => [...prev, { 
                    id: fileId, from: "user", type: "file_text", 
                    content: { name: file.name, textContent: event.target.result }
                }]);
                setProcessingFile(null);
            };
            reader.readAsText(file);
        } else if (file.type === 'application/pdf' && pdfJsLoaded && window.pdfjsLib) {
            if (fileSizeMB > MAX_PDF_DOCX_SIZE_MB) {
                showToast(`PDF "${file.name}" (${fileSizeMB.toFixed(2)}MB) অনুমোদিত সাইজ (${MAX_PDF_DOCX_SIZE_MB}MB) অতিক্রম করেছে।`, "error");
                setProcessingFile(null); return;
            }
            showToast(`PDF "${file.name}" প্রক্রিয়া করা হচ্ছে...`, "info", 1500);
            try {
                const arrayBuffer = await file.arrayBuffer();
                const pdf = await window.pdfjsLib.getDocument({data: arrayBuffer}).promise;
                let fullText = "";
                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    const textContent = await page.getTextContent();
                    fullText += textContent.items.map(item => item.str).join(" ") + "\n";
                }
                setMessages(prev => [...prev, { 
                    id: fileId, from: "user", type: "file_text", // Treat as text for API
                    content: { name: file.name, textContent: fullText.trim(), originalType: 'pdf' }
                }]);
            } catch (error) {
                console.error("Error processing PDF:", error);
                showToast(`PDF "${file.name}" প্রক্রিয়া করতে সমস্যা হয়েছে।`, "error");
                setMessages(prev => [...prev, { id: fileId, from: "user", type: "file_other", content: { name: file.name, type: file.type, error: "PDF processing failed" } }]);
            } finally {
                setProcessingFile(null);
            }
        } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' && mammothJsLoaded && window.mammoth) {
            if (fileSizeMB > MAX_PDF_DOCX_SIZE_MB) {
                showToast(`DOCX "${file.name}" (${fileSizeMB.toFixed(2)}MB) অনুমোদিত সাইজ (${MAX_PDF_DOCX_SIZE_MB}MB) অতিক্রম করেছে।`, "error");
                setProcessingFile(null); return;
            }
            showToast(`DOCX "${file.name}" প্রক্রিয়া করা হচ্ছে...`, "info", 1500);
            try {
                const arrayBuffer = await file.arrayBuffer();
                const result = await window.mammoth.extractRawText({ arrayBuffer: arrayBuffer });
                setMessages(prev => [...prev, { 
                    id: fileId, from: "user", type: "file_text", // Treat as text for API
                    content: { name: file.name, textContent: result.value.trim(), originalType: 'docx' }
                }]);
            } catch (error) {
                console.error("Error processing DOCX:", error);
                showToast(`DOCX "${file.name}" প্রক্রিয়া করতে সমস্যা হয়েছে।`, "error");
                 setMessages(prev => [...prev, { id: fileId, from: "user", type: "file_other", content: { name: file.name, type: file.type, error: "DOCX processing failed" } }]);
            } finally {
                setProcessingFile(null);
            }
        }
         else {
            setMessages(prev => [...prev, { 
                id: fileId, from: "user", type: "file_other", 
                content: { name: file.name, type: file.type }
            }]);
            let unsupportedMsg = `ফাইল "${file.name}" (${file.type}) সংযুক্ত হয়েছে, কিন্তু এর বিষয়বস্তু AI দ্বারা প্রক্রিয়া করা হবে না।`;
            if (file.type === 'application/pdf' && !pdfJsLoaded) unsupportedMsg += " (PDF লাইব্রেরি লোড হয়নি)";
            if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' && !mammothJsLoaded) unsupportedMsg += " (DOCX লাইব্রেরি লোড হয়নি)";
            showToast(unsupportedMsg, "warning");
            setProcessingFile(null);
        }
        reader.onerror = () => { // General reader error for image/txt if not caught by specific handlers
            showToast(`ফাইল "${file.name}" পড়তে সমস্যা হয়েছে।`, "error");
            console.error("File reading error", reader.error);
            setProcessingFile(null);
        };
    });
    e.target.value = null; 
  };
  
  const handleSend = async () => { /* ... existing (ensure messagesToProcess includes all user messages) ... */ 
    const hasPendingUserFiles = messages.some(msg => msg.from === 'user' && (msg.type === 'image' || msg.type === 'file_text'));
    if (!input.trim() && !hasPendingUserFiles && messages.every(m => m.from === 'bot')) return;

    const userInput = input.trim();
    // Collect all messages, including newly typed text if any
    let currentUIMessages = [...messages]; 
    if (userInput) {
        const userTextMessage = { id: Date.now() + "_text", from: "user", type: "text", content: userInput };
        setMessages(prev => [...prev, userTextMessage]); // Update UI immediately
        currentUIMessages = [...currentUIMessages, userTextMessage]; // Add to context for API
    }
    
    sendToGeminiAPI(currentUIMessages, userInput); 
    setInput(""); 
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  const handleKeyDown = (e) => { /* ... existing ... */ 
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const sendToGeminiAPI = async (messagesForContext, latestUserInputText) => { /* ... existing (ensure historyForAPI correctly processes new file_text from PDF/DOCX) ... */ 
    if (!geminiApiKey) { /* ... */ return; }
    setIsBotTyping(true);
    try {
        const historyForAPI = [];
        if (messagesForContext.length > 0) {
            let currentTurn = { role: messagesForContext[0].from === 'user' ? 'user' : 'model', parts: [] };
            if (messagesForContext[0].from === 'model') historyForAPI.push({ role: 'user', parts: [{ text: " " }] });
            historyForAPI.push(currentTurn);

            messagesForContext.forEach(msg => {
                const expectedRole = msg.from === 'user' ? 'user' : 'model';
                if (currentTurn.role !== expectedRole || historyForAPI[historyForAPI.length - 1].role !== expectedRole) {
                    if (currentTurn.parts.length === 0 && historyForAPI[historyForAPI.length -1] === currentTurn) historyForAPI.pop();
                    currentTurn = { role: expectedRole, parts: [] };
                    historyForAPI.push(currentTurn);
                }

                if (msg.type === 'text') {
                    currentTurn.parts.push({ text: msg.content });
                } else if (msg.type === 'image' && msg.from === 'user' && msg.content.base64Data) {
                    if (currentTurn.role === 'user') currentTurn.parts.push({ inlineData: { mimeType: msg.content.mimeType, data: msg.content.base64Data } });
                } else if (msg.type === 'file_text' && msg.from === 'user' && msg.content.textContent) { // Handles .txt, .pdf, .docx
                    if (currentTurn.role === 'user') currentTurn.parts.push({ text: `--- File: ${msg.content.name} (type: ${msg.content.originalType || 'txt'}) ---\n${msg.content.textContent}\n--- End of File ---` });
                }
            });
        }
        
        const validHistoryForAPI = historyForAPI
            .map(turn => ({ ...turn, parts: turn.parts.filter(part => (part.text && part.text.trim() !== "") || part.inlineData) }))
            .filter(turn => turn.parts.length > 0);
        
        const finalApiContents = [];
        let lastRole = null;
        for (const turn of validHistoryForAPI) {
            if (turn.role === lastRole && finalApiContents.length > 0) { 
                finalApiContents[finalApiContents.length - 1].parts.push(...turn.parts);
            } else {
                if (turn.role === 'model') {
                    turn.parts = turn.parts.filter(part => part.hasOwnProperty('text'));
                    if (turn.parts.length === 0) continue; 
                }
                finalApiContents.push(turn);
            }
            lastRole = turn.role;
        }
        
        if (finalApiContents.length > 0 && finalApiContents[finalApiContents.length -1].role === 'user') {
            const lastUserTurn = finalApiContents[finalApiContents.length -1];
            const hasTextPart = lastUserTurn.parts.some(part => part.text && part.text.trim() !== "");
            if (!hasTextPart && lastUserTurn.parts.some(part => part.inlineData)) { 
                lastUserTurn.parts.unshift({ text: "Attached image(s):" }); 
            }
        } else if (finalApiContents.length === 0 && !latestUserInputText && messagesForContext.some(m => m.from === 'user' && (m.type === 'image' || m.type === 'file_text'))) {
            const userParts = [];
            messagesForContext.forEach(msg => { 
                if (msg.from === 'user') { 
                    if (msg.type === 'image' && msg.content.base64Data) userParts.push({ inlineData: { mimeType: msg.content.mimeType, data: msg.content.base64Data } });
                    else if (msg.type === 'file_text' && msg.content.textContent) userParts.push({ text: `--- File: ${msg.content.name} (type: ${msg.content.originalType || 'txt'}) ---\n${msg.content.textContent}\n--- End of File ---` });
                }
            });
            if (userParts.length > 0) {
                 const hasTextInUserParts = userParts.some(p => p.text);
                 if (!hasTextInUserParts && userParts.some(p => p.inlineData)) userParts.unshift({ text: "Describe the image(s)." });
                 else if (!hasTextInUserParts) userParts.unshift({ text: "Regarding the attached file(s):" });
                 finalApiContents.push({role: 'user', parts: userParts });
            }
        }

        if (finalApiContents.length === 0 || (finalApiContents.length > 0 && finalApiContents[finalApiContents.length-1].parts.length === 0)) {
            showToast(" পাঠানোরানোর জন্য কোনো প্রক্রিয়াযোগ্য বিষয়বস্তু নেই।", "warning"); setIsBotTyping(false); return;
        }
        if (finalApiContents.length > 0 && finalApiContents[finalApiContents.length - 1].role !== 'user') {
             console.warn("API call might not be what you expect: last turn is not 'user'."); setIsBotTyping(false); return;
        }

        const payload = { contents: finalApiContents };
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`;
        const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });

        if (!response.ok) { 
            const errorData = await response.json(); console.error("Gemini API error:", errorData);
            showToast(`API সমস্যা: ${errorData?.error?.message || response.statusText}`, "error");
            setMessages(prev => [...prev, {id:Date.now(), from: "bot", type: "text", content: "দুঃখিত, উত্তর দিতে সমস্যা হচ্ছে।" }]);
        } else {
            const result = await response.json();
            if (result.promptFeedback && result.promptFeedback.blockReason) {
                showToast(`আপনার অনুরোধটি প্রক্রিয়া করা যায়নি। কারণ: ${result.promptFeedback.blockReason.replace(/_/g, " ").toLowerCase()}`, "warning", 5000);
                setMessages(prev => [...prev, {id:Date.now(), from: "bot", type: "text", content: "দুঃখিত, আপনার অনুরোধটি আমি প্রক্রিয়া করতে পারিনি।" }]);
            } else if (result.candidates && result.candidates[0]?.content?.parts[0]?.text) {
                setMessages(prev => [...prev, {id:Date.now(), from: "bot", type: "text", content: result.candidates[0].content.parts[0].text }]);
            } else {
                console.error("Unexpected API response structure:", result); showToast("অপ্রত্যাশিত API প্রতিক্রিয়া।", "error");
                setMessages(prev => [...prev, {id:Date.now(), from: "bot", type: "text", content: "একটি অপ্রত্যাশিত উত্তর পেয়েছি।" }]);
            }
        }
    } catch (error) { 
        console.error("Sending message error:", error); showToast("বার্তা পাঠাতে ত্রুটি হয়েছে।", "error");
        setMessages(prev => [...prev, {id:Date.now(), from: "bot", type: "text", content: "একটি নেটওয়ার্ক সমস্যা হয়েছে।" }]);
    } finally {
        setIsBotTyping(false);
    }
  };

  const selectSubject = (subject) => { /* ... existing ... */ 
    setSelectedSubject(subject); setMobileMenuOpen(false); 
    const subjectName = getSubjectName(subject);
    const userMessageText = `আমি ${subjectName} সম্পর্কে জানতে চাই।`;
    const userMessage = { id: Date.now() + "_sbj", type: "text", content: userMessageText, from: "user" };
    const messagesForApi = [...messages, userMessage];
    setMessages(messagesForApi); 
    sendToGeminiAPI(messagesForApi, userMessageText); 
  };
  const getSubjectName = (subject) => { /* ... existing ... */ 
    const names = { physics: "পদার্থবিজ্ঞান", chemistry: "রসায়ন", biology: "জীববিজ্ঞান", math: "গণিত"};
    return names[subject] || "";
  };

  if (loading) { /* ... existing loading screen ... */ 
    return (
      <div className="flex flex-col justify-center items-center p-4 h-screen pt-16 text-white bg-gradient-to-br from-[#1a2e4c] to-[#0f172a]">
        <div className="relative flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32">
          <div className="absolute w-full h-full border-4 border-teal-500 rounded-full animate-spin border-t-transparent"></div>
          <div className="absolute w-3/4 border-4 border-teal-400 rounded-full h-3/4 animate-spin border-t-transparent animation-delay-200"></div>
          <FaTrophyIcon className="w-8 h-8 text-teal-400 animate-pulse sm:w-10 sm:h-10 md:w-12 md:h-12" />
        </div>
        <p className="mt-6 text-base font-semibold tracking-wider animate-pulse sm:text-lg md:text-xl">জ্ঞান অর্জনের নতুন পথ...</p>
        <p className="mt-2 text-xs text-slate-400">অনুগ্রহ করে অপেক্ষা করুন।</p>
      </div>
    );
  }
  if (!loading && !geminiApiKey) { /* ... existing API key error screen ... */ 
    return (
        <div className="flex flex-col justify-center items-center p-4 h-screen text-white bg-gradient-to-br from-[#1a2e4c] to-[#0f172a]">
            <h1 className="text-2xl font-bold text-red-500 mb-4">Configuration Error</h1>
            <p className="text-center">Gemini API key configure করা হয়নি।<br/>অনুগ্রহ করে <code className="bg-red-700 px-1 rounded">REACT_APP_GEMINI_API_KEY</code> এনভায়রনমেন্ট ভেরিয়েবল সেট করুন<br/>এবং অ্যাপ্লিকেশনটি পুনরায় তৈরি করুন।</p>
        </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-[#1a2e4c] to-[#0f172a] pt-16 flex justify-center items-center">
        <div className="container flex flex-col h-[calc(100vh-4rem)] max-w-4xl w-full px-2 mx-auto sm:px-4 shadow-2xl rounded-lg overflow-hidden">
          {/* Header and Initial Subject Selection */}
          <div className="flex flex-col items-center justify-center py-4 text-center sm:py-6 md:py-8 shrink-0">
             <h1 className="mb-2 text-xl font-bold text-transparent sm:text-2xl md:text-3xl bg-gradient-to-r from-teal-400 via-white to-teal-400 bg-clip-text bg-size-200 animate-text-shimmer">জ্ঞান সহায়ক</h1>
            <div className="w-16 h-1 mb-3 rounded-full sm:w-20 md:w-24 bg-gradient-to-r from-teal-500 to-teal-300 sm:mb-4 md:mb-6"></div>
            {messages.length === 0 && ( 
              <>
                <p className="max-w-2xl mb-2 text-sm text-white/80 sm:mb-3 md:mb-4 sm:text-base">বিষয় নির্বাচন করুন বা প্রশ্ন লিখুন।</p>
                <div className="grid w-full grid-cols-2 gap-2 px-2 mt-2 md:grid-cols-4 sm:gap-3 md:gap-4 sm:mt-4 sm:px-4">
                  {["physics", "chemistry", "biology", "math"].map(subjectKey => (
                     <button key={subjectKey} onClick={() => selectSubject(subjectKey)}
                        className="flex flex-col items-center justify-center p-2 sm:p-3 md:p-4 bg-[#1e3a5f]/50 hover:bg-[#1e3a5f] rounded-xl transition-all duration-300 border border-[#2a4a7f]/30 hover:border-teal-500/50 hover:shadow-lg group">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-[#1e3a5f] rounded-full flex items-center justify-center mb-1 sm:mb-2 group-hover:bg-[#2a4a7f] transition-all">
                          {subjectKey === "physics" && <Microscope className="w-4 h-4 text-teal-400 sm:w-5 sm:h-5 md:w-6 md:h-6 group-hover:text-teal-300" />}
                          {subjectKey === "chemistry" && <Atom className="w-4 h-4 text-teal-400 sm:w-5 sm:h-5 md:w-6 md:h-6 group-hover:text-teal-300" />}
                          {subjectKey === "biology" && <Dna className="w-4 h-4 text-teal-400 sm:w-5 sm:h-5 md:w-6 md:h-6 group-hover:text-teal-300" />}
                          {subjectKey === "math" && <Calculator className="w-4 h-4 text-teal-400 sm:w-5 sm:h-5 md:w-6 md:h-6 group-hover:text-teal-300" />}
                        </div>
                        <span className="text-xs text-white sm:text-sm">{getSubjectName(subjectKey)}</span>
                      </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Messages Area */}
          <div className="flex overflow-y-auto flex-col flex-1 px-2 sm:px-4 py-2 sm:py-4 space-y-3 sm:space-y-4 w-full bg-[#1a2e4c]/30 backdrop-blur-sm rounded-t-xl custom-scrollbar">
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.from === "bot" ? "justify-start" : "justify-end"}`}>
                <div className={`flex items-start gap-1 sm:gap-2 max-w-[85%] sm:max-w-[80%] ${msg.from === "bot" ? "flex-row" : "flex-row-reverse"}`}>
                  <div className={`shrink-0 w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center ${msg.from === "bot" ? "bg-teal-600" : "bg-blue-600"}`}>
                    {msg.from === "bot" ? <Bot size={14} className="text-white sm:size-5" /> : <User size={14} className="text-white sm:size-5" />}
                  </div>
                  <div className={`p-2.5 sm:p-4 rounded-2xl shadow-md ${msg.from === "bot" ? "bg-gradient-to-r from-teal-700/90 to-teal-900/90 text-white border border-teal-600/30" : "bg-gradient-to-r from-blue-600/90 to-blue-800/90 text-white border border-blue-500/30"}`}>
                    {msg.type === "text" && <p className="text-xs leading-relaxed sm:text-sm whitespace-pre-wrap">{msg.content}</p>}
                    {msg.type === "image" && msg.uiPreview && (
                        <div className="flex flex-col items-center">
                            <img src={msg.uiPreview} alt={msg.content.name} className="max-w-full h-auto max-h-60 rounded-lg mb-1" />
                            <p className="text-xs text-white/80 italic truncate max-w-[200px]">{msg.content.name}</p>
                        </div>
                    )}
                    {msg.type === "file_text" && (
                        <div className="flex flex-col items-start">
                            <div className="flex items-center gap-1 text-xs sm:text-sm text-white/90 mb-1">
                                <FileText size={16} className="shrink-0"/> <span>{msg.content.name} {msg.content.originalType && `(${msg.content.originalType})`}</span>
                            </div>
                            <p className="text-xs leading-relaxed sm:text-sm whitespace-pre-wrap bg-black/20 p-2 rounded max-h-40 overflow-y-auto w-full">
                                {msg.content.textContent.substring(0, 500)}{msg.content.textContent.length > 500 ? "..." : ""}
                            </p>
                        </div>
                    )}
                     {msg.type === "file_other" && (
                        <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                            {processingFile === msg.content.name ? <Loader2 size={16} className="text-blue-400 animate-spin shrink-0" /> : <AlertTriangle size={16} className="text-yellow-400 shrink-0" />}
                            <span className="truncate max-w-[150px] sm:max-w-[200px]">{msg.content.name}</span>
                            <span className="text-white/70 text-[10px] sm:text-xs">{msg.content.error ? `(${msg.content.error})` : "(অসমর্থিত বা ত্রুটি)"}</span>
                        </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {isBotTyping && ( 
                <div className="flex justify-start">
                  <div className="flex items-start gap-1 sm:gap-2 max-w-[85%] sm:max-w-[80%]">
                    <div className="shrink-0 w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center bg-teal-600">
                       <Bot size={14} className="text-white sm:size-5" />
                    </div>
                    <div className="p-2.5 sm:p-4 rounded-2xl shadow-md backdrop-blur-sm bg-gradient-to-r from-teal-700/90 to-teal-900/90 text-white border border-teal-600/30">
                      <p className="text-xs leading-relaxed sm:text-sm italic">ভাবছি...</p>
                    </div>
                  </div>
                </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
            <div className="p-2 sm:p-4 bg-[#1a2e4c]/50 backdrop-blur-sm border-t border-white/5 rounded-b-xl mt-auto shrink-0">
            <div className="relative flex items-end w-full gap-1 sm:gap-2"> 
              <button type="button" onClick={() => fileInputRef.current.click()}
                disabled={!!processingFile} // Disable while a file is being processed
                className={`flex-shrink-0 p-2 sm:p-2.5 text-white rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-teal-400 shadow-md ${processingFile ? 'bg-gray-500 cursor-not-allowed' : 'bg-teal-600 hover:bg-teal-700 hover:shadow-teal-500/20'}`}
                title="ফাইল সংযুক্ত করুন">
                {processingFile ? <Loader2 size={16} className="animate-spin sm:size-5" /> : <Paperclip size={16} className="sm:size-5" />}
              </button>
              <input type="file" ref={fileInputRef} multiple className="hidden" onChange={handleFileChange}
                accept="image/png,image/jpeg,image/webp,text/plain,application/pdf,.docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document" 
              />
              <button type="button" onClick={toggleRecording}
                disabled={!!processingFile}
                className={`flex-shrink-0 p-2 sm:p-2.5 text-white rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-teal-400 shadow-md ${
                  isRecording ? "bg-red-600 hover:bg-red-700 animate-pulse" : (processingFile ? 'bg-gray-500 cursor-not-allowed' : 'bg-teal-600 hover:bg-teal-700 hover:shadow-teal-500/20')}`}
                title={isRecording ? "রেকর্ডিং বন্ধ করুন" : "ভয়েস ইনপুট শুরু করুন"}>
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
                  disabled={!!processingFile}
                  className="px-3 sm:px-5 py-2.5 sm:py-3 w-full rounded-2xl border border-teal-500/20 bg-[#1a2e4c]/70 text-white placeholder-white/50 resize-none focus:outline-none focus:ring-2 focus:ring-teal-400/50 shadow-inner shadow-black/20 text-xs sm:text-sm leading-tight disabled:bg-gray-700 disabled:cursor-not-allowed scrollbar-hide"
                  style={{ 
                    minHeight: "44px", 
                    maxHeight: "120px", 
                    overflowY: "auto",
                    msOverflowStyle: "none",  /* IE and Edge */
                    scrollbarWidth: "none"  /* Firefox */
                  }}
                />
              </div>
              <button type="button" onClick={handleSend} 
                disabled={(!input.trim() && !messages.some(m=> m.from === 'user' && (m.type === 'image' || m.type === 'file_text'))) || isBotTyping || !!processingFile}
                className={`p-2 sm:p-2.5 text-white rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-teal-400 shadow-md ${
                  ((input.trim() || messages.some(m=>m.from === 'user' && (m.type === 'image' || m.type === 'file_text'))) && !isBotTyping && !processingFile) ? "bg-teal-600 hover:bg-teal-700 hover:shadow-teal-500/20" : "bg-teal-600/50 cursor-not-allowed"}`}
                title="বার্তা পাঠান">
                <SendHorizonal size={16} className="sm:size-5" />
              </button>
            </div>
          </div>
          {mobileMenuOpen && ( 
             <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 backdrop-blur-sm md:hidden">
              <div className="bg-[#1a2e4c]/90 p-6 rounded-xl w-[90%] max-w-sm border border-teal-500/30">
                <h3 className="mb-4 text-lg font-medium text-center text-white">বিষয় নির্বাচন করুন</h3>
                <div className="grid grid-cols-2 gap-3">
                  {["physics", "chemistry", "biology", "math"].map((subjectKey) => (
                    <button key={subjectKey} onClick={() => selectSubject(subjectKey)}
                      className="flex flex-col items-center justify-center p-3 bg-[#1e3a5f]/50 hover:bg-[#1e3a5f] rounded-xl transition-all duration-300 border border-[#2a4a7f]/30">
                      <div className="w-10 h-10 bg-[#1e3a5f] rounded-full flex items-center justify-center mb-2">
                        {subjectKey === "physics" && <Microscope className="w-5 h-5 text-teal-400" />}
                        {subjectKey === "chemistry" && <Atom className="w-5 h-5 text-teal-400" />}
                        {subjectKey === "biology" && <Dna className="w-5 h-5 text-teal-400" />}
                        {subjectKey === "math" && <Calculator className="w-5 h-5 text-teal-400" />}
                      </div>
                      <span className="text-xs text-white">{getSubjectName(subjectKey)}</span>
                    </button>
                  ))}
                </div>
                <button onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2 mt-4 text-white transition-colors bg-teal-600 rounded-lg hover:bg-teal-700">বন্ধ করুন</button>
              </div>
            </div>
          )}
          {isRecording && ( 
            <div className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm" onClick={toggleRecording}>
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-500 rounded-full flex items-center justify-center animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.7)]">
                    <Mic size={30} className="text-white sm:size-10" />
                </div>
                <p className="mt-4 text-sm font-medium text-white sm:text-base">রেকর্ডিং চলছে... থামাতে ট্যাপ করুন।</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ChatBot;
