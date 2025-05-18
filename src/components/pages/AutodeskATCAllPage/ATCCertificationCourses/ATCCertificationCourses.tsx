import { Button } from "@/components/UI/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/UI/tabs";
import Image from "next/image";

const softwareCategories = [
  {
    id: "architecture",
    name: "Architecture ",
    software: [
      {
        name: "Revit",
        logo: "https://www.kindpng.com/picc/m/241-2412554_autodesk-revit-logo-png-transparent-png.png",
        description: "Master BIM for architectural design, documentation, and coordination.",
      },
      {
        name: "AutoCAD",
        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/AutoCad_new_logo.svg/2560px-AutoCad_new_logo.svg.png",
        description: "Industry-standard CAD software for 2D drafting and 3D design.",
      },
      {
        name: "Forma",
        logo: "https://cadpoints.com/wp-content/uploads/Untitled-1-e1695222024906.png",
        description: "AI-powered tools for conceptual design and sustainable analysis.",
      },
    ],
  },
  {
    id: "civil",
    name: "Civil Engineering",
    software: [
      {
        name: "Civil 3D",
        logo: "https://res.cloudinary.com/dalpf8iip/image/upload/v1747197808/IconCivil3DTransparent_qvjmhx.png",
        description: "Design and document civil infrastructure projects with precision.",
      },
      {
        name: "InfraWorks",
        logo: "https://res.cloudinary.com/dalpf8iip/image/upload/v1747197915/infraworks-logo-1024x279_ahyiyi.webp",
        description: "Plan, visualize, and analyze civil projects in context.",
      },
    ],
  },

{
    id: "Structural-Engineering",
    name: "Structural Engineering",
    software: [
      {
        name: "Revit",
        logo: "https://www.kindpng.com/picc/m/241-2412554_autodesk-revit-logo-png-transparent-png.png",
        description: "Master BIM for architectural design, documentation, and coordination.",
      },
      {
        name: "AutoCAD",
        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/AutoCad_new_logo.svg/2560px-AutoCad_new_logo.svg.png",
        description: "Industry-standard CAD software for 2D drafting and 3D design.",
      },
      {
        name: "Forma",
        logo: "https://cadpoints.com/wp-content/uploads/Untitled-1-e1695222024906.png",
        description: "AI-powered tools for conceptual design and sustainable analysis.",
      },
    ],
  },

  {
    id: "construction",
    name: "Construction",
    software: [
      {
        name: "Autodesk Docs",
        logo: "https://res.cloudinary.com/dalpf8iip/image/upload/v1747198063/images_rkirlf.png",
        description: "Centralized cloud document management for project collaboration.",
      },
      {
        name: "BIM 360",
        logo: "https://res.cloudinary.com/dalpf8iip/image/upload/v1747198175/Screen-Shot-2020-02-25-at-12.40.32_yvlrts.avif",
        description: "Manage construction projects with real-time data and workflows.",
      },
    ],
  },
];

export default function SoftwareCertification() {
  return (
    <section className="py-10 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            <span className="bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent">
              Professional Certification Courses
            </span>
          </h2> 
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Master industry-standard tools with our Autodesk-certified training.
          </p>
        </div>

        <Tabs defaultValue="architecture">
          <TabsList className="grid grid-cols-4 gap-3 w-full max-w-2xl mx-auto mb-12 bg-gray-100 p-2 h-auto">
            {softwareCategories.map((category) => (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className="py-4  data-[state=active]:bg-gray-900 data-[state=active]:text-white border-2 border-black"
              >
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {softwareCategories.map((category) => (
            <TabsContent key={category.id} value={category.id}>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {category.software.map((software) => (
                  <div
                    key={software.name}
                    className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                  >
                    <div className="p-6 bg-gradient-to-r from-blue-50 to-gray-50">
                      <div className="flex items-center justify-center h-24">
                        <Image
                          src={software.logo}
                          alt={software.name}
                          width={500}
                          height={80}
                          className="h-16 w-auto object-contain"
                        />
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-2">{software.name}</h3>
                      <p className="text-gray-600 mb-5">{software.description}</p>
                      <p className="text-sm text-gray-500 italic mb-6">
                        Explore our {software.name} courses and certifications.
                      </p>

                      <Button disabled className="w-full bg-gray-900 hover:bg-red-500">
                        View {software.name} Courses
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}
