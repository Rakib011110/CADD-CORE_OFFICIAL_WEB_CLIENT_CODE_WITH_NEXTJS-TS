"use client";

import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/UI/card';
import { Button } from '@/components/UI/button';
import { Badge } from '@/components/UI/badge';
import { Input } from '@/components/UI/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/UI/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/UI/table';
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
  Users,
  CreditCard,
  FileText,
  User,
  Copy,
  ArrowLeft,
  Bell,
  Clock,
  UserPlus,
  BookOpen,
  Star
} from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { format, formatDistanceToNow } from 'date-fns';
import { useGetAllPaymentsQuery } from '@/redux/api/payment/paymentApi';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/UI/tooltip";

interface Payment {
  _id: string;
  transactionId: string;
  user: {
    _id: string;
    name: string;
    email: string;
    mobileNumber: string;
  };
  course: {
    _id: string;
    title: string;
  };
  amount: number;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  cardType?: string;
  paymentMethod?: string;
  checking: boolean;
  createdAt: string;
  updatedAt: string;
}

interface FilterOptions {
  search: string;
  paymentMethod: string;
  dateRange: string;
}

const SuccessPaymentPage = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchInput, setSearchInput] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    paymentMethod: 'all',
    dateRange: 'all'
  });

  // Debounce search input
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setFilters(prev => ({ ...prev, search: searchInput }));
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [searchInput]);

  const { data: paymentsData, isLoading, refetch } = useGetAllPaymentsQuery(undefined);

  const payments: Payment[] = paymentsData?.data || [];

  // Filter only successful payments
  const successfulPayments = useMemo(() => {
    return payments.filter((payment: Payment) => payment.status === 'completed');
  }, [payments]);

  // Calculate statistics for successful payments
  const stats = useMemo(() => {
    const totalAmount = successfulPayments.reduce((total, payment) => total + payment.amount, 0);
    const totalPayments = successfulPayments.length;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayPayments = successfulPayments.filter(payment => {
      const paymentDate = new Date(payment.createdAt);
      paymentDate.setHours(0, 0, 0, 0);
      return paymentDate.getTime() === today.getTime();
    });
    
    const todayAmount = todayPayments.reduce((total, payment) => total + payment.amount, 0);
    
    return {
      totalAmount,
      totalPayments,
      todayPayments: todayPayments.length,
      todayAmount,
      averageAmount: totalPayments > 0 ? totalAmount / totalPayments : 0
    };
  }, [successfulPayments]);

  // Filter and sort successful payments
  const filteredPayments = useMemo(() => {
    let filtered = [...successfulPayments];

    // Sort by most recent first (createdAt descending)
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Search filter
    if (filters.search && filters.search.trim() !== '') {
      const searchLower = filters.search.toLowerCase().trim();
      filtered = filtered.filter((payment: Payment) => {
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

    // Payment method filter
    if (filters.paymentMethod && filters.paymentMethod !== 'all') {
      filtered = filtered.filter((payment: Payment) => {
        const paymentMethod = payment.paymentMethod?.toLowerCase() || '';
        const cardType = payment.cardType?.toLowerCase() || '';
        const filterMethod = filters.paymentMethod.toLowerCase();
        
        return paymentMethod.includes(filterMethod) || cardType.includes(filterMethod);
      });
    }

    // Date range filter
    if (filters.dateRange && filters.dateRange !== 'all') {
      const now = new Date();
      let filterDate = new Date();
      
      switch (filters.dateRange) {
        case 'today':
          filterDate = new Date();
          filterDate.setHours(0, 0, 0, 0);
          filtered = filtered.filter((payment: Payment) => {
            const paymentDate = new Date(payment.createdAt);
            paymentDate.setHours(0, 0, 0, 0);
            return paymentDate.getTime() === filterDate.getTime();
          });
          break;
        case 'week':
          filterDate = new Date();
          filterDate.setDate(now.getDate() - 7);
          filterDate.setHours(0, 0, 0, 0);
          filtered = filtered.filter((payment: Payment) => 
            new Date(payment.createdAt) >= filterDate
          );
          break;
        case 'month':
          filterDate = new Date();
          filterDate.setMonth(now.getMonth() - 1);
          filterDate.setHours(0, 0, 0, 0);
          filtered = filtered.filter((payment: Payment) => 
            new Date(payment.createdAt) >= filterDate
          );
          break;
        default:
          break;
      }
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

  const handleViewUserHistory = (userId: string) => {
    router.push(`/dashboard/payments/user-history/${userId}`);
  };

  const clearFilters = () => {
    setSearchInput('');
    setFilters({
      search: '',
      paymentMethod: 'all',
      dateRange: 'all'
    });
    setCurrentPage(1);
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const StatCard = ({ title, value, icon: Icon, color, description }: any) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
            {description && (
              <p className="text-xs text-gray-500 mt-1">{description}</p>
            )}
          </div>
          <Icon className={`w-8 h-8 ${color.replace('text-', 'text-').replace('-900', '-600')}`} />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <TooltipProvider>
      <div className="p-3 sm:p-6 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
              <Button
                variant="outline"
                onClick={() => router.back()}
                className="flex items-center gap-2 w-fit"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Back</span>
              </Button>
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-green-900 mb-2 flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
                  <span className="truncate">Successful Payments</span>
                </h1>
                <p className="text-sm sm:text-base text-gray-600">View and manage all completed payment transactions</p>
              </div>
            </div>

            {/* Recent Payment Notifications */}
            <Card className="mb-8 border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-green-800">
                  <Bell className="w-5 h-5 text-green-600" />
                  Recent Student Admissions & Payments
                  <Badge variant="outline" className="ml-2 bg-green-100 text-green-700 border-green-300">
                    Live
                  </Badge>
                </CardTitle>
                <p className="text-sm text-green-600">Latest successful enrollments and payments</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Summary Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-lg border border-green-200 shadow-sm">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                          <p className="text-xl font-bold text-green-700">{formatAmount(stats.totalAmount)}</p>
                        </div>
                        <DollarSign className="w-6 h-6 text-green-600" />
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-green-200 shadow-sm">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Total Students</p>
                          <p className="text-xl font-bold text-blue-700">{stats.totalPayments}</p>
                        </div>
                        <Users className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                  </div>

                  {/* Recent Notifications */}
                  <div className="bg-white p-4 rounded-lg border border-green-200 shadow-sm">
                    <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <UserPlus className="w-4 h-4 text-green-600" />
                      Recent Admissions
                    </h4>
                    <div className="space-y-3 max-h-32 overflow-y-auto">
                      {filteredPayments.slice(0, 3).map((payment, index) => (
                        <div key={payment._id} className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded-md transition-colors">
                          <div className="flex-shrink-0 mt-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-gray-900 truncate">
                              {payment.user?.name} enrolled in {payment.course?.title}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs font-semibold text-green-600">
                                {formatAmount(payment.amount)}
                              </span>
                              <span className="text-xs text-gray-500 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {formatDistanceToNow(new Date(payment.createdAt), { addSuffix: true })}
                              </span>
                            </div>
                          </div>
                          <div className="flex-shrink-0">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          </div>
                        </div>
                      ))}
                      {filteredPayments.length === 0 && (
                        <div className="text-center py-4 text-gray-500">
                          <UserPlus className="w-8 h-8 mx-auto mb-2 opacity-50" />
                          <p className="text-xs">No recent admissions</p>
                        </div>
                      )}
                    </div>
                    {filteredPayments.length > 3 && (
                      <div className="mt-3 pt-2 border-t border-gray-100">
                        <p className="text-xs text-gray-500 text-center">
                          +{filteredPayments.length - 3} more students enrolled
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters Section */}
          <Card className="mb-4 sm:mb-6">
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Filter className="w-4 h-4 sm:w-5 sm:h-5" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {/* Search Filter */}
                <div className="relative sm:col-span-2 lg:col-span-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search by name, email, phone..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="pl-10 text-sm"
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
                  <SelectTrigger className="text-sm">
                    <SelectValue placeholder="Payment method" />
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
                  <SelectTrigger className="text-sm">
                    <SelectValue placeholder="Date range" />
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
              <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                {filters.search && (
                  <div className="text-xs sm:text-sm text-gray-600">
                    Found {filteredPayments.length} result{filteredPayments.length !== 1 ? 's' : ''} for "{filters.search}"
                  </div>
                )}
                <div className="flex gap-2">
                  {(searchInput || filters.paymentMethod !== 'all' || filters.dateRange !== 'all') && (
                    <Button variant="outline" onClick={clearFilters} size="sm" className="text-xs sm:text-sm">
                      Clear All Filters
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payments Table */}
          <Card className="overflow-hidden">
            <CardHeader className="pb-3 sm:pb-4">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                  <span className="truncate">Successful Payment Transactions</span>
                </CardTitle>
                <div className="flex flex-col sm:flex-row gap-2">
                  <span className="text-xs sm:text-sm text-gray-600 order-2 sm:order-1">
                    Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredPayments.length)} of {filteredPayments.length} results
                  </span>
                  <Button variant="outline" className="flex items-center gap-2 text-xs sm:text-sm order-1 sm:order-2" size="sm">
                    <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Export</span>
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {filteredPayments.length === 0 && !isLoading ? (
                <div className="text-center py-8 sm:py-12 px-4">
                  <CheckCircle className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No successful payments found</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    {searchInput || filters.paymentMethod !== 'all' || filters.dateRange !== 'all'
                      ? "Try adjusting your filters to find what you're looking for."
                      : "No successful payments available yet."}
                  </p>
                  {(searchInput || filters.paymentMethod !== 'all' || filters.dateRange !== 'all') && (
                    <Button variant="outline" onClick={clearFilters} size="sm">
                      Clear All Filters
                    </Button>
                  )}
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-green-50">
                          <TableHead className="font-semibold text-gray-900 text-xs sm:text-sm min-w-[140px]">User Details</TableHead>
                          <TableHead className="font-semibold text-gray-900 text-xs sm:text-sm min-w-[120px] hidden sm:table-cell">Course</TableHead>
                          <TableHead className="font-semibold text-gray-900 text-xs sm:text-sm min-w-[100px] hidden md:table-cell">Transaction ID</TableHead>
                          <TableHead className="font-semibold text-gray-900 text-xs sm:text-sm min-w-[80px]">Amount</TableHead>
                          <TableHead className="font-semibold text-gray-900 text-xs sm:text-sm min-w-[70px] hidden lg:table-cell">Method</TableHead>
                          <TableHead className="font-semibold text-gray-900 text-xs sm:text-sm min-w-[80px] hidden sm:table-cell">Date</TableHead>
                          <TableHead className="font-semibold text-gray-900 text-center text-xs sm:text-sm min-w-[80px]">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {isLoading ? (
                          <TableRow>
                            <TableCell colSpan={7} className="text-center py-8 sm:py-12">
                              <div className="flex items-center justify-center">
                                <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-green-600"></div>
                                <span className="ml-2 text-sm text-gray-500">Loading payments...</span>
                              </div>
                            </TableCell>
                          </TableRow>
                        ) : (
                          paginatedPayments.map((payment, index) => (
                            <TableRow key={payment._id} className={index % 2 === 0 ? "bg-white" : "bg-green-50/30"}>
                              <TableCell className="py-3 sm:py-4">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <span
                                          className="font-medium cursor-pointer hover:text-green-600 transition-colors text-xs sm:text-sm truncate max-w-[100px] sm:max-w-none"
                                          onClick={() => handleCopy(payment.user?.name || "")}
                                        >
                                          {payment.user?.name?.split(" ").slice(0, 2).join(" ")}
                                        </span>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        Click to copy: {payment.user?.name}
                                      </TooltipContent>
                                    </Tooltip>
                                    <Copy 
                                      className="w-3 h-3 cursor-pointer text-gray-400 hover:text-gray-600 hidden sm:block" 
                                      onClick={() => handleCopy(payment.user?.name || "")} 
                                    />
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <span
                                          className="text-xs text-gray-500 cursor-pointer hover:text-green-600 transition-colors truncate max-w-[100px] sm:max-w-none"
                                          onClick={() => handleCopy(payment.user?.email || "")}
                                        >
                                          {payment.user?.email}
                                        </span>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        Click to copy: {payment.user?.email}
                                      </TooltipContent>
                                    </Tooltip>
                                    <Copy 
                                      className="w-3 h-3 cursor-pointer text-gray-400 hover:text-gray-600 hidden sm:block" 
                                      onClick={() => handleCopy(payment.user?.email || "")} 
                                    />
                                  </div>
                                  <div className="flex items-center gap-2 sm:hidden">
                                    <span className="text-xs text-gray-500 truncate">
                                      {payment.course?.title}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <span
                                          className="text-xs text-gray-500 cursor-pointer hover:text-green-600 transition-colors"
                                          onClick={() => handleCopy(payment.user?.mobileNumber || "")}
                                        >
                                          {payment.user?.mobileNumber}
                                        </span>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        Click to copy: {payment.user?.mobileNumber}
                                      </TooltipContent>
                                    </Tooltip>
                                    <Copy 
                                      className="w-3 h-3 cursor-pointer text-gray-400 hover:text-gray-600 hidden sm:block" 
                                      onClick={() => handleCopy(payment.user?.mobileNumber || "")} 
                                    />
                                  </div>
                                </div>
                              </TableCell>

                              <TableCell className="py-3 sm:py-4 hidden sm:table-cell">
                                <div className="flex items-center gap-2">
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <span
                                        className="font-medium cursor-pointer hover:text-green-600 transition-colors max-w-[120px] lg:max-w-[150px] truncate text-xs sm:text-sm"
                                        onClick={() => handleCopy(payment.course?.title || "")}
                                      >
                                        {payment.course?.title}
                                      </span>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      Click to copy: {payment.course?.title}
                                    </TooltipContent>
                                  </Tooltip>
                                  <Copy 
                                    className="w-3 h-3 cursor-pointer text-gray-400 hover:text-gray-600" 
                                    onClick={() => handleCopy(payment.course?.title || "")} 
                                  />
                                </div>
                              </TableCell>

                              <TableCell className="py-3 sm:py-4 hidden md:table-cell">
                                <div className="flex items-center gap-2">
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <code
                                        className="text-xs bg-green-100 px-2 py-1 rounded cursor-pointer hover:bg-green-200 transition-colors"
                                        onClick={() => handleCopy(payment.transactionId)}
                                      >
                                        {payment.transactionId.slice(0, 8)}...
                                      </code>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      Click to copy: {payment.transactionId}
                                    </TooltipContent>
                                  </Tooltip>
                                  <Copy 
                                    className="w-3 h-3 cursor-pointer text-gray-400 hover:text-gray-600" 
                                    onClick={() => handleCopy(payment.transactionId)} 
                                  />
                                </div>
                              </TableCell>

                              <TableCell className="py-3 sm:py-4">
                                <div className="font-bold text-green-700 text-sm sm:text-lg">
                                  {formatAmount(payment.amount)}
                                </div>
                              </TableCell>

                              <TableCell className="py-3 sm:py-4 hidden lg:table-cell">
                                <div className="flex items-center gap-2">
                                  <CreditCard className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
                                  <span className="text-xs sm:text-sm font-medium">
                                    {payment.cardType || payment.paymentMethod || "SSL"}
                                  </span>
                                </div>
                              </TableCell>

                              <TableCell className="py-3 sm:py-4 hidden sm:table-cell">
                                <div className="space-y-1">
                                  <div className="text-xs sm:text-sm font-medium flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    {format(new Date(payment.createdAt), "MMM dd, yyyy")}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {format(new Date(payment.createdAt), "hh:mm a")}
                                  </div>
                                </div>
                              </TableCell>

                              <TableCell className="py-3 sm:py-4">
                                <div className="flex items-center justify-center gap-1">
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleViewPaymentDetails(payment._id)}
                                        className="h-7 w-7 sm:h-8 sm:w-8 p-0 hover:bg-green-50 hover:border-green-200"
                                      >
                                        <FileText className="w-3 h-3 sm:w-4 sm:h-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      View Payment Details
                                    </TooltipContent>
                                  </Tooltip>
                                  
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleViewUserHistory(payment.user?._id)}
                                        className="h-7 w-7 sm:h-8 sm:w-8 p-0 hover:bg-blue-50 hover:border-blue-200"
                                      >
                                        <User className="w-3 h-3 sm:w-4 sm:h-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      View User History
                                    </TooltipContent>
                                  </Tooltip>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="mt-4 sm:mt-6 px-4 pb-4 sm:px-6 sm:pb-6 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
                      <div className="text-xs sm:text-sm text-gray-700 order-2 sm:order-1">
                        Page {currentPage} of {totalPages}
                      </div>
                      <div className="flex items-center gap-1 sm:gap-2 order-1 sm:order-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                          disabled={currentPage === 1}
                          className="flex items-center gap-1 h-8 px-2 sm:px-3"
                        >
                          <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span className="hidden sm:inline text-xs">Previous</span>
                        </Button>
                        
                        {/* Page numbers */}
                        <div className="hidden md:flex gap-1">
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
                                className="w-8 h-8 p-0 text-xs"
                              >
                                {pageNum}
                              </Button>
                            );
                          })}
                        </div>

                        {/* Mobile page indicator */}
                        <div className="md:hidden px-3 py-1 bg-gray-100 rounded text-xs">
                          {currentPage}/{totalPages}
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                          disabled={currentPage === totalPages}
                          className="flex items-center gap-1 h-8 px-2 sm:px-3"
                        >
                          <span className="hidden sm:inline text-xs">Next</span>
                          <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default SuccessPaymentPage;
