'use client';

import { useState } from 'react';
import Swal from 'sweetalert2';
import {
  useUpdatePartnerMutation,
  useDeletePartnerMutation,
  useGetPartnersQuery,
} from '@/redux/api/partnesApi';
import { Input } from '@/components/UI/input';
import { Button } from '@/components/UI/button';
import { toast } from 'sonner';

export interface IPartner {
  _id: string;
  createdAt: string;
  title: string;
  photoUrl: string;
  description?: string;
}

export default function PartnersTable() {
  const { data: partners = [], isLoading: loadingPartners } = useGetPartnersQuery({});

  const [updatePartner, { isLoading: updating }] = useUpdatePartnerMutation();
  const [deletePartner, { isLoading: deleting }] = useDeletePartnerMutation();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState({ title: '', photoUrl: '' });

  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [partnertsImages, setPartnertImages] = useState<string[]>([]);

  const handleEdit = (partner: IPartner) => {
    setEditingId(partner._id);
    setEditData({ title: partner.title, photoUrl: partner.photoUrl });
  };

  const handleCancel = () => {
    setEditingId(null);
    setImagePreviews([]);
    setPartnertImages([]);
  };

  const handleSave = async () => {
    if (!editData.title || !editData.photoUrl) {
      return Swal.fire({
        icon: 'warning',
        title: 'Both fields are required.',
      });
    }
    try {
      await updatePartner({ id: editingId!, ...editData }).unwrap();
      Swal.fire({ icon: 'success', title: 'Updated!', timer: 1200, showConfirmButton: false });
      setEditingId(null);
      setImagePreviews([]);
      setPartnertImages([]);
    } catch (err: any) {
      Swal.fire({ icon: 'error', title: 'Update failed', text: err?.data?.message });
    }
  };

  const handleDelete = (id: string) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "This will delete the partner!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deletePartner(id).unwrap();
          Swal.fire({ icon: 'success', title: 'Deleted!', timer: 1000, showConfirmButton: false });
        } catch (err: any) {
          Swal.fire({ icon: 'error', title: 'Delete failed', text: err?.data?.message });
        }
      }
    });
  };

  const uploadToCloudinary = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'CADDCOREWEB');

    try {
      const response = await fetch('https://api.cloudinary.com/v1_1/dbkwiwoll/image/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        return data.secure_url;
      } else {
        toast.error(`Image upload failed: ${data.error?.message}`);
        return null;
      }
    } catch (error) {
      console.error('Cloudinary Upload Error:', error);
      toast.error('Image upload failed.');
      return null;
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const previews = Array.from(files).map((file) => {
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
        });
      });

      Promise.all(previews)
        .then(setImagePreviews)
        .catch((error) => {
          console.error('Error generating image previews:', error);
          toast.error('Error generating image previews.');
        });

      const uploadedImages = await Promise.all(
        Array.from(files).map((file) => uploadToCloudinary(file))
      );
      const validImages = uploadedImages.filter((url) => url !== null) as string[];
      setPartnertImages(validImages);

      if (validImages.length > 0) {
        setEditData((prev) => ({ ...prev, photoUrl: validImages[0] }));
      }
    }
  };

  if (loadingPartners) {
    return <div className="p-6 text-center">Loading partners…</div>;
  }

  return (
    <div className="overflow-x-auto p-4">
      <table className="min-w-full border-collapse text-sm font-sans">
        <thead className="bg-gray-50 sticky top-0">
          <tr>
            <th className="p-2 border-b">#</th>
            <th className="p-2 border-b text-left">Title</th>
            <th className="p-2 border-b text-left">Photo</th>
            <th className="p-2 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {partners?.data?.map((p: IPartner, idx: number) => {
            const isEditing = editingId === p._id;
            return (
              <tr key={p._id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="p-2 border-b text-center">{idx + 1}</td>

                {/* Title */}
                <td className="p-2 border-b">
                  {isEditing ? (
                    <Input
                      value={editData.title}
                      onChange={(e) =>
                        setEditData({ ...editData, title: e.target.value })
                      }
                    />
                  ) : (
                    p.title
                  )}
                </td>

                {/* Image Upload / Preview */}
                <td className="p-2 border-b">
                  {isEditing ? (
                    <div className="space-y-1">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                      {editData.photoUrl && (
                        <img
                          src={editData.photoUrl}
                          alt="Preview"
                          className="w-16 h-16 object-cover rounded mt-1"
                        />
                      )}
                    </div>
                  ) : (
                    <img
                      src={p.photoUrl}
                      alt={p.title}
                      className="w-16 h-16 object-cover rounded"
                    />
                  )}
                </td>

                {/* Actions */}
                <td className="p-2 border-b text-center space-x-2">
                  {isEditing ? (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleCancel}
                        disabled={updating}
                      >
                        Cancel
                      </Button>
                      <Button size="sm" onClick={handleSave} disabled={updating}>
                        {updating ? 'Saving…' : 'Save'}
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(p)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(p._id)}
                        disabled={deleting}
                      >
                        {deleting ? 'Deleting…' : 'Delete'}
                      </Button>
                    </>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
