"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/UI/card";
import { useMemo } from "react";
import {
  Download,
  FileText,
  Calendar,
  CalendarDays,
  CalendarRange,
  TrendingUp,
  Check,
  Pause,
  XCircle,
  AlertCircle,
  DollarSign,
} from "lucide-react";

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
  status: "pending" | "completed" | "failed" | "cancelled" | "refund";
  cardType?: string;
  paymentMethod?: string;
  bankTransactionId?: string;
  checking: boolean;
  createdAt: string;
  updatedAt: string;
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<any>;
  color: string;
  bgColor: string;
  percentage?: number;
  trend?: 'up' | 'down' | 'neutral';
}

// --------- Compact Stats Card Component ----------
const CompactStatCard = ({ title, value, icon: Icon, color, bgColor, percentage, trend }: StatCardProps) => (
  <Card className="group hover:shadow-md transition-all duration-300 hover:-translate-y-1 border-0 shadow-sm">
    <CardContent className="p-4">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-xs font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-xl font-bold text-gray-900 group-hover:text-gray-700 transition-colors duration-200">
            {value}
          </p>
          {percentage !== undefined && (
            <div className="flex items-center mt-1">
              <span className={`text-xs font-medium ${trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-500'}`}>
                {trend === 'up' ? '↗' : trend === 'down' ? '↘' : '→'} {percentage}%
              </span>
            </div>
          )}
        </div>
        <div className={`${bgColor} p-2 rounded-lg group-hover:scale-110 transition-transform duration-300`}>
          <Icon className={`w-4 h-4 ${color}`} />
        </div>
      </div>
    </CardContent>
  </Card>
);

// --------- CSV Export Functions ----------
const filterPaymentsByDate = (payments: Payment[], days: number | null) => {
  if (days === null) return payments; // All payments

  const now = new Date();
  const cutoffDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

  return payments.filter(payment => {
    const paymentDate = new Date(payment.createdAt);
    return paymentDate >= cutoffDate;
  });
};

const convertToCSV = (payments: Payment[]): string => {
  const headers = [
    'Transaction ID',
    'User Name',
    'Email',
    'Mobile Number',
    'Course Title',
    'Amount (৳)',
    'Status',
    'Payment Method',
    'Bank Transaction',
    'Card Type',
    'Bank/Card Details',
    'Created Date',
    'Updated Date',
    'Time Zone'
  ];

  const rows = payments.map(payment => [
    payment.transactionId,
    payment.user.name,
    payment.user.email,
    payment.user.mobileNumber,
    payment.course.title,
    payment.amount.toString(),
    payment.status,
    'SSLCommerz',
    payment.bankTransactionId || payment.transactionId,
    payment.cardType || 'N/A',
    payment.cardType ? `${payment.cardType} Card` : 'N/A',
    new Date(payment.createdAt).toLocaleString('en-GB', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }),
    new Date(payment.updatedAt).toLocaleString('en-GB', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }),
    'GMT+6 (Bangladesh Standard Time)'
  ]);

  const csvContent = [headers, ...rows]
    .map(row => row.map(field => `"${field}"`).join(','))
    .join('\n');

  return csvContent;
};

const downloadCSV = (csvContent: string, filename: string) => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const CompactExportButton = ({ title, icon: Icon, onClick, color }: {
  title: string;
  icon: React.ComponentType<any>;
  onClick: () => void;
  color: string;
}) => (
  <button
    onClick={onClick}
    className={`flex items-center justify-center gap-1 px-3 py-2 ${color} text-white rounded-md font-medium hover:opacity-90 transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md text-xs min-h-[36px] w-full`}
  >
    <Icon className="w-3 h-3" />
    <span className="text-center">{title}</span>
  </button>
);

// --------- Compact Payment Analytics Component ----------
export const CompactPaymentAnalytics = ({ payments }: { payments: Payment[] }) => {
  const stats = useMemo(() => {
    const totalPayments = payments.length;
    const completedPayments = payments.filter((p) => p.status === "completed").length;
    const pendingPayments = payments.filter((p) => p.status === "pending").length;
    const failedPayments = payments.filter((p) => p.status === "failed").length;
    const cancelledPayments = payments.filter((p) => p.status === "cancelled").length;

    // Calculate completed revenue (only from completed payments)
    const completedRevenue = payments
      .filter((p) => p.status === "completed")
      .reduce((sum, p) => sum + (p.amount || 0), 0);

    // Calculate pending amount (potential revenue)
    const pendingAmount = payments
      .filter((p) => p.status === "pending")
      .reduce((sum, p) => sum + (p.amount || 0), 0);

    // Calculate success rate
    const successRate = totalPayments > 0 ? ((completedPayments / totalPayments) * 100).toFixed(1) : 0;

    // Calculate average completed transaction
    const avgCompletedTransaction = completedPayments > 0 ? Math.round(completedRevenue / completedPayments) : 0;

    return {
      totalPayments,
      completedPayments,
      pendingPayments,
      failedPayments,
      cancelledPayments,
      completedRevenue,
      pendingAmount,
      successRate,
      avgCompletedTransaction
    };
  }, [payments]);

  // CSV Export Handlers
  const handleExportLastDay = () => {
    const completedPayments = payments.filter(p => p.status === "completed");
    const filteredPayments = filterPaymentsByDate(completedPayments, 1);
    const csvContent = convertToCSV(filteredPayments);
    const filename = `completed-payment-report-last-24h-${new Date().toISOString().split('T')[0]}.csv`;
    downloadCSV(csvContent, filename);
  };

  const handleExportLast7Days = () => {
    const completedPayments = payments.filter(p => p.status === "completed");
    const filteredPayments = filterPaymentsByDate(completedPayments, 7);
    const csvContent = convertToCSV(filteredPayments);
    const filename = `completed-payment-report-last-7-days-${new Date().toISOString().split('T')[0]}.csv`;
    downloadCSV(csvContent, filename);
  };

  const handleExportLastMonth = () => {
    const completedPayments = payments.filter(p => p.status === "completed");
    const filteredPayments = filterPaymentsByDate(completedPayments, 30);
    const csvContent = convertToCSV(filteredPayments);
    const filename = `completed-payment-report-last-30-days-${new Date().toISOString().split('T')[0]}.csv`;
    downloadCSV(csvContent, filename);
  };

  const handleExportAll = () => {
    const completedPayments = payments.filter(p => p.status === "completed");
    const csvContent = convertToCSV(completedPayments);
    const filename = `completed-payment-report-all-time-${new Date().toISOString().split('T')[0]}.csv`;
    downloadCSV(csvContent, filename);
  };

  return (
    <Card className="border-0 shadow-md bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-base font-bold text-gray-900">
          <div className="p-1.5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-md mr-2">
            <FileText className="w-4 h-4 text-white" />
          </div>
          Payment Analytics
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {/* Compact Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
          <CompactStatCard
            title="Revenue"
            value={`৳${stats.completedRevenue.toLocaleString()}`}
            icon={TrendingUp}
            color="text-green-600"
            bgColor="bg-green-50"
            percentage={12.4}
            trend="up"
          />

          <CompactStatCard
            title="Completed"
            value={stats.completedPayments.toLocaleString()}
            icon={Check}
            color="text-green-600"
            bgColor="bg-green-50"
            percentage={18.9}
            trend="up"
          />

          <CompactStatCard
            title="Pending"
            value={stats.pendingPayments.toLocaleString()}
            icon={Pause}
            color="text-yellow-600"
            bgColor="bg-yellow-50"
            percentage={-5.1}
            trend="down"
          />

          <CompactStatCard
            title="Failed"
            value={stats.failedPayments.toLocaleString()}
            icon={XCircle}
            color="text-red-600"
            bgColor="bg-red-50"
            percentage={-2.8}
            trend="down"
          />

          <CompactStatCard
            title="Cancelled"
            value={stats.cancelledPayments.toLocaleString()}
            icon={AlertCircle}
            color="text-orange-600"
            bgColor="bg-orange-50"
          />
        </div>

        {/* Compact Export Section */}
        <div className="bg-white/50 rounded-lg p-3 border border-blue-100">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Download className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-semibold text-gray-900">Export Reports</span>
            </div>
            <span className="text-xs text-gray-500">{stats.completedPayments} records</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <CompactExportButton
              title="24h"
              icon={Calendar}
              onClick={handleExportLastDay}
              color="bg-gradient-to-r from-black to-gray-800 hover:from-gray-800 hover:to-black shadow-gray-400"
            />
            <CompactExportButton
              title="7 Days"
              icon={CalendarDays}
              onClick={handleExportLast7Days}
              color="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 shadow-red-400"
            />
            <CompactExportButton
              title="30 Days"
              icon={CalendarRange}
              onClick={handleExportLastMonth}
              color="bg-gradient-to-r from-black to-gray-800 hover:from-gray-800 hover:to-black shadow-gray-400"
            />
            <CompactExportButton
              title="All Time"
              icon={Download}
              onClick={handleExportAll}
              color="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 shadow-red-400"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};