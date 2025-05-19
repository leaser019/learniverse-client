'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { DEFAULT_SYSTEM_PROMPT } from '@/lib/prompts';
import { cn } from '@/lib/utils';
import {
  IconArrowRight,
  IconBook,
  IconBulb,
  IconChartBar,
  IconLoader2,
  IconSearch,
  IconStars,
} from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

const ResearchHelper = () => {
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userInput.trim()) return;

    setIsLoading(true);

    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Analyze the following research topic and provide suggestions in JSON format with fields: analysis (string), keyQuestions (array of strings), and 6 resources (array of objects with title, relevance (number), description, keywords (array), methodology, difficulty): ${userInput}`,
          model: 'gemini-2.0-flash',
          systemPrompt: `You are a professional research advisor with years of experience in academic research. Always respond in valid JSON format. ${DEFAULT_SYSTEM_PROMPT}`,
        }),
      });

      const data = await response.json();
      console.log('Research recommendations:', data);

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
        console.error('Error fetching research recommendations:', data.error);
      }
    } catch (error) {
      console.error('Error:', error);
      setResult(null);
      setError(
        'An error occurred while fetching research recommendations. Please try again later.'
      );
    } finally {
      setIsLoading(false);
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
          <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-full mr-3">
            <IconBook className="text-emerald-600 dark:text-emerald-400" size={32} />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            AI Research Helper
          </h1>
        </div>
        <p className="text-muted-foreground mb-8 pl-1">
          Describe your research topic to get suggestions, resources, and methodological guidance.
        </p>

        <Card className="mb-8 border-0 shadow-md hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-xl text-emerald-700 dark:text-emerald-300">
              Describe your research
            </CardTitle>
            <CardDescription>
              The more detailed your description, the more accurate the suggestions. Mention: field,
              topic, research questions, audience, timeframe, existing resources...
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <Textarea
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Example: I'm researching the effects of social media on teenage mental health. I'm particularly interested in Instagram and TikTok usage patterns. This is for my undergraduate psychology thesis, and I have 6 months to complete it..."
                className="min-h-40 mb-4 border-emerald-200 focus:border-emerald-400 dark:border-emerald-900"
              />
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 transition-all duration-300"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    Get Research Suggestions
                    <IconArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {isLoading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10"
          >
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="w-full h-[300px] animate-pulse border-0 shadow-md">
                <CardHeader className="pb-3">
                  <div className="h-6 bg-secondary rounded w-2/3 mb-2"></div>
                  <div className="h-4 bg-secondary rounded w-full"></div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="h-4 bg-secondary rounded w-full"></div>
                  <div className="h-4 bg-secondary rounded w-3/4"></div>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        ) : null}

        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, staggerChildren: 0.1 }}
          >
            <Card className="mb-6 border-0 shadow-md bg-gradient-to-br from-white to-emerald-50 dark:from-slate-900 dark:to-emerald-950/20">
              <CardHeader>
                <CardTitle className="text-xl text-emerald-700 dark:text-emerald-300 flex items-center">
                  <IconChartBar className="mr-2 text-emerald-600" size={20} />
                  Research Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg mb-6">{result.analysis}</p>

                <h3 className="font-medium text-lg mb-3 text-emerald-700 dark:text-emerald-300 flex items-center">
                  <IconBulb className="mr-2 text-emerald-600" size={18} />
                  Key Research Questions:
                </h3>
                <ul className="list-disc pl-5 mb-6 space-y-2">
                  {result.keyQuestions.map((question, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      {question}
                    </motion.li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <div className="flex items-center mb-4">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Recommended Resources
              </h2>
              <div className="h-[1px] flex-grow bg-gradient-to-r from-emerald-200 to-transparent ml-4"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {result.resources.map((resource, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ResourceCard resource={resource} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

const ResourceCard = ({ resource }) => {
  const bgGradient = getRelevanceGradient(resource.relevance);

  return (
    <Card className="group overflow-hidden border-0 shadow-md hover:shadow-lg transition-all duration-300 h-full">
      <div className={cn('h-1.5 w-full', bgGradient)} />
      <CardHeader className="pb-2 relative">
        <div className="absolute -right-12 -top-12 w-32 h-32 rounded-full bg-emerald-100/30 dark:bg-emerald-900/20 blur-xl group-hover:bg-emerald-100/50 dark:group-hover:bg-emerald-900/30 transition-all duration-300"></div>

        <div className="flex justify-between items-center mb-2 relative">
          <CardTitle className="text-xl group-hover:text-emerald-600 transition-colors duration-300">
            {resource.title}
          </CardTitle>
          <div className="relative">
            <div className="size-12 flex-none rounded-full overflow-hidden relative">
              <div className={cn('h-full w-full absolute', bgGradient)} />
              <div className="absolute inset-0 flex items-center justify-center text-white font-bold">
                {resource.relevance}%
              </div>
            </div>
          </div>
        </div>
        <CardDescription className="line-clamp-2 relative">{resource.description}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 relative pt-2">
        <div>
          <div className="flex items-center mb-2">
            <IconSearch size={16} className="text-emerald-600 mr-2" />
            <h4 className="font-medium text-sm text-emerald-700 dark:text-emerald-300">Keywords</h4>
          </div>
          <div className="flex flex-wrap gap-1.5 mb-1">
            {resource.keywords.map((keyword, i) => (
              <Badge
                key={i}
                variant="outline"
                className="bg-emerald-50/50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors text-xs font-normal"
              >
                {keyword}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex gap-6">
          <div className="flex-1">
            <div className="flex items-center mb-1.5">
              <IconStars size={16} className="text-emerald-600 mr-2" />
              <h4 className="font-medium text-sm text-emerald-700 dark:text-emerald-300">
                Methodology
              </h4>
            </div>
            <p className="text-sm text-muted-foreground">{resource.methodology}</p>
          </div>

          <div className="flex-1">
            <div className="flex items-center mb-1.5">
              <IconBulb size={16} className="text-emerald-600 mr-2" />
              <h4 className="font-medium text-sm text-emerald-700 dark:text-emerald-300">
                Difficulty
              </h4>
            </div>
            <p className="text-sm text-muted-foreground">{resource.difficulty}</p>
          </div>
        </div>

        <div>
          <h4 className="text-xs text-muted-foreground mb-1">Relevance</h4>
          <Progress
            value={resource.relevance}
            className="h-1.5"
            style={
              {
                '--progress-background': getProgressColor(resource.relevance),
              } as React.CSSProperties
            }
          />
        </div>
      </CardContent>
    </Card>
  );
};

function getRelevanceGradient(relevance) {
  if (relevance >= 90) return 'bg-gradient-to-r from-emerald-500 to-green-500';
  if (relevance >= 80) return 'bg-gradient-to-r from-teal-500 to-emerald-500';
  if (relevance >= 70) return 'bg-gradient-to-r from-cyan-500 to-teal-500';
  if (relevance >= 60) return 'bg-gradient-to-r from-amber-500 to-yellow-500';
  return 'bg-gradient-to-r from-orange-500 to-amber-500';
}

function getProgressColor(relevance) {
  if (relevance >= 90) return 'rgb(16, 185, 129)';
  if (relevance >= 80) return 'rgb(20, 184, 166)';
  if (relevance >= 70) return 'rgb(6, 182, 212)';
  if (relevance >= 60) return 'rgb(245, 158, 11)';
  return 'rgb(249, 115, 22)';
}

export default ResearchHelper;
