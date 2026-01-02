import { Bell, LogOut, User, Menu } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { getRoleName } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

export const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-900 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-4">
          {/* Mobile Menu Button */}
          <Button variant="ghost" size="icon" className="md:hidden text-slate-400 hover:text-white hover:bg-slate-800">
            <Menu className="h-5 w-5" />
          </Button>
          
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
              Room Booking System
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative text-slate-400 hover:text-white hover:bg-slate-800">
                <Bell className="h-5 w-5" />
                <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs bg-blue-600 hover:bg-blue-600 border-0">
                  3
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 bg-slate-900 border-slate-800">
              <DropdownMenuLabel className="text-white">Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-slate-800" />
              <div className="max-h-96 overflow-y-auto">
                <DropdownMenuItem className="text-slate-300 focus:bg-slate-800 focus:text-white cursor-pointer">
                  <div className="flex flex-col gap-1">
                    <p className="font-medium text-sm">Request Approved</p>
                    <p className="text-xs text-slate-500">Your booking request has been approved</p>
                    <p className="text-xs text-slate-600">2 hours ago</p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="text-slate-300 focus:bg-slate-800 focus:text-white cursor-pointer">
                  <div className="flex flex-col gap-1">
                    <p className="font-medium text-sm">New Room Available</p>
                    <p className="text-xs text-slate-500">Conference Room B is now available</p>
                    <p className="text-xs text-slate-600">5 hours ago</p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="text-slate-300 focus:bg-slate-800 focus:text-white cursor-pointer">
                  <div className="flex flex-col gap-1">
                    <p className="font-medium text-sm">Booking Reminder</p>
                    <p className="text-xs text-slate-500">Your meeting starts in 30 minutes</p>
                    <p className="text-xs text-slate-600">1 day ago</p>
                  </div>
                </DropdownMenuItem>
              </div>
              <DropdownMenuSeparator className="bg-slate-800" />
              <DropdownMenuItem className="text-blue-400 hover:text-blue-300 focus:bg-slate-800 justify-center cursor-pointer">
                View all notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 hover:bg-slate-800">
                <Avatar className="h-8 w-8 bg-gradient-to-br from-blue-500 to-blue-700">
                  <AvatarFallback className="bg-transparent text-white font-semibold">
                    {user ? getInitials(user.name) : 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden text-left md:block">
                  <p className="text-sm font-medium text-white">{user?.name}</p>
                  <p className="text-xs text-slate-400">{user && getRoleName(user.role)}</p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-slate-900 border-slate-800">
              <DropdownMenuLabel className="text-white">My Account</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-slate-800" />
              <DropdownMenuItem 
                onClick={() => navigate('/profile')}
                className="text-slate-300 focus:bg-slate-800 focus:text-white cursor-pointer"
              >
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-slate-800" />
              <DropdownMenuItem 
                onClick={logout}
                className="text-red-400 focus:bg-slate-800 focus:text-red-300 cursor-pointer"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};