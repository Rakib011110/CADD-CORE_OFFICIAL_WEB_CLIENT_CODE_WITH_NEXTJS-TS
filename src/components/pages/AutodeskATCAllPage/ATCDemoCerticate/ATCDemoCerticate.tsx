import Image from "next/image";

const certificates = [
  {
    title: "Revit Professional",
    issuer: "Issued by Autodesk",
    image:
      "https://res.cloudinary.com/dbkwiwoll/image/upload/v1745139274/cadd-core/Autodesk_Certified_User_AutoCAD-2_yld6mq_lf9ecp.webp",
  },
  {
    title: "AutoCAD Specialist",
    issuer: "Issued by Autodesk",
    image:
      "https://res.cloudinary.com/dbkwiwoll/image/upload/v1744278616/Autodesk_Certified_Professional-certificates_ifqr0p.jpg",
  },
];



export default function ATCDemoCerticate() {
  return (
    <section className="py-10 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            <span className="bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent">
              Industry-Recognized Certifications
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Earn certifications that validate your expertise to employers worldwide.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          {certificates.map((cert, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              <div className="relative aspect-[4/3] bg-gray-50">
                <Image
                  src={cert.image}
                  alt={cert.title}
                  fill
                  className="object-contain p-6"
                  quality={100}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <div className="text-white transform translate-y-6 group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="text-xl font-semibold">{cert.title}</h3>
                    <p className="text-blue-200 text-sm">{cert.issuer}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* <div className="text-center mt-16">
          <Button className="bg-gradient-to-r from-blue-600 to-orange-500 text-white px-8 py-3 text-lg font-medium rounded-xl shadow-md hover:shadow-lg transition-all">
            View All Certification Programs
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
        </div> */}
      </div>
    </section>
  );
}
