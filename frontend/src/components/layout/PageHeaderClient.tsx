'use client';

import React, { useState } from 'react';
import Slider from '@/components/marketing/Slider';
import ServiceCards from '@/components/content/ServiceCards';

interface SlideData {
  title: string;
  description: string;
  link: {
    text: string;
    url: string;
    external: boolean;
    disabled: boolean;
  } | null;
  image: string | null;
  backgroundImage: string | null;
  imagePosition: 'left' | 'right';
  textPosition: 'top' | 'middle' | 'bottom';
}

interface SliderPropsData {
  slides: SlideData[];
  autoplay?: boolean;
  autoplayInterval?: number;
}

interface ServiceCardData {
  icon: string | null;
  title: string;
  description: string;
  link?: { text: string; url: string };
}

interface ServiceCardsPropsData {
  cards: ServiceCardData[];
  columns: 2 | 3 | 4 | 5;
  textAlign?: 'Left aligned' | 'Center aligned';
  cardClickable?: boolean;
  showArrowBackground: boolean;
}

interface PageHeaderClientProps {
  sliderProps: SliderPropsData | null;
  serviceCardsProps: ServiceCardsPropsData | null;
  hasSlider: boolean;
  hasServiceCards: boolean;
}

const PageHeaderClient: React.FC<PageHeaderClientProps> = ({
  sliderProps,
  serviceCardsProps,
  hasSlider,
  hasServiceCards,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slidesCount = sliderProps?.slides.length ?? 0;

  // When cards are present, we render navigation below them
  const shouldRenderExternalNav = hasSlider && hasServiceCards && slidesCount > 1;

  return (
    <>
      {/* Slider - full width, content contained inside */}
      {sliderProps && (
        <div className="w-full">
          <Slider
            {...sliderProps}
            variant="header"
            currentSlide={shouldRenderExternalNav ? currentSlide : undefined}
            onSlideChange={shouldRenderExternalNav ? setCurrentSlide : undefined}
            hideNavigation={shouldRenderExternalNav}
          />
        </div>
      )}

      {/* Mobile Navigation Dots - above cards (mobile only) */}
      {shouldRenderExternalNav && (
        <div className="flex justify-center pt-4 pb-2 md:hidden">
          <div className="flex space-x-2">
            {Array.from({ length: slidesCount }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all border-2 border-white ${
                  index === currentSlide
                    ? 'bg-primary-600 w-8'
                    : 'bg-primary-300 hover:bg-primary-400'
                }`}
                aria-label={`Slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Service Cards */}
      {serviceCardsProps && (
        <div className="relative z-10 px-4 md:px-8 lg:px-16">
          <ServiceCards {...serviceCardsProps} />
        </div>
      )}

      {/* Desktop Navigation Dots - below cards (desktop only) */}
      {shouldRenderExternalNav && (
        <div className="hidden md:flex justify-center mt-6 mb-2">
          <div className="flex space-x-2">
            {Array.from({ length: slidesCount }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all border-2 border-white ${
                  index === currentSlide
                    ? 'bg-primary-600 w-8'
                    : 'bg-primary-300 hover:bg-primary-400'
                }`}
                aria-label={`Slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default PageHeaderClient;
