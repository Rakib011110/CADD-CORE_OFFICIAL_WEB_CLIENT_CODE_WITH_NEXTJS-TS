"use client";

import { useGetAllSeminarQuery, useDeleteseminarMutation, useUpdateseminarMutation } from "@/redux/api/seminarApi";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/UI/table";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/UI/button";
import { UpdateSeminars } from "../updateSeminars/updateSeminars";

export default function SeminarList() {
  const { data: seminars, error, isLoading } = useGetAllSeminarQuery({});
  const [deleteSeminar] = useDeleteseminarMutation();
  const [updateSeminar] = useUpdateseminarMutation();
  const [selectedSeminar, setSelectedSeminar] = useState(null);
  const [formData, setFormData] = useState({ topic: "", place: "", date: "", time: "" });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading seminars</div>;

  const handleDelete = async (id: string) => {
    await deleteSeminar(id);
  };

  const handleEdit = (seminar: any) => {
    setSelectedSeminar(seminar._id);
    setFormData({
      topic: seminar.topic,
      place: seminar.place,
      date: seminar.date,
      time: seminar.time,
    });
  };

  const handleUpdate = async () => {
    await updateSeminar({ id: selectedSeminar, seminarData: formData });
    setSelectedSeminar(null);
  };

  return (
    <div className="p-6 max-5xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Seminar List</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Topic</TableHead>
            <TableHead>Place</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {seminars?.data?.map((seminar: any) => (
            <TableRow key={seminar._id}>
              <TableCell>{seminar.topic}</TableCell>
              <TableCell>{seminar.place}</TableCell>
              <TableCell>{seminar.date}</TableCell>
              <TableCell>{seminar.time}</TableCell>
              <TableCell>
                <div className="flex gap-3">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(seminar)}>
                    <Pencil className="w-5 h-5 text-blue-500" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(seminar._id)}>
                    <Trash2 className="w-5 h-5 text-red-500" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selectedSeminar && (
      <UpdateSeminars  formData={formData} setFormData={setFormData}  setSelectedSeminar={setSelectedSeminar} handleUpdate={handleUpdate} />
      )}
    </div>
  );
}
