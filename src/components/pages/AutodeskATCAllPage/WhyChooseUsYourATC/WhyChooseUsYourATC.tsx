import TextCursor from "@/components/UI/TextAnimations/TextAnimations";
import Image from "next/image";

export default function WhyChooseUsYourATC() {
  return (
    <div>



    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center mb-16">
      <h2 className="text-4xl font-bold text-gray-900 mb-4">
      Get the Best <span className=" rounded-md p-1 bg-black text-white ">Autodesk ATC®</span> Training in Bangladesh
      </h2> 





      <p className="text-xl text-gray-600 max-w-3xl mx-auto">
        Discover the competitive advantages that make us Bangladesh's premier choice for Autodesk certification training
      </p>
    </div>
    
    <div className="grid md:grid-cols-3 gap-10">
      {[
        {
          title: "Official Autodesk-Approved Curriculum",
          description: "Our courses are developed using Autodesk's official training materials, ensuring you learn the most current and industry-relevant skills. We cover all certification objectives with structured learning paths.",
          icon: (
            <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          ),
          features: [
            "Direct from Autodesk training partners",
            "Updated with latest software versions",
            "Comprehensive certification prep"
          ],
          accentColor: "blue"
        },
        {
          title: "Expert Autodesk Certified Instructors",
          description: "Learn from industry veterans with 10+ years of practical experience who are Autodesk-certified trainers. Our instructors bring real-world projects into the classroom for practical learning.",
          icon: (
            <svg className="w-12 h-12 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          ),
          features: [
            "Minimum 10 years industry experience",
            "Autodesk Certified Professionals",
            "Mentorship beyond classroom"
          ],
          accentColor: "orange"
        },
        {
          title: "Project-Based Learning Approach",
          description: "We don't just teach software - we train professionals. Our hands-on projects simulate real architectural and engineering challenges you'll face in the workplace.",
          icon: (
            <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          ),
          features: [
            "Portfolio-worthy projects",
            "BIM coordination exercises",
            "Industry-standard workflows"
          ],
          accentColor: "gray-900"
        }
      ].map((item, index) => (
        <div 
          key={index} 
          className={`relative bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border-t-4 border-black`}
        >
          <div className="p-8">
            <div className="flex justify-center mb-6">
              <div className={`p-3 rounded-full bg-${item.accentColor}-50`}>
                {item.icon}
              </div>
            </div>
            
            <h3 className="text-2xl font-bold text-center mb-4 text-gray-900">
              {item.title}
            </h3>
            
            <p className="text-gray-600 mb-6">
              {item.description}
            </p>
            
            <ul className="space-y-3 mb-8">
              {item.features.map((feature, i) => (
                <li key={i} className="flex items-start">
                  <svg className={`flex-shrink-0 h-5 w-5 text-${item.accentColor}-500 mt-0.5 mr-2`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
            
            {/* <div className="text-center">
              <button className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-${item.accentColor}-600 hover:bg-${item.accentColor}-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${item.accentColor}-500 transition-colors`}>
                Learn more
              </button>
            </div> */}
          </div>
        </div>
      ))}
    </div>

    {/* Trust Badges */}
   <div className="mt-16">
  
  <div className="flex flex-wrap justify-center gap-4 items-center">
    {[
      { 
        src: "https://res.cloudinary.com/dalpf8iip/image/upload/v1747111938/WhatsApp_Image_2025-05-12_at_6.01.01_PM_sjdwhm.jpg", 
        alt: "Autodesk ATC Badge",
        width: 200,
        bg: "bg-white",
        padding: "p-1"
      },
      { 
        src: "https://res.cloudinary.com/dalpf8iip/image/upload/v1747111896/autodesk_qmrw4i.png", 
        alt: "Autodesk Certified",
        width: 200,
        bg: "bg-gray-100",
        padding: "p-1"
      },
      { 
        src: "https://res.cloudinary.com/dalpf8iip/image/upload/v1747111892/image_vif2ga.png", 
        alt: "Autodesk Partner",
        width: 200,
        bg: "bg-white",
        padding: "p-1"
      },
      { 
        src: "https://res.cloudinary.com/dalpf8iip/image/upload/v1747111872/3ds-Max_vjgz1u.png", 
        alt: "Autodesk Partner",
        width: 200,
        bg: "bg-white",
        padding: "p-1"
      }
    ].map((badge, index) => (
      <div 
        key={index} 
        className={`${badge.bg} p-5 rounded-lg shadow-sm border-2 border-black border-r-0 border-l-0  hover:shadow-md  transition-shadow `}
      >
        <div className="flex items-center justify-center h-20 "> {/* Fixed height container */}
          <Image 
            src={badge.src} 
            alt={badge.alt} 
            width={600} 
            height={80} 
            className="h-full w-20 object-contain max-h-20" /* Constrained logo height */
            // style={{
            //   filter: 'brightness(0) saturate(100%)', // Makes all logos black
            //   mixBlendMode: 'multiply' // Helps with transparency
            // }}
          />
        </div>
      </div>
    ))}
  </div>
</div>
  </div>
</section>
    </div>
  );
}