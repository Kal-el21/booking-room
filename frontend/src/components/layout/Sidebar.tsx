import { NavLink } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Calendar,
  DoorOpen,
  FileText,
  Users,
  PlusCircle,
  ListChecks,
} from 'lucide-react';

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  roles: ('user' | 'room_admin' | 'GA')[];
}

const navItems: NavItem[] = [
  // User routes
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    roles: ['user'],
  },
  {
    title: 'My Requests',
    href: '/my-requests',
    icon: FileText,
    roles: ['user'],
  },
  {
    title: 'Create Request',
    href: '/create-request',
    icon: PlusCircle,
    roles: ['user'],
  },
  
  // Room Admin routes
  {
    title: 'Rooms',
    href: '/admin/rooms',
    icon: DoorOpen,
    roles: ['room_admin'],
  },
  {
    title: 'Users',
    href: '/admin/users',
    icon: Users,
    roles: ['room_admin'],
  },
  
  // GA routes
  {
    title: 'Dashboard',
    href: '/ga/dashboard',
    icon: LayoutDashboard,
    roles: ['GA'],
  },
  {
    title: 'Pending Requests',
    href: '/ga/requests',
    icon: ListChecks,
    roles: ['GA'],
  },
  {
    title: 'Calendar',
    href: '/ga/calendar',
    icon: Calendar,
    roles: ['GA'],
  },
  {
    title: 'All Rooms',
    href: '/ga/rooms',
    icon: DoorOpen,
    roles: ['GA'],
  },
];

export const Sidebar = () => {
  const { user } = useAuthStore();

  const filteredNavItems = navItems.filter((item) => user && item.roles.includes(user.role));

  return (
    <aside className="hidden md:block md:w-64 bg-slate-900 border-r border-slate-800">
      <div className="flex h-full flex-col gap-2 p-4">
        {/* Logo/Brand Section */}
        <div className="mb-4 px-3 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center">
              <DoorOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-white text-sm">Room Booking</h2>
              <p className="text-xs text-slate-400">Management System</p>
            </div>
          </div>
        </div>

        <nav className="flex flex-1 flex-col gap-1">
          {filteredNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.href}
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/30'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  )
                }
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                <span>{item.title}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* User Info at Bottom */}
        {user && (
          <div className="mt-auto pt-4 border-t border-slate-800">
            <div className="px-3 py-2 rounded-lg bg-slate-800/50">
              <p className="text-xs text-slate-500 mb-1">Logged in as</p>
              <p className="text-sm font-medium text-white truncate">{user.name}</p>
              <p className="text-xs text-slate-400 capitalize">{user.role}</p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};