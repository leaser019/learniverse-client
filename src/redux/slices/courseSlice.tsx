import apiClient from '@/services/api/api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  price: number;
  imageUrl?: string;
  rating?: number;
  students?: number;
  createdAt?: string;
  updatedAt?: string;
}

interface CourseState {
  courses: Course[];
  course: Course | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: CourseState = {
  courses: [],
  course: null,
  status: 'idle',
  error: null,
};

export const fetchAllCourses = createAsyncThunk(
  'courses/fetchCourses',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/courses');
      return response?.data?.data || response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const fetchCourseById = createAsyncThunk(
  'courses/fetchCourseById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/courses/${id}`);
      return response?.data?.data || response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const createCourse = createAsyncThunk(
  'courses/createCourse',
  async (courseData: Omit<Course, 'id'>, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/courses', courseData);
      return response?.data?.data || response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const updateCourse = createAsyncThunk(
  'courses/updateCourse',
  async ({ id, courseData }: { id: string; courseData: Partial<Course> }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(`/courses/${id}`, courseData);
      return response?.data?.data || response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const deleteCourse = createAsyncThunk(
  'courses/deleteCourse',
  async (id: string, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/courses/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data);
    }
  }
);

const courseSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {
    resetCourseStatus: (state) => {
      state.status = 'idle';
      state.error = null;
    },
    clearSelectedCourse: (state) => {
      state.course = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllCourses.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAllCourses.fulfilled, (state, action: PayloadAction<Course[]>) => {
        state.status = 'succeeded';
        state.courses = action.payload;
      })
      .addCase(fetchAllCourses.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch courses';
      })
      .addCase(fetchCourseById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCourseById.fulfilled, (state, action: PayloadAction<Course>) => {
        state.status = 'succeeded';
        state.course = action.payload;
      })
      .addCase(fetchCourseById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch course';
      })
      .addCase(createCourse.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createCourse.fulfilled, (state, action: PayloadAction<Course>) => {
        state.status = 'succeeded';
        state.courses.push(action.payload);
      })
      .addCase(createCourse.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to create course';
      })
      .addCase(updateCourse.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateCourse.fulfilled, (state, action: PayloadAction<Course>) => {
        state.status = 'succeeded';
        const index = state.courses.findIndex((course) => course.id === action.payload.id);
        if (index !== -1) {
          state.courses[index] = action.payload;
        }
        if (state.course && state.course.id === action.payload.id) {
          state.course = action.payload;
        }
      })
      .addCase(updateCourse.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to update course';
      })
      .addCase(deleteCourse.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteCourse.fulfilled, (state, action: PayloadAction<string>) => {
        state.status = 'succeeded';
        state.courses = state.courses.filter((course) => course.id !== action.payload);
        if (state.course && state.course.id === action.payload) {
          state.course = null;
        }
      })
      .addCase(deleteCourse.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to delete course';
      });
  },
});

export const { resetCourseStatus, clearSelectedCourse } = courseSlice.actions;

export const selectAllCourses = (state: any) => state.courses.courses;
export const selectCourseById = (state: any) => state.courses.course;
export const selectCoursesStatus = (state: any) => state.courses.status;
export const selectCoursesError = (state: any) => state.courses.error;

export default courseSlice.reducer;