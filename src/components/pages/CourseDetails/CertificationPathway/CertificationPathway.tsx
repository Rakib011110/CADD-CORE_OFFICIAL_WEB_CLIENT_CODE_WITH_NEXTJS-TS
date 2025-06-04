"use client";

import React, { forwardRef, useRef } from "react";
import { cn } from "@/lib/utils";
import { AnimatedBeam } from "@/components/magicui/animated-beam";

const Circle = forwardRef<
  HTMLDivElement,
  { className?: string; children?: React.ReactNode; title?: string }
>(({ className, children, title }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "z-10 flex size-12 items-center justify-center rounded-full border-2 border-gray-300 bg-white p-2 shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)] transition-all group-hover:border-blue-500 group-hover:shadow-[0_0_20px_-8px_rgba(59,130,246,0.6)]",
        className
      )}
      title={title}
    >
      {children}
    </div>
  );
});
Circle.displayName = "Circle";

const TrainingNode = ({
  circleRef,
  icon,
  label,
  subLabel,
  circleClassName,
  tooltip,
}: {
  circleRef: React.RefObject<HTMLDivElement>;
  icon: React.ReactNode;
  label: string;
  subLabel?: string;
  circleClassName?: string;
  tooltip?: string;
}) => {
  return (
    <div className="group flex w-36 flex-col items-center text-center">
      <Circle 
        ref={circleRef} 
        className={circleClassName} 
        title={tooltip || `${label}${subLabel ? ` - ${subLabel}` : ''}`}
      >
        {icon}
      </Circle>
      <div className="mt-3 space-y-0.5">
        <p className="text-sm font-semibold text-gray-800">{label}</p>
        {subLabel && (
          <p className="text-xs text-gray-500 leading-tight">{subLabel}</p>
        )}
      </div>
    </div>
  );
};

export function JobTrainingFlowDiagramV2({
  className,
}: {
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;
  const fullTimeRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;
  const partTimeRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;
  const rccRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;
  const architecturalRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;
  const steelRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;
  const electricalPlumbingRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;
  const jobTrainingCenterRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;
  const studentOutputRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;

  return (
    <div
      className={cn(
        "relative flex w-full items-center justify-center overflow-hidden rounded-xl border bg-background p-8 md:p-12 min-h-[700px] shadow-lg",
        className
      )}
      ref={containerRef}
    >
      <div className="flex size-full max-w-4xl flex-row items-center justify-between gap-8 md:gap-16">
        
        {/* Input Nodes Section */}
        <div className="flex flex-row gap-6 md:gap-12">
          {/* Column 1 */}
          <div className="flex flex-col justify-center gap-10 md:gap-12">
            <TrainingNode
              circleRef={fullTimeRef}
              icon={<Icons.clock className="text-purple-600" />}
              label="Full Time"
              subLabel="9am to 5pm"
            />
            <TrainingNode
              circleRef={rccRef}
              icon={<Icons.rcc />}
              label="RCC Detailing"
              subLabel="4 Projects (A-Z)"
            />
            <TrainingNode
              circleRef={steelRef}
              icon={<Icons.steel />}
              label="STEEL Drawing"
              subLabel="Shed & Multistoried"
            />
          </div>
          
          {/* Column 2 */}
          <div className="flex flex-col justify-center gap-10 md:gap-12">
            <TrainingNode
              circleRef={partTimeRef}
              icon={<Icons.clock className="text-indigo-600" />}
              label="Part Time"
              subLabel="6pm to 10pm"
            />
            <TrainingNode
              circleRef={architecturalRef}
              icon={<Icons.architectural />}
              label="Architectural"
              subLabel="Working Drawing"
            />
            <TrainingNode
              circleRef={electricalPlumbingRef}
              icon={<Icons.electricalPlumbing />}
              label="Elec & Plumb"
              subLabel="Basic Drawing"
            />
          </div>
        </div>

        {/* Central Node */}
        <div className="flex flex-col items-center justify-center mx-4 md:mx-8">
          <TrainingNode
            circleRef={jobTrainingCenterRef}
            icon={<Icons.trainingProgram />}
            label="On JOB Training"
            subLabel="(1 Month)"
            circleClassName="size-20 bg-gradient-to-br from-orange-500 to-orange-600 border-orange-700 hover:from-orange-600 hover:to-orange-700"
            tooltip="Main focus for student skill development and job readiness."
          />
        </div>

        {/* Output Node */}
        <div className="flex flex-col items-center justify-center">
          <TrainingNode
            circleRef={studentOutputRef}
            icon={<Icons.user />}
            label="Job-Ready"
            subLabel="Student"
            circleClassName="size-16 bg-gradient-to-br from-green-500 to-green-600 border-green-700 hover:from-green-600 hover:to-green-700"
            tooltip="Successfully trained and ready for the job market."
          />
        </div>
      </div>

      {/* Animated Beams */}
      <AnimatedBeam duration={3} containerRef={containerRef} fromRef={fullTimeRef} toRef={jobTrainingCenterRef} />
      <AnimatedBeam duration={3} containerRef={containerRef} fromRef={partTimeRef} toRef={jobTrainingCenterRef} />
      <AnimatedBeam duration={3} containerRef={containerRef} fromRef={rccRef} toRef={jobTrainingCenterRef} />
      <AnimatedBeam duration={3} containerRef={containerRef} fromRef={architecturalRef} toRef={jobTrainingCenterRef} />
      <AnimatedBeam duration={3} containerRef={containerRef} fromRef={steelRef} toRef={jobTrainingCenterRef} />
      <AnimatedBeam duration={3} containerRef={containerRef} fromRef={electricalPlumbingRef} toRef={jobTrainingCenterRef} />
      <AnimatedBeam duration={3} containerRef={containerRef} fromRef={jobTrainingCenterRef} toRef={studentOutputRef} />
    </div>
  );
}

// Icons Component
const Icons = {
  rcc: ({ className = "text-blue-600" }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={`h-6 w-6 ${className}`}>
      <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4zM2 4v16h20V4H2zm2 2h16v12H4V6z" />
    </svg>
  ),
  steel: ({ className = "text-gray-700" }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={`h-6 w-6 ${className}`}>
      <path d="M20 6h-4V4h-2v2h-4V4H8v2H4v2h16V6zM4 10h2v10H4V10zm5 0h4v10H9V10zm5 0h2v10h-2V10zm4 0h2v10h-2V10z" />
    </svg>
  ),
  electricalPlumbing: ({ className = "text-yellow-500" }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={`h-6 w-6 ${className}`}>
      <g opacity="0.7">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
      </g>
      <path d="M7 19c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM16 5c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM13.67 7.02l-1.94 1.94L10.07 7.3A5.002 5.002 0 007.3 10.07l-1.66 1.66 1.94 1.94L9.24 12a2.99 2.99 0 010-2.06l2.72-2.72a2.99 2.99 0 012.06 0L16.76 12l1.66-1.66-1.94-1.94-1.06 1.06A5.002 5.002 0 0013.67 7.02z" />
    </svg>
  ),
  architectural: ({ className = "text-green-600" }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={`h-6 w-6 ${className}`}>
      <path d="M12 5.69l5 4.5V18h-2v-6H9v6H7v-7.81l5-4.5M12 3L2 12h3v8h14v-8h3L12 3z" />
    </svg>
  ),
  clock: ({ className = "text-purple-600" }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={`h-6 w-6 ${className}`}>
      <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"></path>
      <path d="M13 7h-2v5.414l3.293 3.293 1.414-1.414L13 11.586V7z"></path>
    </svg>
  ),
  trainingProgram: ({ className = "text-white " }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={`h-10 w-10 ${className}`}>
      <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z" />
    </svg>
  ),
  user: ({ className = "text-white" }: { className?: string }) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      xmlns="http://www.w3.org/2000/svg"
      className={`h-8 w-8 ${className}`}
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
};

export default JobTrainingFlowDiagramV2;