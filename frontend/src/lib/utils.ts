import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, parseISO } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date, formatStr: string = 'dd MMM yyyy'): string {
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  return format(parsedDate, formatStr);
}

export function formatTime(time: string): string {
  // time format: "14:00:00" -> "14:00"
  return time.substring(0, 5);
}

export function formatDateTime(date: string, time: string): string {
  return `${formatDate(date, 'dd MMM yyyy')} at ${formatTime(time)}`;
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    cancelled: 'bg-gray-100 text-gray-800',
    available: 'bg-green-100 text-green-800',
    occupied: 'bg-red-100 text-red-800',
    maintenance: 'bg-orange-100 text-orange-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
}

export function getRoleName(role: string): string {
  const roles: Record<string, string> = {
    user: 'User',
    room_admin: 'Room Admin',
    GA: 'General Affairs',
  };
  return roles[role] || role;
}