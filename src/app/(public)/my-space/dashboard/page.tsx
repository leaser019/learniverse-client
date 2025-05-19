'use client';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { userChallengeStats } from '@/data/codingChallenges';
import { motion } from 'framer-motion';
import { Award, Calendar, Code, FlameIcon, GitCommit, Target, Zap } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Dashboard() {
  const [progress, setProgress] = useState(0);
  const [isClient, setIsClient] = useState(false);

  // For client-side rendering
  useEffect(() => {
    setIsClient(true);
    setProgress(65);
  }, []);

  if (!isClient) return null;

  const stats = [
    {
      title: 'Total Challenges Solved',
      value: userChallengeStats.totalSolved,
      icon: <Code className="text-blue-500" />,
      change: '+3 weeks ago',
      trend: 'up',
    },
    {
      title: 'Total Points Earned',
      value: userChallengeStats.totalPoints,
      icon: <Award className="text-amber-500" />,
      change: '+150 yesterday',
      trend: 'up',
    },
    {
      title: 'Current Streak',
      value: userChallengeStats.streakDays,
      icon: <FlameIcon className="text-orange-500" />,
      change: 'Day 7!',
      trend: 'neutral',
    },
    {
      title: 'Challenges This Week',
      value: 5,
      icon: <Calendar className="text-green-500" />,
      change: '2 today',
      trend: 'up',
    },
  ];

  const recentSubmissions = userChallengeStats.submissions.slice(0, 3);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="container mx-auto py-10 px-4"
    >
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
          My Dashboard 🚀
        </h1>
        <Button asChild className="bg-gradient-to-r from-pink-500 to-purple-500 text-white">
          <Link href="/my-space">View Challenge</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="h-full border-l-4 border-l-pink-500 hover:shadow-md transition-all">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  {stat.icon}
                  <Badge
                    variant={stat.trend === 'up' ? 'success' : 'secondary'}
                    className="ml-auto"
                  >
                    {stat.change}
                  </Badge>
                </div>
                <CardDescription>{stat.title}</CardDescription>
                <CardTitle className="text-3xl mt-1">{stat.value}</CardTitle>
              </CardHeader>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <motion.div
          className="md:col-span-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="mr-2 h-5 w-5 text-purple-500" />
                Your Progress
              </CardTitle>
              <CardDescription>
                You are working towards the goal of completing 100 challenges 🔥
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Total Progress</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-6">
                  <div className="flex flex-col items-center p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                    <span className="text-sm text-blue-600 dark:text-blue-400">Easy</span>
                    <span className="text-2xl font-bold">{userChallengeStats.easySolved}</span>
                    <span className="text-xs text-gray-500">/ 30</span>
                  </div>

                  <div className="flex flex-col items-center p-3 bg-green-50 dark:bg-green-950/30 rounded-lg">
                    <span className="text-sm text-green-600 dark:text-green-400">Medium</span>
                    <span className="text-2xl font-bold">{userChallengeStats.mediumSolved}</span>
                    <span className="text-xs text-gray-500">/ 40</span>
                  </div>

                  <div className="flex flex-col items-center p-3 bg-orange-50 dark:bg-orange-950/30 rounded-lg">
                    <span className="text-sm text-orange-600 dark:text-orange-400">Hard</span>
                    <span className="text-2xl font-bold">{userChallengeStats.hardSolved}</span>
                    <span className="text-xs text-gray-500">/ 20</span>
                  </div>

                  <div className="flex flex-col items-center p-3 bg-red-50 dark:bg-red-950/30 rounded-lg">
                    <span className="text-sm text-red-600 dark:text-red-400">Expert</span>
                    <span className="text-2xl font-bold">{userChallengeStats.expertSolved}</span>
                    <span className="text-xs text-gray-500">/ 10</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-6">
              <div className="flex flex-col w-full">
                <div className="flex justify-between mb-4">
                  <h3 className="font-semibold">Recent Submissions</h3>
                  <Link href="/my-space" className="text-sm text-blue-500 hover:underline">
                    View All
                  </Link>
                </div>

                {recentSubmissions.length > 0 ? (
                  <div className="space-y-3">
                    {recentSubmissions.map((submission) => (
                      <div
                        key={submission.id}
                        className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900/40 rounded-lg"
                      >
                        <GitCommit className="text-gray-400" size={18} />
                        <div className="flex-1">
                          <div className="font-medium">
                            Challenge #{submission.challengeId.split('-')[1]}
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(submission.submittedAt).toLocaleDateString()} -{' '}
                            {submission.language}
                          </div>
                        </div>
                        <Badge
                          variant={submission.status === 'Accepted' ? 'success' : 'destructive'}
                          className="ml-auto"
                        >
                          {submission.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <Alert>
                    <AlertDescription>You have no submissions yet.</AlertDescription>
                  </Alert>
                )}
              </div>
            </CardFooter>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="mr-2 h-5 w-5 text-amber-500" />
                Achievements
              </CardTitle>
              <CardDescription>Unlock achievements by solving challenges</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-lg border border-purple-100 dark:border-purple-900/30">
                  <div className="mr-3 bg-gradient-to-br from-purple-500 to-pink-500 p-2 rounded-full">
                    <Award className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="font-medium">Algorithm Master</div>
                    <div className="text-xs text-gray-500">
                      Solve at least 20 algorithm challenges
                    </div>
                  </div>
                  <div className="ml-auto">
                    <Badge
                      variant="outline"
                      className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
                    >
                      15/20
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center p-3 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 rounded-lg border border-amber-100 dark:border-amber-900/30">
                  <div className="mr-3 bg-gradient-to-br from-amber-500 to-orange-500 p-2 rounded-full">
                    <FlameIcon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="font-medium">7-Day Streak</div>
                    <div className="text-xs text-gray-500">
                      Complete at least 1 challenge every day for 7 days
                    </div>
                  </div>
                  <div className="ml-auto">
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                      Achieved
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center p-3 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 rounded-lg border border-blue-100 dark:border-blue-900/30">
                  <div className="mr-3 bg-gradient-to-br from-blue-500 to-cyan-500 p-2 rounded-full">
                    <Code className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="font-medium">Frontend Expert</div>
                    <div className="text-xs text-gray-500">Complete 10 Frontend challenges</div>
                  </div>
                  <div className="ml-auto">
                    <Badge
                      variant="outline"
                      className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                    >
                      6/10
                    </Badge>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-4" asChild>
                  <Link href="/my-space/achievements">View All Achievements</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div
        className="mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Recommend Challenges</CardTitle>
            <CardDescription>
              Based on the challenges you have solved before, here are some suggestions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border border-blue-100 dark:border-blue-900/30 hover:shadow-md transition-all">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <Badge>Easy</Badge>
                    <Badge variant="outline">Array</Badge>
                  </div>
                  <CardTitle className="text-lg mt-2">Maximum Subarray</CardTitle>
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="text-sm text-gray-500 line-clamp-2">
                    Find the contiguous subarray with the largest sum in an array of integers.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button size="sm" variant="outline" asChild className="w-full">
                    <Link href="/my-space">Solve Now</Link>
                  </Button>
                </CardFooter>
              </Card>

              <Card className="border border-blue-100 dark:border-blue-900/30 hover:shadow-md transition-all">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <Badge className="bg-amber-500">Medium</Badge>
                    <Badge variant="outline">React</Badge>
                  </div>
                  <CardTitle className="text-lg mt-2">Form Validation Component</CardTitle>
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="text-sm text-gray-500 line-clamp-2">
                    Build a form validation component with React and custom hooks.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button size="sm" variant="outline" asChild className="w-full">
                    <Link href="/my-space">Solve Now</Link>
                  </Button>
                </CardFooter>
              </Card>

              <Card className="border border-blue-100 dark:border-blue-900/30 hover:shadow-md transition-all">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <Badge className="bg-red-500">Hard</Badge>
                    <Badge variant="outline">Algorithm</Badge>
                  </div>
                  <CardTitle className="text-lg mt-2">Median of Two Sorted Arrays</CardTitle>
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="text-sm text-gray-500 line-clamp-2">
                    Find the median of two sorted arrays with a time complexity of O(log(m+n)).
                  </p>
                </CardContent>
                <CardFooter>
                  <Button size="sm" variant="outline" asChild className="w-full">
                    <Link href="/my-space">Solve Now</Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
