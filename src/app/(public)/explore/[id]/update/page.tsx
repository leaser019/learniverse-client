"use client";

import { Title } from "@/components/layout/Title";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { deleteCourse, updateCourse } from '@/redux/slices/courseSlice';
import { Course, Lesson, Module } from '@/types/course';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ArrowLeft,
  Edit,
  GripVertical,
  MoveVertical,
  Pencil,
  Plus,
  Save,
  Trash2,
  X,
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import * as z from 'zod';
import { FailureModal } from './../../../../../components/modal/FailureModal';
import { SuccessModal } from './../../../../../components/modal/SuccessModal';

const formSchema = z.object({
  title: z.string().min(5, 'Course title must be at least 5 characters long'),
  description: z.string().min(20, 'Course description must be at least 20 characters long'),
  instructor: z.string().min(2, 'Instructor name must be at least 2 characters long'),
  instructorRole: z.string().min(2, 'Instructor role must be at least 2 characters long'),
  bio: z.string().min(20, 'Instructor bio must be at least 20 characters long'),
  thumbnailUrl: z.string().url('Invalid image URL'),
  videoUrl: z.string().url('Invalid video URL'),
  duration: z.string().min(2, 'Invalid course duration'),
  level: z.string(),
  language: z.string().min(2, 'Invalid language'),
  price: z.coerce.number().min(0, 'Price cannot be negative'),
  discount: z.coerce.number().min(0).max(1, 'Discount must be between 0 and 1'),
});

export default function UpdateCoursePage() {
  const router = useRouter();
  const params = useParams();
  const courses = useSelector((state) => state.courses.courses);
  const courseId = params?.id as string;
  const dispatch = useDispatch();

  const courseLevels = ['Beginner', 'Intermediate', 'Advanced', 'All Levels'];
  const allCategories = Array.from(new Set(courses.flatMap((c) => c.categories)));

  const [categories, setCategories] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [requirements, setRequirements] = useState<string[]>([]);
  const [whatYouWillLearn, setWhatYouWillLearn] = useState<string[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [courseData, setCourseData] = useState<Course | null>(null);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [failureModalOpen, setFailureModalOpen] = useState(false);
  const [message, setMessage] = useState('');

  // Input states for dynamic arrays
  const [categoryInput, setCategoryInput] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [skillInput, setSkillInput] = useState('');
  const [requirementInput, setRequirementInput] = useState('');
  const [learnInput, setLearnInput] = useState('');

  // Form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      instructor: '',
      instructorRole: '',
      bio: '',
      thumbnailUrl: '',
      videoUrl: '',
      duration: '',
      level: 'All Levels',
      language: 'Tiếng Việt',
      price: 0,
      discount: 0,
    },
  });

  // Load course data từ ID
  useEffect(() => {
    const course = courses.find((c) => c.id === courseId);
    setCourseData(course);
    if (!course) {
      alert('Can not find course!');
      router.push('/explore');
      return;
    }

    // Cập nhật form values
    form.reset({
      title: course.title,
      description: course.description,
      instructor: course.instructor,
      instructorRole: course.instructorRole,
      bio: course.bio,
      thumbnailUrl: course.thumbnailUrl,
      videoUrl: course.videoUrl,
      duration: course.duration,
      level: course.level,
      language: course.language,
      price: course.price,
      discount: course.discount,
    });

    // Cập nhật các state arrays
    setCategories(course.categories);
    setTags(course.tags || []);
    setSkills(course.skills);
    setRequirements(course.requirements);
    setWhatYouWillLearn(course.whatYouWillLearn);
    setModules(course.modules);
  }, [courseId, courses, form, router]);

  // Helper functions cho các mảng động
  const addToArray = (
    value: string,
    array: string[],
    setArray: React.Dispatch<React.SetStateAction<string[]>>,
    setInputValue: React.Dispatch<React.SetStateAction<string>>
  ) => {
    if (value.trim() && !array.includes(value.trim())) {
      setArray([...array, value.trim()]);
      setInputValue('');
    }
  };

  const removeFromArray = (
    value: string,
    array: string[],
    setArray: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setArray(array.filter((item) => item !== value));
  };

  // Xử lý Module và Lessons
  const addModule = () => {
    const newModule: Module = {
      id: `module-${modules.length + 1}`,
      title: `Module ${modules.length + 1}`,
      duration: '0h 0m',
      lessons: [],
    };
    setModules([...modules, newModule]);
  };

  const updateModule = (index: number, field: keyof Module, value: string) => {
    const newModules = [...modules];
    newModules[index][field] = value;
    setModules(newModules);
  };

  const removeModule = (index: number) => {
    setModules(modules.filter((_, i) => i !== index));
  };

  const addLesson = (moduleIndex: number) => {
    const newLesson: Lesson = {
      id: `lesson-${moduleIndex + 1}-${modules[moduleIndex].lessons.length + 1}`,
      title: `Lesson ${modules[moduleIndex].lessons.length + 1}`,
      duration: '0m',
      isFree: false,
      type: 'video',
      videoUrl: 'https://youtu.be/dGcsHMXbSOA',
    };

    const newModules = [...modules];
    newModules[moduleIndex].lessons = [...newModules[moduleIndex].lessons, newLesson];
    setModules(newModules);
  };

  const updateLesson = (
    moduleIndex: number,
    lessonIndex: number,
    field: keyof Lesson,
    value: any
  ) => {
    const newModules = [...modules];
    newModules[moduleIndex].lessons[lessonIndex][field] = value;
    setModules(newModules);
  };

  const removeLesson = (moduleIndex: number, lessonIndex: number) => {
    const newModules = [...modules];
    newModules[moduleIndex].lessons = newModules[moduleIndex].lessons.filter(
      (_, i) => i !== lessonIndex
    );
    setModules(newModules);
  };

  // Xóa khóa học
  const handleDeleteCourse = () => {
    try {
      dispatch(deleteCourse(courseId));
      console.log('Đã xóa khóa học:', courseId);
      setMessage('Course deleted successfully');
      setSuccessModalOpen(true);
    } catch (error) {
      console.error('Error deleting course:', error);
      setFailureModalOpen(true);
      return;
    }
  };

  // Form submission
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // Kiểm tra các mảng bắt buộc không được rỗng
    if (categories.length === 0) {
      alert('Please add at least one category for the course');
      return;
    }
    if (skills.length === 0) {
      alert('Please add at least one skill for the course');
      return;
    }
    if (requirements.length === 0) {
      alert('Please add at least one requirement for the course');
      return;
    }
    if (whatYouWillLearn.length === 0) {
      alert('Please add at least one thing learners will gain from the course');
      return;
    }
    if (modules.length === 0) {
      alert('Please add at least one module for the course');
      return;
    }

    // Dữ liệu khóa học cập nhật
    const updatedCourse: Course = {
      id: courseId,
      slug: courseId,
      ...values,
      instructorAvatarUrl: 'https://i.pravatar.cc/150?img=10',
      rating: 0,
      reviewCount: 0,
      enrollmentCount: 0,
      lastUpdate: new Date().toLocaleDateString('vi-VN', {
        month: 'long',
        year: 'numeric',
      }),
      originalPrice: values.price,
      isNew: false,
      previewAvailable: true,
      categories,
      tags: tags.length > 0 ? tags : undefined,
      skills,
      requirements,
      whatYouWillLearn,
      modules,
      reviews: [],
      faq: [],
      relatedCourseIds: [],
    };

    try {
      await dispatch(updateCourse({ id: courseId, courseData: updatedCourse }));
      setMessage('Course updated successfully!');
      setSuccessModalOpen(true);
      console.log('Khóa học đã được cập nhật:', updatedCourse);
    } catch (error) {
      console.error('Error updating course:', error);
      setFailureModalOpen(true);
      return;
    }
  };

  // Thêm các states mới cho việc chỉnh sửa module
  const [moduleEditOpen, setModuleEditOpen] = useState(false);
  const [currentEditModule, setCurrentEditModule] = useState<Module | null>(null);
  const [currentModuleIndex, setCurrentModuleIndex] = useState<number>(-1);
  const [tempModuleData, setTempModuleData] = useState<Module | null>(null);

  // Hàm xử lý khi mở modal chỉnh sửa module
  const handleEditModule = (moduleIndex: number) => {
    setCurrentModuleIndex(moduleIndex);
    setCurrentEditModule(modules[moduleIndex]);
    setTempModuleData(JSON.parse(JSON.stringify(modules[moduleIndex]))); // Deep copy
    setModuleEditOpen(true);
  };

  // Lưu thay đổi cho module đang được chỉnh sửa
  const saveModuleChanges = () => {
    if (tempModuleData && currentModuleIndex >= 0) {
      const newModules = [...modules];
      newModules[currentModuleIndex] = tempModuleData;
      setModules(newModules);
      setModuleEditOpen(false);
    }
  };

  // Cập nhật dữ liệu tạm thời của module
  const updateTempModule = (field: keyof Module, value: string) => {
    if (tempModuleData) {
      setTempModuleData({
        ...tempModuleData,
        [field]: value
      });
    }
  };

  // Cập nhật bài học trong modal chỉnh sửa
  const updateTempLesson = (lessonIndex: number, field: keyof Lesson, value: any) => {
    if (!tempModuleData) return;
    
    const newLessons = [...tempModuleData.lessons];
    newLessons[lessonIndex] = {
      ...newLessons[lessonIndex],
      [field]: value
    };
    
    setTempModuleData({
      ...tempModuleData,
      lessons: newLessons
    });
  };

  // Thêm bài học mới trong modal
  const addTempLesson = () => {
    if (!tempModuleData) return;
    
    const newLesson: Lesson = {
      id: `lesson-${currentModuleIndex + 1}-${tempModuleData.lessons.length + 1}`,
      title: `Lesson ${tempModuleData.lessons.length + 1}`,
      duration: '0m',
      isFree: false,
      type: 'video',
      videoUrl: 'https://youtu.be/dGcsHMXbSOA',
    };
    
    setTempModuleData({
      ...tempModuleData,
      lessons: [...tempModuleData.lessons, newLesson]
    });
  };

  // Xóa bài học trong modal
  const removeTempLesson = (lessonIndex: number) => {
    if (!tempModuleData) return;
    
    const newLessons = tempModuleData.lessons.filter((_, i) => i !== lessonIndex);
    setTempModuleData({
      ...tempModuleData,
      lessons: newLessons
    });
  };

  // Xử lý kéo thả để sắp xếp lại modules
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    
    const { source, destination, type } = result;
    
    if (type === 'module') {
      const reorderedModules = Array.from(modules);
      const [removed] = reorderedModules.splice(source.index, 1);
      reorderedModules.splice(destination.index, 0, removed);
      setModules(reorderedModules);
      return;
    }
    
    if (type === 'lesson') {
      // Extract module ID from droppableId which should be in format "lessons-{moduleIndex}"
      const sourceModuleIndex = parseInt(source.droppableId.split('-')[1]);
      const destModuleIndex = parseInt(destination.droppableId.split('-')[1]);
      
      const newModules = [...modules];
      
      // Same module, just reordering lessons
      if (sourceModuleIndex === destModuleIndex) {
        const moduleToUpdate = {...newModules[sourceModuleIndex]};
        const lessons = Array.from(moduleToUpdate.lessons);
        const [removed] = lessons.splice(source.index, 1);
        lessons.splice(destination.index, 0, removed);
        moduleToUpdate.lessons = lessons;
        newModules[sourceModuleIndex] = moduleToUpdate;
      } else {
        // Moving lessons between modules
        const sourceModule = {...newModules[sourceModuleIndex]};
        const destModule = {...newModules[destModuleIndex]};
        
        const sourceLessons = Array.from(sourceModule.lessons);
        const [removed] = sourceLessons.splice(source.index, 1);
        sourceModule.lessons = sourceLessons;
        
        const destLessons = Array.from(destModule.lessons);
        destLessons.splice(destination.index, 0, removed);
        destModule.lessons = destLessons;
        
        newModules[sourceModuleIndex] = sourceModule;
        newModules[destModuleIndex] = destModule;
      }
      
      setModules(newModules);
    }
  };

  // Hàm tính tổng thời lượng của module dựa trên các bài học
  const calculateModuleDuration = (moduleIndex: number) => {
    const module = modules[moduleIndex];
    let totalMinutes = 0;
    
    // Tính tổng thời lượng từ các bài học
    module.lessons.forEach(lesson => {
      const durationString = lesson.duration;
      // Trích xuất số phút từ chuỗi thời lượng (vd: "45m" -> 45)
      const minutes = parseInt(durationString.replace(/[^0-9]/g, '')) || 0;
      totalMinutes += minutes;
    });
    
    // Chuyển đổi phút thành format "Xh Ym"
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const formattedDuration = `${hours > 0 ? hours + 'h ' : ''}${minutes > 0 ? minutes + 'm' : ''}`;
    
    // Cập nhật thời lượng cho module
    updateModule(moduleIndex, 'duration', formattedDuration.trim() || '0m');
  };

  return (
    <>
      <SuccessModal
        isOpen={successModalOpen}
        onClose={() => {
          setSuccessModalOpen(false);
          router.push('/explore');
        }}
        title="Success"
        message={message}
      />
      <FailureModal
        isOpen={failureModalOpen}
        onClose={() => setFailureModalOpen(false)}
        title="Error"
        message={message}
      />
      <div className="container mx-auto max-w-5xl px-4 py-2">
        <Title
          title="Update Course"
          description="Edit and update the content of your course."
          accentColor="amber"
        />

        <div className="mb-6 flex justify-between">
          <Button variant="outline" onClick={() => router.push('/explore')}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>

          <Button variant="destructive" onClick={() => setShowDeleteDialog(true)} className="gap-2">
            <Trash2 className="h-4 w-4" /> Delete Course
          </Button>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Enter the main information about your course</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Course Title</FormLabel>
                      <FormControl>
                        <Input placeholder="React: The Complete Guide" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Course Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Detailed description of your course..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="thumbnailUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Thumbnail URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://example.com/image.jpg" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="videoUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Video URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://youtube.com/embed/xyz" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Instructor Information</CardTitle>
                <CardDescription>Information about the person teaching this course</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="instructor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Instructor Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Nguyễn Văn A" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="instructorRole"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Instructor Role</FormLabel>
                        <FormControl>
                          <Input placeholder="Senior Developer" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bio</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Information about the instructor's experience..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Course Details</CardTitle>
                <CardDescription>
                  Information about the level, price, and other details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <FormField
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Duration</FormLabel>
                        <FormControl>
                          <Input placeholder="12h 30m" {...field} />
                        </FormControl>
                        <FormDescription>
                          For example: &apos;5h 30m&apos;, &apos;12h 45m&apos;
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="level"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Level</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {courseLevels.map((level) => (
                              <SelectItem key={level} value={level}>
                                {level}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="language"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Language</FormLabel>
                        <FormControl>
                          <Input placeholder="Vietnamese" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price (VND)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="0" min="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="discount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Discount (0-1)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0"
                            min="0"
                            max="1"
                            step="0.01"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>For example: 0.2 = 20% off, 0.5 = 50% off</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Categories & Keywords</CardTitle>
                <CardDescription>Classify and search for your course</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <FormLabel>Categories</FormLabel>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {categories.map((cat) => (
                      <div
                        key={cat}
                        className="flex items-center bg-slate-100 rounded-md px-2 py-1"
                      >
                        <span>{cat}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 ml-1"
                          onClick={() => removeFromArray(cat, categories, setCategories)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <div className="flex mt-2">
                    <Select
                      onValueChange={(value) => {
                        if (value && !categories.includes(value)) {
                          setCategories([...categories, value]);
                        }
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Chọn danh mục" />
                      </SelectTrigger>
                      <SelectContent>
                        {allCategories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex mt-2">
                    <Input
                      placeholder="Hoặc nhập danh mục mới..."
                      value={categoryInput}
                      onChange={(e) => setCategoryInput(e.target.value)}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="ml-2"
                      onClick={() =>
                        addToArray(categoryInput, categories, setCategories, setCategoryInput)
                      }
                    >
                      Add
                    </Button>
                  </div>
                  {categories.length === 0 && (
                    <p className="text-sm text-red-500 mt-2">Please add at least one category</p>
                  )}
                </div>

                <div>
                  <FormLabel>Keywords</FormLabel>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {tags.map((tag) => (
                      <div
                        key={tag}
                        className="flex items-center bg-slate-100 rounded-md px-2 py-1"
                      >
                        <span>{tag}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 ml-1"
                          onClick={() => removeFromArray(tag, tags, setTags)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <div className="flex mt-2">
                    <Input
                      placeholder="Enter keywords..."
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="ml-2"
                      onClick={() => addToArray(tagInput, tags, setTags, setTagInput)}
                    >
                      Add
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Skills & Requirements</CardTitle>
                <CardDescription>Skills learners will gain and prerequisites</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <FormLabel>Skills to be Acquired</FormLabel>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {skills.map((skill) => (
                      <div
                        key={skill}
                        className="flex items-center bg-slate-100 rounded-md px-2 py-1"
                      >
                        <span>{skill}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 ml-1"
                          onClick={() => removeFromArray(skill, skills, setSkills)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <div className="flex mt-2">
                    <Input
                      placeholder="Nhập kỹ năng..."
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="ml-2"
                      onClick={() => addToArray(skillInput, skills, setSkills, setSkillInput)}
                    >
                      Add Skill
                    </Button>
                  </div>
                  {skills.length === 0 && (
                    <p className="text-sm text-red-500 mt-2">Please add at least one skill</p>
                  )}
                </div>

                <div>
                  <FormLabel>Prerequisites</FormLabel>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {requirements.map((req) => (
                      <div
                        key={req}
                        className="flex items-center bg-slate-100 rounded-md px-2 py-1"
                      >
                        <span>{req}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 ml-1"
                          onClick={() => removeFromArray(req, requirements, setRequirements)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <div className="flex mt-2">
                    <Input
                      placeholder="Nhập yêu cầu..."
                      value={requirementInput}
                      onChange={(e) => setRequirementInput(e.target.value)}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="ml-2"
                      onClick={() =>
                        addToArray(
                          requirementInput,
                          requirements,
                          setRequirements,
                          setRequirementInput
                        )
                      }
                    >
                      Add Requirement
                    </Button>
                  </div>
                  {requirements.length === 0 && (
                    <p className="text-sm text-red-500 mt-2">
                      Please add at least one prerequisite
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>What Learners Will Gain</CardTitle>
                <CardDescription>List what learners will gain from the course</CardDescription>
              </CardHeader>
              <CardContent>
                <div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {whatYouWillLearn.map((item) => (
                      <div
                        key={item}
                        className="flex items-center bg-slate-100 rounded-md px-2 py-1"
                      >
                        <span>{item}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 ml-1"
                          onClick={() =>
                            removeFromArray(item, whatYouWillLearn, setWhatYouWillLearn)
                          }
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <div className="flex mt-2">
                    <Input
                      placeholder="Nhập điều học viên sẽ học được..."
                      value={learnInput}
                      onChange={(e) => setLearnInput(e.target.value)}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="ml-2"
                      onClick={() =>
                        addToArray(learnInput, whatYouWillLearn, setWhatYouWillLearn, setLearnInput)
                      }
                    >
                      Add
                    </Button>
                  </div>
                  {whatYouWillLearn.length === 0 && (
                    <p className="text-sm text-red-500 mt-2">
                      Please add at least one thing learners will gain from this course
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Course Content</CardTitle>
                  <CardDescription>Add modules and lessons to the course</CardDescription>
                </div>
                <Button type="button" variant="outline" onClick={addModule} className="gap-1">
                  <Plus className="h-4 w-4" /> Add Module
                </Button>
              </CardHeader>
              <CardContent>
                {modules.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No modules added yet. Please add your first module!</p>
                  </div>
                ) : (
                  <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="modules" type="module">
                      {(provided) => (
                        <div 
                          className="space-y-6" 
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                        >
                          {modules.map((module, moduleIndex) => (
                            <Draggable key={module.id} draggableId={module.id} index={moduleIndex}>
                              {(provided) => (
                                <div 
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  className="border rounded-lg p-4 space-y-4"
                                >
                                  <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                      <div {...provided.dragHandleProps} className="cursor-move">
                                        <GripVertical className="h-5 w-5 text-slate-400" />
                                      </div>
                                      <h3 className="text-lg font-medium">
                                        Module {moduleIndex + 1}: {module.title}
                                      </h3>
                                    </div>
                                    <div className="flex gap-2">
                                      <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleEditModule(moduleIndex)}
                                        className="h-8"
                                      >
                                        <Edit className="h-4 w-4 mr-1" /> Edit
                                      </Button>
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={() => removeModule(moduleIndex)}
                                        className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                                      >
                                        <X className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div>
                                      <FormLabel>Title</FormLabel>
                                      <div className="flex items-center mt-1">
                                        <Input
                                          value={module.title}
                                          onChange={(e) => updateModule(moduleIndex, 'title', e.target.value)}
                                          className="bg-slate-50"
                                        />
                                      </div>
                                    </div>
                                    <div>
                                      <FormLabel>Duration</FormLabel>
                                      <div className="flex items-center gap-2 mt-1">
                                        <Input
                                          value={module.duration}
                                          onChange={(e) => updateModule(moduleIndex, 'duration', e.target.value)}
                                          placeholder="e.g. 2h 30m"
                                          className="bg-slate-50"
                                        />
                                        <Button
                                          type="button"
                                          variant="outline"
                                          size="sm"
                                          onClick={() => calculateModuleDuration(moduleIndex)}
                                          className="whitespace-nowrap"
                                        >
                                          Auto Calculate
                                        </Button>
                                      </div>
                                    </div>
                                  </div>

                                  <Separator className="my-4" />

                                  <div>
                                    <div className="flex justify-between items-center mb-2">
                                      <h4 className="font-medium">Lessons ({module.lessons.length})</h4>
                                      <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => addLesson(moduleIndex)}
                                        size="sm"
                                        className="gap-1"
                                      >
                                        <Plus className="h-3 w-3" /> Add Lesson
                                      </Button>
                                    </div>

                                    {module.lessons.length === 0 ? (
                                      <p className="text-sm text-muted-foreground bg-slate-50 p-3 rounded-md">
                                        No lessons added yet. Please add your first lesson!
                                      </p>
                                    ) : (
                                      <Droppable droppableId={`lessons-${moduleIndex}`} type="lesson">
                                        {(provided) => (
                                          <div 
                                            className="space-y-2"
                                            ref={provided.innerRef}
                                            {...provided.droppableProps}
                                          >
                                            {module.lessons.map((lesson, lessonIndex) => (
                                              <Draggable 
                                                key={lesson.id} 
                                                draggableId={lesson.id} 
                                                index={lessonIndex}
                                              >
                                                {(provided) => (
                                                  <div 
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    className="border rounded-md p-3 bg-white hover:bg-slate-50 transition-colors"
                                                  >
                                                    <div className="flex items-center justify-between">
                                                      <div className="flex items-center gap-2">
                                                        <div {...provided.dragHandleProps} className="cursor-move">
                                                          <MoveVertical className="h-4 w-4 text-slate-400" />
                                                        </div>
                                                        <div>
                                                          <h5 className="text-sm font-medium">
                                                            {lesson.title}
                                                          </h5>
                                                          <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                                                            <span>{lesson.type}</span>
                                                            <span>•</span>
                                                            <span>{lesson.duration}</span>
                                                            {lesson.isFree && (
                                                              <>
                                                                <span>•</span>
                                                                <span className="bg-green-100 text-green-700 px-1 rounded">Free</span>
                                                              </>
                                                            )}
                                                          </div>
                                                        </div>
                                                      </div>
                                                      <Button
                                                        type="button"
                                                        variant="ghost"
                                                        onClick={() => removeLesson(moduleIndex, lessonIndex)}
                                                        size="sm"
                                                        className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                                                      >
                                                        <X className="h-3 w-3" />
                                                      </Button>
                                                    </div>
                                                  </div>
                                                )}
                                              </Draggable>
                                            ))}
                                            {provided.placeholder}
                                          </div>
                                        )}
                                      </Droppable>
                                    )}
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                )}
                {modules.length === 0 && (
                  <p className="text-sm text-red-500 mt-2">Please add at least one module</p>
                )}
              </CardContent>
            </Card>

            <CardFooter className="flex justify-end space-x-4 border rounded-lg py-4">
              <Button type="button" variant="outline" onClick={() => router.push('/explore')}>
                Cancel
              </Button>
              <Button type="submit" className="gap-2 bg-amber-600 hover:bg-amber-700">
                <Pencil className="h-4 w-4" /> Update Course
              </Button>
            </CardFooter>
          </form>
        </Form>

        {/* Dialog xóa khóa học */}
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Course Deletion</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this course? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteCourse}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Modal chỉnh sửa module */}
        <Dialog open={moduleEditOpen} onOpenChange={setModuleEditOpen}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Module</DialogTitle>
            </DialogHeader>
            
            {tempModuleData && (
              <div className="space-y-6 py-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium">Module Title</label>
                    <Input
                      value={tempModuleData.title}
                      onChange={(e) => updateTempModule('title', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Duration</label>
                    <Input
                      value={tempModuleData.duration}
                      onChange={(e) => updateTempModule('duration', e.target.value)}
                      placeholder="e.g. 2h 30m"
                    />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-medium">Lessons ({tempModuleData.lessons.length})</h3>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addTempLesson}
                      size="sm"
                      className="gap-1"
                    >
                      <Plus className="h-3 w-3" /> Add Lesson
                    </Button>
                  </div>
                  
                  <div className="space-y-4 max-h-[50vh] overflow-y-auto p-1">
                    {tempModuleData.lessons.map((lesson, lessonIndex) => (
                      <div key={lesson.id} className="border rounded-md p-3 space-y-3">
                        <div className="flex justify-between items-center">
                          <h4 className="font-medium">Lesson {lessonIndex + 1}</h4>
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={() => removeTempLesson(lessonIndex)}
                            size="sm"
                            className="h-6 w-6 p-0 text-red-500 hover:bg-red-50"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                          <div>
                            <label className="text-xs font-medium">Title</label>
                            <Input
                              className="h-8 text-sm"
                              value={lesson.title}
                              onChange={(e) => updateTempLesson(lessonIndex, 'title', e.target.value)}
                            />
                          </div>
                          <div>
                            <label className="text-xs font-medium">Duration</label>
                            <Input
                              className="h-8 text-sm"
                              value={lesson.duration}
                              onChange={(e) => updateTempLesson(lessonIndex, 'duration', e.target.value)}
                              placeholder="vd: 45m"
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                          <div>
                            <label className="text-xs font-medium">Type</label>
                            <Select
                              value={lesson.type}
                              onValueChange={(value) => updateTempLesson(lessonIndex, 'type', value as any)}
                            >
                              <SelectTrigger className="h-8 text-sm">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="video">Video</SelectItem>
                                <SelectItem value="exercise">Exercise</SelectItem>
                                <SelectItem value="quiz">Quiz</SelectItem>
                                <SelectItem value="project">Project</SelectItem>
                                <SelectItem value="challenge">Challenge</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id={`modal-free-${lesson.id}`}
                              checked={lesson.isFree}
                              onChange={(e) => updateTempLesson(lessonIndex, 'isFree', e.target.checked)}
                              className="mr-2"
                            />
                            <label
                              htmlFor={`modal-free-${lesson.id}`}
                              className="text-xs"
                            >
                              Free Lesson
                            </label>
                          </div>
                        </div>
                        
                        {lesson.type === 'video' && (
                          <div>
                            <label className="text-xs font-medium">Video URL</label>
                            <Input
                              className="h-8 text-sm"
                              value={lesson.videoUrl || ''}
                              onChange={(e) => updateTempLesson(lessonIndex, 'videoUrl', e.target.value)}
                              placeholder="https://youtu.be/..."
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setModuleEditOpen(false)}>Cancel</Button>
              <Button onClick={saveModuleChanges} className="gap-2">
                <Save className="h-4 w-4" /> Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
