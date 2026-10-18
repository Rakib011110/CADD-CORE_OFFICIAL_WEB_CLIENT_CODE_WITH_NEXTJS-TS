"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { Toaster } from "sonner";
import { ArrowRight } from "lucide-react";
import { TCourse, TCourseBatch, TPaymentPlan } from "@/lib/courses";
import { useGetCourseBySlugQuery } from "@/redux/api/courseApi";
import { useGetInstallmentPlansQuery } from "@/redux/api/payment/useInstallmentPlansApi";
import CourseHero from "./CourseHero";
import EnrollCard from "./EnrollCard";
import MobileEnrollBar from "./MobileEnrollBar";
import CheckoutPanel from "./CheckoutPanel";
import OverviewSection from "./sections/OverviewSection";
import CurriculumSection from "./sections/CurriculumSection";
import BatchesSection from "./sections/BatchesSection";
import { ProjectsSection, SoftwareSection } from "./sections/SoftwareProjectsSections";
import { CertificatesSection, InstructorsSection } from "./sections/PeopleCertificatesSections";
import { AudienceSection, CareerSupportSection } from "./sections/CareerSections";
import { FaqSection, FreeSessionsSection } from "./sections/ResourcesFaqSections";
import WhyRevitSection from "./sections/WhyRevitSection";
import { MODE_ORDER, batchDateText, plansForBatch, resolvePlans } from "./courseUtils";

// Course-specific extras that are not stored in the database yet
const REVIT_SECTION_SLUGS = ["professional-architectural-bim-modeling-mastercourse"];
const HIDE_CAREER_SUPPORT_SLUGS = ["project-management-primavera-p6"];

// When the API returns no batches, show the course's single schedule the way
// the old page did. Its empty _id means no batch is sent at checkout.
function legacyBatches(course?: TCourse): TCourseBatch[] {
  const s = course?.schedule;
  if (!course || !s?.startingDate || isNaN(new Date(s.startingDate).getTime())) return [];
  const today = new Date(new Date().toDateString());
  // Same 14-day admission window as batches; older dates are out of date
  if (today.getTime() - new Date(s.startingDate).getTime() > 14 * 24 * 60 * 60 * 1000) return [];
  const started = new Date(s.startingDate) < today;
  return [
    {
      _id: "",
      course: course._id,
      mode: course.courseType === "one-to-one" ? "one-to-one" : "online",
      batchNo: "",
      startDate: s.startingDate,
      classDays: s.days,
      classTime: s.time,
      fee: course.courseFee,
      status: started ? "running" : "upcoming",
      isPublished: true,
    },
  ];
}

function PageSkeleton() {
  return (
    <div className="animate-pulse" aria-busy="true" aria-label="লোড হচ্ছে">
      <div className="bg-zinc-950">
        <div className="mx-auto max-w-7xl space-y-4 px-4 py-12 sm:px-6 lg:px-8">
          <div className="h-3 w-40 rounded bg-zinc-800" />
          <div className="h-8 w-2/3 rounded bg-zinc-800" />
          <div className="h-4 w-1/2 rounded bg-zinc-800" />
        </div>
      </div>
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-8">
        <div className="space-y-4">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-28 rounded-xl bg-zinc-100" />
          ))}
        </div>
        <div className="hidden h-96 rounded-xl bg-zinc-100 lg:block" />
      </div>
    </div>
  );
}

export default function CoursePageView({ slug }: { slug: string }) {
  const { data, isLoading, isError } = useGetCourseBySlugQuery(slug, { skip: !slug });
  const { data: plansResponse, isLoading: plansLoading } = useGetInstallmentPlansQuery({});
  const course: TCourse | undefined = data?.data;

  const plans: TPaymentPlan[] = useMemo(
    () => (course ? resolvePlans(course, plansResponse?.data || []) : []),
    [course, plansResponse]
  );

  // Batches the visitor can join, grouped in a fixed mode order, soonest first
  const batches: TCourseBatch[] = useMemo(
    () =>
      // An empty list also falls back, e.g. before batches are added to the live database
      [...(course?.batches?.length ? course.batches : legacyBatches(course))].sort(
        (a, b) =>
          MODE_ORDER.indexOf(a.mode) - MODE_ORDER.indexOf(b.mode) ||
          (a.startDate ? new Date(a.startDate).getTime() : Infinity) -
            (b.startDate ? new Date(b.startDate).getTime() : Infinity)
      ),
    [course]
  );

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedBatch =
    batches.find((b) => b._id === selectedId) || batches.find((b) => b.status !== "full") || batches[0] || null;
  // Plans of the chosen batch (a batch can have its own discount)
  const selectedPlans = useMemo(() => plansForBatch(selectedBatch, plans), [selectedBatch, plans]);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const openCheckout = useCallback(() => setCheckoutOpen(true), []);
  const closeCheckout = useCallback(() => setCheckoutOpen(false), []);
  const selectBatch = useCallback((b: TCourseBatch) => setSelectedId(b._id), []);

  if (isLoading) return <PageSkeleton />;
  if (isError || !course) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center" style={{ fontFamily: "banglaFont" }}>
        <h1 className="text-2xl font-bold text-zinc-900">কোর্সটি খুঁজে পাওয়া যায়নি</h1>
        <p className="mt-2 text-zinc-600">লিংকটি সঠিক কিনা দেখুন, অথবা সব কোর্সের তালিকা থেকে বেছে নিন।</p>
        <Link href="/courses" className="mt-6 inline-flex rounded-lg bg-red-600 px-5 py-2.5 font-semibold text-white hover:bg-red-700">
          সব কোর্স দেখুন
        </Link>
      </div>
    );
  }

  const cardProps = {
    course,
    batches,
    plans: selectedPlans,
    selectedBatch,
    onSelectBatch: selectBatch,
    onEnroll: openCheckout,
  };

  return (
    <div style={{ fontFamily: "banglaFont" }} className="overflow-x-clip bg-white pb-24 text-zinc-900 lg:pb-0">
      <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)] gap-x-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-8">
        {/* Dark banner: CourseHero draws its background full width behind the first grid row */}
        <header className="relative isolate min-w-0 lg:col-start-1 lg:row-start-1">
          <CourseHero course={course} />
        </header>

        {/* Desktop: enrollment card stays in view while scrolling, above the section bands */}
        <aside className="relative z-10 hidden lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:block lg:pb-12 lg:pt-10">
          <div className="sticky top-6">
            <EnrollCard {...cardProps} />
          </div>
        </aside>

        <main className="course-sections min-w-0 lg:col-start-1 lg:row-start-2">
          {/* Phones and tablets: the same card, right under the banner */}
          <div className="pt-6 lg:hidden">
            <EnrollCard {...cardProps} />
          </div>

          <OverviewSection course={course} />
          <CurriculumSection course={course} />
          <BatchesSection
            course={course}
            batches={batches}
            plans={plans}
            selectedBatch={selectedBatch}
            onSelectBatch={selectBatch}
          />
          <SoftwareSection course={course} />
          <ProjectsSection course={course} />
          {REVIT_SECTION_SLUGS.includes(slug) ? <WhyRevitSection /> : null}
          <InstructorsSection course={course} />
          <CertificatesSection course={course} />
          {!HIDE_CAREER_SUPPORT_SLUGS.includes(slug) ? <CareerSupportSection /> : null}
          <AudienceSection />
          <FreeSessionsSection course={course} />
          <FaqSection course={course} />

          {/* Closing call to action */}
          <div className="mb-12 mt-10 flex flex-col items-start justify-between gap-4 rounded-2xl bg-zinc-950 p-6 text-white sm:flex-row sm:items-center">
            <div>
              <p className="text-lg font-bold">আপনার আসন নিশ্চিত করুন</p>
              <p className="mt-0.5 text-sm text-zinc-400">
                {selectedBatch
                  ? `পরবর্তী ব্যাচ: ${batchDateText(selectedBatch)}`
                  : "পরবর্তী ব্যাচের তারিখ শীঘ্রই ঘোষণা করা হবে"}
              </p>
            </div>
            <button
              type="button"
              onClick={openCheckout}
              disabled={selectedBatch?.status === "full"}
              className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-5 py-2.5 font-semibold text-white hover:bg-red-700 disabled:bg-zinc-600">
              ভর্তি হোন <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </main>
      </div>

      <Toaster richColors position="top-center" />
      <MobileEnrollBar course={course} batch={selectedBatch} plans={selectedPlans} onEnroll={openCheckout} />
      <CheckoutPanel
        open={checkoutOpen}
        onClose={closeCheckout}
        course={course}
        batch={selectedBatch}
        batches={batches}
        onSelectBatch={selectBatch}
        plans={selectedPlans}
        plansLoading={plansLoading}
      />
    </div>
  );
}
