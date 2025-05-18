import { TCourse } from "@/lib/courses";

export default function ExpertPanel({ course }: { course: TCourse }) {
  const advisors = course?.expertPanel?.advisors || [];
  const teachers = course?.expertPanel?.teachers || [];

  if (advisors.length === 0 && teachers.length === 0) return null;

  const renderPanelSection = (
    title: string,
    description: string,
    members: { name: string; title?: string; role?: string; photoUrl: string }[]
  ) => (
    <div className="mt-12">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
          {title}
        </h2>
        <div className="flex justify-center mb-6">
          <span className="inline-block w-24 h-1 bg-red-500 rounded"></span>
        </div>
        <p className="text-gray-600">{description}</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {members.map((member, idx) => (
          <div
            key={idx}
            className="relative group overflow-hidden rounded-lg shadow-lg transition-transform transform hover:scale-105"
          >
            {member.photoUrl ? (
              <img
                src={member.photoUrl}
                alt={member.name}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <div className="">
              {""}
              </div>
            )}
            <div id="professional-support" className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/75 to-transparent text-white p-4 rounded-b-lg">
              <h3 className="font-bold text-lg">{member.name}</h3>
              <p className="text-sm opacity-90">
                {member.title || member.role || ""}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      {advisors.length > 0 &&
        renderPanelSection(
          "অ্যাডভাইজর",
          "কোর্স পরিচালনায় নিযুক্ত আমাদের বিশিষ্ট অ্যাডভাইজরদের সঙ্গে পরিচিত হোন",
          advisors
        )}

      {teachers.length > 0 &&
        renderPanelSection(
          "কোর্স টিচার্স প্যানেল",
          "প্রফেশনাল সাপোর্ট ইঞ্জিনিয়ার্স এবং ইনস্ট্রাক্টর",
          teachers
        )}
    </section>
  );
}
