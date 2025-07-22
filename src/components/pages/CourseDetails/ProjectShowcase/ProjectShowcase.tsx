import type { NextPage } from 'next';
import { ProjectCard } from './ProjectCard';

// --- Type Definition ---
// Defines the data structure for a single project.
export interface Project {
  id: number;
  title: string;
  category: string;
  images: string[];
}

// --- Mock Data ---
// An array of project data to populate the showcase.
// This would typically come from a CMS or an API call.
export const projects: Project[] = [
  {
    id: 1,
    title: 'Metropolis Tower',
    category: 'Structural Engineering',
    images: [
      'https://caddcentre.com/blog/wp-content/uploads/2019/11/1348832081_Fotolia_1360570_Subscription_L.jpg',
      'https://img-c.udemycdn.com/course/750x422/4268594_a634.jpg',
      'https://www.ny-engineers.com/hubfs/autocad%20and%20revit.jpg',
      'https://govdesignhub.com/wp-content/uploads/2018/10/shutterstock_273964568-770x770.jpg',
    ],
  },
  {
    id: 2,
    title: 'Aethelred Bridge',
    category: 'Civil Engineering',
    images: [
      'https://f.hubspotusercontent10.net/hubfs/2004318/autocad%20and%20revit.jpg',
      'https://govdesignhub.com/wp-content/uploads/2018/10/shutterstock_273964568-770x770.jpg',
      'https://5.imimg.com/data5/SELLER/Default/2024/2/384501874/OA/RJ/QQ/12552341/autocad-civil-drawing-500x500.jpg',
      'https://placehold.co/600x400/bfbfbf/000000?text=Foundation+Detail',
    ],
  },
  {
    id: 3,
    title: 'Residential Complex "Oasis"',
    category: 'Architectural Design',
    images: [
      'https://placehold.co/600x400/1a1a1a/ffffff?text=Aerial+Render',
      'https://placehold.co/600x400/4a4a4a/ffffff?text=Unit+Layout',
      'https://placehold.co/600x400/808080/ffffff?text=Landscape+Plan',
      'https://placehold.co/600x400/bfbfbf/000000?text=Interior+Concept',
    ],
  },
  {
    id: 4,
    title: 'Industrial Manufacturing Plant',
    category: 'Mechanical & Electrical',
    images: [
      'https://placehold.co/600x400/1a1a1a/ffffff?text=Main+Assembly+Line',
      'https://placehold.co/600x400/4a4a4a/ffffff?text=HVAC+Schematic',
      'https://placehold.co/600x400/808080/ffffff?text=Piping+Isometrics',
      'https://placehold.co/600x400/bfbfbf/000000?text=Electrical+Layout',
    ],
  },
];



// --- Main Component: ProjectShowcase ---
// This is the primary, exportable component that displays the entire showcase.
const ProjectShowcase: NextPage = () => {
  return (
    <div className="bg-white min-h-screen mb-10 font-sans">
      <div className="max-w-7xl mx-auto p-4 sm:p-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl uppercase sm:text-5xl font-extrabold tracking-tight mb-2 text-gray-950">
            Project <span className="text-red-600">Showcase</span>
          </h1>
          <p className="text-gray-600 text-lg">
            A curated collection of our latest engineering and architectural designs.
          </p>
        </header>
        <main className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </main>
        
       
      </div>
    </div>
  );
};

export default ProjectShowcase;
