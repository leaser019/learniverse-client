import { LRUCache } from 'lru-cache';
import ms from 'ms';
import { NextResponse } from 'next/server';
import { DEFAULT_SYSTEM_PROMPT } from '../../../lib/prompts';
import { GeminiService } from '../../../lib/services/GeminiService';
const rateLimit = {
  tokenCache: new LRUCache({
    max: 500,
    ttl: ms('1h'),
  }),
  limiter: (ip) => {
    const tokenCache = rateLimit.tokenCache;
    const now = Date.now();
    const requests = tokenCache.get(ip) || [];
    requests.push(now);
    tokenCache.set(ip, requests.filter(time => now - time < ms('1m')));
    return tokenCache.get(ip).length <= 10;
  }
};
  
const responseCache = new LRUCache({
  max: 100,
  ttl: ms('30m'),
});

export async function POST(req) {
  try {
    const body = await req.json();
    const { prompt, model, systemPrompt } = body;

    if (!prompt?.trim()) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const cacheKey = `${prompt}_${model || 'gemini-2.0-flash'}_${systemPrompt || DEFAULT_SYSTEM_PROMPT}`;
         const cachedResponse = responseCache.get(cacheKey);
         
         if (cachedResponse) {
           return NextResponse.json(cachedResponse);
         }  
    

    const API_KEY = process.env.GEMINI_API_KEY;

    if (!API_KEY) {
      return NextResponse.json({ error: 'API key is not configured' }, { status: 500 });
    }

    const genAI = GeminiService.getInstance(API_KEY);
    const result = await genAI.generateContent(
      prompt,
      model || 'gemini-2.0-flash',
      systemPrompt || DEFAULT_SYSTEM_PROMPT
    );

  responseCache.set(cacheKey, result.response);
    return NextResponse.json(result.response);
  } catch (err) {
    console.error('[Gemini API Error]', err);
    return NextResponse.json(
      { error: 'Internal Server Error', message: err.message },
      { status: 500 }
    );
  }
}
