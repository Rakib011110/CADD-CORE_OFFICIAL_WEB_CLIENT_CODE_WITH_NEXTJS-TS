export const metadata = {
  title: "CADD CORE Training Institute Location | Visit Us in Dhaka",
  description: "Find our AutoCAD training center location in Dhaka. Visit CADD CORE for professional CAD courses, certifications, and hands-on training in Uttara, Dhaka.",
  keywords: [
    // Location-Specific Keywords
    "AutoCAD training center location Dhaka",
    "top training center location Dhaka",
    "training center location Dhaka",
    "CADD CORE institute address",
    "AutoCAD course in Uttara",
    "Visit CADD CORE Dhaka",
    "Best AutoCAD training institute near me",
    "AutoCAD classes in Dhaka map",
    "CADD CORE farmgate branch",
    
    // Branded + Local SEO
    "CADD CORE Training Institute location",
    "Where to learn AutoCAD in Bangladesh",
    "AutoCAD training center near Uttara",
    "Professional IT institute in Dhaka",

    // Supporting Keywords
    "AutoCAD course with certificate location",
    "Advanced AutoCAD training center address",
    "Free CAD demo class Dhaka", 
     // Bengali Location Keywords
    "অটোক্যাড ট্রেনিং সেন্টার ফার্মগেট",
    "ক্যাড কোর ঢাকা লোকেশন",
    "বায়তুশ শরফ কমপ্লেক্স অটোক্যাড কোর্স",
    "এয়ারপোর্ট রোডে সিএডি ট্রেনিং",
  ],
  openGraph: {
    title: "CADD CORE Location | Farmgate, Dhaka | AutoCAD/BIM Training Center",
    description: "Map: 149/A, Baitush Sharaf Complex (2nd Floor), Airport Road, Farmgate, Dhaka-1215. Join certified AutoCAD, Revit & 3D Design courses.",
     url: "www.caddcore.net/locations",
    images: [
      {
        url: "https://www.caddcore.net/map-preview.jpg", // Add a map preview image
        alt: "CADD CORE Training Institute Location in Dhaka",
      },
    ],
  },
};

export default function OurLocations() {
  return (
    <div>
      {/* Title with keyword-rich text */}
      <div className="text-2xl font-bold text-center mb-8 mt-14">
        <h1>আমাদের সাথে সরাসরি দেখা করুন</h1>
        <p className="text-lg mt-2 text-gray-600">প্রফেশনাল AutoCAD ট্রেনিং সেন্টার, ফার্মগেট , ঢাকা</p>
      </div>

      {/* Map with SEO-friendly attributes */}
      <div className="w-full h-56 md:h-96"> {/* Increased height for better visibility */}
        <iframe
          loading="lazy"
          src="https://maps.google.com/maps?q=CADD%20CORE%20Training%20Institue&amp;t=m&amp;z=14&amp;output=embed&amp;iwloc=near"
          title="CADD CORE Training Institute Location in Uttara, Dhaka"
          aria-label="AutoCAD Training Center in Dhaka - CADD CORE Map"
          className="w-full h-full rounded-md shadow-lg border-0"
        />
      </div>

    
    </div>
  );
}