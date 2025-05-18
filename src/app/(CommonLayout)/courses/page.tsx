import AllCourses from "@/components/pages/Courses/Courses";
import AllCoursesPopupBanner from "@/components/UI/AllCoursesOfferBanner/AllCoursesOfferBanner";


export const metadata = {
  title: "Professional AutoCAD Mastercourse (Civil & Architecture)",
  description:
    "Explore expert-led mastercourses in AutoCAD, BIM Modeling, Structural Design, and Mechanical CAD at CADD CORE. Get certified and job-ready in architecture, civil, and mechanical engineering fields.",
   keywords: [
    // Core AutoCAD Courses
    "AutoCAD training center in Dhaka",
    "AutoCAD course in Dhaka",
    "AutoCAD training course",
    "AutoCAD course in BD",
    "AutoCAD course with certificate",
    "AutoCAD courses for beginners in BD",
    "AutoCAD training course online",
    "free AutoCAD courses for beginners",
    "online AutoCAD courses for beginners",
    "free online AutoCAD course with certificate",
    "professional AutoCAD training center",

    // Advanced AutoCAD Courses
    "Advanced AutoCAD training center in Dhaka",
    "Advanced AutoCAD course in Dhaka",
    "Advanced AutoCAD training course",
    "Advanced AutoCAD full course",
    "Advanced AutoCAD course in BD",
    "Advanced AutoCAD course with certificate",

    // Additional SEO Keywords (Industry-Specific)
    "Best AutoCAD institute in Bangladesh",
    "AutoCAD certification course Dhaka",
    "Learn AutoCAD in Bangladesh",
    "AutoCAD 2D 3D training",
    "Civil AutoCAD course",
    "Architectural AutoCAD training",
    "Mechanical AutoCAD course",
    "AutoCAD for engineers",
    "AutoCAD job-ready training",
    "CADD CORE AutoCAD courses",

    // Related Terms
    "BIM Modeling Course",
    "Revit Architecture Training",
    "Structural Design Course",
    "3D Modeling Classes",
    "CAD Certification Bangladesh"
  ],
  // Rest of your metadata (openGraph, authors, etc.) remains the same
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