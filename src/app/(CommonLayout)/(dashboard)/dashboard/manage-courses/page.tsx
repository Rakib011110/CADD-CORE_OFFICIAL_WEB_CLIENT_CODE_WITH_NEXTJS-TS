'use client';

import { useState } from 'react';
import Image from 'next/image';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import { Button } from '@/components/UI/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/UI/table';
import {
  useGetAllCourseQuery,
  useDeleteCourseMutation,
  useUpdateCourseMutation,
} from '@/redux/api/courseApi';
import UpdateCourse from '@/components/pages/Courses/UpdateCourses';
import { Pencil, Trash2 } from 'lucide-react';
import UpdateIndustrialCourses from '../industrial-training/update-industrial-courses/UpdaeIndrustrialCourses';

export default function ManageCourses() {
  const { data: courses, isLoading } = useGetAllCourseQuery({});
  const [updateCourse] = useUpdateCourseMutation();
  const [deleteCourse] = useDeleteCourseMutation();

  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>(null);
  const [originalData, setOriginalData] = useState<any>(null);

  const handleEdit = (course: any) => {
    setSelectedCourseId(course._id || null);
    setFormData(course);
    setOriginalData(course);
  };

  const handleUpdate = async (updatedFields: Partial<any>) => {
    try {
      if (selectedCourseId && formData) {
        await updateCourse({ id: selectedCourseId, courseData: updatedFields }).unwrap();
        await Swal.fire({
          icon: 'success',
          title: 'Course updated!',
          text: 'Your changes have been saved.',
          timer: 2000,
          showConfirmButton: false,
        });
      }
    } catch (error: any) {
      await Swal.fire({
        icon: 'error',
        title: 'Update failed',
        text: error?.data?.message || 'Could not update the course.',
      });
    } finally {
      setSelectedCourseId(null);
      setFormData(null);
      setOriginalData(null);
    }
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: 'Delete this course?',
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it',
    });

    if (result.isConfirmed) {
      try {
        await deleteCourse(id).unwrap();
        await Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'Course has been removed.',
          timer: 1500,
          showConfirmButton: false,
        });
      } catch (error: any) {
        await Swal.fire({
          icon: 'error',
          title: 'Deletion failed',
          text: error?.data?.message || 'Could not delete the course.',
        });
      }
    }
  };

  if (isLoading) {
    return <div className="text-center py-10 text-lg font-semibold">Loading...</div>;
  }

  return (
    <div className="p-6">
     <div className=''>

     <h1 className="text-2xl font-bold mb-4 ">Manage Courses</h1>
     </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-md">
        <Table className="w-full">
          <TableHeader>
            <TableRow className="bg-gray-100">
              <TableHead className="p-4">Image</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Fee</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {courses?.data?.map((course: any, idx: number) => (
              <TableRow key={course._id || idx} className="border-t">
                {/* Image */}
                <TableCell className="p-4">
                  <Image
                    src={
                      course.photoUrl ||
                      'https://www.freeiconspng.com/thumbs/no-image-icon/no-image-icon-6.png'
                    }
                    alt={course.title}
                    width={50}
                    height={50}
                    className="rounded-md object-cover"
                  />
                </TableCell>

                {/* Title */}
                <TableCell>{course.title}</TableCell>

                {/* Fee */}
                <TableCell>{course.courseFee}</TableCell>

                {/* Category */}
                <TableCell>{course.categories}</TableCell>

                {/* Actions */}
                <TableCell className="text-center flex gap-2 justify-center">
                  <Button
                    onClick={() => handleEdit(course)}
                    variant="ghost"
                    className="text-blue-500 hover:bg-blue-100"
                  >
                    <Pencil size={18} />
                  </Button>

                  <Button
                    onClick={() => handleDelete(course._id || course.slug)}
                    variant="ghost"
                    className="text-red-500 hover:bg-red-100"
                  >
                    <Trash2 size={18} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {selectedCourseId && formData && originalData && (
        <UpdateIndustrialCourses
          formData={formData}
          originalData={originalData}
          setFormData={setFormData}
          setSelectedCourse={setSelectedCourseId}
          handleUpdate={handleUpdate}
        />
      )}
    </div>
  );
}
