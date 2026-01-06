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
  imagePosition?: 'left' | 'right';
  textPosition?: 'top' | 'middle' | 'bottom';
}

interface SliderProps {
  slides: Slide[];
  autoplay?: boolean;
  autoplayInterval?: number;
  variant?: 'header' | 'content';
}

const Slider: React.FC<SliderProps> = ({
  slides,
  autoplay = false,
  autoplayInterval = 5000,
  variant = 'content',
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

  // Determine if we have a background (image or custom color in future)
  const hasBackground = !!slide.backgroundImage;
  // For content variant: always use dark mode (white text). For header: only when has background
  const useDarkMode = variant === 'content' || hasBackground;
  // Show gradient background for content variant when no background image
  const showGradient = variant === 'content' && !hasBackground;

  // Rounded corners for content variant (standalone usage)
  const roundedClass = variant === 'content' ? 'rounded-2xl' : '';

  return (
    <div className={`relative overflow-hidden ${roundedClass}`}>
      {/* Slide Content */}
      <div
        className={`relative h-96 md:h-[500px] overflow-hidden ${roundedClass} ${showGradient ? 'bg-gradient-to-br from-primary-600 to-primary-800' : ''}`}
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
        {/* Overlay for background images */}
        {slide.backgroundImage && (
          <div className="absolute inset-0 bg-gradient-to-r from-primary-900/90 to-primary-900/50" />
        )}

        {/* Content */}
        <div className="relative h-full">
          <div className="container-custom px-16 md:px-20 lg:px-24 h-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
              <div className={`flex flex-col ${
                slide.textPosition === 'top' ? 'justify-start pt-8' :
                slide.textPosition === 'bottom' ? 'justify-end pb-16' :
                'justify-center -mt-12'
              } h-full ${slide.imagePosition === 'left' ? 'lg:order-2' : 'lg:order-1'}`}>
                <div>
                  <h2 className={`text-3xl md:text-4xl font-bold mb-4 leading-tight ${
                    useDarkMode ? 'text-white' : 'text-primary-600'
                  }`}>
                    {slide.title}
                  </h2>
                  <p className={`text-lg mb-6 leading-relaxed ${
                    useDarkMode ? 'text-primary-100' : 'text-gray-600'
                  }`}>
                    {slide.description}
                  </p>
                  {slide.link && !slide.link.disabled && (
                    <Link
                      href={slide.link.url}
                      target={slide.link.external ? '_blank' : undefined}
                      rel={slide.link.external ? 'noopener noreferrer' : undefined}
                      className={`inline-flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-colors group ${
                        useDarkMode
                          ? 'bg-white text-primary-600 hover:bg-primary-50'
                          : 'bg-primary-600 text-white hover:bg-primary-700'
                      }`}
                    >
                      <span>{slide.link.text}</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  )}
                </div>
              </div>
              {slide.image && (
                <div className={`hidden lg:flex lg:items-center ${slide.imagePosition === 'left' ? 'lg:order-1' : 'lg:order-2'}`}>
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
                  ? useDarkMode ? 'bg-white w-8' : 'bg-primary-600 w-8'
                  : useDarkMode ? 'bg-white/50 hover:bg-white/75' : 'bg-primary-300 hover:bg-primary-400'
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
