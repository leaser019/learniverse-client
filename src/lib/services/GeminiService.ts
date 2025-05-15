import { GoogleGenerativeAI } from '@google/generative-ai';

export class GeminiService {
  static instance: GeminiService;
  genAI: GoogleGenerativeAI;

  constructor(apiKey:string) {
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  static getInstance(apiKey:string) {
    if (!GeminiService.instance) {
      GeminiService.instance = new GeminiService(apiKey);
    }
    return GeminiService.instance;
  }

  async generateContent(prompt:string, model:string = 'gemini-2.0-flash', systemPrompt:string) {
    const genModel = this.genAI.getGenerativeModel({ model });
    return genModel.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      systemInstruction: systemPrompt,
    });
  }
}