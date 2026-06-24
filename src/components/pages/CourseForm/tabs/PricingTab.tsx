"use client";

import { useFieldArray, useFormContext } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/UI/card";
import { Button } from "@/components/UI/button";
import { useGetInstallmentPlansQuery } from "@/redux/api/payment/useInstallmentPlansApi";
import { NumberField, SwitchField, TextField } from "../fields";

export function PricingTab() {
  const { control } = useFormContext();
  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "paymentPlans",
  });

  const { data: globalPlansResponse } = useGetInstallmentPlansQuery({});
  const globalPlans = globalPlansResponse?.data || [];

  const loadGlobalPlans = () => {
    if (!globalPlans.length) {
      toast.error("কোনো গ্লোবাল প্ল্যান পাওয়া যায়নি।");
      return;
    }
    replace(
      globalPlans.map((p: any) => ({
        name: p.name,
        installments: Number(p.installments) || 1,
        discountPercent: Number(p.discountPercent) || 0,
        isActive: p.isActive ?? true,
      }))
    );
    toast.success("গ্লোবাল প্ল্যান লোড হয়েছে।");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Payment / Installment Plans</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-xs text-gray-600">
          এই কোর্সের জন্য আলাদা ছাড়/কিস্তি সেট করুন।{" "}
          <span className="font-medium">
            খালি রাখলে গ্লোবাল ডিফল্ট প্ল্যান প্রযোজ্য হবে।
          </span>
        </p>

        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" size="sm" onClick={loadGlobalPlans}>
            গ্লোবাল প্ল্যান লোড করুন
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              append({ name: "", installments: 1, discountPercent: 0, isActive: true })
            }
          >
            <Plus className="h-4 w-4" /> Add Custom Plan
          </Button>
        </div>

        {fields.length === 0 && (
          <p className="text-xs text-gray-400">
            কোনো কাস্টম প্ল্যান নেই — গ্লোবাল ডিফল্ট প্ল্যান ব্যবহৃত হবে।
          </p>
        )}

        <div className="space-y-3">
          {fields.map((f, i) => (
            <div
              key={f.id}
              className="relative grid grid-cols-1 items-end gap-3 rounded-lg border bg-gray-50/60 p-4 pr-12 md:grid-cols-4"
            >
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2 text-red-600 hover:bg-red-50"
                onClick={() => remove(i)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <TextField name={`paymentPlans.${i}.name`} label="Name" placeholder="full, 2x, 3x" />
              <NumberField name={`paymentPlans.${i}.installments`} label="Installments" />
              <NumberField name={`paymentPlans.${i}.discountPercent`} label="Discount %" />
              <SwitchField name={`paymentPlans.${i}.isActive`} label="Active" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
