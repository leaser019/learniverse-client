import { LRUCache } from 'lru-cache';
import ms from 'ms';
import { NextResponse } from 'next/server';

// Cache for submissions to prevent spam
const submissionCache = new LRUCache({
  max: 1000,
  ttl: ms('10m'), // Cache for 10 minutes
});

// Simulate judging code
const judgeCode = async (code, language, testCases) => {
  // This is a simulation - in a real app, you'd have a proper judging system
  // that executes the code securely with proper sandboxing
  
  // For demo purposes, we'll just return random results with a slight delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Generate random test results (70% chance to pass each test)
  const testResults = testCases.map((testCase, index) => {
    const passed = Math.random() > 0.3;
    
    return {
      testCaseId: index,
      passed,
      runtime: Math.floor(Math.random() * 100) + 5, // 5-105ms
      memory: Math.floor(Math.random() * 5000) + 30000, // 30-35MB
      input: testCase.input,
      expectedOutput: testCase.output,
      actualOutput: passed ? testCase.output : 'Incorrect output',
      error: passed ? null : 'Output does not match expected result'
    };
  });
  
  // Calculate score based on number of passed tests
  const passedTests = testResults.filter(r => r.passed).length;
  const score = Math.floor((passedTests / testResults.length) * 100);
  
  return {
    status: passedTests === testResults.length ? 'Accepted' : 'Wrong Answer',
    score,
    passedTestCases: passedTests,
    totalTestCases: testResults.length,
    runtime: Math.max(...testResults.map(r => r.runtime)),
    memory: Math.max(...testResults.map(r => r.memory)),
    testResults
  };
};

export async function POST(req) {
  try {
    const body = await req.json();
    const { userId, challengeId, code, language } = body;
    
    if (!code?.trim()) {
      return NextResponse.json({ error: 'Code is required' }, { status: 400 });
    }
    
    if (!challengeId) {
      return NextResponse.json({ error: 'Challenge ID is required' }, { status: 400 });
    }
    
    if (!language) {
      return NextResponse.json({ error: 'Programming language is required' }, { status: 400 });
    }
    
    // Check submission rate limiting (3 submissions per 5 minutes per challenge)
    const cacheKey = `${userId || 'anonymous'}_${challengeId}`;
    const userSubmissions = submissionCache.get(cacheKey) || [];
    
    if (userSubmissions.length >= 3) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please wait a few minutes before submitting again.' },
        { status: 429 }
      );
    }
    
    // Update submission count
    userSubmissions.push(Date.now());
    submissionCache.set(cacheKey, userSubmissions);
    
    // Get test cases for this challenge
    // In a real app, you'd fetch these from a database
    // Here we'll use dummy test cases
    const testCases = [
      { input: '[2,7,11,15], 9', output: '[0,1]' },
      { input: '[3,2,4], 6', output: '[1,2]' },
      { input: '[3,3], 6', output: '[0,1]' }
    ];
    
    // Judge submission
    const results = await judgeCode(code, language, testCases);
    
    // Create submission record
    const submission = {
      id: `submission-${Date.now()}`,
      userId: userId || 'anonymous',
      challengeId,
      code,
      language,
      ...results,
      submittedAt: new Date().toISOString()
    };
    
    // In a real app, you'd save this to a database
    console.log('Submission recorded:', submission.id);
    
    return NextResponse.json(submission);
  } catch (err) {
    console.error('[Challenge Submit API Error]', err);
    return NextResponse.json(
      { error: 'Internal Server Error', message: err.message },
      { status: 500 }
    );
  }
}
