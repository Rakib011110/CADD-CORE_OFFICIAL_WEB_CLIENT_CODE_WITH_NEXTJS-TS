'use client';

import { useState } from "react";
import { useUpdateTeamMutation } from "@/redux/api/teamApi";
import { Button } from "@/components/UI/button";
import { toast } from "sonner";

interface UpdateTeamFormProps {
  team: any;
  onClose: () => void;
}

export default function UpdateTeamForm({ team, onClose }: UpdateTeamFormProps) {
  const [updateTeam, { isLoading }] = useUpdateTeamMutation();

  const [formData, setFormData] = useState({
    name: team.name,
    title: team.title,
    category: team.category,
    photoUrl: team.photoUrl,
  });

  const [imagePreview, setImagePreview] = useState<string>(team.photoUrl);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const uploadToCloudinary = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "CADDCOREWEB");

    try {
      const response = await fetch("https://api.cloudinary.com/v1_1/dbkwiwoll/image/upload", {
        method: "POST",
        body: formData,
      });

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
    const file = e.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);

    const uploadedUrl = await uploadToCloudinary(file);
    if (uploadedUrl) {
      setFormData((prev) => ({ ...prev, photoUrl: uploadedUrl }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateTeam({ id: team._id, TeamData: formData }).unwrap();
      toast.success("Team member updated!");
      onClose();
    } catch (error) {
      console.error("Error updating team:", error);
      toast.error("Update failed.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h3 className="text-lg font-semibold mb-4">Update Team Member</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="border p-2 w-full mb-2"
            placeholder="Name"
          />
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="border p-2 w-full mb-2"
            placeholder="Title"
          />

          {/* File Upload */}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="border p-2 w-full mb-2"
          />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Team Member"
              className="w-24 h-24 object-cover rounded mb-2 mx-auto"
            />
          )}

          <div className="flex justify-end mt-4 space-x-2">
            <Button onClick={onClose} variant="outline" type="button">
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
