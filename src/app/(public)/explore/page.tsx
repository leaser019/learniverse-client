"use client";

import { Title } from '@/components/layout/Title';
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
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { courses } from '@/data/course';
import { Course } from '@/types/course';
import { motion } from 'framer-motion';
import { BarChart3, Clock, Filter, Plus, Search, Star, Users } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

/* ────────────────────────────────────────────────────────────────────────── */

const ExplorePage = () => {
  const router = useRouter();

  /* UI state -------------------------------------------------------------- */
  const [activeTab, setActiveTab] = useState<'all' | 'popular' | 'new' | 'free'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2_000_000]);
  const [selectedLevel, setSelectedLevel] = useState<'all' | string>('all');
  const [selectedCat, setSelectedCat] = useState<'all' | string>('all');

  const [filtered, setFiltered] = useState<Course[]>(courses);

  /* Derived data ---------------------------------------------------------- */
  const allCategories = Array.from(new Set(courses.flatMap((c) => c.categories)));

  /* Filtering + searching ------------------------------------------------- */
  useEffect(() => {
    let res = [...courses];

    // tab
    switch (activeTab) {
      case 'popular':
        res = res.filter((c) => c.isPopular);
        break;
      case 'new':
        res = res.sort((a, b) => +new Date(b.lastUpdate) - +new Date(a.lastUpdate)).slice(0, 10);
        break;
      case 'free':
        res = res.filter((c) => c.price === 0 || c.discount === 1);
        break;
      default:
        break;
    }

    // search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      res = res.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.instructor.toLowerCase().includes(q) ||
          c.categories.some((cat) => cat.toLowerCase().includes(q))
      );
    }

    // price
    res = res.filter((c) => {
      const discounted = c.price * (1 - c.discount);
      return discounted >= priceRange[0] && discounted <= priceRange[1];
    });

    // level
    if (selectedLevel !== 'all') res = res.filter((c) => c.level === selectedLevel);

    // category
    if (selectedCat !== 'all') res = res.filter((c) => c.categories.includes(selectedCat));

    setFiltered(res);
  }, [activeTab, searchQuery, priceRange, selectedLevel, selectedCat]);

  /* Helpers --------------------------------------------------------------- */
  const goToCourse = (id: string) => router.push(`/explore/${id}`);

  /* Render ---------------------------------------------------------------- */
  return (
    <div className="container mx-auto max-w-7xl px-4 py-2">
      <Title
        title="Explore Our Courses"
        description="Search and learn from thousands of high-quality courses written by leading experts in Computer Science and Technology."
        accentColor="pink"
      />

      {/* search & filter buttons */}
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
        <div className="md:col-span-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <Input
              placeholder="Search courses, instructors, or topics…"
              className="py-6 pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />{' '}
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" className="gap-2 py-6">
            <Filter size={16} />
            Filters
          </Button>
          <Button
            variant="default"
            className="gap-2 py-6 bg-pink-600 hover:bg-pink-700"
            onClick={() => router.push('/explore/create')}
          >
            <Plus size={16} />
            Create Course
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        {/* left column – sidebar filters */}
        <aside className="space-y-6 lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* price */}
              <section>
                <h3 className="mb-3 font-medium">Price range</h3>
                <Slider
                  defaultValue={priceRange}
                  max={2_000_000}
                  step={100_000}
                  onValueChange={setPriceRange}
                />
                <div className="mt-2 flex justify-between text-sm text-gray-500">
                  <span>{priceRange[0]?.toLocaleString()}₫</span>
                  <span>{priceRange[1]?.toLocaleString()}₫</span>
                </div>
              </section>

              {/* level */}
              <section>
                <h3 className="mb-3 font-medium">Level</h3>
                <Select value={selectedLevel} onValueChange={(v) => setSelectedLevel(v as any)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </section>

              {/* category */}
              <section>
                <h3 className="mb-3 font-medium">Category</h3>
                <Select value={selectedCat} onValueChange={(v) => setSelectedCat(v as any)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {allCategories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </section>
            </CardContent>
          </Card>
        </aside>

        {/* right column – course list */}
        <section className="space-y-6 lg:col-span-3">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
            {/* tab bar */}
            <TabsList className="mb-6">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="popular">Popular</TabsTrigger>
              <TabsTrigger value="new">Newest</TabsTrigger>
              <TabsTrigger value="free">Free</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab}>
              {/* sort & count row */}
              <div className="mb-6 flex items-center justify-between">
                <p className="text-gray-600">{filtered.length} course(s)</p>

                <Select defaultValue="newest">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="popular">Most popular</SelectItem>
                    <SelectItem value="price-low">Price: low → high</SelectItem>
                    <SelectItem value="price-high">Price: high → low</SelectItem>
                    <SelectItem value="rating">Highest rating</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* course cards */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filtered.map((c) => (
                  <motion.div
                    key={c.id}
                    whileHover={{ y: -5 }}
                    onClick={() => goToCourse(c.id)}
                    className="cursor-pointer"
                  >
                    <Card className="flex h-full flex-col overflow-hidden">
                      {/* thumbnail */}
                      <div className="relative h-48">
                        <Image
                          src={c.thumbnailUrl}
                          alt={c.title}
                          fill
                          className="rounded-2xl object-fill p-2"
                        />
                        {c.discount > 0 && (
                          <div className="absolute right-2 top-2 rounded bg-red-500 px-2 py-1 text-sm font-medium text-white">
                            -{Math.round(c.discount * 100)}%
                          </div>
                        )}
                      </div>

                      {/* header */}
                      <CardHeader className="pb-2">
                        {/* categories */}
                        <div className="mb-1 flex flex-wrap gap-2">
                          {c.categories.slice(0, 2).map((cat) => (
                            <Badge key={cat} variant="secondary" className="text-xs">
                              {cat}
                            </Badge>
                          ))}
                        </div>
                        <CardTitle className="line-clamp-2 text-lg">{c.title}</CardTitle>
                        <CardDescription className="line-clamp-1">{c.instructor}</CardDescription>
                      </CardHeader>

                      {/* content */}
                      <CardContent className="pb-2">
                        {/* rating row */}
                        <div className="mb-2 flex items-center">
                          <span className="font-bold text-amber-500">{c.rating.toFixed(1)}</span>
                          <div className="ml-1 flex">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                size={14}
                                className={
                                  i < Math.floor(c.rating)
                                    ? 'fill-amber-500 text-amber-500'
                                    : 'text-gray-300'
                                }
                              />
                            ))}
                          </div>
                          <span className="ml-1 text-xs text-gray-500">({c.reviewCount})</span>
                        </div>

                        {/* meta row */}
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Clock size={14} />
                            {c.duration}
                          </span>
                          <span className="flex items-center gap-1">
                            <BarChart3 size={14} />
                            {c.level}
                          </span>
                        </div>
                      </CardContent>

                      {/* footer */}
                      <CardFooter className="mt-auto pt-2">
                        <div className="flex w-full items-center justify-between">
                          {/* price */}
                          <div>
                            <div className="text-lg font-bold">
                              {(c.price * (1 - c.discount))?.toLocaleString()}₫
                            </div>
                            {c.discount > 0 && (
                              <div className="text-sm text-gray-500 line-through">
                                {c.originalPrice?.toLocaleString()}₫
                              </div>
                            )}
                          </div>
                          {/* enrolments */}
                          <span className="flex items-center gap-1 text-sm text-gray-500">
                            <Users size={14} />
                            {c.enrollmentCount?.toLocaleString()}
                          </span>
                        </div>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {filtered.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-col items-center justify-center py-16 text-center"
                >
                  <div className="mb-6 rounded-full bg-blue-50 p-4">
                    <Search size={32} className="text-blue-500" />
                  </div>
                  <h3 className="mb-3 text-2xl font-bold text-blue-900">
                    Không tìm thấy khóa học nào
                  </h3>
                  <p className="mb-6 max-w-md text-blue-600/70">
                    Hãy thử điều chỉnh bộ lọc hoặc sử dụng từ khóa khác để tìm kiếm.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchQuery('');
                      setPriceRange([0, 2_000_000]);
                      setSelectedLevel('all');
                      setSelectedCat('all');
                      setActiveTab('all');
                    }}
                    className="border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100"
                  >
                    Xóa tất cả bộ lọc
                  </Button>
                </motion.div>
              )}
            </TabsContent>
          </Tabs>
        </section>
      </div>
    </div>
  );
};

export default ExplorePage;
