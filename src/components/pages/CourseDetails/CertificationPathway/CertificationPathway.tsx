"use client";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { Card } from "@/components/UI/card";
import { Badge } from "@/components/UI/badge";

const boxStyle = "bg-[#e74c3c] text-white rounded-xl shadow-2xl px-6 py-4 font-semibold text-center w-64 h-32 flex items-center justify-center";
const timeBoxStyle = "bg-[#888] text-white rounded-xl shadow-2xl px-6 py-4 font-semibold text-center w-64 h-32 flex items-center justify-center";

export default function TrainingProgram() {
  const comp = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      tl.current = gsap.timeline()
        .from(".center-circle", { scale: 0, duration: 0.8, ease: "back.out(1.7)" })
        .from(".element", { opacity: 0, scale: 0.5, duration: 0.6, stagger: 0.1, ease: "power2.out" }, "-=0.2");
    }, comp);

    return () => ctx.revert();
  }, []);

  return (
   <section className="max-w mx-auto-3xl mt-40 mb-20">
 <div ref={comp} className="flex items-center justify-center  bg-gray-100 p-8">
      <div className="relative w-[300px] h-[300px] flex items-center justify-center">
        {/* Central Circle */}
        <div className="center-circle absolute bg-gradient-to-br from-orange-400 to-orange-600 rounded-full w-64 h-64 flex flex-col items-center justify-center shadow-2xl z-20">
          <span className="text-white text-3xl font-bold text-center mb-2">
            On JOB Training
          </span>
          <span className="text-white text-xl font-semibold">
            (1 Month)
          </span>
        </div>

        {/* Top Section */}
        <div className="element absolute -top-4 left-1/2 -translate-x-1/2 -translate-y-full flex flex-col items-center">
          <div className={boxStyle}>
            <div>
              <h2 className="text-2xl">RCC Detailing</h2>
              <p className="text-sm mt-2">4 Projects (A to Z)</p>
            </div>
          </div>
          <Arrow direction="down" color="#e74c3c" className="-mt-4" />
        </div>

        {/* Left Sections */}
        <div className="element absolute -left-4 top-1/2 -translate-y-1/2 -translate-x-full flex flex-col gap-8">
          <div className="flex items-center gap-4">
            <div className={timeBoxStyle}>
              <div>
                <h3 className="text-xl">Full Time</h3>
                <p className="text-2xl font-bold mt-2">9 to 5pm</p>
              </div>
            </div>
            <Arrow direction="right" color="#888" className="-ml-2" />
          </div>
          
          <div className="flex items-center gap-4 ">
            
            <div className={timeBoxStyle + " bg-[#666]"}>
              <div>
                <h3 className="text-xl">Part Time</h3>
                <p className="text-2xl font-bold mt-2">6pm to 10pm</p>
              </div>
            
            </div> 
              <Arrow direction="right" color="#888" className="-ml-2" />
          </div>
        </div>

        {/* Right Sections */}
        <div className="element absolute -right-4 top-1/2 -translate-y-1/2 translate-x-full flex flex-col gap-8">
          <div className="flex items-center gap-4">
            <Arrow direction="left" color="#e74c3c" className="-mr-2" />
            <div className={boxStyle}>
              <div>
                <h3 className="text-xl">STEEL Drawing</h3>
                <p className="text-sm mt-2">Shed & Multistoried</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Arrow direction="left" color="#e74c3c" className="-mr-2" />
            <div className={boxStyle}>
              <div>
                <h3 className="text-xl">Basic Electrical &</h3>
                <p className="text-xl">Plumbing Drawing</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="element absolute -bottom-4 left-1/2 -translate-x-1/2 translate-y-full flex flex-col items-center">
          <Arrow direction="up" color="#e74c3c" className="-mb-4" />
          <div className={boxStyle}>
            <div>
              <h2 className="text-xl">Architectural Working</h2>
              <p className="text-xl">Drawing Project</p>
            </div>
          </div>
        </div>
      </div>
    </div>

   </section>
  );
}

const Arrow = ({ direction, color, className, rotation = 0 }: { 
  direction: string;
  color: string;
  className?: string;
  rotation?: number;
}) => {
  const getPath = () => {
    switch(direction) {
      case 'up': return { d: "M12 24V0", points: "12,0 6,6 18,6" };
      case 'down': return { d: "M12 0v24", points: "12,24 6,18 18,18" };
      case 'left': return { d: "M24 12H0", points: "0,12 6,6 6,18" };
      case 'right': return { d: "M0 12H24", points: "24,12 18,6 18,18" };
      default: return { d: "", points: "" };
    }
  };

  return (
    <svg
      className={`arrow w-12 h-12 ${className}`}
      style={{ transform: `rotate(${rotation}deg)` }}
      fill="none"
      stroke={color}
      strokeWidth="3"
      viewBox="0 0 24 24"
    >
      <path d={getPath().d} />
      <polygon points={getPath().points} fill={color} />
    </svg>
  );
};