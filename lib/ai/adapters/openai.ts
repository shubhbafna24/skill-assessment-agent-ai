import { AIProvider } from '../providerFactory';
import OpenAI from 'openai';

export class OpenAIApter implements AIProvider {
  private client: OpenAI;

  constructor(apiKey: string) {
    this.client = new OpenAI({ apiKey });
  }

  async generateAssessment(systemPrompt: string, userPrompt: string): Promise<string> {
    const response = await this.client.chat.completions.create({
      model: 'gpt-4o', // or gpt-4-turbo
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.2,
    });

    return response.choices[0].message.content || '';
  }
}