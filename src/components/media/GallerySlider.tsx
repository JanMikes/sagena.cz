'use client';

import React, { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Photo {
  url: string;
  alt?: string;
}

interface GallerySliderProps {
  photos: Photo[];
}

const GallerySlider: React.FC<GallerySliderProps> = ({ photos }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    const scrollAmount = container.offsetWidth * 0.8;

    if (direction === 'left') {
      container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      setCurrentIndex(Math.max(0, currentIndex - 1));
    } else {
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      setCurrentIndex(Math.min(photos.length - 1, currentIndex + 1));
    }
  };

  const showPrevButton = currentIndex > 0;
  const showNextButton = currentIndex < photos.length - 1;

  return (
    <div className="relative group">
      {/* Slider Container */}
      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto gap-4 scroll-smooth snap-x snap-mandatory hide-scrollbar pb-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {photos.map((photo, index) => (
          <div
            key={index}
            className="flex-shrink-0 w-80 md:w-96 snap-center"
          >
            <div className="aspect-[4/3] rounded-xl overflow-hidden shadow-lg">
              <img
                src={photo.url}
                alt={photo.alt || `Photo ${index + 1}`}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {showPrevButton && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-900 p-3 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100 hover:scale-110"
          aria-label="Předchozí foto"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {showNextButton && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-900 p-3 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100 hover:scale-110"
          aria-label="Další foto"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}

      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default GallerySlider;
