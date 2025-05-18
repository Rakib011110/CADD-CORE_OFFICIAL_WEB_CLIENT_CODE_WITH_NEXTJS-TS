// components/LoadingSpinner.tsx
"use client";

import { motion } from "framer-motion";

export default function LoadingSpinner() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center  p-4">
      {/* spinner */}
      <div className="relative w-24 h-24 mb-6">
        {/* outer pulse ring */}
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-red-500/20"
          animate={{ scale: [1, 1.4, 1] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
        />

        {/* rotating ring */}
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-t-red-500 border-gray-200"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
        />

        {/* inner bars */}
        <div className="absolute inset-0 flex items-center justify-center">
          {Array.from({ length: 4 }).map((_, i) => (
            <motion.span
              key={i}
              className="block w-1.5 h-10 bg-red-500 rounded"
              animate={{ y: ["0%", "-50%", "0%"] }}
              transition={{
                repeat: Infinity,
                duration: 0.8,
                ease: "easeInOut",  
                delay: i * 0.15,
              }}
            />
          ))}
        </div>
      </div>

      {/* tagline */}
      <motion.p
        className="text-red-500  font-semibold text-lg"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 3, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        CADD CORE – Knowledge to Design 
      </motion.p>
    </div>
  );
}
