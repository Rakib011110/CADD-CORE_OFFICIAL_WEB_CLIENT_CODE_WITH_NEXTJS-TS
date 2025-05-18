"use client";

import { useGetAllTeamQuery } from "@/redux/api/teamApi";
import { Button } from "@/components/UI/button"; 
import { Trash2, Edit } from "lucide-react"; 
import { teamCategories } from "@/lib/types/TTeam";
import { useState } from "react";
import LoadingSpinner from "@/components/UI/LoadingSpinner/LoadingSpinner";
import DeleteTeamModal from "@/components/pages/Teams/DeleteTeamModal/DeleteTeamModal";
import UpdateTeamForm from "@/components/pages/Teams/UpdateTeamForm/UpdateTeamForm";
import Link from "next/link";

export default function ManageTeamMembers() {
  const { data: Teams, error, isLoading } = useGetAllTeamQuery({});

const [deleteTeamId, setDeleteTeamId] = useState<string | null>(null);
const [editTeam, setEditTeam] = useState<any | null>(null);




if (isLoading) return <div className="">

<LoadingSpinner/>
</div>;


if (error) return <div className="text-center py-10 text-red-500">Error loading team members.</div>;


  if (isLoading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-500">Error loading team members.</div>;


  const categorizedTeams = teamCategories.map((category) => ({
    category,
    members: Teams?.data?.filter((member: any) => member.category === category) || [],
  }));

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Manage Team Members <br /> 
      
        </h2>
<div className="text-center">
<Button className="bg-blue-500 text-white" onClick={() => setEditTeam({})}>

<Link href="/dashboard/create-teams">Go For Create Team Member</Link>

</Button>
</div>
      {categorizedTeams.map(({ category, members }) =>
        members.length > 0 && (
          <div key={category} className="mb-8">
            <h3 className="text-lg font-semibold mb-4 border-b pb-2">{category}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {members.map((member: any) => (
                <div key={member._id} className="border p-3 rounded-lg shadow-sm bg-white">
                  <img
                    src={member.photoUrl}
                    alt={member.name}
                    className="w-16 h-16 rounded-full mx-auto object-cover"
                  />
                  <h3 className="text-md font-semibold mt-2 text-center">{member.name}</h3>
                  <p className="text-xs text-gray-600 text-center">{member.title}</p>

                  <div className="flex justify-center mt-2 space-x-2">
                  <Button
                      size="sm"
                      variant="outline"
                      className="text-blue-500 flex items-center"
                      onClick={() => setEditTeam(member)}
                    >
                      <Edit size={14} className="mr-1" /> Update
                    </Button>
                    <Button     onClick={() => setDeleteTeamId(member._id)} size="sm" variant="destructive" className="flex items-center">
                      <Trash2 size={14} className="mr-1" /> Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div> 
          </div>
        )
      )}
      <div>
      {deleteTeamId && <DeleteTeamModal teamId={deleteTeamId} onClose={() => setDeleteTeamId(null)} />}
      {editTeam && <UpdateTeamForm team={editTeam} onClose={() => setEditTeam(null)} />}

      </div>
    </div> 


  );
}
