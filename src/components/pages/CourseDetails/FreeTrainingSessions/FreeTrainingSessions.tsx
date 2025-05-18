import React from "react"
import { Card, CardContent } from "@/components/UI/card"
import { motion } from "framer-motion"
import { TCourse } from "@/lib/courses"

const FreeTrainingSessions = ({ course }: { course: TCourse }) => {
  if (!course?.freeTrainingSessions?.length) return null

  return (
  <div>
     <div className=" max-w-6xl mx-auto text-center mt-10">
     <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
          <span className=""> 
            
            {course.title} <br />
            রিলেটেড প্রয়োজনীয় ফ্রি ভিডিও</span>
          <div className="flex justify-center mb-6">
        <span className="inline-block w-52 h-1 bg-red-500 rounded"></span>
      </div>
        </h2>
     </div>
      <div className="grid max-w-6xl mx-auto grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-10">
     
    
     
     {course.freeTrainingSessions.map((session, idx) => (
       session.videoUrl ? (
         <motion.div
           key={idx}
           initial={{ opacity: 0, y: 40 }}
           whileInView={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.5, delay: idx * 0.1 }}
           viewport={{ once: true }}
         >
           <Card className="overflow-hidden shadow-md rounded-2xl">
             <CardContent className="p-0">
               <div className="aspect-video">
                 <iframe
                   src={session.videoUrl}
                   title={`Free Training Session ${idx + 1}`}
                   frameBorder="0"
                   allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                   allowFullScreen
                   className="w-full h-full"
                 ></iframe>
               </div>
             </CardContent>
           </Card>
         </motion.div>
       ) : null
     ))}
   </div>
  </div>
  )
}

export default FreeTrainingSessions
