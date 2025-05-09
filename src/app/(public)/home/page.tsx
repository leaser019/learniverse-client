'use client';

import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
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
  Target,
  TrendingUp,
} from 'lucide-react';
import moment from 'moment';
import { FC, useMemo } from 'react';
import { Calendar as BigCalendar, momentLocalizer, Views } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Line } from 'react-chartjs-2';

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
        color: '#334155'
      }
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
          rotation: 0
        }),
      },
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: 'rgba(148, 163, 184, 0.1)',
      },
      ticks: {
        font: {
          size: 11
        },
        color: '#64748b'
      }
    },
    x: {
      grid: {
        display: false
      },
      ticks: {
        font: {
          size: 11
        },
        color: '#64748b'
      }
    }
  },
  elements: {
    line: {
      borderJoinStyle: 'round'
    }
  }
};

const deadlines = [
  { id: 1, task: 'Submit JavaScript Assignment', due: '2 days left', priority: 'high' },
  { id: 2, task: 'React Quiz', due: '5 days left', priority: 'medium' },
  { id: 3, task: 'Project Review', due: '1 week left', priority: 'low' },
];

const events = [
  {
    title: 'React Study Session',
    start: new Date(2024, 4, 8, 10, 0),
    end: new Date(2024, 4, 8, 12, 0),
  },
  {
    title: 'JavaScript Workshop',
    start: new Date(2024, 4, 9, 14, 0),
    end: new Date(2024, 4, 9, 16, 0),
  },
  {
    title: 'Group Project Meeting',
    start: new Date(2024, 4, 10, 9, 0),
    end: new Date(2024, 4, 10, 11, 0),
  },
];

const localizer = momentLocalizer(moment);

const StatsGrid: FC = () => (
  <motion.div
    className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    {stats.map(({ title, value, icon: Icon, gradient, progress,progressColor }) => (
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

const Dashboard: FC = () => {
  const memoChartData = useMemo(() => chartData, []);
  const memoChartOptions = useMemo(() => chartOptions, []);

  return (
    <div className="container mx-auto py-8 space-y-8 px-4 sm:px-6 bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/20 min-h-screen rounded-xl">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative"
      >
        <span className="absolute -left-2 -top-2 w-12 h-12 rounded-full bg-blue-100/50 blur-2xl"></span>
        <span className="absolute right-1/4 bottom-0 w-20 h-8 rounded-full bg-indigo-100/60 blur-xl"></span>
        <div className="text-center justify-center my-10">
          <h1 className="text-2xl md:text-3xl font-bold mb-2 text-blue-800">
            Learning Dashboard
          </h1>
          <p className="text-blue-600/80 mb-8 relative">
            Track your progress and upcoming study sessions
          </p>
        </div>
      </motion.div>

      <StatsGrid />

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="overflow-hidden border-0 rounded-xlshadow-blue-200 hover:shadow-blue-500 transition-all duration-300 relative">
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
          <div className="bg-gradient-to-r   px-5 py-4 relative">
            <CardTitle className="text-blue-500 flex items-center gap-2 text-lg font-medium relative">
              <Clock className="h-5 w-5" />
              Upcoming Deadlines
            </CardTitle>
          </div>
          <CardContent className="pt-6 pb-4 px-0 bg-white relative">
            <ul className="space-y-3 px-5">
              {deadlines.map(({ id, task, due, priority }) => (
                <li
                  key={id}
                  className="flex justify-between items-center p-3.5 bg-gradient-to-r from-slate-50 to-white rounded-lg border-l-4 hover:translate-x-1 hover:shadow-md transition-all duration-300"
                  style={{
                    borderLeftColor:
                      priority === 'high'
                        ? '#e11d48'
                        : priority === 'medium'
                        ? '#8b5cf6'
                        : '#3b82f6',
                  }}
                >
                  <div className="flex items-center">
                    <div
                      className="w-2.5 h-2.5 rounded-full mr-3 animate-pulse"
                      style={{
                        backgroundColor:
                          priority === 'high'
                            ? '#e11d48'
                            : priority === 'medium'
                            ? '#8b5cf6'
                            : '#3b82f6',
                      }}
                    />
                    <span className="font-medium text-slate-700">{task}</span>
                  </div>
                  <span className="text-xs py-1.5 px-3 bg-white rounded-full shadow-sm text-slate-600 font-medium border border-slate-100 ring-1 ring-slate-100/80">
                    {due}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card className="overflow-hidden border-0 rounded-xl shadow-blue-200 hover:shadow-blue-500 transition-all duration-300 relative">
        <div className="rounded-xl bg-gradient-to-r  relative px-10 ">
          <CardTitle className="text-blue-500 text-lg flex items-center gap-2 font-medium relative">
            <CalendarIcon className="h-5 w-5" />
            Study Calendar
          </CardTitle>
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
            />
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
      `}</style>
    </div>
  );
};

export default Dashboard;