"use client";

import { Title } from "@/components/layout/Title";
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
import { ArrowLeft, Plus, Save, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  title: z.string().min(5, "Tiêu đề khóa học phải có ít nhất 5 ký tự"),
  description: z.string().min(20, "Mô tả khóa học phải có ít nhất 20 ký tự"),
  instructor: z.string().min(2, "Tên giảng viên phải có ít nhất 2 ký tự"),
  instructorRole: z.string().min(2, "Vai trò giảng viên phải có ít nhất 2 ký tự"),
  bio: z.string().min(20, "Tiểu sử giảng viên phải có ít nhất 20 ký tự"),
  thumbnailUrl: z.string().url("URL hình ảnh không hợp lệ"),
  videoUrl: z.string().url("URL video không hợp lệ"),
  duration: z.string().min(2, "Thời lượng khóa học không hợp lệ"),
  level: z.string(),
  language: z.string().min(2, "Ngôn ngữ không hợp lệ"),
  price: z.coerce.number().min(0, "Giá không thể âm"),
  discount: z.coerce.number().min(0).max(1, "Giảm giá phải từ 0 đến 1"),
});

// Các cấp độ khóa học
const courseLevels = ["Beginner", "Intermediate", "Advanced", "All Levels"];
// Tất cả các danh mục
const allCategories = Array.from(
  new Set(courses.flatMap((c) => c.categories))
);

export default function CreateCoursePage() {
  const router = useRouter();
  const [categories, setCategories] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [requirements, setRequirements] = useState<string[]>([]);
  const [whatYouWillLearn, setWhatYouWillLearn] = useState<string[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  
  // Input states for dynamic arrays
  const [categoryInput, setCategoryInput] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [skillInput, setSkillInput] = useState("");
  const [requirementInput, setRequirementInput] = useState("");
  const [learnInput, setLearnInput] = useState("");
  
  // Form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      instructor: "",
      instructorRole: "",
      bio: "",
      thumbnailUrl: "https://source.unsplash.com/random/600x400?coding",
      videoUrl: "https://www.youtube.com/embed/dGcsHMXbSOA",
      duration: "",
      level: "All Levels",
      language: "Tiếng Việt",
      price: 0,
      discount: 0,
    },
  });

  // Helper functions cho các mảng động
  const addToArray = (
    value: string,
    array: string[],
    setArray: React.Dispatch<React.SetStateAction<string[]>>,
    setInputValue: React.Dispatch<React.SetStateAction<string>>
  ) => {
    if (value.trim() && !array.includes(value.trim())) {
      setArray([...array, value.trim()]);
      setInputValue("");
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
      duration: "0h 0m",
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
      duration: "0m",
      isFree: false,
      type: "video",
      videoUrl: "https://youtu.be/dGcsHMXbSOA",
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

  // Form submission
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // Kiểm tra các mảng bắt buộc không được rỗng
    if (categories.length === 0) {
      alert("Vui lòng thêm ít nhất một danh mục cho khóa học");
      return;
    }
    if (skills.length === 0) {
      alert("Vui lòng thêm ít nhất một kỹ năng cho khóa học");
      return;
    }
    if (requirements.length === 0) {
      alert("Vui lòng thêm ít nhất một yêu cầu cho khóa học");
      return;
    }
    if (whatYouWillLearn.length === 0) {
      alert("Vui lòng thêm ít nhất một điều học viên sẽ học được");
      return;
    }
    if (modules.length === 0) {
      alert("Vui lòng thêm ít nhất một module cho khóa học");
      return;
    }

    // Tạo slug từ tiêu đề
    const slug = values.title
      .toLowerCase()
      .replace(/[^\w\s]/gi, "")
      .replace(/\s+/g, "-");

    // Tạo object khóa học hoàn chỉnh
    const newCourse: Course = {
      id: slug,
      slug,
      ...values,
      instructorAvatarUrl: "https://i.pravatar.cc/150?img=10",
      rating: 0,
      reviewCount: 0,
      enrollmentCount: 0,
      lastUpdate: new Date().toLocaleDateString("vi-VN", {
        month: "long",
        year: "numeric",
      }),
      originalPrice: values.price,
      isNew: true,
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

    console.log("Khóa học đã được tạo:", newCourse);
    alert("Khóa học đã được tạo thành công!");
    router.push("/explore");
  };

  return (
    <div className="container mx-auto max-w-5xl px-4 py-2">
      <Title
        title="Create New Course"
        description="Share your knowledge with eager learners."
        accentColor="pink"
      />

      <Button variant="outline" onClick={() => router.push('/explore')} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Enter the basic information about your course</CardDescription>
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
                        placeholder="Enter a detailed description of your course..."
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
                        placeholder="Enter information about the instructor's experience..."
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
                Information about the level, pricing, and other details
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
                      <FormDescription>Ví dụ: "5h 30m", "12h 45m"</FormDescription>
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
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                      <FormDescription>Example: 0.2 = 20% off, 0.5 = 50% off</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Categories & Tags</CardTitle>
              <CardDescription>Classify and search for your course</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <FormLabel>Categories</FormLabel>
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
                    Add
                  </Button>
                </div>
                {categories.length === 0 && (
                  <p className="text-sm text-red-500 mt-2">Please add at least one category</p>
                )}
              </div>

              <div>
                <FormLabel>Tags</FormLabel>
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
                    Add
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Skills & Requirements</CardTitle>
              <CardDescription>Skills learners will acquire and prerequisites</CardDescription>
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
                    Add
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
                    Add
                  </Button>
                </div>
                {requirements.length === 0 && (
                  <p className="text-sm text-red-500 mt-2">Please add at least one prerequisite</p>
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
                    Please add at least one thing learners will gain
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
                          <FormLabel>Title</FormLabel>
                          <Input
                            value={module.title}
                            onChange={(e) => updateModule(moduleIndex, 'title', e.target.value)}
                          />
                        </div>
                        <div>
                          <FormLabel>Duration</FormLabel>
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
                            <Plus className="h-3 w-3" /> Add Lesson
                          </Button>
                        </div>

                        {module.lessons.length === 0 ? (
                          <p className="text-sm text-muted-foreground">No lessons added yet.</p>
                        ) : (
                          <div className="space-y-3">
                            {module.lessons.map((lesson, lessonIndex) => (
                              <div key={lesson.id} className="border rounded-md p-3 space-y-3">
                                <div className="flex justify-between items-center">
                                  <h5 className="text-sm font-medium">Lesson {lessonIndex + 1}</h5>
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
                                    <FormLabel className="text-xs">Title</FormLabel>
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
                                    <FormLabel className="text-xs">Duration</FormLabel>
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
                                    <FormLabel className="text-xs">Type</FormLabel>
                                    <Select
                                      value={lesson.type}
                                      onValueChange={(value) =>
                                        updateLesson(
                                          moduleIndex,
                                          lessonIndex,
                                          'type',
                                          value as LessonType
                                        )
                                      }
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
                                      Free Lesson
                                    </label>
                                  </div>
                                </div>

                                {lesson.type === 'video' && (
                                  <div>
                                    <FormLabel className="text-xs">Video URL</FormLabel>
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
                <p className="text-sm text-red-500 mt-2">Please add at least one module</p>
              )}
            </CardContent>
          </Card>

          <CardFooter className="flex justify-end space-x-4 border rounded-lg py-4">
            <Button type="button" variant="outline" onClick={() => router.push('/explore')}>
              Cancel
            </Button>
            <Button type="submit" className="gap-2">
              <Save className="h-4 w-4" /> Create Course
            </Button>
          </CardFooter>
        </form>
      </Form>
    </div>
  );
}
