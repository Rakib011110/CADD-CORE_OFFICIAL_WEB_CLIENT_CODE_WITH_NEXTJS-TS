import { redirect } from "next/navigation";

// Moved: fees, dates, payment plans and discounts are managed in one place now
export default function MovedPage() {
  redirect("/dashboard/course-batches");
}
