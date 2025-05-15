"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { DEFAULT_SYSTEM_PROMPT } from "@/lib/prompts";
import {
  IconArrowRight,
  IconBrandJavascript,
  IconBrandPython,
  IconBrandTypescript,
  IconCode,
  IconFile,
  IconLoader2,
  IconTool
} from "@tabler/icons-react";
import { motion } from "framer-motion";
import { useState } from "react";

export default function CodeExplainer() {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [explainLevel, setExplainLevel] = useState("intermediate");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!code.trim()) return;

    setIsLoading(true);

    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Explain this ${language} code in clear, step-by-step sections. Return JSON with: explanation (overall summary), complexity (string), bestPractices (array), refactoredCode (string, improved version), breakdown (array of {line: number, explanation: string}), securityIssues (array, if any): ${code}`,
          model: 'gemini-2.0-flash',
          systemPrompt: `You are an expert coding instructor specializing in ${language}. Always respond in valid JSON format. ${DEFAULT_SYSTEM_PROMPT}`,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        try {
          let jsonData;
          if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
            const textContent = data.candidates[0].content.parts[0].text;
            const jsonMatch = textContent.match(/```json\n([\s\S]*)\n```/);
            if (jsonMatch && jsonMatch[1]) {
              jsonData = JSON.parse(jsonMatch[1]);
            } else {
              jsonData = JSON.parse(textContent);
            }
          } else {
            jsonData = data.text ? JSON.parse(data.text) : data;
          }
          setResult(jsonData);
        } catch (parseError) {
          console.error('Error parsing response:', parseError);
        }
      } else {
        console.error('Error fetching code explanation:', data.error);
      }
    } catch (error) {
      console.error('Error:', error);
      setResult(null);
      setError('An error occurred while generating code explanation. Please try again later.');
    
    } finally {
      setIsLoading(false);
    }
  };

  const renderLanguageIcon = () => {
    switch(language) {
      case 'javascript': return <IconBrandJavascript className="text-yellow-400" />;
      case 'typescript': return <IconBrandTypescript className="text-blue-500" />;
      case 'python': return <IconBrandPython className="text-green-500" />;
      default: return <IconCode />;
    }
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center mb-2">
          <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-full mr-3">
            <IconCode className="text-purple-600 dark:text-purple-400" size={32} />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">AI Code Explainer</h1>
        </div>
        <p className="text-muted-foreground mb-8 pl-1">
          Paste your code and receive a detailed, easy-to-understand explanation.
        </p>

        <Card className="mb-8 border-0 shadow-md hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-xl text-purple-700 dark:text-purple-300">Submit your code</CardTitle>
            <CardDescription>
              Provide the code you'd like explained, select the language and your expertise level.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex gap-4 mb-4">
                <div className="w-1/2">
                  <label className="text-sm font-medium mb-1 block">Programming Language</label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger className="border-purple-200 focus:border-purple-400 dark:border-purple-900">
                      <SelectValue placeholder="Select Language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="javascript">JavaScript</SelectItem>
                      <SelectItem value="typescript">TypeScript</SelectItem>
                      <SelectItem value="python">Python</SelectItem>
                      <SelectItem value="java">Java</SelectItem>
                      <SelectItem value="csharp">C#</SelectItem>
                      <SelectItem value="cpp">C++</SelectItem>
                      <SelectItem value="go">Go</SelectItem>
                      <SelectItem value="rust">Rust</SelectItem>
                      <SelectItem value="php">PHP</SelectItem>
                      <SelectItem value="ruby">Ruby</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-1/2">
                  <label className="text-sm font-medium mb-1 block">Explanation Level</label>
                  <Select value={explainLevel} onValueChange={setExplainLevel}>
                    <SelectTrigger className="border-purple-200 focus:border-purple-400 dark:border-purple-900">
                      <SelectValue placeholder="Select Level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner (Very detailed)</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced (Concise)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="// Paste your code here"
                className="min-h-[300px] font-mono text-sm border-purple-200 focus:border-purple-400 dark:border-purple-900"
              />
              
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 transition-all duration-300" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing Code...
                  </>
                ) : (
                  <>
                    Explain This Code
                    <IconArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6 mb-10"
          >
            <Card className="w-full animate-pulse border-0 shadow-md">
              <CardHeader className="pb-3">
                <div className="h-6 bg-secondary rounded w-2/3 mb-2"></div>
                <div className="h-4 bg-secondary rounded w-full"></div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="h-4 bg-secondary rounded w-full"></div>
                <div className="h-4 bg-secondary rounded w-3/4"></div>
                <div className="h-4 bg-secondary rounded w-5/6"></div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2].map((i) => (
                <Card key={i} className="w-full h-[200px] animate-pulse border-0 shadow-md">
                  <CardHeader className="pb-3">
                    <div className="h-5 bg-secondary rounded w-1/2 mb-2"></div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="h-4 bg-secondary rounded w-full"></div>
                    <div className="h-4 bg-secondary rounded w-2/3"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        )}

        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <Card className="border-0 shadow-md bg-gradient-to-br from-white to-purple-50 dark:from-slate-900 dark:to-purple-950/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl text-purple-700 dark:text-purple-300 flex items-center">
                    {renderLanguageIcon()}
                    <span className="ml-2">Code Explanation</span>
                  </CardTitle>
                  <Badge variant="outline" className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300">
                    {result.complexity || "Intermediate"}
                  </Badge>
                </div>
                <CardDescription>{code.split('\n').length} lines of {language}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-lg mb-6">{result.explanation}</p>
              </CardContent>
            </Card>

            <Tabs defaultValue="breakdown" className="w-full">
              <TabsList className="grid grid-cols-3 mb-6">
                <TabsTrigger value="breakdown" className="data-[state=active]:bg-purple-100 dark:data-[state=active]:bg-purple-900/30 data-[state=active]:text-purple-800 dark:data-[state=active]:text-purple-300">
                  <IconFile className="mr-2 h-4 w-4" />
                  Line-by-Line
                </TabsTrigger>
                <TabsTrigger value="bestPractices" className="data-[state=active]:bg-purple-100 dark:data-[state=active]:bg-purple-900/30 data-[state=active]:text-purple-800 dark:data-[state=active]:text-purple-300">
                  <IconTool className="mr-2 h-4 w-4" />
                  Best Practices
                </TabsTrigger>
                <TabsTrigger value="refactored" className="data-[state=active]:bg-purple-100 dark:data-[state=active]:bg-purple-900/30 data-[state=active]:text-purple-800 dark:data-[state=active]:text-purple-300">
                  <IconCode className="mr-2 h-4 w-4" />
                  Refactored Version
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="breakdown" className="space-y-4 mt-0">
                {result.breakdown && result.breakdown.map((item, index) => (
                  <Card key={index} className="border-0 shadow-sm hover:shadow transition-all duration-300">
                    <CardHeader className="py-3">
                      <CardTitle className="text-sm font-mono bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 p-2 rounded">
                        Line {item.line}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="py-2">
                      <p>{item.explanation}</p>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
              
              <TabsContent value="bestPractices" className="mt-0">
                <Card className="border-0 shadow-md">
                  <CardHeader>
                    <CardTitle className="text-lg text-purple-700 dark:text-purple-300">
                      Recommendations & Best Practices
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {result.bestPractices && result.bestPractices.map((practice, index) => (
                        <motion.li 
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-start"
                        >
                          <div className="flex-shrink-0 p-1 bg-purple-100 dark:bg-purple-900/30 rounded-full mr-3 mt-0.5">
                            <IconTool className="h-4 w-4 text-purple-600" />
                          </div>
                          <p>{practice}</p>
                        </motion.li>
                      ))}
                      
                      {result.securityIssues && result.securityIssues.length > 0 && (
                        <div className="mt-6 pt-6 border-t">
                          <h3 className="font-medium text-lg mb-3 text-red-600 dark:text-red-400">Security Concerns:</h3>
                          <ul className="space-y-2">
                            {result.securityIssues.map((issue, index) => (
                              <li key={index} className="flex items-start">
                                <div className="flex-shrink-0 p-1 bg-red-100 dark:bg-red-900/30 rounded-full mr-3 mt-0.5">
                                  <IconTool className="h-4 w-4 text-red-600" />
                                </div>
                                <p>{issue}</p>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="refactored" className="mt-0">
                <Card className="border-0 shadow-md">
                  <CardHeader>
                    <CardTitle className="text-lg text-purple-700 dark:text-purple-300">
                      Improved Code Version
                    </CardTitle>
                    <CardDescription>
                      Refactored for better readability, performance, and maintainability
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <pre className="bg-slate-950 text-slate-50 p-4 rounded-md overflow-x-auto font-mono text-sm">
                      {result.refactoredCode}
                    </pre>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        )}

        {error && (
          <Card className="border-red-200 dark:border-red-900 mt-4">
            <CardContent className="pt-6">
              <p className="text-red-600 dark:text-red-400">{error}</p>
            </CardContent>
          </Card>
        )}
      </motion.div>
    </div>
  );
}