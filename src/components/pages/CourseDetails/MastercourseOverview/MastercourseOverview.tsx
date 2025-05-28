import { TCourse } from "@/lib/courses";

export default function MastercourseOverview({ course }: { course: TCourse }) {
  const videoUrl = course?.overview?.videoUrl;

  return (
    <section    id="mastercourse-overview" className="bg-white py-10 px-4 mt-10">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left Column: Heading + Paragraphs */}
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4 relative inline-block">
              মাস্টারকোর্স ওভারভিউ
              <span className="absolute -bottom-1 left-0 w-32 h-1 bg-red-500"></span>
            </h2>

            <p className="text-gray-700 text-justify leading-relaxed mb-4">
              {course?.overview?.overviewDescription}
            </p>
          </div>

          {/* Right Column: Embedded Video */}
          {videoUrl ? (
            <div className="w-full aspect-video rounded-md overflow-hidden border-4 border-red-500 " >
              <iframe
                width="560"
                height="315"
                src={videoUrl}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              ></iframe>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
