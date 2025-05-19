'use client';

import { Title as Titled } from '@/components/layout/Title';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';
import { motion } from 'framer-motion';
import {
  ActivitySquare,
  BookOpen,
  Calendar as CalendarIcon,
  Clock,
  GraduationCap,
  Plus,
  Target,
  Trash2,
  TrendingUp,
} from 'lucide-react';
import moment from 'moment';
import { FC, useEffect, useMemo, useState } from 'react';
import { Calendar as BigCalendar, momentLocalizer, Views } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Line } from 'react-chartjs-2';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import * as z from 'zod';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface Stat {
  title: string;
  value: string;
  icon: FC<{ className?: string }>;
  gradient: string;
  progress?: number;
  progressColor?: string;
}

const stats: Stat[] = [
  {
    title: 'Ongoing Courses',
    value: '5',
    icon: BookOpen,
    gradient: 'from-pink-500/90 to-red-600/90',
    progressColor: 'bg-gradient-to-r from-pink-400 via-pink-500 to-red-600',
  },
  {
    title: 'Weekly Goal',
    value: '80%',
    icon: Target,
    gradient: 'from-green-400/90 to-emerald-600/90',
    progressColor: 'bg-gradient-to-r from-green-300 via-green-400 to-emerald-600',
  },
  {
    title: 'Certificates Earned',
    value: '12',
    icon: GraduationCap,
    gradient: 'from-yellow-400/90 to-orange-500/90',
    progressColor: 'bg-gradient-to-r from-yellow-300 via-yellow-400 to-orange-500',
  },
  {
    title: 'Recent Activities',
    value: '24',
    icon: ActivitySquare,
    gradient: 'from-purple-500/90 to-pink-600/90',
    progressColor: 'bg-gradient-to-r from-purple-400 via-purple-500 to-pink-600',
  },
];

const chartData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      label: 'Study Hours',
      data: [4, 3, 5, 2, 6, 4, 3],
      borderColor: '#4f46e5',
      backgroundColor: 'rgba(79, 70, 229, 0.12)',
      fill: true,
      tension: 0.4,
      borderWidth: 3,
      pointBackgroundColor: 'white',
      pointBorderColor: '#4f46e5',
      pointBorderWidth: 2,
      pointRadius: 4,
      pointHoverRadius: 6,
    },
  ],
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom' as const,
      labels: {
        usePointStyle: true,
        boxWidth: 6,
        color: '#334155',
      },
    },
    tooltip: {
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      titleColor: '#1e40af',
      bodyColor: '#334155',
      borderColor: '#e2e8f0',
      borderWidth: 1,
      padding: 10,
      boxPadding: 6,
      usePointStyle: true,
      callbacks: {
        labelPointStyle: () => ({
          pointStyle: 'circle',
          rotation: 0,
        }),
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: 'rgba(148, 163, 184, 0.1)',
      },
      ticks: {
        font: {
          size: 11,
        },
        color: '#64748b',
      },
    },
    x: {
      grid: {
        display: false,
      },
      ticks: {
        font: {
          size: 11,
        },
        color: '#64748b',
      },
    },
  },
  elements: {
    line: {
      borderJoinStyle: 'round',
    },
  },
};

const localizer = momentLocalizer(moment);

const StatsGrid: FC = () => (
  <motion.div
    className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    {stats.map(({ title, value, icon: Icon, gradient, progress, progressColor }) => (
      <Card
        key={title}
        className={cn(
          `bg-gradient-to-tr ${gradient}`,
          'overflow-hidden rounded-xl border-0 shadow-[0_10px_20px_-5px_rgba(59,130,246,0.15)] hover:shadow-[0_15px_30px_-5px_rgba(59,130,246,0.25)] transition-all duration-300'
        )}
      >
        <div className={`px-5 py-4 backdrop-blur-sm relative`}>
          <div className="absolute inset-0 bg-white/5"></div>
          <div className="flex flex-row items-center justify-between relative">
            <h3 className="font-medium text-white text-sm">{title}</h3>
            <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm ring-1 ring-white/30">
              <Icon className="h-5 w-5 text-white" />
            </div>
          </div>
          <div className="text-3xl font-bold mt-2 text-white relative">{value}</div>
          {progress && (
            <div className="mt-4 relative">
              <div className="flex justify-between text-xs text-white/90 mb-1">
                <span>Progress</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className={`h-1.5 ${progressColor}`} />
            </div>
          )}
        </div>
      </Card>
    ))}
  </motion.div>
);

interface Deadline {
  id: string;
  task: string;
  dueDate: Date;
  due: string;
  priority: 'high' | 'medium' | 'low';
  repeat?: 'none' | 'daily' | 'weekly' | 'monthly';
  notify: boolean;
}

interface StudyEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  notes?: string;
}

const deadlineSchema = z.object({
  task: z.string().min(1, { message: 'Hãy nhập tên deadline' }),
  dueDate: z.date(),
  priority: z.string(),
  repeat: z.string().optional(),
  notify: z.boolean().default(true),
});

const eventSchema = z.object({
  title: z.string().min(1, { message: 'Hãy nhập tên sự kiện' }),
  startDate: z.date(),
  startTime: z.string(),
  endDate: z.date(),
  endTime: z.string(),
  notes: z.string().optional(),
});

const Dashboard: FC = () => {
  const memoChartData = useMemo(() => chartData, []);
  const memoChartOptions = useMemo(() => chartOptions, []);

  const [username] = useState<string>('learner1');
  const [deadlines, setDeadlines] = useState<Deadline[]>([]);
  const [events, setEvents] = useState<StudyEvent[]>([]);

  const [isDeadlineDialogOpen, setIsDeadlineDialogOpen] = useState(false);
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);

  const deadlineForm = useForm({
    resolver: zodResolver(deadlineSchema),
    defaultValues: {
      task: '',
      priority: 'medium',
      repeat: 'none',
      notify: true,
    },
  });

  const eventForm = useForm<z.infer<typeof eventSchema>>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: '',
      startTime: '09:00',
      endTime: '10:00',
      notes: '',
    },
  });

  useEffect(() => {
    const storedDeadlines = localStorage.getItem(`deadline_${username}`);
    if (storedDeadlines) {
      const parsedDeadlines = JSON.parse(storedDeadlines);
      const formattedDeadlines = parsedDeadlines.map((d: any) => ({
        ...d,
        dueDate: new Date(d.dueDate),
      }));
      setDeadlines(formattedDeadlines);

      // Xử lý các deadline định kỳ đã quá hạn
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // let newDeadlines: Deadline[] = [];
      let needsUpdate = false;

      formattedDeadlines.forEach((deadline: Deadline) => {
        if (deadline.repeat && deadline.repeat !== 'none' && deadline.dueDate < today) {
          needsUpdate = true;

          // Tạo deadline mới dựa trên chu kỳ lặp lại
          const newDate = new Date(deadline.dueDate);

          if (deadline.repeat === 'daily') {
            newDate.setDate(today.getDate());
          } else if (deadline.repeat === 'weekly') {
            newDate.setDate(today.getDate() + ((7 - today.getDay() + newDate.getDay()) % 7));
          } else if (deadline.repeat === 'monthly') {
            newDate.setMonth(today.getMonth());
            newDate.setDate(
              Math.min(
                newDate.getDate(),
                new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()
              )
            );
          }

          if (newDate <= today) {
            if (deadline.repeat === 'daily') {
              newDate.setDate(today.getDate() + 1);
            } else if (deadline.repeat === 'weekly') {
              newDate.setDate(today.getDate() + 7);
            } else if (deadline.repeat === 'monthly') {
              newDate.setMonth(today.getMonth() + 1);
            }
          }

          const updatedDeadline: Deadline = {
            ...deadline,
            id: Date.now() + Math.random().toString(),
            dueDate: newDate,
            due: calculateDueText(newDate),
          };

          newDeadlines.push(updatedDeadline);
        }
      });

      if (needsUpdate) {
        const updatedDeadlines = [...formattedDeadlines, ...newDeadlines];
        setDeadlines(updatedDeadlines);
        localStorage.setItem(`deadline_${username}`, JSON.stringify(updatedDeadlines));
      }
    }

    const storedEvents = localStorage.getItem(`calendar_${username}`);
    if (storedEvents) {
      const parsedEvents = JSON.parse(storedEvents);
      const formattedEvents = parsedEvents.map((e: any) => ({
        ...e,
        start: new Date(e.start),
        end: new Date(e.end),
      }));
      setEvents(formattedEvents);
    }
  }, [username]);

  const calculateDueText = (date: Date): string => {
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'Quá hạn';
    if (diffDays === 0) return 'Hôm nay';
    if (diffDays === 1) return 'Ngày mai';
    if (diffDays < 7) return `${diffDays} ngày nữa`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} tuần nữa`;
    return `${Math.floor(diffDays / 30)} tháng nữa`;
  };

  const combineDateTime = (date: Date, timeString: string): Date => {
    const [hours, minutes] = timeString.split(':').map(Number);
    const result = new Date(date);
    result.setHours(hours, minutes, 0, 0);
    return result;
  };

  const onSubmitDeadline = (data: z.infer<typeof deadlineSchema>) => {
    const newDeadline: Deadline = {
      id: Date.now().toString(),
      task: data.task,
      dueDate: data.dueDate,
      due: calculateDueText(data.dueDate),
      priority: data.priority as 'high' | 'medium' | 'low',
      repeat: data.repeat as 'none' | 'daily' | 'weekly' | 'monthly',
      notify: data.notify,
    };

    const updatedDeadlines = [...deadlines, newDeadline];
    setDeadlines(updatedDeadlines);
    localStorage.setItem(`deadline_${username}`, JSON.stringify(updatedDeadlines));

    toast.success('Deadline đã được thêm');

    deadlineForm.reset();
    setIsDeadlineDialogOpen(false);
  };

  // Thêm function để xử lý deadline tự động lặp lại
  const translateRepeat = (repeat: string): string => {
    switch (repeat) {
      case 'daily':
        return 'hàng ngày';
      case 'weekly':
        return 'hàng tuần';
      case 'monthly':
        return 'hàng tháng';
      default:
        return '';
    }
  };

  const onSubmitEvent = (data: z.infer<typeof eventSchema>) => {
    const startDateTime = combineDateTime(data.startDate, data.startTime);
    const endDateTime = combineDateTime(data.endDate, data.endTime);

    if (endDateTime <= startDateTime) {
      toast.error('Lỗi thời gian');
      return;
    }

    const newEvent: StudyEvent = {
      id: Date.now().toString(),
      title: data.title,
      start: startDateTime,
      end: endDateTime,
      notes: data.notes,
    };

    const updatedEvents = [...events, newEvent];
    setEvents(updatedEvents);
    localStorage.setItem(`calendar_${username}`, JSON.stringify(updatedEvents));

    toast.success('Sự kiện học tập đã được thêm');

    eventForm.reset();
    setIsEventDialogOpen(false);
  };

  const deleteDeadline = (id: string) => {
    const updatedDeadlines = deadlines.filter((d) => d.id !== id);
    setDeadlines(updatedDeadlines);
    localStorage.setItem(`deadline_${username}`, JSON.stringify(updatedDeadlines));

    toast.success('Deadline đã bị xóa');
  };

  const deleteEvent = (id: string) => {
    const updatedEvents = events.filter((e) => e.id !== id);
    setEvents(updatedEvents);
    localStorage.setItem(`calendar_${username}`, JSON.stringify(updatedEvents));

    toast.success('Sự kiện đã bị xóa');
  };

  return (
    <div className="container mx-auto py-8 space-y-8 px-4 sm:px-6 bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/20 min-h-screen rounded-xl">
      <Titled
        title="Learning Dashboard"
        description="Track your progress and upcoming study sessions"
      />

      <StatsGrid />

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="overflow-hidden border-0 rounded-xl shadow-blue-200 hover:shadow-blue-500 transition-all duration-300 relative">
          <div className="bg-gradient-to-r px-5 py-4 relative">
            <CardTitle className="text-blue-500 flex items-center gap-2 text-lg font-medium relative">
              <TrendingUp className="h-5 w-5" />
              Study Time Analysis
            </CardTitle>
          </div>
          <CardContent className="pt-6 pb-6 px-5 bg-white h-[300px] relative">
            <Line data={memoChartData} options={memoChartOptions} className="h-full" />
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-0 rounded-xl shadow-blue-200 hover:shadow-blue-500 transition-all duration-300 relative">
          <span className="absolute -left-4 -top-4 w-20 h-20 rounded-full bg-blue-100/30 blur-xl"></span>
          <div className="bg-gradient-to-r px-5 py-4 relative">
            <div className="flex justify-between items-center">
              <CardTitle className="text-blue-500 flex items-center gap-2 text-lg font-medium relative">
                <Clock className="h-5 w-5" />
                Upcoming Deadlines
              </CardTitle>
              <Dialog open={isDeadlineDialogOpen} onOpenChange={setIsDeadlineDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex items-center gap-1 border-blue-200"
                  >
                    <Plus className="h-4 w-4" /> Thêm
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Thêm deadline mới</DialogTitle>
                  </DialogHeader>
                  <Form {...deadlineForm}>
                    <form
                      onSubmit={deadlineForm.handleSubmit(onSubmitDeadline)}
                      className="space-y-4"
                    >
                      <FormField
                        control={deadlineForm.control}
                        name="task"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tên deadline</FormLabel>
                            <FormControl>
                              <Input placeholder="Nhập tên deadline" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={deadlineForm.control}
                        name="dueDate"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Ngày hết hạn</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={'outline'}
                                    className={cn(
                                      'pl-3 text-left font-normal',
                                      !field.value && 'text-muted-foreground'
                                    )}
                                  >
                                    {field.value ? (
                                      moment(field.value).format('DD/MM/YYYY')
                                    ) : (
                                      <span>Chọn ngày</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={(date) =>
                                    date < new Date(new Date().setHours(0, 0, 0, 0))
                                  }
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={deadlineForm.control}
                        name="priority"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Mức độ ưu tiên</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Chọn mức độ ưu tiên" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="high">Cao</SelectItem>
                                <SelectItem value="medium">Trung bình</SelectItem>
                                <SelectItem value="low">Thấp</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={deadlineForm.control}
                        name="repeat"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Lặp lại</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value || 'none'}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Không lặp lại" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="none">Không lặp lại</SelectItem>
                                <SelectItem value="daily">Hàng ngày</SelectItem>
                                <SelectItem value="weekly">Hàng tuần</SelectItem>
                                <SelectItem value="monthly">Hàng tháng</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={deadlineForm.control}
                        name="notify"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                              <input
                                type="checkbox"
                                checked={field.value}
                                onChange={field.onChange}
                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Nhận thông báo</FormLabel>
                              <p className="text-sm text-gray-500">
                                Hiển thị nhắc nhở khi deadline gần đến
                              </p>
                            </div>
                          </FormItem>
                        )}
                      />

                      <div className="flex justify-end space-x-2 pt-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsDeadlineDialogOpen(false)}
                        >
                          Hủy
                        </Button>
                        <Button type="submit">Lưu deadline</Button>
                      </div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          <CardContent className="pt-6 pb-4 px-0 bg-white relative">
            <ul className="space-y-3 px-5">
              {deadlines.length > 0 ? (
                deadlines
                  .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())
                  .map((deadline) => (
                    <li
                      key={deadline.id}
                      className="flex justify-between items-center p-3.5 bg-gradient-to-r from-slate-50 to-white rounded-lg border-l-4 hover:translate-x-1 hover:shadow-md transition-all duration-300 group"
                      style={{
                        borderLeftColor:
                          deadline.priority === 'high'
                            ? '#e11d48'
                            : deadline.priority === 'medium'
                            ? '#8b5cf6'
                            : '#3b82f6',
                      }}
                    >
                      <div className="flex items-center">
                        <div
                          className="w-2.5 h-2.5 rounded-full mr-3 animate-pulse"
                          style={{
                            backgroundColor:
                              deadline.priority === 'high'
                                ? '#e11d48'
                                : deadline.priority === 'medium'
                                ? '#8b5cf6'
                                : '#3b82f6',
                          }}
                        />
                        <span className="font-medium text-slate-700">{deadline.task}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs py-1.5 px-3 bg-white rounded-full shadow-sm text-slate-600 font-medium border border-slate-100 ring-1 ring-slate-100/80">
                          {deadline.due}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => deleteDeadline(deadline.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </li>
                  ))
              ) : (
                <li className="p-8 text-center text-slate-500">
                  Chưa có deadline nào. Hãy thêm deadline mới!
                </li>
              )}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card className="overflow-hidden border-0 rounded-xl shadow-blue-200 hover:shadow-blue-500 transition-all duration-300 relative">
        <div className="rounded-xl bg-gradient-to-r relative px-5 py-4 flex justify-between items-center">
          <CardTitle className="text-blue-500 text-lg flex items-center gap-2 font-medium relative">
            <CalendarIcon className="h-5 w-5" />
            Study Calendar
          </CardTitle>
          <Dialog open={isEventDialogOpen} onOpenChange={setIsEventDialogOpen}>
            <DialogTrigger asChild>
              <Button
                size="sm"
                variant="outline"
                className="flex items-center gap-1 border-blue-200"
              >
                <Plus className="h-4 w-4" /> Thêm sự kiện
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Thêm sự kiện học tập</DialogTitle>
              </DialogHeader>
              <Form {...eventForm}>
                <form onSubmit={eventForm.handleSubmit(onSubmitEvent)} className="space-y-4">
                  <FormField
                    control={eventForm.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tên sự kiện</FormLabel>
                        <FormControl>
                          <Input placeholder="Nhập tên sự kiện" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={eventForm.control}
                      name="startDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Ngày bắt đầu</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={'outline'}
                                  className={cn(
                                    'pl-3 text-left font-normal',
                                    !field.value && 'text-muted-foreground'
                                  )}
                                >
                                  {field.value ? (
                                    moment(field.value).format('DD/MM/YYYY')
                                  ) : (
                                    <span>Chọn ngày</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={eventForm.control}
                      name="startTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Giờ bắt đầu</FormLabel>
                          <FormControl>
                            <Input type="time" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={eventForm.control}
                      name="endDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Ngày kết thúc</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={'outline'}
                                  className={cn(
                                    'pl-3 text-left font-normal',
                                    !field.value && 'text-muted-foreground'
                                  )}
                                >
                                  {field.value ? (
                                    moment(field.value).format('DD/MM/YYYY')
                                  ) : (
                                    <span>Chọn ngày</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={eventForm.control}
                      name="endTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Giờ kết thúc</FormLabel>
                          <FormControl>
                            <Input type="time" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={eventForm.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ghi chú (tùy chọn)</FormLabel>
                        <FormControl>
                          <Input placeholder="Thêm ghi chú cho sự kiện" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end space-x-2 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsEventDialogOpen(false)}
                    >
                      Hủy
                    </Button>
                    <Button type="submit">Lưu sự kiện</Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
        <CardContent className="p-5 pt-6 bg-white relative">
          <div className="h-[400px] calendar-container">
            <BigCalendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              defaultView={Views.WEEK}
              style={{ height: '100%' }}
              eventPropGetter={() => ({
                style: {
                  backgroundColor: '#4f46e5',
                  borderRadius: '6px',
                  border: 'none',
                  color: 'white',
                  boxShadow:
                    '0 4px 6px -1px rgba(79, 70, 229, 0.1), 0 2px 4px -1px rgba(79, 70, 229, 0.06)',
                },
              })}
              dayPropGetter={() => ({
                style: {
                  backgroundColor: '#f8fafc',
                  borderRadius: '6px',
                },
              })}
              onSelectEvent={(event) => {
                if (confirm(`Bạn có muốn xóa sự kiện "${event.title}"?`)) {
                  deleteEvent((event as StudyEvent).id);
                }
              }}
              tooltipAccessor={(event) => (event as StudyEvent).notes || event.title}
            />
          </div>

          <div className="flex justify-between items-center mt-4 pt-4 border-t border-blue-100">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const data = {
                    events: events,
                    deadlines: deadlines,
                  };
                  const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `learniverse_data_${new Date().toISOString().split('T')[0]}.json`;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  URL.revokeObjectURL(url);

                  toast.success('Dữ liệu đã được xuất');
                }}
                className="text-blue-600 border-blue-200"
              >
                Xuất dữ liệu
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = '.json';
                  input.onchange = (e) => {
                    const file = (e.target as HTMLInputElement).files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        try {
                          const data = JSON.parse(event.target?.result as string);

                          if (data.events && Array.isArray(data.events)) {
                            const formattedEvents = data.events.map((e: any) => ({
                              ...e,
                              start: new Date(e.start),
                              end: new Date(e.end),
                            }));
                            setEvents(formattedEvents);
                            localStorage.setItem(
                              `calendar_${username}`,
                              JSON.stringify(formattedEvents)
                            );
                          }

                          if (data.deadlines && Array.isArray(data.deadlines)) {
                            const formattedDeadlines = data.deadlines.map((d: any) => ({
                              ...d,
                              dueDate: new Date(d.dueDate),
                            }));
                            setDeadlines(formattedDeadlines);
                            localStorage.setItem(
                              `deadline_${username}`,
                              JSON.stringify(formattedDeadlines)
                            );
                          }

                          toast.success('Dữ liệu đã được nhập');
                        } catch (error) {
                          toast.error('Lỗi khi nhập dữ liệu');
                        }
                      };
                      reader.readAsText(file);
                    }
                  };
                  input.click();
                }}
                className="text-blue-600 border-blue-200"
              >
                Nhập dữ liệu
              </Button>
            </div>

            <div className="flex gap-2">
              <Select
                onValueChange={(value) => {
                  const filteredEvents = events.filter((event) => {
                    const eventDate = new Date(event.start);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);

                    if (value === 'today') {
                      const eventDay = new Date(eventDate);
                      eventDay.setHours(0, 0, 0, 0);
                      return eventDay.getTime() === today.getTime();
                    } else if (value === 'week') {
                      const nextWeek = new Date(today);
                      nextWeek.setDate(today.getDate() + 7);
                      return eventDate >= today && eventDate <= nextWeek;
                    } else if (value === 'month') {
                      const nextMonth = new Date(today);
                      nextMonth.setMonth(today.getMonth() + 1);
                      return eventDate >= today && eventDate <= nextMonth;
                    }
                    return true;
                  });

                  if (value === 'all') {
                    const storedEvents = localStorage.getItem(`calendar_${username}`);
                    if (storedEvents) {
                      const parsedEvents = JSON.parse(storedEvents);
                      const formattedEvents = parsedEvents.map((e: any) => ({
                        ...e,
                        start: new Date(e.start),
                        end: new Date(e.end),
                      }));
                      setEvents(formattedEvents);
                    }
                  } else {
                    setEvents(filteredEvents);
                  }
                }}
              >
                <SelectTrigger className="w-[150px] h-9 text-xs">
                  <SelectValue placeholder="Lọc sự kiện" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả sự kiện</SelectItem>
                  <SelectItem value="today">Hôm nay</SelectItem>
                  <SelectItem value="week">Tuần này</SelectItem>
                  <SelectItem value="month">Tháng này</SelectItem>
                </SelectContent>
              </Select>

              <Input
                placeholder="Tìm kiếm sự kiện..."
                className="w-[200px] h-9 text-xs"
                onChange={(e) => {
                  const searchTerm = e.target.value.toLowerCase();
                  if (!searchTerm.trim()) {
                    const storedEvents = localStorage.getItem(`calendar_${username}`);
                    if (storedEvents) {
                      const parsedEvents = JSON.parse(storedEvents);
                      const formattedEvents = parsedEvents.map((e: any) => ({
                        ...e,
                        start: new Date(e.start),
                        end: new Date(e.end),
                      }));
                      setEvents(formattedEvents);
                    }
                    return;
                  }

                  const storedEvents = localStorage.getItem(`calendar_${username}`);
                  if (storedEvents) {
                    const parsedEvents = JSON.parse(storedEvents);
                    const formattedEvents = parsedEvents.map((e: any) => ({
                      ...e,
                      start: new Date(e.start),
                      end: new Date(e.end),
                    }));

                    const filteredEvents = formattedEvents.filter(
                      (event: StudyEvent) =>
                        event.title.toLowerCase().includes(searchTerm) ||
                        (event.notes && event.notes.toLowerCase().includes(searchTerm))
                    );

                    setEvents(filteredEvents);
                  }
                }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <style jsx global>{`
        .calendar-container .rbc-header {
          padding: 12px;
          font-weight: 600;
          font-size: 14px;
          color: #1e40af;
          background-color: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
        }
        .calendar-container .rbc-today {
          background-color: #dbeafe;
        }
        .calendar-container .rbc-event {
          box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.1), 0 2px 4px -1px rgba(79, 70, 229, 0.06);
        }
        .calendar-container .rbc-toolbar button {
          color: #1e40af;
          border-radius: 6px;
          font-weight: 500;
          border: 1px solid #e2e8f0;
        }
        .calendar-container .rbc-toolbar button:hover {
          background-color: #dbeafe;
          border-color: #bfdbfe;
        }
        .calendar-container .rbc-toolbar button.rbc-active {
          background-color: #4f46e5;
          color: white;
          border-color: #4f46e5;
        }
        .calendar-container .rbc-btn-group {
          background-color: #f8fafc;
          border-radius: 8px;
          padding: 3px;
        }
        .calendar-container .rbc-toolbar {
          margin-bottom: 15px;
          color: #1e40af;
        }
        .calendar-container .rbc-time-header-content {
          border-color: #e2e8f0;
        }
        .calendar-container .rbc-time-content {
          border-color: #e2e8f0;
        }
        .calendar-container .rbc-day-slot .rbc-time-slot {
          border-color: #f1f5f9;
        }
        .calendar-container .rbc-timeslot-group {
          border-color: #e2e8f0;
        }
        .calendar-container .rbc-month-view {
          border-color: #e2e8f0;
          border-radius: 8px;
          overflow: hidden;
        }
        .calendar-container .rbc-month-row {
          border-color: #e2e8f0;
        }
        .calendar-container .rbc-date-cell {
          padding: 8px;
          font-weight: 500;
          color: #334155;
        }
        .calendar-container .rbc-date-cell.rbc-now {
          color: #4f46e5;
          font-weight: 600;
        }
        .calendar-container .rbc-toolbar-label {
          font-weight: 700;
          font-size: 18px;
          color: #1e40af;
        }
        .calendar-container .rbc-time-view {
          border-radius: 8px;
          overflow: hidden;
          border-color: #e2e8f0;
        }
        .calendar-container .rbc-time-view .rbc-row {
          box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.05);
        }
        .calendar-container .rbc-agenda-view {
          border-radius: 8px;
          overflow: hidden;
          border-color: #e2e8f0;
        }
        .calendar-container .rbc-agenda-view table {
          border-collapse: separate;
          border-spacing: 0;
        }
        .calendar-container .rbc-agenda-view table th {
          font-weight: 600;
          color: #1e40af;
          padding: 12px;
          background-color: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
        }
        .calendar-container .rbc-agenda-view table td {
          padding: 12px;
          border-bottom: 1px solid #f1f5f9;
        }
        .calendar-container .rbc-agenda-view table td:hover {
          background-color: #f8fafc;
        }
        .calendar-container .rbc-agenda-empty {
          padding: 40px;
          text-align: center;
          color: #64748b;
          font-size: 15px;
        }

        @keyframes bounce-slow {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }

        .animate-bounce-slow {
          animation: bounce-slow 3s infinite;
        }
      `}</style>

      {/* Thêm component thông báo */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col-reverse gap-2">
        {deadlines
          .filter((d) => {
            const daysUntilDue = Math.ceil(
              (d.dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
            );
            return daysUntilDue >= 0 && daysUntilDue <= 2;
          })
          .slice(0, 3)
          .map((deadline) => (
            <div
              key={`notify-${deadline.id}`}
              className={`p-4 rounded-lg shadow-lg border-l-4 max-w-sm animate-bounce-slow bg-white transition-all duration-300 ${
                deadline.priority === 'high'
                  ? 'border-red-500'
                  : deadline.priority === 'medium'
                  ? 'border-purple-500'
                  : 'border-blue-500'
              }`}
            >
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-500" />
                <p className="font-medium text-slate-700">{deadline.task}</p>
              </div>
              <p className="text-sm text-slate-500 mt-1">
                {deadline.due === 'Hôm nay' ? 'Đến hạn hôm nay 📢' : `Còn ${deadline.due} 🔔`}
              </p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Dashboard;