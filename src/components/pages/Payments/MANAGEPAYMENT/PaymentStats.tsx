"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/UI/card";

import {
  Download,
  Eye,
  Check,
  Clock,
  CreditCard,
  DollarSign,
  AlertCircle,
  XCircle,
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
// --------- Stats Card Component ----------
const StatCard = ({ title, value, icon: Icon, color }: any) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <Icon className={`w-8 h-8 ${color}`} />
      </div>
    </CardContent>
  </Card>
);

// --------- Stats Section Component ----------
export const PaymentStats = ({ payments }: { payments: Payment[] }) => {
  const totalPayments = payments.length;
  const totalAmount = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
  const completedPayments = payments.filter((p) => p.status === "completed").length;
  const failedPayments = payments.filter((p) => p.status === "failed").length;
  const cancelledPayments = payments.filter((p) => p.status === "cancelled").length;
 

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
      <StatCard
        title="Total Payments"
        value={totalPayments}
        icon={CreditCard}
        color="text-blue-600"
      />
      <StatCard
        title="Total Amount"
        value={new Intl.NumberFormat("en-BD", {
          style: "currency",
          currency: "BDT",
          minimumFractionDigits: 0,
        }).format(totalAmount)}
        icon={DollarSign}
        color="text-green-600"
      />
      <StatCard
        title="Completed"
        value={completedPayments}
        icon={Check}
        color="text-green-600"
      />
      <StatCard
        title="Failed"
        value={failedPayments}
        icon={XCircle}
        color="text-red-600"
      />
      <StatCard
        title="Cancelled"
        value={cancelledPayments}
        icon={AlertCircle}
        color="text-orange-600"
      />
    </div>
  );
};
