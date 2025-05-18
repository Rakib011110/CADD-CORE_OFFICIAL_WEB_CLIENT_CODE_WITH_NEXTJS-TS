"use client";

import { useState } from "react";
import { Button } from "@/components/UI/button";
import {
  useDeleteIndustrialOfferBannerMutation,
  useGetAllindustrialOfferBannerQuery,
  useUpdateIndustrialOfferBannerMutation,
} from "@/redux/api/industrialOfferBannerApi";
import { Input } from "@/components/UI/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/UI/dialog";

interface Offer {
  _id: string;
  title: string;
  description: string;
  photoUrl: string;
  date: string;
  time: string;
  buyNowLink?: string;
  learnMoreLink?: string;
}

const OfferTable = () => {
  const { data, refetch } = useGetAllindustrialOfferBannerQuery({});
  const [updateOffer] = useUpdateIndustrialOfferBannerMutation();
  const [deleteOffer] = useDeleteIndustrialOfferBannerMutation();
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    photoUrl: "",
    date: "",
    time: "",
  });

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "YOUR_CLOUDINARY_PRESET");

    const res = await fetch("https://api.cloudinary.com/v1_1/YOUR_CLOUDINARY_NAME/image/upload", {
      method: "POST",
      body: formData,
    });

    const uploadData = await res.json();
    setForm((prev) => ({ ...prev, photoUrl: uploadData.secure_url }));
  };

  const handleEdit = (offer: Offer) => {
    setEditingOffer(offer);
    setForm({
      title: offer.title,
      description: offer.description,
      photoUrl: offer.photoUrl,
      date: offer.date,
      time: offer.time,
    });
  };

  const handleUpdate = async () => {
    if (!editingOffer) return;

    await updateOffer({ id: editingOffer._id, body: form });
    setEditingOffer(null);
    refetch();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete?")) {
      await deleteOffer(id);
      refetch();
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Offers</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-xl overflow-hidden">
          <thead className="bg-red-500 text-white">
            <tr>
              <th className="p-3 text-left">Title</th>
              <th className="p-3 text-left">Description</th>
              <th className="p-3 text-left">Image</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data?.data?.map((offer: Offer) => (
              <tr key={offer._id} className="border-b">
                <td className="p-3">{offer.title}</td>
                <td className="p-3">{offer.description}</td>
                <td className="p-3">
                  <img
                    src={offer.photoUrl}
                    alt="Offer"
                    className="h-12 w-12 rounded object-cover"
                  />
                </td>
                <td className="p-3 flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" onClick={() => handleEdit(offer)}>
                        Edit
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Offer</DialogTitle>
                      </DialogHeader>
                      <div className="flex flex-col gap-4 mt-4">
                        <Input
                          value={form.title}
                          onChange={(e) => setForm({ ...form, title: e.target.value })}
                          placeholder="Title"
                        />
                        <Input
                          value={form.description}
                          onChange={(e) => setForm({ ...form, description: e.target.value })}
                          placeholder="Description"
                        />
                        <Input
                          value={form.date}
                          type="date"
                          onChange={(e) => setForm({ ...form, date: e.target.value })}
                        />
                        <Input
                          value={form.time}
                          type="time"
                          onChange={(e) => setForm({ ...form, time: e.target.value })}
                        />
                        <Input type="file" onChange={handleUpload} />
                        {form.photoUrl && (
                          <img
                            src={form.photoUrl}
                            alt="Uploaded"
                            className="h-20 rounded"
                          />
                        )}
                        <Button
                          onClick={handleUpdate}
                          className="bg-red-500 hover:bg-red-600"
                        >
                          Update
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(offer._id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OfferTable;
