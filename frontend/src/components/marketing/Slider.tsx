'use client';

import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import '@/styles/slider-animations.css';
import RichText from '@/components/typography/RichText';

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
  /** Controlled mode: current slide index */
  currentSlide?: number;
  /** Controlled mode: callback when slide changes */
  onSlideChange?: (index: number) => void;
  /** When true, hides the navigation dots (for external rendering) */
  hideNavigation?: boolean;
}

const Slider: React.FC<SliderProps> = ({
  slides,
  autoplay = false,
  autoplayInterval = 5000,
  variant = 'content',
  compact = false,
  currentSlide: controlledCurrentSlide,
  onSlideChange,
  hideNavigation = false,
}) => {
  const [internalCurrentSlide, setInternalCurrentSlide] = useState(0);
  const [maxHeight, setMaxHeight] = useState<number | null>(null);
  const slidesContainerRef = useRef<HTMLDivElement>(null);

  // Support both controlled and uncontrolled modes
  const isControlled = controlledCurrentSlide !== undefined;
  const currentSlide = isControlled ? controlledCurrentSlide : internalCurrentSlide;

  const setCurrentSlide = (index: number) => {
    if (onSlideChange) {
      onSlideChange(index);
    }
    if (!isControlled) {
      setInternalCurrentSlide(index);
    }
  };

  // Measure all slides and find the tallest one
  useLayoutEffect(() => {
    if (!slidesContainerRef.current || compact) return;

    const measureSlides = () => {
      const container = slidesContainerRef.current;
      if (!container) return;

      const slideElements = container.querySelectorAll('[data-slide-content]');
      let tallest = 0;

      slideElements.forEach((el) => {
        const height = (el as HTMLElement).offsetHeight;
        if (height > tallest) {
          tallest = height;
        }
      });

      // Add minimum heights based on variant
      const minHeight = variant === 'header' ? 360 : 280; // 360px for header, 280px for content
      setMaxHeight(Math.max(tallest, minHeight));
    };

    // Measure after render
    measureSlides();

    // Re-measure on window resize
    window.addEventListener('resize', measureSlides);
    return () => window.removeEventListener('resize', measureSlides);
  }, [slides, variant, compact]);

  const nextSlide = () => {
    setCurrentSlide((currentSlide + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((currentSlide - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  useEffect(() => {
    if (autoplay && slides.length > 1) {
      const interval = setInterval(() => {
        setCurrentSlide((currentSlide + 1) % slides.length);
      }, autoplayInterval);
      return () => clearInterval(interval);
    }
  }, [autoplay, autoplayInterval, slides.length, currentSlide]); // eslint-disable-line react-hooks/exhaustive-deps

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
            <h3 className="text-lg font-bold text-white mb-2 leading-tight line-clamp-2 animate-fade-slide-left">
              {slide.title}
            </h3>
            {slide.description && (
              <RichText
                content={slide.description}
                size="sm"
                className="text-primary-100 mb-3 leading-relaxed line-clamp-3 animate-fade-slide-left-delay-1 !text-primary-100 [&_p]:!text-primary-100 [&_strong]:!text-white [&_a]:!text-white [&_a]:underline"
              />
            )}
            {slide.link && !slide.link.disabled && (
              <Link
                href={slide.link.url}
                target={slide.link.external ? '_blank' : undefined}
                rel={slide.link.external ? 'noopener noreferrer' : undefined}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-sm font-medium bg-white text-primary-600 hover:bg-primary-50 transition-colors group animate-fade-slide-left-delay-2"
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

  // Dynamic height style based on measured content
  const containerStyle = maxHeight ? { minHeight: `${maxHeight}px` } : undefined;

  return (
    <div className={`relative overflow-hidden ${roundedClass}`} ref={slidesContainerRef}>
      {/* All Slides - rendered for measurement, only current one visible */}
      {slides.map((slideItem, index) => {
        const isActive = index === currentSlide;
        const slideHasBackground = !!slideItem.backgroundImage;
        const slideUseDarkMode = variant === 'content' || slideHasBackground;
        const slideShowGradient = variant === 'content' && !slideHasBackground;

        return (
          <div
            key={index}
            data-slide-content
            className={`${isActive ? 'relative' : 'absolute top-0 left-0 right-0 invisible pointer-events-none'} overflow-hidden ${roundedClass} ${slideShowGradient ? 'bg-gradient-to-br from-primary-600 to-primary-800' : ''}`}
            style={{
              ...(slideItem.backgroundImage
                ? {
                    backgroundImage: `url(${slideItem.backgroundImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }
                : {}),
              ...(isActive ? containerStyle : {}),
            }}
          >
            {/* Overlay for background images */}
            {slideItem.backgroundImage && (
              <div className="absolute inset-0 bg-gradient-to-r from-primary-900/90 to-primary-900/50" />
            )}

            {/* Content */}
            <div className="relative flex flex-col justify-center" style={containerStyle}>
              <div className={`${variant === 'header' ? 'container-custom pt-4 pb-0' : 'container-custom px-16 md:px-20 lg:px-24 py-8'}`}>
                <div className={`gap-4 lg:gap-8 ${slideItem.image ? 'flex flex-col lg:grid lg:grid-cols-2' : 'flex'}`}>
                  <div className={`flex flex-col ${
                    slideItem.textPosition === 'top' ? 'justify-start' :
                    slideItem.textPosition === 'bottom' ? 'justify-end' :
                    'justify-center'
                  } ${slideItem.image ? 'flex-shrink-0 lg:h-full order-1 ' + (slideItem.imagePosition === 'left' ? 'lg:order-2' : 'lg:order-1') : 'w-full'}`}>
                    <div className={slideItem.image ? '' : 'max-w-3xl'}>
                      <h2 className={`font-bold mb-3 leading-tight ${isActive ? 'animate-fade-slide-left' : ''} ${
                        variant === 'header' ? 'text-2xl md:text-3xl lg:text-4xl' : 'text-xl md:text-2xl'
                      } ${slideUseDarkMode ? 'text-white' : 'text-primary-600'}`}>
                        {slideItem.title}
                      </h2>
                      {slideItem.description && (
                        <RichText
                          content={slideItem.description}
                          size={variant === 'header' ? 'lg' : 'sm'}
                          className={`mb-5 leading-relaxed ${isActive ? 'animate-fade-slide-left-delay-1' : ''} ${
                            slideUseDarkMode
                              ? '!text-primary-100 [&_p]:!text-primary-100 [&_strong]:!text-white [&_a]:!text-white [&_a]:underline'
                              : '!text-gray-600'
                          }`}
                        />
                      )}
                      {slideItem.link && !slideItem.link.disabled && (
                        <Link
                          href={slideItem.link.url}
                          target={slideItem.link.external ? '_blank' : undefined}
                          rel={slideItem.link.external ? 'noopener noreferrer' : undefined}
                          className={`inline-flex items-center space-x-2 rounded-lg font-semibold transition-colors group ${isActive ? 'animate-fade-slide-left-delay-2' : ''} ${
                            variant === 'header' ? 'px-6 py-3' : 'px-5 py-2.5 text-sm'
                          } ${
                            slideUseDarkMode
                              ? 'bg-white text-primary-600 hover:bg-primary-50'
                              : 'bg-primary-600 text-white hover:bg-primary-700'
                          }`}
                        >
                          <span>{slideItem.link.text}</span>
                          <ArrowRight className={`group-hover:translate-x-1 transition-transform ${variant === 'header' ? 'w-5 h-5' : 'w-4 h-4'}`} />
                        </Link>
                      )}
                    </div>
                  </div>
                  {slideItem.image && (
                    <div className={`flex items-center justify-center order-2 flex-1 min-h-0 ${slideItem.imagePosition === 'left' ? 'lg:order-1' : 'lg:order-2'}`}>
                      <img
                        src={slideItem.image}
                        alt={slideItem.title}
                        className={`max-w-[200px] lg:max-w-full w-full h-auto max-h-[200px] lg:max-h-[300px] object-contain drop-shadow-2xl ${
                          isActive ? (slideItem.imagePosition === 'left' ? 'animate-fade-slide-right' : 'animate-fade-slide-left') : ''
                        }`}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}

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

      {/* Dots - hide when hideNavigation is true */}
      {slides.length > 1 && !hideNavigation && (
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
