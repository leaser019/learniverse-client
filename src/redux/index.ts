import authReducer from '@/redux/slices/authSlice';
import coursesReducer from '@/redux/slices/courseSlice';
import { configureStore } from '@reduxjs/toolkit';
export const store = configureStore({
  reducer: {
    auth: authReducer,
    courses: coursesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
