import React from 'react';
import { Card } from '../card';
import { Book, Clock, Settings } from 'lucide-react';
import Link from 'next/link';
import { TCourse } from '@/lib/courses';
import Image from 'next/image'; 
import { motion } from 'framer-motion';
export const metadata = {
  title: "Courses - CADD CORE",
  description: "Explore a wide range of professional courses including Civil, Mechanical, Electrical, Architectural, and BIM at CADD CORE.",
  keywords: [
    "CADD CORE Courses",
    "Civil Courses",
    "Mechanical Courses",
    "Electrical Courses",
    "Architectural Courses",
    "BIM Courses",
    "Professional Training",
    "Technical Education"
  ],
  openGraph: {
    title: "Courses - CADD CORE",
    description: "Advance your career with industry-focused courses in Civil, Mechanical, Electrical, Architectural, and BIM disciplines at CADD CORE.",
    // url: "https://yourdomain.com/courses", 
    type: "website",
    
  },
 
  authors: [{ name: "CADD CORE" }],
  creator: "CADD CORE",
  publisher: "CADD CORE",
};

// Motion-enabled Card with group hover
const MotionCard = motion(Card);

const CourseCard: React.FC<TCourse> = ({
  title,
  duration,
  lessons,
  projects,
  photoUrl,
  slug,
  softwaresTaught,
}) => {
  return (
    <MotionCard
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.4 }}
      className="relative h-[320px] rounded-lg overflow-hidden shadow-lg group"
    >
      {/* Background Image */}
      <motion.img
        src={photoUrl}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover"
        initial={{ scale: 1.1 }}
        whileHover={{ scale: 1 }}
        transition={{ duration: 0.5 }}
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/60 to-transparent z-10" />

      {/* Software Icons on Card Hover */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-2 z-30 opacity-0 transform -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
        {softwaresTaught?.slice(0, 4).map((software, idx) => (
          <Image
            key={idx}
            src={software.photoUrl}
            alt={software.softwareTitle || `software-${idx}`}
            width={50}
            height={50}
            className="rounded-full bg-white p-1 shadow-md object-contain"
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-20 flex flex-col items-center justify-end h-full text-center text-white px-4 pb-6">
        <motion.h3
          className="text-xl font-bold mb-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          {title}
        </motion.h3>

        <motion.div
          className="flex items-center justify-between gap-4 text-sm opacity-90"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.4 }}
        >
          <div className="flex items-center">
            <Clock className="text-red-400" />
            <span className="ml-1">{duration}</span>
          </div>
          <div className="flex items-center">
            <Book className="text-red-400" />
            <span className="ml-1">{lessons}</span>
          </div>
          <div className="flex items-center">
            <Settings className="text-red-400" />
            <span className="ml-1">{projects}</span>
          </div>
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-4 bg-red-500 text-white px-5 py-2 rounded-lg shadow-lg hover:bg-red-600 transition"
        >
          <Link href={`/courses/${slug}`}>বিস্তারিত দেখুন</Link>
        </motion.button>
      </div>
    </MotionCard>
  );
};

export default CourseCard;
