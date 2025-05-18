"use client";

import React, { useState, ChangeEvent } from "react";
import Link from "next/link";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/UI/table";
import { Button } from "@/components/UI/button";
import { Input } from "@/components/UI/input";
import { Textarea } from "@/components/UI/textarea";
import { Pencil, Trash2, Save, X } from "lucide-react";
import { toast } from "sonner";
import {
  useGetAllReviewsQuery,
  useDeleteReviewMutation,
  useUpdateReviewMutation,
} from "@/redux/api/ReviewApi";
import Swal from "sweetalert2";

type Review = {
  _id: string;
  name: string;
  roles: string[];
  testimonial: string;
  photoUrl: string;
  createdAt?: string;
  updatedAt?: string;
};

// LocalReview is used for inline editing.
// For editing, "roles" is edited as a comma-separated string.
type LocalReview = {
  _id?: string;
  name: string;
  roles: string;
  testimonial: string;
  photoUrl: string;
};

export default function StudentFeedBack() {
  const { data: reviewsData, isLoading, isError } = useGetAllReviewsQuery({});
  const [deleteReview] = useDeleteReviewMutation();
  const [updateReview] = useUpdateReviewMutation();

  // editingId holds the _id of the review being edited; null means no row is in edit mode.
  const [editingId, setEditingId] = useState<string | null>(null);
  const [localEdits, setLocalEdits] = useState<LocalReview>({
    name: "",
    roles: "",
    testimonial: "",
    photoUrl: "",
  });

  // When editing an existing review, populate localEdits with its data, converting roles array to a comma-separated string.
  const onEdit = (review: Review) => {
    setEditingId(review._id);
    setLocalEdits({
      _id: review._id,
      name: review.name,
      roles: review.roles.join(", "),
      testimonial: review.testimonial,
      photoUrl: review.photoUrl,
    });
  };

  // Cancel the editing mode
  const onCancel = () => {
    setEditingId(null);
    setLocalEdits({
      name: "",
      roles: "",
      testimonial: "",
      photoUrl: "",
    });
  };

  // Handle input changes for both Input and Textarea
  const handleEditChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setLocalEdits((prev) => ({ ...prev, [name]: value }));
  };

  // Save updates: Convert comma-separated roles into an array and invoke updateReview mutation
  const onSave = async () => {
    try {
      // Prepare payload by converting roles to an array and removing whitespace/empty strings.
      const payload = {
        ...localEdits,
        roles: localEdits.roles
          .split(",")
          .map((role) => role.trim())
          .filter((role) => role.length > 0),
      };

      if (editingId) {
        await updateReview({ id: editingId, reviewData: payload }).unwrap();
        toast.success("Review updated successfully!");
      }
      // Reset the edit mode
      setEditingId(null);
      setLocalEdits({ name: "", roles: "", testimonial: "", photoUrl: "" });
    } catch (error: any) {
      toast.error("Error updating review");
      console.error("Update error:", error);
    }
  };
  const onDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this review? This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });
  
    if (result.isConfirmed) {
      try {
        await deleteReview(id).unwrap();
        toast.success("Review deleted successfully!");
      } catch (error: any) {
        toast.error("Error deleting review");
        console.error("Delete error:", error);
      }
    }
  };
  
  if (isLoading)
    return <div className="text-center py-10 text-lg">Loading...</div>;
  if (isError)
    return (
      <div className="text-center py-10 text-red-500">
        Error fetching reviews
      </div>
    );

  // Extract reviews array; adjust if reviewsData has a nested property.
  const reviews: Review[] = reviewsData?.data || [];

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Student Feedback</h2>
        <Link href="/dashboard/add-feedback-and-reviews" className="text-blue-500 underline">
          Go to Add Feedback page
        </Link>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-md">
        <Table className="w-full">
          <TableHeader>
            <TableRow className="bg-gray-100">
              <TableHead className="p-4">Photo</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Roles</TableHead>
              <TableHead>Testimonial</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reviews.map((review) =>
              editingId === review._id ? (
                // Editable row for an existing review
                <TableRow key={review._id} className="border-t">
                  <TableCell className="p-4">
                    <Input
                      value={localEdits.photoUrl || ""}
                      name="photoUrl"
                      onChange={handleEditChange}
                      placeholder="Photo URL"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={localEdits.name || ""}
                      name="name"
                      onChange={handleEditChange}
                      placeholder="Name"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={localEdits.roles || ""}
                      name="roles"
                      onChange={handleEditChange}
                      placeholder="Roles (comma separated)"
                    />
                  </TableCell>
                  <TableCell>
                    <Textarea
                      value={localEdits.testimonial || ""}
                      name="testimonial"
                      onChange={handleEditChange}
                      placeholder="Testimonial"
                    />
                  </TableCell>
                  <TableCell className="text-center flex gap-2 justify-center">
                    <Button variant="ghost" onClick={onSave}>
                      <Save size={18} />
                    </Button>
                    <Button variant="ghost" onClick={onCancel}>
                      <X size={18} />
                    </Button>
                  </TableCell>
                </TableRow>
              ) : (
                // Read-only row
                <TableRow key={review._id} className="border-t">
                  <TableCell className="p-4">
                    <img
                      src={review.photoUrl}
                      alt={review.name}
                      className="w-10 h-10 rounded-md object-cover"
                    />
                  </TableCell>
                  <TableCell>{review.name}</TableCell>
                  <TableCell>{review.roles.join(", ")}</TableCell>
                  <TableCell>

               
                        {review.testimonial.length > 30
                          ? review.testimonial.slice(0, 30) + "..."
                          : review.testimonial}
                  </TableCell>
                  <TableCell className="text-center flex gap-2 justify-center">
                    <Button variant="ghost" onClick={() => onEdit(review)}>
                      <Pencil size={18} />
                    </Button>
                    <Button variant="ghost" onClick={() => onDelete(review._id)}>
                      <Trash2 size={18} />
                    </Button>
                  </TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
