'use client';

import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface Photo {
  url: string;
  alt?: string;
  caption?: string;
}

interface PhotoGalleryProps {
  photos: Photo[];
  columns?: 2 | 3 | 4;
}

const PhotoGallery: React.FC<PhotoGalleryProps> = ({ photos, columns = 3 }) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = 'unset';
  };

  const nextPhoto = () => {
    setCurrentIndex((prev) => (prev + 1) % photos.length);
  };

  const prevPhoto = () => {
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const gridCols = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-2 lg:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <>
      {/* Gallery Grid */}
      <div className={`grid grid-cols-1 ${gridCols[columns]} gap-4`}>
        {photos.map((photo, index) => (
          <button
            key={index}
            onClick={() => openLightbox(index)}
            className="relative aspect-square overflow-hidden rounded-lg group cursor-pointer"
          >
            <img
              src={photo.url}
              alt={photo.alt || `Photo ${index + 1}`}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300" />
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4">
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 p-2 text-white hover:bg-white/10 rounded-lg transition-colors z-10"
            aria-label="Zavřít"
          >
            <X className="w-8 h-8" />
          </button>

          {/* Previous Button */}
          {photos.length > 1 && (
            <button
              onClick={prevPhoto}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 text-white hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Předchozí foto"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
          )}

          {/* Image */}
          <div className="max-w-6xl max-h-[90vh] w-full h-full flex flex-col items-center justify-center">
            <img
              src={photos[currentIndex].url}
              alt={photos[currentIndex].alt || `Photo ${currentIndex + 1}`}
              className="max-w-full max-h-full object-contain"
            />
            {photos[currentIndex].caption && (
              <p className="text-white text-center mt-4 text-lg">
                {photos[currentIndex].caption}
              </p>
            )}
          </div>

          {/* Next Button */}
          {photos.length > 1 && (
            <button
              onClick={nextPhoto}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 text-white hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Další foto"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          )}

          {/* Counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm">
            {currentIndex + 1} / {photos.length}
          </div>
        </div>
      )}
    </>
  );
};

export default PhotoGallery;
