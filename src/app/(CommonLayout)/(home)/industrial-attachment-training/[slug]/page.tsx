"use client";

import CourseContentList from "@/components/pages/CourseDetails/CourseContent/CourseContent";
import { CourseForWhom } from "@/components/pages/CourseDetails/CourseForWhom/CourseForWhom";

import SoftwareTaught from "@/components/pages/CourseDetails/DetailsHeadNav/SoftwareTaught";
import { FreelancingGuide } from "@/components/pages/CourseDetails/FreelancingGuide/FreelancingGuide";


import LoadingSpinner from "@/components/UI/LoadingSpinner/LoadingSpinner";

import { useParams,  } from "next/navigation"; 
import ExpertPanel from "@/components/pages/CourseDetails/ExpertPanel/ExpartPanel";

import Certificate from "@/components/pages/CourseDetails/Certificate/Certificate";
import WorkingProjects from "@/components/pages/CourseDetails/WorkingProject/WorkingProject";
import OurCertificate from "@/components/pages/CourseDetails/Certificate/Ourcerticates";
import CertificateVerification from "@/components/pages/StudentCornar/CertificateVerification/CertificateVerification";
import IndrustrialTrainingDetailsBanner from "@/components/pages/IndustrialAttachmenTraining/IndrustrialTrainingDetails/IndrustrialTrainingDetailsBanner/IndrustrialTrainingDetailsBanner";
import { useGetIndrustrialCourseBySlugQuery } from "@/redux/api/indrustrialcourseApi";
import IndustrialSupportAndTraining from "@/components/pages/IndustrialAttachmenTraining/IndustrailSupportAndTraining/IndustrailSupportAndTraining";
import IndustrialOverview from "@/components/pages/IndustrialAttachmenTraining/IndrustrialOverviews/IndrustrialOverviews";

export default function CourseDetails() { 

  const params = useParams();  
  console.log(params)
  const slug = params?.slug; 

  const { data: course, isError, isLoading } = useGetIndrustrialCourseBySlugQuery(slug, {
    skip: !slug, 
  });



  if (isLoading) return <div> 

<LoadingSpinner/>

  </div> 
  
  
  if (isError) return <p>Error fetching course details.</p>;

  return (
    <div  style={{ fontFamily: "banglaFont" }} className="">
      <IndrustrialTrainingDetailsBanner course={course?.data}/> 

<div   className="text-justify font-sans">
{/* <BatchSchedule course={course?.data} /> */}
      <div  className="mt-20" id="mastercourse-overview">
        <IndustrialOverview  />
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
  <IndustrialSupportAndTraining />
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




     </div>
</div>



    



    </div>
  );
}
