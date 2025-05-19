'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { codingChallenges, userChallengeStats } from '@/data/codingChallenges';
import { ChallengeLanguage, ChallengeSubmission } from '@/types/CodingChallenge';
import Editor from '@monaco-editor/react';
import { notFound, useParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

// Language mapping for Monaco editor
const languageToMonaco: Record<ChallengeLanguage, string> = {
  JavaScript: 'javascript',
  TypeScript: 'typescript',
  Python: 'python',
  Java: 'java',
  'C++': 'cpp',
  Go: 'go',
  Rust: 'rust',
  SQL: 'sql',
};

const getRandomExecutionTime = (): number => {
  return Math.floor(Math.random() * 100) + 50; // 50ms-150ms
};

const getRandomMemoryUsage = (): number => {
  return Math.floor(Math.random() * 50000) + 30000; // 30MB-80MB
};

export default function ChallengePage() {
  const params = useParams();
  const challengeId = params.id as string;
  
  // Find the challenge by id
  const challenge = codingChallenges.find(c => c.id === challengeId);
  
  // If challenge not found, return 404
  if (!challenge) {
    notFound();
  }
  
  const [code, setCode] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<ChallengeLanguage>(challenge?.defaultLanguage || 'JavaScript');
  const [theme, setTheme] = useState('vs-dark');
  const [fontSize, setFontSize] = useState(14);
  const [testResults, setTestResults] = useState<
    { passed: boolean; output: string; time: number; memory: number }[]
  >([]);
  const [isRunning, setIsRunning] = useState(false);
  const [submissionHistory, setSubmissionHistory] = useState<ChallengeSubmission[]>([]);
  const [, setCurrentTab] = useState('code');
  const [customTestInput, setCustomTestInput] = useState('');
  const [customTestOutput, setCustomTestOutput] = useState('');
  const [showVisualization, setShowVisualization] = useState(false);
  const visualizationRef = useRef<HTMLDivElement>(null);

  // Get user's submission history
  useEffect(() => {
    // Fetch user's submissions for this challenge
    // For demo, just use the sample submissions
    setSubmissionHistory(
      userChallengeStats.submissions.filter((s) => s.challengeId === challengeId)
    );

    // Set initial language
    if (challenge?.defaultLanguage) {
      setSelectedLanguage(challenge.defaultLanguage);
      setCode(challenge.startCode[challenge.defaultLanguage] || '');
    }
  }, [challengeId, challenge]);

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setCode(value);
    }
  };

  const handleRunTests = () => {
    if (!challenge || !code.trim()) return;

    setIsRunning(true);
    setTestResults([]);

    // Simulate test running
    setTimeout(() => {
      const results = challenge.testCases.map((tc) => {
        const passed = Math.random() > 0.3; // 70% pass rate
        return {
          passed,
          output: passed ? tc.output : `Expected: ${tc.output}, Got: Error or wrong output`,
          time: getRandomExecutionTime(),
          memory: getRandomMemoryUsage(),
        };
      });

      setTestResults(results);
      setIsRunning(false);
    }, 1500);
  };

  const handleRunCustomTest = () => {
    if (!customTestInput.trim()) return;

    setIsRunning(true);
    setCustomTestOutput('');

    // Simulate custom test
    setTimeout(() => {
      const passed = Math.random() > 0.3;
      setCustomTestOutput(
        passed
          ? `✅ Test passed! Output: ${customTestInput.split(',').map(Number).sort().join(',')}`
          : `❌ Test failed! Expected output different than actual output.`
      );

      setIsRunning(false);
    }, 1000);
  };

  const handleSubmitSolution = () => {
    if (!challenge || !code.trim()) return;

    setIsRunning(true);

    // Simulate submission
    setTimeout(() => {
      const passedTests = Math.floor(Math.random() * (challenge.testCases.length + 1));
      const status =
        passedTests === challenge.testCases.length
          ? 'Accepted'
          : passedTests > challenge.testCases.length / 2
          ? 'Wrong Answer'
          : 'Runtime Error';

      const newSubmission: ChallengeSubmission = {
        id: `submission-${Date.now()}`,
        userId: 'current-user',
        challengeId: challenge.id,
        code,
        language: selectedLanguage,
        status: status as
          | 'Accepted'
          | 'Wrong Answer'
          | 'Runtime Error'
          | 'Time Limit Exceeded'
          | 'Compilation Error',
        runtime: getRandomExecutionTime(),
        memory: getRandomMemoryUsage(),
        score: status === 'Accepted' ? challenge.points : 0,
        submittedAt: new Date().toISOString(),
        passedTestCases: passedTests,
        totalTestCases: challenge.testCases.length,
      };

      setSubmissionHistory([newSubmission, ...submissionHistory]);
      setIsRunning(false);
    }, 2000);
  };

  const resetCode = () => {
    if (challenge && selectedLanguage) {
      setCode(challenge.startCode[selectedLanguage] || '');
    }
  };

  const toggleVisualization = () => {
    setShowVisualization(!showVisualization);
    // In a real app, this would initialize a visualization based on the algorithm
  };

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>
              {challenge.title} – {challenge.difficulty}
            </span>
            <div className="flex gap-2">
              <Badge variant="outline">{challenge.points} points</Badge>
              <Badge variant="outline">{challenge.timeLimit} min</Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-2 text-gray-600 whitespace-pre-line">
            {challenge.description}
          </div>
          <div className="flex gap-2 flex-wrap mb-2">
            {challenge.categories.map((cat) => (
              <Badge key={cat} variant="secondary">
                {cat}
              </Badge>
            ))}
            {challenge.supportedLanguages.map((l) => (
              <Badge key={l} variant="default">
                {l}
              </Badge>
            ))}
          </div>

          <Tabs defaultValue="code" className="mb-4" onValueChange={setCurrentTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="code">Code</TabsTrigger>
              <TabsTrigger value="testcases">Test Cases</TabsTrigger>
              <TabsTrigger value="custom">Custom Test</TabsTrigger>
              <TabsTrigger value="submissions">Submissions</TabsTrigger>
              <TabsTrigger value="hints">Hints</TabsTrigger>
            </TabsList>

            <TabsContent value="code">
              <div className="mb-4 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <select
                    className="border rounded px-2 py-1"
                    value={selectedLanguage}
                    onChange={(e) => {
                      const newLang = e.target.value as ChallengeLanguage;
                      setSelectedLanguage(newLang);
                      if (challenge.startCode[newLang]) {
                        setCode(challenge.startCode[newLang]);
                      }
                    }}
                  >
                    {challenge.supportedLanguages.map((l) => (
                      <option key={l} value={l}>
                        {l}
                      </option>
                    ))}
                  </select>

                  <select
                    className="border rounded px-2 py-1"
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                  >
                    <option value="vs-dark">Dark</option>
                    <option value="light">Light</option>
                  </select>

                  <select
                    className="border rounded px-2 py-1"
                    value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                  >
                    {[12, 14, 16, 18, 20].map((size) => (
                      <option key={size} value={size}>
                        {size}px
                      </option>
                    ))}
                  </select>
                </div>

                <Button variant="outline" onClick={resetCode}>
                  Reset Code
                </Button>
              </div>

              <div className="border rounded min-h-[400px] mb-4">
                <Editor
                  height="400px"
                  language={languageToMonaco[selectedLanguage]}
                  value={code}
                  theme={theme}
                  onChange={handleEditorChange}
                  options={{
                    fontSize: fontSize,
                    minimap: { enabled: true },
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                  }}
                />
              </div>

              <div className="flex gap-3">
                <Button
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
                  onClick={handleRunTests}
                  disabled={isRunning}
                >
                  {isRunning ? 'Running Tests...' : 'Run All Tests'}
                </Button>

                <Button
                  className="bg-gradient-to-r from-pink-500 to-purple-500 text-white"
                  onClick={handleSubmitSolution}
                  disabled={isRunning}
                >
                  {isRunning ? 'Submitting...' : 'Submit Solution'}
                </Button>

                <Button variant="outline" onClick={toggleVisualization} className="ml-auto">
                  {showVisualization ? 'Hide Visualization' : 'Visualize Algorithm'}
                </Button>
              </div>

              {showVisualization && (
                <div
                  className="mt-4 p-4 border rounded bg-slate-50 min-h-[200px]"
                  ref={visualizationRef}
                >
                  <p className="text-center text-gray-500">
                    Visualization placeholder - would show algorithm steps in real app
                  </p>
                  <div className="flex justify-center gap-8 mt-4">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <div
                        key={n}
                        className="w-12 h-12 flex items-center justify-center border-2 border-blue-500 rounded bg-white"
                      >
                        {n}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {testResults.length > 0 && (
                <div className="mt-4">
                  <h3 className="font-bold mb-2">Test Results:</h3>
                  <div className="space-y-2">
                    {testResults.map((result, idx) => (
                      <div
                        key={idx}
                        className={`p-3 rounded ${
                          result.passed ? 'bg-green-100' : 'bg-red-100'
                        }`}
                      >
                        <div className="flex justify-between">
                          <span className="font-medium">Test Case {idx + 1}:</span>
                          <span>{result.passed ? '✅ Passed' : '❌ Failed'}</span>
                        </div>
                        <div className="text-sm mt-1">{result.output}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          Runtime: {result.time}ms | Memory: {(result.memory / 1024).toFixed(1)}MB
                        </div>
                      </div>
                    ))}

                    <div
                      className={`p-3 rounded font-medium ${
                        testResults.every((r) => r.passed) ? 'bg-green-200' : 'bg-red-200'
                      }`}
                    >
                      Summary: {testResults.filter((r) => r.passed).length}/{testResults.length} tests passed
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="testcases">
              <div className="space-y-4">
                {challenge.testCases.map((tc, i) => (
                  <div key={i} className="border rounded p-4 bg-gray-50">
                    <h3 className="font-bold mb-2">Test Case {i + 1}</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm font-medium mb-1">Input:</div>
                        <div className="bg-gray-100 p-2 rounded font-mono text-sm">
                          {tc.input}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-medium mb-1">Expected Output:</div>
                        <div className="bg-gray-100 p-2 rounded font-mono text-sm">
                          {tc.output}
                        </div>
                      </div>
                    </div>
                    {tc.isHidden && (
                      <Badge className="mt-2 bg-yellow-100 text-yellow-800">
                        Hidden Test Case
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="custom">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="font-medium block mb-2">Custom Input</label>
                  <Textarea
                    className="font-mono h-40"
                    placeholder="Enter your test input here..."
                    value={customTestInput}
                    onChange={(e) => setCustomTestInput(e.target.value)}
                  />
                </div>

                <div>
                  <label className="font-medium block mb-2">Output</label>
                  <div className="font-mono h-40 bg-gray-50 border rounded p-2 overflow-auto">
                    {customTestOutput || 'Output will appear here after running the test'}
                  </div>
                </div>
              </div>

              <Button
                className="mt-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
                onClick={handleRunCustomTest}
                disabled={isRunning || !customTestInput.trim()}
              >
                {isRunning ? 'Running...' : 'Run Custom Test'}
              </Button>
            </TabsContent>

            <TabsContent value="submissions">
              {submissionHistory.length > 0 ? (
                <div className="space-y-4">
                  {submissionHistory.map((submission) => (
                    <div key={submission.id} className="border rounded p-4">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className={
                              submission.status === 'Accepted'
                                ? 'bg-green-100 text-green-800 border-green-300'
                                : 'bg-red-100 text-red-800 border-red-300'
                            }
                          >
                            {submission.status}
                          </Badge>
                          <span className="text-sm text-gray-500">
                            {new Date(submission.submittedAt).toLocaleString()}
                          </span>
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">{submission.score}</span> points |{' '}
                          <span className="font-medium">{submission.language}</span>
                        </div>
                      </div>

                      <div className="text-sm grid grid-cols-3 gap-4 mt-2">
                        <div>
                          <span className="text-gray-500">Runtime:</span>{' '}
                          <span className="font-medium">{submission.runtime} ms</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Memory:</span>{' '}
                          <span className="font-medium">
                            {(submission.memory / 1024).toFixed(1)} MB
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Tests Passed:</span>{' '}
                          <span className="font-medium">
                            {submission.passedTestCases}/{submission.totalTestCases}
                          </span>
                        </div>
                      </div>

                      <div className="mt-2 text-sm">
                        <span
                          className={`${
                            submission.status === 'Accepted' ? 'text-green-600' : 'text-red-600'
                          }`}
                        >
                          {submission.status === 'Accepted'
                            ? '🎉 Great job! Your solution was accepted.'
                            : '❌ Something went wrong with your solution.'}
                        </span>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onClick={() => {
                          setCode(submission.code);
                          setSelectedLanguage(submission.language);
                          setCurrentTab('code');
                        }}
                      >
                        Load this solution
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <Alert>
                  <AlertDescription>
                    You haven&apos;t submitted any solutions for this challenge yet.
                  </AlertDescription>
                </Alert>
              )}
            </TabsContent>

            <TabsContent value="hints">
              <div className="space-y-4">
                {challenge.hints.map((hint, i) => (
                  <Alert key={i}>
                    <AlertDescription>
                      <strong>Hint {i + 1}:</strong> {hint}
                    </AlertDescription>
                  </Alert>
                ))}
                {challenge.hints.length === 0 && (
                  <Alert>
                    <AlertDescription>
                      No hints available for this challenge. You&apos;re on your own, genius! 🧠
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
