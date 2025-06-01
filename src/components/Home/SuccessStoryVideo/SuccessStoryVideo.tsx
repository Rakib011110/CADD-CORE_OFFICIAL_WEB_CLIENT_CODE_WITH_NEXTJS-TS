// app/success-stories/page.tsx
'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/UI/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/UI/card'; // Removed CardDescription as it's not used directly here
import { Play, Star, Eye, CalendarDays, ArrowRight, ArrowLeft, ChevronRight, Award, Lightbulb, Rocket, BarChart2 } from 'lucide-react';
import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { VideoCard } from './SuccessVideoCard';

gsap.registerPlugin(ScrollTrigger);

export interface Video {
  id: string;
  title: string;
  engineer: string;
  category: string;
  company: string;
  views: string;
  date: string;
  duration: string;
  thumbnail: string;
  avatar: string;
  videoUrl: string;
}

const allVideosData: Video[] = [
  {
    id: "1",
    title: "রাতুলের অসাধারণ অর্জন — ক্যাড কোর ট্রেনিং-এ তার সাফল্যের গল্প",
    engineer: "রাতুল",
    category: "সিভিল",
    company: "ক্যাড কোর ট্রেনিং ইনস্টিটিউট",
    views: "৫.৪ হাজার ভিউ",
    date: "১ সপ্তাহ আগে",
    duration: "৫:২০",
    thumbnail: "https://res.cloudinary.com/dalpf8iip/image/upload/v1748758084/sddefault_qicg3z.jpg",
    avatar: "https://res.cloudinary.com/dalpf8iip/image/upload/v1748756316/blue-circle-with-white-user_78370-4707_hbsduv.avif",
    videoUrl: "https://www.youtube.com/watch?v=0Xh35t9iR98",
  },
  {
    id: "2",
    title: "তনময়ের বাস্তব অভিজ্ঞতা — ক্যাড কোর ট্রেনিং ইনস্টিটিউটের একজন সফল শিক্ষার্থী",
    engineer: "তনময়",
    category: "সিভিল",
    company: "ক্যাড কোর ট্রেনিং ইনস্টিটিউট",
    views: "৬.৮ হাজার ভিউ",
    date: "২ সপ্তাহ আগে",
    duration: "৭:৪৫",
    thumbnail: "https://res.cloudinary.com/dalpf8iip/image/upload/v1748757970/sddefault_bqukws.jpg",
    avatar: "https://res.cloudinary.com/dalpf8iip/image/upload/v1748756316/blue-circle-with-white-user_78370-4707_hbsduv.avif",
    videoUrl: "https://www.youtube.com/watch?v=iNZhdae4maY&t=25s",
  },
  {
    id: "3",
    title: "শরিফুল ইসলামের আর্কিটেকচারাল যাত্রা — একজন প্রশিক্ষণের অনন্য সাফল্য",
    engineer: "শরিফুল ইসলাম",
    category: "আর্কিটেকচারাল",
    company: "ক্যাড কোর ট্রেনিং ইনস্টিটিউট",
    views: "৭.২ হাজার ভিউ",
    date: "৩ সপ্তাহ আগে",
    duration: "৬:১০",
    thumbnail: "https://res.cloudinary.com/dalpf8iip/image/upload/v1748756211/sddefault_qnyxg1.jpg",
    avatar: "https://res.cloudinary.com/dalpf8iip/image/upload/v1748756316/blue-circle-with-white-user_78370-4707_hbsduv.avif",
    videoUrl: "https://www.youtube.com/watch?v=UOfg2IU91oM",
  },
  {
    id: "4",
    title: "ওবায়দুল হকের সফলতা — মেকানিক্যাল ক্যাড কোর্স থেকে ক্যারিয়ার গড়ার গল্প",
    engineer: "ওবায়দুল হক",
    category: "মেকানিক্যাল",
    company: "ক্যাড কোর ট্রেনিং ইনস্টিটিউট",
    views: "৮.১ হাজার ভিউ",
    date: "১ মাস আগে",
    duration: "৮:০০",
    thumbnail: "https://res.cloudinary.com/dalpf8iip/image/upload/v1748757868/sddefault_mptn4a.jpg",
    avatar: "https://res.cloudinary.com/dalpf8iip/image/upload/v1748756316/blue-circle-with-white-user_78370-4707_hbsduv.avif",
    videoUrl: "https://www.youtube.com/watch?v=ko155egKjho",
  },
  {
    id: "5",
    title: "রাহাতের অনুপ্রেরণাদায়ক সাফল্য — বিআইএম কোর্সে দক্ষতা অর্জনের গল্প",
    engineer: "রাহাত",
    category: "বিম",
    company: "ক্যাড কোর ট্রেনিং ইনস্টিটিউট",
    views: "৯.৩ হাজার ভিউ",
    date: "২ মাস আগে",
    duration: "৯:১৫",
    thumbnail: "https://res.cloudinary.com/dalpf8iip/image/upload/v1748757868/sddefault_mptn4a.jpg",
    avatar: "https://res.cloudinary.com/dalpf8iip/image/upload/v1748756316/blue-circle-with-white-user_78370-4707_hbsduv.avif",
    videoUrl: "https://www.youtube.com/watch?v=someOtherVideoID19",
  },
  {
    id: "6",
    title: "সাকিবের ইলেকট্রিক্যাল ডিজাইন দক্ষতা — এক অনন্য অভিজ্ঞতার ভিডিও",
    engineer: "সাকিব",
    category: "ইলেকট্রিক্যাল",
    company: "ক্যাড কোর ট্রেনিং ইনস্টিটিউট",
    views: "৪.৫ হাজার ভিউ",
    date: "৩ দিন আগে",
    duration: "৪:৩০",
    thumbnail: "https://res.cloudinary.com/dalpf8iip/image/upload/v1748756211/sddefault_qnyxg1.jpg",
    avatar: "https://res.cloudinary.com/dalpf8iip/image/upload/v1748756316/blue-circle-with-white-user_78370-4707_hbsduv.avif",
    videoUrl: "https://www.youtube.com/watch?v=someOtherVideoID20",
  }
];

const filters = ["সব", "সিভিল", "আর্কিটেকচারাল", "মেকানিক্যাল", "ইলেকট্রিক্যাল", "বিম"];
const VIDEOS_PER_PAGE = 3;

export default function SuccessStoriesPageVideo() {
  const [activeFilter, setActiveFilter] = useState(filters[0]);
  const [currentPage, setCurrentPage] = useState(1);
  
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsWrapperRef = useRef<HTMLDivElement>(null); // Ref for the grid container of cards
  const floatingRef = useRef<HTMLDivElement>(null);
  
  // This ref will store an array of individual card elements for GSAP
  const cardElementsRef = useRef<(HTMLDivElement | null)[]>([]);

  // Filter videos based on selected category
  const filteredVideos = activeFilter === "সব"
    ? allVideosData
    : allVideosData.filter(video => video.category === activeFilter);

  // Pagination logic
  const indexOfLastVideo = currentPage * VIDEOS_PER_PAGE;
  const indexOfFirstVideo = indexOfLastVideo - VIDEOS_PER_PAGE;
  const currentVideos = filteredVideos.slice(indexOfFirstVideo, indexOfLastVideo);
  const totalPages = Math.ceil(filteredVideos.length / VIDEOS_PER_PAGE);

  // Reset to page 1 when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter]);

  // GSAP Animations for static elements (run once on mount)
  useEffect(() => {
    gsap.fromTo(sectionRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.8, scrollTrigger: { trigger: sectionRef.current, start: "top 85%" } }
    );

    if (floatingRef.current) {
      const floatingElements = floatingRef.current.children;
      gsap.to(floatingElements, {
        y: 20, duration: 3, yoyo: true, repeat: -1, ease: "sine.inOut", stagger: { each: 0.2, from: "random" }
      });
    }
    // Cleanup for these specific ScrollTriggers if sectionRef could be unmounted/remounted independently
    // For a page component, the main unmount cleanup is usually sufficient.
    return () => {
        if(ScrollTrigger.getById("sectionIntro")) ScrollTrigger.getById("sectionIntro")?.kill();
        // Add similar logic for floating elements if they have specific IDs
    }
  }, []);


  // GSAP Animations for video cards (run when currentVideos changes)
  useEffect(() => {
    cardElementsRef.current = cardElementsRef.current.slice(0, currentVideos.length); // Keep refs only for current videos

    const cards = cardElementsRef.current.filter(card => card !== null) as HTMLDivElement[];

    cards.forEach((card, index) => {
      gsap.set(card, { opacity: 0, y: 50 }); // Reset before animating
      gsap.to(card, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        delay: index * 0.1,
        scrollTrigger: {
          trigger: card,
          start: "top 90%",
          toggleActions: "play none none none",
          // once: true // Optional: if animation should only play once
        }
      });
    });

    // Cleanup function for this effect
    return () => {
      cards.forEach(card => {
        const triggers = ScrollTrigger.getAll().filter(st => st.trigger === card);
        triggers.forEach(trigger => {
          trigger.kill();
        });
      });
    };
  }, [currentVideos, currentPage]); // Depend on currentVideos and currentPage

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    // Scroll to top of video section smoothly (optional)
    cardsWrapperRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  // Generate page numbers for pagination controls
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 relative overflow-hidden">
      {/* Floating background elements (code unchanged) */}
      <div ref={floatingRef} className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i} className="absolute text-red-200 opacity-20"
            // style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`, fontSize: `${Math.random() * 24 + 12}px`}}
            initial={{ opacity: 0 }} animate={{ opacity: 0.2 }} transition={{ duration: 2, delay: i * 0.1 }}
          >
            {i % 5 === 0 ? <Award /> : i % 5 === 1 ? <Lightbulb /> : i % 5 === 2 ? <Rocket /> : i % 5 === 3 ? <BarChart2 /> : <ChevronRight />}
          </motion.div>
        ))}
      </div>
      <div className="absolute inset-0 bg-[url('https://static.vecteezy.com/system/resources/thumbnails/036/492/752/original/animated-grid-lines-red-background-for-your-designs-grid-background-4k-free-video.jpg')] bg-repeat opacity-[0.03] pointer-events-none"></div>
      
      <div className="max-w-6xl mx-auto relative z-10 mt-10" ref={sectionRef}>
        {/* Animated Header (code unchanged, ensure motion imports are correct) */}
        <motion.div 
          className="text-center mb-16 relative" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        >
         
          <motion.h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            ক্যাড কোর <span className="text-red-600">সাফল্যের গল্প</span>
          </motion.h1>
          <motion.div className="h-1 w-24 bg-gradient-to-r from-red-500 to-red-700 mx-auto rounded-full mb-6" initial={{ width: 0 }} animate={{ width: 96 }} transition={{ delay: 0.4, duration: 0.8 }} />
          <motion.p className="text-xl text-gray-600 max-w-3xl mx-auto" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
            আমাদের ক্যাড কোর প্রশিক্ষণ কমিউনিটির যুগান্তকারী প্রকল্প এবং উদ্ভাবন আবিষ্কার করুন
          </motion.p>
          <motion.div className="mt-8 flex justify-center gap-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
            <Button variant="outline" className="rounded-full border-red-300 text-red-600 hover:bg-red-50">আলোচিত প্রকল্প</Button>
            <Button className="bg-red-600 hover:bg-red-700 rounded-full">পুরস্কার বিজয়ী <Award className="ml-2 h-4 w-4" /></Button>
          </motion.div>
        </motion.div>

        {/* Video Section */}
        <Card className="rounded-xl shadow-sm overflow-hidden border-0 bg-white relative z-10">
          {/* Card Header with Filters (code unchanged) */}
          <div className="bg-gradient-to-r from-red-700 to-red-900 p-6 md:p-8 relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-red-800 opacity-20"></div>
            <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-red-600 opacity-20"></div>
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 relative z-10">
              <div>
                <motion.h2 className="text-2xl md:text-3xl font-bold text-white" initial={{ x: -20 }} animate={{ x: 0 }} transition={{ type: "spring", stiffness: 100 }}>
                  ক্যাড কোর প্রশিক্ষণার্থীদের সাফল্য
                </motion.h2>
                <motion.p className="text-red-200 mt-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                  বাস্তব প্রকল্প, অসাধারণ অর্জন
                </motion.p>
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                {filters.map((filter) => (
                  <motion.div key={filter} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} whileHover={{ scale: 1.05 }}>
                    <Button 
                      onClick={() => setActiveFilter(filter)} variant={filter === activeFilter ? "default" : "outline"} 
                      className={`rounded-full font-medium px-4 py-2 text-sm md:text-base ${filter === activeFilter ? "bg-white text-red-600 hover:bg-red-50 shadow-md" : "bg-transparent text-white hover:bg-white/20 border-white/50 hover:border-white"}`}
                    >
                      {filter}
                    </Button>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
          
          <CardContent className="p-6 md:p-8">
            {/* Video Grid - maps over currentVideos */}
            <div ref={cardsWrapperRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 min-h-[400px]"> {/* Added min-h for layout stability */}
              {currentVideos.map((video, index) => (
                <motion.div
                  key={video.id} // Use video.id for a stable key
                  // Assign ref to the array of card elements
                  ref={el => { cardElementsRef.current[index] = el; }} 
                  whileHover={{ y: -5 }}
                  className="rounded-lg overflow-hidden"
                  // layout prop can cause issues with GSAP if not handled carefully, consider removing if problems arise
                  // For items that re-order or change, Framer Motion's layout is great.
                  // For simple enter/exit of same-structured items, direct GSAP might be simpler. Test this.
                >
                  <VideoCard video={video} />
                </motion.div>
              ))}
            </div>
            
            {filteredVideos.length === 0 && (
              <div className="text-center py-12">
                 <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-xl w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                   <Rocket size={32} className="text-gray-400" />
                 </div>
                 <h3 className="text-xl font-medium text-gray-700">কোনো প্রকল্প খুঁজে পাওয়া যায়নি</h3>
                 <p className="text-gray-500 mt-2">অনুগ্রহ করে অন্য একটি বিভাগ নির্বাচন করুন</p>
              </div>
            )}
             {currentVideos.length === 0 && filteredVideos.length > 0 && (
                 <div className="text-center py-12">
                    <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-xl w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                        <Rocket size={32} className="text-gray-400" />
                    </div>
                    <h3 className="text-xl font-medium text-gray-700">এই পৃষ্ঠায় কোনো প্রকল্প নেই</h3>
                    <p className="text-gray-500 mt-2">অনুগ্রহ করে আগের পৃষ্ঠায় যান অথবা ফিল্টার পরিবর্তন করুন</p>
                 </div>
             )}
          </CardContent>
          
          {/* Pagination Controls - Now Dynamic */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 sm:gap-4 p-6 border-t border-gray-100">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  variant="outline" 
                  className="rounded-full w-10 h-10 sm:w-12 sm:h-12 border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  aria-label="Previous Page"
                >
                  <ArrowLeft size={18} />
                </Button>
              </motion.div>
              
              {pageNumbers.map((number) => (
                <motion.div key={number} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    variant={number === currentPage ? "default" : "outline"} 
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full font-medium ${number === currentPage 
                      ? "bg-red-600 hover:bg-red-700 text-white" 
                      : "hover:bg-red-50 border-gray-300"}`}
                    onClick={() => handlePageChange(number)}
                  >
                    {number}
                  </Button>
                </motion.div>
              ))}
              
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  variant="outline" 
                  className="rounded-full w-10 h-10 sm:w-12 sm:h-12 border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  aria-label="Next Page"
                >
                  <ArrowRight size={18} />
                </Button>
              </motion.div>
            </div>
          )}
        </Card>
        
        {/* Testimonial and CTA sections (code largely unchanged) */}
        <motion.div /* ... Testimonial ... */ className="bg-gradient-to-r from-red-700 to-red-900 rounded-2xl p-8 md:p-12 my-16 text-white shadow-xl overflow-hidden" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.5 }}>
            <div className="max-w-4xl mx-auto"><div className="flex flex-col md:flex-row items-center gap-8"><div className="relative">
                <img src=" " alt="David Wilson" className="bg-gray-200 border-4 border-red-500/50 rounded-full w-24 h-24 md:w-32 md:h-32 object-cover"/>
                <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-2 shadow-lg"><Award className="h-6 w-6" /></div>
            </div><div><div className="flex mb-4">
                {[...Array(5)].map((_, i) => (<motion.div key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.6 + i * 0.1 }}><Star className="fill-yellow-400 text-yellow-400 w-6 h-6 mx-0.5" /></motion.div>))}
            </div>
            
            
         <motion.p className="text-xl md:text-2xl italic mb-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
  "CAD কোর্সটি করার পর আমি AutoCAD-এ confident হয়ে উঠি এবং নিজের একটি portfolio তৈরি করি। কোর্সের practical assignment আর real-life project guideline গুলো আমাকে industry-ready করে তোলে। এখন আমি একটি leading architectural firm-এ কাজ করছি — এ কোর্সটা আমার career-এর turning point ছিল!"
</motion.p>
            
           <motion.div className="space-y-1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
  <p className="text-lg font-semibold">- সাবরিন হোসেন, Junior CAD Designer</p>
  <p className="text-red-200">ArchiZone Ltd. | ২০২৩ Best Newcomer Award</p>
</motion.div>
            
            </div>
            
            
            </div></div>
        </motion.div>
        <motion.div /* ... CTA ... */ className="text-center my-16 relative" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7, duration: 0.5 }}>
            <div className="absolute -z-10 -inset-4"><div className="absolute top-0 left-1/4 w-32 h-32 bg-red-500 rounded-full filter blur-3xl opacity-20 animate-blob"></div><div className="absolute top-0 right-1/4 w-48 h-48 bg-red-600 rounded-full filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div><div className="absolute bottom-0 left-1/3 w-40 h-40 bg-red-700 rounded-full filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div></div>
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">আপনার ইঞ্জিনিয়ারিং সাফল্য শেয়ার করুন</h3><p className="text-gray-600 max-w-2xl mx-auto mb-8 text-lg">আপনার উদ্ভাবনী প্রকল্প এবং সমাধান প্রদর্শন করে পরবর্তী প্রজন্মের প্রকৌশলীদের অনুপ্রাণিত করুন</p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-block">
                <Button className="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all" size="lg">
                    আপনার সাফল্য জমা দিন <Rocket className="ml-3 h-5 w-5" />
                </Button>
            </motion.div>
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
                <Button variant="outline" className="border-red-300 text-red-600 hover:bg-red-50 rounded-full px-6 py-3">একটি প্রকল্প মনোনয়ন করুন</Button>
                <Button variant="outline" className="border-red-300 text-red-600 hover:bg-red-50 rounded-full px-6 py-3">জমা দেওয়ার নির্দেশিকা দেখুন</Button>
            </div>
        </motion.div>
      </div>
    </div>
  );
}