import React, { useState } from 'react';
import { Project } from './ProjectShowcase';

// --- Sub-component: ProjectCard ---
// Renders a single project with the interactive vertical image stack.
export const ProjectCard = ({ project }: { project: Project }) => {
  // State to track the index of the hovered image. `null` means no image is hovered.
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="rounded-2xl overflow-hidden border border-gray-800/50 transition-all duration-300 hover:border-gray-500/80 hover:shadow-2xl hover:shadow-gray-900/40">
      <div className="p-6">
        {/* The image stack container. 
            `onMouseLeave` resets the hover state when the cursor leaves the entire container.
        */}
        <div 
          className="relative h-96 mb-6"
          onMouseLeave={() => setHoveredIndex(null)}
        >
          {project.images.map((src, index) => {
            let transform = `translateY(${index * 2}rem) scale(${1 - index * 0.05})`;
            let zIndex = 10 - index;

            if (hoveredIndex !== null) {
              if (index === hoveredIndex) {
                // The hovered card moves to the top, scales up, and gets the highest z-index.
                transform = 'translateY(0) scale(1.1)';
                zIndex = 20;
              } else {
                // Determine position for non-hovered cards.
                const isAbove = index < hoveredIndex;
                if (isAbove) {
                  // Cards above the hovered one tuck neatly behind it.
                  transform = `translateY(-${(hoveredIndex - index) * 1}rem) scale(0.9)`;
                  zIndex = 10 - (hoveredIndex - index); // Keep them in order behind
                } else {
                  // Cards below the hovered one move to a "discard pile" at the bottom.
                  transform = 'translateY(20rem) scale(0.8)';
                  zIndex = 5;
                }
              }
            }
            
            return (
              <div
                key={src + index}
                className="absolute left-0 w-full h-72 rounded-lg overflow-hidden cursor-pointer transition-all duration-500 ease-in-out transform-gpu shadow-2xl border-2 border-gray-700"
                style={{
                  transform,
                  zIndex,
                  // `will-change` is a performance optimization hint for the browser.
                  willChange: 'transform',
                }}
                onMouseEnter={() => setHoveredIndex(index)}
              >
                <img
                  src={src}
                  alt={`Project image ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://placehold.co/600x400/ff0000/ffffff?text=Error';
                  }}
                />
              </div>
            );
          })}
        </div>

        <h3 className="text-2xl font-bold text-white mb-1">{project.title}</h3>
        <p className="text-red-500 font-semibold mb-4">{project.category}</p>
        <p className="text-gray-400 text-sm leading-relaxed">
          Detailed design and structural analysis for a modern high-rise. View the gallery to see floor plans, 3D models, and facade details.
        </p>
      </div>
    </div>
  );
};

