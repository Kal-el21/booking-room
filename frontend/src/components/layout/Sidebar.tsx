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
    title: 'Users', // ✅ NEW
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
    <aside className="hidden border-r bg-muted/10 md:block md:w-64">
      <div className="flex h-full flex-col gap-2 p-4">
        <nav className="flex flex-1 flex-col gap-1">
          {filteredNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.href}
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )
                }
              >
                <Icon className="h-5 w-5" />
                {item.title}
              </NavLink>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};