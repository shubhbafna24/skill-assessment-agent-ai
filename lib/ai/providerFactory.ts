import { OpenAIApter } from './adapters/openai';
import { GroqAdapter } from './adapters/groq';
import { GeminiAdapter } from './adapters/gemini';
import { OpenRouterAdapter } from './adapters/openrouter';

export interface AIProvider {
  generateAssessment(systemPrompt: string, userPrompt: string): Promise<string>;
}

export function getAiProvider(): AIProvider {
  const provider = process.env.AI_PROVIDER?.toLowerCase() || 'openrouter';

  switch (provider) {
    case 'openai':
      return new OpenAIApter(process.env.OPENAI_API_KEY!);
    case 'groq':
      return new GroqAdapter(process.env.GROQ_API_KEY!);
    case 'gemini':
      return new GeminiAdapter(process.env.GEMINI_API_KEY!);
    case 'openrouter':
    default:
      return new OpenRouterAdapter(process.env.OPENROUTER_API_KEY!);
  }
}