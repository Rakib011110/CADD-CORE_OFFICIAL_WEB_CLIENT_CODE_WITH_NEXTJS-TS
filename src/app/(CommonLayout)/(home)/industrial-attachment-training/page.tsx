import IndrustrialCourses from "@/components/pages/IndustrialAttachmenTraining/IndrustrialAllcoursesFiles/IndrustrialCourses/IndrustrialCourses";
import IndrustrialBanner from "@/components/pages/IndustrialAttachmenTraining/IndrustrialBanner/Bannner";


import IndustrialSupportAndTraining from "@/components/pages/IndustrialAttachmenTraining/IndustrailSupportAndTraining/IndustrailSupportAndTraining";
import WhyChoosUsForIndustrial from "@/components/pages/IndustrialAttachmenTraining/WhyChoosUsForIndustrial/WhyChoosUsForIndustrial";
import PopupBanner from "@/components/UI/PopupBanner/IndustrialPopupBanner/IndustrialPopupBanner";

export default function IndrustrialTraing() {
  return (
    <div style={{ fontFamily: "banglaFont" }}>
    <div className="">
        <IndrustrialBanner/>
    </div>
     <div className="mt-10">
      {/* <IndustrialFormSection/> */}

<IndrustrialCourses/>

    </div>
    <div className="mt-10">
        <WhyChoosUsForIndustrial/>
    </div>
   
 
<div className="">
 
{/* 




*/}
 
<IndustrialSupportAndTraining/>

<div>
  <PopupBanner/>
</div>
</div>
    
    </div>
  );
}