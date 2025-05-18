import { TCourse } from "@/lib/courses";
import Link from "next/link";

export default function BatchSchedule({course}: {course: TCourse}) { 
 
//  console.log("courseSec", course)
  const seminars = [
    {
      topic: "RCC Building Structural Analysis Design & Detailing Mastercourse",
      place: "ONLINE",
      date: "Friday, 7 March 2025",
      time: "10:00 AM - 11:30 AM",
      remainingDays: 5,
    },
   
    
    
  ];



  return (
    <section id="batch-schedule">
    <div  className="bg-[#eafcfe] py-10">
      <h2 className="text-center text-2xl font-bold text-gray-800 mb-1">
      পরবর্তী ব্যাচের সময়সূচী
      </h2>
      <div className="flex justify-center mb-6">
        <span className="inline-block w-24 h-1 bg-red-500 rounded"></span>
      </div>

      
      <div className="max-w-6xl mx-auto px-4">
        <div className="overflow-x-auto bg-white rounded-md ">
          <table className="w-full border-collapse text-left">
           
            <thead>
              <tr className="bg-red-500 text-white">
                <th className="py-2 px-4">Starting date</th>
                <th className="py-2 px-4">Place</th>
                <th className="py-2 px-4">Days</th>
                <th className="py-2 px-4">Time</th>
                <th className="py-2 px-4">Join</th>
                {/* <th className="py-2 px-4">Remaining Days</th> */}
              </tr>
            </thead>
            {/* Table Body */}
            <tbody>
              {seminars.map((seminar, index) => (
                <tr
                  key={index}
                  // Slightly different background color on even rows
                  className={`${
                    index % 2 === 0 ? "bg-[#fff1f1]" : "bg-white"
                  } hover:bg-red-50 transition-colors`}
                >
                  <td className="py-2 px-4 border-b border-red-200">
                    {course?.schedule.startingDate}
                  </td>
                  <td className="py-2 px-4 border-b border-red-200">
                    {course?.schedule?.mode}
                  </td>
                  <td className="py-2 px-4 border-b border-red-200">
                  {course?.schedule?.days}
                  </td>
                  <td className="py-2 px-4 border-b border-red-200">
                    {course?.schedule?.time}
                  </td>
                  <td className="py-2 px-4 border-b border-red-200">
                    <button className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition">
                  
                      <Link href={"https://docs.google.com/forms/d/e/1FAIpQLScZysZu-d44Md-KbsIPXOX-wuoobxWbcBaXN04ITkgWYNR6Fw/viewform"}>
                      Join 
                      </Link>
                    </button>
                  </td>
                  {/* <td className="py-2 px-4 border-b border-red-200">
                    {seminar.remainingDays}
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    </section>
  );
}