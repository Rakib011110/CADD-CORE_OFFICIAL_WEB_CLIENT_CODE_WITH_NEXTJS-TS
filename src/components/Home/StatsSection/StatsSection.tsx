export default function StatsSection() {
  const stats = [
    {
      icon: "https://res.cloudinary.com/dbkwiwoll/image/upload/v1741243187/01-01-01-2048x2048_bevo66.png",
      text: "12000+",
      label: "Graduate Students",
      color: "from-red-200 to-red-600"
    },
    {
      icon: "https://res.cloudinary.com/dbkwiwoll/image/upload/v1741243340/04-01-01-2048x2048_h9jtlc.png",
      text: "15+",
      label: "Certified Instructors", 
      color: "from-red-600 to-red-200"
    },
    {
      icon: "https://res.cloudinary.com/dbkwiwoll/image/upload/v1741243396/03-01-01-2048x2048_pt0xdi.png",
      text: "10+",
      label: "Departmental Courses",
      color: "from-red-600 to-red-200"
    },
    {
      icon: "https://res.cloudinary.com/dbkwiwoll/image/upload/v1741243544/02-01-01-2048x2048_hpynr8.png",
      text: "100%",
      label: "Practical Learning",
      color: "from-red-600 to-red-200"
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((item, index) => (
            <div 
              key={index}
              className={`bg-gradient-to-br ${item.color} rounded-2xl p-1 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2`}
            >
              <div className="bg-white rounded-xl  h-full flex flex-col items-center text-center">
                <div className="mb-2 p-1 rounded-full bg-opacity-50 ">
                  <img 
                    src={item.icon} 
                    alt="icon" 
                    className="w-20 h-20 border-b-4 border-gray-200 rounded-md object-contain"
                  />
                </div>
                <h3 className="text-4xl text-red-500 font-bold  bg-gradient-to-br ${item.color} mb-2">
                  {item.text}
                </h3>
                <p className="text-lg mb-1 font-semibold text-gray-700">{item.label}</p>
                <div className=" w-16 h-1 rounded-full bg-gradient-to-r ${item.color}"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Animated floating elements for decoration */}
        <div className="hidden lg:block ">
          <div className="absolute left-1/4 -mt-8 w-8 h-8 rounded-full bg-blue-300 opacity-20 animate-float"></div>
          <div className="absolute right-1/3 mt-16 w-12 h-12 rounded-full bg-purple-300 opacity-20 animate-float-delay"></div>
          <div className="absolute left-1/3 mt-32 w-10 h-10 rounded-full bg-indigo-300 opacity-20 animate-float-delay-2"></div>
        </div>
      </div>

      {/* Add this to your global CSS */}
     
    </section>
  );
}