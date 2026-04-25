import OpenAI from 'openai';
import Groq from 'groq-sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function generateAIResponse(systemPrompt: string, userPrompt: string): Promise<string> {
  const provider = (process.env.AI_PROVIDER || 'groq').toLowerCase();

  if (provider === 'openai') {
    const key = process.env.OPENAI_API_KEY;
    if (!key) throw new Error('OPENAI_API_KEY is not set in your .env file');
    const client = new OpenAI({ apiKey: key });
    const res = await client.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: userPrompt }],
      temperature: 0.2,
    });
    return res.choices[0].message.content || '';
  }

  if (provider === 'gemini') {
    const key = process.env.GEMINI_API_KEY;
    if (!key) throw new Error('GEMINI_API_KEY is not set in your .env file');
    const client = new GoogleGenerativeAI(key);
    const model = client.getGenerativeModel({ model: 'gemini-1.5-pro', systemInstruction: systemPrompt });
    const result = await model.generateContent(userPrompt);
    return result.response.text();
  }

  if (provider === 'openrouter') {
    const key = process.env.OPENROUTER_API_KEY;
    if (!key) throw new Error('OPENROUTER_API_KEY is not set in your .env file');
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'meta-llama/llama-3-70b-instruct',
        messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: userPrompt }],
        temperature: 0.2,
      }),
    });
    if (!res.ok) throw new Error(`OpenRouter API Error: ${res.statusText}`);
    const data = await res.json();
    return data.choices[0].message.content || '';
  }

  // Default: Groq — free tier at https://console.groq.com
  const key = process.env.GROQ_API_KEY;
  if (!key) throw new Error('GROQ_API_KEY is not set. Get a free key at https://console.groq.com');
  const client = new Groq({ apiKey: key });
  const res = await client.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: userPrompt }],
    temperature: 0.2,
  });
  return res.choices[0]?.message?.content || '';
}
