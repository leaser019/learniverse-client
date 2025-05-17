"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DEFAULT_SYSTEM_PROMPT } from "@/lib/prompts";
import { cn } from "@/lib/utils";
import {
  IconArrowRight,
  IconBriefcase,
  IconCheck,
  IconClock,
  IconLoader2,
  IconMessageCircle,
  IconMicrophone,
  IconQuote,
  IconStar
} from "@tabler/icons-react";
import { motion } from "framer-motion";
import { useState } from "react";

const InterviewPractice = () => {
  const [jobTitle, setJobTitle] = useState("");
  const [experience, setExperience] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [questions, setQuestions] = useState(null);
  const [answers, setAnswers] = useState({});
  const [feedback, setFeedback] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!jobTitle.trim() || !experience.trim()) return;

    setIsLoading(true);
    setQuestions(null);
    setAnswers({});
    setFeedback({});

    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Generate 5 realistic interview questions for a ${jobTitle} position with ${experience} level of experience. Return in JSON format with fields: overview (string), preparationTips (array of strings), and questions (array of objects with id, question, difficulty (Easy/Medium/Hard), category, expectedTopics (array)).`,
          model: 'gemini-2.0-flash',
          systemPrompt: `You are an experienced technical interviewer. Always respond in valid JSON format. ${DEFAULT_SYSTEM_PROMPT}`,
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
          setQuestions(jsonData);
        } catch (parseError) {
          console.error('Error parsing response:', parseError);
        }
      } else {
        console.error('Error fetching interview questions:', data.error);
      }
    } catch (error) {
      console.error('Error:', error);
      setQuestions(null);
      setError('An error occurred while fetching interview questions. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerChange = (questionId, answer) => {
    setAnswers({
      ...answers,
      [questionId]: answer
    });
  };

  const handleSubmitAnswer = async (questionId) => {
    if (!answers[questionId]?.trim()) return;

    setIsLoading(true);
    
    try {
      const question = questions.questions.find(q => q.id === questionId);
      
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Evaluate this answer to the interview question "${question.question}" for a ${jobTitle} position. Return in JSON format with fields: score (number out of 10), strengths (array), improvements (array), missingPoints (array), overallFeedback (string) if user write the thing not in the answer mark score 0, missingPoints (array), overallFeedback (string) is wrong answers.`,
          model: 'gemini-2.0-flash',
          systemPrompt: `You are an expert interviewer for tech positions. The candidate's answer: "${answers[questionId]}". Always respond in valid JSON format. ${DEFAULT_SYSTEM_PROMPT}`,
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
          
          setFeedback({
            ...feedback,
            [questionId]: jsonData
          });
          
          setCurrentQuestion(null);
        } catch (parseError) {
          console.error('Error parsing feedback response:', parseError);
        }
      }
    } catch (error) {
      console.error('Error getting feedback:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const startQuestion = (questionId) => {
    setCurrentQuestion(questionId);
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
            <IconMicrophone className="text-purple-600 dark:text-purple-400" size={32} />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            AI Interview Practice
          </h1>
        </div>
        <p className="text-muted-foreground mb-8 pl-1">
          Generate realistic interview questions and get instant feedback on your answers.
        </p>

        <Card className="mb-8 border-0 shadow-md hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-xl text-purple-700 dark:text-purple-300">
              What job are you interviewing for?
            </CardTitle>
            <CardDescription>
              Enter the position title and your experience level to get tailored interview
              questions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Job Title</label>
                <Input
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g., Frontend Developer, Data Scientist, Product Manager"
                  className="border-purple-200 focus:border-purple-400 dark:border-purple-900"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Experience Level</label>
                <Input
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  placeholder="e.g., Entry-level, 3 years, Senior"
                  className="border-purple-200 focus:border-purple-400 dark:border-purple-900"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 transition-all duration-300"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Questions...
                  </>
                ) : (
                  <>
                    Generate Interview Questions
                    <IconArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {isLoading && !questions ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 mb-10">
            {[1, 2, 3, 4, 5].map((i) => (
              <Card key={i} className="w-full h-[150px] animate-pulse border-0 shadow-md">
                <CardHeader className="pb-3">
                  <div className="h-6 bg-secondary rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-secondary rounded w-1/3"></div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="h-4 bg-secondary rounded w-full"></div>
                  <div className="h-4 bg-secondary rounded w-3/4"></div>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        ) : null}

        {questions && !currentQuestion && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="mb-6 border-0 shadow-md bg-gradient-to-br from-white to-purple-50 dark:from-slate-900 dark:to-purple-950/20">
              <CardHeader>
                <CardTitle className="text-xl text-purple-700 dark:text-purple-300 flex items-center">
                  <IconBriefcase className="mr-2 text-purple-600" size={20} />
                  Interview Preparation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg mb-6">{questions.overview}</p>

                <h3 className="font-medium text-lg mb-3 text-purple-700 dark:text-purple-300">
                  Preparation Tips:
                </h3>
                <ul className="list-disc pl-5 mb-6 space-y-2">
                  {questions.preparationTips.map((tip, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      {tip}
                    </motion.li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <div className="flex items-center mb-4">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Interview Questions
              </h2>
              <div className="h-[1px] flex-grow bg-gradient-to-r from-purple-200 to-transparent ml-4"></div>
            </div>

            <div className="space-y-4 mb-10">
              {questions.questions.map((question, index) => (
                <motion.div
                  key={question.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <QuestionCard
                    question={question}
                    index={index}
                    startQuestion={startQuestion}
                    hasFeedback={!!feedback[question.id]}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {Object.keys(feedback).length > 0 && !currentQuestion && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center mb-4 mt-10">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Your Feedback
              </h2>
              <div className="h-[1px] flex-grow bg-gradient-to-r from-purple-200 to-transparent ml-4"></div>
            </div>

            <div className="space-y-6 mb-10">
              {Object.entries(feedback).map(([questionId, feedbackData], index) => {
                const question = questions.questions.find((q) => q.id === questionId);
                return (
                  <motion.div
                    key={questionId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <FeedbackCard
                      question={question}
                      answer={answers[questionId]}
                      feedback={feedbackData}
                      index={index}
                    />
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {currentQuestion && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-10"
          >
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl text-purple-700 dark:text-purple-300 flex items-center">
                    <IconQuote className="mr-2 text-purple-600" size={20} />
                    Question {questions.questions.findIndex((q) => q.id === currentQuestion) + 1}
                  </CardTitle>
                  <Badge
                    variant={getDifficultyVariant(
                      questions.questions.find((q) => q.id === currentQuestion).difficulty
                    )}
                  >
                    {questions.questions.find((q) => q.id === currentQuestion).difficulty}
                  </Badge>
                </div>
                <p className="text-lg font-medium mt-2">
                  {questions.questions.find((q) => q.id === currentQuestion).question}
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={answers[currentQuestion] || ''}
                  onChange={(e) => handleAnswerChange(currentQuestion, e.target.value)}
                  placeholder="Type your answer here..."
                  className="min-h-40 border-purple-200 focus:border-purple-400 dark:border-purple-900"
                />

                <div className="flex space-x-3">
                  <Button
                    onClick={() => setCurrentQuestion(null)}
                    variant="outline"
                    className="flex-1"
                  >
                    Back to Questions
                  </Button>
                  <Button
                    onClick={() => handleSubmitAnswer(currentQuestion)}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                    disabled={isLoading || !answers[currentQuestion]?.trim()}
                  >
                    {isLoading ? (
                      <>
                        <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        Submit Answer
                        <IconCheck className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

const QuestionCard = ({ question, index, startQuestion, hasFeedback }) => {
  console.log('question', question);
  return (
    <Card className="group border-0 shadow-md hover:shadow-lg transition-all duration-300">
      <div className={cn('h-1.5 w-full', getDifficultyGradient(question.difficulty))} />
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="bg-purple-100 dark:bg-purple-900/30 size-8 rounded-full flex items-center justify-center mr-3 text-purple-700 dark:text-purple-300 font-medium">
              {index + 1}
            </div>
            <CardTitle className="text-lg group-hover:text-purple-600 transition-colors duration-300">
              {question.category}
            </CardTitle>
          </div>
          <Badge variant={getDifficultyVariant(question.difficulty)}>{question.difficulty}</Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-2">
        <p className="mb-4 text-base">{question.question}</p>

        <div className="mb-4">
          <div className="flex items-center mb-2">
            <IconStar size={16} className="text-purple-600 mr-2" />
            <h4 className="font-medium text-sm text-purple-700 dark:text-purple-300">
              Expected Topics
            </h4>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {question.expectedTopics.map((topic, i) => (
              <Badge
                key={i}
                variant="outline"
                className="bg-purple-50/50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-colors text-xs font-normal"
              >
                {topic}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            onClick={() => startQuestion(question.id)}
            variant={hasFeedback ? 'outline' : 'default'}
            className={
              !hasFeedback
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700'
                : ''
            }
          >
            {hasFeedback ? (
              <>
                <IconCheck className="mr-2 h-4 w-4" />
                View Feedback
              </>
            ) : (
              <>
                Practice This Question
                <IconArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const FeedbackCard = ({ question, answer, feedback, index }) => {
  return (
    <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-300">
      <div className={cn('h-1.5 w-full', getScoreGradient(feedback.score))} />
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center">
            <span>Question {index + 1}:</span>
            <div
              className="ml-3 size-8 rounded-full flex items-center justify-center text-white font-bold"
              style={{ background: getScoreColor(feedback.score) }}
            >
              {feedback.score}
            </div>
          </CardTitle>
        </div>
        {/* <p className="text-muted-foreground">{question?.question}</p> */}
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="p-3 bg-secondary/30 rounded-md">
          <div className="flex items-center mb-2">
            <IconMessageCircle size={16} className="text-purple-600 mr-2" />
            <h4 className="font-medium text-sm">Your Answer</h4>
          </div>
          <p className="text-sm">{answer}</p>
        </div>

        <div>
          <h4 className="font-medium mb-2 flex items-center">
            <IconCheck size={16} className="text-green-600 mr-2" />
            Strengths
          </h4>
          <ul className="list-disc pl-5 space-y-1">
            {feedback.strengths.map((strength, i) => (
              <li key={i} className="text-sm">
                {strength}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-medium mb-2 flex items-center">
            <IconArrowRight size={16} className="text-amber-600 mr-2" />
            Areas for Improvement
          </h4>
          <ul className="list-disc pl-5 space-y-1">
            {feedback.improvements.map((improvement, i) => (
              <li key={i} className="text-sm">
                {improvement}
              </li>
            ))}
          </ul>
        </div>

        {feedback.missingPoints && feedback.missingPoints.length > 0 && (
          <div>
            <h4 className="font-medium mb-2 flex items-center">
              <IconClock size={16} className="text-red-600 mr-2" />
              Missing Key Points
            </h4>
            <ul className="list-disc pl-5 space-y-1">
              {feedback.missingPoints.map((point, i) => (
                <li key={i} className="text-sm">
                  {point}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-md">
          <h4 className="font-medium mb-1">Overall Feedback</h4>
          <p className="text-sm">{feedback.overallFeedback}</p>
        </div>
      </CardContent>
    </Card>
  );
};

function getDifficultyVariant(difficulty) {
  switch (difficulty) {
    case 'Easy': return 'success';
    case 'Medium': return 'warning';
    case 'Hard': return 'destructive';
    default: return 'default';
  }
}

function getDifficultyGradient(difficulty) {
  switch (difficulty) {
    case 'Easy': return "bg-gradient-to-r from-emerald-500 to-green-500";
    case 'Medium': return "bg-gradient-to-r from-amber-500 to-yellow-500";
    case 'Hard': return "bg-gradient-to-r from-red-500 to-orange-500";
    default: return "bg-gradient-to-r from-purple-500 to-indigo-500";
  }
}

function getScoreGradient(score) {
  if (score >= 9) return "bg-gradient-to-r from-emerald-500 to-green-500";
  if (score >= 7) return "bg-gradient-to-r from-blue-500 to-indigo-500";
  if (score >= 5) return "bg-gradient-to-r from-amber-500 to-yellow-500";
  return "bg-gradient-to-r from-red-500 to-orange-500";
}

function getScoreColor(score) {
  if (score >= 9) return "rgb(16, 185, 129)";
  if (score >= 7) return "rgb(59, 130, 246)";
  if (score >= 5) return "rgb(245, 158, 11)";
  return "rgb(239, 68, 68)";
}

export default InterviewPractice;