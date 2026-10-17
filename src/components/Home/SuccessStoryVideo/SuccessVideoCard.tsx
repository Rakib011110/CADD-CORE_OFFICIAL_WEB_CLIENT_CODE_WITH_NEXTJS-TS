import { CalendarDays, Eye, Play } from "lucide-react";
import type { Video } from "./SuccessStoryVideo";

const FALLBACK_THUMBNAIL = "https://res.cloudinary.com/dalpf8iip/image/upload/v1748758084/sddefault_qicg3z.jpg";

// Opens the video on YouTube in a new tab
export const VideoCard = ({ video }: { video: Video }) => (
  <a
    href={video.videoUrl}
    target="_blank"
    rel="noopener noreferrer"
    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition duration-300 hover:-translate-y-1 hover:border-red-200 hover:shadow-[0_20px_44px_-24px_rgba(220,38,38,0.35)]">
    {/* Thumbnail */}
    <span className="relative block aspect-video overflow-hidden bg-zinc-900">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={video.thumbnail}
        alt=""
        loading="lazy"
        onError={(e) => (e.currentTarget.src = FALLBACK_THUMBNAIL)}
        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
      />
      <span className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent transition group-hover:from-black/60" />
      <span className="absolute inset-0 flex items-center justify-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-red-600 shadow-lg backdrop-blur transition duration-300 group-hover:scale-110 group-hover:bg-red-600 group-hover:text-white">
          <Play className="ml-0.5 h-6 w-6 fill-current" />
        </span>
      </span>
      <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-0.5 text-xs font-semibold text-zinc-800 shadow-sm">
        {video.category}
      </span>
      <span className="absolute bottom-3 right-3 rounded-md bg-black/75 px-2 py-0.5 text-xs font-medium tabular-nums text-white">
        {video.duration}
      </span>
    </span>

    {/* Details */}
    <span className="flex flex-1 flex-col p-4">
      <span title={video.title} className="mb-4 line-clamp-2 min-h-[2.75rem] font-semibold leading-snug text-zinc-900 transition-colors group-hover:text-red-600">
        {video.title}
      </span>
      <span className="mt-auto flex items-center gap-2.5 border-t border-zinc-100 pt-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-50 text-sm font-bold text-red-600">
          {video.engineer.charAt(0)}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-semibold text-zinc-900">{video.engineer}</span>
          <span className="block truncate text-xs text-zinc-500">{video.company}</span>
        </span>
        <span className="flex shrink-0 flex-col items-end gap-0.5 text-[11px] text-zinc-500">
          <span className="flex items-center gap-1">
            <Eye className="h-3 w-3" /> {video.views}
          </span>
          <span className="flex items-center gap-1">
            <CalendarDays className="h-3 w-3" /> {video.date}
          </span>
        </span>
      </span>
    </span>
  </a>
);
