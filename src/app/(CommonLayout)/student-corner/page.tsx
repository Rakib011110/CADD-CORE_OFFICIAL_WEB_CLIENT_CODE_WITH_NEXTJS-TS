import StudentCornerBannar from "@/components/pages/StudentCornar/StudentCornerBanner/StudentCorner";
import CertificateVerification from "@/components/pages/StudentCornar/CertificateVerification/CertificateVerification";
import PopularCourses from "@/components/pages/StudentCornar/PopularCourses/PopularCourses";
import SupportForms from "@/components/pages/StudentCornar/SupportForms/SupportForms";
import StudentCertificate from "@/components/StudentCertificateApplications/StudentCertificateApplications";




export const metadata = {
  title: "Student Corner - CADD CORE",
  description: "Verify certificates, explore popular courses, and access student support at CADD CORE Student Corner.",
  keywords: ["Student Corner", "Certificate Verification", "Popular Courses", "Support Forms", "CADD CORE"],
  openGraph: {
    title: "Student Corner - CADD CORE",
    description: "Everything a student needs: certificate verification, popular courses, and full support at CADD CORE Student Corner.",
    // url: "https://yourdomain.com/student-corner", 
    type: "website",
    // images: [
    //   {
    //     url: "https://yourdomain.com/images/student-corner-banner.jpg", 
    //     width: 1200,
    //     height: 630,
    //     alt: "Student Corner Banner",
    //   },
    // ],
  },
 
  authors: [{ name: "CADD CORE" }],
  creator: "CADD CORE",
  publisher: "CADD CORE",
};


export default function StudentCorner() {
  return (
    <div>
    <StudentCornerBannar/>

    <div>
      {/* <CertificateVerification/> */} 

      <StudentCertificate/>
    </div>
    <div>
      <SupportForms/>
    </div> 

    <div>
      <PopularCourses/>
    </div>
    </div>
  );
}