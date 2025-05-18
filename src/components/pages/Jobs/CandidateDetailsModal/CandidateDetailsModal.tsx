"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/UI/dialog";
import { Badge } from "@/components/UI/badge";
import { Button } from "@/components/UI/button";

interface CandidateDetailsModalProps {
  candidate: any;
  onClose: () => void;
}

const CandidateDetailsModal = ({ candidate, onClose }: CandidateDetailsModalProps) => {
  const job = candidate?.jobId;

  return (
    <Dialog open={!!candidate} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-red-600">
            Candidate Application Details
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 text-sm text-gray-800">
          {/* Candidate Info */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-700 border-b pb-1">Personal Info</h3>
            <p><strong>Name:</strong> {candidate.name}</p>
            <p><strong>Email:</strong> {candidate.email}</p>
            <p><strong>Phone:</strong> {candidate.phone}</p>
            <p><strong>Address:</strong> {candidate.address || "N/A"}</p>
            <p><strong>Applied On:</strong> {new Date(candidate.createdAt).toLocaleDateString()}</p>
            <p>
              <strong>Resume:</strong>{" "}
              <a
                href={candidate.resumeLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline hover:text-blue-800"
              >
                View Resume
              </a>
            </p>
          </div>

          {/* Education & Skills */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-700 border-b pb-1">Academic & Skills</h3>
            <p><strong>Academic Qualifications:</strong> {candidate.academicQualifications}</p>
            <p><strong>Level:</strong> {candidate.exprience}</p>
            <p><strong>Soft Skills:</strong></p>
            <div className="flex flex-wrap gap-2">
              {candidate.softSkills?.map((skill: string, idx: number) => (
                <Badge key={idx} className="bg-green-100 text-green-800">{skill}</Badge>
              )) || "N/A"}
            </div>
            <p><strong>Hard Skills:</strong></p>
            <div className="flex flex-wrap gap-2">
              {candidate.hardSkills?.map((skill: string, idx: number) => (
                <Badge key={idx} className="bg-yellow-100 text-yellow-800 ">{skill}</Badge>
              )) || "N/A"}
            </div>
          </div>

          {/* Online Presence */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-700 border-b pb-1">Online Presence</h3>
            <p>
              <strong>Portfolio:</strong>{" "}
              {candidate.portfolio ? (
                <a
                  href={candidate.portfolio}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline hover:text-blue-800"
                >
                  View Portfolio
                </a>
              ) : "N/A"}
            </p>
            <p>
              <strong>LinkedIn:</strong>{" "}
              {candidate.linkedin ? (
                <a
                  href={candidate.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline hover:text-blue-800"
                >
                  View Profile
                </a>
              ) : "N/A"}
            </p>
          </div>

          {/* Hiring Justification */}
          <div className="space-y-3 md:col-span-2">
            <h3 className="text-lg font-semibold text-gray-700 border-b pb-1">Why Should We Hire You?</h3>
            <p className="whitespace-pre-line bg-gray-50 p-3 rounded-md">{candidate.whyHireYou || "N/A"}</p>
          </div>

          {/* Job Info */}
          <div className="space-y-3 md:col-span-2">
            <h3 className="text-lg font-semibold text-gray-700 border-b pb-1">Job Info</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <p><strong>Title:</strong> {job?.title || "N/A"}</p>
              {/* <p><strong>Company:</strong> {job?.companyName || "N/A"}</p> */}
              <p><strong>Location:</strong> {job?.location || "N/A"}</p>
              <p><strong>Job Type:</strong> {job?.type || "N/A"}</p>
            </div>
            <div className="mt-2">
              <p><strong>Description:</strong></p>
              <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md">{job?.about || "N/A"}</p>
            </div>
          </div>
        </div>

        {/* Close Button */}
        <div className="mt-6 text-right sticky bottom-0 bg-white pt-2 pb-2">
          <Button onClick={onClose} variant="outline">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CandidateDetailsModal;