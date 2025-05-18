"use client";
import { useGetAllEventsQuery, useDeleteEventMutation } from "@/redux/api/eventApi";
import { Delete, Edit } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

export default function ManageEvents() {
  const { data: events, isError, isLoading } = useGetAllEventsQuery({});
  const [deleteEvent] = useDeleteEventMutation();

  // Delete event handler
  const handleDelete = async (id: string) => {
    try {
      await deleteEvent(id).unwrap();
      toast.success("Event deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete event!");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Manage Events</h1>
      {isLoading ? (
        <p className="text-center">Loading events...</p>
      ) : isError ? (
        <p className="text-center text-red-500">Error fetching events.</p>
      ) : (
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Image</th>
              <th className="py-2 px-4 border-b">Title</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {events?.data && events.data.map((event: any) => (
              <tr key={event._id || event.id} className="text-center">
                <td className="py-2 px-4 border-b">
                  <Image
                    src={event.photoUrl}
                    alt={event.title}
                    width={80}
                    height={80}
                    className="rounded-full object-cover inline-block"
                  />
                </td>
                <td className="py-2 px-4 border-b">{event.title}</td>
                <td className="py-2 px-4 border-b space-x-2">
                  <button
                    onClick={() => console.log("Update event", event._id || event.id)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <Edit size={24} />
                  </button>
                  <button
                    onClick={() => handleDelete(event._id || event.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Delete size={24} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
