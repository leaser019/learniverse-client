'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';
import { Award, BookOpen, Code, FileCode, Laptop, Medal, Star, Trophy, Zap } from 'lucide-react';
import { useState } from 'react';

const achievements = [
  {
    id: 'streak-7',
    name: '7-Day Streak',
    description: 'Complete at least one challenge every day for 7 consecutive days',
    icon: <Laptop className="text-orange-500" size={24} />,
    progress: 100,
    achieved: true,
    earnedDate: 'May 10, 2025',
    badgeColor: 'bg-gradient-to-r from-orange-500 to-red-500',
  },
  {
    id: 'algo-master',
    name: 'Algorithm Master',
    description: 'Finish 20 algorithm challenges',
    icon: <Code className="text-blue-500" size={24} />,
    progress: 75,
    achieved: false,
    currentValue: 15,
    maxValue: 20,
    badgeColor: 'bg-gradient-to-r from-blue-500 to-indigo-500',
  },
  {
    id: 'frontend-dev',
    name: 'Frontend Developer',
    description: 'Complete 10 frontend development challenges',
    icon: <Laptop className="text-teal-500" size={24} />,
    progress: 60,
    achieved: false,
    currentValue: 6,
    maxValue: 10,
    badgeColor: 'bg-gradient-to-r from-teal-500 to-green-500',
  },
  {
    id: 'challenge-creator',
    name: 'Challenge Creator',
    description: 'Create and share 5 of your own coding challenges',
    icon: <FileCode className="text-purple-500" size={24} />,
    progress: 40,
    achieved: false,
    currentValue: 2,
    maxValue: 5,
    badgeColor: 'bg-gradient-to-r from-purple-500 to-pink-500',
  },
  {
    id: 'early-adopter',
    name: 'Early Adopter',
    description: 'Be among the first 1,000 users to join the platform',
    icon: <Zap className="text-yellow-500" size={24} />,
    progress: 100,
    achieved: true,
    earnedDate: 'April 15, 2025',
    badgeColor: 'bg-gradient-to-r from-yellow-500 to-amber-500',
  },
  {
    id: 'perfect-score',
    name: 'Perfect Solutions',
    description: 'Achieve perfect scores on 10 challenges',
    icon: <Trophy className="text-amber-500" size={24} />,
    progress: 80,
    achieved: false,
    currentValue: 8,
    maxValue: 10,
    badgeColor: 'bg-gradient-to-r from-amber-500 to-yellow-500',
  },
  {
    id: 'database-guru',
    name: 'Database Guru',
    description: 'Solve 8 database-related challenges',
    icon: <Medal className="text-cyan-500" size={24} />,
    progress: 25,
    achieved: false,
    currentValue: 2,
    maxValue: 8,
    badgeColor: 'bg-gradient-to-r from-cyan-500 to-blue-500',
  },
  {
    id: 'github-connector',
    name: 'GitHub Explorer',
    description: 'Connect your GitHub account and sync data',
    icon: <Medal className="text-gray-700" size={24} />,
    progress: 100,
    achieved: true,
    earnedDate: 'May 2, 2025',
    badgeColor: 'bg-gradient-to-r from-gray-700 to-gray-900',
  },
  {
    id: 'streak-30',
    name: '30-Day Streak',
    description: 'Maintain a challenge streak for 30 consecutive days',
    icon: <Medal className="text-red-500" size={24} />,
    progress: 23,
    achieved: false,
    currentValue: 7,
    maxValue: 30,
    badgeColor: 'bg-gradient-to-r from-red-500 to-orange-500',
  },
];

export default function Achievements() {
  const [filter, setFilter] = useState<'all' | 'achieved' | 'in-progress'>('all');

  const handleClaimReward = (id: string) => {
    // Simulate claiming reward
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#f43f5e', '#d946ef', '#8b5cf6', '#3b82f6', '#14b8a6'],
    });
  };

  const filteredAchievements = achievements.filter((achievement) => {
    if (filter === 'all') return true;
    if (filter === 'achieved') return achievement.achieved;
    if (filter === 'in-progress') return !achievement.achieved;
    return true;
  });

  const achievedCount = achievements.filter((a) => a.achieved).length;
  const totalAchievements = achievements.length;
  const overallProgress = Math.round((achievedCount / totalAchievements) * 100);

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-2xl flex items-center gap-2">
              <Award className="text-pink-500" size={28} />
              Your Achievements
            </CardTitle>
            <CardDescription>
              Track your progress and unlock achievements as you learn and develop skills
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div className="flex-1">
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium">Overall Progress</span>
                  <span>{overallProgress}%</span>
                </div>
                <Progress value={overallProgress} className="h-2" />
                <div className="mt-2 text-sm text-gray-500">
                  You have earned {achievedCount}/{totalAchievements} achievements
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={filter === 'all' ? 'default' : 'outline'}
                  onClick={() => setFilter('all')}
                >
                  All
                </Button>
                <Button
                  size="sm"
                  variant={filter === 'achieved' ? 'default' : 'outline'}
                  onClick={() => setFilter('achieved')}
                  className={filter === 'achieved' ? 'bg-green-600 hover:bg-green-700' : ''}
                >
                  Achieved
                </Button>
                <Button
                  size="sm"
                  variant={filter === 'in-progress' ? 'default' : 'outline'}
                  onClick={() => setFilter('in-progress')}
                  className={filter === 'in-progress' ? 'bg-amber-600 hover:bg-amber-700' : ''}
                >
                  In Progress
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredAchievements.map((achievement, index) => (
          <motion.div
            key={achievement.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="h-full flex flex-col overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div
                    className={`w-12 h-12 rounded-full ${achievement.badgeColor} flex items-center justify-center text-white shadow-lg`}
                  >
                    {achievement.icon}
                  </div>

                  {achievement.achieved ? (
                    <Badge className="bg-green-100 text-green-800">Achieved</Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="bg-amber-50 text-amber-800 border-amber-200"
                    >
                      {achievement.progress}% completed
                    </Badge>
                  )}
                </div>

                <CardTitle className="mt-3 text-xl">{achievement.name}</CardTitle>
                <CardDescription className="min-h-[40px]">
                  {achievement.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="pb-0 flex-grow">
                {!achievement.achieved && (
                  <div className="mt-2 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Progress:</span>
                      <span className="font-medium">
                        {achievement.currentValue}/{achievement.maxValue}
                      </span>
                    </div>
                    <Progress value={achievement.progress} className="h-1.5" />
                  </div>
                )}

                {achievement.achieved && (
                  <div className="text-sm text-gray-500 mt-2">
                    Achieved on: {achievement.earnedDate}
                  </div>
                )}
              </CardContent>

              <CardFooter className="pt-4">
                {achievement.achieved ? (
                  <Button
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                    onClick={() => handleClaimReward(achievement.id)}
                  >
                    <Star className="mr-2 h-4 w-4" /> Show Off
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      if (achievement.progress >= 95) {
                        handleClaimReward(achievement.id);
                        confetti({
                          particleCount: 200,
                          spread: 160,
                          origin: { x: 0.5, y: 0.5 },
                        });
                      }
                    }}
                  >
                    <BookOpen className="mr-2 h-4 w-4" /> In Progress
                  </Button>
                )}
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
