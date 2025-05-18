"use client";

import { useState } from "react";
import { Button } from "@/components/UI/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/UI/table";
import { EyeIcon, FileTextIcon } from "lucide-react";
import { useGetAllJobApplicationsQuery } from "@/redux/api/jobsApi/jobApplicationApi";
import CandidateDetailsModal from "@/components/pages/Jobs/CandidateDetailsModal/CandidateDetailsModal";
import { Badge } from "@/components/UI/badge";

const AdminCandidateTable = () => {
  const { data, isLoading } = useGetAllJobApplicationsQuery(undefined);
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);

  if (isLoading) return <p>Loading applications...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6 rounded-md text-gray-100 bg-red-500 p-2 w-72 ">All Job Applications</h2>
      <div className="overflow-auto border rounded-lg shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-100">
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Academic</TableHead>
              <TableHead>Level</TableHead>
              <TableHead>Resume</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.data?.map((applicant: any) => (
              <TableRow key={applicant._id} className="hover:bg-gray-50">
                <TableCell className="font-medium">{applicant.name}</TableCell>
                <TableCell className="text-sm text-gray-600">{applicant.email}</TableCell>
                <TableCell className="text-sm text-gray-600">{applicant.phone}</TableCell>
                <TableCell>
                  <Badge variant="outline">{applicant.academicQualifications}</Badge>
                </TableCell>
                <TableCell>
                  <Badge className="bg-blue-100 text-blue-700">{applicant.exprience}</Badge>
                </TableCell>
                <TableCell>
                  <a
                    href={applicant.resumeLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline" size="sm">
                      <FileTextIcon className="w-4 h-4 mr-1" />
                      Resume
                    </Button>
                  </a>
                </TableCell>
                <TableCell>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setSelectedCandidate(applicant)}
                  >
                    <EyeIcon className="w-4 h-4 mr-1" />
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Candidate Details Modal */}
      {selectedCandidate && (
        <CandidateDetailsModal
          candidate={selectedCandidate}
          onClose={() => setSelectedCandidate(null)}
        />
      )}
    </div>
  );
};

export default AdminCandidateTable;
