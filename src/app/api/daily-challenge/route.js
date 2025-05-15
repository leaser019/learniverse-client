import { LRUCache } from 'lru-cache';
import ms from 'ms';
import { NextResponse } from 'next/server';
import { ChallengeGeneratorService } from '../../../lib/services/ChallengeGeneratorService';

// Cache for daily challenges - only generate once per day
const challengeCache = new LRUCache({
  max: 10, // Store up to 10 challenges
  ttl: ms('24h'), // Cache for 24 hours
});

export async function GET(req) {
  try {
    // Get today's date in YYYY-MM-DD format for cache key
    const today = new Date().toISOString().split('T')[0];
    const cacheKey = `daily-challenge-${today}`;
    
    // Check if we already have a challenge for today
    const cachedChallenge = challengeCache.get(cacheKey);
    if (cachedChallenge) {
      return NextResponse.json(cachedChallenge);
    }
    
    // No cached challenge, generate a new one
    const API_KEY = process.env.GEMINI_API_KEY;
    
    if (!API_KEY) {
      return NextResponse.json(
        { error: 'API key is not configured' }, 
        { status: 500 }
      );
    }
    
    const challenge = await ChallengeGeneratorService.generateDailyChallenge(API_KEY);
    
    // Cache the challenge
    challengeCache.set(cacheKey, challenge);
    
    return NextResponse.json(challenge);
  } catch (error) {
    console.error('[Daily Challenge API Error]', error);
    return NextResponse.json(
      { error: 'Failed to generate daily challenge', message: error.message },
      { status: 500 }
    );
  }
}
