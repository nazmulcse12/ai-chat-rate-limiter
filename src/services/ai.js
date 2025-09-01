const { createOpenAI } = require('@ai-sdk/openai');
const { generateText } = require('ai');

const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function askAI(prompt) {
  try {
    console.log('Asking AI with prompt:', prompt);
    
    const { text } = await generateText({
      model: openai('gpt-3.5-turbo'), // Try this instead of gpt-4o-mini
      prompt,
      maxTokens: 150, // Limit tokens to save quota
    });
    
    return text;
  } catch (error) {
    console.error('AI Service Error:', error);
    
    // Fallback to mock response if quota exceeded
    if (error.message?.includes('quota')) {
      console.log('Quota exceeded, using mock response');
      return `Mock response: You asked "${prompt}". This is a fallback response because OpenAI quota was exceeded.`;
    }
    
    throw error;
  }
}

module.exports = { askAI };