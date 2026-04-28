module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const apiKey = process.env.GEMINI_API_KEY || process.env.gemini_api_key || process.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    const totalVars = Object.keys(process.env).length;
    const geminiKeys = Object.keys(process.env).filter(k => k.toLowerCase().includes("gemini") || k.toLowerCase().includes("google"));
    return res.status(500).json({
      error: `GEMINI_API_KEY not found. Runtime sees ${totalVars} env vars total. GEMINI/GOOGLE keys visible: ${geminiKeys.length ? geminiKeys.join(", ") : "none"}. Fix: Vercel → Settings → Environment Variables → GEMINI_API_KEY → Edit → tick Production → Save → Redeploy (untick "use existing build cache").`
    });
  }

  const { name, ticker, price, pe, opMargin, revenueGrowth, roic, score, riskTier, sector, mktCap } = req.body || {};
  if (!ticker) return res.status(400).json({ error: "ticker required" });

  const prompt = `You are a senior research analyst at Aramis Capital, a Zimbabwean-based institutional investment firm.

Write a structured investment conviction narrative for ${name || ticker} (${ticker}) using the following data:
- Current Price: $${price || "N/A"}
- P/E Ratio: ${pe ? pe + "x" : "N/A"}
- Operating Margin: ${opMargin != null ? opMargin + "%" : "N/A"}
- Revenue Growth: ${revenueGrowth ? revenueGrowth + "%" : "N/A"}
- ROIC: ${roic ? roic + "%" : "N/A"}
- Aramis Score: ${score != null ? score + "/100" : "N/A"}
- Tier: ${riskTier ? "Tier " + riskTier : "Unclassified"}
- Sector: ${sector || "Unknown"}
- Market Cap: ${mktCap || "N/A"}

Your response must be a JSON object with exactly these keys:
{
  "headline": "Single sentence capturing the core investment thesis (max 20 words)",
  "why_now": "1-2 sentences on what makes this the right moment to own this stock",
  "business_moat": "1-2 sentences on the competitive advantage and business quality",
  "financial_health": "1 sentence on balance sheet and cash generation strength",
  "growth_trajectory": "1 sentence on the growth profile",
  "management_quality": "1 sentence on capital allocation track record",
  "valuation": "1 sentence on whether the stock is cheap, fair, or expensive",
  "key_risks": "1-2 sentences on the primary risks to the thesis",
  "client_summary": "3 sentences in plain English suitable for a sophisticated private investor"
}

Tone: institutional and measured. Return only the JSON object, no other text.`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: 1200, temperature: 0.7 }
        })
      }
    );
    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || "Gemini API error");
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    const clean = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);
    return res.status(200).json({ narrative: parsed });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
