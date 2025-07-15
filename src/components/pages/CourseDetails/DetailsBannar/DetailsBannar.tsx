"use client";
import { CheckCircle } from "lucide-react";
import DetailsHeadNav from "../DetailsHeadNav/DetailsHeadNav";
import { TCourse } from "@/lib/courses";
import Link from "next/link";
import { useUser } from "@/context/user.provider";
import { useRouter } from "next/navigation";
import { useInitiatePaymentMutation } from "@/redux/api/payment/paymentApi";
import PaymentButton from "../../Payments/PayementButton";
import EnrollModal from "../EnrollCourse/EnrollModal";
import { useState } from "react";
import SslcommerzPayment from "../SslcommerzPayment/SslcommerzPayment";


export default function DetailsBannar({ course }: { course: TCourse }) {
   
  const {user}= useUser() 
  const router = useRouter();
  const [initiatePayment, { isLoading }] = useInitiatePaymentMutation();
  // const formattedFee = new Intl.NumberFormat("en-IN").format(course?.courseFee || 0); 
const [showModal, setShowModal] = useState(false);



  
  const formattedFee= new Intl.NumberFormat("en-IN").format(course?.courseFee || 0)

 const handleEnroll = async () => {
    if (!user) {
      router.push("/login");
      return;
    }
    try {
      const res = await initiatePayment({
        courseId: course._id,
        amount: course.courseFee,
        user,
      }).unwrap();
      // Redirect to SSLCommerz gateway
      window.location.href = res.data.gatewayUrl;
    } catch (err) {
      console.error(err);
      alert("Payment initiation failed. Please try again.");
    }
  };


  return (
    <section className="max-w-6xl mx-auto px-">
    {/* Use flex-col on mobile, row on md+ */}
    <div className="flex flex-col md:flex-row gap-7">
     
      <div className="md:w-1/4 order-2 md:order-1">
        <DetailsHeadNav />
      </div>

      <div className="md:w-3/4 order-1 md:order-2">
     
          <div
            className="relative bg-cover bg-center bg-no-repeat py-12 mb-6"
            style={{ backgroundImage: `url(https://res.cloudinary.com/dbkwiwoll/image/upload/v1745303896/vecteezy_abstract-digital-background-with-technology-circuit-board_7872260_tzdhgv.jpg` }}
          >
       
            <div className="absolute inset-0 bg-black/40"></div>

            {/* Banner Content */}
            <div className="relative z-10 max-w-5xl mx-auto px-4">
              {/* White Card */}
              <div className="backdrop-filter backdrop-blur-sm  rounded-md shadow-lg p-6 md:p-8">
                {/* SubTitle */}
                <h4 className="text-sm md:text-base text-red-500 font-semibold mb-2">
                  {/* {banner.subTitle} */} 

                  ইঞ্জিনিয়ারিং এক্সপার্টদের সাথে ক্যারিয়ার গড়ুন
                </h4>

                {/* Main Title */}
                <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-100 leading-snug mb-4">
                  {course?.title}
                </h2>

                <p className=" text-gray-100 leading-relaxed mb-4 text-justify">
  {course?.description}
</p>

                <div className="flex flex-wrap items-center gap-5 text-gray-300 font-semibold mb-6">
                  {/* Duration */}
                  <div className="flex items-center gap-2 border-l-4 border-red-500 pl-3">
                    <CheckCircle className="text-red-500 w-5 h-5" />
                    <span>{course?.courseIncludes.duration}</span>
                  </div>

                  {/* Lessons */}
                  <div className="flex items-center gap-2 border-l-4 border-red-500 pl-3">
                    <CheckCircle className="text-red-500 w-5 h-5" />
                    <span>{course?.lessons}</span>
                  </div>

                  {/* Projects */}
                  <div className="flex items-center gap-2 border-l-4 border-red-500 pl-3">
                    <CheckCircle className="text-red-500 w-5 h-5" />
                    <span>{course?.projects}</span>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex flex-wrap gap-4">
                  {/* <button className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-md font-semibold">
                    ফ্রি ক্লাস দেখতে চাই
                  </button> */}
                 
                 <Link href="https://docs.google.com/forms/d/e/1FAIpQLSe27ZcsU6VdsyYPMD4JO5VwW4d9CI3_HtTG8YRxyo43gyzGWA/viewform">
                 <button className="bg-white text-red-500 border border-red-500 hover:bg-red-50 px-5 py-2 rounded-md font-semibold">
                 ভর্তি ফর্ম
                  </button> 
                 </Link>

                  <button className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-md font-semibold">
                  কোর্স ফি {formattedFee} টাকা
                  </button> 

      <div className="payment-section">
      


<SslcommerzPayment
  open={showModal}
  onClose={() => setShowModal(false)}
  courseId={course._id}
  courseTitle={course.title}
  courseFee={course.courseFee}
  startDate={course?.schedule.startingDate}
  user={user}
  // initiatePayment={initiatePayment}
/>

<button onClick={() => setShowModal(true)} className="bg-red-500 text-white px-5 py-2 rounded-md">
  Enroll করুন
</button>

      </div>
                </div>
              </div>
            </div>
          </div>
      </div>
    </div>
  </section>
  );
}
