const fetch = global.fetch || require('node-fetch');
require('dotenv').config();

let GoogleGenAI = null;
try {
  // try common CommonJS export shape
  GoogleGenAI = require('@google/genai').GoogleGenAI || require('@google/genai').default?.GoogleGenAI;
} catch (e) {
  GoogleGenAI = null;
}

const MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
const API_KEY = process.env.GEMINI_API_KEY || '';
const ai = GoogleGenAI ? new GoogleGenAI({ apiKey: API_KEY }) : null;

async function askAI(prompt) {
  try {
    const masked = API_KEY;
    console.log('Asking AI with prompt:', prompt);
    console.log('GEMINI_API_KEY:', masked);
    console.log('Using MODEL:', MODEL);

    if (ai) {
      // Use @google/genai client if available (matches the example you provided)
      const response = await ai.models.generateContent({
        model: MODEL,
        contents: prompt
      });

      // prefer response.text per example; fall back to common shapes
      if (response?.text) return String(response.text);

      const text =
        response?.candidates?.[0]?.content?.[0]?.text ||
        response?.candidates?.[0]?.output?.[0]?.content?.[0]?.text ||
        response?.candidates?.[0]?.output ||
        JSON.stringify(response);

      return String(text);
    }

    // Fallback: direct REST call (behaves like your working curl)
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;
    const body = {
      contents: [
        {
          parts: [{ text: prompt }]
        }
      ]
    };

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-goog-api-key': API_KEY
      },
      body: JSON.stringify(body)
    });

    const json = await res.json();
    if (!res.ok) {
      const errMsg = json?.error?.message || JSON.stringify(json);
      throw new Error(`Generative API error: ${res.status} ${errMsg}`);
    }

    const text =
      json?.candidates?.[0]?.content?.[0]?.text ||
      json?.candidates?.[0]?.output?.[0]?.content?.[0]?.text ||
      json?.candidates?.[0]?.output ||
      JSON.stringify(json);

    return String(text);
  } catch (error) {
    console.error('AI Service Error:', error);

    if (String(error.message || '').toLowerCase().includes('quota') || String(error.message || '').includes('RESOURCE_EXHAUSTED')) {
      console.log('Quota exceeded, using mock response');
      return `Mock response: You asked "${prompt}". This is a fallback response because Gemini quota was exceeded.`;
    }

    throw error;
  }
}

module.exports = { askAI };