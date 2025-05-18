
export type DifficultyLevel = 'Easy' | 'Medium' | 'Hard' | 'Expert';
export type ChallengeCategory = 'Algorithm' | 'Data Structure' | 'Web Development' | 'Database' | 'Machine Learning' | 'Frontend' | 'Backend';
export type ChallengeLanguage = 'JavaScript' | 'TypeScript' | 'Python' | 'Java' | 'C++' | 'Go' | 'Rust' | 'SQL';

export interface TestCase {
  input: string;
  output: string;
  isHidden?: boolean;
}

export interface CodingChallenge {
  id: string;
  title: string;
  description: string;
  difficulty: DifficultyLevel;
  categories: ChallengeCategory[];
  supportedLanguages: ChallengeLanguage[];
  defaultLanguage: ChallengeLanguage;
  points: number;
  timeLimit: number; // in minutes
  startCode: Record<ChallengeLanguage, string>;
  testCases: TestCase[];
  solution?: Record<ChallengeLanguage, string>;
  hints: string[];
  createdAt: string;
  dailyChallenge?: boolean;
}

export interface ChallengeSubmission {
  id: string;
  userId: string;
  challengeId: string;
  code: string;
  language: ChallengeLanguage;
  status: 'Accepted' | 'Wrong Answer' | 'Time Limit Exceeded' | 'Runtime Error' | 'Compilation Error';
  runtime: number; // in milliseconds
  memory: number; // in KB
  score: number;
  submittedAt: string;
  passedTestCases: number;
  totalTestCases: number;
}

export interface UserChallengeStats {
  userId: string;
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  expertSolved: number;
  totalPoints: number;
  streakDays: number;
  lastActiveDate: string;
  submissions: ChallengeSubmission[];
}

export interface LeaderboardEntry {
  userId: string;
  username: string;
  avatarUrl: string;
  totalPoints: number;
  rank: number;
  totalSolved: number;
  streakDays: number;
  badges: Badge[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  iconUrl: string;
  earnedAt: string;
}
