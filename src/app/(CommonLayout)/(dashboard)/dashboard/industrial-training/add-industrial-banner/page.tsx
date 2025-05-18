"use client"


import React, { useState, ChangeEvent, FormEvent } from "react";

import { Button } from "@/components/UI/button";
import { Input } from "@/components/UI/input";
import { Label } from "@/components/UI/label";
import { toast } from "sonner";
import Image from "next/image";
import { useCreateIndustrialBannerMutation, useDeleteIndustrialBannerMutation, useGetAllindustrialBannerQuery } from "@/redux/api/industrialOfferBannerApi";

interface BannerForm {
    
  title: string;
  photoUrl: string;
}
interface IBanner {
    _id: string

  title: string;
  photoUrl: string;
}

const IndustrialBanner: React.FC = () => {
  // Fetch all banners
  const { data: bannersData, isLoading, isError, refetch } = useGetAllindustrialBannerQuery({});
  const banners = bannersData?.data || [];

  // Mutations
  const [createBanner, { isLoading: creating }] = useCreateIndustrialBannerMutation();
  const [deleteBanner, { isLoading: deleting }] = useDeleteIndustrialBannerMutation();

  // Local state for form
  const [formData, setFormData] = useState<BannerForm>({ title: "", photoUrl: "" });
  const [imagePreview, setImagePreview] = useState<string>("");

  // Upload helper
  const uploadToCloudinary = async (file: File): Promise<string | null> => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "CADDCOREWEB");
    try {
      const res = await fetch("https://api.cloudinary.com/v1_1/dbkwiwoll/image/upload", { method: "POST", body: data });
      const json = await res.json();
      if (res.ok) return json.secure_url;
      throw new Error(json.error?.message || "Upload failed");
    } catch (err: any) {
      toast.error(err.message || "Could not upload image");
      return null;
    }
  };

  // Handle image file selection
  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
    const uploaded = await uploadToCloudinary(file);
    if (uploaded) setFormData({ ...formData, photoUrl: uploaded });
  };

  // Form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await createBanner(formData).unwrap();
      toast.success("Banner added");
      setFormData({ title: "", photoUrl: "" });
      setImagePreview("");
      refetch();
    } catch (err: any) {
      toast.error(err.data?.message || "Failed to create banner");
    }
  };

  // Delete an existing banner
  const handleDelete = async (id: string) => {
    if (!confirm("Delete this banner?")) return;
    try {
      await deleteBanner(id).unwrap();
      toast.success("Banner deleted");
      refetch();
    } catch (err: any) {
      toast.error(err.data?.message || "Failed to delete banner");
    }
  };

  if (isLoading) return <p className="p-4 text-center">Loading banners...</p>;
  if (isError) return <p className="p-4 text-center text-red-500">Error loading banners</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Form to add new banner */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
        <h2 className="text-xl font-semibold">Add New Banner</h2>
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Enter banner title"
            required
          />
        </div>
        <div>
          <Label>Image</Label>
          <Input type="file" accept="image/*" onChange={handleImageChange} />
          {imagePreview && (
            <div className="mt-2">
              <Image src={imagePreview} width={200} height={100} alt="Preview" className="rounded" />
            </div>
          )}
        </div>
        <Button type="submit" disabled={creating} className="mt-4">
          {creating ? "Adding..." : "Add Banner"}
        </Button>
      </form>

      {/* List of existing banners */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {banners.map((banner: IBanner) => (
          <div key={banner._id} className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
            <Image src={banner.photoUrl} width={300} height={150} alt={banner.title} className="rounded" />
            <h3 className="mt-2 text-lg font-medium">{banner.title}</h3>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleDelete(banner._id)}
              disabled={deleting}
              className="mt-3"
            >
              Delete
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IndustrialBanner;
