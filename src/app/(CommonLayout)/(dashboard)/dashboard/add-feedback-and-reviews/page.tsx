"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import { useCreateReviewMutation } from "@/redux/api/ReviewApi";
import { Button } from "@/components/UI/button";
import { Label } from "@/components/UI/label";
import { Input } from "@/components/UI/input";
import { Textarea } from "@/components/UI/textarea";
import { toast } from "sonner";
import Image from "next/image";

type ReviewFormData = {
  name: string;
  photoUrl: string;
  testimonial: string;
  roles: string; // comma-separated string; will be converted to string[]
};

export default function AddReviews() {
  const [createReview, { isLoading, isError }] = useCreateReviewMutation(); 

const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [reviewImages, setReviewImages] = useState<string[]>([]);


  const [formData, setFormData] = useState<ReviewFormData>({
    name: "",
    photoUrl: "",
    testimonial: "",
    roles: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Convert comma separated roles to an array (filter out empty roles)
    const rolesArray = formData.roles
      .split(",")
      .map((role) => role.trim())
      .filter((role) => role.length > 0);

    try {
      await createReview({
        name: formData.name,
        photoUrl: formData.photoUrl,
        testimonial: formData.testimonial,
        roles: rolesArray,
      }).unwrap();

      toast.success("Review created successfully!");
      // Clear the form after success
      setFormData({
        name: "",
        photoUrl: "",
        testimonial: "",
        roles: "",
      });
    } catch (error) {
      toast.error("Error submitting review.");
      console.error("CreateReview error:", error);
    }
  };


  const uploadToCloudinary = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "CADDCOREWEB"); 

    try {
        const response = await fetch(
            "https://api.cloudinary.com/v1_1/dbkwiwoll/image/upload", 
            {
                method: "POST",
                body: formData,
            }
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

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      
      const previews = Array.from(files).map((file) => {
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
        });
      });
      Promise.all(previews)
        .then(setImagePreviews)
        .catch((error) => {
          console.error("Error generating image previews:", error);
          toast.error("Error generating image previews.");
        });

      const uploadedImages = await Promise.all(
        Array.from(files).map((file) => uploadToCloudinary(file))
      );
      const validImages = uploadedImages.filter((url) => url !== null) as string[];
      setReviewImages(validImages);

      if (validImages.length > 0) {
        setFormData((prev) => ({ ...prev, photoUrl: validImages[0] }));
      }
    }
  };







  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h2 className="text-3xl font-bold mb-6">Add Client Review</h2>
      <form onSubmit={handleSubmit} className="w-full max-w-lg space-y-4 bg-white p-6 rounded shadow-md">
        <div className="space-y-1">
          <Label htmlFor="name">Name</Label>
          <Input
            type="file"
            id="name"
            name="name"
            value={formData.name || ""}
            onChange={handleChange}
            placeholder="Enter your name"
            required
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="photoUrl">Photo URL</Label>
           <Input
                       type="file"
                       name="photoUrl"
                       onChange={handleImageChange}
                       required
                     />
                     {imagePreviews.length > 0 && (
                       <div className="mt-4 grid grid-cols-2 gap-4">
                         {imagePreviews.map((preview, index) => (
                           <Image
                             key={index}
                             alt={`Preview ${index + 1}`}
                             className="w-full h-32 object-cover rounded-lg"
                             src={preview}
                             width={150}
                             height={100}
                           />
                         ))}
                       </div>
                     )}
        </div>
        <div className="space-y-1">
          <Label htmlFor="testimonial">Testimonial</Label>
          <Textarea
            id="testimonial"
            name="testimonial"
            value={formData.testimonial || ""}
            onChange={handleChange}
            placeholder="Enter your testimonial"
            required
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="roles">Role(s)</Label>
          <Input
            type="text"
            id="roles"
            name="roles"
            value={formData.roles || ""}
            onChange={handleChange}
            placeholder="e.g. Trainee, Graphic Design Mastercourse"
            required
          />
          <p className="text-xs text-gray-500">Separate multiple roles with commas.</p>
        </div>
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? "Submitting..." : "Submit Review"}
        </Button>
        {isError && <p className="text-red-500 text-center">Error submitting review</p>}
      </form>
    </div>
  );
}
