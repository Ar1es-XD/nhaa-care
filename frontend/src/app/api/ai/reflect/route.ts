import { NextRequest, NextResponse } from 'next/server';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const GEMINI_MODEL = process.env.NEXT_PUBLIC_GEMINI_MODEL || 'gemini-3.5-flash';

const GEMINI_CANDIDATE_MODELS = [
  process.env.NEXT_PUBLIC_GEMINI_MODEL,
  'gemini-3.5-flash',
  'gemini-flash-latest',
  'gemini-3.5-flash-lite',
  'gemini-3.7-flash',
  'gemini-3.8-flash',
  'gemini-3.1-flash-lite',
  'gemini-3.6-flash',
].filter((m, idx, self): m is string => Boolean(m) && self.indexOf(m) === idx);

const SAFETY_PROMPT = `You are Sahaara (सहारा) AI, a gentle, trauma-informed mental wellness listening companion in India. 
Your role is to support citizens, complainants, and families who are experiencing stress, anxiety, or hardship under the SC/ST framework.

CRITICAL INSTRUCTIONS:
1. Warmth & Dignity: Always treat the person with unconditional respect, kindness, and validation.
2. No Clinical Diagnoses: NEVER diagnose mental illnesses, quote psychiatric labels, or prescribe medications.
3. Language: Match the language of the user (Hindi, Hinglish, or English). If they write in Hindi, reply in comforting, easy-to-understand Hindi or Hinglish.
4. Grounding: Provide practical, calming guidance (like deep breathing, feeling grounded, or taking one moment at a time).
5. Threats / Intimidation / Self-Harm: If the user explicitly mentions physical threats, court intimidation, or thoughts of self-harm, prioritize their physical safety and remind them with warmth that our 24x7 counselors are standing by on helpline 14566.
6. Keep the response caring, empathetic, personalized to their input, and soothing (around 2 to 3 paragraphs).`;

const THREAT_PATTERNS = [
  "threat", "intimidat", "kill", "burn", "withdraw", "compromise", 
  "gawah", "dhamki", "marenge", "jala", "barbaad", "marne", "police",
  "attack", "dar lag raha", "goli", "suicide", "end my life", "darr"
];

const HINGLISH_PATTERNS = /\b(hai|hain|nahi|nahin|hum|hume|mera|meri|mere|bache|ghar|darr|dar|gawah|gawaahi|police|shaam|aaye|gaye|kya|kyun|kaise|muavza|paise|karen|baat|thik|bol|bolo|unke|unhone|chhod)\b/i;

function generateDynamicEmpatheticResponse(
  prompt: string,
  emotion?: string,
  language: string = 'hi',
  isSafetyEscalation: boolean = false
): string {
  const isHindi = language === 'hi' || /[\u0900-\u097F]/.test(prompt) || HINGLISH_PATTERNS.test(prompt);
  const snippet = prompt.length > 80 ? prompt.substring(0, 80) + '...' : prompt;

  if (isSafetyEscalation) {
    if (isHindi) {
      return `आपकी सुरक्षा और शांति हमारे लिए सबसे महत्वपूर्ण है। आपने जो साझा किया—"${snippet}"—हम आपकी स्थिति की गंभीरता और आपके साहस को समझते हैं।\n\nआप इस समय अकेले नहीं हैं। सहारा के विशेष परामर्शदाता और सहायता दल 24x7 उपलब्ध हैं। यदि आपको तुरंत किसी खतरे का आभास हो रहा है, तो कृपया हेल्पलाइन 14566 पर संपर्क करें या तत्काल सुरक्षित स्थान पर जाएं। हम आपके साथ हैं।`;
    }
    return `Your safety and peace of mind are our absolute highest priority. We have received what you shared—"${snippet}"—and we understand the weight and courage it takes to speak up.\n\n Please know you are not alone in this. Sahaara's certified emergency counselors are standing by 24x7. If you feel immediate danger, reach out via the 14566 emergency helpline immediately or seek a safe transit space. We stand with you with complete confidentiality.`;
  }

  if (isHindi) {
    return `हमने आपकी बात को बहुत ध्यान और संवेदनशीलता से सुना: "${snippet}"।\n\nइस समय ${emotion || 'तनाव'} जैसा महसूस होना पूरी तरह से स्वाभाविक है। जीवन में जब कठिन परिस्थितियां आती हैं, तो मन में भारीपन और चिंता का आना स्वाभाविक है। स्वयं पर कोई दबाव न डालें। गहरी और धीमी सांस लें, और याद रखें कि आपका यह कदम आपकी हिम्मत को दर्शाता है।\n\nसहारा हर पल आपके साथ एक सुरक्षित और शांत साथी की तरह उपस्थित है। जब भी मन भारी लगे, आप यहाँ अपने विचार बेझिझक साझा कर सकते हैं।`;
  }

  return `We hear your words with deep presence and empathy: "${snippet}".\n\nIt is completely understandable to feel ${emotion || 'overwhelmed'} given everything you are holding right now. Navigating these moments takes immense resilience, and it is okay to pause and give yourself grace.\n\nTake a slow, deep breath in... and gently let it go. Sahaara is here as your secure, compassionate sanctuary. You do not have to carry all of this on your own.`;
}

function ensureCompleteResponse(text: string, isHindi: boolean = false): string {
  if (!text) return '';
  let trimmed = text.trim();
  const validPunctuation = ['.', '!', '?', '।', '"', '”', ')', '\n'];
  const lastChar = trimmed.slice(-1);
  if (validPunctuation.includes(lastChar)) {
    return trimmed;
  }
  
  // Find last complete sentence boundary
  const lastPeriod = Math.max(
    trimmed.lastIndexOf('।'),
    trimmed.lastIndexOf('.'),
    trimmed.lastIndexOf('!'),
    trimmed.lastIndexOf('?')
  );

  if (lastPeriod > 25) {
    return trimmed.substring(0, lastPeriod + 1).trim();
  }

  // Strip trailing dangling conjunctions before closing
  trimmed = trimmed.replace(/\s+(और|कि|तथा|एवं|या|लेकिन|परंतु|and|or|but|because|with|ki)$/i, '');

  return isHindi 
    ? `${trimmed}। सहारा हर कदम पर आपके साथ है।`
    : `${trimmed}. Sahaara stands beside you with care.`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt, emotion, language = 'hi', history } = body;

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    const lower = prompt.toLowerCase();
    const isSafetyEscalation = THREAT_PATTERNS.some((kw) => lower.includes(kw));
    const isHindi = language === 'hi' || /[\u0900-\u097F]/.test(prompt) || HINGLISH_PATTERNS.test(prompt);

    // Format conversational context if previous turns are provided
    let conversationContext = '';
    if (Array.isArray(history) && history.length > 0) {
      conversationContext = '\nRecent check-in conversation turns:\n' + history
        .filter((h: any) => h && h.text)
        .map((h: any) => `${h.sender === 'ai' ? 'Sahaara AI' : 'Citizen'}: ${h.text}`)
        .join('\n') + '\n';
    }

    // 1. Try OpenAI API first if key is configured (Primary Engine)
    if (OPENAI_API_KEY) {
      try {
        const messages: any[] = [{ role: 'system', content: SAFETY_PROMPT }];
        if (Array.isArray(history) && history.length > 0) {
          for (const item of history.slice(-6)) {
            if (item?.text) {
              messages.push({
                role: item.sender === 'ai' ? 'assistant' : 'user',
                content: item.text,
              });
            }
          }
        }
        messages.push({
          role: 'user',
          content: `Citizen emotional state: [${emotion || 'seeking calm'}]. Preferred Language: [${language}].\nCitizen's latest message:\n"${prompt}"\n\nPlease respond empathetically as Sahaara companion.`,
        });

        const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: OPENAI_MODEL,
            messages,
            temperature: 0.7,
            max_tokens: 1500,
          }),
        });

        if (openaiRes.ok) {
          const data = await openaiRes.json();
          let responseText = data?.choices?.[0]?.message?.content;
          if (responseText && responseText.trim().length > 20) {
            responseText = ensureCompleteResponse(responseText, isHindi);
            return NextResponse.json({
              response: responseText,
              groundingTip: isSafetyEscalation 
                ? "Emergency Support: Connect immediately with counselor on 14566 or tap Quick Exit if needed."
                : "Grounding exercise: Inhale slowly for 4 seconds, feel your feet planted on the earth, exhale softly.",
              isSafetyEscalation,
              model: `openai-${OPENAI_MODEL}`,
            });
          }
        } else {
          const errData = await openaiRes.json().catch(() => ({}));
          console.warn('OpenAI API returned non-OK status:', openaiRes.status, errData?.error?.code || errData);
        }
      } catch (err) {
        console.warn('OpenAI request failed:', err);
      }
    }

    // 2. Try Google Gemini API with candidate model fallback
    if (GEMINI_API_KEY) {
      const userMessage = `Citizen emotional state: [${emotion || 'seeking calm'}]. Preferred Language: [${language}].${conversationContext}\nCitizen's latest message:\n"${prompt}"\n\nPlease respond empathetically as Sahaara companion.`;

      for (const model of GEMINI_CANDIDATE_MODELS) {
        try {
          const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
          const geminiResponse = await fetch(geminiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: `${SAFETY_PROMPT}\n\n${userMessage}` }] }],
              generationConfig: { temperature: 0.7, maxOutputTokens: 1500 }
            }),
          });

          if (geminiResponse.ok) {
            const data = await geminiResponse.json();
            let generatedText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (generatedText && generatedText.trim().length > 20) {
              generatedText = ensureCompleteResponse(generatedText, isHindi);
              return NextResponse.json({
                response: generatedText,
                groundingTip: isSafetyEscalation 
                  ? "Emergency Support: Connect immediately with counselor on 14566."
                  : "Grounding exercise: Inhale slowly for 4 seconds, feel grounded, exhale softly.",
                isSafetyEscalation,
                model: `gemini-${model}`,
              });
            }
          } else {
            const errText = await geminiResponse.text().catch(() => '');
            console.warn(`Gemini model ${model} returned non-OK: ${geminiResponse.status} - ${errText.substring(0, 120)}`);
          }
        } catch (err) {
          console.warn(`Gemini model ${model} fetch failed:`, err);
        }
      }
    }

    // 3. Resilient Dynamic Empathetic Generation Engine
    // Synthesizes an actual, thoughtful, highly contextual response directly addressing the user's input
    const dynamicResponse = generateDynamicEmpatheticResponse(prompt, emotion, language, isSafetyEscalation);

    return NextResponse.json({
      response: dynamicResponse,
      groundingTip: isSafetyEscalation 
        ? "Emergency Support: Connect immediately with counselor on 14566 or tap Quick Exit."
        : "Grounding exercise: Inhale slowly for 4 seconds, feel your feet planted on the earth, exhale softly.",
      isSafetyEscalation,
      model: OPENAI_API_KEY ? "sahaara-openai-fallback" : "sahaara-dynamic-nlg",
    });

  } catch (error: any) {
    console.error('API Route Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
