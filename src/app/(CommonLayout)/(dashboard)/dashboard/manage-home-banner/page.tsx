"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import Image from "next/image";
import { Button } from "@/components/UI/button";
import { Input } from "@/components/UI/input";
import { Label } from "@/components/UI/label";
import { toast } from "sonner";
import { uploadToCloudinary } from "@/lib/uploadToCloudinary";
import {
  useGetAllBannersQuery,
  useCreateBannerMutation,
  useDeleteBannerMutation,
  IBannerItem,
} from "@/redux/api/bannerApi";
import { Trash2, Plus, ExternalLink, Image as ImageIcon, CheckCircle, Info } from "lucide-react";

const FALLBACK_BANNER_IMAGE =
  "https://res.cloudinary.com/dbkwiwoll/image/upload/v1746349680/Artboard_1_1_-Picsart-AiImageEnhancer_dccum8.png";

export default function ManageHomeBannerPage() {
  const { data: bannersData, isLoading, isError, refetch } = useGetAllBannersQuery({});
  const banners: IBannerItem[] = bannersData?.data || [];

  const [createBanner, { isLoading: isCreating }] = useCreateBannerMutation();
  const [deleteBanner, { isLoading: isDeleting }] = useDeleteBannerMutation();

  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!selectedFile) {
      toast.error("Please select a banner image file.");
      return;
    }

    try {
      setIsUploading(true);
      const photoUrl = await uploadToCloudinary(selectedFile);
      if (!photoUrl) {
        setIsUploading(false);
        return;
      }

      await createBanner({
        title: title.trim(),
        photoUrl,
        link: link.trim(),
        isActive: true,
      }).unwrap();

      toast.success("Home Banner created successfully!");
      setTitle("");
      setLink("");
      setSelectedFile(null);
      setImagePreview("");
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || "Failed to create banner");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this banner?")) return;
    try {
      await deleteBanner(id).unwrap();
      toast.success("Banner deleted successfully!");
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to delete banner");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-8">
      {/* Header */}
      <div className="border-b pb-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Home Page Banner Management
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage dynamic banners displayed on your website homepage hero section.
        </p>
      </div>

      {/* Fallback Notice */}
      <div className="bg-sky-50 border border-sky-200 rounded-xl p-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
        <div className="text-sm text-sky-900 space-y-1">
          <p className="font-semibold">Automatic Fallback System Active:</p>
          <p className="text-sky-700">
            If there are <strong>no banners</strong> in the database, the home page will
            automatically display the default hardcoded CADD CORE banner image so your website never
            looks empty. Once you add banners here, they will immediately take effect dynamically.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upload Form */}
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-5">
          <div className="flex items-center gap-2 border-b pb-3">
            <Plus className="w-5 h-5 text-sky-600" />
            <h2 className="text-lg font-bold text-gray-800">Add New Banner</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title" className="text-xs font-semibold text-gray-700">
                Banner Title (Optional)
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. AutoCAD & Revit Special Batch"
                className="mt-1.5"
              />
            </div>

            <div>
              <Label htmlFor="link" className="text-xs font-semibold text-gray-700">
                Destination Link (Optional)
              </Label>
              <Input
                id="link"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="e.g. /courses or https://..."
                className="mt-1.5"
              />
              <span className="text-[11px] text-gray-400">
                Clicking the banner will redirect visitors to this link.
              </span>
            </div>

            <div>
              <Label className="text-xs font-semibold text-gray-700">
                Banner Image <span className="text-red-500">*</span>
              </Label>
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="mt-1.5 file:cursor-pointer cursor-pointer"
                required
              />
              <span className="text-[11px] text-gray-400">
                Recommended dimension: 1920x600 or high resolution landscape image.
              </span>

              {imagePreview && (
                <div className="mt-3 relative rounded-lg overflow-hidden border border-gray-200">
                  <Image
                    src={imagePreview}
                    width={400}
                    height={200}
                    alt="Preview"
                    className="w-full h-auto object-cover"
                  />
                  <span className="absolute top-2 right-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded backdrop-blur">
                    Image Preview
                  </span>
                </div>
              )}
            </div>

            <Button
              type="submit"
              disabled={isUploading || isCreating}
              className="w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2 rounded-lg transition-all"
            >
              {isUploading || isCreating ? "Uploading & Saving..." : "Publish Banner"}
            </Button>
          </form>
        </div>

        {/* Existing Banners List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <div className="flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-gray-700" />
              <h2 className="text-lg font-bold text-gray-800">
                Active Banners in Database ({banners.length})
              </h2>
            </div>
          </div>

          {isLoading ? (
            <div className="p-8 text-center text-gray-500 bg-white rounded-2xl border">
              Loading banners from database...
            </div>
          ) : isError ? (
            <div className="p-8 text-center text-red-500 bg-white rounded-2xl border">
              Error fetching banners from database.
            </div>
          ) : banners.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border space-y-4">
              <div className="p-4 bg-gray-50 rounded-xl inline-block">
                <ImageIcon className="w-8 h-8 text-gray-400 mx-auto" />
              </div>
              <h3 className="text-base font-semibold text-gray-700">No Custom Banners in Database</h3>
              <p className="text-xs text-gray-500 max-w-md mx-auto">
                Currently, the home page is displaying the default hardcoded banner below. Upload a new banner using the form to display dynamic content.
              </p>
              {/* Default Preview */}
              <div className="pt-2">
                <p className="text-xs font-semibold text-gray-600 mb-2">Current Active Fallback:</p>
                <div className="relative rounded-xl overflow-hidden border border-gray-200 shadow-sm max-w-lg mx-auto">
                  <Image
                    src={FALLBACK_BANNER_IMAGE}
                    width={800}
                    height={350}
                    alt="Default Banner"
                    className="w-full h-auto object-cover"
                  />
                  <span className="absolute top-2 left-2 bg-sky-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
                    Default Hardcoded Image
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {banners.map((banner) => (
                <div
                  key={banner._id}
                  className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm flex flex-col justify-between"
                >
                  <div className="relative w-full h-44 bg-gray-100">
                    <Image
                      src={banner.photoUrl}
                      alt={banner.title || "Banner Image"}
                      fill
                      className="object-cover"
                    />
                    <span className="absolute top-2 left-2 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> Live
                    </span>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm line-clamp-1">
                        {banner.title || "Untitled Banner"}
                      </h4>
                      {banner.link ? (
                        <a
                          href={banner.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-sky-600 hover:underline mt-1 truncate max-w-full"
                        >
                          <ExternalLink className="w-3 h-3" /> {banner.link}
                        </a>
                      ) : (
                        <p className="text-xs text-gray-400 mt-1">No destination link</p>
                      )}
                    </div>

                    <div className="pt-2 border-t flex justify-end">
                      <Button
                        variant="destructive"
                        size="sm"
                        disabled={isDeleting}
                        onClick={() => handleDelete(banner._id)}
                        className="flex items-center gap-1 text-xs"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
