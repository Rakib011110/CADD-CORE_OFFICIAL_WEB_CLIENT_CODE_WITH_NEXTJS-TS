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

  CreditCard,
  FileText,
  User,
  Copy,
  ArrowLeft,
  Bell,
  Clock,
  UserPlus,
  BookOpen,
  Activity
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
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <Button
                variant="outline"
                onClick={() => router.back()}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-green-900 mb-2 flex items-center gap-3">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                  Successful Payments
                </h1>
                <p className="text-gray-600">View and manage all completed payment transactions</p>
              </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                title="Total Revenue"
                value={formatAmount(stats.totalAmount)}
                icon={DollarSign}
                color="text-green-900"
                description="All time successful payments"
              />
              <StatCard
                title="Total Payments"
                value={stats.totalPayments.toLocaleString()}
                icon={CheckCircle}
                color="text-blue-900"
                description="Completed transactions"
              />
              <StatCard
                title="Today's Revenue"
                value={formatAmount(stats.todayAmount)}
                icon={TrendingUp}
                color="text-purple-900"
                description={`${stats.todayPayments} payments today`}
              />
              
              {/* Recent Payment Notifications StatCard */}
              <Card className="hover:shadow-lg transition-shadow bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <Bell className="w-6 h-6 text-green-600" />
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-green-800">Recent Admissions</p>
                        <p className="text-xs text-green-600">Live updates</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300 text-xs animate-pulse">
                      Live
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {filteredPayments.slice(0, 3).map((payment, index) => (
                      <div
                        key={payment._id}
                        className={`flex items-start gap-2 p-2 rounded-md bg-white/70 border border-green-100 hover:bg-white transition-all duration-300 ${
                          index === 0 ? 'animate-pulse' : ''
                        }`}
                      >
                        <div className="flex-shrink-0 mt-1">
                          <div className="relative">
                            <UserPlus className="w-4 h-4 text-green-600" />
                            {index === 0 && (
                              <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
                            )}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-gray-900 truncate">
                            {payment.user?.name?.split(" ").slice(0, 2).join(" ")}
                          </p>
                          <p className="text-xs text-gray-600 truncate">
                            {payment.course?.title}
                          </p>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-xs font-bold text-green-700">
                              {formatAmount(payment.amount)}
                            </span>
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatDistanceToNow(new Date(payment.createdAt), { addSuffix: true })}
                            </span>
                          </div>
                        </div>
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      </div>
                    ))}
                    
                    {filteredPayments.length === 0 && (
                      <div className="text-center py-3 text-gray-500">
                        <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="text-xs">No recent activity</p>
                      </div>
                    )}
                  </div>
                  
                  {filteredPayments.length > 3 && (
                    <div className="mt-3 pt-2 border-t border-green-200">
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-green-700 font-medium">
                          +{filteredPayments.length - 3} more students
                        </p>
                        <div className="flex items-center gap-1">
                          <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse"></div>
                          <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                          <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
              
            </div>


            
          </div>

          {/* Filters Section */}
          <Card className="mb-6">
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

          {/* Payments Table */}
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
                  <Button variant="outline" className="flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Export
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
                          paginatedPayments.map((payment, index) => (
                            <TableRow 
                              key={payment._id} 
                              className={
                                payment.checking 
                                  ? "bg-blue-50 border-l-4 border-l-blue-500 hover:bg-blue-100 transition-colors" // Reviewed payments - blue theme
                                  : index % 2 === 0 
                                    ? "bg-white hover:bg-gray-50 transition-colors" // Normal unreviewed - white
                                    : "bg-green-50/30 hover:bg-green-100/50 transition-colors" // Normal unreviewed - light green
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
                                          onClick={() => handleCopy(payment.user?.name || "")}
                                        >
                                          {payment.user?.name?.split(" ").slice(0, 2).join(" ")}
                                        </span>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        Click to copy: {payment.user?.name}
                                        {payment.checking && " (Reviewed)"}
                                      </TooltipContent>
                                    </Tooltip>
                                    <Copy 
                                      className={`w-3 h-3 cursor-pointer transition-colors ${
                                        payment.checking 
                                          ? "text-blue-400 hover:text-blue-600" 
                                          : "text-gray-400 hover:text-gray-600"
                                      }`}
                                      onClick={() => handleCopy(payment.user?.name || "")} 
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
                                      className={`w-3 h-3 cursor-pointer transition-colors ${
                                        payment.checking 
                                          ? "text-blue-400 hover:text-blue-600" 
                                          : "text-gray-400 hover:text-gray-600"
                                      }`}
                                      onClick={() => handleCopy(payment.user?.email || "")} 
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
                                      className={`w-3 h-3 cursor-pointer transition-colors ${
                                        payment.checking 
                                          ? "text-blue-400 hover:text-blue-600" 
                                          : "text-gray-400 hover:text-gray-600"
                                      }`}
                                      onClick={() => handleCopy(payment.user?.mobileNumber || "")} 
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
                                    className={`w-3 h-3 cursor-pointer transition-colors ${
                                      payment.checking 
                                        ? "text-blue-400 hover:text-blue-600" 
                                        : "text-gray-400 hover:text-gray-600"
                                    }`}
                                    onClick={() => handleCopy(payment.course?.title || "")} 
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
                                        onClick={() => handleCopy(payment.transactionId)}
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
                                    onClick={() => handleCopy(payment.transactionId)} 
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
                                    {format(new Date(payment.createdAt), "MMM dd, yyyy")}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {format(new Date(payment.createdAt), "hh:mm a")}
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
                          ))
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
        </div>
      </div>
    </TooltipProvider>
  );
};

export default SuccessPaymentPage;
