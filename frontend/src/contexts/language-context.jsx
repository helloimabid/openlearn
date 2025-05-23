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
    "hero.title": "Learn English with AI",
    "hero.subtitle":
      "Master English through interactive conversations and personalized feedback",
    "hero.cta": "Get Started",
    "hero.scrollToExplore": "Scroll to explore",
    "hero.learnScience": "Learn Science in Bangla",
    "hero.practiceEnglish": "Practice English",

    // Features section
    "features.title": "Our Features",
    "features.subtitle": "Powerful tools to enhance your learning experience",
    "features.description":
      "Your complete learning platform to understand Physics, Chemistry, Biology, and Math concepts in Bangla, plus improve your English language skills through interactive conversations.",
    "features.conversationPractice.title": "English Conversation Practice",
    "features.conversationPractice.description":
      "Practice English conversations with our AI assistant and receive instant feedback on your pronunciation and grammar.",
    "features.conversationPractice.cta": "Practice English",
    "features.scienceTopics.title": "Science Topics in Bengali",
    "features.scienceTopics.description":
      "Learn complex science concepts explained in Bengali through interactive conversations with our AI assistant.",
    "features.scienceTopics.physics": "Physics",
    "features.scienceTopics.chemistry": "Chemistry",
    "features.scienceTopics.biology": "Biology",
    "features.scienceTopics.math": "Math",
    "features.scienceTopics.cta": "Learn Science in Bangla",

    // How it works section
    "howItWorks.title": "How It Works",
    "howItWorks.subtitle": "Simple steps to start your learning journey",
    "howItWorks.description":
      "Follow these steps to get started with OpenLearn.",
    "howItWorks.bengaliSectionTitle": "Learn Science in Bangla",
    "howItWorks.englishSectionTitle": "Practice English Conversations",
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
    "benefits.title": "Benefits",
    "benefits.subtitle": "Why Choose OpenLearn?",
    "benefits.description":
      "OpenLearn offers a unique blend of science education in Bangla and English language practice with AI.",
    "benefits.benefit1.title": "Science in Bangla",
    "benefits.benefit1.description":
      "Understand complex science concepts in your native language.",
    "benefits.benefit2.title": "AI English Practice",
    "benefits.benefit2.description":
      "Practice English conversations with instant AI feedback.",
    "benefits.benefit3.title": "Personalized Learning",
    "benefits.benefit3.description":
      "Get a learning experience tailored to your needs.",

    // Navigation
    "nav.home": "Home",
    "nav.features": "Features",
    "nav.howItWorks": "How It Works",
    "nav.login": "Login",
    "nav.signup": "Sign Up",
    "nav.switchToBangla": "বাংলা",
    "nav.benefits": "Benefits",

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
    "hero.title": "এআই এর সাহায্যে ইংরেজি শিখুন",
    "hero.subtitle":
      "ইন্টারেক্টিভ কথোপকথন এবং ব্যক্তিগতকৃত প্রতিক্রিয়ার মাধ্যমে ইংরেজি আয়ত্ত করুন",
    "hero.cta": "শুরু করুন",
    "hero.scrollToExplore": "অন্বেষণ করতে স্ক্রোল করুন",
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
