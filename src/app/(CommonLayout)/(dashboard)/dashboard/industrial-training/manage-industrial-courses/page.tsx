'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
import { Pencil, Plus, Trash2 } from 'lucide-react';
import {
  useDeleteIndrustrialCourseMutation,
  useGetAllIndrustrialCourseQuery,
} from '@/redux/api/indrustrialcourseApi';

export default function ManageIndustrialCourses() {
  const router = useRouter();
  const { data: courses, isLoading } = useGetAllIndrustrialCourseQuery({});
  const [deleteCourse] = useDeleteIndrustrialCourseMutation();

  const handleEdit = (course: any) => {
    if (course?.slug) {
      router.push(
        `/dashboard/industrial-training/edit-industrial-course/${course.slug}`
      );
    } else if (course?._id) {
      router.push(
        `/dashboard/industrial-training/edit-industrial-course/${course._id}`
      );
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
    return (
      <div className="text-center py-10 text-lg font-semibold">Loading...</div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Manage Industrial Courses
          </h1>
          <p className="text-sm text-gray-500">
            View, edit, or delete existing industrial attachment courses.
          </p>
        </div>
        <Link href="/dashboard/industrial-training/create-industrial-courses">
          <Button className="bg-gray-900 hover:bg-red-600 flex items-center gap-2">
            <Plus size={16} /> Add Industrial Course
          </Button>
        </Link>
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
                    alt={course.title || 'Course'}
                    width={50}
                    height={50}
                    className="rounded-md object-cover"
                  />
                </TableCell>

                {/* Title */}
                <TableCell className="font-medium">{course.title}</TableCell>

                {/* Fee */}
                <TableCell>{course.courseFee ? `${course.courseFee} ৳` : 'N/A'}</TableCell>

                {/* Category */}
                <TableCell>{course.categories}</TableCell>

                {/* Actions */}
                <TableCell className="text-center flex gap-2 justify-center">
                  <Button
                    onClick={() => handleEdit(course)}
                    variant="ghost"
                    className="text-blue-500 hover:bg-blue-100"
                    title="Edit course"
                  >
                    <Pencil size={18} />
                  </Button>

                  <Button
                    onClick={() => handleDelete(course._id || course.slug)}
                    variant="ghost"
                    className="text-red-500 hover:bg-red-100"
                    title="Delete course"
                  >
                    <Trash2 size={18} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

