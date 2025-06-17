"use client";

import React, {
  forwardRef,
  useRef,
  useState,
  useEffect,
  useCallback,
  FC,
  ReactNode,
} from "react";

// --- Utility Functions ---
const cn = (...inputs: (string | undefined | null | false)[]): string => {
  return inputs
    .flat()
    .filter((input): input is string => typeof input === "string" && input.length > 0)
    .join(" ");
};

const useResizeObserver = (
  ref: React.RefObject<Element | null>,
  callback: (rect: DOMRectReadOnly) => void
) => {
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new ResizeObserver((entries) => {
      if (entries[0]) {
        callback(entries[0].contentRect);
      }
    });

    observer.observe(element);
    return () => {
      observer.unobserve(element);
    };
  }, [ref, callback]);
};

// --- Core Components ---
interface AnimatedBeamProps {
  className?: string;
  containerRef: React.RefObject<HTMLElement | null>;
  fromRef: React.RefObject<HTMLElement | null>;
  toRef: React.RefObject<HTMLElement | null>;
  duration?: number;
}

const AnimatedBeam: FC<AnimatedBeamProps> = ({
  className,
  containerRef,
  fromRef,
  toRef,
  duration = 5,
}) => {
  const [path, setPath] = useState("");
  const [svgDimensions, setSvgDimensions] = useState({ width: 0, height: 0 });

  const drawPath = useCallback(() => {
    if (!containerRef.current || !fromRef.current || !toRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const fromRect = fromRef.current.getBoundingClientRect();
    const toRect = toRef.current.getBoundingClientRect();

    const svgWidth = containerRect.width;
    const svgHeight = containerRect.height;
    setSvgDimensions({ width: svgWidth, height: svgHeight });

    const fromPoint = {
      x: fromRect.left - containerRect.left + fromRect.width / 2,
      y: fromRect.top - containerRect.top + fromRect.height / 2,
    };

    const toPoint = {
      x: toRect.left - containerRect.left + toRect.width / 2,
      y: toRect.top - containerRect.top + toRect.height / 2,
    };
    
    const controlX = fromPoint.x + (toPoint.x - fromPoint.x) * 0.5;

    setPath(`M${fromPoint.x},${fromPoint.y} C${controlX},${fromPoint.y} ${controlX},${toPoint.y} ${toPoint.x},${toPoint.y}`);
  }, [containerRef, fromRef, toRef]);

  useEffect(() => {
    drawPath();
    const handleResize = () => drawPath();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [drawPath]);

  useResizeObserver(containerRef, drawPath);
  useResizeObserver(fromRef, drawPath);
  useResizeObserver(toRef, drawPath);

  return (
    <>
      <svg
        fill="none"
        width={svgDimensions.width}
        height={svgDimensions.height}
        xmlns="http://www.w3.org/2000/svg"
        className={cn("pointer-events-none absolute left-0 top-0", className)}
      >
        <path
          d={path}
          stroke="url(#beam-gradient-red-blue)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeOpacity="0.2"
        />
        <path
          d={path}
          stroke="url(#beam-gradient-red-blue)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeOpacity="1"
          style={{
            strokeDasharray: "20 20",
            animation: `beam-animation ${duration}s linear infinite`,
          }}
        />
        <defs>
          <linearGradient id="beam-gradient-red-blue" gradientUnits="userSpaceOnUse">
            <stop stopColor="#EF4444" /> {/* Red */}
            <stop offset="1" stopColor="#60A5FA" /> {/* Light Blue */}
          </linearGradient>
        </defs>
      </svg>
      <style>{`
        @keyframes beam-animation {
          to {
            stroke-dashoffset: -40;
          }
        }
      `}</style>
    </>
  );
};

interface CircleProps {
  className?: string;
  children: ReactNode;
  title?: string;
  size?: "sm" | "md" | "lg";
}

const Circle = forwardRef<HTMLDivElement, CircleProps>(
  ({ className, children, title, size = "md" }, ref) => {
    const sizeClasses = {
      sm: "size-14",
      md: "size-20",
      lg: "size-24",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "z-10 flex items-center justify-center rounded-full bg-gradient-to-br from-white to-gray-100 p-3 shadow-lg ring-1 ring-gray-200 transition-all duration-300 hover:scale-105",
          sizeClasses[size],
          className
        )}
        title={title}
      >
        {children}
      </div>
    );
  }
);
Circle.displayName = "Circle";

interface TrainingNodeProps {
  circleRef: React.RefObject<HTMLDivElement | null>;
  icon: ReactNode;
  label: string;
  subLabel?: string;
  circleClassName?: string;
  tooltip?: string;
  size?: "sm" | "md" | "lg";
}

const TrainingNode: FC<TrainingNodeProps> = ({
  circleRef,
  icon,
  label,
  subLabel,
  circleClassName,
  tooltip,
  size = "md",
}) => {
  return (
    <div className="group flex w-32  flex-col items-center text-center">
      <Circle
        ref={circleRef}
        className={circleClassName}
        title={tooltip || `${label}${subLabel ? ` - ${subLabel}` : ""}`}
        size={size}
      >
        {icon}
      </Circle>
      <div className="mt-4 space-y-1">
        <p className="text-sm font-bold  bg-red-600 p-1 rounded-2xl text-white ">{label}</p>
        {subLabel && (
          <p className="text-xs text-gray-600 leading-tight">{subLabel}</p>
        )}
      </div>
    </div>
  );
};

// --- Main Component ---
export function ModernJobTrainingFlow({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const fullTimeRef = useRef<HTMLDivElement>(null);
  const partTimeRef = useRef<HTMLDivElement>(null);
  const rccRef = useRef<HTMLDivElement>(null);
  const architecturalRef = useRef<HTMLDivElement>(null);
  const steelRef = useRef<HTMLDivElement>(null);
  const electricalPlumbingRef = useRef<HTMLDivElement>(null);
  const jobTrainingCenterRef = useRef<HTMLDivElement>(null);
  const studentOutputRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center w-full max-w-7xl mx-auto p-4 md:p-8 lg:flex-row lg:gap-12 bg-gradient-to-br from-gray-50 to-gray-100",
        className
      )}
    >
      {/* Left Column: Content Section */}
      <div className="w-full lg:w-2/5 flex flex-col p-6 bg-blue-100 rounded-2xl border border-gray-200 shadow-xl mb-8 lg:mb-0">
  <div className="mb-6">
    <div className="flex items-center mb-4">
      <div className="bg-gradient-to-r from-red-500 to-red-600 w-3 h-10 rounded-full mr-3"></div>
      <h2 className="text-3xl font-bold text-gray-800">
        পেশাগত চাকরি প্রস্তুতি প্রশিক্ষণ
      </h2>
    </div>

    <p className="text-gray-600 mb-6">
      আমাদের পূর্ণাঙ্গ প্রশিক্ষণ প্রোগ্রাম শিক্ষার্থীদের হাতে-কলমে অভিজ্ঞতা ও শিল্প-উপযোগী কারিকুলামের মাধ্যমে দক্ষ পেশাজীবীতে রূপান্তর করে।
    </p>

    <div className="bg-gradient-to-br from-red-50 to-blue-50 p-5 rounded-xl border border-gray-100 mb-6">
      <h3 className="font-semibold text-gray-800 mb-3 flex items-center text-lg">
        <Icons.star className="text-red-500 mr-2" />
        প্রশিক্ষণের বৈশিষ্ট্যসমূহ
      </h3>
      <ul className="space-y-2">
        {[
          "বাস্তব প্রজেক্টে কাজের অভিজ্ঞতা",
          "শিল্প-অভিজ্ঞ প্রশিক্ষকগণ",
          "ফুলটাইম ও পার্টটাইম উভয় সুবিধা",
          "১০০% প্র্যাকটিক্যাল শেখার পদ্ধতি",
          "চাকরির জন্য প্রস্তুত করার সহায়তা"
        ].map((item, index) => (
          <li key={index} className="flex items-start">
            <Icons.check className="text-green-500 mt-1 mr-2 flex-shrink-0" />
            <span className="text-gray-700">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  </div>

  <div className="mt-auto bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
    <div className="flex items-start space-x-4">
      <div className="bg-gradient-to-br from-red-500 to-red-600 p-3 rounded-full shadow-md">
        <Icons.trainingProgram className="text-white size-8" />
      </div>
      <div>
        <h3 className="font-bold text-gray-800 text-lg">৩০ দিনের নিবিড় প্রশিক্ষণ</h3>
        <p className="text-gray-600 mt-2">
          মাত্র ১ মাসেই প্রয়োজনীয় সব দক্ষতা অর্জন করে আপনি তৈরি হবেন নির্মাণ ডকুমেন্টেশন খাতে সরাসরি কাজের জন্য।
        </p>
      </div>
    </div>
  </div>
</div>


      {/* Right Column: Flow Diagram */}
      <div
        ref={containerRef}
        className="relative flex w-full lg:w-3/5 items-center justify-center overflow-hidden rounded-2xl bg-blue-100 border border-gray-200 p-8 min-h-[550px] shadow-xl"
      >
        <div className="flex w-full items-center justify-between px-6">
          {/* Input Nodes Grid */}
          <div className="grid grid-cols-2 gap-x-10 gap-y-32">
            <TrainingNode 
              circleRef={fullTimeRef} 
              icon={<Icons.clock className="text-red-500" />} 
              label="Full Time" 
              subLabel="9am-5pm" 
              size="sm"
            />
            <TrainingNode 
              circleRef={partTimeRef} 
              icon={<Icons.clock className="text-red-500" />} 
              label="Part Time" 
              subLabel="6pm-10pm" 
              size="sm" 
            />
            <TrainingNode 
              circleRef={rccRef} 
              icon={<Icons.rcc className="text-blue-500" />} 
              label="RCC Detailing" 
              subLabel="4 Projects" 
              size="sm"
            />
            <TrainingNode 
              circleRef={steelRef} 
              icon={<Icons.steel className="text-blue-500 " />} 
              label="STEEL Drawing" 
              subLabel="Shed & Multi" 
              size="sm" 
            />
            <TrainingNode 
              circleRef={electricalPlumbingRef} 
              icon={<Icons.electricalPlumbing className="text-blue-500"/>} 
              label="Elec & Plumb" 
              subLabel="Basic Drawing" 
              size="sm"
            />
            <TrainingNode 
              circleRef={architecturalRef} 
              icon={<Icons.architectural className="text-blue-500"/>} 
              label="Architectural" 
              subLabel="Working Drawing" 
              size="sm" 
            />
          </div>

          {/* Central Node */}
          <div className="flex flex-col items-center justify-center">
            <TrainingNode
              circleRef={jobTrainingCenterRef}
              icon={<Icons.trainingProgram className="size-12 text-white" />}
              label="On JOB Training"
              subLabel="(1 Month)"
              circleClassName="bg-gradient-to-br from-red-500 to-red-600"
              tooltip="Main focus for skill development"
              size="lg"
            />
          </div>

          {/* Output Node */}
          <div className="flex flex-col items-center justify-center">
            <TrainingNode
              circleRef={studentOutputRef}
              icon={<Icons.user className="size-8 text-red-600" />}
              label="Job-Ready"
              subLabel="Student"
              circleClassName="bg-gradient-to-br from-blue-500 to-blue-600"
              tooltip="Successfully trained and job-ready"
              size="md"
            />
          </div>
        </div>

        {/* Animated Beams */}
        <AnimatedBeam duration={4} containerRef={containerRef} fromRef={partTimeRef} toRef={jobTrainingCenterRef}/>
        <AnimatedBeam duration={4} containerRef={containerRef} fromRef={fullTimeRef} toRef={jobTrainingCenterRef}/>
        <AnimatedBeam duration={4} containerRef={containerRef} fromRef={rccRef} toRef={jobTrainingCenterRef}/>
        <AnimatedBeam duration={4} containerRef={containerRef} fromRef={architecturalRef} toRef={jobTrainingCenterRef}/>
        <AnimatedBeam duration={4} containerRef={containerRef} fromRef={steelRef} toRef={jobTrainingCenterRef}/>
        <AnimatedBeam duration={4} containerRef={containerRef} fromRef={electricalPlumbingRef} toRef={jobTrainingCenterRef}/>
        <AnimatedBeam duration={3} containerRef={containerRef} fromRef={jobTrainingCenterRef} toRef={studentOutputRef}/>
      </div>
    </div>
  );
}

// --- Icons Component ---
const Icons = {
  rcc: ({ className = "text-blue-500" }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={`size-7 ${className}`}>
      <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4zM2 4v16h20V4H2zm2 2h16v12H4V6z" />
    </svg>
  ),
  steel: ({ className = "text-blue-500" }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={`size-7 ${className}`}>
      <path d="M20 6h-4V4h-2v2h-4V4H8v2H4v2h16V6zM4 10h2v10H4V10zm5 0h4v10H9V10zm5 0h2v10h-2V10zm4 0h2v10h-2V10z" />
    </svg>
  ),
  electricalPlumbing: ({ className = "text-blue-500" }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`size-7 ${className}`}>
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  ),
  architectural: ({ className = "text-blue-500" }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={`size-7 ${className}`}>
      <path d="M12 5.69l5 4.5V18h-2v-6H9v6H7v-7.81l5-4.5M12 3L2 12h3v8h14v-8h3L12 3z" />
    </svg>
  ),
  clock: ({ className = "text-red-500" }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={`size-7 ${className}`}>
      <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z" />
      <path d="M13 7h-2v5.414l3.293 3.293 1.414-1.414L13 11.586V7z" />
    </svg>
  ),
  trainingProgram: ({ className = "text-white" }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={`size-8 ${className}`}>
      <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z" />
    </svg>
  ),
  user: ({ className = "text-white" }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" xmlns="http://www.w3.org/2000/svg" className={`size-7 ${className}`}>
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  star: ({ className = "text-red-500" }: { className?: string }) => (
     <svg viewBox="0 0 24 24" fill="currentColor" className={`size-5 ${className}`}>
        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
     </svg>
  ),
  check: ({ className = "text-green-500" }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`size-5 ${className}`}>
      <path d="M20 6L9 17l-5-5" />
    </svg>
  )
};

export default ModernJobTrainingFlow;