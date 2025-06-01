// app/success-stories/SuccessVideoCard.tsx
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/UI/card';
import { Play, Eye, CalendarDays, Tag } from 'lucide-react'; // Added Tag icon for category

export const VideoCard = ({ video }: { video: any }) => {
  const handlePlayClick = () => {
    if (video.videoUrl) {
      window.open(video.videoUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <Card className="h-full flex flex-col rounded-lg overflow-hidden border border-gray-200/70 shadow-md hover:shadow-lg transition-all duration-300 group bg-white">
      <div className="relative overflow-hidden cursor-pointer" onClick={handlePlayClick}>
        <img 
          src={video.thumbnail} 
          alt={`Thumbnail for ${video.title}`}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105" 
          // Basic error handling for image loading
          onError={(e) => (e.currentTarget.src = 'https://res.cloudinary.com/dalpf8iip/image/upload/v1748758084/sddefault_qicg3z.jpg')} // Add a placeholder image
        />
        
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-red-600/90 hover:bg-red-700 w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-lg transform scale-90 group-hover:scale-100">
            <Play className="text-white ml-1" size={26} />
          </div>
        </div>

        <div className="absolute bottom-2 right-2 bg-black/75 text-white px-2.5 py-1 rounded text-xs font-medium shadow-md">
          {video.duration}
        </div>
        
        <div className="absolute top-2 left-2 bg-red-600 text-white px-2.5 py-1 rounded-full text-xs font-semibold shadow-md flex items-center">
          <Tag size={12} className="mr-1" />
          {video.category}
        </div>
      </div>

      <CardHeader className="pb-2 pt-4 px-4">
        <CardTitle 
          className="text-md font-semibold text-gray-800 line-clamp-2 group-hover:text-red-600 transition-colors h-[2.8em]" // Adjusted height for 2 lines of text-md
          title={video.title} // Show full title on hover
        >
          {video.title}
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-1 px-4 pb-4 flex-grow flex flex-col justify-between">
        <div>
          <div className="flex items-center mb-3">
            <img 
              src={video.avatar} 
              alt={`Avatar of ${video.engineer}`}
              className="w-9 h-9 rounded-full object-cover border-2 border-gray-100" 
            //   onError={(e) => (e.currentTarget.src = '/images/placeholder-avatar.jpg')} // Add a placeholder avatar
            />
            <div className="ml-2.5">
              <p className="font-medium text-gray-900 text-sm leading-tight">{video.engineer}</p>
              <p className="text-xs text-gray-500 leading-tight">{video.company}</p>
            </div>
          </div>

          <div className="flex items-center text-xs text-gray-500 space-x-3 mt-2">
            <div className="flex items-center" title="Views">
              <Eye size={13} className="mr-1 text-gray-400" />
              <span>{video.views}</span>
            </div>
            <div className="flex items-center" title="Date">
              <CalendarDays size={13} className="mr-1 text-gray-400" />
              <span>{video.date}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};