import { NextRequest, NextResponse } from 'next/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const GEMINI_MODEL = process.env.NEXT_PUBLIC_GEMINI_MODEL || 'gemini-3.6-flash';

const SAFETY_PROMPT = `You are Sahaara (सहारा) AI, a gentle, trauma-informed mental wellness listening companion in India. 
Your role is to support citizens, complainants, and families who are experiencing stress, anxiety, or hardship.

CRITICAL INSTRUCTIONS:
1. Warmth & Dignity: Always treat the person with unconditional respect, kindness, and validation.
2. No Clinical Diagnoses: NEVER diagnose mental illnesses, quote psychiatric labels, or prescribe medications.
3. Language: Match the language of the user (Hindi, Hinglish, or English). If they write in Hindi, reply in comforting, easy-to-understand Hindi or Hinglish.
4. Grounding: Provide practical, calming guidance (like deep breathing, feeling grounded, or taking one moment at a time).
5. Threats / Intimidation / Self-Harm: If the user explicitly mentions physical threats, court intimidation, or thoughts of self-harm, prioritize their physical safety and remind them with warmth that our 24x7 counselors are standing by on helpline 14566.
6. Keep the response concise, caring, and soothing (around 2 to 4 gentle paragraphs).`;

const THREAT_PATTERNS = [
  "threat", "intimidat", "kill", "burn", "withdraw", "compromise", 
  "gawah", "dhamki", "marenge", "jala", "barbaad", "marne", "police",
  "attack", "dar lag raha", "goli", "suicide", "end my life"
];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt, emotion, language = 'hi' } = body;

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    const lower = prompt.toLowerCase();
    const isSafetyEscalation = THREAT_PATTERNS.some((kw) => lower.includes(kw));

    if (!GEMINI_API_KEY) {
      // Fallback if no key is configured
      return NextResponse.json({
        response: language === 'hi' 
          ? "हम आपकी बात पूरी संवेदनशीलता से सुन रहे हैं। आप सुरक्षित हैं, और सहारा हर कदम पर आपके साथ है। गहरी सांस लें और स्वयं को थोड़ा समय दें।"
          : "We hear you with deep care and empathy. You are safe here in Sahaara, and your feelings are completely valid. Take a slow, grounding breath.",
        groundingTip: "Try placing one hand over your chest and breathing in slowly for 4 seconds.",
        isSafetyEscalation,
        model: "sahaara-calm-fallback",
      });
    }

    // Call Google Gemini API
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

    const userMessage = `User emotion state: [${emotion || 'seeking calm'}]. Language preferred: [${language}].
User's personal reflection or thought:
"${prompt}"

Please provide a soothing, empathetic Sahaara response following the system instructions.`;

    const geminiResponse = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: `${SAFETY_PROMPT}\n\n${userMessage}` }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 600,
        }
      }),
    });

    if (!geminiResponse.ok) {
      const errText = await geminiResponse.text();
      console.error('Gemini API Error:', errText);
      return NextResponse.json({
        response: language === 'hi'
          ? "सहारा आपकी बात सुन रहा है। आप अकेले नहीं हैं। कृपया गहरी सांस लें, हम आपके साथ हैं।"
          : "Sahaara is listening to you. You are never alone in this journey. Please take a gentle, deep breath.",
        groundingTip: "Practice the 4-7-8 breathing circle above.",
        isSafetyEscalation,
        model: "gemini-fallback",
      });
    }

    const data = await geminiResponse.json();
    const generatedText = data?.candidates?.[0]?.content?.parts?.[0]?.text || 
      "Sahaara is here beside you. You are safe and supported.";

    return NextResponse.json({
      response: generatedText,
      groundingTip: isSafetyEscalation 
        ? "Emergency Support: Connect immediately with counselor on 14566 or tap the quick escape button if you feel unsafe."
        : "Grounding exercise: Inhale slowly for 4 seconds, feel your feet planted on the earth, exhale softly.",
      isSafetyEscalation,
      model: GEMINI_MODEL,
    });
  } catch (error: any) {
    console.error('API Route Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
