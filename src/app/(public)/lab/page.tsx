'use client';

import FeatureCard from '@/components/lab/FeatureCard';
import { Title } from '@/components/layout/Title';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { IconBriefcase, IconCode, IconRobot, IconSearch, IconStar } from '@tabler/icons-react';
import { useState } from 'react';

const Lab = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const filteredTools = aiTools.filter((tool) => {
    const matchesSearch =
      tool.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tool.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()));

    if (activeTab === 'all') return matchesSearch;
    return tool.category === activeTab && matchesSearch;
  });

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-background to-background/40">
      <div className="container pt-10 pb-20 px-4 md:px-6 mx-auto relative z-10">
        <Title
          title="AI Lab"
          description="Discover a collection of super cool AI tools to boost your learning, career growth, and programming skills."
          accentColor="teal"
        />

        {/* Tabs */}
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-center mb-16">
            <TabsList className="bg-background/40 backdrop-blur-md border border-border/30 p-1.5 rounded-full shadow-lg shadow-teal-500/5">
              <TabsTrigger
                value="all"
                className="rounded-full px-8 py-2.5 data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-500/80 data-[state=active]:to-teal-600/80 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-300 font-medium"
              >
                All
              </TabsTrigger>
              <TabsTrigger
                value="career"
                className="rounded-full px-8 py-2.5 data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-500/80 data-[state=active]:to-teal-600/80 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-300 font-medium"
              >
                Career
              </TabsTrigger>
              <TabsTrigger
                value="language"
                className="rounded-full px-8 py-2.5 data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-500/80 data-[state=active]:to-teal-600/80 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-300 font-medium"
              >
                Language
              </TabsTrigger>
              <TabsTrigger
                value="coding"
                className="rounded-full px-8 py-2.5 data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-500/80 data-[state=active]:to-teal-600/80 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-300 font-medium"
              >
                Coding
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Card Grid */}
          <div
            key={activeTab + searchTerm}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fadeIn"
          >
            {filteredTools.length > 0 ? (
              filteredTools.map((tool, index) => (
                <FeatureCard key={tool.id} feature={tool} index={index} />
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center py-24 text-center">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full blur-md bg-slate-500/10"></div>
                  <IconSearch size={64} className="text-teal-500/70 relative" />
                </div>
                <h3 className="text-2xl font-medium mt-6 mb-3">No results found</h3>
                <p className="text-muted-foreground max-w-md">
                  Try different keywords or browse our complete collection of AI tools
                </p>
                <Button
                  variant="outline"
                  className="mt-8 bg-gradient-to-r from-teal-500/10 to-teal-500/5 border-teal-500/20 hover:border-teal-500/30 px-6 py-5 rounded-full hover:shadow-lg hover:shadow-teal-500/10 transition-all duration-300"
                  onClick={() => {
                    setSearchTerm('');
                    setActiveTab('all');
                  }}
                >
                  Browse all tools
                </Button>
              </div>
            )}
          </div>
        </Tabs>
      </div>
    </div>
  );
};

const aiTools = [
  {
    id: 1,
    title: 'AI Career Advisor',
    description: 'Suggests suitable careers based on your skills, interests, and abilities',
    icon: <IconBriefcase size={24} />,
    path: '/lab/career-advisor',
    category: 'career',
    status: 'Hot',
    tags: ['Career', 'Consulting', 'AI'],
  },
  {
    id: 2,
    title: 'Smart Resume Enhancer',
    description: 'Analyze and improve your CV with smart AI suggestions',
    icon: <IconStar size={24} />,
    path: '/lab/resume-enhancer',
    category: 'career',
    status: 'New',
    tags: ['CV', 'ATS', 'Optimization'],
  },
  // {
  //   id: 3,
  //   title: 'Text Summarizer',
  //   description: 'Summarize long texts into key points intelligently',
  //   icon: <IconPencil size={24} />,
  //   path: '/lab/text-summarizer',
  //   category: 'language',
  //   status: 'Popular',
  //   tags: ['NLP', 'Summarization', 'Text'],
  // },
  {
    id: 4,
    title: 'Code Explainer',
    description: 'Explain complex source code in simple, easy-to-understand language',
    icon: <IconCode size={24} />,
    path: '/lab/code-explainer',
    category: 'coding',
    status: 'Useful',
    tags: ['Code', 'Explanation', 'Learning'],
  },
  // {
  //   id: 5,
  //   title: 'Language Translator',
  //   description: 'Translate text between multiple languages with high accuracy',
  //   icon: <IconLanguage size={24} />,
  //   path: '/lab/translator',
  //   category: 'language',
  //   status: 'Basic',
  //   tags: ['Translation', 'Multilingual'],
  // },
  {
    id: 6,
    title: 'Interview Practice AI',
    description: 'Practice interviews with smart AI and get instant feedback',
    icon: <IconRobot size={24} />,
    path: '/lab/interview-practice',
    category: 'career',
    status: 'Premium',
    tags: ['Interview', 'Practice', 'Feedback'],
  },
  // {
  //   id: 7,
  //   title: 'Smart Study Assistant',
  //   description: 'AI study assistant creates quizzes, flashcards, and lesson summaries',
  //   icon: <IconBrain size={24} />,
  //   path: '/lab/study-assistant',
  //   category: 'language',
  //   status: 'Beta',
  //   tags: ['Learning', 'Quiz', 'Memory'],
  // },
  {
    id: 8,
    title: 'Code Generator',
    description: 'Generate source code from natural language descriptions',
    icon: <IconCode size={24} />,
    path: '/lab/code-generator',
    category: 'coding',
    status: 'Hot',
    tags: ['Code Generation', 'Automation'],
  },
  {
    id: 9,
    title: 'Research Helper',
    description: 'Search and compile information from multiple sources for your research',
    icon: <IconSearch size={24} />,
    path: '/lab/research-helper',
    category: 'language',
    status: 'New',
    tags: ['Research', 'Compilation', 'Academic'],
  },
];

export default Lab;
