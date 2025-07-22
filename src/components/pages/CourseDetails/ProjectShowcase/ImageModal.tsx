import React, { useState, useEffect, useCallback } from 'react';

// --- Mock Data and Types (for a complete, runnable example) ---
// You can replace this with your actual data structure.
export interface Project {
  id: number;
  title: string;
  category: string;
  description: string;
  images: string[];
}


export const ImageModal = ({ images, currentIndex, onClose }: { images: string[], currentIndex: number, onClose: () => void }) => {
  const [localIndex, setLocalIndex] = useState(currentIndex);

  // Memoized functions for navigation to prevent re-renders
  const goToNext = useCallback(() => {
    setLocalIndex((prevIndex) => (prevIndex + 1) % images.length);
  }, [images.length]);

  const goToPrev = useCallback(() => {
    setLocalIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  }, [images.length]);

  // Effect for handling keyboard navigation (Escape, ArrowRight, ArrowLeft)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') goToNext();
      if (e.key === 'ArrowLeft') goToPrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    // Cleanup function to remove the event listener when the component unmounts
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose, goToNext, goToPrev]);

  // Render the modal overlay and content
  return (
    <div
      className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 transition-opacity duration-300"
      onClick={onClose} // Close modal by clicking the backdrop
    >
      {/* Main modal content container */}
      <div
        className="relative w-full h-full max-w-5xl max-h-[90vh] flex items-center justify-center p-4"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking on the image/buttons
      >
        {/* Close Button (Top Right) */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/70 hover:text-white text-5xl bg-black/40 rounded-full w-12 h-12 flex items-center justify-center z-10 transition-colors"
          aria-label="Close"
        >
          &times;
        </button>

        {/* Previous Button (Left) */}
        {images.length > 1 && (
          <button
            onClick={goToPrev}
            className="absolute left-4 sm:left-8 text-white/70 hover:text-white text-4xl bg-black/40 p-3 rounded-full transition-colors"
            aria-label="Previous image"
          >
            &#10094;
          </button>
        )}

        {/* Image Display */}
        <img
          src={images[localIndex]}
          alt={`Enlarged view ${localIndex + 1}`}
          className="max-h-full max-w-full object-contain rounded-lg shadow-2xl"
          onError={(e) => {
             (e.target as HTMLImageElement).src = 'https://placehold.co/1200x800/ff0000/ffffff?text=Image+Not+Found';
          }}
        />

        {/* Next Button (Right) */}
        {images.length > 1 && (
          <button
            onClick={goToNext}
            className="absolute right-4 sm:right-8 text-white/70 hover:text-white text-4xl bg-black/40 p-3 rounded-full transition-colors"
            aria-label="Next image"
          >
            &#10095;
          </button>
        )}
      </div>
    </div>
  );
};
