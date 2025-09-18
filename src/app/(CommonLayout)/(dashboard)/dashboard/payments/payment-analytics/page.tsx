"use client";

import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/UI/card';
import { Button } from '@/components/UI/button';
import { Badge } from '@/components/UI/badge';
import { Input } from '@/components/UI/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/UI/select';
import { Tabs,    TabsContent,    TabsList, TabsTrigger } from '@/components/UI/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/UI/table';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  ComposedChart,
  Tooltip as RechartsTooltip
} from 'recharts';
import {
  Download,
  CheckCircle,
  DollarSign,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Calendar,
  CreditCard,
  FileText,
  User,
  Copy,
  ArrowLeft,
  Bell,
  Clock,
  UserPlus,
  BookOpen,
  Activity,
  BarChart3,
  PieChart as PieChartIcon,
  CalendarDays,
  Target,
  Award,
  Users,
  Receipt,
  Eye,
  RefreshCw
} from 'lucide-react';
import { mapBengaliCourseTitle } from '@/lib/courseTitleMapping';
import { useRouter } from 'next/navigation';
import { format, formatDistanceToNow, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, isWithinInterval, subDays, subMonths, subYears } from 'date-fns';
import { useGetAllPaymentsQuery } from '@/redux/api/payment/paymentApi';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/UI/tooltip";
import { toast } from 'sonner';

interface Payment {
  _id: string;
  transactionId: string;
  user?: {
    _id: string;
    name: string;
    email: string;
    mobileNumber: string;
  } | null;
  course?: {
    _id: string;
    title: string;
    courseFee?: number;
  } | null;
  amount: number;
  status: 'pending' | 'completed' | 'failed' | 'cancelled' | 'refund';
  cardType?: string;
  paymentMethod?: string;
  checking?: boolean;
  bankTransactionId?: string;
  cardIssuer?: string;
  verifiedAt?: string;
  failureReason?: string;
  currency?: string;
  ipnReceived?: boolean;
  ipnValidated?: boolean;
  ipnValidationAttempts?: number;
  sessionId?: string;
  gatewayUrl?: string;
  customerEmail?: string;
  customerPhone?: string;
  isInstallment?: boolean;
  installmentPlan?: string;
  installmentNumber?: number;
  totalInstallments?: number;
  couponCode?: string;
  couponDiscount?: number;
  originalAmount?: number;
  createdAt: string;
  updatedAt: string;
}

interface FilterOptions {
  search: string;
  paymentMethod: string;
  dateRange: string;
  timePeriod: 'year' | 'month' | 'week' | 'day';
  customStartDate?: Date;
  customEndDate?: Date;
}

const PaymentAnalyticsPage = () => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [timeRange, setTimeRange] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('monthly');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchInput, setSearchInput] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    paymentMethod: 'all',
    dateRange: 'all',
    timePeriod: 'month'
  });

  // Prevent hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  // Add error handling with try-catch
  const [hasError, setHasError] = useState(false);
  
  useEffect(() => {
    const handleError = (error: ErrorEvent) => {
      console.error('Payment Analytics Error:', error);
      setHasError(true);
    };
    
    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (hasError) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center justify-center h-64">
            <div className="text-red-500 text-xl mb-4">⚠️ Something went wrong!</div>
            <p className="text-gray-600 mb-4">There was an error loading the payment analytics.</p>
            <Button onClick={() => window.location.reload()} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Reload Page
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Debounce search input
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setFilters(prev => ({ ...prev, search: searchInput }));
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [searchInput]);

  const { data: paymentsData, isLoading, refetch } = useGetAllPaymentsQuery(undefined);

  // Debug: Log the actual API response
  console.log('API Response:', paymentsData);
  console.log('Is Loading:', isLoading);

  const payments: Payment[] = paymentsData?.data || [];
  console.log('Processed Payments:', payments);
  console.log('Total Payments Count:', payments.length);

  // Show debug info if no payments found
  if (mounted && !isLoading && paymentsData && payments.length === 0) {
    console.warn('No payments found in API response:', {
      paymentsData,
      hasData: !!paymentsData.data,
      dataType: typeof paymentsData.data,
      isArray: Array.isArray(paymentsData.data)
    });
  }

  // Filter only successful payments with proper null checks
  const successfulPayments = useMemo(() => {
    console.log('Filtering payments:', {
      totalPayments: payments.length,
      paymentStatuses: payments.map(p => p.status),
      samplePayment: payments[0]
    });
    
    const completed = payments.filter((payment: Payment) => {
      // Check if payment exists and has required fields
      if (!payment || !payment._id) return false;
      
      // Handle both 'completed' and 'complete' status variations
      const status = payment.status?.toLowerCase();
      const isCompleted = status === 'completed' || status === 'complete';
      
      // Log payments that don't have complete user/course data but still include them
      if (isCompleted && (!payment.user || !payment.course)) {
        console.warn('Payment with incomplete user/course data but still including:', {
          transactionId: payment.transactionId,
          hasUser: !!payment.user,
          hasCourse: !!payment.course,
          amount: payment.amount
        });
      }
      
      return isCompleted;
    });
    
    console.log('Successful payments:', {
      count: completed.length,
      statuses: completed.map(p => p.status)
    });
    
    return completed;
  }, [payments]);

  // Enhanced time-based analytics calculations
  const timeAnalytics = useMemo(() => {
    try {
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth();
      const currentWeek = startOfWeek(now);

      const yearlyData: any[] = [];
      const monthlyData: any[] = [];
      const weeklyData: any[] = [];
      const dailyData: any[] = [];

    // Generate yearly data for last 5 years
    for (let year = currentYear - 4; year <= currentYear; year++) {
      const yearStart = startOfYear(new Date(year, 0, 1));
      const yearEnd = endOfYear(new Date(year, 11, 31));

      const yearPayments = successfulPayments.filter(payment =>
        isWithinInterval(new Date(payment.createdAt), { start: yearStart, end: yearEnd })
      );

      yearlyData.push({
        period: year.toString(),
        revenue: yearPayments.reduce((sum, p) => sum + p.amount, 0),
        count: yearPayments.length,
        average: yearPayments.length > 0 ? yearPayments.reduce((sum, p) => sum + p.amount, 0) / yearPayments.length : 0,
        growth: year > currentYear - 4 ? ((yearPayments.reduce((sum, p) => sum + p.amount, 0) - (yearlyData[yearlyData.length - 1]?.revenue || 0)) / (yearlyData[yearlyData.length - 1]?.revenue || 1)) * 100 : 0
      });
    }

    // Generate monthly data for current year
    for (let month = 0; month < 12; month++) {
      const monthStart = startOfMonth(new Date(currentYear, month, 1));
      const monthEnd = endOfMonth(new Date(currentYear, month, 1));

      const monthPayments = successfulPayments.filter(payment =>
        isWithinInterval(new Date(payment.createdAt), { start: monthStart, end: monthEnd })
      );

      monthlyData.push({
        period: format(monthStart, 'MMM'),
        fullPeriod: format(monthStart, 'MMMM yyyy'),
        revenue: monthPayments.reduce((sum, p) => sum + p.amount, 0),
        count: monthPayments.length,
        average: monthPayments.length > 0 ? monthPayments.reduce((sum, p) => sum + p.amount, 0) / monthPayments.length : 0
      });
    }

    // Generate weekly data for last 12 weeks
    for (let i = 11; i >= 0; i--) {
      const weekStart = startOfWeek(new Date(now.getTime() - (i * 7 * 24 * 60 * 60 * 1000)));
      const weekEnd = endOfWeek(weekStart);

      const weekPayments = successfulPayments.filter(payment =>
        isWithinInterval(new Date(payment.createdAt), { start: weekStart, end: weekEnd })
      );

      weeklyData.push({
        period: `Week ${format(weekStart, 'w')}`,
        fullPeriod: `${format(weekStart, 'MMM dd')} - ${format(weekEnd, 'MMM dd')}`,
        revenue: weekPayments.reduce((sum, p) => sum + p.amount, 0),
        count: weekPayments.length,
        average: weekPayments.length > 0 ? weekPayments.reduce((sum, p) => sum + p.amount, 0) / weekPayments.length : 0
      });
    }

    // Generate daily data for last 30 days
    for (let i = 29; i >= 0; i--) {
      const day = new Date(now.getTime() - (i * 24 * 60 * 60 * 1000));
      const dayStart = new Date(day.getFullYear(), day.getMonth(), day.getDate());
      const dayEnd = new Date(day.getFullYear(), day.getMonth(), day.getDate(), 23, 59, 59);

      const dayPayments = successfulPayments.filter(payment =>
        isWithinInterval(new Date(payment.createdAt), { start: dayStart, end: dayEnd })
      );

      dailyData.push({
        period: format(day, 'MMM dd'),
        fullPeriod: format(day, 'EEEE, MMMM dd, yyyy'),
        revenue: dayPayments.reduce((sum, p) => sum + p.amount, 0),
        count: dayPayments.length,
        average: dayPayments.length > 0 ? dayPayments.reduce((sum, p) => sum + p.amount, 0) / dayPayments.length : 0
      });
      }

      return { yearlyData, monthlyData, weeklyData, dailyData };
    } catch (error) {
      console.error('Error in time analytics calculation:', error);
      return { yearlyData: [], monthlyData: [], weeklyData: [], dailyData: [] };
    }
  }, [successfulPayments]);

  // Enhanced course-wise analytics
  const courseAnalytics = useMemo(() => {
    try {
      const courseMap = new Map();

    successfulPayments.forEach(payment => {
      // Add null checks for payment data
      if (!payment || !payment._id) return;
      
      const courseTitle = payment.course?.title || 'Unknown Course';
      const mappedCourseTitle = mapBengaliCourseTitle(courseTitle);
      const paymentDate = new Date(payment.createdAt);
      const userId = payment.user?._id || `anonymous_${payment._id}`;
      
      // Skip if essential data is missing
      if (!courseTitle || isNaN(paymentDate.getTime())) {
        console.warn('Skipping payment with missing data:', {
          transactionId: payment.transactionId,
          hasUser: !!payment.user,
          hasCourse: !!payment.course,
          userId,
          courseTitle: mappedCourseTitle
        });
        return;
      }

      if (!courseMap.has(mappedCourseTitle)) {
        courseMap.set(mappedCourseTitle, {
          title: mappedCourseTitle,
          revenue: 0,
          count: 0,
          students: new Set(),
          monthlyRevenue: new Array(12).fill(0),
          lastPayment: paymentDate,
          firstPayment: paymentDate,
          averageAmount: 0,
          paymentMethods: new Map()
        });
      }

      const course = courseMap.get(mappedCourseTitle);
      course.revenue += payment.amount || 0;
      course.count += 1;
      course.students.add(userId);

      // Track monthly revenue
      const month = paymentDate.getMonth();
      course.monthlyRevenue[month] += payment.amount || 0;

      // Track payment methods with null checks
      const method = payment.paymentMethod || payment.cardType || 'SSLCommerz';
      course.paymentMethods.set(method, (course.paymentMethods.get(method) || 0) + 1);

      // Update date ranges
      if (paymentDate > course.lastPayment) course.lastPayment = paymentDate;
      if (paymentDate < course.firstPayment) course.firstPayment = paymentDate;
    });

    const courseData = Array.from(courseMap.values()).map(course => ({
      ...course,
      students: course.students.size,
      averageAmount: course.revenue / course.count,
      monthlyAverage: course.monthlyRevenue.reduce((a: number, b: number) => a + b, 0) / 12,
      paymentMethodBreakdown: Array.from(course.paymentMethods.entries()).map((entry) => {
        const [method, count] = entry as [string, number];
        return {
          method,
          count,
          percentage: (count / course.count) * 100
        };
      }),
      duration: Math.ceil((course.lastPayment.getTime() - course.firstPayment.getTime()) / (1000 * 60 * 60 * 24))
    })).sort((a, b) => b.revenue - a.revenue);

    // Prepare chart data
    const chartData = courseData.slice(0, 10).map(course => ({
      name: course.title.length > 20 ? course.title.substring(0, 20) + '...' : course.title,
      value: course.revenue,
      count: course.count,
      students: course.students,
      average: course.averageAmount
    }));

    // Top performing courses by different metrics
    const topByRevenue = [...courseData].sort((a, b) => b.revenue - a.revenue).slice(0, 5);
    const topByStudents = [...courseData].sort((a, b) => b.students - a.students).slice(0, 5);
    const topByAverage = [...courseData].sort((a, b) => b.averageAmount - a.averageAmount).slice(0, 5);

      return { courseData, chartData, topByRevenue, topByStudents, topByAverage };
    } catch (error) {
      console.error('Error in course analytics calculation:', error);
      return { 
        courseData: [], 
        chartData: [], 
        topByRevenue: [], 
        topByStudents: [], 
        topByAverage: [] 
      };
    }
  }, [successfulPayments]);

  // Overall statistics with proper calculations
  const stats = useMemo(() => {
    try {
      const totalRevenue = successfulPayments.reduce((total, payment) => {
        return total + (payment?.amount || 0);
      }, 0);
      
      const totalPayments = successfulPayments.length;
      
      // Calculate unique students properly
      const uniqueStudents = new Set(
        successfulPayments
          .filter(p => p?.user?._id)
          .map(p => p.user!._id)
      ).size;
      
      // Calculate unique courses properly
      const uniqueCourses = new Set(
        successfulPayments
          .filter(p => p?.course?._id)
          .map(p => p.course!._id)
      ).size;

      // Calculate today's revenue and payments
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const todayPayments = successfulPayments.filter(payment => {
        if (!payment?.createdAt) return false;
        
        const paymentDate = new Date(payment.createdAt);
        if (isNaN(paymentDate.getTime())) return false;
        
        paymentDate.setHours(0, 0, 0, 0);
        return paymentDate.getTime() === today.getTime();
      });

      const todayRevenue = todayPayments.reduce((total, payment) => {
        return total + (payment?.amount || 0);
      }, 0);

      // Calculate this month's revenue
      const currentMonth = new Date();
      const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
      
      const thisMonthPayments = successfulPayments.filter(payment => {
        if (!payment?.createdAt) return false;
        const paymentDate = new Date(payment.createdAt);
        return paymentDate >= firstDayOfMonth && paymentDate <= currentMonth;
      });

      const thisMonthRevenue = thisMonthPayments.reduce((total, payment) => {
        return total + (payment?.amount || 0);
      }, 0);

      // Calculate previous month's revenue for comparison
      const previousMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
      const lastDayOfPreviousMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 0);
      
      const previousMonthPayments = successfulPayments.filter(payment => {
        if (!payment?.createdAt) return false;
        const paymentDate = new Date(payment.createdAt);
        return paymentDate >= previousMonth && paymentDate <= lastDayOfPreviousMonth;
      });

      const previousMonthRevenue = previousMonthPayments.reduce((total, payment) => {
        return total + (payment?.amount || 0);
      }, 0);

      // Calculate growth percentage
      const monthlyGrowth = previousMonthRevenue > 0 
        ? ((thisMonthRevenue - previousMonthRevenue) / previousMonthRevenue) * 100 
        : thisMonthRevenue > 0 ? 100 : 0;

      return {
        totalRevenue,
        totalPayments,
        uniqueStudents,
        uniqueCourses,
        todayRevenue,
        todayPayments: todayPayments.length,
        averageAmount: totalPayments > 0 ? totalRevenue / totalPayments : 0,
        thisMonthRevenue,
        previousMonthRevenue,
        monthlyGrowth,
        thisMonthPayments: thisMonthPayments.length
      };
    } catch (error) {
      console.error('Error in stats calculation:', error);
      return {
        totalRevenue: 0,
        totalPayments: 0,
        uniqueStudents: 0,
        uniqueCourses: 0,
        todayRevenue: 0,
        todayPayments: 0,
        averageAmount: 0,
        thisMonthRevenue: 0,
        previousMonthRevenue: 0,
        monthlyGrowth: 0,
        thisMonthPayments: 0
      };
    }
  }, [successfulPayments]);  // Filter and sort successful payments
  const filteredPayments = useMemo(() => {
    let filtered = [...successfulPayments];

    // Sort by most recent first
    filtered.sort((a, b) => {
      const dateA = new Date(a?.createdAt || 0);
      const dateB = new Date(b?.createdAt || 0);
      return dateB.getTime() - dateA.getTime();
    });

    // Search filter with null checks
    if (filters.search && filters.search.trim() !== '') {
      const searchLower = filters.search.toLowerCase().trim();
      filtered = filtered.filter((payment: Payment) => {
        if (!payment) return false;
        
        const userName = payment.user?.name?.toLowerCase() || '';
        const userEmail = payment.user?.email?.toLowerCase() || '';
        const transactionId = payment.transactionId?.toLowerCase() || '';
        const courseTitle = payment.course?.title?.toLowerCase() || '';
        const mobileNumber = payment.user?.mobileNumber?.toLowerCase() || '';

        return userName.includes(searchLower) ||
               userEmail.includes(searchLower) ||
               transactionId.includes(searchLower) ||
               courseTitle.includes(searchLower) ||
               mobileNumber.includes(searchLower);
      });
    }

    // Payment method filter with null checks
    if (filters.paymentMethod && filters.paymentMethod !== 'all') {
      filtered = filtered.filter((payment: Payment) => {
        if (!payment) return false;
        
        const paymentMethod = payment.paymentMethod?.toLowerCase() || '';
        const cardType = payment.cardType?.toLowerCase() || '';
        const filterMethod = filters.paymentMethod.toLowerCase();

        return paymentMethod.includes(filterMethod) || cardType.includes(filterMethod);
      });
    }

    return filtered;
  }, [successfulPayments, filters]);

  // Pagination logic
  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPayments = filteredPayments.slice(startIndex, startIndex + itemsPerPage);

  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleViewPaymentDetails = (paymentId: string) => {
    router.push(`/dashboard/payments/payment-details/${paymentId}`);
  };

  const clearFilters = () => {
    setSearchInput('');
    setFilters({
      search: '',
      paymentMethod: 'all',
      dateRange: 'all',
      timePeriod: 'month'
    });
    setCurrentPage(1);
  };

  const exportToCSV = (data: any[], filename: string) => {
    if (data.length === 0) {
      toast('No data to export');
      return;
    }

    const headers = Object.keys(data[0]).filter(key => key !== 'monthlyRevenue' && key !== 'paymentMethods');
    const csvContent = [
      headers.join(','),
      ...data.map(row =>
        headers.map(header => {
          const value = row[header];
          if (typeof value === 'string' && value.includes(',')) {
            return `"${value}"`;
          }
          return value;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Data exported successfully!');
  };

  const handleExportTimeAnalytics = () => {
    const data = filters.timePeriod === 'year' ? timeAnalytics.yearlyData :
                 filters.timePeriod === 'month' ? timeAnalytics.monthlyData :
                 filters.timePeriod === 'week' ? timeAnalytics.weeklyData :
                 timeAnalytics.dailyData;
    exportToCSV(data, `payment_analytics_${filters.timePeriod}`);
  };

  const handleExportCourseAnalytics = () => {
    const data = courseAnalytics.courseData.map(course => ({
      title: course.title,
      revenue: course.revenue,
      transactions: course.count,
      students: course.students,
      averageAmount: course.averageAmount,
      duration: course.duration,
      monthlyAverage: course.monthlyAverage
    }));
    exportToCSV(data, 'course_analytics');
  };

  const handleExportTransactions = () => {
    const data = filteredPayments.map(payment => ({
      transactionId: payment.transactionId,
      userName: payment.user?.name,
      userEmail: payment.user?.email,
      courseTitle: payment.course?.title,
      amount: payment.amount,
      paymentMethod: payment.paymentMethod || payment.cardType || 'SSLCommerz',
      status: payment.status,
      createdAt: new Date(payment.createdAt).toLocaleString()
    }));
    exportToCSV(data, 'payment_transactions');
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Safe date formatter to prevent hydration issues
  const formatDateSafely = (dateString: string, formatStr: string): string => {
    if (!mounted) return '';
    try {
      return format(new Date(dateString), formatStr);
    } catch (error) {
      return dateString;
    }
  };

  const StatCard = ({ title, value, icon: Icon, color, description, trend }: any) => (
    <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
            {description && (
              <p className="text-xs text-gray-500 mt-1">{description}</p>
            )}
            {trend && (
              <div className="flex items-center mt-2">
                <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
                <span className="text-xs text-green-600">{trend}</span>
              </div>
            )}
          </div>
          <div className={`p-3 rounded-full ${color.replace('text-', 'bg-').replace('-900', '-100')}`}>
            <Icon className={`w-6 h-6 ${color}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            <span className="ml-2 text-gray-500">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            <span className="ml-2 text-gray-500">Loading payment data...</span>
          </div>
        </div>
      </div>
    );
  }

  // Show error state if no data
  if (!paymentsData) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center justify-center h-64">
            <div className="text-red-500 text-xl mb-4">⚠️ Error Loading Data</div>
            <p className="text-gray-600 mb-4">Unable to fetch payment data</p>
            <Button onClick={() => refetch()} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="p-6 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          {/* Show message if no successful payments found */}
          {successfulPayments.length === 0 && (
            <div className="flex flex-col items-center justify-center h-64 bg-white rounded-lg shadow-sm">
              <div className="text-yellow-500 text-6xl mb-4">📊</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">No Successful Payments Found</h2>
              <p className="text-gray-600 mb-4 text-center max-w-md">
                {payments.length === 0 
                  ? "No payment data available yet. Payments will appear here once users complete transactions."
                  : `Found ${payments.length} total payments, but none are marked as 'completed'. Check payment statuses: ${[...new Set(payments.map(p => p.status))].join(', ')}`
                }
              </p>
              <div className="flex gap-2">
                <Button onClick={() => refetch()} variant="outline">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh Data
                </Button>
                <Button onClick={() => router.back()} variant="outline">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Go Back
                </Button>
              </div>
              {/* Debug Information */}
              <div className="mt-4 p-4 bg-gray-100 rounded text-sm text-gray-600 max-w-2xl">
                <details>
                  <summary className="cursor-pointer font-medium">Debug Information</summary>
                  <div className="mt-2 space-y-1">
                    <div>Total API Payments: {payments.length}</div>
                    <div>Successful Payments: {successfulPayments.length}</div>
                    <div>Payment Statuses: {[...new Set(payments.map(p => p.status))].join(', ') || 'None'}</div>
                    <div>API Response Success: {paymentsData?.success ? 'Yes' : 'No'}</div>
                    <div>API Response Message: {paymentsData?.message || 'N/A'}</div>
                  </div>
                </details>
              </div>
            </div>
          )}

          {/* Show analytics only if we have successful payments */}
          {successfulPayments.length > 0 && (
            <>
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-6">
              <Button
                variant="outline"
                onClick={() => router.back()}
                className="flex items-center gap-2 hover:bg-gray-100"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                  <BarChart3 className="w-10 h-10 text-blue-600" />
                  Payment Analytics
                </h1>
                <p className="text-gray-600 text-lg">Comprehensive analytics for successful payment transactions</p>
              </div>
            </div>

            {/* Key Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                title="Total Revenue"
                value={formatAmount(stats.totalRevenue)}
                icon={DollarSign}
                color="text-green-600"
                description="All successful payments"
                trend={`${stats.monthlyGrowth >= 0 ? '+' : ''}${stats.monthlyGrowth.toFixed(1)}% from last month`}
              />
              <StatCard
                title="Total Payments"
                value={stats.totalPayments.toLocaleString()}
                icon={Receipt}
                color="text-blue-600"
                description="Successful transactions"
              />
              <StatCard
                title="This Month Revenue"
                value={formatAmount(stats.thisMonthRevenue)}
                icon={TrendingUp}
                color="text-purple-600"
                description={`${stats.thisMonthPayments} payments this month`}
                trend={`Last month: ${formatAmount(stats.previousMonthRevenue)}`}
              />
              <StatCard
                title="Today's Revenue"
                value={formatAmount(stats.todayRevenue)}
                icon={Calendar}
                color="text-orange-600"
                description={`${stats.todayPayments} payments today`}
              />
            </div>
          </div>

          {/* Analytics Tabs */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="time-analytics" className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4" />
                Time Analytics
              </TabsTrigger>
              <TabsTrigger value="course-analytics" className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Course Analytics
              </TabsTrigger>
              <TabsTrigger value="transactions" className="flex items-center gap-2">
                <Receipt className="w-4 h-4" />
                Transactions
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                  <span className="ml-3 text-gray-500">Loading analytics data...</span>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Trend Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                      Revenue Trend (Monthly)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={timeAnalytics.monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="period" />
                        <YAxis tickFormatter={(value) => `৳${(value / 1000).toFixed(0)}k`} />
                        <RechartsTooltip 
                          formatter={(value: any, name: any) => [
                            `৳${Number(value).toLocaleString()}`, 
                            'Revenue'
                          ]}
                          labelFormatter={(label: any) => `${timeRange === 'daily' ? 'Day' : timeRange === 'weekly' ? 'Week' : timeRange === 'monthly' ? 'Month' : 'Year'}: ${label}`}
                          contentStyle={{
                            backgroundColor: '#fff',
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="revenue"
                          stroke="#10B981"
                          fill="#10B981"
                          fillOpacity={0.3}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Payment Methods Distribution */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PieChartIcon className="w-5 h-5 text-blue-600" />
                      Payment Methods Distribution
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={(() => {
                            const sslCount = successfulPayments.filter(p => !p.cardType && !p.paymentMethod).length;
                            const cardCount = successfulPayments.filter(p => p.cardType).length;
                            const mobileBankingCount = successfulPayments.filter(p => 
                              p.paymentMethod && ['bkash', 'nagad', 'rocket', 'upay'].some(method => 
                                p.paymentMethod?.toLowerCase().includes(method)
                              )
                            ).length;
                            
                            return [
                              { name: 'SSLCommerz Gateway', value: sslCount, color: '#3B82F6' },
                              { name: 'Credit/Debit Card', value: cardCount, color: '#10B981' },
                              { name: 'Mobile Banking', value: mobileBankingCount, color: '#F59E0B' }
                            ].filter(item => item.value > 0);
                          })()}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {(() => {
                            const sslCount = successfulPayments.filter(p => !p.cardType && !p.paymentMethod).length;
                            const cardCount = successfulPayments.filter(p => p.cardType).length;
                            const mobileBankingCount = successfulPayments.filter(p => 
                              p.paymentMethod && ['bkash', 'nagad', 'rocket', 'upay'].some(method => 
                                p.paymentMethod?.toLowerCase().includes(method)
                              )
                            ).length;
                            
                            return [
                              { name: 'SSLCommerz Gateway', value: sslCount, color: '#3B82F6' },
                              { name: 'Credit/Debit Card', value: cardCount, color: '#10B981' },
                              { name: 'Mobile Banking', value: mobileBankingCount, color: '#F59E0B' }
                            ].filter(item => item.value > 0);
                          })().map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <RechartsTooltip 
                          formatter={(value: any, name: any) => [
                            `${value} transactions`,
                            name
                          ]}
                          labelFormatter={(label: any) => `Payment Method: ${label}`}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    
                    {/* Payment Method Legend */}
                    <div className="mt-4 space-y-2">
                      {(() => {
                        const sslCount = successfulPayments.filter(p => !p.cardType && !p.paymentMethod).length;
                        const cardCount = successfulPayments.filter(p => p.cardType).length;
                        const mobileBankingCount = successfulPayments.filter(p => 
                          p.paymentMethod && ['bkash', 'nagad', 'rocket', 'upay'].some(method => 
                            p.paymentMethod?.toLowerCase().includes(method)
                          )
                        ).length;
                        
                        return [
                          { name: 'SSLCommerz Gateway', value: sslCount, color: '#3B82F6', description: 'Default payment gateway' },
                          { name: 'Credit/Debit Card', value: cardCount, color: '#10B981', description: 'Visa, Mastercard, etc.' },
                          { name: 'Mobile Banking', value: mobileBankingCount, color: '#F59E0B', description: 'bKash, Nagad, Rocket, Upay' }
                        ].filter(item => item.value > 0);
                      })().map((method, index) => (
                        <div key={index} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: method.color }}
                            ></div>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="font-medium cursor-help hover:text-blue-600">
                                  {method.name}
                                </span>
                              </TooltipTrigger>
                              <TooltipContent>
                                <div>
                                  <div className="font-medium">{method.name}</div>
                                  <div className="text-xs text-gray-500">{method.description}</div>
                                  <div className="text-xs">{method.value} transactions</div>
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                          <span className="text-gray-600">{method.value}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-green-800">Average Transaction</p>
                        <p className="text-2xl font-bold text-green-700">{formatAmount(stats.averageAmount)}</p>
                      </div>
                      <Target className="w-8 h-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-blue-800">Courses Offered</p>
                        <p className="text-2xl font-bold text-blue-700">{stats.uniqueCourses}</p>
                      </div>
                      <BookOpen className="w-8 h-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-purple-800">Success Rate</p>
                        <p className="text-2xl font-bold text-purple-700">100%</p>
                        <p className="text-xs text-purple-600">Only successful payments shown</p>
                      </div>
                      <Award className="w-8 h-8 text-purple-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>
              </>
            )}
          </TabsContent>

            {/* Time Analytics Tab */}
            <TabsContent value="time-analytics" className="space-y-6">
              <div className="flex items-center gap-4 mb-6">
                <Button
                  variant="outline"
                  onClick={() => refetch()}
                  disabled={isLoading}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                  Refresh Data
                </Button>
                <Select value={filters.timePeriod} onValueChange={(value: 'year' | 'month' | 'week' | 'day') => handleFilterChange('timePeriod', value)}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="day">Daily View</SelectItem>
                    <SelectItem value="week">Weekly View</SelectItem>
                    <SelectItem value="month">Monthly View</SelectItem>
                    <SelectItem value="year">Yearly View</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={handleExportTimeAnalytics} variant="outline" className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Export {filters.timePeriod === 'year' ? 'Yearly' : filters.timePeriod === 'month' ? 'Monthly' : filters.timePeriod === 'week' ? 'Weekly' : 'Daily'} Data
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle>
                      Revenue by {filters.timePeriod === 'year' ? 'Year' : filters.timePeriod === 'month' ? 'Month' : filters.timePeriod === 'week' ? 'Week' : 'Day'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={
                        filters.timePeriod === 'year' ? timeAnalytics.yearlyData :
                        filters.timePeriod === 'month' ? timeAnalytics.monthlyData :
                        filters.timePeriod === 'week' ? timeAnalytics.weeklyData :
                        timeAnalytics.dailyData
                      }>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="period" />
                        <YAxis tickFormatter={(value) => `৳${(value / 1000).toFixed(0)}k`} />
                        <RechartsTooltip 
                          formatter={(value: any, name: any) => [
                            `৳${Number(value).toLocaleString()}`, 
                            'Revenue'
                          ]}
                          labelFormatter={(label: any) => `${filters.timePeriod === 'year' ? 'Year' : filters.timePeriod === 'month' ? 'Month' : filters.timePeriod === 'week' ? 'Week' : 'Day'}: ${label}`}
                          contentStyle={{
                            backgroundColor: '#fff',
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                          }}
                        />
                        <Bar dataKey="revenue" fill="#3B82F6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Transaction Count Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle>
                    Transaction Count by {filters.timePeriod === 'year' ? 'Year' : filters.timePeriod === 'month' ? 'Month' : filters.timePeriod === 'week' ? 'Week' : 'Day'}
                  </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={
                        filters.timePeriod === 'year' ? timeAnalytics.yearlyData :
                        filters.timePeriod === 'month' ? timeAnalytics.monthlyData :
                        filters.timePeriod === 'week' ? timeAnalytics.weeklyData :
                        timeAnalytics.dailyData
                      }>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="period" />
                        <YAxis />
                        <RechartsTooltip 
                          formatter={(value: any, name: any) => [
                            `${value} transactions`, 
                            'Count'
                          ]}
                          labelFormatter={(label: any) => `${filters.timePeriod === 'year' ? 'Year' : filters.timePeriod === 'month' ? 'Month' : filters.timePeriod === 'week' ? 'Week' : 'Day'}: ${label}`}
                          contentStyle={{
                            backgroundColor: '#fff',
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                          }}
                        />
                        <Line type="monotone" dataKey="count" stroke="#10B981" strokeWidth={3} />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Time Analytics Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Detailed {filters.timePeriod === 'year' ? 'Yearly' : filters.timePeriod === 'month' ? 'Monthly' : filters.timePeriod === 'week' ? 'Weekly' : 'Daily'} Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Period</TableHead>
                        <TableHead>Revenue</TableHead>
                        <TableHead>Transactions</TableHead>
                        <TableHead>Average Amount</TableHead>
                        {filters.timePeriod === 'year' && <TableHead>Growth</TableHead>}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(filters.timePeriod === 'year' ? timeAnalytics.yearlyData :
                        filters.timePeriod === 'month' ? timeAnalytics.monthlyData :
                        filters.timePeriod === 'week' ? timeAnalytics.weeklyData :
                        timeAnalytics.dailyData).map((item, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="cursor-help">{item.period}</span>
                              </TooltipTrigger>
                              <TooltipContent>
                                {item.fullPeriod || item.period}
                              </TooltipContent>
                            </Tooltip>
                          </TableCell>
                          <TableCell className="text-green-600 font-semibold">{formatAmount(item.revenue)}</TableCell>
                          <TableCell>{item.count}</TableCell>
                          <TableCell>{formatAmount(item.average)}</TableCell>
                          {filters.timePeriod === 'year' && (
                            <TableCell>
                              <span className={`font-medium ${item.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {item.growth > 0 ? '+' : ''}{item.growth.toFixed(1)}%
                              </span>
                            </TableCell>
                          )}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Course Analytics Tab */}
            <TabsContent value="course-analytics" className="space-y-6">
              {/* Export Button */}
              <div className="flex justify-end mb-4">
                <Button onClick={handleExportCourseAnalytics} variant="outline" className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Export Course Analytics
                </Button>
              </div>
              {/* Top Courses Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-green-800">Top Course by Revenue</p>
                        <p className="text-lg font-bold text-green-700 ">
                          {courseAnalytics.topByRevenue[0]?.title || 'N/A'}
                        </p>
                        <p className="text-sm text-green-600">
                          {formatAmount(courseAnalytics.topByRevenue[0]?.revenue || 0)}
                        </p>
                      </div>
                      <Award className="w-8 h-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-blue-800">Top Course by Students</p>
                        <p className="text-lg font-bold text-blue-700 ">
                          {courseAnalytics.topByStudents[0]?.title || 'N/A'}
                        </p>
                        <p className="text-sm text-blue-600">
                          {courseAnalytics.topByStudents[0]?.students || 0} students
                        </p>
                      </div>
                      <Users className="w-8 h-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-purple-800">Highest Average Amount</p>
                        <p className="text-lg font-bold text-purple-700 ">
                          {courseAnalytics.topByAverage[0]?.title || 'N/A'}
                        </p>
                        <p className="text-sm text-purple-600">
                          {formatAmount(courseAnalytics.topByAverage[0]?.averageAmount || 0)}
                        </p>
                      </div>
                      <Target className="w-8 h-8 text-purple-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Course Revenue Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-purple-600" />
                      Course Revenue Distribution
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={courseAnalytics.chartData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {courseAnalytics.chartData.map((entry, index) => {
                            const colors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF7C7C', '#8DD1E1', '#D084D0'];
                            return (
                              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                            );
                          })}
                        </Pie>
                        <RechartsTooltip formatter={(value: any, name: any) => [`৳${value.toLocaleString()}`, name]} />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Course Performance Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                      Top Courses by Revenue
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={courseAnalytics.chartData.slice(0, 8)} layout="horizontal">
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" tickFormatter={(value) => `৳${(value / 1000).toFixed(0)}k`} />
                        <YAxis dataKey="name" type="category" width={100} />
                        <RechartsTooltip 
                          formatter={(value: any, name: any) => [
                            `৳${Number(value).toLocaleString()}`, 
                            'Revenue'
                          ]}
                          labelFormatter={(label: any) => `Course: ${label}`}
                          contentStyle={{
                            backgroundColor: '#fff',
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                          }}
                        />
                        <Bar dataKey="value" fill="#8B5CF6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Course Analytics Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Course-wise Payment Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Course Title</TableHead>
                        <TableHead>Total Revenue</TableHead>
                        <TableHead>Transactions</TableHead>
                        <TableHead>Unique Students</TableHead>
                        <TableHead>Average per Transaction</TableHead>
                        <TableHead>Duration (Days)</TableHead>
                        <TableHead>Monthly Avg</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {courseAnalytics.courseData.map((course, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium max-w-xs truncate" title={course.title}>
                            {course.title}
                          </TableCell>
                          <TableCell className="text-green-600 font-semibold">
                            {formatAmount(course.revenue)}
                          </TableCell>
                          <TableCell>{course.count}</TableCell>
                          <TableCell>{course.students}</TableCell>
                          <TableCell>{formatAmount(course.averageAmount)}</TableCell>
                          <TableCell>{course.duration}</TableCell>
                          <TableCell>{formatAmount(course.monthlyAverage)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Transactions Tab */}
            <TabsContent value="transactions" className="space-y-6">
              {/* Filters Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Filter className="w-5 h-5" />
                    Filters
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Search Filter */}
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Search by name, email, phone, transaction ID, course..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        className="pl-10"
                      />
                      {searchInput && (
                        <button
                          onClick={() => setSearchInput('')}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          ✕
                        </button>
                      )}
                    </div>

                    {/* Payment Method Filter */}
                    <Select value={filters.paymentMethod} onValueChange={(value) => handleFilterChange('paymentMethod', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Filter by payment method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Methods</SelectItem>
                        <SelectItem value="card">Card Payment</SelectItem>
                        <SelectItem value="visa">Visa</SelectItem>
                        <SelectItem value="mastercard">Mastercard</SelectItem>
                        <SelectItem value="bkash">bKash</SelectItem>
                        <SelectItem value="nagad">Nagad</SelectItem>
                        <SelectItem value="rocket">Rocket</SelectItem>
                        <SelectItem value="upay">Upay</SelectItem>
                        <SelectItem value="ssl">SSLCommerz</SelectItem>
                      </SelectContent>
                    </Select>

                    {/* Date Range Filter */}
                    <Select value={filters.dateRange} onValueChange={(value) => handleFilterChange('dateRange', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Filter by date" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Time</SelectItem>
                        <SelectItem value="today">Today</SelectItem>
                        <SelectItem value="week">Last 7 Days</SelectItem>
                        <SelectItem value="month">Last 30 Days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Clear Filters Button and Search Results */}
                  <div className="mt-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                    {filters.search && (
                      <div className="text-sm text-gray-600">
                        Found {filteredPayments.length} result{filteredPayments.length !== 1 ? 's' : ''} for "{filters.search}"
                      </div>
                    )}
                    <div className="flex gap-2">
                      {(searchInput || filters.paymentMethod !== 'all' || filters.dateRange !== 'all') && (
                        <Button variant="outline" onClick={clearFilters} size="sm">
                          Clear All Filters
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Transactions Table */}
              <Card className="overflow-hidden">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      Successful Payment Transactions
                    </CardTitle>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <span className="text-sm text-gray-600">
                        Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredPayments.length)} of {filteredPayments.length} results
                      </span>
                      <Button variant="outline" className="flex items-center gap-2" onClick={handleExportTransactions}>
                        <Download className="w-4 h-4" />
                        Export Transactions
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {filteredPayments.length === 0 && !isLoading ? (
                    <div className="text-center py-12">
                      <CheckCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No successful payments found</h3>
                      <p className="text-gray-500 mb-4">
                        {searchInput || filters.paymentMethod !== 'all' || filters.dateRange !== 'all'
                          ? "Try adjusting your filters to find what you're looking for."
                          : "No successful payments available yet."}
                      </p>
                      {(searchInput || filters.paymentMethod !== 'all' || filters.dateRange !== 'all') && (
                        <Button variant="outline" onClick={clearFilters}>
                          Clear All Filters
                        </Button>
                      )}
                    </div>
                  ) : (
                    <>
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow className="bg-green-50">
                              <TableHead className="font-semibold text-gray-900">User Details</TableHead>
                              <TableHead className="font-semibold text-gray-900">Course</TableHead>
                              <TableHead className="font-semibold text-gray-900">Transaction ID</TableHead>
                              <TableHead className="font-semibold text-gray-900">Amount</TableHead>
                              <TableHead className="font-semibold text-gray-900">Method</TableHead>
                              <TableHead className="font-semibold text-gray-900">Date</TableHead>
                              <TableHead className="font-semibold text-gray-900 text-center">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {isLoading ? (
                              <TableRow>
                                <TableCell colSpan={7} className="text-center py-12">
                                  <div className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                                    <span className="ml-2 text-gray-500">Loading payments...</span>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ) : (
                              paginatedPayments.map((payment, index) => {
                                // Add safety check for payment data
                                if (!payment || !payment._id) {
                                  console.warn('Invalid payment data:', payment);
                                  return null;
                                }
                                
                                return (
                                <TableRow
                                  key={payment._id}
                                  className={
                                    payment.checking
                                      ? "bg-blue-50 border-l-4 border-l-blue-500 hover:bg-blue-100 transition-colors"
                                      : index % 2 === 0
                                        ? "bg-white hover:bg-gray-50 transition-colors"
                                        : "bg-green-50/30 hover:bg-green-100/50 transition-colors"
                                  }
                                >
                                  <TableCell className="py-4">
                                    <div className="space-y-1">
                                      <div className="flex items-center gap-2">
                                        {payment.checking && (
                                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" title="Reviewed"></div>
                                        )}
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <span
                                              className={`font-medium cursor-pointer transition-colors ${
                                                payment.checking
                                                  ? "text-blue-700 hover:text-blue-800"
                                                  : "hover:text-green-600"
                                              }`}
                                              onClick={() => navigator.clipboard.writeText(payment.user?.name || "N/A")}
                                            >
                                              {payment.user?.name?.split(" ").slice(0, 2).join(" ") || "Unknown User"}
                                            </span>
                                          </TooltipTrigger>
                                          <TooltipContent>
                                            Click to copy: {payment.user?.name || "Unknown User"}
                                            {payment.checking && " (Reviewed)"}
                                          </TooltipContent>
                                        </Tooltip>
                                        <Copy
                                          className={`w-3 h-3 cursor-pointer transition-colors ${
                                            payment.checking
                                              ? "text-blue-400 hover:text-blue-600"
                                              : "text-gray-400 hover:text-gray-600"
                                          }`}
                                          onClick={() => navigator.clipboard.writeText(payment.user?.name || "")}
                                        />
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <span
                                              className={`text-sm cursor-pointer transition-colors ${
                                                payment.checking
                                                  ? "text-blue-600 hover:text-blue-700"
                                                  : "text-gray-500 hover:text-green-600"
                                              }`}
                                              onClick={() => navigator.clipboard.writeText(payment.user?.email || "N/A")}
                                            >
                                              {payment.user?.email || "No email"}
                                            </span>
                                          </TooltipTrigger>
                                          <TooltipContent>
                                            Click to copy: {payment.user?.email || "No email"}
                                          </TooltipContent>
                                        </Tooltip>
                                        <Copy
                                          className={`w-3 h-3 cursor-pointer transition-colors ${
                                            payment.checking
                                              ? "text-blue-400 hover:text-blue-600"
                                              : "text-gray-400 hover:text-gray-600"
                                          }`}
                                          onClick={() => navigator.clipboard.writeText(payment.user?.email || "")}
                                        />
                                      </div>
                                    </div>
                                  </TableCell>

                                  <TableCell className="py-4">
                                    <div className="flex items-center gap-2">
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <span
                                            className={`font-medium cursor-pointer transition-colors max-w-[150px] truncate ${
                                              payment.checking
                                                ? "text-blue-700 hover:text-blue-800"
                                                : "hover:text-green-600"
                                            }`}
                                            onClick={() => navigator.clipboard.writeText(payment.course?.title || "N/A")}
                                          >
                                            {payment.course?.title || "Unknown Course"}
                                          </span>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          Click to copy: {payment.course?.title || "Unknown Course"}
                                        </TooltipContent>
                                      </Tooltip>
                                      <Copy
                                        className={`w-3 h-3 cursor-pointer transition-colors ${
                                          payment.checking
                                            ? "text-blue-400 hover:text-blue-600"
                                            : "text-gray-400 hover:text-gray-600"
                                        }`}
                                        onClick={() => navigator.clipboard.writeText(payment.course?.title || "")}
                                      />
                                    </div>
                                  </TableCell>

                                  <TableCell className="py-4">
                                    <div className="flex items-center gap-2">
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <code
                                            className={`text-xs px-2 py-1 rounded cursor-pointer transition-colors ${
                                              payment.checking
                                                ? "bg-blue-100 text-blue-800 hover:bg-blue-200"
                                                : "bg-green-100 hover:bg-green-200"
                                            }`}
                                            onClick={() => navigator.clipboard.writeText(payment.transactionId)}
                                          >
                                            {payment.transactionId.slice(0, 12)}...
                                          </code>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          Click to copy: {payment.transactionId}
                                        </TooltipContent>
                                      </Tooltip>
                                      <Copy
                                        className={`w-3 h-3 cursor-pointer transition-colors ${
                                          payment.checking
                                            ? "text-blue-400 hover:text-blue-600"
                                            : "text-gray-400 hover:text-gray-600"
                                        }`}
                                        onClick={() => navigator.clipboard.writeText(payment.transactionId)}
                                      />
                                    </div>
                                  </TableCell>

                                  <TableCell className="py-4">
                                    <div className={`font-bold text-lg ${
                                      payment.checking ? "text-blue-700" : "text-green-700"
                                    }`}>
                                      {formatAmount(payment.amount)}
                                    </div>
                                  </TableCell>

                                  <TableCell className="py-4">
                                    <div className="flex items-center gap-2">
                                      <CreditCard className="w-4 h-4 text-gray-500" />
                                      <span className="text-sm font-medium">
                                        {payment.cardType || payment.paymentMethod || "SSL"}
                                      </span>
                                    </div>
                                  </TableCell>

                                  <TableCell className="py-4">
                                    <div className="space-y-1">
                                      <div className="text-sm font-medium flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        {formatDateSafely(payment.createdAt, "MMM dd, yyyy")}
                                      </div>
                                      <div className="text-xs text-gray-500">
                                        {formatDateSafely(payment.createdAt, "hh:mm a")}
                                      </div>
                                    </div>
                                  </TableCell>

                                  <TableCell className="py-4">
                                    <div className="flex items-center justify-center gap-1">
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleViewPaymentDetails(payment._id)}
                                            className={`h-8 w-8 p-0 transition-colors ${
                                              payment.checking
                                                ? "hover:bg-blue-50 hover:border-blue-200 border-blue-300"
                                                : "hover:bg-green-50 hover:border-green-200"
                                            }`}
                                          >
                                            <FileText className={`w-4 h-4 ${
                                              payment.checking ? "text-blue-600" : "text-gray-600"
                                            }`} />
                                          </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          View Payment Details {payment.checking && "(Reviewed)"}
                                        </TooltipContent>
                                      </Tooltip>

                                      {payment.checking && (
                                        <div className="flex items-center ml-2">
                                          <CheckCircle className="w-4 h-4 text-blue-500" />
                                          <span className="sr-only">Reviewed</span>
                                        </div>
                                      )}
                                    </div>
                                  </TableCell>
                                </TableRow>
                                );
                              }).filter(Boolean) // Remove any null entries
                            )}
                          </TableBody>
                        </Table>
                      </div>

                      {/* Pagination */}
                      {totalPages > 1 && (
                        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                          <div className="text-sm text-gray-700">
                            Page {currentPage} of {totalPages}
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                              disabled={currentPage === 1}
                              className="flex items-center gap-1"
                            >
                              <ChevronLeft className="w-4 h-4" />
                              <span className="hidden sm:inline">Previous</span>
                            </Button>

                            {/* Page numbers */}
                            <div className="hidden sm:flex gap-1">
                              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                let pageNum;
                                if (totalPages <= 5) {
                                  pageNum = i + 1;
                                } else if (currentPage <= 3) {
                                  pageNum = i + 1;
                                } else if (currentPage >= totalPages - 2) {
                                  pageNum = totalPages - 4 + i;
                                } else {
                                  pageNum = currentPage - 2 + i;
                                }

                                return (
                                  <Button
                                    key={pageNum}
                                    variant={currentPage === pageNum ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setCurrentPage(pageNum)}
                                    className="w-8 h-8 p-0"
                                  >
                                    {pageNum}
                                  </Button>
                                );
                              })}
                            </div>

                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                              disabled={currentPage === totalPages}
                              className="flex items-center gap-1"
                            >
                              <span className="hidden sm:inline">Next</span>
                              <ChevronRight className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
            </>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
};

export default PaymentAnalyticsPage;
