import { useEffect, useState } from 'react';

export default function StatsSection() {
  const stats = [
    {
      icon: "https://res.cloudinary.com/dbkwiwoll/image/upload/v1741243187/01-01-01-2048x2048_bevo66.png",
      number: 12000, // Changed to number
      label: "Graduate Students",
      color: "from-gray-700 to-red-950",
      duration: 2000 // Animation duration in ms
    },
    {
      icon: "https://res.cloudinary.com/dbkwiwoll/image/upload/v1741243340/04-01-01-2048x2048_h9jtlc.png",
      number: 15, // Changed to number
      label: "Certified Instructors", 
      color: "from-[#F01A24] to-[#F01A24]",
      duration: 1500
    },
    {
      icon: "https://res.cloudinary.com/dbkwiwoll/image/upload/v1741243396/03-01-01-2048x2048_pt0xdi.png",
      number: 10, // Changed to number
      label: "Departmental Courses",
           color: "from-[#F01A24] to-[#F01A24]",

      duration: 1000
    },
    {
      icon: "https://res.cloudinary.com/dbkwiwoll/image/upload/v1741243544/02-01-01-2048x2048_hpynr8.png",
      number: 100, // Changed to number (we'll handle the % separately)
      label: "Practical Learning",
          color: "from-gray-700 to-red-950",

      duration: 1000
    },
  ];

  // State for animated values
  const [animatedValues, setAnimatedValues] = useState<number[]>(stats.map(() => 0));

  useEffect(() => {
    // Only animate when component mounts
    const animationDuration = Math.max(...stats.map(stat => stat.duration));
    let startTime: number | null = null;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;

      const newValues = stats.map((stat, index) => {
        if (elapsed >= stat.duration) return stat.number;
        const progress = Math.min(elapsed / stat.duration, 1);
        return Math.floor(progress * stat.number);
      });

      setAnimatedValues(newValues);

      if (elapsed < animationDuration) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, []);

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((item, index) => (
            <div 
              key={index}
              className={`bg-gradient-to-br ${item.color} rounded-2xl p-1 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2`}
            >
              <div className="bg-white rounded-xl h-full flex flex-col items-center text-center p-6">
                <div className="mb-4 p-1 rounded-full bg-opacity-50">
                  <img 
                    src={item.icon} 
                    alt="icon" 
                    className="w-20 h-20 border-b-4 border-gray-200 rounded-md object-contain"
                  />
                </div>
                <h3 className="text-4xl text-red-500 font-bold mb-2">
                  {/* Special case for percentage */}
                  {item.label === "Practical Learning" 
                    ? `${animatedValues[index]}%` 
                    : animatedValues[index].toLocaleString()}
                  {item.label === "Graduate Students" && '+'}
                </h3>
                <p className="text-lg mb-3 font-semibold text-gray-700">{item.label}</p>
                <div className={`w-16 h-1 rounded-full bg-gradient-to-r ${item.color}`}></div>
              </div>
            </div>
          ))}
        </div>

        {/* Animated floating elements for decoration */}
        <div className="hidden lg:block">
          <div className="absolute left-1/4 -mt-8 w-8 h-8 rounded-full bg-blue-300 opacity-20 animate-float"></div>
          <div className="absolute right-1/3 mt-16 w-12 h-12 rounded-full bg-purple-300 opacity-20 animate-float-delay"></div>
          <div className="absolute left-1/3 mt-32 w-10 h-10 rounded-full bg-indigo-300 opacity-20 animate-float-delay-2"></div>
        </div>
      </div>

      {/* Add this to your global CSS or in a style tag */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-delay { animation: float 6s ease-in-out infinite 2s; }
        .animate-float-delay-2 { animation: float 6s ease-in-out infinite 4s; }
      `}</style>
    </section>
  );
}