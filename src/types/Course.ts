export type LessonType = "video" | "exercise" | "quiz" | "project" | "challenge";

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  isFree: boolean;
  type: LessonType;
  description?: string;
}

export interface Module {
  id: string;
  title: string;
  duration: string;
  lessons: Lesson[];
}

export interface Review {
  id: string;
  user: string;
  avatar: string;
  rating: number;
  date: string;
  content: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  description: string;
  instructor: string;
  bio: string;
  instructorRole: string;
  instructorAvatarUrl: string;
  thumbnailUrl: string;
  videoUrl: string;
  rating: number;
  reviewCount: number;
  duration: string;
  level: string;
  enrollmentCount: number;
  language: string;
  lastUpdate: string;
  price: number;
  discount: number;
  originalPrice: number;
  isFeatured?: boolean;
  isPopular?: boolean;
  isBestseller?: boolean;
  isNew?: boolean;
  previewAvailable?: boolean;
  categories: string[];
  tags?: string[];
  skills: string[];
  requirements: string[];
  whatYouWillLearn: string[];
  modules: Module[];
  reviews: Review[];
  faq: FAQ[];
  relatedCourseIds: string[];
}

export interface CoursePreview {
  id: string;
  slug: string;
  title: string;
  description: string;
  instructor: string;
  thumbnailUrl: string;
  rating: number;
  reviewCount: number;
  duration: string;
  level: string;
  enrollmentCount: number;
  price: number;
  discount?: number;
  originalPrice?: number;
  isFeatured?: boolean;
  isPopular?: boolean;
  isBestseller?: boolean;
  isNew?: boolean;
  categories: string[];
}