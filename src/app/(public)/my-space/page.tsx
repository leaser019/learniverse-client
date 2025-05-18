'use client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { codingChallenges, leaderboardData } from '@/data/codingChallenges';
import { ChallengeLanguage } from '@/types/CodingChallenge';
import { Filter } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const languages: ChallengeLanguage[] = [
  'JavaScript',
  'TypeScript',
  'Python',
  'Java',
  'C++',
  'Go',
  'Rust',
  'SQL',
];
const levels = ['Easy', 'Medium', 'Hard', 'Expert'];

// Component chính cho trang My Space
export default function MySpace() {
  const [search, setSearch] = useState('');
  const [level, setLevel] = useState('all');
  const [lang, setLang] = useState<ChallengeLanguage | 'all'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'points' | 'difficulty'>('newest');

  const router = useRouter();

  const filtered = codingChallenges.filter(
    (c) =>
      (level === 'all' || c.difficulty === level) &&
      (lang === 'all' || c.supportedLanguages.includes(lang)) &&
      (c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.description.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1">
          <div className="flex flex-wrap gap-2 items-end mb-4">
            <div className="flex-1">
              <Input
                className="border rounded px-3 py-2"
                placeholder="Tìm challenge..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select value={level} onValueChange={setLevel}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Độ khó" />
              </SelectTrigger>
              <SelectContent>
                {' '}
                <SelectItem value="all">All</SelectItem>
                {levels.map((l) => (
                  <SelectItem key={l} value={l}>
                    {l}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={lang}
              onValueChange={(value) => setLang(value as ChallengeLanguage | 'all')}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Ngôn ngữ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {languages.map((l) => (
                  <SelectItem key={l} value={l}>
                    {l}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>{' '}
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                const sorts: ('newest' | 'points' | 'difficulty')[] = [
                  'newest',
                  'points',
                  'difficulty',
                ];
                const currentIdx = sorts.indexOf(sortBy);
                const nextIdx = (currentIdx + 1) % sorts.length;
                setSortBy(sorts[nextIdx]);
              }}
              className="hidden md:flex"
            >
              <Filter size={18} />
            </Button>
          </div>
          <div className="grid gap-4">
            {filtered.map((ch) => (
              <Card
                key={ch.id}
                className="hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-purple-200"
              >
                <CardHeader
                  onClick={() => router.push(`my-space/challenge/${ch.id}`)}
                  className="cursor-pointer flex flex-row items-center justify-between "
                >
                  <CardTitle className="text-purple-900">{ch.title}</CardTitle>
                  <Badge
                    variant="outline"
                    className="ml-2 bg-white/70 text-purple-600 border-purple-300"
                  >
                    {ch.difficulty}
                  </Badge>
                </CardHeader>
                <CardContent className="bg-white/80">
                  <div className="line-clamp-2 text-gray-600">
                    {ch.description.slice(0, 120)}...
                  </div>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {ch.categories.map((cat) => (
                      <Badge
                        key={cat}
                        variant="secondary"
                        className="bg-purple-100 text-purple-700"
                      >
                        {cat}
                      </Badge>
                    ))}
                    {ch.supportedLanguages.map((l) => (
                      <Badge key={l} variant="default" className="bg-pink-100 text-pink-700">
                        {l}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
            {filtered.length === 0 && (
              <div className="text-center p-8 bg-white/50 rounded-xl backdrop-blur-sm text-gray-500">
                Hông có challenge nào phù hợp nè 😢 Thử tìm cái khác xem!
              </div>
            )}
          </div>
        </div>
        <div className="w-full md:w-1/3">
          <Card>
            <CardHeader>
              <CardTitle>Leaderboard – Who is on fire?</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-2">
                {leaderboardData.slice(0, 10).map((u) => (
                  <li key={u.userId} className="flex items-center gap-2">
                    <div className="relative w-8 h-8">
                      <Image
                        src={u.avatarUrl}
                        alt={u.username}
                        fill
                        sizes="32px"
                        className="rounded-full object-cover"
                      />
                    </div>
                    <span className="font-bold">#{u.rank}</span>
                    <span>{u.username}</span>
                    <span className="ml-auto text-pink-500 font-semibold">{u.totalPoints} pts</span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
