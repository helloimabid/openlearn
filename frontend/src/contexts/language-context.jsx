import { createContext, useContext, useState, useEffect } from "react";

// Create the language context
const LanguageContext = createContext({
  language: "en",
  setLanguage: () => {},
  t: (key) => key, // translation function
});

// Translation data
const translations = {
  en: {
    // Hero section
    "hero.title": "OpenLearn: Science in Bangla & English Practice",
    "hero.subtitle":
      "Master science subjects in Bangla and improve your English through interactive learning!",
    "hero.cta": "Get Started",
    "hero.scrollToExplore": "Scroll to explore",
    "hero.learnScience": "Explore Science in Bangla",
    "hero.practiceEnglish": "Practice English Conversations",

    // Features section
    "features.title": "Dual Learning Platform",
    "features.subtitle": "Master both science and English in one place",
    "features.description":
      "OpenLearn offers a unique combination of science education in Bangla and English language practice. Learn Physics, Chemistry, Biology, and Math in your native language while improving your English skills.",
    "features.conversationPractice.title": "AI-Powered English Practice",
    "features.conversationPractice.description":
      "Enhance your English speaking and comprehension skills with our AI conversation partner. Get real-time feedback on your pronunciation and grammar.",
    "features.conversationPractice.cta": "Start Practicing English",
    "features.scienceTopics.title": "Science Education in Bangla",
    "features.scienceTopics.description":
      "Master complex science concepts in Bangla with our interactive AI tutor. Perfect for students who want to learn in their native language.",
    "features.scienceTopics.physics": "Physics",
    "features.scienceTopics.chemistry": "Chemistry",
    "features.scienceTopics.biology": "Biology",
    "features.scienceTopics.math": "Math",
    "features.scienceTopics.cta": "Learn Science in Bangla",

    // How it works section
    "howItWorks.title": "Start Learning Today",
    "howItWorks.subtitle": "Simple steps to master science and English",
    "howItWorks.description":
      "Begin your journey with OpenLearn in just a few easy steps.",
    "howItWorks.bengaliSectionTitle": "Science Learning in Bangla",
    "howItWorks.englishSectionTitle": "English Language Practice",
    "howItWorks.step1.title": "Create an Account",
    "howItWorks.step1.description":
      "Sign up for free and set up your profile with your learning preferences.",
    "howItWorks.step2.title": "Choose Your Topic",
    "howItWorks.step2.description":
      "Select from a variety of English conversation topics or science subjects.",
    "howItWorks.step3.title": "Start Learning",
    "howItWorks.step3.description":
      "Engage in interactive conversations and receive personalized feedback.",
    "howItWorks.englishStep1.title": "Create an Account",
    "howItWorks.englishStep1.description":
      "Sign up and set up your profile to practice English conversations.",
    "howItWorks.englishStep2.title": "Pick a Topic",
    "howItWorks.englishStep2.description":
      "Choose from a range of English conversation topics.",
    "howItWorks.englishStep3.title": "Start Practicing",
    "howItWorks.englishStep3.description":
      "Practice English with AI and get instant feedback.",

    // Benefits section
    "benefits.title": "Why OpenLearn?",
    "benefits.subtitle": "The Best of Both Worlds",
    "benefits.description":
      "OpenLearn combines quality science education in Bangla with effective English language practice, all in one platform.",
    "benefits.benefit1.title": "Native Language Learning",
    "benefits.benefit1.description":
      "Master complex science concepts in Bangla for better understanding and retention.",
    "benefits.benefit2.title": "English Language Development",
    "benefits.benefit2.description":
      "Improve your English through interactive conversations with our AI tutor.",
    "benefits.benefit3.title": "Personalized Education",
    "benefits.benefit3.description":
      "Experience learning tailored to your pace and style, whether in Bangla or English.",

    // Navigation
    "nav.home": "Home",
    "nav.features": "Features",
    "nav.howItWorks": "How It Works",
    "nav.login": "Login",
    "nav.signup": "Sign Up",
    "nav.switchToBangla": "বাংলা",
    "nav.benefits": "Benefits",
    "nav.dashboard": "Dashboard",
    // CTA section
    "cta.title": "Ready to Start Learning?",
    "cta.subtitle":
      "Join thousands of students improving their English and science knowledge",
    "cta.button": "Get Started Now",
    "cta.getStarted": "Get Started Now",
    "cta.learnMore": "Learn More",

    // Footer
    "footer.description":
      "OpenLearn is your platform for learning science in Bangla and practicing English with AI.",
    "footer.navigation.title": "Navigation",
    "footer.navigation.home": "Home",
    "footer.navigation.features": "Features",
    "footer.navigation.howItWorks": "How It Works",
    "footer.navigation.benefits": "Benefits",
    "footer.contact.title": "Contact",
    "footer.contact.email": "Email: info@openlearn.com",
    "footer.contact.phone": "Phone: +880 1234 567890",
    "footer.contact.address": "Dhaka, Bangladesh",
    "footer.language.title": "Language",
    "footer.language.switchToBengali": "Switch to Bengali",
    "footer.language.switchToEnglish": "Switch to English",
    "footer.copyright": "OpenLearn. All rights reserved.",

    // Lab Notice
    "labNotice.title": "Try Our Virtual Science Lab!",
    "labNotice.description":
      "Experience interactive science experiments online.",
    "labNotice.cta": "Visit Lab",
  },
  bn: {
    // Hero section
    "hero.title": "OpenLearn: বাংলা ও ইংরেজিতে বিজ্ঞান অনুশীলন",
    "hero.subtitle":
      "বাংলায় বিজ্ঞান বিষয়গুলো আয়ত্ত করুন এবং ইন্টারঅ্যাকটিভ শিক্ষার মাধ্যমে আপনার ইংরেজি দক্ষতা বাড়ান!",
    "hero.cta": "শুরু করুন",
    "hero.scrollToExplore": "অনুসন্ধানের জন্য নিচে নামুন",
    "hero.learnScience": "বাংলায় বিজ্ঞান শিখুন",
    "hero.practiceEnglish": "ইংরেজি অনুশীলন করুন",

    // Features section
    "features.title": "আমাদের বৈশিষ্ট্য",
    "features.subtitle": "আপনার শিক্ষার অভিজ্ঞতা বাড়ানোর জন্য শক্তিশালী টুল",
    "features.description":
      "আপনার সম্পূর্ণ শিক্ষার প্ল্যাটফর্ম, যেখানে আপনি বাংলায় পদার্থবিজ্ঞান, রসায়ন, জীববিজ্ঞান ও গণিত শিখতে পারবেন এবং ইংরেজি ভাষার দক্ষতা বাড়াতে পারবেন ইন্টারেক্টিভ কথোপকথনের মাধ্যমে।",
    "features.conversationPractice.title": "ইংরেজি কথোপকথন অনুশীলন",
    "features.conversationPractice.description":
      "আমাদের এআই সহকারীর সাথে ইংরেজি কথোপকথন অনুশীলন করুন এবং আপনার উচ্চারণ ও ব্যাকরণে তাৎক্ষণিক প্রতিক্রিয়া পান।",
    "features.conversationPractice.cta": "ইংরেজি অনুশীলন করুন",
    "features.scienceTopics.title": "বাংলায় বিজ্ঞান বিষয়",
    "features.scienceTopics.description":
      "আমাদের এআই সহকারীর সাথে ইন্টারেক্টিভ কথোপকথনের মাধ্যমে বাংলায় ব্যাখ্যা করা জটিল বিজ্ঞান ধারণাগুলি শিখুন।",
    "features.scienceTopics.physics": "পদার্থবিজ্ঞান",
    "features.scienceTopics.chemistry": "রসায়ন",
    "features.scienceTopics.biology": "জীববিজ্ঞান",
    "features.scienceTopics.math": "গণিত",
    "features.scienceTopics.cta": "বাংলায় বিজ্ঞান শিখুন",

    // How it works section
    "howItWorks.title": "এটি কীভাবে কাজ করে",
    "howItWorks.subtitle": "আপনার শিক্ষার যাত্রা শুরু করার সহজ পদক্ষেপ",
    "howItWorks.description": "শুরু করতে নিচের ধাপগুলো অনুসরণ করুন।",
    "howItWorks.bengaliSectionTitle": "বাংলায় বিজ্ঞান শিখুন",
    "howItWorks.englishSectionTitle": "ইংরেজি কথোপকথন অনুশীলন",
    "howItWorks.step1.title": "একটি অ্যাকাউন্ট তৈরি করুন",
    "howItWorks.step1.description":
      "বিনামূল্যে সাইন আপ করুন এবং আপনার শিক্ষার পছন্দগুলি সহ আপনার প্রোফাইল সেট আপ করুন।",
    "howItWorks.step2.title": "আপনার বিষয় চয়ন করুন",
    "howItWorks.step2.description":
      "বিভিন্ন ইংরেজি কথোপকথনের বিষয় বা বিজ্ঞান বিষয়গুলি থেকে নির্বাচন করুন।",
    "howItWorks.step3.title": "শিক্ষা শুরু করুন",
    "howItWorks.step3.description":
      "ইন্টারেক্টিভ কথোপকথনে অংশগ্রহণ করুন এবং ব্যক্তিগতকৃত প্রতিক্রিয়া পান।",
    "howItWorks.englishStep1.title": "একটি অ্যাকাউন্ট তৈরি করুন",
    "howItWorks.englishStep1.description":
      "ইংরেজি কথোপকথন অনুশীলনের জন্য সাইন আপ করুন এবং প্রোফাইল সেট করুন।",
    "howItWorks.englishStep2.title": "বিষয় নির্বাচন করুন",
    "howItWorks.englishStep2.description":
      "বিভিন্ন ইংরেজি কথোপকথনের বিষয় থেকে নির্বাচন করুন।",
    "howItWorks.englishStep3.title": "অনুশীলন শুরু করুন",
    "howItWorks.englishStep3.description":
      "এআই এর সাথে ইংরেজি অনুশীলন করুন এবং তাৎক্ষণিক প্রতিক্রিয়া পান।",

    // Benefits section
    "benefits.title": "সুবিধাসমূহ",
    "benefits.subtitle": "কেন OpenLearn বেছে নেবেন?",
    "benefits.description":
      "OpenLearn আপনাকে বাংলায় বিজ্ঞান শিক্ষা এবং এআই এর মাধ্যমে ইংরেজি অনুশীলনের অনন্য সুযোগ দেয়।",
    "benefits.benefit1.title": "বাংলায় বিজ্ঞান",
    "benefits.benefit1.description":
      "নিজের ভাষায় জটিল বিজ্ঞান ধারণা সহজে বুঝুন।",
    "benefits.benefit2.title": "এআই ইংরেজি অনুশীলন",
    "benefits.benefit2.description":
      "এআই সহকারীর সাথে ইংরেজি কথোপকথন অনুশীলন করুন এবং তাৎক্ষণিক প্রতিক্রিয়া পান।",
    "benefits.benefit3.title": "ব্যক্তিগতকৃত শিক্ষা",
    "benefits.benefit3.description":
      "আপনার চাহিদা অনুযায়ী কাস্টমাইজড শেখার অভিজ্ঞতা পান।",

    // Navigation
    "nav.home": "হোম",
    "nav.features": "বৈশিষ্ট্য",
    "nav.howItWorks": "এটি কীভাবে কাজ করে",
    "nav.login": "লগইন",
    "nav.signup": "সাইন আপ",
    "nav.switchToEnglish": "English",
    "nav.benefits": "সুবিধাসমূহ",
    "nav.dashboard": "ড্যাশবোর্ড",
    // CTA section
    "cta.title": "শিখতে শুরু করতে প্রস্তুত?",
    "cta.subtitle":
      "হাজার হাজার শিক্ষার্থীদের সাথে যোগ দিন যারা তাদের ইংরেজি এবং বিজ্ঞান জ্ঞান উন্নত করছে",
    "cta.button": "এখনই শুরু করুন",
    "cta.getStarted": "এখনই শুরু করুন",
    "cta.learnMore": "আরও জানুন",

    // Footer
    "footer.description":
      "OpenLearn হলো বাংলায় বিজ্ঞান শেখা এবং এআই এর মাধ্যমে ইংরেজি অনুশীলনের প্ল্যাটফর্ম।",
    "footer.navigation.title": "নেভিগেশন",
    "footer.navigation.home": "হোম",
    "footer.navigation.features": "বৈশিষ্ট্য",
    "footer.navigation.howItWorks": "কীভাবে কাজ করে",
    "footer.navigation.benefits": "সুবিধাসমূহ",
    "footer.contact.title": "যোগাযোগ",
    "footer.contact.email": "ইমেইল: info@openlearn.com",
    "footer.contact.phone": "ফোন: +৮৮০ ১২৩৪ ৫৬৭৮৯০",
    "footer.contact.address": "ঢাকা, বাংলাদেশ",
    "footer.language.title": "ভাষা",
    "footer.language.switchToBengali": "বাংলায় পরিবর্তন করুন",
    "footer.language.switchToEnglish": "Switch to English",
    "footer.copyright": "OpenLearn. সর্বস্বত্ব সংরক্ষিত।",

    // Lab Notice
    "labNotice.title": "আমাদের ভার্চুয়াল সায়েন্স ল্যাব ব্যবহার করুন!",
    "labNotice.description":
      "অনলাইনে ইন্টারেক্টিভ সায়েন্স এক্সপেরিমেন্টের অভিজ্ঞতা নিন।",
    "labNotice.cta": "ল্যাবে যান",
  },
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    // Try to get the language from localStorage
    const savedLanguage = localStorage.getItem("language");
    return savedLanguage || "en";
  });

  // Update localStorage when language changes
  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  // Translation function
  const t = (key) => {
    if (!translations[language]) {
      return key;
    }

    return translations[language][key] || translations["en"][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
