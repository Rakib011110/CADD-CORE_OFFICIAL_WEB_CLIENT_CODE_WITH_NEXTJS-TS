import React from 'react';
import { Book, Clock, Settings, ArrowRight, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { TCourse } from '@/lib/courses';
import Image from 'next/image';
import { motion } from 'framer-motion';

const IndustrialCourseCard: React.FC<TCourse & { variant: number }> = ({
  title,
  duration,
  lessons,
  projects,
  photoUrl,
  slug,
  softwaresTaught,
  variant = 0
}) => {
  const variants = [
    { bg: 'bg-gradient-to-br from-emerald-600 to-teal-500', text: 'text-emerald-600' },

    { bg: 'bg-gradient-to-br from-red-600 to-orange-500', text: 'text-red-600' },
    { bg: 'bg-gradient-to-br from-blue-600 to-cyan-500', text: 'text-blue-600' },
  ];

  const currentVariant = variants[variant % variants.length];

  return (
    <div className="h-full">
      <div className="h-full bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow duration-300 flex flex-col">
        {/* Image with gradient overlay */}
        <div className="relative h-48 overflow-hidden">
          <Image
            src={photoUrl}
            alt={title}
            fill
            className="object-cover"
            quality={100}
          />
          <div className={`absolute inset-0 ${currentVariant.bg} opacity-20 mix-blend-multiply`} />
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/80 to-transparent" />
          
          {/* Corner tag */}
          <div className={`absolute top-4 right-4 ${currentVariant.bg} text-white px-3 py-1 rounded-full text-xs font-bold`}>
            Featured
          </div>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 flex flex-col">
          <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
          
          {/* Stats */}
          <div className="flex flex-wrap gap-4 mb-5 text-sm">
            <div className="flex items-center text-gray-600">
              <Clock className={`w-4 h-4 ${currentVariant.text} mr-2`} />
              <span>{duration}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Book className={`w-4 h-4 ${currentVariant.text} mr-2`} />
              <span>{lessons} </span>
            </div>
            <div className="flex items-center text-gray-600">
              <Settings className={`w-4 h-4 ${currentVariant.text} mr-2`} />
              <span>{projects} </span>
            </div>
          </div>

          {/* Software chips */}
          {softwaresTaught && softwaresTaught.length > 0 && (
            <div className="mt-auto mb-5">
              <div className="flex flex-wrap gap-2">
                {softwaresTaught.slice(0, 3).map((software, idx) => (
                  <span 
                    key={idx}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-300 text-gray-800"
                  >
                    {software.softwareTitle}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Animated CTA */}
          <Link 
            href={`/industrial-attachment-training/${slug}`}
            className={`mt-auto group flex items-center justify-between ${currentVariant.text} font-medium hover:${currentVariant.text}/80 transition-colors`}
          >
            <span>বিস্তারিত দেখুন</span>
            <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default IndustrialCourseCard;