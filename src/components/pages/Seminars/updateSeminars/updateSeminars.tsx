import { Button } from "@/components/UI/button";
import { UpdateSeminarsProps } from "@/lib/types/TSeminars";

export const UpdateSeminars = ({ formData, setFormData, setSelectedSeminar, handleUpdate }: UpdateSeminarsProps) => {
  return (
    <div>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
          <h3 className="text-lg font-bold mb-4">Update Seminar</h3>
          <input
            className="w-full border p-2 mb-2"
            type="text"
            value={formData.topic}
            onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
            placeholder="Topic"
          />
          <input
            className="w-full border p-2 mb-2"
            type="text"
            value={formData.place}
            onChange={(e) => setFormData({ ...formData, place: e.target.value })}
            placeholder="Place"
          />
          <input
            className="w-full border p-2 mb-2"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          />
          <input
            className="w-full border p-2 mb-2"
            type="time"
            value={formData.time}
            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
          />
          <div className="flex justify-end gap-2">
            <Button onClick={() => setSelectedSeminar(null)}>Cancel</Button>
            <Button onClick={handleUpdate} className="bg-blue-500 text-white">Update</Button>
          </div>
        </div>
      </div>
    </div>
  );
};
