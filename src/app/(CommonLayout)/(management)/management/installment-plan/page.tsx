"use client";


import { useForm } from "react-hook-form";
import { Button } from "@/components/UI/button";
import { Input } from "@/components/UI/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/UI/card";
import { Switch } from "@/components/UI/switch";
import { useState } from "react";
import { Trash2, Pencil } from "lucide-react";
import { toast } from "sonner";
import { useCreateInstallmentPlanMutation, useDeleteInstallmentPlanMutation, useGetInstallmentPlansQuery, useUpdateInstallmentPlanMutation } from "@/redux/api/payment/useInstallmentPlansApi";

type InstallmentPlanForm = {
  name: string;
  installments: number;
  discountPercent: number;
  isActive: boolean;
};

export default function InstallmentPlanPage() {
  const { data, isLoading, refetch } = useGetInstallmentPlansQuery(undefined);
  const [createInstallment, { isLoading: creating }] = useCreateInstallmentPlanMutation();
  const [deleteInstallment] = useDeleteInstallmentPlanMutation();
  const [updateInstallment, { isLoading: updating }] = useUpdateInstallmentPlanMutation();

  const { register, handleSubmit, reset, setValue, watch } = useForm<InstallmentPlanForm>({
    defaultValues: {
      isActive: true,
    },
  });
  const isActive = watch("isActive");
  const [editingName, setEditingName] = useState<string | null>(null);

  const onSubmit = async (formData: InstallmentPlanForm) => {
    try {
      if (editingName) {
        const { name, ...restFormData } = formData;
        await updateInstallment({ name: editingName, ...restFormData }).unwrap();
        toast.success("Installment plan updated successfully");
      } else {
        await createInstallment({ ...formData }).unwrap();
        toast.success("Installment plan created successfully");
      }
      reset({ isActive: true });
      setEditingName(null);
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Action failed");
    }
  };

  const handleDelete = async (name: string) => {
    try {
      await deleteInstallment(name).unwrap();
      toast.success("Installment plan deleted");
      refetch();
    } catch {
      toast.error("Failed to delete");
    }
  };

  const handleEdit = (plan: InstallmentPlanForm) => {
    setEditingName(plan.name);
    setValue("name", plan.name);
    setValue("installments", plan.installments);
    setValue("discountPercent", plan.discountPercent);
    setValue("isActive", plan.isActive);
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-red-600">
            {editingName ? "Update Installment Plan" : "Create New Installment Plan"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid md:grid-cols-4 gap-4"
          >
            <Input
              placeholder="Name (e.g., full, 2x, 3x)"
              {...register("name", { required: true })}
              disabled={!!editingName}
            />
            <Input
              type="number"
              placeholder="Installments"
              {...register("installments", { required: true, valueAsNumber: true })}
            />
            <Input
              type="number"
              placeholder="Discount %"
              {...register("discountPercent", { required: true, valueAsNumber: true })}
            />
            <div className="flex items-center gap-2">
              <Switch
                checked={isActive}
                onCheckedChange={(checked) => setValue("isActive", checked)}
                className="data-[state=checked]:bg-red-600"
              />
              <span>{isActive ? "Active" : "Inactive"}</span>
            </div>
            <Button
              type="submit"
              className="md:col-span-4 bg-red-600 hover:bg-red-700"
              disabled={creating || updating}
            >
              {creating || updating
                ? editingName
                  ? "Updating..."
                  : "Creating..."
                : editingName
                ? "Update Plan"
                : "Create Plan"}
            </Button>
            {editingName && (
              <Button
                type="button"
                className="md:col-span-4"
                variant="outline"
                onClick={() => {
                  reset({ isActive: true });
                  setEditingName(null);
                }}
              >
                Cancel Editing
              </Button>
            )}
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-red-600">All Installment Plans</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Loading installment plans...</p>
          ) : (
            <div className="grid gap-4">
              {data?.data?.length > 0 ? (
                data.data.map((plan: any) => (
                  <div
                    key={plan._id}
                    className="flex justify-between items-center border rounded p-3"
                  >
                    <div>
                      <p className="font-bold text-lg">{plan.name}</p>
                      <p className="text-gray-600 text-sm">
                        Installments: {plan.installments} | Discount: {plan.discountPercent}%
                      </p>
                      <p
                        className={`text-xs ${
                          plan.isActive ? "text-green-600" : "text-gray-400"
                        }`}
                      >
                        {plan.isActive ? "Active" : "Inactive"}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          handleEdit({
                            name: plan.name,
                            installments: plan.installments,
                            discountPercent: plan.discountPercent,
                            isActive: plan.isActive,
                          })
                        }
                      >
                        <Pencil className="w-4 h-4 text-red-600" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDelete(plan.name)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No installment plans found.</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
