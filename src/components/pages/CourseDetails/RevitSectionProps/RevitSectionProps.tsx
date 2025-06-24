"use client";
import React from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  Building2,
  DraftingCompass,
  LayoutTemplate,
  Lightbulb,
  Rocket,
} from "lucide-react";
import Image from "next/image";

const WhyLearnRevit = () => {
  const features = [
    {
      icon: <Building2 size={24} />,
      title: "BIM প্ল্যাটফর্ম",
      description:
        "এটি শুধু ডিজাইন সফটওয়্যার নয় – একটি সম্পূর্ণ Building Information Modeling (BIM) ইকোসিস্টেম।",
    },
    {
      icon: <LayoutTemplate size={24} />,
      title: "প্রজেক্ট লাইফসাইকেল ম্যানেজমেন্ট",
      description:
        "একই প্ল্যাটফর্ম থেকে পুরো প্রজেক্ট শুরু থেকে শেষ পর্যন্ত পরিচালনা করুন।",
    },
    {
      icon: <Rocket size={24} />,
      title: "ইন্ডাস্ট্রি স্ট্যান্ডার্ড",
      description: "আজকের দিনে Revit শেখা বিলাসিতা নয়, বরং আবশ্যকতা।",
    },
  ];

  const progression = [
    {
      name: "হ্যান্ড ড্রাফটিং",
      icon: <DraftingCompass className="text-amber-500" size={20} />,
      description: "পুরোনো দিনের হাতে আঁকা ডিজাইন পদ্ধতি",
      people: "প্রয়োজন ১০০ জন মানুষ",
      imageUrl:
        "https://res.cloudinary.com/dalpf8iip/image/upload/v1750237555/office-life-before-the-invention-of-autocad-and-other-_mx9vvi.webp",
    },
    {
      name: "AutoCAD",
      icon: <BookOpen className="text-red-500" size={20} />,
      description: "2D ডিজিটাল ডিজাইনের যুগে প্রবেশ",
      people: "প্রয়োজন ১০ জন মানুষ",
      imageUrl:
        "https://res.cloudinary.com/dalpf8iip/image/upload/v1750239308/Employees-working-in-open-office_qy3qu1.webp",
    },
    {
      name: "Revit BIM",
      icon: <Lightbulb className="text-emerald-500" size={20} />,
      description: "ডেটা সংযুক্ত 3D স্মার্ট মডেলিং",
      people: "প্রয়োজন মাত্র ১ জন",
      imageUrl:
        "https://res.cloudinary.com/dalpf8iip/image/upload/v1750752010/2149313795_suozvl.jpg",
    },
  ];

  return (
    <section className="py-16 px-4 mb-10 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Bangla Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}>
            <div className="mb-2 flex items-center gap-2">
              <div className="w-12 h-1 bg-red-600 rounded-full"></div>
              <span className="text-sm font-medium text-blue-600 uppercase tracking-wider">
                পেশাগত দক্ষতা বৃদ্ধি
              </span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              কেন <span className="text-red-600">Revit</span> শেখা আবশ্যক
            </h2>

            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              Revit কেবল একটি ডিজাইন টুল নয় — এটি একটি আধুনিক BIM (Building
              Information Modeling) প্ল্যাটফর্ম। যেখানে আপনি প্রজেক্ট শুরু,
              ম্যানেজ এবং শেষ করতে পারবেন একটি সমন্বিত ডিজিটাল পরিবেশে।
            </p>

            <div className="bg-blue-50 border-l-4 border-red-600 p-4 rounded-r-lg mb-8">
              <p className="text-lg font-medium text-gray-900 italic">
                "আজকের প্রতিযোগিতামূলক ইন্ডাস্ট্রিতে Revit জানা শুধুই সুবিধা নয়
                – এটি বাধ্যতামূলক।"
              </p>
            </div>

            <p className="text-gray-700 mb-8 leading-relaxed">
              Revit আপনাকে শুধু ডিজাইন শেখায় না, এটি শেখায় কীভাবে একটি ভবনের
              প্রতিটি উপাদানকে বোঝা এবং যুক্তিযুক্তভাবে প্রয়োগ করা যায়। এটি
              আপনাকে আরও দক্ষ আর্কিটেক্ট বা ইঞ্জিনিয়ার হতে সহায়তা করে।
            </p>

            <div className="space-y-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex items-start gap-4">
                  <div className="mt-1 p-2 bg-blue-100 text-blue-600 rounded-lg">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {feature.title}
                    </h3>
                    <p className="text-gray-700">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Column - Progression (Bangla) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-2xl shadow- p-8 border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              ডিজাইন টেকনোলজির বিবর্তন
            </h3>
            <p className="text-gray-600 mb-10">
              সময় ও প্রযুক্তির সঙ্গে পরিবর্তিত হয়েছে ডিজাইনিংয়ের ধরণ
            </p>

            <div className="relative py-8">
              <div className="absolute top-1/2 left-4 right-4 h-1 bg-gradient-to-r from-amber-400 via-blue-400 to-emerald-400 transform -translate-y-1/2 z-0 hidden md:block"></div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 relative z-10">
                {progression.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="flex flex-col items-center">
                    <div className="relative w-full h-48 rounded-xl overflow-hidden shadow-lg mb-5 border">
                      <Image
                        src={item.imageUrl}
                        alt={`${item.name} example`}
                        fill
                        className="object-cover"
                        quality={100}
                      />
                      <div className="absolute top-1 right-3 px-3 py-1 backdrop-blur-sm rounded-full text-sm font-medium text-gray-800">
                        {item.people}
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <div className="bg-gray-100 rounded-full p-2">
                          {item.icon}
                        </div>
                        <h4 className="text-xl font-bold text-gray-900 ml-3">
                          {item.name}
                        </h4>
                      </div>
                      <p className="text-gray-600">{item.description}</p>
                    </div>

                    {index < progression.length - 1 && (
                      <div className="md:hidden my-6 text-gray-300">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-8 w-8"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 14l-7 7m0 0l-7-7m7 7V3"
                          />
                        </svg>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>

              <div className="hidden md:flex justify-between px-4">
                <span className="text-sm font-medium text-amber-600">
                  পুরোনো ধারা
                </span>
                <span className="text-sm font-medium text-blue-600">
                  পরিবর্তনের ধাপ
                </span>
                <span className="text-sm font-medium text-emerald-600">
                  আধুনিক BIM
                </span>
              </div>
            </div>

            <div className="mt-12 p-6 bg-gradient-to-r from-red-600 to-red-700 rounded-xl text-white">
              <h3 className="text-xl font-bold mb-2">
                ইন্ডাস্ট্রি এক্সপার্টদের কাছ থেকে Revit শেখা শুরু করুন
              </h3>
              <p className="mb-4 opacity-90">
                Revit দক্ষতা আপনাকে আরও শক্তিশালী, সৃজনশীল এবং এফিশিয়েন্ট করে
                তুলবে AEC ইন্ডাস্ট্রির জন্য।
              </p>
              <button className="px-5 py-2.5 bg-white text-red-700 font-medium rounded-lg hover:bg-gray-100 transition-colors shadow-md">
                Revit কোর্স এক্সপ্লোর করুন
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default WhyLearnRevit;
