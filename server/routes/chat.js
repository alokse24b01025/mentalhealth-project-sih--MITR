const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const Activity = require('../models/UserActivity'); 

// 1. PRE-INITIALIZE: Initializing once outside the request cycle
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ 
  model: "gemini-2.0-flash",
  // Optional: Set safety settings here to speed up generation by pre-filtering
});

// --- GET CHAT HISTORY ---
router.get('/history/:userId', async (req, res) => {
  try {
    const history = await Activity.find({ userId: req.params.userId, type: 'chat' })
      .sort({ timestamp: 1 })
      .lean(); // .lean() makes the query faster by returning plain JS objects
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

    // 3. IMPROVED CRISIS CHECK (Regex is faster/more accurate for word boundaries)
    const crisisRegex = /\b(suicide|kill myself|end my life|harm myself|self harm)\b/i;
    if (crisisRegex.test(message)) {
      return res.json({ 
        reply: "I'm concerned about what you're sharing. You're not alone. Please reach out to a professional or a crisis hotline immediately.", 
        crisisDetected: true 
      });
    }

    // 4. GENERATION
    const prompt = `System: You are an empathetic mental health assistant. Respond in ${language || 'English'}. Keep responses concise for speed. \nUser: ${message}`;
    
    const result = await model.generateContent(prompt);
    const text = result.response.text(); 

    // 5. IMMEDIATE RESPONSE: Send to user ASAP
    res.json({ reply: text, crisisDetected: false });

    // 6. BACKGROUND SAVE (Non-blocking)
    // Only attempt save if userId is a valid-looking MongoDB ID string
    if (userId && userId.length > 5 && userId !== "null" && userId !== "undefined") {
      const chatLogs = [
        { userId, type: 'chat', content: message, isBot: false, timestamp: new Date() },
        { userId, type: 'chat', content: text, isBot: true, timestamp: new Date() }
      ];
      
      // We don't await this, so it happens after the user gets their reply
      Activity.insertMany(chatLogs).catch(err => console.error("Async History Save Error:", err));
    }

  } catch (error) {
    console.error("CRITICAL AI ROUTE ERROR (using dynamic fallback):", error.message);
    
    const fallbackReplies = {
      English: "I hear you, and I am listening closely. My high-speed neural connection is temporarily experiencing heavy load, but I am still here to support you. What is on your mind? Please share, and remember you can also connect with our campus counselors in the Experts tab if you need immediate guidance.",
      Hindi: "मैं आपकी बात सुन रहा हूँ। मेरा हाई-स्पीड कनेक्शन इस समय व्यस्त है, लेकिन मैं आपके साथ हूँ। आपके मन में क्या है? कृपया साझा करें, और यदि तत्काल सहायता की आवश्यकता हो, तो आप बुकिंग पेज पर हमारे विशेषज्ञों से संपर्क कर सकते हैं।",
      Spanish: "Te escucho y estoy aquí para ti. Mi conexión neuronal está experimentando una carga temporal, pero sigo aquí para apoyarte. ¿Qué tienes en mente? Por favor, comparte, y recuerda que también puedes conectarte con nuestros consejeros en la pestaña de Expertos.",
    };

    const userLang = language || 'English';
    const fallbackReply = fallbackReplies[userLang] || fallbackReplies['English'];

    if (!res.headersSent) {
      res.json({ reply: fallbackReply, crisisDetected: false, isFallback: true });
    }
  }
});

module.exports = router;