import { api } from './api';
import type {
  User,
  Room,
  RoomRequest,
  RoomBooking,
  Notification,
  DashboardStats,
  ApiResponse,
  PaginatedResponse,
  CalendarEvent,
  UserPreference,
} from './types';

// Auth
export const authApi = {
  login: (email: string, password: string) =>
    api.post<ApiResponse<{ user: User; token: string }>>('/auth/login', { email, password }),
  
  register: (data: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    division?: string;
  }) =>
    api.post<ApiResponse<{ user: User; token: string }>>('/auth/register', data),

  logout: () => api.post<ApiResponse<null>>('/auth/logout'),
  
  me: () => api.get<ApiResponse<User>>('/auth/me'),
};

// Rooms
export const roomsApi = {
  getAll: (params?: { status?: string; active_only?: boolean; min_capacity?: number; search?: string }) =>
    api.get<ApiResponse<Room[]>>('/rooms', { params }),
  
  getById: (id: number) => api.get<ApiResponse<Room>>(`/rooms/${id}`),
  
  create: (data: Partial<Room>) => api.post<ApiResponse<Room>>('/rooms', data),
  
  update: (id: number, data: Partial<Room>) => api.put<ApiResponse<Room>>(`/rooms/${id}`, data),
  
  delete: (id: number) => api.delete<ApiResponse<null>>(`/rooms/${id}`),
  
  checkAvailability: (id: number, date: string, start_time: string, end_time: string) =>
    api.get<ApiResponse<{ is_available: boolean; room: Room }>>(`/rooms/${id}/availability`, {
      params: { date, start_time, end_time },
    }),
};

// Room Requests
export const requestsApi = {
  getAll: (params?: { status?: string; my_requests?: boolean; date?: string; upcoming_only?: boolean }) =>
    api.get<ApiResponse<RoomRequest[]>>('/room-requests', { params }),
  
  getById: (id: number) => api.get<ApiResponse<RoomRequest>>(`/room-requests/${id}`),
  
  create: (data: {
    required_capacity: number;
    purpose: string;
    notes?: string;
    date: string;
    start_time: string;
    end_time: string;
  }) => api.post<ApiResponse<RoomRequest>>('/room-requests', data),
  
  update: (id: number, data: Partial<RoomRequest>) =>
    api.put<ApiResponse<RoomRequest>>(`/room-requests/${id}`, data),
  
  cancel: (id: number) => api.delete<ApiResponse<null>>(`/room-requests/${id}`),
  
  approve: (id: number, id_room: number) =>
    api.post<ApiResponse<RoomRequest>>(`/room-requests/${id}/approve`, { id_room }),
  
  reject: (id: number, rejected_reason: string) =>
    api.post<ApiResponse<RoomRequest>>(`/room-requests/${id}/reject`, { rejected_reason }),
  
  getAvailableRooms: (id: number) =>
    api.get<ApiResponse<Room[]>>(`/room-requests/${id}/available-rooms`),
};

// Bookings
export const bookingsApi = {
  getAll: (params?: {
    room_id?: number;
    date?: string;
    start_date?: string;
    end_date?: string;
    upcoming_only?: boolean;
    today_only?: boolean;
  }) => api.get<ApiResponse<RoomBooking[]>>('/bookings', { params }),
  
  getById: (id: number) => api.get<ApiResponse<RoomBooking>>(`/bookings/${id}`),
  
  getCalendar: (start_date: string, end_date: string, room_id?: number) =>
    api.get<ApiResponse<CalendarEvent[]>>('/bookings/calendar', {
      params: { start_date, end_date, room_id },
    }),
  
  cancel: (id: number) => api.delete<ApiResponse<null>>(`/bookings/${id}`),
};

// Notifications
export const notificationsApi = {
  getAll: (params?: { unread_only?: boolean; type?: string; per_page?: number }) =>
    api.get<PaginatedResponse<Notification>>('/notifications', { params }),
  
  getUnreadCount: () => api.get<ApiResponse<{ count: number }>>('/notifications/unread-count'),
  
  markAsRead: (id: number) =>
    api.put<ApiResponse<Notification>>(`/notifications/${id}/mark-as-read`),
  
  markAllAsRead: () => api.post<ApiResponse<null>>('/notifications/mark-all-as-read'),
  
  delete: (id: number) => api.delete<ApiResponse<null>>(`/notifications/${id}`),
};

// Dashboard
export const dashboardApi = {
  getStats: () =>
    api.get<ApiResponse<{ stats: DashboardStats; upcoming_bookings?: RoomBooking[] }>>('/dashboard/stats'),
};

// Users
export const usersApi = {
  getAll: (params?: { role?: string; is_active?: boolean; search?: string }) =>
    api.get<ApiResponse<User[]> | PaginatedResponse<User>>('/users', { params }),
  
  updateProfile: (id: number, data: { name?: string; division?: string; email?: string }) =>
    api.put<ApiResponse<User>>(`/users/${id}`, data),
  
  changePassword: (current_password: string, new_password: string, new_password_confirmation: string) =>
    api.put<ApiResponse<null>>('/users/change-password', {
      current_password,
      new_password,
      new_password_confirmation,
    }),
  
  updatePreferences: (data: Partial<UserPreference>) =>
    api.put<ApiResponse<UserPreference>>('/users/preferences', data),
};