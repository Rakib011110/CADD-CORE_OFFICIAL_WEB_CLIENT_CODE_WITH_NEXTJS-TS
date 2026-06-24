import { z } from "zod";

/**
 * Zod schema for the course create/edit form.
 *
 * Field names mirror the existing `TCourse` shape exactly so the submitted
 * payload stays identical to the old forms — the backend is untouched.
 */

const planSchema = z.object({
  name: z.string(),
  installments: z.number(),
  discountPercent: z.number(),
  isActive: z.boolean(),
});

export const courseFormSchema = z.object({
  // --- Basic info (required mirrors the Mongoose `required: true` fields) ---
  title: z.string().min(1, "Title is required"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[^\s]+$/, "No spaces — use hyphens (-) to separate words"),
  courseType: z.enum(["regular", "one-to-one"]),
  categories: z.string().min(1, "At least one category is required"),
  courseFee: z.string().min(1, "Course fee is required"),
  duration: z.string().min(1, "Duration is required"),
  lessons: z.string().min(1, "Lessons is required"),
  projects: z.string().min(1, "Projects is required"),
  photoUrl: z.string().min(1, "Course image is required"),
  description: z.string().min(1, "Description is required"),

  schedule: z.object({
    startingDate: z.string(),
    mode: z.string(),
    days: z.string(),
    time: z.string(),
  }),

  overview: z.object({
    overviewDescription: z.string(),
    videoUrl: z.string(),
  }),

  courseIncludes: z.object({
    duration: z.string(),
    liveSessions: z.string(),
    certificate: z.string(),
    onJobTraining: z.string(),
    projects: z.string(),
    experienceLetter: z.string(),
  }),

  // --- Content ---
  topicsCovered: z.array(
    z.object({ topicTitle: z.string(), topicDescription: z.string() })
  ),
  learningProject: z.array(
    z.object({ title: z.string(), description: z.string(), photoUrl: z.string() })
  ),
  softwaresTaught: z.array(
    z.object({ softwareTitle: z.string(), photoUrl: z.string() })
  ),

  // --- People ---
  expertPanel: z.object({
    advisors: z.array(
      z.object({ name: z.string(), title: z.string(), photoUrl: z.string() })
    ),
    teachers: z.array(
      z.object({ name: z.string(), role: z.string(), photoUrl: z.string() })
    ),
  }),

  // --- Media ---
  demoCertificate: z.array(
    z.object({ title: z.string(), photoUrl: z.string() })
  ),
  InternationaldemoCertificate: z.array(
    z.object({
      certificateTitle: z.string(),
      certificateOverview: z.string(),
      photoUrl: z.string(),
    })
  ),
  freeTrainingSessions: z.array(
    z.object({ title: z.string(), videoUrl: z.string() })
  ),
  faqs: z.array(z.object({ question: z.string(), answer: z.string() })),

  // --- Pricing ---
  paymentPlans: z.array(planSchema),
});

export type CourseFormValues = z.infer<typeof courseFormSchema>;

/** A blank form, used for the create flow. */
export const courseFormDefaults: CourseFormValues = {
  title: "",
  slug: "",
  courseType: "regular",
  categories: "",
  courseFee: "",
  duration: "",
  lessons: "",
  projects: "",
  photoUrl: "",
  description: "",
  schedule: { startingDate: "", mode: "", days: "", time: "" },
  overview: { overviewDescription: "", videoUrl: "" },
  courseIncludes: {
    duration: "",
    liveSessions: "",
    certificate: "",
    onJobTraining: "",
    projects: "",
    experienceLetter: "",
  },
  topicsCovered: [],
  learningProject: [],
  softwaresTaught: [],
  expertPanel: { advisors: [], teachers: [] },
  demoCertificate: [],
  InternationaldemoCertificate: [],
  freeTrainingSessions: [],
  faqs: [],
  paymentPlans: [],
};

/** Which top-level field keys belong to which tab — used for per-tab error dots. */
export const TAB_FIELD_MAP: Record<string, string[]> = {
  basics: [
    "title",
    "slug",
    "courseType",
    "categories",
    "courseFee",
    "duration",
    "lessons",
    "projects",
    "photoUrl",
    "description",
    "schedule",
    "overview",
    "courseIncludes",
  ],
  content: ["topicsCovered", "learningProject", "softwaresTaught"],
  people: ["expertPanel"],
  media: [
    "demoCertificate",
    "InternationaldemoCertificate",
    "freeTrainingSessions",
    "faqs",
  ],
  pricing: ["paymentPlans"],
};

const asString = (value: unknown): string =>
  value === undefined || value === null ? "" : String(value);

const asArray = <T>(value: unknown): T[] => (Array.isArray(value) ? (value as T[]) : []);

/**
 * Maps an API course document into form values.
 * - `categories` (stored as a string[]) is flattened to a comma-separated string.
 * - `courseFee` (stored as a number) becomes a string for the text input.
 * - Missing arrays/objects fall back to empty defaults.
 */
export function courseToFormValues(course: any): CourseFormValues {
  if (!course) return courseFormDefaults;

  return {
    title: asString(course.title),
    slug: asString(course.slug),
    courseType: course.courseType === "one-to-one" ? "one-to-one" : "regular",
    categories: Array.isArray(course.categories)
      ? course.categories.join(", ")
      : asString(course.categories),
    courseFee: asString(course.courseFee),
    duration: asString(course.duration),
    lessons: asString(course.lessons),
    projects: asString(course.projects),
    photoUrl: asString(course.photoUrl),
    description: asString(course.description),
    schedule: {
      startingDate: asString(course.schedule?.startingDate).split("T")[0],
      mode: asString(course.schedule?.mode),
      days: asString(course.schedule?.days),
      time: asString(course.schedule?.time),
    },
    overview: {
      overviewDescription: asString(course.overview?.overviewDescription),
      videoUrl: asString(course.overview?.videoUrl),
    },
    courseIncludes: {
      duration: asString(course.courseIncludes?.duration),
      liveSessions: asString(course.courseIncludes?.liveSessions),
      certificate: asString(course.courseIncludes?.certificate),
      onJobTraining: asString(course.courseIncludes?.onJobTraining),
      projects: asString(course.courseIncludes?.projects),
      experienceLetter: asString(course.courseIncludes?.experienceLetter),
    },
    topicsCovered: asArray<any>(course.topicsCovered).map((t) => ({
      topicTitle: asString(t.topicTitle),
      topicDescription: asString(t.topicDescription),
    })),
    learningProject: asArray<any>(course.learningProject).map((p) => ({
      title: asString(p.title),
      description: asString(p.description),
      photoUrl: asString(p.photoUrl),
    })),
    softwaresTaught: asArray<any>(course.softwaresTaught).map((s) => ({
      softwareTitle: asString(s.softwareTitle),
      photoUrl: asString(s.photoUrl),
    })),
    expertPanel: {
      advisors: asArray<any>(course.expertPanel?.advisors).map((a) => ({
        name: asString(a.name),
        title: asString(a.title),
        photoUrl: asString(a.photoUrl),
      })),
      teachers: asArray<any>(course.expertPanel?.teachers).map((t) => ({
        name: asString(t.name),
        role: asString(t.role),
        photoUrl: asString(t.photoUrl),
      })),
    },
    demoCertificate: asArray<any>(course.demoCertificate).map((c) => ({
      title: asString(c.title),
      photoUrl: asString(c.photoUrl),
    })),
    InternationaldemoCertificate: asArray<any>(
      course.InternationaldemoCertificate
    ).map((c) => ({
      certificateTitle: asString(c.certificateTitle),
      certificateOverview: asString(c.certificateOverview),
      photoUrl: asString(c.photoUrl),
    })),
    freeTrainingSessions: asArray<any>(course.freeTrainingSessions).map((f) => ({
      title: asString(f.title),
      videoUrl: asString(f.videoUrl),
    })),
    faqs: asArray<any>(course.faqs).map((f) => ({
      question: asString(f.question),
      answer: asString(f.answer),
    })),
    paymentPlans: asArray<any>(course.paymentPlans).map((p) => ({
      name: asString(p.name),
      installments: Number(p.installments) || 1,
      discountPercent: Number(p.discountPercent) || 0,
      isActive: p.isActive ?? true,
    })),
  };
}

/**
 * Maps form values into the API payload.
 * `categories` is split back into a trimmed string[] to match the `[String]` column.
 * All other field names match the existing payload exactly.
 */
export function formValuesToPayload(values: CourseFormValues) {
  return {
    ...values,
    categories: values.categories
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean),
  };
}
