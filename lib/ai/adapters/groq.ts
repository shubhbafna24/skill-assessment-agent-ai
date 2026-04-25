import { AIProvider } from '../providerFactory';
import Groq from 'groq-sdk';

export class GroqAdapter implements AIProvider {
  private client: Groq;

  constructor(apiKey: string) {
    this.client = new Groq({ apiKey });
  }

  async generateAssessment(systemPrompt: string, userPrompt: string): Promise<string> {
    const response = await this.client.chat.completions.create({
      model: 'llama3-70b-8192', // Fast, open-source model available on Groq
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.2,
    });

    return response.choices[0]?.message?.content || '';
  }
}