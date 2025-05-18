"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import { Button } from "@/components/UI/button";
import { Label } from "@/components/UI/label";
import { Input } from "@/components/UI/input";
import { Textarea } from "@/components/UI/textarea";
import { toast } from "sonner";
import Image from "next/image";
import { useCreateIndustrialOfferBannerMutation } from "@/redux/api/industrialOfferBannerApi";
import Link from "next/link";

type OfferBannerFormData = {
  title: string;
  description: string;
  buyNowText: string;
  learnMoreText: string;
  date: string;   // Example: "2025-05-02"
  time: string;   // Example: "21:00"
  remainingDays: number;
  photoUrl: string;
};

export default function AddIndustrialOfferBanner() {
  const [createBanner, { isLoading, isError }] = useCreateIndustrialOfferBannerMutation();

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [formData, setFormData] = useState<OfferBannerFormData>({
    title: "",
    description: "",
    buyNowText: "",
    learnMoreText: "",
    date: "",
    time: "",
    remainingDays: 0,
    photoUrl: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: name === "remainingDays" ? Number(value) : value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await createBanner(formData).unwrap();
      toast.success("Offer Banner created successfully!");

      setFormData({
        title: "",
        description: "",
        buyNowText: "",
        learnMoreText: "",
        date: "",
        time: "",
        remainingDays: 0,
        photoUrl: "",
      });
      setImagePreview(null);
    } catch (error) {
      toast.error("Error submitting offer banner.");
      console.error("CreateBanner error:", error);
    }
  };

  const uploadToCloudinary = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "CADDCOREWEB"); 

    try {
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dbkwiwoll/image/upload",
        { method: "POST", body: formData }
      );
      const data = await response.json();

      if (response.ok) {
        return data.secure_url;
      } else {
        toast.error(`Image upload failed: ${data.error?.message}`);
        return null;
      }
    } catch (error: any) {
      console.error("Cloudinary Upload Error:", error);
      toast.error("Image upload failed.");
      return null;
    }
  };

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const file = files[0];

      // Preview
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };

      // Upload to Cloudinary
      const uploadedUrl = await uploadToCloudinary(file);
      if (uploadedUrl) {
        setFormData((prev) => ({ ...prev, photoUrl: uploadedUrl }));
      }
    }
  };

  return ( 

<div> 

<div>
  

<Button className="">

<Link href={"/dashboard/industrial-training/manage-offer-banner"}>
  
  Go For Manage For 
  </Link>

</Button>

</div>

<div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h2 className="text-3xl font-bold mb-6">Add Industrial Offer Banner 
        
        
        </h2> 
      <form onSubmit={handleSubmit} className="w-full max-w-lg space-y-4 bg-white p-6 rounded shadow-md">
        <div className="space-y-1">
          <Label htmlFor="title">Title</Label>
          <Input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter title"
            required
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter description"
            required
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="buyNowText">Buy Now Text</Label>
          <Input
            type="text"
            id="buyNowText"
            name="buyNowText"
            value={formData.buyNowText}
            onChange={handleChange}
            placeholder="e.g. এখনই কিনুন"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="learnMoreText">Learn More Text</Label>
          <Input
            type="text"
            id="learnMoreText"
            name="learnMoreText"
            value={formData.learnMoreText}
            onChange={handleChange}
            placeholder="e.g. বিস্তারিত জানুন"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="date">Date</Label>
          <Input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="time">Time</Label>
          <Input
            type="time"
            id="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="remainingDays">Remaining Days</Label>
          <Input
            type="number"
            id="remainingDays"
            name="remainingDays"
            value={formData.remainingDays}
            onChange={handleChange}
            placeholder="Enter remaining days"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="photoUrl">Upload Photo</Label>
          <Input
            type="file"
            id="photoUrl"
            name="photoUrl"
            onChange={handleImageChange}
            required
          />
          {imagePreview && (
            <div className="mt-4">
              <Image
                src={imagePreview}
                alt="Image Preview"
                width={300}
                height={200}
                className="rounded-lg"
              />
            </div>
          )}
        </div>
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? "Submitting..." : "Submit Offer"}
        </Button>
        {isError && <p className="text-red-500 text-center">Error submitting offer</p>}
      </form>
    </div>

</div>

    
  );
}
