import { toast } from "sonner";

/**
 * Uploads a single file to Cloudinary and returns the secure URL (or null on failure).
 * Shared by the course create/edit forms (previously duplicated inline in each page).
 */
export async function uploadToCloudinary(file: File): Promise<string | null> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "CADDCOREWEB");

  try {
    const response = await fetch(
      "https://api.cloudinary.com/v1_1/dbkwiwoll/image/upload",
      { method: "POST", body: formData }
    );

    const data = await response.json();

    if (response.ok) {
      return data.secure_url as string;
    }

    toast.error(`Image upload failed: ${data.error?.message ?? "unknown error"}`);
    return null;
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    toast.error("Image upload failed.");
    return null;
  }
}
