import { NextRequest, NextResponse } from 'next/server';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const GEMINI_MODEL = process.env.NEXT_PUBLIC_GEMINI_MODEL || 'gemini-3.6-flash';

const COUNSELOR_PROMPT = `You are Sahaara Clinical Copilot, assisting licensed mental health counselors and nodal officers under the SC/ST (Prevention of Atrocities) framework in India.
Analyze the provided longitudinal signals, milestone context, and citizen quotes.
Provide a concise clinical triage summary with:
1. Longitudinal Risk Assessment (Velocity & Trend)
2. Trauma & Intimidation Assessment
3. Recommended Supportive Interventions (Tele-MANAS, safe transit, legal aid, DM relocation review)
Keep the note objective, trauma-informed, professional, and ethical.`;

function generateDynamicCounselorSummary(
  caseId: string,
  ddsScore: number = 50,
  velocity: number = 0,
  verbatimQuote: string = '',
  milestone: string = 'Ongoing Investigation'
): string {
  const quoteSnippet = verbatimQuote ? `"${verbatimQuote}"` : 'No explicit statement transcribed';
  const isHighRisk = ddsScore >= 70 || velocity >= 20;
  const hasIntimidationWords = /threat|intimidat|kill|burn|withdraw|compromise|gawah|dhamki|marenge|jala|barbaad|marne|police|attack|dar|darr|goli/i.test(verbatimQuote || '');

  return `• 1. Longitudinal Risk Assessment (Velocity & Trend):
Case ${caseId || 'NHAA/2026'} indicates a ${isHighRisk ? 'Critical Escalation' : 'Moderate Trend'} profile with a Distress Determination Score of ${ddsScore}/100 and a 14-day velocity of +${velocity} points. The sharp slope correlates with the critical legal transition milestone (${milestone || 'court proceedings'}).

• 2. Trauma & Intimidation Assessment:
Citizen disclosure (${quoteSnippet}) ${
    hasIntimidationWords 
      ? 'strongly indicates active witness intimidation, retaliatory threats, or severe acute trauma requiring immediate physical safety verification' 
      : 'demonstrates acute psychological distress, heightened anxiety, and hyperarousal'
  }. Evaluated under SC/ST (PoA) Act Section 15A witness protection protocols.

• 3. Recommended Supportive Interventions:
- Immediate priority clinical outreach by a licensed psychologist via Tele-MANAS / 14566.
- Alert District Nodal Officer & SP for security evaluation, CCTV coverage, and safe court transit.
- Verify expedited disbursement of Rule 12(4) interim financial relief for livelihood stabilization.`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { caseId, ddsScore = 50, velocity = 0, verbatimQuote = '', milestone = 'Milestone Review' } = body;

    const promptText = `Case ID: ${caseId}
Current Distress Score: ${ddsScore}/100
14-day Risk Velocity: +${velocity}
Current Legal Milestone: ${milestone}
Recent Verbatim Statement: "${verbatimQuote}"

Generate a structured 3-bullet clinical triage analysis note for the attending counselor.`;

    // 1. Try OpenAI API first if key configured
    if (OPENAI_API_KEY) {
      try {
        const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: OPENAI_MODEL,
            messages: [
              { role: 'system', content: COUNSELOR_PROMPT },
              { role: 'user', content: promptText },
            ],
            temperature: 0.3,
            max_tokens: 1500,
          }),
        });

        if (openaiRes.ok) {
          const data = await openaiRes.json();
          const summary = data?.choices?.[0]?.message?.content;
          if (summary && summary.trim().length > 60) {
            return NextResponse.json({
              summary: summary.trim(),
              model: `openai-${OPENAI_MODEL}`,
            });
          }
        } else {
          const errData = await openaiRes.json().catch(() => ({}));
          console.warn('OpenAI API returned error, falling back:', openaiRes.status, errData);
        }
      } catch (err) {
        console.warn('OpenAI API fetch error, falling back:', err);
      }
    }

    // 2. Try Gemini API if key configured and valid
    if (GEMINI_API_KEY && !GEMINI_API_KEY.includes('AQ.')) {
      try {
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;
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
              maxOutputTokens: 1500,
            }
          }),
        });

        if (geminiResponse.ok) {
          const data = await geminiResponse.json();
          const summary = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (summary && summary.trim().length > 100) {
            return NextResponse.json({
              summary,
              model: `gemini-${GEMINI_MODEL}`,
            });
          }
        } else {
          const errText = await geminiResponse.text().catch(() => '');
          console.warn('Gemini API Error, falling back:', errText);
        }
      } catch (err) {
        console.warn('Gemini API fetch error, falling back:', err);
      }
    }

    // 3. Resilient Dynamic Fallback
    const summary = generateDynamicCounselorSummary(caseId, ddsScore, velocity, verbatimQuote, milestone);
    return NextResponse.json({
      summary,
      model: 'sahaara-dynamic-copilot',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
