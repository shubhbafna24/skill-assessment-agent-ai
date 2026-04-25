import { AIProvider } from '../providerFactory';
import { GoogleGenerativeAI } from '@google/generative-ai';

export class GeminiAdapter implements AIProvider {
  private client: GoogleGenerativeAI;

  constructor(apiKey: string) {
    this.client = new GoogleGenerativeAI(apiKey);
  }

  async generateAssessment(systemPrompt: string, userPrompt: string): Promise<string> {
    // We use gemini-1.5-pro for complex reasoning tasks
    const model = this.client.getGenerativeModel({ 
      model: 'gemini-1.5-pro',
      systemInstruction: systemPrompt 
    });

    const result = await model.generateContent(userPrompt);
    const response = await result.response;
    return response.text();
  }
}