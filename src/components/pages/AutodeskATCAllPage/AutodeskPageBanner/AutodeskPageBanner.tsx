import Image from "next/image";
import { Button } from "@/components/UI/button";
import { Badge } from "@/components/UI/badge";
import { CheckCircle, ChevronDown, Rocket, Award, GraduationCap, Laptop, Pencil, Triangle, StarHalfIcon, Circle, Scale } from "lucide-react";
import { FaPencilRuler } from "react-icons/fa";

export default function AutodeskPageBanner() {
  return (
    <div>
      {/* Hero Section with Background Image */}
      <section className="relative py-12 md:py-16 overflow-hidden">
        {/* Animated Background Gradient */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute inset-0  bg-gradient-to-br from-gray-900/100 via-black/100 to-gray-900/100 animate-gradient-shift"></div>
          <Image
            src="https://res.cloudinary.com/dalpf8iip/image/upload/v1747021661/future-building-construction-engineering-project_bxnt9k.jpg"
            alt="Architecture BIM background"
            fill
            className="object-cover opacity-40"
            priority
          />
        </div>
        
        {/* Floating 3D Elements */}
        <div className="absolute top-20 left-10 opacity-30 animate-float-slow">
          <Rocket className="h-16 w-16 text-orange-400" />
        </div>
        <div className="absolute bottom-1/4 left-70 opacity-30 animate-float-medium">
            <Image width={500} height={500} src={"https://res.cloudinary.com/dalpf8iip/image/upload/v1747118293/autodesk_revit-logo_brandlogos.net_4hpe4_ryowq8.png"} alt="Revit Logo" className="  h-20 w-20 object-contain" />
        </div>
        <div className="absolute bottom-1/4 right-16 opacity-30 animate-float-medium">
          <Award className="h-20 w-20 text-yellow-400" /> 

          <Image width={500} height={500} src={"https://res.cloudinary.com/dalpf8iip/image/upload/v1747118245/autocad-logo-69326D7728-seeklogo.com_xv5yc2.png"} alt="AutoCAD Logo" className=" absolute bottom-1/4 right-70 opacity-30 animate-float-medium h-20 w-20 object-contain" />
        
        </div>
        <div className="absolute top-1/3 right-1/4 opacity-30 animate-float-fast">
          <GraduationCap className="h-14 w-14 text-white" />
        </div>  
        <div className="absolute top-1/8 right-1/7 opacity-30 animate-float-fast">
          <Laptop className="h-14 w-14 text-red-400" />
        </div>  
        <div className="absolute top-1/2 left-20 opacity-30 animate-float-fast">
          <Pencil className="h-14 w-14 text-red-400" />
        </div>  
        <div className="absolute top-1/5 left-50 opacity-30 animate-float-fast">
          <Triangle className="h-14 w-14 text-blue-400" />
        </div>  
        <div className="absolute top-1/6 right-110 opacity-30 animate-float-fast">
          <FaPencilRuler className="h-14 w-14 text-blue-400" />
        </div>  
      

        

    
 
        <div className="container mx-auto px-4 relative z-10 text-center">
          {/* Logo and Badge with Animation */}
          <div className="flex justify-center mb-8">
            <div className="flex flex-col md:flex-row items-center gap-4 bg-black/70 backdrop-blur-md rounded-full px-6 py-3 border border-white/20 hover:border-orange-400/50 transition-all duration-300 hover:scale-105 cursor-pointer animate-pulse-slow">
              <Image 
                src="https://res.cloudinary.com/dalpf8iip/image/upload/v1747021761/images__8_-removebg-preview_mfgkas.png" 
                alt="Autodesk ATC" 
                width={1000} 
                height={600}
                className="h-14 w-auto hover:scale-110 transition-transform duration-300"
              />
              <Badge 
                variant="secondary" 
                className="text-lg py-1.5 px-4 bg-gradient-to-r from-orange-500 to-red-600 text-white hover:from-orange-600 hover:to-red-700 transition-all duration-300 shadow-lg"
              >
                Authorized Training Center
              </Badge>
            </div>
          </div>
          
          {/* Headings with Glowing Gradient Text */}
          <div className="max-w-5xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white leading-tight">
              <span className="bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent animate-text-glow">
                CADD CORE
              </span> <br />
              <span className="bg-gradient-to-r from-white via-blue-200 to-cyan-300 bg-clip-text text-transparent">
                Autodesk ATC® Certified Training
              </span>
            </h1>
            
            <p className="text-xl md:text-xl mb-10 text-white/90 leading-relaxed bg-black/30 backdrop-blur-sm rounded-lg py-4 px-6 border border-white/10 hover:border-orange-400/30 transition-all duration-300">
              Bangladesh's Premier Autodesk Authorized Center for <span className="font-semibold text-orange-300">Revit®</span>, <span className="font-semibold text-cyan-300">AutoCAD®</span>, and <span className="font-semibold text-yellow-300">BIM Certification</span>
            </p>
          </div>
          
          {/* Animated Buttons with Hover Effects */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="relative overflow-hidden group bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white font-bold px-10 py-7 text-lg transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-orange-500/40"
            >
              <span className="relative z-10 flex items-center gap-2">
                Explore Courses <Rocket className="h-5 w-5 group-hover:animate-bounce" />
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-orange-500 to-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="relative overflow-hidden group bg-black text-white border-white/40 hover:border-white/80 font-bold px-10 py-7 text-lg transition-all duration-300 hover:scale-105 backdrop-blur-sm hover:bg-white/10"
            >
              <span className="relative z-10 flex items-center gap-2">
                Speak to an Advisor <GraduationCap className="h-5 w-5 group-hover:animate-wiggle" />
              </span>
              <span className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            </Button>
          </div>

          {/* Animated Trust Indicators */}
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto mb-5">
            {[
              { text: "Autodesk Certified Instructors", icon: CheckCircle },
              { text: "Official Course Materials", icon: CheckCircle },
              { text: "Industry-Recognized Certification", icon: CheckCircle }
            ].map((item, index) => (
              <div 
                key={index}
                className="flex  items-center gap- gap-1 p-2 bg-black/30 backdrop-blur-sm rounded-xl border border-white/10 hover:border-orange-400/50 transition-all duration-300 hover:scale-105 cursor-default"
              >
                <item.icon className="h-8 w-8 text-green-400 animate-pulse" />
                <span className="text-white/90 font-medium">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Floating Arrow with Glow */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce-slow">
          <div className="relative">
            <ChevronDown className="h-10 w-10 text-white/90 drop-shadow-glow" />
            <div className="absolute inset-0 rounded-full bg-white/20 animate-ping-slow"></div>
          </div>
        </div>
      </section>
    </div>
  );
}