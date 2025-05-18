"use client";
import ManageEvents from "@/components/pages/ManageEvents/ManageEvents";
import { Button } from "@/components/UI/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/UI/card";
import { Input } from "@/components/UI/input";
import { Textarea } from "@/components/UI/textarea";
import { useGetAllEventsQuery, useCreateEventMutation } from "@/redux/api/eventApi";
import Image from "next/image";
import { useState } from "react";
import { toast, Toaster } from "sonner";

export default function ManageEventsEngagements() {
  const { data: events, isError, isLoading } = useGetAllEventsQuery({});
  console.log("Events:", events);

  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [eventsImages, setEventsImages] = useState<string[]>([]);

  
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
      setEventsImages(validImages);

      if (validImages.length > 0) {
        setEventData((prev) => ({ ...prev, photoUrl: validImages[0] }));
      }
    }
  };

  const [createEvent] = useCreateEventMutation();
  const [eventData, setEventData] = useState({
    title: "",
    description: "",
    photoUrl: "",
  });

  // Handle text input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEventData((prev) => ({ ...prev, [name]: value }));
  };

  // Submit form data to create event
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventData.photoUrl) {
      toast.error("Please upload an image before submitting.");
      return;
    }
    try {
      await createEvent(eventData).unwrap();
      toast.success("Event Created Successfully!");
      setEventData({ title: "", description: "", photoUrl: "" });
      setImagePreviews([]);
      setEventsImages([]);
    } catch (error) {
      toast.error("Failed to create event!");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Manage Events & Engagements</h1>

      {/* Event Form */}
      <Card className="mb-8 max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-xl text-center">Create New Event</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              name="title"
              placeholder="Event Title"
              value={eventData.title}
              onChange={handleChange}
              required
            />
            <Textarea
              name="description"
              placeholder="Event Description"
              value={eventData.description}
              onChange={handleChange}
              required
            />
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
              Add Event
            </Button>
          </form>
        </CardContent> 
        <Toaster />
      </Card>

      <div className="mt-16">
        <ManageEvents/>
      </div>
    </div>
  );
}
