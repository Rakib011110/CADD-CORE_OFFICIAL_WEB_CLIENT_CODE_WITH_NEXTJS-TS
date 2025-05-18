import Link from "next/link";
import DetailsHeadNav from "../../CourseDetails/DetailsHeadNav/DetailsHeadNav";
import Image from "next/image";
import IndustrialTrainingNav from "../IndrustrialNav/IndrustrialNav";

export default function IndrustrialBanner() {
  return (
    <section className="max-w-6xl mx-auto px-4  py-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* 🧭 Navbar (1/4) */}
        <div className="md:w-1/4 order-2 md:order-1">
          <IndustrialTrainingNav />
        </div>

        {/* 🖼️ Image (3/4) */}
        <div className="md:w-3/4 order-1 md:order-2 flex items-start">
          <div className="w-full rounded overflow-hidden shadow-sm">
            <Image
              height={500} // Height kept fixed
              width={900}
              src="https://res.cloudinary.com/dalpf8iip/image/upload/v1747283567/industrial-attachment-training-banner_o2nue4.png"
              alt="industrial-image"
              className="w-full  object-cover rounded"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
