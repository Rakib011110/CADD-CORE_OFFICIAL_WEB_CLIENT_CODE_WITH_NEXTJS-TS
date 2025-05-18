import HeroVideoDialog from "@/components/magicui/hero-video-dialog";

export default function IndustrialOverview() {

  return (
    <section id="industrial-overview"  className="bg-blue-50 py-10 px-4">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left Column: Heading + Description */}
          <div>

            <h2 className="text-3xl font-bold text-gray-800 mb-4 relative inline-block">
              ইন্ডাস্ট্রিয়াল ট্রেনিং ওভারভিউ
              <span className="absolute -bottom-1 left-0 w-36 h-1 bg-blue-600"></span>
            </h2> 


            <p className="text-gray-700 text-justify leading-relaxed mb-4">
  এই ইন্ডাস্ট্রিয়াল কোর্সটি বিশেষভাবে ডিজাইন করা হয়েছে বাস্তব জীবনের অভিজ্ঞতা এবং ব্যবহারিক স্কিল ডেভেলপমেন্টের উপর ভিত্তি করে। আমরা বিশ্বাস করি, শুধুমাত্র তাত্ত্বিক জ্ঞান নয়, বরং বাস্তব কাজের অভিজ্ঞতাই একজন শিক্ষার্থীকে একজন দক্ষ পেশাদার হিসেবে গড়ে তুলতে পারে। এই কোর্সে শিক্ষার্থীরা প্রকৃত ইন্ডাস্ট্রিয়াল প্রজেক্ট, সফটওয়্যার ব্যবহারের কৌশল এবং রিয়েল-টাইম কাজের পরিবেশে দক্ষতা অর্জনের সুযোগ পাবে।

  কোর্স শেষে একজন শিক্ষার্থী শুধুমাত্র একটি সার্টিফিকেটই অর্জন করবে না বরং একটি পূর্ণাঙ্গ প্রজেক্ট পোর্টফোলিও, যেটি তাকে ভবিষ্যতের চাকরি বা ফ্রিল্যান্সিং ক্যারিয়ারের জন্য দৃঢ় ভিত্তি তৈরি করতে সাহায্য করবে। সরাসরি ইন্ডাস্ট্রি বিশেষজ্ঞদের তত্ত্বাবধানে পরিচালিত এই কোর্সটি শিক্ষার্থীদের বাস্তব কর্মদক্ষতা ও আত্মবিশ্বাস গড়ে তুলতে গুরুত্বপূর্ণ ভূমিকা রাখবে। এটি এমন একটি অভিজ্ঞতা যা তাদের পেশাগত জীবনে পরিবর্তন আনবে।
</p>


           
          </div>

          {/* Right Column: Embedded Video */}
        
            <div className="w-full aspect-video rounded-md overflow-hidden">
        




    <div className="relative">
      <HeroVideoDialog
        className="block dark:hidden"
        animationStyle="top-in-bottom-out"
       videoSrc="https://www.youtube.com/embed/iNZhdae4maY?si=VYgdY7hZsL_GOOQ0"
        thumbnailSrc="https://res.cloudinary.com/dbkwiwoll/image/upload/v1746017829/dae04d9d-6ccc-42f3-bf76-c65111cfe67a_rvfwjj.jpg"
        thumbnailAlt="Hero Video"
      />
      <HeroVideoDialog
        className="hidden dark:block"
        animationStyle="top-in-bottom-out"
        videoSrc="https://www.youtube.com/embed/iNZhdae4maY?si=VYgdY7hZsL_GOOQ0"
        thumbnailSrc="https://res.cloudinary.com/dbkwiwoll/image/upload/v1746017829/dae04d9d-6ccc-42f3-bf76-c65111cfe67a_rvfwjj.jpg"
        thumbnailAlt="Hero Video"
      />
    </div>

            </div>
         
          
        </div>
      </div>
    </section>
  );
}
