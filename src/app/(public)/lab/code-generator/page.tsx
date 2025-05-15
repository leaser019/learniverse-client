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
  IconBrandTypescript,
  IconCheck,
  IconCode,
  IconCopy,
  IconFileCode,
  IconLoader2,
  IconRefresh,
  IconTerminal
} from "@tabler/icons-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const CodeGenerator = () => {
  const [userInput, setUserInput] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userInput.trim()) return;

    setIsLoading(true);

    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Generate code in ${language} based on the following requirements in JSON format with fields: analysis (string explaining the approach), code (string with the full code), explanation (string with detailed walkthrough), optimizations (array of strings with potential improvements): ${userInput}`,
          model: 'gemini-2.0-flash',
          systemPrompt: `You are a professional software developer with years of experience. Always respond in valid JSON format. ${DEFAULT_SYSTEM_PROMPT}`,
        }),
      });

      const data = await response.json();
      console.log('Generated code:', data);

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
          console.log('Parsed JSON data:', jsonData);
          setResult(jsonData);
        } catch (parseError) {
          console.error('Error parsing response:', parseError);
        }
      } else {
        console.error('Error generating code:', data.error);
      }
    } catch (error) {
      console.error('Error:', error);
      setResult(null);
      setError('An error occurred while generating code. Please try again later.');
    
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">AI Code Generator</h1>
        </div>
        <p className="text-muted-foreground mb-8 pl-1">
          Describe what you want to build and get production-ready code instantly.
        </p>

        <Card className="mb-8 border-0 shadow-md hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-xl text-purple-700 dark:text-purple-300">Tell us what to build</CardTitle>
            <CardDescription>
              The more detailed your description, the better the code. Include features, requirements, and any specific libraries or frameworks.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Textarea
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Example: Create a React hook that handles infinite scrolling for a list of items. It should fetch new data when the user scrolls to the bottom, handle loading states, and support error handling..."
                className="min-h-40 mb-4 border-purple-200 focus:border-purple-400 dark:border-purple-900"
              />
              
              <div className="flex items-center space-x-4">
                <div className="w-40">
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger>
                      <SelectValue placeholder="Language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="javascript">JavaScript</SelectItem>
                      <SelectItem value="typescript">TypeScript</SelectItem>
                      <SelectItem value="python">Python</SelectItem>
                      <SelectItem value="java">Java</SelectItem>
                      <SelectItem value="csharp">C#</SelectItem>
                      <SelectItem value="php">PHP</SelectItem>
                      <SelectItem value="go">Go</SelectItem>
                      <SelectItem value="rust">Rust</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button 
                  type="submit" 
                  className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 transition-all duration-300" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      Generate Code
                      <IconArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {isLoading && (
          <Card className="w-full animate-pulse border-0 shadow-md mb-8">
            <CardHeader className="pb-3">
              <div className="h-6 bg-secondary rounded w-2/3 mb-2"></div>
              <div className="h-4 bg-secondary rounded w-full"></div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="h-80 bg-secondary rounded w-full"></div>
              <div className="h-4 bg-secondary rounded w-3/4"></div>
              <div className="h-4 bg-secondary rounded w-1/2"></div>
            </CardContent>
          </Card>
        )}

        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="mb-8 border-0 shadow-md bg-gradient-to-br from-white to-purple-50 dark:from-slate-900 dark:to-purple-950/20">
              <CardHeader>
                <CardTitle className="text-xl text-purple-700 dark:text-purple-300 flex items-center">
                  <IconFileCode className="mr-2 text-purple-600" size={20} />
                  Generated Code
                </CardTitle>
                <CardDescription>{result.analysis}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Tabs defaultValue="code" className="w-full">
                  <TabsList className="mb-4">
                    <TabsTrigger value="code" className="flex items-center">
                      <IconCode className="mr-1 h-4 w-4" />
                      Code
                    </TabsTrigger>
                    <TabsTrigger value="explanation" className="flex items-center">
                      <IconTerminal className="mr-1 h-4 w-4" />
                      Explanation
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="code" className="relative mt-0">
                    <div className="absolute top-2 right-2 z-10 flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="h-8 px-2 text-muted-foreground hover:bg-purple-100 dark:hover:bg-purple-900/20"
                        onClick={() => copyToClipboard(result.code)}
                      >
                        {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
                        <span className="ml-1.5">{copied ? 'Copied!' : 'Copy'}</span>
                      </Button>
                      <Select value={language} onValueChange={setLanguage}>
                        <SelectTrigger className="h-8 w-[130px] bg-transparent border-none">
                          <IconBrandTypescript className="mr-1.5 h-4 w-4" />
                          <SelectValue placeholder="Language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="javascript">JavaScript</SelectItem>
                          <SelectItem value="typescript">TypeScript</SelectItem>
                          <SelectItem value="python">Python</SelectItem>
                          <SelectItem value="java">Java</SelectItem>
                          <SelectItem value="csharp">C#</SelectItem>
                          <SelectItem value="php">PHP</SelectItem>
                          <SelectItem value="go">Go</SelectItem>
                          <SelectItem value="rust">Rust</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 px-2 text-muted-foreground hover:bg-purple-100 dark:hover:bg-purple-900/20"
                        onClick={handleSubmit}
                      >
                        <IconRefresh size={16} />
                        <span className="ml-1.5">Regenerate</span>
                      </Button>
                    </div>
                    <SyntaxHighlighter
                      language={language}
                      style={atomDark}
                      className="rounded-md !mt-0 min-h-[300px]"
                      showLineNumbers
                    >
                      {result.code}
                    </SyntaxHighlighter>
                  </TabsContent>
                  
                  <TabsContent value="explanation" className="mt-0">
                    <Card className="border shadow-sm">
                      <CardContent className="pt-6">
                        <div className="prose prose-purple dark:prose-invert max-w-none">
                          {result.explanation.split('\n').map((paragraph, i) => (
                            <p key={i}>{paragraph}</p>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
                
                <div>
                  <h3 className="font-medium text-lg mb-3 text-purple-700 dark:text-purple-300">
                    Potential Optimizations
                  </h3>
                  <ul className="space-y-2">
                    {result.optimizations.map((optimization, index) => (
                      <motion.li 
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start"
                      >
                        <Badge variant="outline" className="mt-0.5 mr-2 bg-purple-50/50 dark:bg-purple-900/20">
                          {index + 1}
                        </Badge>
                        <span>{optimization}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default CodeGenerator