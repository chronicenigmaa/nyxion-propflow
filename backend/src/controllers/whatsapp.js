import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const summarise = async (req, res) => {
  const { clientName, chatText } = req.body;

  if (!chatText || chatText.trim().length < 10) {
    return res.status(400).json({ error: "Chat text is required" });
  }

  const prompt = `You are an AI assistant for a Pakistani property management company called Propflow, built by Nyxion Labs.

You will be given a WhatsApp conversation between a property manager and a tenant or prospect. The conversation may be in Roman Urdu (Urdu written in English letters), English, or a mix of both. This is completely normal for Pakistan.

Analyse the conversation and return a JSON object with exactly these fields:

{
  "summaryEn": "A clear 2-3 sentence summary in English. Focus on: is the client interested? Are they agreeing to pay? Are there issues? What is the key outcome?",
  "summaryUrdu": "Same summary in Roman Urdu (2-3 sentences). Write naturally as Pakistanis text, e.g. 'Client ne kaha ke wo rent dene ko tayar hai lekin renovation pehle chahiye.'",
  "sentiment": "positive OR negative OR neutral",
  "tags": ["array of 2-4 short tags like 'Ready to sign', 'Payment issue', 'Price agreed', 'Wants viewing', 'Early exit risk', 'No response', 'Negotiating', 'Satisfied'"],
  "nudge": "One specific actionable instruction for the property manager. Be direct. E.g. 'Send lease renewal today — client is ready.' or 'Call directly — 3 unanswered messages.' or 'Schedule viewing for this week.'"
}

Return ONLY valid JSON. No explanation, no markdown, no backticks.

Client name: ${clientName || "Unknown"}

WhatsApp conversation:
${chatText}`;

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      max_tokens: 600,
      temperature: 0.3,
      messages: [{ role: "user", content: prompt }],
    });

    const raw = completion.choices[0].message.content.trim();

    const clean = raw
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    const parsed = JSON.parse(clean);
    res.json(parsed);
  } catch (err) {
    console.error("WhatsApp summarise error:", err);
    res.status(500).json({
      error: "AI summarisation failed",
      summaryEn: "Could not process this conversation. Please try again.",
      summaryUrdu: "Is conversation ko process nahi kar saka. Dobara try karein.",
      sentiment: "neutral",
      tags: [],
      nudge: "Review conversation manually.",
    });
  }
};