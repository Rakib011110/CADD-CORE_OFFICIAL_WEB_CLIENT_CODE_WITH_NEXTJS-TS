import AllCourses from "@/components/pages/Courses/Courses";
import AllCoursesPopupBanner from "@/components/UI/AllCoursesOfferBanner/AllCoursesOfferBanner";


export const metadata = {
  title: "Professional CAD & BIM Courses – CADD CORE",
  description:
    "Explore expert-led mastercourses in AutoCAD, BIM Modeling, Structural Design, and Mechanical CAD at CADD CORE. Get certified and job-ready in architecture, civil, and mechanical engineering fields.",
  keywords: [
    "AutoCAD Mastercourse",
    "BIM Modeling Course",
    "Structural Design Course",
    "Mechanical CAD Training",
    "Architectural CAD",
    "Civil Engineering CAD",
    "CADD CORE Courses",
    "Professional CAD Courses",
    "Revit BIM Certification Course",
    "RCC Structural Design Course",
    "CAD Training in Bangladesh Course"
  ],
  openGraph: {
    title: "Advance Your Career with CAD & BIM Mastercourses | CADD CORE",
    description:
      "Join CADD CORE's professional CAD & BIM courses in AutoCAD, Revit, Structural Engineering, and Mechanical Design. Learn from industry experts and earn certification.",
    url: "www.caddcore.net/courses", // Replace with actual URL
    type: "website",
    images: [
      {
        url: "https://www.caddcore.net/_next/image?url=https%3A%2F%2Fres.cloudinary.com%2Fdbkwiwoll%2Fimage%2Fupload%2Fv1746349680%2FArtboard_1_1_-Picsart-AiImageEnhancer_dccum8.png&w=1080&q=75", 
        width: 1200,
        height: 630,
        alt: "CADD CORE - CAD & BIM Courses",
      },
    ],
  },
  authors: [{ name: "CADD CORE" }],
  creator: "CADD CORE",
  publisher: "CADD CORE",
};



export default function Course() { 





  return (
    <div>
     <AllCourses/> 
     {/* <AllCoursesPopupBanner/> */}
    </div>
  );
}