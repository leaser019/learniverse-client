"use client";

import { VideoPlayer } from "@/components/study/ReactPlayer";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Textarea } from "@/components/ui/textarea";
import { courses } from "@/data/course";
import { Course } from "@/types/course";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  Download,
  FileText,
  Lightbulb,
  Lock,
  Maximize2,
  MessageSquare,
  Minimize2,
  PlayCircle,
  Save,
  Settings,
  StickyNote,
  Target,
  Users,
  X,
  Zap
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const LearnPage = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLesson, setSelectedLesson] = useState<any>(null);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [noteContent, setNoteContent] = useState("");
  const [studyTime, setStudyTime] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [autoplay, setAutoplay] = useState(true);
  
  useEffect(() => {
    setIsLoading(true);
    const c = courses.find((c) => c.id === id) ?? null;
    
    setTimeout(() => {
      setCourse(c);
      
      // Find first video lesson to auto-select
      if (c && c.modules.length > 0) {
        for (const module of c.modules) {
          for (const lesson of module.lessons) {
            if (lesson.type === 'video') {
              setSelectedLesson(lesson);
              break;
            }
          }
          if (selectedLesson) break;
        }
      }
      
      // Load completed lessons from localStorage
      const saved = localStorage.getItem(`course_${id}_progress`);
      if (saved) {
        setCompletedLessons(JSON.parse(saved));
      }
      
      // Load notes from localStorage
      const savedNotes = localStorage.getItem(`course_${id}_notes`);
      if (savedNotes) {
        setNoteContent(savedNotes);
      }
      
      setIsLoading(false);
    }, 500);
    
    // Start tracking study time
    const timer = setInterval(() => {
      setStudyTime(prev => prev + 1);
    }, 60000); // Update every minute
    
    return () => clearInterval(timer);
  }, [id]);
  
  // Save completed lessons to localStorage when they change
  useEffect(() => {
    if (completedLessons.length > 0) {
      localStorage.setItem(`course_${id}_progress`, JSON.stringify(completedLessons));
    }
  }, [completedLessons, id]);

  const markAsComplete = (lessonId: string) => {
    if (completedLessons.includes(lessonId)) {
      setCompletedLessons(completedLessons.filter(id => id !== lessonId));
      toast.info("Lesson marked as incomplete");
    } else {
      setCompletedLessons([...completedLessons, lessonId]);
      toast.success("Lesson completed! Great job!");
    }
  };
  
  const navigateToCourseDetails = () => router.push(`/explore/${id}`);
  
  const selectLesson = (lesson: any) => {
    if (lesson.type === 'video') {
      setSelectedLesson(lesson);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      toast.error("This content type is not available yet");
    }
  };
  
  const findNextLesson = () => {
    if (!course || !selectedLesson) return null;
    
    let foundCurrent = false;
    for (const module of course.modules) {
      for (const lesson of module.lessons) {
        if (foundCurrent && lesson.type === 'video') {
          return lesson;
        }
        if (lesson.id === selectedLesson.id) {
          foundCurrent = true;
        }
      }
    }
    return null;
  };
  
  const findPrevLesson = () => {
    if (!course || !selectedLesson) return null;
    
    let prevVideoLesson = null;
    for (const module of course.modules) {
      for (const lesson of module.lessons) {
        if (lesson.id === selectedLesson.id) {
          return prevVideoLesson;
        }
        if (lesson.type === 'video') {
          prevVideoLesson = lesson;
        }
      }
    }
    return null;
  };
  
  const nextLesson = findNextLesson();
  const prevLesson = findPrevLesson();
  
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };
  
  const toggleNotes = () => {
    setShowNotes(!showNotes);
  };
  
  const saveNotes = () => {
    localStorage.setItem(`course_${id}_notes`, noteContent);
    toast.success("Notes saved successfully!");
  };
  
  const downloadMaterial = () => {
    toast.info("Downloading study materials...");
    setTimeout(() => {
      toast.success("Download complete!");
    }, 1500);
  };
  
  const askInstructor = () => {
    toast.info("Connecting to instructor...");
  };
  
  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };
  
  const changePlaybackSpeed = (speed: number) => {
    setPlaybackSpeed(speed);
    toast.info(`Playback speed set to ${speed}x`);
  };
  
  const handleVideoEnd = () => {
    if (selectedLesson) {
      markAsComplete(selectedLesson.id);
      if (autoplay && nextLesson) {
        setTimeout(() => {
          selectLesson(nextLesson);
        }, 1000);
      }
    }
  };
  
  const formatStudyTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };
  
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mb-4 animate-pulse text-blue-600">
            <PlayCircle size={48} />
          </div>
          <p className="text-lg font-medium text-gray-700">Loading course...</p>
        </div>
      </div>
    );
  }
  
  if (!course) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mb-4 text-red-500">
            <FileText size={48} />
          </div>
          <h1 className="mb-2 text-2xl font-bold text-gray-900">Course Not Found</h1>
          <p className="mb-6 text-gray-600">The course you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => router.push('/explore')}>Return to Courses</Button>
        </div>
      </div>
    );
  }

  const totalLessons = course.modules.reduce((t, m) => t + m.lessons.length, 0);
  const progressPercentage = Math.round((completedLessons.length / totalLessons) * 100);

  return (
    <div className={`min-h-screen bg-gray-50 ${isFullscreen ? 'py-0' : 'py-4'}`}>
      <div className={`container mx-auto ${isFullscreen ? 'max-w-none px-0' : 'max-w-screen-xl px-4'}`}>
        {/* Top navigation bar */}
        {!isFullscreen && (
          <div className="mb-4 flex items-center justify-between">
            <Button 
              variant="ghost" 
              onClick={navigateToCourseDetails}
              className="gap-1 text-blue-600"
            >
              <ArrowLeft size={18} />
              Back to Course Details
            </Button>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" className="gap-1" onClick={toggleNotes}>
                <StickyNote size={16} />
                Notes
              </Button>
              <Button variant="outline" className="gap-1" onClick={toggleSettings}>
                <Settings size={16} />
                Settings
              </Button>
            </div>
          </div>
        )}
        
        <div className={`grid gap-6 ${isFullscreen ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-3'}`}>
          {/* Left - Video Player */}
          <div className={`${isFullscreen ? 'col-span-1' : 'lg:col-span-2'}`}>
            <Card className="overflow-hidden border-0 shadow-lg">
              <div className="relative bg-black">
                {selectedLesson ? (
                  <>
                    <VideoPlayer 
                      url={selectedLesson.videoUrl || course.videoUrl} 
                      width="100%"
                      height="auto"
                      onEnded={handleVideoEnd}
                      playbackRate={playbackSpeed}
                    />
                    
                    <div className="absolute right-4 top-4 z-10 flex gap-2">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="h-8 w-8 rounded-full bg-black/40 p-0 text-white" 
                        onClick={toggleFullscreen}
                      >
                        {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="aspect-video flex items-center justify-center bg-gray-800 text-white">
                    <p>Please select a lesson to start learning</p>
                  </div>
                )}
              </div>
              
              {/* Video info */}
              {!isFullscreen && selectedLesson && (
                <CardContent className="p-6">
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-bold">{selectedLesson.title}</h2>
                      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock size={16} />
                          <span>{selectedLesson.duration}</span>
                        </div>
                        {selectedLesson.type && (
                          <Badge variant="outline" className="px-2 py-0.5 text-xs capitalize">
                            {selectedLesson.type}
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => markAsComplete(selectedLesson.id)} 
                        className={`gap-1 ${completedLessons.includes(selectedLesson.id) ? 'bg-green-50 text-green-600' : ''}`}
                      >
                        <CheckCircle size={16} />
                        {completedLessons.includes(selectedLesson.id) ? 'Completed' : 'Mark as Complete'}
                      </Button>
                      
                      <Button variant="outline" size="sm" className="gap-1" onClick={downloadMaterial}>
                        <Download size={16} />
                        Download Materials
                      </Button>
                    </div>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  {/* Lesson Navigation */}
                  <div className="flex items-center justify-between">
                    <Button 
                      variant="outline" 
                      onClick={() => prevLesson && selectLesson(prevLesson)} 
                      disabled={!prevLesson}
                      className="gap-1"
                    >
                      <ChevronLeft size={16} />
                      Previous Lesson
                    </Button>
                    
                    <Button 
                      onClick={() => nextLesson && selectLesson(nextLesson)} 
                      disabled={!nextLesson}
                      className="gap-1 bg-blue-600 hover:bg-blue-700"
                    >
                      Next Lesson
                      <ChevronRight size={16} />
                    </Button>
                  </div>
                </CardContent>
              )}
            </Card>
            
            {/* Settings panel */}
            {!isFullscreen && showSettings && (
              <Card className="mt-6 border border-blue-100">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-lg">Playback Settings</CardTitle>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={toggleSettings}>
                    <X size={16} />
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <h3 className="mb-2 text-sm font-medium">Playback Speed</h3>
                    <div className="flex flex-wrap gap-2">
                      {[0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map(speed => (
                        <Button 
                          key={speed} 
                          variant={playbackSpeed === speed ? "default" : "outline"} 
                          size="sm"
                          onClick={() => changePlaybackSpeed(speed)}
                        >
                          {speed}x
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Autoplay Next Lesson</span>
                    <Button 
                      variant={autoplay ? "default" : "outline"} 
                      size="sm"
                      onClick={() => setAutoplay(!autoplay)}
                    >
                      {autoplay ? "On" : "Off"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Notes section */}
            {!isFullscreen && showNotes && (
              <Card className="mt-6 border border-blue-100">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-lg">Personal Notes</CardTitle>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={toggleNotes}>
                    <X size={16} />
                  </Button>
                </CardHeader>
                <CardContent>
                  <Textarea 
                    className="min-h-[150px] w-full border border-gray-200 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Add your notes here..."
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                  />
                  <div className="mt-2 flex justify-end">
                    <Button className="gap-1 bg-blue-600 hover:bg-blue-700" onClick={saveNotes}>
                      <Save size={16} />
                      Save Notes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Additional learning resources */}
            {!isFullscreen && selectedLesson && (
              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                <Card className="border-blue-100">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="rounded-full bg-blue-100 p-2 text-blue-600">
                        <FileText size={24} />
                      </div>
                      <div>
                        <h3 className="font-medium">Supplementary Materials</h3>
                        <p className="mt-1 text-sm text-gray-600">Additional resources to deepen your understanding</p>
                        <Button variant="link" className="mt-2 h-auto p-0 text-blue-600" onClick={downloadMaterial}>
                          View Materials
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-blue-100">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="rounded-full bg-amber-100 p-2 text-amber-600">
                        <Lightbulb size={24} />
                      </div>
                      <div>
                        <h3 className="font-medium">Practice Exercises</h3>
                        <p className="mt-1 text-sm text-gray-600">Apply what you've learned with hands-on exercises</p>
                        <Button 
                          variant="link" 
                          className="mt-2 h-auto p-0 text-blue-600"
                          onClick={() => toast.info("Exercises will be available soon!")}
                        >
                          Start Practice
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
          
          {/* Right - Course outline */}
          {!isFullscreen && (
            <div className="lg:col-span-1">
              <Card className="overflow-hidden border-0 shadow-lg">
                <CardHeader className="border-b bg-blue-50 px-6 py-4">
                  <CardTitle className="text-lg font-medium">Course Content</CardTitle>
                </CardHeader>
                
                <CardContent className="p-0">
                  <div className="max-h-[calc(100vh-200px)] overflow-y-auto p-0">
                    <Accordion type="multiple" defaultValue={course.modules.map(m => m.id)}>
                      {course.modules.map((module, moduleIndex) => (
                        <AccordionItem key={module.id} value={module.id} className="border-0">
                          <AccordionTrigger className="px-6 py-4 hover:bg-gray-50">
                            <div className="flex flex-1 items-center justify-between">
                              <div className="text-left">
                                <div className="font-medium">{moduleIndex + 1}. {module.title}</div>
                                <div className="text-sm text-gray-500">{module.lessons.length} lessons • {module.duration}</div>
                              </div>
                              <div className="text-sm text-gray-500">
                                {module.lessons.filter(l => completedLessons.includes(l.id)).length}/{module.lessons.length}
                              </div>
                            </div>
                          </AccordionTrigger>
                          
                          <AccordionContent className="pb-0 pt-0">
                            <div className="flex flex-col border-t border-gray-100">
                              {module.lessons.map((lesson, lessonIndex) => {
                                const isSelected = selectedLesson?.id === lesson.id;
                                const isCompleted = completedLessons.includes(lesson.id);
                                const isVideo = lesson.type === 'video';
                                
                                // Get the appropriate icon based on lesson type
                                let LessonIcon = PlayCircle;
                                if (lesson.type === 'quiz') LessonIcon = Target;
                                if (lesson.type === 'exercise') LessonIcon = BookOpen;
                                if (lesson.type === 'project') LessonIcon = Zap;
                                
                                return (
                                  <div
                                    key={lesson.id}
                                    onClick={() => isVideo && selectLesson(lesson)}
                                    className={`
                                      flex cursor-pointer items-center justify-between border-b border-gray-100 px-6 py-3
                                      ${isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'}
                                      ${isVideo ? '' : 'cursor-not-allowed opacity-70'}
                                    `}
                                  >
                                    <div className="flex items-center gap-3">
                                      <div className={`
                                        flex h-8 w-8 items-center justify-center rounded-full
                                        ${isCompleted ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}
                                      `}>
                                        {isCompleted ? (
                                          <CheckCircle size={16} />
                                        ) : (
                                          <LessonIcon size={16} />
                                        )}
                                      </div>
                                      
                                      <div>
                                        <div className={`text-sm ${isSelected ? 'font-medium text-blue-600' : 'font-normal'}`}>
                                          {moduleIndex + 1}.{lessonIndex + 1} {lesson.title}
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                          <Clock size={12} />
                                          <span>{lesson.duration}</span>
                                          {lesson.isFree && (
                                            <Badge variant="outline" className="ml-1 border-green-200 bg-green-50 px-1 py-0 text-[10px] text-green-600">
                                              Free
                                            </Badge>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                    
                                    {!isVideo && <Lock size={14} className="text-gray-400" />}
                                  </div>
                                );
                              })}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                </CardContent>
              </Card>
              
              {/* Course Stats */}
              <Card className="mt-6">
                <CardContent className="p-6">
                  <h3 className="mb-4 font-medium">Your Learning Progress</h3>
                  
                  <div className="mb-4 flex justify-between text-sm">
                    <span>Completed</span>
                    <span className="font-medium">
                      {completedLessons.length}/{totalLessons} lessons
                    </span>
                  </div>
                  
                  <div className="mb-6 h-2 overflow-hidden rounded-full bg-gray-200">
                    <div 
                      className="h-full rounded-full bg-blue-600" 
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-lg bg-blue-50 p-3">
                      <div className="mb-1 flex items-center gap-2">
                        <Clock size={16} className="text-blue-600" />
                        <span className="text-sm font-medium text-gray-700">Study Time</span>
                      </div>
                      <p className="text-lg font-medium text-blue-600">{formatStudyTime(studyTime)}</p>
                    </div>
                    
                    <div className="rounded-lg bg-green-50 p-3">
                      <div className="mb-1 flex items-center gap-2">
                        <Users size={16} className="text-green-600" />
                        <span className="text-sm font-medium text-gray-700">Fellow Students</span>
                      </div>
                      <p className="text-lg font-medium text-green-600">{course.enrollmentCount}</p>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <Button 
                      variant="outline" 
                      className="w-full gap-2" 
                      onClick={askInstructor}
                    >
                      <MessageSquare size={16} />
                      Ask Instructor
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LearnPage;
