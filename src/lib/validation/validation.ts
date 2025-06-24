import { z } from "zod";

// Helper to check if running in browser
const isBrowser = typeof window !== "undefined" && typeof File !== "undefined";

export const InstructorformSchema = z.object({
  name: z.string().min(2, "নাম অবশ্যই ২ অক্ষরের বেশি হতে হবে"),
  email: z.string().email("সঠিক ইমেইল দিন"),
  expertise: z.string().min(5, "আপনার দক্ষতা লিখুন"),
  phone: z
    .string()
    .min(11, "আপনার সঠিক ফোন নাম্বার লিখুন")
    .max(14, "আপনার সঠিক ফোন নাম্বার লিখুন"),
  experience: z.string().min(1, "অভিজ্ঞতা নির্বাচন করুন"),
  message: z.string().min(20, "অন্তত ২০ অক্ষর লিখুন"),
  cv: isBrowser
    ? z
        .instanceof(File)
        .refine(
          (file) => file.size <= 5_000_000,
          "ফাইলের আকার ৫MB এর কম হতে হবে"
        )
    : z.any(),
});
