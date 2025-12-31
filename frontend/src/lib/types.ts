export interface User {
  id_user: number;
  name: string;
  email: string;
  role: 'user' | 'room_admin' | 'GA';
  division: string | null;
  is_active: boolean;
  email_verified_at: string | null;
  preference?: UserPreference;
}

export interface UserPreference {
  id_preference: number;
  id_user: number;
  notification_24h: boolean;
  notification_3h: boolean;
  notification_30m: boolean;
  email_notifications: boolean;
}

export interface Room {
  id_room: number;
  room_name: string;
  capacity: number;
  location: string;
  description: string | null;
  status: 'available' | 'occupied' | 'maintenance';
  is_active: boolean;
  created_by: number;
  creator?: {
    id_user: number;
    name: string;
  };
  created_at: string;
  updated_at: string;
}

export interface RoomRequest {
  id_request: number;
  id_user: number;
  borrower_name: string; // computed from user
  required_capacity: number;
  purpose: string;
  notes: string | null;
  date: string;
  start_time: string;
  end_time: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  id_assigned_by: number | null;
  rejected_reason: string | null;
  user?: User;
  assigned_by?: User;
  booking?: RoomBooking;
  created_at: string;
  updated_at: string;
}

export interface RoomBooking {
  id_booking: number;
  id_request: number;
  id_room: number;
  booked_by: number;
  date: string;
  start_time: string;
  end_time: string;
  room?: Room;
  request?: RoomRequest;
  booked_by_user?: User;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id_notification: number;
  id_user: number;
  id_booking: number | null;
  title: string;
  message: string;
  type: 'booking_confirmed' | 'reminder' | 'cancellation' | 'room_changed';
  channel: 'email' | 'in-app' | 'both';
  is_read: boolean;
  read_at: string | null;
  sent_at: string | null;
  booking?: RoomBooking;
  created_at: string;
}

export interface DashboardStats {
  total_requests?: number;
  pending_requests?: number;
  approved_requests?: number;
  upcoming_bookings?: number;
  total_rooms?: number;
  available_rooms?: number;
  today_bookings?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: {
    data: T[];
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
  };
}

export interface CalendarEvent {
  id: number;
  title: string;
  start: string;
  end: string;
  resourceId: number;
  extendedProps: {
    room_name: string;
    user_name: string;
    user_email: string;
    division: string | null;
    purpose: string;
  };
}