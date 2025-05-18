// components/EventsEngagements.tsx
import { useGetAllEventsQuery } from '@/redux/api/eventApi';
import Image, { StaticImageData } from 'next/image';

type TEvent = {
  _id: string;
  title: string;
  descriptions: string;
  photoUrl: StaticImageData | string;
}






export default async function EventsandEngagements() {
// const {data: events}= useGetAllEventsQuery({})


const res = await fetch("https://caddcore-web-server-code-pi.vercel.app/api/events");
const events = await res.json();

  return (
    <div>
      <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-center mb-8">Events and Engagements</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {events?.data?.map((event : TEvent) => (
          <div 
            key={event._id}
            className="group relative overflow-hidden rounded-lg cursor-pointer"
          >
            {/* Image container with hover effect */}
            <div className="aspect-square overflow-hidden">
              <Image
                src={event.photoUrl}
                alt={event.title}
                width={500}
                height={400}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>

            {/* Overlay text */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-center p-4">
              <h3 className="text-md font-semibold text-white mb-2">{event.title}</h3>
              <p className="text-gray-200">{event.descriptions}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
}
