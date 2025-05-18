"use client";
import { Button } from "@/components/UI/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/UI/card";
import { Input } from "@/components/UI/input";
import { Textarea } from "@/components/UI/textarea";
import { teamCategories } from "@/lib/types/TTeam";
import { useCreateTeamMutation, useGetAllTeamQuery } from "@/redux/api/teamApi";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast, Toaster } from "sonner";

export default function CreateTeam() {
  const { data: teams, isError, isLoading } = useGetAllTeamQuery({});

  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [teamsImages, setTeamImages] = useState<string[]>([]);

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
      setTeamImages(validImages);

      if (validImages.length > 0) {
        setTeamData((prev) => ({ ...prev, photoUrl: validImages[0] }));
      }
    }
  };

  const [createTeam] = useCreateTeamMutation();
  const [teamData, setTeamData] = useState({
    name: "",
    title: "",
    category: "",
    photoUrl: "",
  });

  // Handle text input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTeamData((prev) => ({ ...prev, [name]: value }));
  };

  // Submit form data to create event
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamData.photoUrl) {
      toast.error("Please upload an image before submitting.");
      return;
    }
    try {
      await createTeam(teamData).unwrap();
      toast.success("Team Member Created Successfully!");
      setTeamData({ name: "", title: "", category: "", photoUrl: "" });
      setImagePreviews([]);
      setTeamImages([]);
    } catch (error) {
      toast.error("Failed to create team member!");
    }
  };

  return (
    <div>
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold text-center mb-4">Create Team Member</h1>
<div className="text-center">
    <Button className="bg-blue-500 text-white mb-4 ">
      <Link href="/dashboard/manage-team-members">Go For Manage Team Members</Link>  


      </Button> 
</div>
        {/* Event Form */}
        <Card className="mb-8 max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="text-xl text-center">Create New Team Member</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="text"
                name="name"
                placeholder="Name"
                value={teamData.name}
                onChange={handleChange}
                required
              />
              <Input
                type="text"
                name="title"
                placeholder="Title"
                value={teamData.title}
                onChange={handleChange}
                required
              />
              <select
                name="category"
                value={teamData.category}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded-md"
              >
                <option value="" disabled>Select Category</option>
                {teamCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

             

              {/* File input - note no value attribute */}
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
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                Add Team Member
              </Button>
            </form>
          </CardContent>
        </Card>
        <Toaster />
      </div>
    </div>
  );
}
