"use client"

import InstructorRecruitmentPage from "@/components/Home/InstructorRecruitementSection/InstructorRecruitementSection";
import OurCourses from "@/components/Home/OurCourses/OurCourses";
import OurServices from "@/components/Home/OurServices/OurServices";
import SeminarSchedule from "@/components/Home/SeminarSchedule/SeminarSchedule";
import StateSection from "@/components/Home/StatsSection/StatsSection";
import SuccessStoriesPageVideo from "@/components/Home/SuccessStoryVideo/SuccessStoryVideo";
import ClientsandPartners from "@/components/pages/About/ClientsandPartners/ClientsandPartners";
import Banner from "@/components/pages/Banner/Banner";
import FloatingContactMenu from "@/components/UI/FloatingContactMenu/FloatingContactMenu";
import useSmoothScroll from "@/hooks/useSmoothScroll";

export default function homeLayoutPage() {
  useSmoothScroll();
 
  return (
    <div style={{ fontFamily: "banglaFont" }}>
    <div  className="">
    <Banner/> 
    </div>
      <div>
<StateSection/>

      </div>

      <div>
        <SeminarSchedule/>
      </div>  

      <div>
<OurCourses/>

      </div> 

      <div>
        <OurServices/>
      </div> 

     
      {/* <FloatingContactMenu /> */}

<div>
<ClientsandPartners />
</div>

<div>

  <InstructorRecruitmentPage/>
</div>
<div>
        {/* <ClientReviews/> */} 


        <SuccessStoriesPageVideo/>
      </div> 
    </div>
  );
}