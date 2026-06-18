const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const Activity = require('../models/UserActivity'); 

// 1. SAFE PRE-INITIALIZE: Prevent server crash if API key is missing
let genAI = null;
let model = null;

try {
  if (process.env.GEMINI_API_KEY) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  } else {
    console.warn("[Chat Route] WARNING: GEMINI_API_KEY is not defined in the environment. Running in local fallback mode.");
  }
} catch (initError) {
  console.error("[Chat Route] Gemini SDK Initialization failed:", initError.message);
}

// 2. INTERACTIVE FALLBACK RESPONDER
function getInteractiveFallbackResponse(message, language) {
  const msg = (message || '').toLowerCase().trim();
  const lang = language || 'English';

  // --- HINDI ---
  if (lang === 'Hindi') {
    if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey') || msg.includes('नमस्ते') || msg.includes('हलो')) {
      return "नमस्ते! मैं आपका एआई मानसिक स्वास्थ्य साथी हूँ। आज आप कैसा महसूस कर रहे हैं?";
    }
    if (msg.includes('anxious') || msg.includes('anxiety') || msg.includes('तनाव') || msg.includes('घबराहट') || msg.includes('stress') || msg.includes('चिंता')) {
      return "मुझे खेद है कि आप तनाव महसूस कर रहे हैं। आइए एक आसान व्यायाम करें: 4 सेकंड के लिए गहरी सांस लें, 4 सेकंड के लिए रोकें, फिर 4 सेकंड में छोड़ें। क्या आप इसे मेरे साथ आजमाना चाहेंगे?";
    }
    if (msg.includes('sad') || msg.includes('उदासी') || msg.includes('अकेला') || msg.includes('lonely') || msg.includes('depressed') || msg.includes('दुखी')) {
      return "आप अकेले नहीं हैं। उदास महसूस करना स्वाभाविक है, लेकिन याद रखें कि यह समय भी बीत जाएगा। अगर आप साझा करना चाहते हैं, तो मैं सुनने के लिए तैयार हूँ।";
    }
    if (msg.includes('counselor') || msg.includes('doctor') || msg.includes('expert') || msg.includes('अपॉइंटमेंट') || msg.includes('डॉक्टर') || msg.includes('बात')) {
      return "यदि आपको पेशेवर मार्गदर्शन की आवश्यकता है, तो आप 'Booking' पेज पर जाकर हमारे कैंपस काउंसलर्स के साथ एक गोपनीय सत्र बुक कर सकते हैं। वे यहाँ आपकी मदद के लिए उपलब्ध हैं।";
    }
    if (msg.includes('sleep') || msg.includes('नींद') || msg.includes('tired') || msg.includes('थकान')) {
      return "स्वस्थ दिमाग के लिए अच्छी नींद बहुत आवश्यक है। सोने से आधे घंटे पहले मोबाइल स्क्रीन बंद करने और कुछ गहरी साँसें लेने का प्रयास करें। क्या मैं आपकी कुछ और मदद कर सकता हूँ?";
    }
    if (msg.includes('धन्यवाद') || msg.includes('शुक्रिया') || msg.includes('thank')) {
      return "आपका बहुत-बहुत स्वागत है! अपना ख्याल रखें।";
    }
    return "मैं आपकी बात ध्यान से सुन रहा हूँ। हमारा मुख्य नेटवर्क इस समय व्यस्त है, लेकिन मैं आपके सहयोग के लिए यहाँ हूँ। कृपया अपनी बात साझा करें।";
  }

  // --- TAMIL ---
  if (lang === 'Tamil') {
    if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey') || msg.includes('வணக்கம்')) {
      return "வணக்கம்! நான் உங்கள் மனநல ஆலோசகர். இன்று நீங்கள் எப்படி உணர்கிறீர்கள்?";
    }
    if (msg.includes('anxious') || msg.includes('anxiety') || msg.includes('பயம்') || msg.includes('மன அழுத்தம்') || msg.includes('stress')) {
      return "நீங்கள் மன அழுத்தமாக இருப்பதை என்னால் புரிந்து கொள்ள முடிகிறது. ஒரு நிமிடம் மெதுவாக மூச்சை உள்ளிழுத்து மெதுவாக வெளிவிடவும். இது உங்கள் மனதை அமைதிப்படுத்தும்.";
    }
    if (msg.includes('sad') || msg.includes('துக்கம்') || msg.includes('அकेலா') || msg.includes('lonely')) {
      return "கவலைப்படாதீர்கள், நீங்கள் தனிமையில் இல்லை. இந்த கடினமான சூழ்நிலை விரைவில் கடந்து போகும். உங்கள் மனதில் உள்ளதை என்னிடம் பகிர்ந்து கொள்ளலாம்.";
    }
    if (msg.includes('counselor') || msg.includes('doctor') || msg.includes('expert') || msg.includes('மருத்துவர்')) {
      return "கூடுதல் உதவிக்கு, எங்கள் 'Booking' பக்கத்தில் உள்ள நிபுணர்களுடன் நீங்கள் ஒரு சந்திப்பை முன்பதிவு செய்யலாம்.";
    }
    return "நான் உங்கள் பேச்சைக் கவனித்துக் கொண்டிருக்கிறேன். எனது பிரதான சர்வர் தற்போது பிஸியாக உள்ளது, ஆனால் உங்களுக்கு உதவ நான் தயாராக உள்ளேன். தயவுசெய்து உங்கள் எண்ணங்களைப் பகிர்ந்து கொள்ளுங்கள்.";
  }

  // --- TELUGU ---
  if (lang === 'Telugu') {
    if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey') || msg.includes('నమస్కారం')) {
      return "నమస్కారం! నేను మీ మానసిక ఆరోగ్య సహాయకుడిని. ఈ రోజు మీరు ఎలా ఉన్నారు?";
    }
    if (msg.includes('anxious') || msg.includes('anxiety') || msg.includes('ఆందోళన') || msg.includes('stress')) {
      return "మీరు ఆందోళనగా ఉన్నారని నాకు అర్థమవుతోంది. దయచేసి కాసేపు ప్రశాంతంగా శ్వాస తీసుకోండి: 4 సెకన్లు శ్వాస పీల్చండి, 4 సెకన్లు ఆపండి, 4 సెకన్లు వదిలేయండి. ఇది మీకు ఉపశమనం కలిగిస్తుంది.";
    }
    if (msg.includes('sad') || msg.includes('బాధ') || msg.includes('lonely')) {
      return "మీరు ఒంటరిగా లేరు. ఈ కష్టం కూడా గడిచిపోతుంది. మీరు మీ భావాలను నాతో పంచుకోవచ్చు.";
    }
    if (msg.includes('counselor') || msg.includes('doctor') || msg.includes('expert') || msg.includes('వైద్యుడు')) {
      return "మరింత సహాయం కొరకు, 'Booking' విభాగంలో మా నిపుణులను సంప్రదించవచ్చు.";
    }
    return "నేను మీ మాటలను శ్రద్ధగా వింటున్నాను. నా ప్రధాన సర్వర్ ప్రస్తుతం కొంచెం బిజీగా ఉంది, కానీ నేను మీతోనే ఉన్నాను. దయచేసి మీ మనసులోని భావాలను నాతో పంచుకోండి.";
  }

  // --- ENGLISH (DEFAULT) ---
  if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey') || msg.includes('greetings')) {
    return "Hello! I am your AI support companion. I am here to listen and support you in any way I can. How are you feeling today?";
  }
  if (msg.includes('anxious') || msg.includes('anxiety') || msg.includes('worry') || msg.includes('stressed') || msg.includes('stress') || msg.includes('nervous')) {
    return "I hear you, and it's completely okay to feel anxious. Let's try a simple box breathing exercise: Breathe in for 4 seconds, hold for 4 seconds, exhale for 4 seconds, and pause for 4 seconds. Would you like to try it together?";
  }
  if (msg.includes('sad') || msg.includes('depressed') || msg.includes('lonely') || msg.includes('cry') || msg.includes('down')) {
    return "I'm really sorry you're feeling down. Please remember that you are valued and you don't have to carry this alone. Talking about it can help—would you like to tell me more about what's causing this feeling?";
  }
  if (msg.includes('counselor') || msg.includes('doctor') || msg.includes('expert') || msg.includes('talk') || msg.includes('appointment') || msg.includes('session')) {
    return "If you feel you need deeper, professional support, you can easily book a private, confidential session with one of our campus counselors in the 'Booking' tab. They are trained to help you navigate these feelings.";
  }
  if (msg.includes('sleep') || msg.includes('tired') || msg.includes('insomnia') || msg.includes('nightmare')) {
    return "Sleep is so important for emotional recovery. To help you wind down, try turning off screens 30 minutes before sleep, doing a gentle stretch, or focusing on five slow breaths. I'm here if you want to chat until you feel sleepy.";
  }
  if (msg.includes('thank') || msg.includes('thanks') || msg.includes('appreciate')) {
    return "You are very welcome! I'm glad I can be here for you. Remember, taking care of your mind is a daily journey, and you're doing great.";
  }

  const fallbackTemplates = [
    "Thank you for sharing that. It sounds like you are going through a lot right now. I'm here to listen—please tell me more if you feel comfortable.",
    "I'm listening closely. Please feel free to let it all out. What else is on your mind?",
    "I hear you, and I appreciate your openness. How does this feeling affect your day-to-day right now?",
    "That makes total sense. Emotions can be complex, but sharing them is a strong first step. I'm right here with you."
  ];

  const randomIndex = Math.floor(Math.random() * fallbackTemplates.length);
  return fallbackTemplates[randomIndex] + " (Note: Running in high-speed local backup mode)";
}

// --- GET CHAT HISTORY ---
router.get('/history/:userId', async (req, res) => {
  try {
    const history = await Activity.find({ userId: req.params.userId, type: 'chat' })
      .sort({ timestamp: 1 })
      .lean();
    res.json(history);
  } catch (err) {
    res.status(500).json({ message: "Could not fetch history" });
  }
});

// --- POST MESSAGE (Optimized for Speed & Security) ---
router.post('/', async (req, res) => {
  const { message, language, userId } = req.body;

  try {
    // 2. INPUT VALIDATION
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: "No valid message provided" });
    }

    // 3. IMPROVED CRISIS CHECK
    const crisisRegex = /\b(suicide|kill myself|end my life|harm myself|self harm)\b/i;
    if (crisisRegex.test(message)) {
      return res.json({ 
        reply: "I'm concerned about what you're sharing. You're not alone. Please reach out to a professional or a crisis hotline immediately.", 
        crisisDetected: true 
      });
    }

    // 4. GENERATION
    let replyText = "";
    if (model) {
      const prompt = `System: You are an empathetic mental health assistant. Respond in ${language || 'English'}. Keep responses concise for speed. \nUser: ${message}`;
      const result = await model.generateContent(prompt);
      replyText = result.response.text(); 
    } else {
      // Use fallback directly if Gemini is not initialized
      replyText = getInteractiveFallbackResponse(message, language);
    }

    // 5. IMMEDIATE RESPONSE: Send to user ASAP
    res.json({ reply: replyText, crisisDetected: false });

    // 6. BACKGROUND SAVE (Non-blocking)
    if (userId && userId.length > 5 && userId !== "null" && userId !== "undefined") {
      const chatLogs = [
        { userId, type: 'chat', content: message, isBot: false, timestamp: new Date() },
        { userId, type: 'chat', content: replyText, isBot: true, timestamp: new Date() }
      ];
      Activity.insertMany(chatLogs).catch(err => console.error("Async History Save Error:", err));
    }

  } catch (error) {
    console.error("CRITICAL AI ROUTE ERROR (using dynamic fallback):", error.message);
    
    // Fall back to our smart local interactive rules engine
    const fallbackReply = getInteractiveFallbackResponse(message, language);

    if (!res.headersSent) {
      res.json({ reply: fallbackReply, crisisDetected: false, isFallback: true });
    }

    // Still perform background logging for history tracking
    if (userId && userId.length > 5 && userId !== "null" && userId !== "undefined") {
      const chatLogs = [
        { userId, type: 'chat', content: message, isBot: false, timestamp: new Date() },
        { userId, type: 'chat', content: fallbackReply, isBot: true, timestamp: new Date() }
      ];
      Activity.insertMany(chatLogs).catch(err => console.error("Async History Save Error during fallback:", err));
    }
  }
});

module.exports = router;