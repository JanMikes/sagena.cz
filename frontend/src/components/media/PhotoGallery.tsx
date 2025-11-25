'use client';

import React, { useState } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';

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
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={currentIndex}
        slides={photos.map((photo) => ({
          src: photo.url,
          alt: photo.alt,
          title: photo.caption,
        }))}
      />
    </>
  );
};

export default PhotoGallery;
