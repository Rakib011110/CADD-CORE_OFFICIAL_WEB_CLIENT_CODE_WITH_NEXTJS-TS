// app/(public)/autodesk-atc/page.tsx
import { Button } from "@/components/UI/button";
import { Badge } from "@/components/UI/badge";
import Image from "next/image";
import WhyChooseUsYourATC from "@/components/pages/AutodeskATCAllPage/WhyChooseUsYourATC/WhyChooseUsYourATC";
import AutodeskPageBanner from "@/components/pages/AutodeskATCAllPage/AutodeskPageBanner/AutodeskPageBanner";
import AutodeskCertificationCourses from "@/components/pages/AutodeskATCAllPage/AutodeskCertificationCourses/AutodeskCertificationCourses";
import VerifyOurATC from "@/components/pages/AutodeskATCAllPage/VerifyOurATC/VerifyOurATC";
import ATCDemoCerticate from "@/components/pages/AutodeskATCAllPage/ATCDemoCerticate/ATCDemoCerticate";
import CertificationProcess from "@/components/pages/AutodeskATCAllPage/ATCCertificationCourses/ATCCertificationCourses";
import ATCSoftwareCertification from "@/components/pages/AutodeskATCAllPage/ATCCertificationCourses/ATCCertificationCourses";
import AutodeskCertificationJourney from "@/components/pages/AutodeskATCAllPage/AutodeskCertificationJourney/AutodeskCertificationJourney";

export default function AutodeskATCPage() {
  return (
    <div className="min-h-screen bg-white">
  <div>
  <AutodeskPageBanner/>
  </div>
      {/* Why Choose Us */}
  <div>
  <WhyChooseUsYourATC/>
  </div>

<div>
<AutodeskCertificationJourney/>

</div>

  <div>
  <ATCSoftwareCertification/>
</div>

    
      <div>
        <AutodeskCertificationCourses/>
      </div>

    <div>
      <VerifyOurATC/>
    </div>
<div> 





</div>
     
      <div>
        <ATCDemoCerticate/>
      </div>
    </div>
  );
}