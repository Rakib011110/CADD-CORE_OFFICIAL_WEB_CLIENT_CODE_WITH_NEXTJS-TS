"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  CreditCard,
  FileText,
  ImageIcon,
  Loader2,
  Save,
  Users,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";

import { Form } from "@/components/UI/form";
import { Button } from "@/components/UI/button";
import {
  useCreateCourseMutation,
  useUpdateCourseMutation,
} from "@/redux/api/courseApi";

import { TabNav, type TabItem } from "./TabNav";
import { BasicsTab } from "./tabs/BasicsTab";
import { ContentTab } from "./tabs/ContentTab";
import { PeopleTab } from "./tabs/PeopleTab";
import { MediaTab } from "./tabs/MediaTab";
import { PricingTab } from "./tabs/PricingTab";
import {
  courseFormDefaults,
  courseFormSchema,
  courseToFormValues,
  formValuesToPayload,
  TAB_FIELD_MAP,
  type CourseFormValues,
} from "./courseFormSchema";

const TABS: TabItem[] = [
  { id: "basics", label: "Basics", icon: FileText },
  { id: "content", label: "Content", icon: BookOpen },
  { id: "people", label: "People", icon: Users },
  { id: "media", label: "Media", icon: ImageIcon },
  { id: "pricing", label: "Pricing", icon: CreditCard },
];

type CourseFormProps = {
  mode: "create" | "edit";
  initialData?: any;
};

export default function CourseForm({ mode, initialData }: CourseFormProps) {
  const router = useRouter();
  const [active, setActive] = useState("basics");

  const methods = useForm<CourseFormValues>({
    resolver: zodResolver(courseFormSchema),
    defaultValues: courseFormDefaults,
    mode: "onBlur",
  });

  const {
    formState: { errors },
  } = methods;

  const [createCourse, { isLoading: creating }] = useCreateCourseMutation();
  const [updateCourse, { isLoading: updating }] = useUpdateCourseMutation();
  const isSaving = creating || updating;

  // Once a course is created via "Save & Next", remember its id so subsequent
  // saves update the same course instead of creating duplicates.
  const [savedCourseId, setSavedCourseId] = useState<string | undefined>(
    initialData?._id
  );

  // Populate the form when editing an existing course.
  useEffect(() => {
    if (mode === "edit" && initialData) {
      methods.reset(courseToFormValues(initialData));
    }
  }, [mode, initialData, methods]);

  const errorTabs = useMemo(() => {
    const set = new Set<string>();
    const errorKeys = Object.keys(errors);
    for (const [tabId, keys] of Object.entries(TAB_FIELD_MAP)) {
      if (keys.some((k) => errorKeys.includes(k))) set.add(tabId);
    }
    return set;
  }, [errors]);

  const activeIndex = TABS.findIndex((t) => t.id === active);
  const isFirst = activeIndex === 0;
  const isLast = activeIndex === TABS.length - 1;

  const goNext = () => {
    if (activeIndex < TABS.length - 1) setActive(TABS[activeIndex + 1].id);
  };

  /** Create (first time) or update the course. Returns true on success. */
  const persist = async (values: CourseFormValues): Promise<boolean> => {
    const payload = formValuesToPayload(values);
    const editingId = mode === "edit" ? initialData?._id : savedCourseId;
    try {
      if (editingId) {
        await updateCourse({ id: editingId, courseData: payload }).unwrap();
        toast.success("Saved successfully!");
      } else {
        const res: any = await createCourse(payload).unwrap();
        const newId = res?.data?._id;
        if (newId) setSavedCourseId(newId);
        toast.success("Course created successfully!");
      }
      return true;
    } catch (err: any) {
      toast.error(err?.data?.message || "Save failed. Please try again.");
      return false;
    }
  };

  const onInvalid = (formErrors: typeof errors) => {
    const errorKeys = Object.keys(formErrors);
    const firstTab = TABS.find((t) =>
      TAB_FIELD_MAP[t.id].some((k) => errorKeys.includes(k))
    );
    if (firstTab) setActive(firstTab.id);
    toast.error("কিছু ফিল্ড সঠিকভাবে পূরণ করুন।");
  };

  // Save and stay on the current tab (header button).
  const saveAndStay = methods.handleSubmit(async (v) => {
    await persist(v);
  }, onInvalid);

  // Save and advance to the next tab (footer button).
  const saveAndNext = methods.handleSubmit(async (v) => {
    const ok = await persist(v);
    if (ok) goNext();
  }, onInvalid);

  // Save and leave to the courses list (final tab).
  const saveAndFinish = methods.handleSubmit(async (v) => {
    const ok = await persist(v);
    if (ok) router.push("/dashboard/manage-courses");
  }, onInvalid);

  return (
    <div className="min-h-screen bg-gray-50">
      <Form {...methods}>
        <form onSubmit={(e) => e.preventDefault()}>
          {/* Sticky header + tabs */}
          <div className="sticky top-0 z-20 border-b bg-white/95 backdrop-blur">
            <div className="mx-auto max-w-5xl px-4 py-4">
              <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                  <h1 className="text-xl font-bold text-gray-900">
                    {mode === "edit" ? "Update Course" : "Create a New Course"}
                  </h1>
                  <p className="text-xs text-gray-500">
                    যেকোনো ট্যাবে গিয়ে এডিট করুন, যেকোনো সময় সেভ করুন।
                  </p>
                </div>
                <Button
                  type="button"
                  onClick={saveAndStay}
                  disabled={isSaving}
                  className="bg-gray-900 hover:bg-red-600"
                >
                  {isSaving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  Save
                </Button>
              </div>
              <TabNav
                tabs={TABS}
                active={active}
                onChange={setActive}
                errorTabs={errorTabs}
              />
            </div>
          </div>

          {/* Tab content */}
          <div className="mx-auto max-w-5xl px-4 py-6">
            <div className={active === "basics" ? "block" : "hidden"}>
              <BasicsTab />
            </div>
            <div className={active === "content" ? "block" : "hidden"}>
              <ContentTab />
            </div>
            <div className={active === "people" ? "block" : "hidden"}>
              <PeopleTab />
            </div>
            <div className={active === "media" ? "block" : "hidden"}>
              <MediaTab />
            </div>
            <div className={active === "pricing" ? "block" : "hidden"}>
              <PricingTab />
            </div>
          </div>

          {/* Sticky footer nav */}
          <div className="sticky bottom-0 z-20 border-t bg-white/95 backdrop-blur">
            <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
              <Button
                type="button"
                variant="outline"
                disabled={isFirst}
                onClick={() => setActive(TABS[activeIndex - 1].id)}
              >
                <ArrowLeft className="h-4 w-4" /> Previous
              </Button>

              {isLast ? (
                <Button
                  type="button"
                  onClick={saveAndFinish}
                  disabled={isSaving}
                  className="bg-gray-900 hover:bg-red-600"
                >
                  {isSaving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  Save &amp; Finish
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={saveAndNext}
                  disabled={isSaving}
                  className="bg-gray-900 hover:bg-red-600"
                >
                  {isSaving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  Save &amp; Next <ArrowRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
