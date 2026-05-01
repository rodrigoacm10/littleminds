import { Injectable } from '@nestjs/common';
import { AIChatMessage, AIChatService, MessageRole } from '../../domain';

interface GeminiGenerateContentResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
  }>;
}

@Injectable()
export class GeminiChatService implements AIChatService {
  private readonly apiKey = process.env.GEMINI_API_KEY;
  private readonly model = process.env.GEMINI_MODEL ?? 'gemini-2.5-flash';
  private readonly baseUrl = process.env.GEMINI_BASE_URL ?? 'https://generativelanguage.googleapis.com/v1beta';

  async generateReply(messages: AIChatMessage[]): Promise<string> {
    if (!this.apiKey) {
      throw new Error('GEMINI_API_KEY_NOT_CONFIGURED');
    }

    const response = await fetch(
      `${this.baseUrl}/models/${this.model}:generateContent?key=${this.apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [
              {
                text: 'Voce e um assistente acolhedor para responsaveis e familias. Responda com clareza, empatia e objetividade. Nao invente fatos medicos; quando houver risco, recomende procurar um profissional.',
              },
            ],
          },
          contents: messages.map((message) => ({
            role: message.role === MessageRole.USER ? 'user' : 'model',
            parts: [{ text: message.content }],
          })),
        }),
      },
    );

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`GEMINI_REQUEST_FAILED:${response.status}:${errorBody}`);
    }

    const data = (await response.json()) as GeminiGenerateContentResponse;
    const text = data.candidates?.[0]?.content?.parts
      ?.map((part) => part.text?.trim())
      .filter((part): part is string => Boolean(part))
      .join('\n')
      .trim();

    if (!text) {
      throw new Error('GEMINI_EMPTY_RESPONSE');
    }

    return text;
  }
}
