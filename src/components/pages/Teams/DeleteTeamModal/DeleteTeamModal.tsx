import { useDeleteTeamMutation } from "@/redux/api/teamApi";
import { Button } from "@/components/UI/button";

interface DeleteTeamModalProps {
  teamId: string;
  onClose: () => void;
}

export default function DeleteTeamModal({ teamId, onClose }: DeleteTeamModalProps) {
  const [deleteTeam, { isLoading }] = useDeleteTeamMutation();

  const handleDelete = async () => {
    try {
      await deleteTeam(teamId).unwrap();
      onClose(); // Close modal after deletion
    } catch (error) {
      console.error("Error deleting team:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
        <p>Are you sure you want to delete this team member?</p>
        <div className="flex justify-end mt-4 space-x-2">
          <Button onClick={onClose} variant="outline">Cancel</Button>
          <Button onClick={handleDelete} variant="destructive" disabled={isLoading}>
            {isLoading ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </div>
    </div>
  );
}
