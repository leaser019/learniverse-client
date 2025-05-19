"use client";

import { Title } from "@/components/layout/Title";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { courses } from "@/data/course";
import { Course, Lesson, Module } from "@/types/course";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Pencil, Plus, Trash2, X } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

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

const courseLevels = ['Beginner', 'Intermediate', 'Advanced', 'All Levels'];
const allCategories = Array.from(new Set(courses.flatMap((c) => c.categories)));

export default function UpdateCoursePage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params?.id as string;

  const [categories, setCategories] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [requirements, setRequirements] = useState<string[]>([]);
  const [whatYouWillLearn, setWhatYouWillLearn] = useState<string[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

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

    if (!course) {
      alert('Không tìm thấy khóa học!');
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
  }, [courseId, form, router]);

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
    console.log('Đã xóa khóa học:', courseId);
    alert(`Đã xóa khóa học ${courseId} thành công!`);
    router.push('/explore');
  };

  // Form submission
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // Kiểm tra các mảng bắt buộc không được rỗng
    if (categories.length === 0) {
      alert('Vui lòng thêm ít nhất một danh mục cho khóa học');
      return;
    }
    if (skills.length === 0) {
      alert('Vui lòng thêm ít nhất một kỹ năng cho khóa học');
      return;
    }
    if (requirements.length === 0) {
      alert('Vui lòng thêm ít nhất một yêu cầu cho khóa học');
      return;
    }
    if (whatYouWillLearn.length === 0) {
      alert('Vui lòng thêm ít nhất một điều học viên sẽ học được');
      return;
    }
    if (modules.length === 0) {
      alert('Vui lòng thêm ít nhất một module cho khóa học');
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

    console.log('Khóa học đã được cập nhật:', updatedCourse);
    alert('Cập nhật khóa học thành công!');
    router.push('/explore');
  };

  return (
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
              <CardTitle>Thông tin cơ bản</CardTitle>
              <CardDescription>Nhập thông tin chính về khóa học của bạn</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tiêu đề khóa học</FormLabel>
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
                    <FormLabel>Mô tả khóa học</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Mô tả chi tiết về khóa học của bạn..."
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
                      <FormLabel>URL ảnh thumbnail</FormLabel>
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
                      <FormLabel>URL video giới thiệu</FormLabel>
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
              <CardTitle>Thông tin giảng viên</CardTitle>
              <CardDescription>Thông tin về người sẽ giảng dạy khóa học này</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="instructor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tên giảng viên</FormLabel>
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
                      <FormLabel>Chức danh</FormLabel>
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
                    <FormLabel>Tiểu sử</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Thông tin về kinh nghiệm của giảng viên..."
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
              <CardTitle>Chi tiết khóa học</CardTitle>
              <CardDescription>Thông tin về mức độ, giá cả và các chi tiết khác</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Thời lượng</FormLabel>
                      <FormControl>
                        <Input placeholder="12h 30m" {...field} />
                      </FormControl>
                      <FormDescription>
                        Ví dụ: &apos;5h 30m&apos;, &apos;12h 45m&apos;
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
                      <FormLabel>Cấp độ</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn cấp độ" />
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
                      <FormLabel>Ngôn ngữ</FormLabel>
                      <FormControl>
                        <Input placeholder="Tiếng Việt" {...field} />
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
                      <FormLabel>Giá (VND)</FormLabel>
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
                      <FormLabel>Giảm giá (0-1)</FormLabel>
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
                      <FormDescription>Ví dụ: 0.2 = giảm 20%, 0.5 = giảm 50%</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Danh mục & Từ khóa</CardTitle>
              <CardDescription>Phân loại và tìm kiếm khóa học của bạn</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <FormLabel>Danh mục</FormLabel>
                <div className="flex flex-wrap gap-2 mt-2">
                  {categories.map((cat) => (
                    <div key={cat} className="flex items-center bg-slate-100 rounded-md px-2 py-1">
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
                    Thêm
                  </Button>
                </div>
                {categories.length === 0 && (
                  <p className="text-sm text-red-500 mt-2">Vui lòng thêm ít nhất một danh mục</p>
                )}
              </div>

              <div>
                <FormLabel>Từ khóa</FormLabel>
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map((tag) => (
                    <div key={tag} className="flex items-center bg-slate-100 rounded-md px-2 py-1">
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
                    placeholder="Nhập từ khóa..."
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="ml-2"
                    onClick={() => addToArray(tagInput, tags, setTags, setTagInput)}
                  >
                    Thêm
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Kỹ năng & Yêu cầu</CardTitle>
              <CardDescription>Kỹ năng học viên sẽ đạt được và yêu cầu đầu vào</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <FormLabel>Kỹ năng sẽ đạt được</FormLabel>
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
                    Thêm
                  </Button>
                </div>
                {skills.length === 0 && (
                  <p className="text-sm text-red-500 mt-2">Vui lòng thêm ít nhất một kỹ năng</p>
                )}
              </div>

              <div>
                <FormLabel>Yêu cầu đầu vào</FormLabel>
                <div className="flex flex-wrap gap-2 mt-2">
                  {requirements.map((req) => (
                    <div key={req} className="flex items-center bg-slate-100 rounded-md px-2 py-1">
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
                    Thêm
                  </Button>
                </div>
                {requirements.length === 0 && (
                  <p className="text-sm text-red-500 mt-2">Vui lòng thêm ít nhất một yêu cầu</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Điều học viên sẽ học được</CardTitle>
              <CardDescription>Liệt kê những gì học viên sẽ học được sau khóa học</CardDescription>
            </CardHeader>
            <CardContent>
              <div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {whatYouWillLearn.map((item) => (
                    <div key={item} className="flex items-center bg-slate-100 rounded-md px-2 py-1">
                      <span>{item}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 ml-1"
                        onClick={() => removeFromArray(item, whatYouWillLearn, setWhatYouWillLearn)}
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
                    Thêm
                  </Button>
                </div>
                {whatYouWillLearn.length === 0 && (
                  <p className="text-sm text-red-500 mt-2">
                    Vui lòng thêm ít nhất một điều học viên sẽ học được
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Nội dung khóa học</CardTitle>
                <CardDescription>Thêm các module và bài học cho khóa học</CardDescription>
              </div>
              <Button type="button" variant="outline" onClick={addModule} className="gap-1">
                <Plus className="h-4 w-4" /> Thêm Module
              </Button>
            </CardHeader>
            <CardContent>
              {modules.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Chưa có module nào. Hãy thêm module đầu tiên!</p>
                </div>
              ) : (
                <div className="space-y-8">
                  {modules.map((module, moduleIndex) => (
                    <div key={module.id} className="border rounded-lg p-4 space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-medium">Module {moduleIndex + 1}</h3>
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => removeModule(moduleIndex)}
                          className="h-8 w-8 p-0"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                          <FormLabel>Tiêu đề</FormLabel>
                          <Input
                            value={module.title}
                            onChange={(e) => updateModule(moduleIndex, 'title', e.target.value)}
                          />
                        </div>
                        <div>
                          <FormLabel>Thời lượng</FormLabel>
                          <Input
                            value={module.duration}
                            onChange={(e) => updateModule(moduleIndex, 'duration', e.target.value)}
                            placeholder="vd: 2h 30m"
                          />
                        </div>
                      </div>

                      <Separator className="my-4" />

                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <h4 className="font-medium">Bài học</h4>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => addLesson(moduleIndex)}
                            size="sm"
                            className="gap-1"
                          >
                            <Plus className="h-3 w-3" /> Thêm bài học
                          </Button>
                        </div>

                        {module.lessons.length === 0 ? (
                          <p className="text-sm text-muted-foreground">
                            Module này chưa có bài học nào
                          </p>
                        ) : (
                          <div className="space-y-3">
                            {module.lessons.map((lesson, lessonIndex) => (
                              <div key={lesson.id} className="border rounded-md p-3 space-y-3">
                                <div className="flex justify-between items-center">
                                  <h5 className="text-sm font-medium">Bài {lessonIndex + 1}</h5>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => removeLesson(moduleIndex, lessonIndex)}
                                    size="sm"
                                    className="h-6 w-6 p-0"
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                </div>

                                <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                                  <div>
                                    <FormLabel className="text-xs">Tiêu đề</FormLabel>
                                    <Input
                                      className="h-8 text-sm"
                                      value={lesson.title}
                                      onChange={(e) =>
                                        updateLesson(
                                          moduleIndex,
                                          lessonIndex,
                                          'title',
                                          e.target.value
                                        )
                                      }
                                    />
                                  </div>
                                  <div>
                                    <FormLabel className="text-xs">Thời lượng</FormLabel>
                                    <Input
                                      className="h-8 text-sm"
                                      value={lesson.duration}
                                      onChange={(e) =>
                                        updateLesson(
                                          moduleIndex,
                                          lessonIndex,
                                          'duration',
                                          e.target.value
                                        )
                                      }
                                      placeholder="vd: 45m"
                                    />
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                                  <div>
                                    <FormLabel className="text-xs">Loại</FormLabel>
                                    <Select
                                      value={lesson.type}
                                      onValueChange={(value) =>
                                        updateLesson(moduleIndex, lessonIndex, 'type', value as any)
                                      }
                                    >
                                      <SelectTrigger className="h-8 text-sm">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="video">Video</SelectItem>
                                        <SelectItem value="exercise">Bài tập</SelectItem>
                                        <SelectItem value="quiz">Quiz</SelectItem>
                                        <SelectItem value="project">Dự án</SelectItem>
                                        <SelectItem value="challenge">Thử thách</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div className="flex items-center">
                                    <input
                                      type="checkbox"
                                      id={`free-${module.id}-${lesson.id}`}
                                      checked={lesson.isFree}
                                      onChange={(e) =>
                                        updateLesson(
                                          moduleIndex,
                                          lessonIndex,
                                          'isFree',
                                          e.target.checked
                                        )
                                      }
                                      className="mr-2"
                                    />
                                    <label
                                      htmlFor={`free-${module.id}-${lesson.id}`}
                                      className="text-xs"
                                    >
                                      Bài học miễn phí
                                    </label>
                                  </div>
                                </div>

                                {lesson.type === 'video' && (
                                  <div>
                                    <FormLabel className="text-xs">URL Video</FormLabel>
                                    <Input
                                      className="h-8 text-sm"
                                      value={lesson.videoUrl || ''}
                                      onChange={(e) =>
                                        updateLesson(
                                          moduleIndex,
                                          lessonIndex,
                                          'videoUrl',
                                          e.target.value
                                        )
                                      }
                                      placeholder="https://youtu.be/..."
                                    />
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {modules.length === 0 && (
                <p className="text-sm text-red-500 mt-2">Vui lòng thêm ít nhất một module</p>
              )}
            </CardContent>
          </Card>

          <CardFooter className="flex justify-end space-x-4 border rounded-lg py-4">
            <Button type="button" variant="outline" onClick={() => router.push('/explore')}>
              Hủy
            </Button>
            <Button type="submit" className="gap-2 bg-amber-600 hover:bg-amber-700">
              <Pencil className="h-4 w-4" /> Cập nhật khóa học
            </Button>
          </CardFooter>
        </form>
      </Form>

      {/* Dialog xóa khóa học */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa khóa học</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa khóa học này không? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCourse} className="bg-red-600 hover:bg-red-700">
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
