"use client";
import BatchSchedule from "@/components/pages/CourseDetails/BatchSchedule/BatchSchedule";
import CourseContentList from "@/components/pages/CourseDetails/CourseContent/CourseContent";
import { CourseForWhom } from "@/components/pages/CourseDetails/CourseForWhom/CourseForWhom";
import DetailsBannar from "@/components/pages/CourseDetails/DetailsBannar/DetailsBannar";
import SoftwareTaught from "@/components/pages/CourseDetails/DetailsHeadNav/SoftwareTaught";
import { FreelancingGuide } from "@/components/pages/CourseDetails/FreelancingGuide/FreelancingGuide";
import MastercourseOverview from "@/components/pages/CourseDetails/MastercourseOverview/MastercourseOverview";
import SupportAndTraining from "@/components/pages/CourseDetails/SupportAndTraining/SupportAndTraining";
import LoadingSpinner from "@/components/UI/LoadingSpinner/LoadingSpinner";
import { useGetCourseBySlugQuery } from "@/redux/api/courseApi";
import { useParams } from "next/navigation";
import ExpertPanel from "@/components/pages/CourseDetails/ExpertPanel/ExpartPanel";
import FreeTrainingSessions from "@/components/pages/CourseDetails/FreeTrainingSessions/FreeTrainingSessions";
import Certificate from "@/components/pages/CourseDetails/Certificate/Certificate";
import WorkingProjects from "@/components/pages/CourseDetails/WorkingProject/WorkingProject";
import OurCertificate from "@/components/pages/CourseDetails/Certificate/Ourcerticates";
import CertificateVerification from "@/components/pages/StudentCornar/CertificateVerification/CertificateVerification";
import useSmoothScroll from "@/hooks/useSmoothScroll";

import CourseSchedule from "@/components/pages/CourseDetails/CourseSchedule/CourseSchedule";
import RevitSection from "@/components/pages/CourseDetails/RevitSectionProps/RevitSectionProps"; // Corrected import path based on your snippet
import CourseFees from "@/components/pages/CourseDetails/CourseFees/CourseFees";
import OfflineBatchSchedule from "@/components/pages/CourseDetails/OflineBatchSchedule/OflineBatchSchedule";

export default function CourseDetails() {
  useSmoothScroll();

  const params = useParams();
  const slug = params?.slug; // The slug from the URL

  const {
    data: course,
    isError,
    isLoading,
  } = useGetCourseBySlugQuery(slug, {
    skip: !slug,
  });

  if (isLoading)
    return (
      <div>
        <LoadingSpinner />
      </div>
    );

  if (isError) return <p>Error fetching course details.</p>;

  // Define the specific slug for conditional rendering
  const requiredSlug = "professional-architectural-bim-modeling-mastercourse";
  const showRevitSection = slug === requiredSlug;


  // Define the specific slug for conditional rendering
  const RCCrequiredSlug = "professional-autocad-mastercourse";
  const RccshowRevitSection = slug === RCCrequiredSlug;


  const AutocadRequiredSlug = "professional-autocad-mastercourse";
  const showAutocadSection = slug === AutocadRequiredSlug;

  // Hide support section for Primavera P6 course
  const hideSupportForPrimavera = slug === "project-management-primavera-p6";





  return (
    <div style={{ fontFamily: "banglaFont" }} className="font-serif bg-gradient-to-b from-[#fff7f8] to-white ">









      
      <DetailsBannar course={course?.data} />
      <CourseFees course={course.data} />
      <div
        style={{ fontFamily: "banglaFont" }}
        className="text-justify font-sans">
        <BatchSchedule course={course?.data} />


        <div>
          <CourseSchedule course={course?.data} />
        </div>

  {showAutocadSection && <OfflineBatchSchedule />}

        <div className="" id="mastercourse-overview">
          <MastercourseOverview course={course?.data} />
        </div>

        {/* <div className="">{RccshowRevitSection && <Roadmap />}</div> */}
      </div>
      <div id="course-content">
        <CourseContentList course={course?.data} />
      </div>
      <div>
        <div>
          <WorkingProjects course={course?.data} />
        </div>

        {/* <div className="">{RccshowRevitSection && <ProjectShowcase />}</div> */}

        {/* Conditional rendering for RevitSection */}
        {showRevitSection && <RevitSection />}
      </div>
      <SoftwareTaught course={course?.data} />
      <div>
        <div id="freelancing-guide">
          <FreelancingGuide />
        </div>

        <div id="target-audience">
          <CourseForWhom />
        </div>

        
        
        {!hideSupportForPrimavera && (
          <div id="student-support">
            <SupportAndTraining />
          </div>
        )}




        <div id="experienced-advisors">
          <ExpertPanel course={course?.data} />
        </div>
        <div id="certificate-verification">
          <OurCertificate course={course?.data} />
        </div>
        {/* <div className="mt-10">
          <CertificateVerification />
        </div> */}

        <div id="certificate-verification">
          <Certificate course={course?.data} />
        </div>

        <div id="free-resources">
          <FreeTrainingSessions course={course?.data} />
        </div>
      </div>
    </div>
  );
}
