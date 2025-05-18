"use client"
import { TSeminar } from "@/lib/types/TSeminars";
import { useCreateSeminarMutation } from "@/redux/api/seminarApi";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/UI/card";
import { Input } from "@/components/UI/input";
import { Button } from "@/components/UI/button";
import { Label } from "@/components/UI/label";
import { toast, Toaster } from "sonner";

export default function CreateSeminar() {
  // State for seminar form data
  const [seminarData, setSeminarData] = useState<TSeminar>({
    topic: "",
    place: "",
    type: "",
    date: "",
    time: "",
    remainingDays: 0,
  });

  // Destructure the mutation hook to create a seminar
  const [createSeminar, { isLoading, isError, error }] = useCreateSeminarMutation();

  // Handle form input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSeminarData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createSeminar(seminarData).unwrap();
      toast.success("Seminar created successfully");
    } catch (err) {
      console.error("Error creating seminar:", err);
      // Optionally handle error here
    }
  };

  return (
    <div className="flex justify-center items-center  bg-gray-100 p-4">
      <Card className="w-full max-w-xl shadow-lg rounded-lg p-6 bg-white">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Create Seminar</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="topic">Topic</Label>
              <Input id="topic" name="topic" value={seminarData.topic} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="place">Place</Label>
              <Input id="place" name="place" value={seminarData.place} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="date">Date</Label>
              <Input type="date" id="date" name="date" value={seminarData.date} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="time">Time</Label>
              <Input type="time" id="time" name="time" value={seminarData.time} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="remainingDays">Remaining Days</Label>
              <Input type="number" id="remainingDays" name="remainingDays" value={seminarData.remainingDays} onChange={handleChange} required />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating Seminar..." : "Create Seminar"}
            </Button>
          </form>
         
        </CardContent> 
        <Toaster />
      </Card>
    </div>
  );
}