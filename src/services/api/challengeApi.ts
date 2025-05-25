// Frontend API cho Challenge system

import apiClient from './api';

const challengeApi = {
  // Lấy danh sách challenge
  getAllChallenges: async (params: {
    page?: number;
    limit?: number;
    difficulty?: string;
    category?: string;
    sortBy?: string;
    order?: string;
  }) => {
    try {
      const response = await apiClient.get('/challenges', { params });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Lấy chi tiết challenge
  getChallengeById: async (id: string) => {
    try {
      const response = await apiClient.get(`/challenges/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Lấy daily challenge
  getDailyChallenge: async () => {
    try {
      const response = await apiClient.get('/challenges/daily');
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Submit giải pháp cho challenge
  submitChallenge: async ({
    challengeId,
    code,
    language,
  }: {
    challengeId: string;
    code: string;
    language: string;
  }) => {
    try {
      const response = await apiClient.post('/submissions', { challengeId, code, language });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Lấy danh sách nộp bài của người dùng
  getUserSubmissions: async (challengeId?: string) => {
    try {
      const params = challengeId ? { challengeId } : {};
      const response = await apiClient.get('/submissions/user', { params });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Lấy nộp bài tốt nhất của người dùng
  getBestSubmission: async (challengeId: string) => {
    try {
      const response = await apiClient.get(`/submissions/best/${challengeId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Lấy leaderboard
  getLeaderboard: async (params: { page?: number; limit?: number }) => {
    try {
      const response = await apiClient.get('/stats/leaderboard', { params });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Lấy thống kê người dùng
  getUserStats: async () => {
    try {
      const response = await apiClient.get('/stats');
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Lấy danh sách challenge đã hoàn thành
  getCompletedChallenges: async () => {
    try {
      const response = await apiClient.get('/stats/challenges');
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Lấy danh sách huy hiệu
  getUserBadges: async () => {
    try {
      const response = await apiClient.get('/stats/badges');
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Lấy danh sách thông báo
  getNotifications: async (params: {
    page?: number;
    limit?: number;
    read?: boolean;
  }) => {
    try {
      const response = await apiClient.get('/stats/notifications', { params });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Đánh dấu thông báo đã đọc
  markNotificationAsRead: async (id: string) => {
    try {
      const response = await apiClient.patch(`/stats/notifications/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Đánh dấu tất cả thông báo đã đọc
  markAllNotificationsAsRead: async () => {
    try {
      const response = await apiClient.patch('/stats/notifications/mark-all-read');
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Lấy số lượng thông báo chưa đọc
  getUnreadNotificationCount: async () => {
    try {
      const response = await apiClient.get('/stats/notifications/unread-count');
      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default challengeApi;
