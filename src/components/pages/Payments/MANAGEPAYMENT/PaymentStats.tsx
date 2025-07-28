"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/UI/card";
import { useMemo } from "react";
import {
  Download,
  Eye,
  Check,
  Clock,
  CreditCard,
  DollarSign,
  AlertCircle,
  XCircle,
  TrendingUp,
  Pause,
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
  status: "pending" | "completed" | "failed" | "cancelled";
  cardType?: string;
  paymentMethod?: string;
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

// --------- Enhanced Stats Card Component ----------
const StatCard = ({ title, value, icon: Icon, color, bgColor, percentage, trend }: StatCardProps) => (
  <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 shadow-md">
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900 group-hover:text-gray-700 transition-colors duration-200">
            {value}
          </p>
          {percentage !== undefined && (
            <div className="flex items-center mt-2">
              <span className={`text-xs font-medium ${
                trend === 'up' ? 'text-green-600' : 
                trend === 'down' ? 'text-red-600' : 'text-gray-500'
              }`}>
                {trend === 'up' ? '↗' : trend === 'down' ? '↘' : '→'} {percentage}%
              </span>
              <span className="text-xs text-gray-500 ml-1">vs last month</span>
            </div>
          )}
        </div>
        <div className={`${bgColor} p-3 rounded-full group-hover:scale-110 transition-transform duration-300`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
      </div>
    </CardContent>
  </Card>
);

// --------- Enhanced Stats Section Component ----------
export const PaymentStats = ({ payments }: { payments: Payment[] }) => {
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

  return (
    <div className="mb-8">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Payment Overview</h2>
        <p className="text-sm text-gray-600">Real-time payment statistics and insights</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
       
        <StatCard
          title="Completed Revenue"
          value={`৳${stats.completedRevenue.toLocaleString()}`}
          icon={TrendingUp}
          color="text-green-600"
          bgColor="bg-green-50"
          percentage={12.4}
          trend="up"
        />
        
        <StatCard
          title="Completed"
          value={stats.completedPayments.toLocaleString()}
          icon={Check}
          color="text-green-600"
          bgColor="bg-green-50"
          percentage={18.9}
          trend="up"
        />
        
        <StatCard
          title="Pending"
          value={stats.pendingPayments.toLocaleString()}
          icon={Pause}
          color="text-yellow-600"
          bgColor="bg-yellow-50"
          percentage={-5.1}
          trend="down"
        />
        
        <StatCard
          title="Failed"
          value={stats.failedPayments.toLocaleString()}
          icon={XCircle}
          color="text-red-600"
          bgColor="bg-red-50"
          percentage={-2.8}
          trend="down"
        /> 


 <StatCard
          title="Cancelled"
          value={stats.cancelledPayments.toLocaleString()}
          icon={AlertCircle}
          color="text-orange-600" bgColor={""}      />

      </div>

      
    </div>
  );
};