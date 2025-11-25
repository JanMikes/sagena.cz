'use client';

import React, { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';

interface Photo {
  url: string;
  alt?: string;
}

interface GallerySliderProps {
  photos: Photo[];
}

const GallerySlider: React.FC<GallerySliderProps> = ({ photos }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

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
          <button
            key={index}
            onClick={() => openLightbox(index)}
            className="flex-shrink-0 w-80 md:w-96 snap-center cursor-pointer"
          >
            <div className="aspect-[4/3] rounded-xl overflow-hidden shadow-lg">
              <img
                src={photo.url}
                alt={photo.alt || `Photo ${index + 1}`}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          </button>
        ))}
      </div>

      {/* Navigation Arrows */}
      {showPrevButton && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-900 p-2 rounded-full shadow-lg transition-all hover:scale-110"
          aria-label="Předchozí foto"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}

      {showNextButton && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-900 p-2 rounded-full shadow-lg transition-all hover:scale-110"
          aria-label="Další foto"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      )}

      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      {/* Lightbox */}
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={lightboxIndex}
        slides={photos.map((photo) => ({
          src: photo.url,
          alt: photo.alt,
        }))}
      />
    </div>
  );
};

export default GallerySlider;
