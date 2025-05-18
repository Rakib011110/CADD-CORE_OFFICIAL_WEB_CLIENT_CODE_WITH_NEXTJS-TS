import { Button } from "@/components/UI/button";
import { BookOpen, Clock, Laptop, ClipboardCheck, Trophy, CheckCircle, Star } from "lucide-react";

const learningModules = [
  {
    title: "AutoCAD Specialization",
    icon: "https://res.cloudinary.com/dalpf8iip/image/upload/v1747118245/autocad-logo-69326D7728-seeklogo.com_xv5yc2.png",
    competencies: [
      "Advanced 2D Drafting & Annotation",
      "3D Modeling & Visualization",
      "Dynamic Blocks & Attributes",
    ],
    advanced: ["Sheet Set Manager", "Parametric Constraints", "AutoLISP Customization"],
  },
  {
    title: "Revit Expertise",
    icon: "https://res.cloudinary.com/dalpf8iip/image/upload/v1747118293/autodesk_revit-logo_brandlogos.net_4hpe4_ryowq8.png",
    competencies: [
      "Parametric Family Creation",
      "MEP Systems Coordination",
      "Construction Documentation",
    ],
    advanced: ["Phasing & Design Options", "Energy Optimization", "BIM 360 Integration"],
  },
  {
    title: "Civil 3D Mastery",
    icon: "https://res.cloudinary.com/dalpf8iip/image/upload/v1747118383/civil-3d_gajoak.jpg",
    competencies: [
      "Corridor Modeling",
      "Grading & Earthwork",
      "Pipe Network Design",
    ],
    advanced: ["Quantity Takeoff", "Stormwater Analysis", "Geotechnical Modeling"],
  },
  // {
  //   title: "Fusion 360",
  //   icon: "/fusion360-logo.png",
  //   competencies: [
  //     "Parametric Modeling",
  //     "Simulation & Generative Design",
  //     "CAM Workflow Integration",
  //   ],
  //   advanced: ["Cloud Collaboration", "Sculpting Tools", "Electronics Design"],
  // },
  // {
  //   title: "3ds Max for Architecture",
  //   icon: "/3dsmax-logo.png",
  //   competencies: [
  //     "Lighting and Rendering",
  //     "Architectural Visualization",
  //     "Material Texturing",
  //   ],
  //   advanced: ["Arnold Renderer", "Animation Tools", "VR Integration"],
  // },
  // {
  //   title: "Maya for Visualization",
  //   icon: "/maya-logo.png",
  //   competencies: [
  //     "Realistic Animation",
  //     "Rigging & Character Setup",
  //     "Scene Layouts",
  //   ],
  //   advanced: ["XGen Hair & Fur", "Dynamics & FX", "Game Engine Export"],
  // },
];

const certificationSteps = [
  {
    title: "Step 1: Software Mastery Training",
    duration: "6-8 Weeks",
    description:
      "Complete guided training paths with Autodesk-certified instructors and learning resources.",
  },
  {
    title: "Step 2: Hands-on Projects",
    duration: "2 Weeks",
    description:
      "Practice with real-world project assignments that mirror industry scenarios.",
  },
  {
    title: "Step 3: Skill Assessment Quizzes",
    duration: "1 Week",
    description:
      "Topic-wise interactive quizzes to evaluate concept retention and readiness.",
  },
  {
    title: "Step 4: Mock Certification Exams",
    duration: "1 Week",
    description:
      "Simulated exam environment with timing and structure similar to Autodesk official exams.",
  },
  {
    title: "Step 5: Final Autodesk Certification Exam",
    duration: "4 Hours",
    description:
      "Proctored online/offline Autodesk exam including both theoretical and practical components.",
  },
  {
    title: "Step 6: Credential Issuance & Portfolio Development",
    duration: "1 Week",
    description:
      "Receive your official Autodesk Certificate and guidance on showcasing your skills professionally.",
  },
];

const examStructure = [
  {
    type: "Written Exam",
    duration: "90 Minutes",
    content: [
      "Multiple choice questions",
      "Scenario-based challenges",
      "Theoretical software knowledge evaluation",
    ],
  },
  {
    type: "Practical Test",
    duration: "120 Minutes",
    content: [
      "Project-based software tasks",
      "Modeling & documentation",
      "Coordination challenges",
    ],
  },
  {
    type: "Portfolio Submission",
    duration: "48 Hours",
    content: [
      "Complete project deliverables",
      "Demonstrate mastery and innovation",
      "Meet real-world client specs",
    ],
  },
];

export default function AutodeskCertificationJourney() {
  return (
    <section className="py- bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            <span className="bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent">
              Autodesk Certification Journey
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Learn, practice, and validate your skills with Autodesk’s globally recognized certification track.
          </p>
        </div>

        {/* What You'll Learn From Us */}
        <div className="grid md:grid-cols-2 gap-12 mb-20">
          <div className="bg-gray-50 p-8 rounded-2xl">
            <div className="flex items-center mb-6">
              <BookOpen className="h-8 w-8 text-blue-600 mr-4" />
              <h3 className="text-2xl font-bold">What You’ll Learn from Us</h3>
            </div>
            <div className="space-y-6">
              {learningModules.map((module, i) => (
                <div key={i} className="bg-white p-6 rounded-xl shadow-sm">
                  <div className="flex items-center mb-4">
                    <img src={module.icon} className="h-8 w-8 mr-3" alt={module.title} />
                    <h4 className="font-semibold text-lg">{module.title}</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="text-sm font-medium mb-2 text-gray-600">Core Competencies:</h5>
                      <ul className="space-y-2">
                        {module.competencies.map((item, idx) => (
                          <li key={idx} className="flex items-center">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h5 className="text-sm font-medium mb-2 text-gray-600">Advanced Features:</h5>
                      <div className="flex flex-wrap gap-2">
                        {module.advanced.map((feature, idx) => (
                          <span key={idx} className="px-3 py-1 bg-gray-900 text-white rounded-full text-sm">
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Industry Standards */}
              <div className="bg-blue-50 p-6 rounded-xl">
                <h4 className="font-semibold mb-3 flex items-center">
                  <Star className="h-5 w-5 text-blue-600 mr-2" />
                  Industry-Standard Practices
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {["ISO 19650 Compliance", "COBie Standards", "IFC Integration", "LOD 400 Modeling"].map((item, idx) => (
                    <div key={idx} className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Certification Process */}
          <div className="relative pl-8 border-l-2 border-gray-200">
            <div className="absolute w-4 h-4 bg-black rounded-full -left-[9px] top-0"></div>
            <h3 className="text-2xl font-bold mb-8 flex items-center">
              <ClipboardCheck className="h-8 w-8 text-orange-500 mr-4" />
              Certification Process
            </h3>
            {certificationSteps.map((stage, index) => (
              <div key={index} className="relative mb-8 pl-6">
                <div className="absolute w-4 h-4 bg-black rounded-full -left-[13px] top-4"></div>
                <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-semibold">{stage.title}</h4>
                    <span className="text-sm bg-gray-100 px-3 py-1 rounded-full">
                      <Clock className="inline h-4 w-4 mr-1" />
                      {stage.duration}
                    </span>
                  </div>
                  <p className="text-gray-600">{stage.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Exam Structure */}
        <div className="bg-blue-50 rounded-2xl p-8">
          <div className="flex items-center mb-8">
            <Laptop className="h-8 w-8 text-blue-600 mr-4" />
            <h3 className="text-2xl font-bold">Exam Structure</h3>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {examStructure.map((section, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="font-semibold">{section.type}</h4>
                  <span className="text-sm bg-gray-900 text-gray-100 px-3 py-1 rounded-full">
                    {section.duration}
                  </span>
                </div>
                <ul className="space-y-2">
                  {section.content.map((item, i) => (
                    <li key={i} className="flex items-start text-gray-700">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        {/* <div className="text-center mt-16">
          <Button className="bg-gradient-to-r from-blue-600 to-orange-500 text-white px-10 py-4 text-lg font-semibold hover:shadow-lg transition-all">
            Start Your Certification Journey
            <Trophy className="h-5 w-5 ml-2 inline" />
          </Button>
        </div> */}
      </div>
    </section>
  );
}
