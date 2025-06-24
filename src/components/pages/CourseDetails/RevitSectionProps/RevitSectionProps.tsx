import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Building2, DraftingCompass, LayoutTemplate, Lightbulb, Rocket } from 'lucide-react';
import Image from 'next/image';

const WhyLearnRevit = () => {
  const features = [
    {
      icon: <Building2 size={24} />,
      title: "BIM Platform",
      description: "Not just modeling software - a complete Building Information Modeling ecosystem"
    },
    {
      icon: <LayoutTemplate size={24} />,
      title: "Project Lifecycle",
      description: "Manage entire projects from start to finish within a unified environment"
    },
    {
      icon: <Rocket size={24} />,
      title: "Industry Standard",
      description: "Revit proficiency is now a necessity, not just an advantage"
    }
  ];

 const progression = [
    { 
      name: "Hand Drafting", 
      icon: <DraftingCompass className="text-amber-500" size={20} />,
      description: "Traditional manual design methods",
      people: "100 people required",
      imageUrl: "https://res.cloudinary.com/dalpf8iip/image/upload/v1750237555/office-life-before-the-invention-of-autocad-and-other-_mx9vvi.webp"
    },
    { 
      name: "AutoCAD", 
      icon: <BookOpen className="text-red-500" size={20} />,
      description: "2D digital drafting revolution",
      people: "10 people required",
      imageUrl: "https://res.cloudinary.com/dalpf8iip/image/upload/v1750239308/Employees-working-in-open-office_qy3qu1.webp"
    },
    { 
      name: "Revit BIM", 
      icon: <Lightbulb className="text-emerald-500" size={20} />,
      description: "Intelligent 3D modeling with data integration",
      people: "1 person required",
      imageUrl: "https://res.cloudinary.com/dalpf8iip/image/upload/v1750239749/happy-professional-man-desk-with-phone-computer_bpjw9i.jpg"
    }
  ];
  return (
    <section className="py-16 px-4 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-2 flex items-center gap-2">
              <div className="w-12 h-1 bg-red-600 rounded-full"></div>
              <span className="text-sm font-medium text-blue-600 uppercase tracking-wider">
                Professional Development
              </span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Why <span className="text-red-600">Revit</span> Proficiency is Essential
            </h2>
            
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              Revit is not simply modeling software - it's a comprehensive BIM (Building Information Modeling) platform 
              where projects are initiated, managed, and completed. It integrates all project data into a unified 
              building information model.
            </p>
            
            <div className="bg-blue-50 border-l-4 border-red-600 p-4 rounded-r-lg mb-8">
              <p className="text-lg font-medium text-gray-900 italic">
                "Revit proficiency is no longer a benefit but rather a necessity in today's industry."
              </p>
            </div>
            
            <p className="text-gray-700 mb-8 leading-relaxed">
              What makes Revit powerful is how it trains you to think in terms of building elements. This approach 
              transforms you into a more effective architect or engineer. While creating aesthetically pleasing designs 
              is important, true value comes from constructible solutions using available elements.
            </p>
            
            <div className="space-y-6">
              {features.map((feature, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex items-start gap-4"
                >
                  <div className="mt-1 p-2 bg-blue-100 text-blue-600 rounded-lg">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
                    <p className="text-gray-700">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Column - Progression */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-2xl shadow- p-8 border border-gray-100"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-2">The Evolution of Design Technology</h3>
            <p className="text-gray-600 mb-10">How architectural tools have transformed professional workflows</p>
            
         <div className="relative py-8">
  {/* Progression line */}
  <div className="absolute top-1/2 left-4   border-2 right-4 h-1 bg-gradient-to-r from-amber-400 via-blue-400 to-emerald-400 transform -translate-y-1/2 z-0 hidden md:block"></div>
  
  <div className="grid  grid-cols-1 md:grid-cols-3 gap-2  relative z-10">
    {progression.map((item, index) => (
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: index * 0.1 }}
        className="flex flex-col items-center"
      >
        {/* Image comparison container */}
        <div className="relative w-full border-red-500 h-48 rounded-xl overflow-hidden shadow-lg mb-5 border ">
          <Image
            src={item.imageUrl} // Add imageUrl to your progression objects
            alt={`${item.name} example`}
            fill
            className="object-cover"
            quality={100}
          />
          <div className="absolute "></div>
          
          {/* Technology label */}
          <div className="absolute text-gray-800 backdrop-blur-sm top-1 right-3  px-3 py-1 rounded-full text-sm ">
            {item.people}
          </div>
          
          {/* Step indicator */}
         
        </div>
        
        {/* Content */}
        <div className="text-center ">
          <div className="flex items-center justify-center mb-1">
            <div className="p- bg-gray-100 rounded-full">
              {item.icon}
            </div>
            <h4 className="text-xl font-bold text-gray-900 ml-3">
              {item.name}
            </h4>
          </div>
          <p className="text-gray-600 ">{item.description}</p>
        </div>
        
        {/* Connector arrow (mobile only) */}
        {index < progression.length - 1 && (
          <div className="md:hidden my-6 text-gray-300 border ">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        )}
      </motion.div>
    ))}
  </div>
  
  {/* Progression labels */}
  <div className="hidden md:flex justify-between px-4 ">
    <span className="text-sm font-medium text-amber-600">Traditional</span>
    <span className="text-sm font-medium text-blue-600">Transition</span>
    <span className="text-sm font-medium text-emerald-600">Modern BIM</span>
  </div>
</div>
            <div className="mt-12 p-6 bg-gradient-to-r from-red-600 to-red-700 rounded-xl text-white">
              <h3 className="text-xl font-bold mb-2">Master Revit with Industry Professionals</h3>
              <p className="mb-4 opacity-90">
                Develop complete understanding to become more powerful, creative and efficient in today's fast-paced AEC industry.
              </p>
              <button className="px-5 py-2.5 bg-white text-red-700 font-medium rounded-lg hover:bg-gray-100 transition-colors shadow-md">
                Explore Revit Courses
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default WhyLearnRevit;