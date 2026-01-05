'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import Link from 'next/link';

/**
 * Slide item from Strapi (for CMS-driven pages)
 */
interface Slide {
  title: string;
  description: string;
  link?: {
    text: string;
    url: string;
    external?: boolean;
    disabled?: boolean;
  } | null;
  image?: string | null;
  backgroundImage?: string | null;
}

interface SliderProps {
  slides: Slide[];
  autoplay?: boolean;
  autoplayInterval?: number;
}

const Slider: React.FC<SliderProps> = ({
  slides,
  autoplay = false,
  autoplayInterval = 5000,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  useEffect(() => {
    if (autoplay && slides.length > 1) {
      const interval = setInterval(nextSlide, autoplayInterval);
      return () => clearInterval(interval);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoplay, autoplayInterval, slides.length]);

  const slide = slides[currentSlide];
  const showArrows = slides.length > 1;

  return (
    <div className="relative rounded-2xl overflow-hidden shadow-2xl">
      {/* Slide Content */}
      <div
        className="relative h-96 md:h-[500px] bg-gradient-to-br from-primary-600 to-primary-800 overflow-hidden"
        style={
          slide.backgroundImage
            ? {
                backgroundImage: `url(${slide.backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }
            : undefined
        }
      >
        {/* Overlay */}
        {slide.backgroundImage && (
          <div className="absolute inset-0 bg-gradient-to-r from-primary-900/90 to-primary-900/50" />
        )}

        {/* Content */}
        <div className="relative h-full flex items-center">
          <div className="container-custom px-16 md:px-20 lg:px-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="text-white">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
                  {slide.title}
                </h2>
                <p className="text-lg text-primary-100 mb-6 leading-relaxed">
                  {slide.description}
                </p>
                {slide.link && !slide.link.disabled && (
                  <Link
                    href={slide.link.url}
                    target={slide.link.external ? '_blank' : undefined}
                    rel={slide.link.external ? 'noopener noreferrer' : undefined}
                    className="inline-flex items-center space-x-2 bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors group"
                  >
                    <span>{slide.link.text}</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                )}
              </div>
              {slide.image && (
                <div className="hidden lg:block">
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-full h-auto object-contain drop-shadow-2xl"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      {showArrows && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-2 md:left-4 lg:left-6 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-900 p-2 md:p-3 rounded-full shadow-lg transition-all hover:scale-110 z-10"
            aria-label="Předchozí slide"
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-2 md:right-4 lg:right-6 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-900 p-2 md:p-3 rounded-full shadow-lg transition-all hover:scale-110 z-10"
            aria-label="Další slide"
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </>
      )}

      {/* Dots */}
      {slides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide
                  ? 'bg-white w-8'
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Slider;
