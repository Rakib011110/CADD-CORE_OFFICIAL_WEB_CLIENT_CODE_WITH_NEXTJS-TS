import React from "react"
import { Card, CardContent } from "@/components/UI/card"
import { motion } from "framer-motion"
import { TCourse } from "@/lib/courses"

const FreeTrainingSessions = ({ course }: { course: TCourse }) => {
  const [playingVideos, setPlayingVideos] = React.useState<Set<number>>(new Set())

  if (!course?.freeTrainingSessions?.length) return null

  // Function to convert YouTube URLs to embed URLs
  const getEmbedUrl = (url: string) => {
    if (!url) return ''

    // Handle YouTube URLs
    const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
    const match = url.match(youtubeRegex)

    if (match && match[1]) {
      return `https://www.youtube.com/embed/${match[1]}`
    }

    // If it's already an embed URL, return as is
    if (url.includes('youtube.com/embed/') || url.includes('youtu.be/')) {
      return url
    }

    // For other video platforms, return the URL as is
    return url
  }

  const handleVideoClick = (index: number) => {
    setPlayingVideos(prev => new Set([...prev, index]))
  }

  return (
    <div className="bg-gradient-to-br from-red-50 via-white to-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-red-600 to-red-700 rounded-full mb-4 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3 leading-tight">
            {course.title} <br />
            <span className="text-red-600">রিলেটেড প্রয়োজনীয় ফ্রি ভিডিও</span>
          </h2>
          <div className="flex justify-center mb-4">
            <div className="w-24 h-1 bg-gradient-to-r from-red-600 to-red-700 rounded-full"></div>
          </div>
          <p className="text-base text-gray-700 max-w-3xl mx-auto leading-relaxed">
            আপনার শিক্ষার যাত্রাকে আরও সমৃদ্ধ করতে আমাদের বিনামূল্যের প্রশিক্ষণ ভিডিওগুলো দেখুন।
          </p>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {course.freeTrainingSessions.map((session, idx) => (
            session.videoUrl ? (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <Card className="overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 rounded-3xl bg-white">
                  <CardContent className="p-0">
                    <div className="relative aspect-video overflow-hidden rounded-t-3xl cursor-pointer">
                      {/* Click to play overlay */}
                      {!playingVideos.has(idx) && (
                        <div
                          className="absolute inset-0 bg-black/40 flex items-center justify-center z-10 transition-opacity duration-300"
                          onClick={() => handleVideoClick(idx)}
                        >
                          <div className="w-20 h-20 bg-white/95 rounded-full flex items-center justify-center shadow-2xl transform hover:scale-110 transition-transform duration-300">
                            <svg className="w-10 h-10 text-red-600 ml-1" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z"/>
                            </svg>
                          </div>
                          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm font-medium bg-black/60 px-3 py-1 rounded-full">
                            Click to Play
                          </div>
                        </div>
                      )}
                      <iframe
                        src={`${getEmbedUrl(session.videoUrl)}?rel=0&modestbranding=1${playingVideos.has(idx) ? '&autoplay=1' : ''}`}
                        title={`Free Training Session ${idx + 1}`}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"
                      ></iframe>
                    </div>

                    {/* Video Info Section */}
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="inline-flex items-center px-2 py-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-semibold rounded-full shadow-md">
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          Free Session {idx + 1}
                        </div>
                        <div className="text-xs text-gray-500 font-medium">
                          {Math.floor(Math.random() * 30) + 10} min
                        </div>
                      </div>

                      {session.title && (
                        <h3 className="text-base font-bold text-gray-900 mb-1 group-hover:text-red-600 transition-colors duration-300">
                          {session.title}
                        </h3>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ) : null
          ))}
        </div>

        {/* Bottom Call-to-Action */}
        <div className="text-center mt-12">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-3xl mx-auto">
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              আরও জ্ঞান অর্জন করুন
            </h3>
            <p className="text-gray-600 mb-4 text-sm">
              এই ফ্রি ভিডিও সেশনগুলো আপনার মূল কোর্সকে সম্পূর্ণ করার জন্য অতিরিক্ত সহায়তা প্রদান করে।
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <div className="flex items-center text-xs text-gray-600">
                <svg className="w-4 h-4 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                HD Quality Videos
              </div>
              <div className="flex items-center text-xs text-gray-600">
                <svg className="w-4 h-4 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Self-Paced Learning
              </div>
              <div className="flex items-center text-xs text-gray-600">
                <svg className="w-4 h-4 text-red-700 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Certificate Ready
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FreeTrainingSessions