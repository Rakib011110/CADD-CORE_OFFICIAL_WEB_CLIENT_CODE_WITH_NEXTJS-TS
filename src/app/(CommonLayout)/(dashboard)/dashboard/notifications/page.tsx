"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/UI/card';
import { Button } from '@/components/UI/button';
import { Badge } from '@/components/UI/badge';
import { Input } from '@/components/UI/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/UI/select';
import {
  Bell,
  BellRing,
  Check,
  CheckCircle,
  Clock,
  GraduationCap,
  User,
  X,
  Eye,
  Trash2,
  Filter,
  RotateCcw,
  AlertCircle,
  Info,
  DollarSign,
  CheckCircle2
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/UI/tooltip";

interface Notification {
  _id: string;
  type: 'enrollment' | 'payment' | 'course_completion' | 'system';
  title: string;
  message: string;
  user?: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  course?: {
    _id: string;
    title: string;
  };
  payment?: {
    _id: string;
    amount: number;
    transactionId: string;
  };
  isRead: boolean;
  createdAt: string;
  metadata?: any;
}

// Mock data for notifications - replace with actual API call
const mockNotifications: Notification[] = [
  {
    _id: '1',
    type: 'enrollment',
    title: 'New Student Enrollment',
    message: 'John Doe has enrolled in Advanced JavaScript Course',
    user: {
      _id: 'user1',
      name: 'John Doe',
      email: 'john@example.com'
    },
    course: {
      _id: 'course1',
      title: 'Advanced JavaScript Course'
    },
    isRead: false,
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 minutes ago
  },
  {
    _id: '2',
    type: 'payment',
    title: 'Payment Received',
    message: 'Sarah Smith completed payment for React Masterclass',
    user: {
      _id: 'user2',
      name: 'Sarah Smith',
      email: 'sarah@example.com'
    },
    course: {
      _id: 'course2',
      title: 'React Masterclass'
    },
    payment: {
      _id: 'payment1',
      amount: 15000,
      transactionId: 'TXN123456789'
    },
    isRead: false,
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 minutes ago
  },
  {
    _id: '3',
    type: 'enrollment',
    title: 'New Student Enrollment',
    message: 'Mike Johnson has enrolled in Python for Beginners',
    user: {
      _id: 'user3',
      name: 'Mike Johnson',
      email: 'mike@example.com'
    },
    course: {
      _id: 'course3',
      title: 'Python for Beginners'
    },
    isRead: true,
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
  },
  {
    _id: '4',
    type: 'course_completion',
    title: 'Course Completed',
    message: 'Emma Wilson completed Web Development Bootcamp',
    user: {
      _id: 'user4',
      name: 'Emma Wilson',
      email: 'emma@example.com'
    },
    course: {
      _id: 'course4',
      title: 'Web Development Bootcamp'
    },
    isRead: true,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
  },
  {
    _id: '5',
    type: 'enrollment',
    title: 'New Student Enrollment',
    message: 'David Brown has enrolled in Data Science Fundamentals',
    user: {
      _id: 'user5',
      name: 'David Brown',
      email: 'david@example.com'
    },
    course: {
      _id: 'course5',
      title: 'Data Science Fundamentals'
    },
    isRead: false,
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
  }
];

const NotificationCenter = () => {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [filter, setFilter] = useState<'all' | 'unread' | 'enrollment' | 'payment'>('all');

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const filteredNotifications = notifications.filter(notification => {
    switch (filter) {
      case 'unread':
        return !notification.isRead;
      case 'enrollment':
        return notification.type === 'enrollment';
      case 'payment':
        return notification.type === 'payment';
      default:
        return true;
    }
  });

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => 
        n._id === notificationId ? { ...n, isRead: true } : n
      )
    );
    toast.success("Notification marked as read");
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, isRead: true }))
    );
    toast.success("All notifications marked as read");
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => 
      prev.filter(n => n._id !== notificationId)
    );
    toast.success("Notification deleted");
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'enrollment':
        return <GraduationCap className="w-5 h-5 text-blue-600" />;
      case 'payment':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'course_completion':
        return <Check className="w-5 h-5 text-purple-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const getNotificationBorderColor = (type: string) => {
    switch (type) {
      case 'enrollment':
        return 'border-l-blue-500';
      case 'payment':
        return 'border-l-green-500';
      case 'course_completion':
        return 'border-l-purple-500';
      default:
        return 'border-l-gray-500';
    }
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleViewDetails = (notification: Notification) => {
    if (notification.type === 'enrollment' && notification.user) {
      router.push(`/dashboard/payments/user-history/${notification.user._id}`);
    } else if (notification.type === 'payment' && notification.payment) {
      router.push(`/dashboard/payments/payment-details/${notification.payment._id}`);
    }
    markAsRead(notification._id);
  };

  return (
    <TooltipProvider>
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <BellRing className="w-6 h-6 text-gray-700" />
                    {unreadCount > 0 && (
                      <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs min-w-[20px] h-5 flex items-center justify-center rounded-full">
                        {unreadCount}
                      </Badge>
                    )}
                  </div>
                  <div>
                    <CardTitle className="text-xl">Notifications</CardTitle>
                    <p className="text-sm text-gray-600">
                      {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up!'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={markAllAsRead}
                      className="flex items-center gap-2"
                    >
                      <Check className="w-4 h-4" />
                      Mark All Read
                    </Button>
                  )}
                </div>
              </div>

              {/* Filter Buttons */}
              <div className="flex gap-2 mt-4">
                <Button
                  variant={filter === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter('all')}
                >
                  All ({notifications.length})
                </Button>
                <Button
                  variant={filter === 'unread' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter('unread')}
                >
                  Unread ({unreadCount})
                </Button>
                <Button
                  variant={filter === 'enrollment' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter('enrollment')}
                >
                  Enrollments ({notifications.filter(n => n.type === 'enrollment').length})
                </Button>
                <Button
                  variant={filter === 'payment' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter('payment')}
                >
                  Payments ({notifications.filter(n => n.type === 'payment').length})
                </Button>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              <div className="h-[600px] overflow-y-auto">
                {filteredNotifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                    <Bell className="w-12 h-12 mb-4 opacity-50" />
                    <p className="text-lg font-medium">No notifications found</p>
                    <p className="text-sm">You're all caught up!</p>
                  </div>
                ) : (
                  <div className="divide-y">
                    {filteredNotifications.map((notification) => (
                      <div
                        key={notification._id}
                        className={`p-4 hover:bg-gray-50 transition-colors border-l-4 ${getNotificationBorderColor(notification.type)} ${
                          !notification.isRead ? 'bg-blue-50/30' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3 flex-1">
                            {/* Icon */}
                            <div className="mt-1">
                              {getNotificationIcon(notification.type)}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-medium text-gray-900">
                                  {notification.title}
                                </h4>
                                {!notification.isRead && (
                                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                )}
                              </div>

                              <p className="text-sm text-gray-600 mb-2">
                                {notification.message}
                              </p>

                              {/* User and Course Info */}
                              {notification.user && (
                                <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
                                  <div className="flex items-center gap-1">
                                    <User className="w-3 h-3" />
                                    <span>{notification.user.name}</span>
                                  </div>
                                  {notification.course && (
                                    <div className="flex items-center gap-1">
                                      <GraduationCap className="w-3 h-3" />
                                      <span className="truncate max-w-[200px]">
                                        {notification.course.title}
                                      </span>
                                    </div>
                                  )}
                                  {notification.payment && (
                                    <div className="flex items-center gap-1 font-medium text-green-600">
                                      <span>{formatAmount(notification.payment.amount)}</span>
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* Time */}
                              <div className="flex items-center gap-1 text-xs text-gray-400">
                                <Clock className="w-3 h-3" />
                                <span>
                                  {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-1">
                            {(notification.type === 'enrollment' || notification.type === 'payment') && (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleViewDetails(notification)}
                                    className="h-8 w-8 p-0"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  View Details
                                </TooltipContent>
                              </Tooltip>
                            )}

                            {!notification.isRead && (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => markAsRead(notification._id)}
                                    className="h-8 w-8 p-0"
                                  >
                                    <Check className="w-4 h-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  Mark as Read
                                </TooltipContent>
                              </Tooltip>
                            )}

                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => deleteNotification(notification._id)}
                                  className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                Delete Notification
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default NotificationCenter;
