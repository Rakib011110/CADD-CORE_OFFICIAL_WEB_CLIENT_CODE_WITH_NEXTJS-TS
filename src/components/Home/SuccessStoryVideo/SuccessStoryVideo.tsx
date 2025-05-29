// app/success-stories/page.tsx
'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/UI/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/UI/card';
import { Play, Star, Eye, CalendarDays, ArrowRight, ArrowLeft, ChevronRight, Award, Lightbulb, Rocket, BarChart2 } from 'lucide-react';
import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Video data type
interface Video {
  id: string;
  title: string;
  engineer: string;
  discipline: string; // বিষয়
  company: string;
  views: string; // ভিউ
  date: string; // তারিখ
  duration: string; // সময়কাল
  thumbnail: string;
  avatar: string;
  achievements: string[]; // অর্জনসমূহ
}

// Sample video data for engineering disciplines (CADD CORE Training এর জন্য বাংলায়)
const videos: Video[] = [
  {
    id: "1",
    title: "আন্তর্জাতিক পুরস্কার বিজয়ী টেকসই সেতুর ডিজাইন", // "Sustainable Bridge Design Wins International Award"
    engineer: "সারাহ করিম", // "Sarah Johnson"
    discipline: "সিভিল ইঞ্জিনিয়ারিং", // "Civil Engineering"
    company: "এইসি গ্লোবাল", // "AEC Global"
    views: "১২.৪ হাজার ভিউ", // "12.4K views"
    date: "৩ সপ্তাহ আগে", // "3 weeks ago"
    duration: "৮:৪২",
    thumbnail: "/civil-thumb.jpg", // এগুলো যেমন আছে তেমনই থাকবে, যদি না আপনি লোকাল ছবি ব্যবহার করেন
    avatar: "/avatar-civil.jpg",
    achievements: ["নির্মাণ ব্যয় ২২% হ্রাস", "৪০% পুনর্ব্যবহৃত উপকরণ ব্যবহার"]
  },
  {
    id: "2",
    title: "বিআইএম দ্বারা নগর অবকাঠামোর বিপ্লব", // "Revolutionizing Urban Infrastructure with BIM"
    engineer: "ডেভিড রহমান", // "David Wilson"
    discipline: "বিআইএম", // "BIM"
    company: "আরবানটেক সলিউশনস", // "UrbanTech Solutions"
    views: "৮.৭ হাজার ভিউ", // "8.7K views"
    date: "১ মাস আগে", // "1 month ago"
    duration: "১২:১৫",
    thumbnail: "/bim-thumb.jpg",
    avatar: "/avatar-bim.jpg",
    achievements: ["কর্মপ্রবাহের দক্ষতায় ৪০% উন্নতি", "প্রকল্পের ত্রুটি ৬৫% হ্রাস"]
  },
  {
    id: "3",
    title: "বহুতল ভবনের জন্য উদ্ভাবনী স্ট্রাকচারাল সমাধান", // "Innovative Structural Solution for High-Rise Construction"
    engineer: "মাইকেল চৌধুরী", // "Michael Chen"
    discipline: "স্ট্রাকচারাল ইঞ্জিনিয়ারিং", // "Structural Engineering"
    company: "স্কাইলাইন আর্কিটেক্টস", // "Skyline Architects"
    views: "২৪.১ হাজার ভিউ", // "24.1K views"
    date: "২ মাস আগে", // "2 months ago"
    duration: "১৫:৩০",
    thumbnail: "/structural-thumb.jpg",
    avatar: "/avatar-structural.jpg",
    achievements: ["৯.০ মাত্রার ভূমিকম্প সিমুলেশন প্রতিরোধ", "স্টিলের ব্যবহার ১৮% হ্রাস"]
  },
  {
    id: "4",
    title: "পরিবেশ-বান্ধব ভবনের জন্য শক্তি-সাশ্রয়ী এমইপি ডিজাইন", // "Energy-Efficient MEP Design for Green Building"
    engineer: "এমিলি হক", // "Emily Rodriguez"
    discipline: "মেকানিক্যাল ইঞ্জিনিয়ারিং", // "Mechanical Engineering"
    company: "ইকোবিল্ড সিস্টেমস", // "EcoBuild Systems"
    views: "৭.৩ হাজার ভিউ", // "7.3K views"
    date: "৩ সপ্তাহ আগে", // "3 weeks ago"
    duration: "১০:২২",
    thumbnail: "/mechanical-thumb.jpg",
    avatar: "/avatar-mechanical.jpg",
    achievements: ["LEED প্লাটিনাম সার্টিফিকেশন অর্জন", "শক্তি খরচ ৩৫% হ্রাস"]
  },
  {
    id: "5",
    title: "টেকসই ক্যাম্পাসের জন্য স্মার্ট ইলেকট্রিকাল সিস্টেম", // "Smart Electrical Systems for Sustainable Campus"
    engineer: "রবার্ট আহমেদ", // "Robert Taylor"
    discipline: "ইলেকট্রিক্যাল ইঞ্জিনিয়ারিং", // "Electrical Engineering"
    company: "পাওয়ারগ্রিড ইনোভেশনস", // "PowerGrid Innovations"
    views: "১৮.৯ হাজার ভিউ", // "18.9K views"
    date: "১ মাস আগে", // "1 month ago"
    duration: "৯:৪৫",
    thumbnail: "/electrical-thumb.jpg",
    avatar: "/avatar-electrical.jpg",
    achievements: ["বিদ্যুৎ বিভ্রাট ৩০% হ্রাস", "নবায়নযোগ্য শক্তি উৎসের সমন্বয়"]
  },
  {
    id: "6",
    title: "ঐতিহাসিক স্থাপনার পুনরুদ্ধার", // "Restoration of Historic Landmark Building"
    engineer: "জেসিকা ইসলাম", // "Jessica Miller"
    discipline: "আর্কিটেকচারাল ইঞ্জিনিয়ারিং", // "Architectural Engineering"
    company: "হেরিটেজ ডিজাইন গ্রুপ", // "Heritage Design Group"
    views: "১৫.২ হাজার ভিউ", // "15.2K views"
    date: "২ সপ্তাহ আগে", // "2 weeks ago"
    duration: "১৪:১৮",
    thumbnail: "/arch-thumb.jpg",
    avatar: "/avatar-arch.jpg",
    achievements: ["১৯ শতকের স্থাপত্য উপাদান সংরক্ষণ", "ঐতিহ্য অক্ষুণ্ণ রেখে অবকাঠামোর আধুনিকায়ন"]
  }
];

// ফিল্টার অপশনগুলো বাংলায়
const filters = ["সব", "সিভিল", "আর্কিটেকচারাল", "মেকানিক্যাল", "ইলেকট্রিক্যাল", "বিআইএম"];
// CADD CORE Training এর কোর্সগুলো এখানে যুক্ত করতে পারেন
const caddCoreCourseFilters = [
    "সব",
    "অটোক্যাড (সিভিল ও আর্কিটেকচারাল)",
    "আরসিসি ডিজাইন",
    "রেভিট (বিম)",
    "মেকানিক্যাল ক্যাড",
    "ইলেকট্রিকাল ডিজাইন",
    "আর্কিটেকচারাল মডেলিং"
];


export default function SuccessStoriesPageVideo() {
  const [activeFilter, setActiveFilter] = useState(caddCoreCourseFilters[0]); // ডিফল্ট ফিল্টার
  const sectionRef = useRef(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const floatingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // GSAP animations
    gsap.fromTo(sectionRef.current,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 0.8,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%"
        }
      }
    );

    // Floating elements animation
    if (floatingRef.current) {
      const floatingElements = floatingRef.current.children;
      gsap.to(floatingElements, {
        y: 20,
        duration: 3,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
        stagger: {
          each: 0.2,
          from: "random"
        }
      });
    }

    // Card animations
    cardsRef.current.forEach((card, i) => {
      gsap.fromTo(card,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          delay: i * 0.1,
          scrollTrigger: {
            trigger: card,
            start: "top 90%",
            toggleActions: "play none none none"
          }
        }
      );
    });

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  // Filter videos based on selected category
  // এখানে discipline এর পরিবর্তে একটি নতুন প্রপার্টি যেমন `courseCategory` ব্যবহার করতে পারেন অথবা discipline কেই বাংলা মান অনুযায়ী ফিল্টার করতে পারেন।
  // আপাতত discipline ব্যবহার করেই দেখাচ্ছি, তবে CADD CORE এর কোর্স অনুযায়ী এটা পরিবর্তন করতে হতে পারে।
  const filteredVideos = activeFilter === caddCoreCourseFilters[0]
    ? videos
    : videos.filter(video => {
        // এই লজিক CADD CORE এর কোর্স অনুযায়ী পরিবর্তন করতে হবে
        if (activeFilter === "অটোক্যাড (সিভিল ও আর্কিটেকচারাল)") return video.discipline.includes("সিভিল") || video.discipline.includes("আর্কিটেকচারাল");
        if (activeFilter === "আরসিসি ডিজাইন") return video.discipline.includes("স্ট্রাকচারাল");
        if (activeFilter === "রেভিট (বিম)") return video.discipline.includes("বিআইএম");
        if (activeFilter === "মেকানিক্যাল ক্যাড") return video.discipline.includes("মেকানিক্যাল");
        if (activeFilter === "ইলেকট্রিকাল ডিজাইন") return video.discipline.includes("ইলেকট্রিক্যাল");
        if (activeFilter === "আর্কিটেকচারাল মডেলিং") return video.discipline.includes("আর্কিটেকচারাল");
        return false;
    });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 relative overflow-hidden">
      {/* Floating background elements */}
      <div ref={floatingRef} className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-red-200 opacity-20"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              fontSize: `${Math.random() * 24 + 12}px`,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.2 }}
            transition={{ duration: 2, delay: i * 0.1 }}
          >
            {i % 5 === 0 ? <Award /> :
              i % 5 === 1 ? <Lightbulb /> :
                i % 5 === 2 ? <Rocket /> :
                  i % 5 === 3 ? <BarChart2 /> : <ChevronRight />}
          </motion.div>
        ))}
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-repeat opacity-[0.03] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10" ref={sectionRef}>
        {/* Animated Header with Decorative Elements */}
        <motion.div
          className="text-center mb-16 relative"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
            <motion.div
              className="h-2 w-32 bg-red-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: 128 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            />
          </div>

          <motion.h1
            className="text-4xl md:text-6xl font-bold text-gray-900 mb-4" // Tailwind ক্লাস text-gray-900 ব্যবহার করছে
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            ক্যাড কোর <span className="text-red-600">সাফল্যের গল্প</span> {/* "Engineering Breakthroughs" */}
          </motion.h1>

          <motion.div
            className="h-1 w-24 bg-gradient-to-r from-red-500 to-red-700 mx-auto rounded-full mb-6"
            initial={{ width: 0 }}
            animate={{ width: 96 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          />

          <motion.p
            className="text-xl text-gray-600 max-w-3xl mx-auto" // Tailwind ক্লাস text-gray-600 ব্যবহার করছে
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            আমাদের ক্যাড কোর প্রশিক্ষণ কমিউনিটির যুগান্তকারী প্রকল্প এবং উদ্ভাবনগুলো আবিষ্কার করুন যা ভবিষ্যতের অবকাঠামো নির্মাণে সহায়ক। {/* "Discover groundbreaking projects..." */}
          </motion.p>

          <motion.div
            className="mt-8 flex justify-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <Button variant="outline" className="rounded-full border-red-300 text-red-600 hover:bg-red-50">
              আলোচিত প্রকল্প {/* "Featured Projects" */}
            </Button>
            <Button className="bg-red-600 hover:bg-red-700 rounded-full">
              পুরস্কার বিজয়ী {/* "Award Winners" */}
              <Award className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <StatCard
            value="২০০+"
            label="প্রকল্প সম্পন্ন" // "Projects Completed"
            icon={<Rocket className="text-red-600" />}
            delay={0.1}
          />
          <StatCard
            value="৪২+" // "42"
            label="শিল্প পুরস্কার" // "Industry Awards"
            icon={<Award className="text-red-600" />}
            delay={0.2}
          />
          <StatCard
            value="১৫মিলিয়ন+" // "15M+"
            label="মোট ভিউ" // "Views"
            icon={<Eye className="text-red-600" />}
            delay={0.3}
          />
          <StatCard
            value="১২০+"
            label="প্রকৌশলী সংস্থা" // "Engineering Firms"
            icon={<BarChart2 className="text-red-600" />}
            delay={0.4}
          />
        </motion.div>

        {/* Video Section */}
        <Card className="rounded-xl shadow-2xl overflow-hidden border-0 bg-white relative z-10">
          <div className="bg-gradient-to-r from-red-700 to-red-900 p-6 md:p-8 relative overflow-hidden">
            {/* Decorative element */}
            <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-red-800 opacity-20"></div>
            <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-red-600 opacity-20"></div>

            <div className="flex flex-col md:flex-row justify-between items-center gap-4 relative z-10">
              <div>
                <motion.h2
                  className="text-2xl md:text-3xl font-bold text-white"
                  initial={{ x: -20 }}
                  animate={{ x: 0 }}
                  transition={{ type: "spring", stiffness: 100 }}
                >
                  ক্যাড কোর প্রশিক্ষণার্থীদের সাফল্য  {/* "Engineering Innovations Showcase" */}
                </motion.h2>
                <motion.p
                  className="text-red-200 mt-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  বাস্তব প্রকল্প, অসাধারণ অর্জন {/* "Real projects, remarkable achievements" */}
                </motion.p>
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                {caddCoreCourseFilters.map((filter, index) => ( // caddCoreCourseFilters ব্যবহার করা হয়েছে
                  <motion.div
                    key={filter}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <Button
                      onClick={() => setActiveFilter(filter)}
                      variant={filter === activeFilter ? "default" : "outline"}
                      className={`rounded-full font-medium ${filter === activeFilter
                          ? "bg-white text-red-600 hover:bg-red-50 shadow-md"
                          : "bg-transparent text-white hover:bg-white/20"}`}
                    >
                      {/* এখানে আপনার দেওয়া বাংলা কোর্সগুলোর নাম বসাতে পারেন, যদি ফিল্টারগুলো সরাসরি কোর্স নাম হয় */}
                      {filter === "অটোক্যাড (সিভিল ও আর্কিটেকচারাল)" ? "অটোক্যাড" : 
                       filter === "আরসিসি ডিজাইন" ? "আরসিসি" :
                       filter === "রেভিট (বিম)" ? "রেভিট" :
                       filter === "মেকানিক্যাল ক্যাড" ? "মেকানিক্যাল" :
                       filter === "ইলেকট্রিকাল ডিজাইন" ? "ইলেকট্রিকাল" :
                       filter === "আর্কিটেকচারাল মডেলিং" ? "আর্কিটেকচারাল" : filter
                      }
                    </Button>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          <CardContent className="p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredVideos.map((video, index) => (
                <motion.div
                  key={video.id}
                  ref={el => { if (el) cardsRef.current[index] = el; }}
                  whileHover={{ y: -10 }}
                  className="overflow-hidden"
                  layout // Framer Motion এর layout prop অ্যানিমেশনের জন্য
                >
                  <VideoCard video={video} />
                </motion.div>
              ))}
            </div>

            {filteredVideos.length === 0 && (
              <div className="text-center py-12">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto mb-4 animate-pulse" /> {/* অ্যানিমেশন যোগ করা হলো */}
                <h3 className="text-xl font-medium text-gray-700">কোনো প্রকল্প খুঁজে পাওয়া যায়নি</h3> {/* "No projects found" */}
                <p className="text-gray-500 mt-2">অনুগ্রহ করে অন্য একটি বিভাগ নির্বাচন করুন</p> {/* "Try selecting a different category" */}
              </div>
            )}
          </CardContent>

          {/* Pagination */}
          <div className="flex justify-center items-center gap-4 p-6 border-t border-gray-100">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button variant="outline" className="rounded-full w-12 h-12 border-gray-300">
                <ArrowLeft size={18} />
              </Button>
            </motion.div>

            {[1, 2, 3].map((page) => ( // পেজিনেশন আপাতত ডেমো হিসেবে রাখা হয়েছে
              <motion.div
                key={page}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant={page === 1 ? "default" : "outline"}
                  className={`w-12 h-12 rounded-full font-medium ${page === 1
                      ? "bg-red-600 hover:bg-red-700 shadow-md"
                      : "hover:bg-red-50 border-gray-300"}`}
                >
                  {page}
                </Button>
              </motion.div>
            ))}

            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button variant="outline" className="rounded-full w-12 h-12 border-gray-300">
                <ArrowRight size={18} />
              </Button>
            </motion.div>
          </div>
        </Card>

        {/* Testimonial with Wave Divider */}
        <div className="relative my-24">
          <div className="absolute -top-1 left-0 right-0 h-12 bg-[url('/wave-pattern.svg')] bg-repeat-x"></div>

          <motion.div
            className="bg-gradient-to-r from-red-800 to-red-900 rounded-2xl p-8 md:p-12 text-white shadow-xl overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <div className="max-w-5xl mx-auto">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="relative">
                  {/* Placeholder for user image */}
                  <div className="bg-gray-200 border-2 border-dashed rounded-full w-24 h-24 md:w-32 md:h-32" />
                  <div className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-2 shadow-lg">
                    <Award className="h-6 w-6" />
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.9 + i * 0.1 }}
                      >
                        <Star className="fill-yellow-400 text-yellow-400 w-6 h-6 mx-0.5" />
                      </motion.div>
                    ))}
                  </div>
                  <motion.p
                    className="text-xl md:text-2xl italic mb-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.4 }}
                  >
                    "বিআইএম প্রযুক্তি বাস্তবায়নের ফলে আমাদের কাজের效率 ৪০% বৃদ্ধি পেয়েছে। এই প্ল্যাটফর্মটি আমাদের সিভিল, স্ট্রাকচারাল এবং এমইপি টিমকে এমনভাবে সংযুক্ত করেছে যা আমরা আগে কখনো ভাবিনি, ত্রুটি কমিয়েছে এবং হাজার হাজার প্রকল্প ঘণ্টা বাঁচিয়েছে।" {/* "Implementing BIM technology..." */}
                  </motion.p>
                  <motion.div
                    className="space-y-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.6 }}
                  >
                    <p className="text-lg font-semibold">- ডেভিড রহমান, বিআইএম ডিরেক্টর</p> {/* "- David Wilson, BIM Director" */}
                    <p className="text-red-200">আরবানটেক সলিউশনস | ২০২৩ ইনোভেশন অ্যাওয়ার্ড বিজয়ী</p> {/* "UrbanTech Solutions | 2023 Innovation Award Winner" */}
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="absolute -bottom-1 left-0 right-0 h-12 bg-[url('/wave-pattern.svg')] bg-repeat-x rotate-180"></div>
        </div>

        {/* Engineering Impact Section */}
        <motion.div
          className="bg-white rounded-2xl shadow-xl p-8 mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900">প্রকৌশলের <span className="text-red-600">প্রভাব</span></h2> {/* "Engineering Impact" */}
            <p className="text-gray-600 max-w-3xl mx-auto mt-4">
              আমাদের কমিউনিটি যেভাবে উদ্ভাবনের মাধ্যমে শিল্পে পরিবর্তন আনছে {/* "How our community is transforming industries through innovation" */}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ImpactCard
              title="টেকসই অবকাঠামো" // "Sustainable Infrastructure"
              description="উদ্ভাবনী ডিজাইন সমাধানের মাধ্যমে পরিবেশগত প্রভাব হ্রাস" // "Reducing environmental impact..."
              stats={["কার্বন ফুটপ্রিন্ট ৪২% হ্রাস", "পুনর্ব্যবহৃত উপকরণ ২৮% বৃদ্ধি"]}
              icon={<Lightbulb className="text-red-600" />}
              delay={0.1}
            />
            <ImpactCard
              title="ডিজিটাল রূপান্তর" // "Digital Transformation"
              description="প্রযুক্তি গ্রহণের মাধ্যমে নির্মাণ শিল্পের অগ্রগতি" // "Advancing construction through..."
              stats={["প্রকল্পের ত্রুটি ৬৫% হ্রাস", "৩০% দ্রুত প্রকল্প সম্পন্ন"]}
              icon={<BarChart2 className="text-red-600" />}
              delay={0.2}
            />
            <ImpactCard
              title="কমিউনিটি উন্নয়ন" // "Community Development"
              description="জীবনযাত্রার মান উন্নত করে এমন স্থান তৈরি করা" // "Creating spaces that enhance..."
              stats={["১২০+ কমিউনিটি প্রকল্প", "৩.৫ মিলিয়ন মানুষকে সেবা প্রদান"]}
              icon={<Rocket className="text-red-600" />}
              delay={0.3}
            />
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          className="text-center my-16 relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
        >
          <div className="absolute -z-10 -inset-4">
            <div className="absolute top-0 left-1/4 w-32 h-32 bg-red-500 rounded-full filter blur-3xl opacity-20 animate-blob"></div>
            <div className="absolute top-0 right-1/4 w-48 h-48 bg-red-600 rounded-full filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-0 left-1/3 w-40 h-40 bg-red-700 rounded-full filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
          </div>

          <h3 className="text-2xl font-bold text-gray-900 mb-6">আপনার প্রকৌশল সাফল্য শেয়ার করুন</h3> {/* "Share Your Engineering Success" */}
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            আপনার উদ্ভাবনী প্রকল্প এবং সমাধানগুলো প্রদর্শন করে পরবর্তী প্রজন্মের প্রকৌশলীদের অনুপ্রাণিত করুন {/* "Inspire the next generation..." */}
          </p>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block"
          >
            <Button
              className="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white px-8 py-6 text-lg font-bold rounded-full shadow-lg hover:shadow-xl transition-all"
              size="lg"
            >
              আপনার প্রকল্প জমা দিন {/* "Submit Your Project" */}
              <Rocket className="ml-3 h-5 w-5" />
            </Button>
          </motion.div>

          <div className="mt-8 flex justify-center gap-4">
            <Button variant="outline" className="border-red-300 text-red-600 hover:bg-red-50">
              একটি প্রকল্প মনোনয়ন করুন {/* "Nominate a Project" */}
            </Button>
            <Button variant="outline" className="border-red-300 text-red-600 hover:bg-red-50">
              জমা দেওয়ার নির্দেশিকা দেখুন {/* "View Submission Guidelines" */}
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// Video Card Component (বাংলা টেক্সট সহ)
const VideoCard = ({ video }: { video: Video }) => {
  return (
    <Card className="h-full overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 group bg-gradient-to-b from-white to-gray-50">
      <div className="relative overflow-hidden">
        {/* Thumbnail placeholder - এখানে বাস্তব থাম্বনেইল ব্যবহার করতে হবে */}
        <div className="bg-gradient-to-br from-gray-200 to-gray-300 border-2 border-dashed rounded-t-xl w-full h-48" />
        {/* <img src={video.thumbnail} alt={video.title} className="w-full h-48 object-cover rounded-t-xl" /> */}


        {/* Discipline Badge */}
        <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-medium shadow-md">
          {/* discipline এর বাংলা মান এখানে বসাতে হবে, যদি প্রয়োজন হয় */}
          {video.discipline === "Civil Engineering" ? "সিভিল ইঞ্জিনিয়ারিং" :
           video.discipline === "BIM" ? "বিআইএম" :
           video.discipline === "Structural Engineering" ? "স্ট্রাকচারাল ইঞ্জিনিয়ারিং" :
           video.discipline === "Mechanical Engineering" ? "মেকানিক্যাল ইঞ্জিনিয়ারিং" :
           video.discipline === "Electrical Engineering" ? "ইলেকট্রিক্যাল ইঞ্জিনিয়ারিং" :
           video.discipline === "Architectural Engineering" ? "আর্কিটেকচারাল ইঞ্জিনিয়ারিং" : video.discipline
          }
        </div>

        {/* Play Button */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-black/0 to-black/30 opacity-0 group-hover:opacity-100 transition-opacity"
          whileHover={{ scale: 1.1 }}
        >
          <div className="bg-red-600/90 hover:bg-red-700 w-16 h-16 rounded-full flex items-center justify-center cursor-pointer transition-all shadow-lg">
            <Play className="text-white ml-1" size={24} />
          </div>
        </motion.div>

        {/* Duration */}
        <div className="absolute bottom-3 right-3 bg-black/80 text-white px-2 py-1 rounded text-xs font-medium">
          {video.duration}
        </div>
      </div>

      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-bold line-clamp-2 group-hover:text-red-700 transition-colors">
          {video.title} {/* এটি ইতিমধ্যে বাংলা করা হয়েছে ডেটা সোর্সে */}
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex items-start mb-3">
          {/* Avatar placeholder - এখানে বাস্তব অ্যাভাটার ব্যবহার করতে হবে */}
          <div className="bg-gradient-to-br from-gray-200 to-gray-300 border-2 border-dashed rounded-full w-10 h-10 flex-shrink-0" />
          {/* <img src={video.avatar} alt={video.engineer} className="w-10 h-10 rounded-full object-cover flex-shrink-0" /> */}
          <div className="ml-3">
            <p className="font-medium text-gray-900">{video.engineer}</p> {/* এটি ইতিমধ্যে বাংলা করা হয়েছে ডেটা সোর্সে */}
            <p className="text-sm text-gray-600">{video.company}</p> {/* এটি ইতিমধ্যে বাংলা করা হয়েছে ডেটা সোর্সে */}
          </div>
        </div>

        {/* Achievements */}
        <div className="mt-4 space-y-2">
          {video.achievements.map((achievement, i) => (
            <motion.div
              key={i}
              className="flex items-start"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * i }}
            >
              <div className="bg-red-100 text-red-600 rounded-full p-1 mt-0.5 mr-2">
                <ChevronRight className="h-4 w-4" />
              </div>
              <span className="text-sm text-gray-700">{achievement}</span> {/* এটি ইতিমধ্যে বাংলা করা হয়েছে ডেটা সোর্সে */}
            </motion.div>
          ))}
        </div>

        <div className="flex justify-between text-sm text-gray-500 border-t pt-3 mt-4">
          <div className="flex items-center">
            <Eye className="w-4 h-4 mr-1" />
            <span>{video.views}</span> {/* এটি ইতিমধ্যে বাংলা করা হয়েছে ডেটা সোর্সে */}
          </div>
          <div className="flex items-center">
            <CalendarDays className="w-4 h-4 mr-1" />
            <span>{video.date}</span> {/* এটি ইতিমধ্যে বাংলা করা হয়েছে ডেটা সোর্সে */}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Stat Card Component (বাংলা টেক্সট সহ)
const StatCard = ({ value, label, icon, delay }: { value: string, label: string, icon: React.ReactNode, delay?: number }) => (
  <motion.div
    className="bg-white rounded-xl shadow-md p-6 text-center border border-gray-100"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: delay || 0 }}
    whileHover={{ y: -5 }}
  >
    <div className="flex justify-center mb-3">
      <div className="bg-red-100 p-3 rounded-full">
        {icon}
      </div>
    </div>
    <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
    <p className="text-gray-600 mt-1">{label}</p> {/* এটি কল করার সময় বাংলা করা হবে */}
  </motion.div>
);

// Impact Card Component (বাংলা টেক্সট সহ)
const ImpactCard = ({ title, description, stats, icon, delay }: {
  title: string,
  description: string,
  stats: string[],
  icon: React.ReactNode,
  delay?: number
}) => (
  <motion.div
    className="bg-gradient-to-br from-gray-50 to-white rounded-xl shadow-md p-6 border border-gray-100 h-full"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: delay || 0 }}
    whileHover={{ y: -5 }}
  >
    <div className="flex items-center mb-4">
      <div className="bg-red-100 p-2 rounded-lg">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 ml-3">{title}</h3> {/* এটি কল করার সময় বাংলা করা হবে */}
    </div>
    <p className="text-gray-600 mb-4">{description}</p> {/* এটি কল করার সময় বাংলা করা হবে */}
    <div className="space-y-2">
      {stats.map((stat, i) => (
        <div key={i} className="flex items-center">
          <div className="w-2 h-2 bg-red-600 rounded-full mr-2"></div>
          <span className="text-gray-700">{stat}</span> {/* এটি কল করার সময় বাংলা করা হবে */}
        </div>
      ))}
    </div>
  </motion.div>
);