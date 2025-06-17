'use client';

import { useRef } from 'react';
import { useGetAllTeamQuery } from '@/redux/api/teamApi';
import { teamCategories } from '@/lib/types/TTeam';
import LoadingSpinner from '@/components/UI/LoadingSpinner/LoadingSpinner';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import ScrollToPlugin from 'gsap/ScrollToPlugin';
import useSmoothScroll from '@/hooks/useSmoothScroll';
import Image from 'next/image';

gsap.registerPlugin(ScrollToPlugin);

export default function TeamMembers() {
  useSmoothScroll();

  const { data: Teams, error, isLoading } = useGetAllTeamQuery({});
  const refs = useRef<Record<string, HTMLDivElement | null>>({});

  const scrollToCategory = (category: string) => {
    const target = refs.current[category];
    if (target) {
      gsap.to(window, {
        duration: 2,
        scrollTo: { y: target, offsetY: 100 },
        ease: 'power2.out',
      });
    }
  };

  if (isLoading)
    return (
      <div className="py-20">
        <LoadingSpinner />
      </div>
    );

  if (error)
    return (
      <div className="text-center py-10 text-red-500 text-lg font-semibold">
        Error loading team members.
      </div>
    );

  const categorizedTeams = teamCategories.map((category) => {
    const members =
      Teams?.data
        ?.filter((member: any) => member.category === category)
        ?.sort((a: any, b: any) => {
          const aPriority = a.pinPriority ?? Infinity;
          const bPriority = b.pinPriority ?? Infinity;
          return aPriority - bPriority;
        }) || [];

    return {
      category,
      members,
    };
  });

  return (
    <div className="bg-blue-50">
      <div className="max-w-7xl mx-auto px-4 py-10 font-sans">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-extrabold text-gray-800 uppercase tracking-tight">
            Meet <span className="text-red-500">Our Team</span>
          </h2>
          <p className="text-gray-500 mt-2 text-lg">
            Dedicated professionals driving innovation and growth.
          </p>
        </motion.div>

        {/* Category Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-10">
          {teamCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => scrollToCategory(cat)}
              className="px-4 py-2 bg-gray-200 hover:bg-red-500 hover:text-white text-gray-700 rounded-md transition"
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Team Members by Category */}
        {categorizedTeams.map(({ category, members }) =>
          members.length > 0 ? (
            <div
              key={category}
              ref={(el) => {
                refs.current[category] = el;
              }}
              className="mb-12"
            >
              <div className="mb-6 relative inline-block">
                <motion.h3
                  initial={{ x: -50, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="text-2xl sm:text-3xl font-bold text-white bg-red-500 px-5 py-2 rounded-tr-xl rounded-bl-xl shadow-md"
                >
                  {category}
                </motion.h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 pt-6">
                {members.map((member: any, i: number) => (
                  <motion.div
                    key={member._id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.07 }}
                    className="group relative overflow-hidden rounded-xl bg-white shadow-md hover:shadow-xl transition duration-300"
                  >
                    {/* Border Animation Layer */}
                    <div className="absolute inset-0 z-0 rounded-xl border-2 border-transparent group-hover:border-red-500 transition-all duration-500"></div>

                    {/* Image */}
                    <Image 
                    width={500} 
                    height={500}
                      src={member.photoUrl}
                      alt={member.name} 
                      className="w-full h-96 object-cover rounded-t-xl group-hover:scale-105 transition duration-500 z-50 relative"
                    />

                    {/* Info Box */}
                    <div className="p-3 z-10 relative">
                      <h3 className="text-lg font-semibold text-gray-800 group-hover:text-red-600 transition">
                        {member.name}
                      </h3>
                      <p className="text-sm text-gray-600">{member.title}</p>
                    </div>

                    {/* Bottom Animated Accent Bar */}
                    <div className="absolute bottom-0 left-0 h-1 bg-red-500 w-0 group-hover:w-full transition-all duration-300 z-10"></div>
                  </motion.div>
                ))}
              </div>
            </div>
          ) : null
        )}
      </div>
    </div>
  );
}