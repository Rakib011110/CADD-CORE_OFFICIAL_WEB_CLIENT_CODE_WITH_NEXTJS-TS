"use client"
import { useState } from 'react';
import { EyeIcon, FileTextIcon, XIcon, CheckIcon } from 'lucide-react';

import { useGetAllInstructorHireQuery, useUpdateInstructorHireMutation } from '@/redux/api/jobsApi/instructorHire';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/UI/table';
import { Badge } from '@/components/UI/badge';
import { Button } from '@/components/UI/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/UI/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/UI/dialog';

export default function InstructorApplication() {
  const { data, isLoading, isError } = useGetAllInstructorHireQuery({});
  const [updateReview] = useUpdateInstructorHireMutation();
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);

  const handleReviewChange = async (id: string, status: 'ongoing' | 'completed') => {
    try {
      await updateReview({
        id,
        data: { review: status }
      }).unwrap();
    } catch (error) {
      console.error('Failed to update review status:', error);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading applications</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6 text-gray-100 bg-red-500 p-2 max-w-sm rounded-md uppercase">All Instructor Applications</h2>
      <div className="overflow-auto border rounded-lg shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-100">
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Level</TableHead>
              <TableHead>Resume</TableHead>
              <TableHead>Review</TableHead>
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
                  <Badge className="bg-blue-100 text-blue-700">
                    {applicant.experience}
                  </Badge>
                </TableCell>
                <TableCell>
                  <a
                    href={applicant.cvUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center"
                  >
                    <Button variant="outline" size="sm">
                      <FileTextIcon className="w-4 h-4 mr-1" />
                      Resume
                    </Button>
                  </a>
                </TableCell>
                <TableCell>
                  <Select
                    value={applicant.review || 'ongoing'}
                    onValueChange={(value) => handleReviewChange(applicant._id, value as 'ongoing' | 'completed')}
                  >
                    <SelectTrigger className="w-[120px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ongoing">
                        <div className="flex items-center">
                          <span className="w-2 h-2 rounded-full bg-yellow-500 mr-2"></span>
                          Ongoing
                        </div>
                      </SelectItem>
                      <SelectItem value="completed">
                        <div className="flex items-center">
                          <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                          Completed
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setSelectedCandidate(applicant)}
                    className="mr-2"
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
        <Dialog  open={!!selectedCandidate} onOpenChange={() => setSelectedCandidate(null)}>
          <DialogContent className="sm:max-w-2xl border-2 border-red-500">
            <DialogHeader>
              <DialogTitle className='uppercase bg-red-500 text-white rounded-md w-80 p-2'> Instructor Application Details</DialogTitle>
              <DialogDescription>
                Instructor application from {selectedCandidate.name}
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <h4 className="font-medium ">Personal Information</h4>
                <p><span className="text-gray-500">Name:</span> {selectedCandidate.name}</p>
                <p><span className="text-gray-500">Email:</span> {selectedCandidate.email}</p>
                <p><span className="text-gray-500">Phone:</span> {selectedCandidate.phone}</p>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">Professional Details</h4>
                <p><span className="text-gray-500">Expertise:</span> {selectedCandidate.expertise}</p>
                <p><span className="text-gray-500">Experience:</span> {selectedCandidate.experience}</p>
              </div>
              
              <div className="col-span-2 space-y-2">
                <h4 className="font-medium">Application Message</h4>
                <p className="text-gray-700">{selectedCandidate.message}</p>
              </div>
              
              <div className="col-span-2">
                <a
                  href={selectedCandidate.cvUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center"
                >
                  <Button variant="outline">
                    <FileTextIcon className="w-4 h-4 mr-1" />
                    View Full Resume
                  </Button>
                </a>
              </div>
            </div>
            
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setSelectedCandidate(null)}>
                Close
              </Button>
              <Button 
                variant="default"
                onClick={() => {
                  handleReviewChange(selectedCandidate._id, 'completed');
                  setSelectedCandidate(null);
                }}
              >
                <CheckIcon className="w-4 h-4 mr-1" />
                Mark as Completed
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}