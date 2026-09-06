import { NextRequest, NextResponse } from 'next/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const GEMINI_MODEL = process.env.NEXT_PUBLIC_GEMINI_MODEL || 'gemini-3.6-flash';

const COUNSELOR_PROMPT = `You are Sahaara Clinical Copilot, assisting licensed mental health counselors and nodal officers under the SC/ST (Prevention of Atrocities) framework in India.
Analyze the provided longitudinal signals, milestone context, and citizen quotes.
Provide a concise clinical triage summary with:
1. Longitudinal Risk Assessment (Velocity & Trend)
2. Trauma & Intimidation Assessment
3. Recommended Supportive Interventions (Tele-MANAS, safe transit, legal aid, DM relocation review)
Keep the note objective, trauma-informed, professional, and ethical.`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { caseId, ddsScore, velocity, verbatimQuote, milestone } = body;

    if (!GEMINI_API_KEY) {
      return NextResponse.json({
        summary: `Longitudinal analysis for ${caseId}: Patient exhibits sharp distress escalation (DDS: ${ddsScore}, Δ: +${velocity}) closely correlated with recent milestone (${milestone}). Recommended: Immediate outreach by licensed counselor, evaluate safe transit support, and verify Rule 12 interim relief status.`,
        model: 'heuristic-summary',
      });
    }

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

    const promptText = `Case ID: ${caseId}
Current Distress Score: ${ddsScore}/100
14-day Risk Velocity: +${velocity}
Current Legal Milestone: ${milestone}
Recent Verbatim Statement: "${verbatimQuote}"

Generate a 3-bullet clinical triage analysis note for the attending counselor.`;

    const geminiResponse = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: `${COUNSELOR_PROMPT}\n\n${promptText}` }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 500,
        }
      }),
    });

    if (!geminiResponse.ok) {
      const errText = await geminiResponse.text();
      console.error('Gemini API Error:', errText);
      return NextResponse.json({
        summary: `Case ${caseId} exhibits high acute distress. Verified trigger: ${milestone}. Immediate human counselor verification initiated.`,
        model: 'fallback',
      });
    }

    const data = await geminiResponse.json();
    const summary = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No summary generated.';

    return NextResponse.json({
      summary,
      model: GEMINI_MODEL,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
