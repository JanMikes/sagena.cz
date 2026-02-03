'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';

interface Photo {
  url: string;
  alt?: string;
}

interface GallerySliderProps {
  photos: Photo[];
  compact?: boolean;
}

const GallerySlider: React.FC<GallerySliderProps> = ({ photos, compact = false }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  // Update currentIndex based on scroll position
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft;
      const itemWidth = compact ? container.offsetWidth : container.offsetWidth * 0.8;
      const newIndex = Math.round(scrollLeft / itemWidth);
      setCurrentIndex(Math.min(Math.max(0, newIndex), photos.length - 1));
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [compact, photos.length]);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    // In compact mode, scroll by full width (one image at a time)
    // In regular mode, scroll by 80% of container width
    const scrollAmount = compact ? container.offsetWidth : container.offsetWidth * 0.8;

    if (direction === 'left') {
      container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const showPrevButton = currentIndex > 0;
  const showNextButton = currentIndex < photos.length - 1;

  // Compact mode: single image slider for sidebar
  // Regular mode: multi-image horizontal slider
  return (
    <div className="relative group">
      {/* Slider Container */}
      <div
        ref={scrollContainerRef}
        className={`flex overflow-x-auto scroll-smooth snap-x snap-mandatory hide-scrollbar ${
          compact ? 'gap-0' : 'gap-4 pb-4'
        }`}
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {photos.map((photo, index) => (
          <button
            key={index}
            onClick={() => openLightbox(index)}
            className={`flex-shrink-0 snap-center cursor-pointer ${
              compact ? 'w-full' : 'w-80 md:w-96'
            }`}
          >
            <div className={`overflow-hidden ${
              compact
                ? 'aspect-[4/3] rounded-lg shadow-md'
                : 'aspect-[4/3] rounded-xl shadow-lg'
            }`}>
              <img
                src={photo.url}
                alt={photo.alt || `Photo ${index + 1}`}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          </button>
        ))}
      </div>

      {/* Navigation Arrows */}
      {showPrevButton && (
        <button
          onClick={() => scroll('left')}
          className={`absolute top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-900 rounded-full shadow-lg transition-all hover:scale-110 ${
            compact ? 'left-1 p-1.5' : 'left-0 p-2'
          }`}
          aria-label="Předchozí foto"
        >
          <ChevronLeft className={compact ? 'w-4 h-4' : 'w-5 h-5'} />
        </button>
      )}

      {showNextButton && (
        <button
          onClick={() => scroll('right')}
          className={`absolute top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-900 rounded-full shadow-lg transition-all hover:scale-110 ${
            compact ? 'right-1 p-1.5' : 'right-0 p-2'
          }`}
          aria-label="Další foto"
        >
          <ChevronRight className={compact ? 'w-4 h-4' : 'w-5 h-5'} />
        </button>
      )}

      {/* Photo counter for compact mode */}
      {compact && photos.length > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full">
          {currentIndex + 1} / {photos.length}
        </div>
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
        controller={{ closeOnBackdropClick: true }}
      />
    </div>
  );
};

export default GallerySlider;
