import { Card } from "@/components/UI/card";
import Marquee from "react-fast-marquee";

export default function ReviewsAboutUs() {
  const testimonials = [
    {
      name: "Meeraj Ebrahim",
      roles: ["Trainee", "Graphic Design Mastercourse"],
      testimonial:
        "আলহামদুলিল্লাহ্ Caddcore training institute এর Graphic Design Mastercourse টি খুব ভালো ছিল। আমি অনেক কিছু শিখেছি।",
      photoUrl:
        "https://res.cloudinary.com/dbkwiwoll/image/upload/v1744105660/Screenshot-2024-10-19-121434-768x768_ybjq9n.png",
    },
    {
      name: "Mahmodul Hasan Sifat",
      roles: ["Mastercourse Student", "Professional Graphics & Video Editor"],
      testimonial:
        "আলহামদুলিল্লাহ Caddcore training institute এর professional graphics design mastercourse টি আমাকে অনেক কিছু শিখিয়েছে।",
      photoUrl:
        "https://res.cloudinary.com/dbkwiwoll/image/upload/v1744105005/Mahmodul-Hasan-Sifat-600x600_nsheyu.jpg",
    },
    {
      name: "নয়ম পাঠানজুলা",
      roles: ["Mastercourse Student", "RCC Building Structural Analysis"],
      testimonial:
        "It is a great initiative of giving a hand so that engineers can develop their skills in a proficient way. In BANGLADESH, engineers are falling behind due to lack of practical knowledge as well as a gap between software knowledge & theoretical knowledge. CADD Core is the bridge between these gaps. I wish all of them best.",
      photoUrl:
        "https://cdn-ilbhfhh.nitrocdn.com/GQAjASDcQJAOSFnCNbjHAwgJDnuIafbo/assets/images/optimized/rev-f913869/caddcore.net/wp-content/uploads/2023/04/327461195_958221191816264_6894653249626631661_n.jpg",
    },
    {
      name: "Mahmodul Hasan Sifat",
      roles: ["Mastercourse Student", "Professional Graphics & Video Editor"],
      testimonial:
        "আলহামদুলিল্লাহ Caddcore training institute এর professional graphics design mastercourse টি আমাকে অনেক কিছু শিখিয়েছে।",
      photoUrl:
        "https://res.cloudinary.com/dbkwiwoll/image/upload/v1744105005/Mahmodul-Hasan-Sifat-600x600_nsheyu.jpg",
    },
  ];

  return (
    <div className="py-10">
      <Marquee pauseOnHover={true} gradient={false}>
        <div className="flex space-x-4">
          {testimonials.map((item, index) => (
            <div key={index} className="flex-shrink-0 w-96 p-2">
              <Card className="h-full rounded-md shadow-md bg-[#dcd8c755]">
                <div className="p-4 min-h-[300px] flex flex-col">
                  <div className="flex items-start gap-3">
                    <img
                      src={item.photoUrl}
                      alt={item.name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-white shadow"
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {item.name}
                      </h3>
                      {item.roles.map((role, idx) => (
                        <p
                          key={idx}
                          className={`text-sm ${
                            idx === 0
                              ? "text-red-500 font-medium"
                              : "text-gray-600"
                          }`}
                        >
                          {role}
                        </p>
                      ))}
                    </div>
                  </div>
                  <p className="mt-3 text-gray-700 leading-relaxed">
                    {item.testimonial}
                  </p>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </Marquee>
    </div>
  );
}
