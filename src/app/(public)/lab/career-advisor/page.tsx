"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { DEFAULT_SYSTEM_PROMPT } from "@/lib/prompts";
import { cn } from "@/lib/utils";
import {
  IconArrowRight,
  IconBriefcase,
  IconChartBar,
  IconCoin,
  IconLoader2,
  IconSettings,
  IconTrendingUp
} from "@tabler/icons-react";
import { motion } from "framer-motion";
import { useState } from "react";

const CareerAdvisor = () => {
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userInput.trim()) return;

    setIsLoading(true);

    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Analyze the following user input and suggest suitable careers in JSON format with fields: analysis (string), nextSteps (array of strings), and 6 careers (array of objects with title, match (number), description, skills (array), prospects, salary): ${userInput}`,
          model: 'gemini-2.0-flash',
          systemPrompt: `You are a professional career advisor with years of experience in Computer Science and Technology. Always respond in valid JSON format. ${DEFAULT_SYSTEM_PROMPT}`,
        }),
      });

      const data = await response.json();
      console.log('Career recommendations:', data);

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
        console.error('Error fetching career recommendations:', data.error);
      }
    } catch (error) {
      console.error('Error:', error);
      setResult(null);
      setError('An error occurred while fetching career recommendations. Please try again later.');
    
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
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full mr-3">
            <IconBriefcase className="text-blue-600 dark:text-blue-400" size={32} />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">AI Career Advisor</h1>
        </div>
        <p className="text-muted-foreground mb-8 pl-1">
          Describe your skills, interests, and experience to get the best career suggestions.
        </p>

        <Card className="mb-8 border-0 shadow-md hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-xl text-blue-700 dark:text-blue-300">Tell us about yourself</CardTitle>
            <CardDescription>
              The more detailed your description, the more accurate the suggestions. Mention:
              skills, interests, experience, strengths/weaknesses, preferred work environment...
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <Textarea
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Example: I have 2 years of experience working with React and JavaScript. I enjoy designing user-friendly UIs and have strong CSS skills. I prefer working in a dynamic startup environment but value work-life balance..."
                className="min-h-40 mb-4 border-blue-200 focus:border-blue-400 dark:border-blue-900"
              />
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    Get Career Suggestions
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
            {[1, 2, 3, 4, 5,  6].map((i) => (
              <Card key={i} className="w-full h-[300px] animate-pulse border-0 shadow-md rounded-xl">
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
            <Card className="mb-6 border-0 shadow-md bg-gradient-to-br from-white to-blue-50 dark:from-slate-900 dark:to-blue-950/20">
              <CardHeader>
                <CardTitle className="text-xl text-blue-700 dark:text-blue-300 flex items-center">
                  <IconChartBar className="mr-2 text-blue-600" size={20} />
                  Career Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg mb-6">{result.analysis}</p>

                <h3 className="font-medium text-lg mb-3 text-blue-700 dark:text-blue-300 flex items-center">
                  <IconTrendingUp className="mr-2 text-blue-600" size={18} />
                  Next Steps:
                </h3>
                <ul className="list-disc pl-5 mb-6 space-y-2">
                  {result.nextSteps.map((step, index) => (
                    <motion.li 
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      {step}
                    </motion.li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <div className="flex items-center mb-4">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Recommended Careers</h2>
              <div className="h-[1px] flex-grow bg-gradient-to-r from-blue-200 to-transparent ml-4"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {result.careers.map((career, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <CareerCard career={career} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

const CareerCard = ({ career }) => {
  const bgGradient = getMatchGradient(career.match);
  
  return (
    <Card className="group overflow-hidden border-0 shadow-md hover:shadow-lg transition-all duration-300 h-full">
      <div className={cn(
        "h-1.5 w-full", 
        bgGradient
      )} />
      <CardHeader className="pb-2 relative">
        <div className="absolute -right-12 -top-12 w-32 h-32 rounded-full bg-blue-100/30 dark:bg-blue-900/20 blur-xl group-hover:bg-blue-100/50 dark:group-hover:bg-blue-900/30 transition-all duration-300"></div>
        
        <div className="flex justify-between items-center mb-2 relative">
          <CardTitle className="text-xl group-hover:text-blue-600 transition-colors duration-300">
            {career.title}
          </CardTitle>
          <div className="relative">
            <div className="size-12 flex-none rounded-full overflow-hidden relative">
              <div className={cn(
                "h-full w-full absolute",
                bgGradient
              )} />
              <div className="absolute inset-0 flex items-center justify-center text-white font-bold">
                {career.match}%
              </div>
            </div>
          </div>
        </div>
        <CardDescription className="line-clamp-2 relative">{career.description}</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4 relative pt-2">
        <div>
          <div className="flex items-center mb-2">
            <IconSettings size={16} className="text-blue-600 mr-2" />
            <h4 className="font-medium text-sm text-blue-700 dark:text-blue-300">Required Skills</h4>
          </div>
          <div className="flex flex-wrap gap-1.5 mb-1">
            {career.skills.map((skill, i) => (
              <Badge key={i} variant="outline" className="bg-blue-50/50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors text-xs font-normal">
                {skill}
              </Badge>
            ))}
          </div>
        </div>
        
        <div className="flex gap-6">
          <div className="flex-1">
            <div className="flex items-center mb-1.5">
              <IconTrendingUp size={16} className="text-blue-600 mr-2" />
              <h4 className="font-medium text-sm text-blue-700 dark:text-blue-300">Prospects</h4>
            </div>
            <p className="text-sm text-muted-foreground">{career.prospects}</p>
          </div>
          
          <div className="flex-1">
            <div className="flex items-center mb-1.5">
              <IconCoin size={16} className="text-blue-600 mr-2" />
              <h4 className="font-medium text-sm text-blue-700 dark:text-blue-300">Salary</h4>
            </div>
            <p className="text-sm text-muted-foreground">{career.salary}</p>
          </div>
        </div>
        
        <div>
          <h4 className="text-xs text-muted-foreground mb-1">Match Strength</h4>
          <Progress value={career.match} className="h-1.5" 
            style={{
              '--progress-background': getProgressColor(career.match)
            } as React.CSSProperties}
          />
        </div>
      </CardContent>
    </Card>
  );
};

function getMatchGradient(match) {
  if (match >= 90) return "bg-gradient-to-r from-emerald-500 to-green-500";
  if (match >= 80) return "bg-gradient-to-r from-blue-500 to-indigo-500";
  if (match >= 70) return "bg-gradient-to-r from-purple-500 to-indigo-500";
  if (match >= 60) return "bg-gradient-to-r from-amber-500 to-yellow-500";
  return "bg-gradient-to-r from-orange-500 to-amber-500";
}

// Helper function to get progress color based on match percentage
function getProgressColor(match) {
  if (match >= 90) return "rgb(16, 185, 129)";
  if (match >= 80) return "rgb(59, 130, 246)";
  if (match >= 70) return "rgb(139, 92, 246)";
  if (match >= 60) return "rgb(245, 158, 11)";
  return "rgb(249, 115, 22)";
}

export default CareerAdvisor;