const axios = require("axios");

const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";

async function generateHealthResponse({
  userMessage,
  riskLevel,
  symptoms = [],
  reasons = [],
}) {
  try {
    const prompt = `
You are a women's health assistant.

RULES:
- Be empathetic and simple
- Do NOT diagnose
- Do NOT suggest medicines
- If risk is urgent, advise visiting a doctor
- Never claim to be a doctor

Health context:
Risk Level: ${riskLevel}
Symptoms: ${symptoms.join(", ") || "None"}
Reasons: ${reasons.join("; ") || "None"}

User message:
${userMessage}
`;

    const response = await axios.post(
      `${GEMINI_URL}?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.candidates[0].content.parts[0].text;
  } catch (err) {
    console.error("Gemini REST Error:", err.response?.data || err.message);
    throw new Error("Gemini AI failed");
  }
}

module.exports = { generateHealthResponse };
