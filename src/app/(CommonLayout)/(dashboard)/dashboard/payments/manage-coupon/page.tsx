"use client";


import { useForm } from "react-hook-form";
import { useState } from "react";
import { Button } from "@/components/UI/button";
import { Input } from "@/components/UI/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/UI/card";
import { Trash2 } from "lucide-react";
import { useCreateCouponMutation, useDeleteCouponMutation, useGetAllCouponsQuery } from "@/redux/api/payment/couponApi";
import { toast } from "sonner";

interface ICoupon {
  _id: string;
  code: string;
  discountType: "fixed" | "percentage";
  discountValue: number;
  maxDiscount?: number;
  minAmount?: number;
  isActive: boolean;
  expireAt: string;
}

type CouponForm = {
  code: string;
  discountType: "fixed" | "percentage";
  discountValue: number;
  maxDiscount?: number;
  minAmount?: number;
  expireAt: string;
  isActive: boolean;
};

export default function ManageCouponPage() {
  const { data, isLoading } = useGetAllCouponsQuery(undefined);
  const [createCoupon, { isLoading: creating }] = useCreateCouponMutation();
  const [deleteCoupon] = useDeleteCouponMutation();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { register, handleSubmit, reset } = useForm<CouponForm>({
    defaultValues: {
      discountType: "percentage",
      isActive: true,
    },
  });

  const onSubmit = async (data: CouponForm) => {
    try {
      await createCoupon({
        ...data,
        discountValue: Number(data.discountValue),
        maxDiscount: data.maxDiscount ? Number(data.maxDiscount) : undefined,
        minAmount: data.minAmount ? Number(data.minAmount) : undefined,
      }).unwrap();
      toast.success("Coupon created successfully");
      reset();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create coupon");
    }
  };




  
  const handleDelete = async (code: string) => {
    try {
      setDeletingId(code);
      await deleteCoupon(code).unwrap();
      toast.success("Coupon deleted");
    } catch (error: any) {
      toast.error("Failed to delete coupon");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-red-600">Create New Coupon</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            <Input placeholder="Coupon Code" {...register("code", { required: true })} />
            <select
              {...register("discountType", { required: true })}
              className="border rounded px-3 py-2"
            >
              <option value="percentage">Percentage</option>
              <option value="fixed">Fixed</option>
            </select>
            <Input
              type="number"
              step="0.01"
              placeholder="Discount Value"
              {...register("discountValue", { required: true })}
            />
            <Input
              type="number"
              step="0.01"
              placeholder="Max Discount (optional)"
              {...register("maxDiscount")}
            />
            <Input
              type="number"
              step="0.01"
              placeholder="Min Purchase Amount (optional)"
              {...register("minAmount")}
            />
            <Input type="date" {...register("expireAt", { required: true })} />
            <div className="flex items-center gap-2 md:col-span-2">
              <input type="checkbox" {...register("isActive")} />
              <span className="text-gray-700">Active</span>
            </div>
            <Button
              type="submit"
              className="md:col-span-3 bg-red-600 hover:bg-red-700"
              disabled={creating}
            >
              {creating ? "Creating..." : "Create Coupon"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-red-600">All Coupons</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Loading coupons...</p>
          ) : (
            <div className="grid gap-4">
              {data?.data?.length > 0 ? (
                data.data.map((coupon: ICoupon) => {
                  const expired = new Date(coupon.expireAt) < new Date();
                  return (
                    <div
                      key={coupon._id}
                      className={`flex justify-between items-center border rounded p-3 ${
                        expired ? "bg-gray-100 opacity-60" : ""
                      }`}
                    >
                      <div>
                        <p className="font-bold text-lg text-gray-800">{coupon.code}</p>
                        <p className="text-gray-600 text-sm capitalize">
                          {coupon.discountType} -{" "}
                          {coupon.discountType === "percentage"
                            ? `${coupon.discountValue}%`
                            : `৳${coupon.discountValue}`}
                        </p>
                        {coupon.maxDiscount && (
                          <p className="text-xs text-gray-500">
                            Max Discount: ৳{coupon.maxDiscount}
                          </p>
                        )}
                        {coupon.minAmount && (
                          <p className="text-xs text-gray-500">
                            Min Purchase: ৳{coupon.minAmount}
                          </p>
                        )}
                        <p
                          className={`text-xs ${
                            expired ? "text-red-500" : "text-gray-500"
                          }`}
                        >
                          Expiry: {new Date(coupon.expireAt).toLocaleDateString()}
                        </p>
                        <p
                          className={`text-xs ${
                            coupon.isActive ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {coupon.isActive ? "Active" : "Inactive"}
                        </p>
                      </div>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDelete(coupon.code)}
                        disabled={deletingId === coupon.code}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  );
                })
              ) : (
                <p className="text-gray-500">No coupons available.</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
