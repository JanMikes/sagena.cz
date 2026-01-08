'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import '@/styles/slider-animations.css';

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
  compact?: boolean;
}

const Slider: React.FC<SliderProps> = ({
  slides,
  autoplay = false,
  autoplayInterval = 5000,
  variant = 'content',
  compact = false,
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
  const roundedClass = variant === 'content' || compact ? 'rounded-2xl' : '';

  // Compact mode: vertical layout for sidebar
  if (compact) {
    return (
      <div className="relative overflow-hidden rounded-xl">
        {/* Slide Content - Vertical Layout */}
        <div className="relative overflow-hidden rounded-xl" key={currentSlide}>
          {/* Image Section */}
          {slide.image ? (
            <div className="relative h-32 overflow-hidden">
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover animate-fade-slide-up-small"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary-900/60 to-transparent" />
            </div>
          ) : slide.backgroundImage ? (
            <div
              className="relative h-32 overflow-hidden animate-fade-slide-up-small"
              style={{
                backgroundImage: `url(${slide.backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-primary-900/80 to-primary-900/40" />
            </div>
          ) : (
            <div className="relative h-32 overflow-hidden bg-gradient-to-br from-primary-600 to-primary-800" />
          )}

          {/* Text Section */}
          <div className="bg-gradient-to-br from-primary-600 to-primary-800 px-4 py-4">
            <h3 className="text-lg font-bold text-white mb-2 leading-tight line-clamp-2 animate-fade-slide-up">
              {slide.title}
            </h3>
            <p className="text-sm text-primary-100 mb-3 leading-relaxed line-clamp-3 animate-fade-slide-up-delay-1">
              {slide.description}
            </p>
            {slide.link && !slide.link.disabled && (
              <Link
                href={slide.link.url}
                target={slide.link.external ? '_blank' : undefined}
                rel={slide.link.external ? 'noopener noreferrer' : undefined}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-sm font-medium bg-white text-primary-600 hover:bg-primary-50 transition-colors group animate-fade-slide-up-delay-2"
              >
                <span>{slide.link.text}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            )}
          </div>
        </div>

        {/* Navigation Arrows - Compact */}
        {showArrows && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-1.5 top-16 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-900 p-1.5 rounded-full shadow-md transition-all hover:scale-110 z-10"
              aria-label="Předchozí slide"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-1.5 top-16 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-900 p-1.5 rounded-full shadow-md transition-all hover:scale-110 z-10"
              aria-label="Další slide"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}

        {/* Dots - Compact */}
        {slides.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1.5">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentSlide
                    ? 'bg-white w-5'
                    : 'bg-white/50 hover:bg-white/75'
                }`}
                aria-label={`Slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${roundedClass}`}>
      {/* Slide Content */}
      <div
        className={`relative overflow-hidden ${roundedClass} ${showGradient ? 'bg-gradient-to-br from-primary-600 to-primary-800' : ''} ${
          variant === 'header' ? 'h-96 md:h-[500px]' : 'min-h-[280px] md:min-h-[320px]'
        }`}
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
        <div className="absolute inset-0 flex flex-col">
          <div className="container-custom px-16 md:px-20 lg:px-24 flex-1 flex flex-col" key={currentSlide}>
            <div className={`gap-8 flex-1 ${slide.image ? 'grid grid-cols-1 lg:grid-cols-2' : 'flex'}`}>
              <div className={`flex flex-col ${
                slide.textPosition === 'top' ? 'justify-start pt-8' :
                slide.textPosition === 'bottom' ? 'justify-end pb-16' :
                variant === 'header' ? 'justify-center -mt-12' : 'justify-center py-8'
              } h-full ${slide.image ? (slide.imagePosition === 'left' ? 'lg:order-2' : 'lg:order-1') : 'w-full'}`}>
                <div className={slide.image ? '' : 'max-w-3xl'}>
                  <h2 className={`font-bold mb-3 leading-tight animate-fade-slide-up ${
                    variant === 'header' ? 'text-3xl md:text-4xl' : 'text-xl md:text-2xl'
                  } ${useDarkMode ? 'text-white' : 'text-primary-600'}`}>
                    {slide.title}
                  </h2>
                  <p className={`mb-5 leading-relaxed animate-fade-slide-up-delay-1 ${
                    variant === 'header' ? 'text-lg' : 'text-sm md:text-base'
                  } ${useDarkMode ? 'text-primary-100' : 'text-gray-600'}`}>
                    {slide.description}
                  </p>
                  {slide.link && !slide.link.disabled && (
                    <Link
                      href={slide.link.url}
                      target={slide.link.external ? '_blank' : undefined}
                      rel={slide.link.external ? 'noopener noreferrer' : undefined}
                      className={`inline-flex items-center space-x-2 rounded-lg font-semibold transition-colors group animate-fade-slide-up-delay-2 ${
                        variant === 'header' ? 'px-6 py-3' : 'px-5 py-2.5 text-sm'
                      } ${
                        useDarkMode
                          ? 'bg-white text-primary-600 hover:bg-primary-50'
                          : 'bg-primary-600 text-white hover:bg-primary-700'
                      }`}
                    >
                      <span>{slide.link.text}</span>
                      <ArrowRight className={`group-hover:translate-x-1 transition-transform ${variant === 'header' ? 'w-5 h-5' : 'w-4 h-4'}`} />
                    </Link>
                  )}
                </div>
              </div>
              {slide.image && (
                <div className={`hidden lg:flex lg:items-center ${slide.imagePosition === 'left' ? 'lg:order-1' : 'lg:order-2'}`}>
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className={`w-full h-auto object-contain drop-shadow-2xl ${
                      slide.imagePosition === 'left' ? 'animate-fade-slide-right' : 'animate-fade-slide-left'
                    }`}
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
        <div className={`absolute left-1/2 -translate-x-1/2 flex space-x-2 ${
          variant === 'header' ? 'bottom-28 md:bottom-32' : 'bottom-6'
        }`}>
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all border-2 border-white ${
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
