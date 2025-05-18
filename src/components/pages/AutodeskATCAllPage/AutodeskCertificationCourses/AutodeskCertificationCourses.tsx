import { Button } from "@/components/UI/button";
import Image from "next/image";
import { CalendarDays, Clock, Aperture, BadgeCheck, Users, BookOpen, Briefcase } from "lucide-react";
import Link from "next/link";

export default function AutodeskCertificationCourses() {
  return (
    <section className="py-10 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            <span className="bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent">
              Professional Mastercourse Courses
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Master industry-standard tools with our comprehensive training programs
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {[
          
            {
              title: "Professional AutoCAD Mastercourse (Civil & Architectural)",
              logo: "https://res.cloudinary.com/dalpf8iip/image/upload/v1747031201/pngwing.com_1_kw0pmp.png",
              description: "Master 2D drafting and 3D modeling techniques for civil engineering and architectural design projects",
              details:"/courses/professional-autocad-mastercourse",
              highlights: [
                "Advanced 2D drafting techniques",
                "3D modeling and visualization",
                "Civil engineering applications",
                "Architectural detailing"
              ],
              duration: "5 Months",
              lessons: "40 Lessons",
              projects: "10 Real-world Projects",
              certification: "Autodesk Certified Professional"
            },
            {
              title: "Professional BIM Modeling Using Revit Mastercourse",
              logo: "https://res.cloudinary.com/dalpf8iip/image/upload/v1747031381/pngwing.com_2_a9arqp.png",
              description: "Comprehensive training in Building Information Modeling for architectural design and construction documentation",
              details:"/courses/professional-architectural-bim-modeling-mastercourse",
              highlights: [
                "Parametric family creation",
                "Construction documentation",
                "BIM coordination workflows",
                "Energy analysis and visualization"
              ], 
              
              duration: "4 Months",
              lessons: "40 Lessons",
              projects: "10 Real-world Projects",
              certification: "Autodesk Certified Professional"
            },
            {
              title: "RCC Building Structural Analysis, Design and Detailing Mastercourse",
              logo: "https://res.cloudinary.com/dalpf8iip/image/upload/v1747031201/pngwing.com_1_kw0pmp.png",
              description: "Comprehensive training in reinforced concrete structure design, analysis, and detailing",
              details:"/courses/rcc-building-structural-analysis-design-mastercourse",
              highlights: [
                "Structural analysis fundamentals",
                "RCC design principles",
                "Detailing best practices",
                "Code-compliant designs"
              ],
              duration: "6 Months",
              lessons: "50 Lessons",
              projects: "15 Real-world Projects",
              certification: "Structural Engineering Certification"
            }
          ].map((course, index) => (
            <div 
              key={index} 
              className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="p-2 bg-gradient-to-r from-blue-50 to-gray-50">
                <div className="flex justify-center p-4">
                  <Image 
                    src={course.logo} 
                    alt={course.title} 
                    width={500} 
                    height={500}
                    className="h-16 w-auto object-contain"
                  />
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-gray-900">{course.title}</h3>
                  <BadgeCheck className="h-6 w-6 text-blue-500" />
                </div>
                
                <p className="text-gray-600 mb-5">{course.description}</p>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-center text-sm text-gray-700">
                    <Clock className="h-4 w-4 mr-2 text-orange-500" />
                    <span><strong>Duration:</strong> {course.duration}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-700">
                    <BookOpen className="h-4 w-4 mr-2 text-blue-500" />
                    <span><strong>{course.lessons}</strong> with hands-on exercises</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-700">
                    <Briefcase className="h-4 w-4 mr-2 text-green-500" />
                    <span><strong>{course.projects}</strong> </span>
                  </div>
                </div>
                
                {/* <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                    <Users className="h-5 w-5 mr-2 text-purple-500" />
                    Key Learning Outcomes:
                  </h4>
                  <ul className="space-y-2 pl-1">
                    {course.highlights.map((highlight, i) => (
                      <li key={i} className="flex items-start text-sm text-gray-700">
                        <span className="text-blue-500 mr-2">•</span>
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div> */}
                
                <div className="flex flex-col space-y-3">
                  <Button variant="outline" className="w-full border-black bg-black  text-red-50 hover:bg-blue-50">
                  
                  <Link href={course.details}>
                    <span className="ml-2">View Details</span>
                  </Link>
                  </Button>
                  {/* <Button variant="outline" className="w-full border-blue-600 text-blue-600 hover:bg-blue-50">
                    Download Syllabus
                  </Button> */}
                </div>
              </div>
              
              <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 text-center">
                <div className="flex items-center justify-center text-sm text-gray-500">
                  <CalendarDays className="h-4 w-4 mr-2" />
                  <span>Join our ongoing admission session</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-16">
          {/* <Button className="bg-gradient-to-r from-blue-600 to-orange-500 text-white px-8 py-4 text-lg font-semibold hover:shadow-lg transition-all">
            View All Certification Programs
          </Button> */}
        </div>
      </div>
    </section>
  );
}