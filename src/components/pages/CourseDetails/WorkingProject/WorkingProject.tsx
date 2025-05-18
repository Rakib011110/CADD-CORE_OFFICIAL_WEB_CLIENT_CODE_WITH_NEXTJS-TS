// components/Course/Certificate.tsx
import React from "react";
import Image from "next/image";
import { TCourse } from "@/lib/courses";

const WorkingProject = ({ course }: { course: TCourse }) => {
  const projects = course?.learningProject;

  
  if (!projects || projects.length === 0) return null;

  return (
    <div className="">
      <div className="max-w-6xl mx-auto py-10 px-4"> 
<div>



</div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <div
              key={index}
              className="bg-white rounded-xl overflow-hidden  p-4"
            >
              {project?.title && (
                <h3 className="text-lg font-bold mb-2 text-center">
                  {project.title}
                </h3>
              )}

              {project?.photoUrl && (
                <Image
                  src={project.photoUrl}
                  alt={project.title || `Project ${index + 1}`}
                  width={1000}
                  height={800}
                  className="w-full h-auto object-cover  border-red-500 border-2 rounded-md"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WorkingProject;
