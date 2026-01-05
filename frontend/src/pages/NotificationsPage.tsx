import { useEffect, useState } from 'react';
import { notificationsApi } from '@/lib/apiService';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { ErrorMessage } from '@/components/shared/ErrorMessage';
import type { Notification } from '@/lib/types';
import { useNavigate } from 'react-router-dom';
import { 
  Bell, 
  CheckCheck, 
  Trash2, 
  Filter,
  Calendar,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

export const NotificationsPage = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    filterNotifications();
  }, [notifications, activeTab, typeFilter]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await notificationsApi.getAll();
      if (response.data.success && response.data.data) {
        const notifData = Array.isArray(response.data.data) 
          ? response.data.data 
          : response.data.data.data || [];
        setNotifications(notifData);
        setUnreadCount(notifData.filter((n: Notification) => !n.read_at).length);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const filterNotifications = () => {
    let filtered = notifications;

    // Filter by read/unread status
    if (activeTab === 'unread') {
      filtered = filtered.filter(n => !n.read_at);
    } else if (activeTab === 'read') {
      filtered = filtered.filter(n => n.read_at);
    }

    // Filter by type
    if (typeFilter !== 'all') {
      filtered = filtered.filter(n => n.type === typeFilter);
    }

    setFilteredNotifications(filtered);
  };

  const handleMarkAsRead = async (id: number) => {
    try {
      await notificationsApi.markAsRead(id);
      fetchNotifications();
      toast.success('Marked as read');
    } catch (err: any) {
      toast.error('Failed to mark as read');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationsApi.markAllAsRead();
      fetchNotifications();
      toast.success('All notifications marked as read');
    } catch (err: any) {
      toast.error('Failed to mark all as read');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await notificationsApi.delete(id);
      fetchNotifications();
      toast.success('Notification deleted');
    } catch (err: any) {
      toast.error('Failed to delete notification');
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read_at) {
      handleMarkAsRead(notification.id_notification);
    }
    if (notification.data?.url) {
      navigate(notification.data.url);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'request_approved':
        return <CheckCircle className="h-6 w-6 text-green-400" />;
      case 'request_rejected':
        return <XCircle className="h-6 w-6 text-red-400" />;
      case 'booking_reminder':
        return <Clock className="h-6 w-6 text-yellow-400" />;
      case 'request_submitted':
        return <FileText className="h-6 w-6 text-blue-400" />;
      case 'booking_cancelled':
        return <AlertCircle className="h-6 w-6 text-orange-400" />;
      default:
        return <Bell className="h-6 w-6 text-slate-400" />;
    }
  };

  const getNotificationBgColor = (type: string) => {
    switch (type) {
      case 'request_approved':
        return 'bg-green-500/10';
      case 'request_rejected':
        return 'bg-red-500/10';
      case 'booking_reminder':
        return 'bg-yellow-500/10';
      case 'request_submitted':
        return 'bg-blue-500/10';
      case 'booking_cancelled':
        return 'bg-orange-500/10';
      default:
        return 'bg-slate-500/10';
    }
  };

  const getTimeAgo = (date: string) => {
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true });
    } catch {
      return 'recently';
    }
  };

  const getTypeName = (type: string) => {
    const typeMap: Record<string, string> = {
      request_approved: 'Request Approved',
      request_rejected: 'Request Rejected',
      booking_reminder: 'Booking Reminder',
      request_submitted: 'Request Submitted',
      booking_cancelled: 'Booking Cancelled',
    };
    return typeMap[type] || type;
  };

  if (loading) return <LoadingSpinner text="Loading notifications..." />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Notifications</h1>
          <p className="text-slate-400 mt-1">Manage all your notifications</p>
        </div>
        {unreadCount > 0 && (
          <Button 
            onClick={handleMarkAllAsRead}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
          >
            <CheckCheck className="mr-2 h-4 w-4" />
            Mark all as read
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-slate-900/80 border-slate-800 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{notifications.length}</div>
              <p className="text-sm text-slate-400 mt-1">Total</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/80 border-slate-800 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">{unreadCount}</div>
              <p className="text-sm text-slate-400 mt-1">Unread</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/80 border-slate-800 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">
                {notifications.filter(n => n.read_at).length}
              </div>
              <p className="text-sm text-slate-400 mt-1">Read</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/80 border-slate-800 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">
                {notifications.filter(n => {
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  return new Date(n.created_at) >= today;
                }).length}
              </div>
              <p className="text-sm text-slate-400 mt-1">Today</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-64 bg-slate-800/50 border-slate-700 text-white">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-slate-900 border-slate-800">
            <SelectItem value="all" className="text-slate-300 focus:bg-slate-800 focus:text-white">
              All Types
            </SelectItem>
            <SelectItem value="request_approved" className="text-slate-300 focus:bg-slate-800 focus:text-white">
              Request Approved
            </SelectItem>
            <SelectItem value="request_rejected" className="text-slate-300 focus:bg-slate-800 focus:text-white">
              Request Rejected
            </SelectItem>
            <SelectItem value="booking_reminder" className="text-slate-300 focus:bg-slate-800 focus:text-white">
              Booking Reminder
            </SelectItem>
            <SelectItem value="request_submitted" className="text-slate-300 focus:bg-slate-800 focus:text-white">
              Request Submitted
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Notifications List */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-slate-900 border border-slate-800 p-1">
          <TabsTrigger 
            value="all"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-700 data-[state=active]:text-white text-slate-400"
          >
            All ({notifications.length})
          </TabsTrigger>
          <TabsTrigger 
            value="unread"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-700 data-[state=active]:text-white text-slate-400"
          >
            Unread ({unreadCount})
          </TabsTrigger>
          <TabsTrigger 
            value="read"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-700 data-[state=active]:text-white text-slate-400"
          >
            Read ({notifications.filter(n => n.read_at).length})
          </TabsTrigger>
        </TabsList>

        {['all', 'unread', 'read'].map((tab) => (
          <TabsContent key={tab} value={tab} className="space-y-3">
            {filteredNotifications.length === 0 ? (
              <Card className="bg-slate-900/80 border-slate-800 backdrop-blur-sm">
                <CardContent className="py-16">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Bell className="h-10 w-10 text-slate-600" />
                    </div>
                    <p className="text-slate-400 font-medium text-lg">No notifications</p>
                    <p className="text-slate-600 text-sm mt-2">
                      {tab === 'all' ? 'You have no notifications yet' : 
                       tab === 'unread' ? 'All notifications have been read' :
                       'No read notifications'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              filteredNotifications.map((notification) => (
                <Card 
                  key={notification.id_notification}
                  className={`bg-slate-900/80 border-slate-800 backdrop-blur-sm hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-200 cursor-pointer ${
                    !notification.read_at ? 'border-l-4 border-l-blue-500' : ''
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${getNotificationBgColor(notification.type)}`}>
                        {getNotificationIcon(notification.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-white">
                                {notification.data?.title || 'Notification'}
                              </h3>
                              {!notification.read_at && (
                                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                              )}
                            </div>
                            <Badge className="bg-slate-700/50 text-slate-300 text-xs">
                              {getTypeName(notification.type)}
                            </Badge>
                          </div>
                          
                          <div className="flex gap-2">
                            {!notification.read_at && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMarkAsRead(notification.id_notification);
                                }}
                                className="text-blue-400 hover:text-blue-300 hover:bg-slate-800"
                              >
                                <CheckCheck className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(notification.id_notification);
                              }}
                              className="text-red-400 hover:text-red-300 hover:bg-slate-800"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <p className="text-sm text-slate-400 mb-3">
                          {notification.data?.message || notification.data?.body || 'No message'}
                        </p>
                        
                        <div className="flex items-center gap-4 text-xs text-slate-600">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {getTimeAgo(notification.created_at)}
                          </span>
                          {notification.read_at && (
                            <span className="flex items-center gap-1">
                              <CheckCheck className="h-3 w-3" />
                              Read {getTimeAgo(notification.read_at)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};