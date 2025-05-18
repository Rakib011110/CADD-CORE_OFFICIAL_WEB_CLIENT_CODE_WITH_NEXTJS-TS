import { Button } from "@/components/UI/button";
import { BadgeCheck, CheckCircle, QrCode } from "lucide-react";
import Image from "next/image";

export default function VerifyOurATC() {
  return (
    <div>
    <section className="py-10 bg-gradient-to-r from-blue-50 to-blue-100">
  <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="grid md:grid-cols-2 gap-0">
        {/* Left Side - Verification Content */}
        <div className="p-10 md:p-12 flex flex-col justify-center">
          <div className="mb-6 flex justify-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-red-500 text-white font-medium">
              <BadgeCheck className="h-5 w-5 mr-2" />
              Official Accreditation
            </div>
          </div>
          
          <h3 className="text-3xl font-bold text-gray-900 mb-4 text-center md:text-left">
            Verify Our <span className="bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent">Autodesk ATC®</span> Credentials
          </h3>
          
          <p className="text-lg text-gray-600 mb-6 text-center md:text-left">
            CADD CORE is proudly listed on Autodesk's official Authorized Training Center directory, meeting rigorous standards for:
          </p>
          
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {[
              "Curriculum quality",
              "Instructor certifications",
              "Facility standards",
              "Student success rates",
              "Software compliance",
              "Industry relevance"
            ].map((item, index) => (
              <li key={index} className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <span className="text-gray-700">{item}</span>
              </li>
            ))}
          </ul>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-center">
            <Button className="bg-black hover:bg-red-700 px-8 py-4 text-lg">
              Verify on Autodesk's Website
            </Button>
            
          </div>
        </div>
        
        {/* Right Side - Visual Verification */}
        <div className="bg-gray-900 p-8 flex flex-col items-center justify-center">
          <div className="mb-6 text-white text-center">
            <h4 className="text-xl font-semibold mb-2">Our ATC® ID</h4>
            <div className="text-3xl font-bold tracking-wider bg-white/10 rounded-lg px-6 py-3 inline-block">
              ATC-BD-2024
            </div>  
          </div>
          

        {/* QR Code Verification */}
          <div className="relative w-full max-w-xs aspect-square bg-white/10 rounded-lg p-6 mb-6">
            <div className="absolute inset-0 border-2 border-white/30 rounded-lg"></div>
            <div className="relative z-10 h-full flex flex-col items-center justify-center">
              <QrCode className="h-32 w-32 text-white mb-4" />
              <p className="text-white/80 text-sm text-center">
                Scan to verify our accreditation on Autodesk's official platform
              </p>
            </div>
          </div>
          
          <p className="text-white/80 text-sm text-center">
            Valid through: December 31, 2025
          </p>
        </div>
      </div>
    </div>
    
  
  </div>
</section>
    </div>
  );
}