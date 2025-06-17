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

import { useParams,  } from "next/navigation"; 

import ExpertPanel from "@/components/pages/CourseDetails/ExpertPanel/ExpartPanel";
import FreeTrainingSessions from "@/components/pages/CourseDetails/FreeTrainingSessions/FreeTrainingSessions";
import Certificate from "@/components/pages/CourseDetails/Certificate/Certificate";
import WorkingProjects from "@/components/pages/CourseDetails/WorkingProject/WorkingProject";
import OurCertificate from "@/components/pages/CourseDetails/Certificate/Ourcerticates";
import CertificateVerification from "@/components/pages/StudentCornar/CertificateVerification/CertificateVerification";
import useSmoothScroll from "@/hooks/useSmoothScroll";
import CertificationPathway from "@/components/pages/CourseDetails/CertificationPathway/CertificationPathway";
import Roadmap from "@/components/pages/CourseDetails/CertificationPathway/CertificationPathway";
import CourseSchedule from "@/components/pages/CourseDetails/CourseSchedule/CourseSchedule";

export default function CourseDetails() { 
  useSmoothScroll();

  const params = useParams();  
  // console.log(params)
  const slug = params?.slug; 

  const { data: course, isError, isLoading } = useGetCourseBySlugQuery(slug, {
    skip: !slug, 
  });



  if (isLoading) return <div> 

<LoadingSpinner/>

  </div> 
  
  
  if (isError) return <p>Error fetching course details.</p>;

  return (
    <div style={{ fontFamily: "banglaFont" }} className="font-serif ">
      <DetailsBannar course={course?.data}/> 

<div style={{ fontFamily: "banglaFont" }}  className="text-justify font-sans">
<BatchSchedule course={course?.data} /> 


<div>
<CourseSchedule course={course?.data} />

</div>


      <div  className="" id="mastercourse-overview">
        <MastercourseOverview  course={course?.data}/>
      </div>  


<div className="">
  <Roadmap/>
</div>



      <div id="course-content">
        
        <CourseContentList   course={course?.data}/>
      </div> 
<div>

<div>
  <WorkingProjects course={course?.data}/>
</div>

</div>

      <SoftwareTaught  course={course?.data}/> 
      <div>
      <div id="freelancing-guide">
  <FreelancingGuide />
</div>

<div id="target-audience">
  <CourseForWhom />
</div>

<div id="student-support">
  <SupportAndTraining />
</div>
<div id="experienced-advisors">
  <ExpertPanel course={course?.data} />
</div>
<div id="certificate-verification">
  <OurCertificate course={course?.data} />
</div>
<div className="mt-10">
<CertificateVerification/>
</div>

<div id="certificate-verification">
  <Certificate course={course?.data} />
</div>

<div id="free-resources">
  <FreeTrainingSessions course={course?.data} />
</div>

     </div>
</div>
    </div>
  );
}
