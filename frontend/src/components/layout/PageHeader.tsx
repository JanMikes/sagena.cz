/**
 * PageHeader Component
 *
 * Renders page header with optional slider and service cards.
 * Layout: Slider at 100% width, service-cards overlaps with negative margin.
 */

import React from 'react';
import Slider from '@/components/marketing/Slider';
import ServiceCards from '@/components/content/ServiceCards';
import { getStrapiMediaURL, getIconUrlById, resolveTextLink } from '@/lib/strapi';
import { ComponentsPageHeader } from '@/types/strapi';

interface PageHeaderProps {
  header: ComponentsPageHeader;
  locale?: string;
}

const PageHeader: React.FC<PageHeaderProps> = async ({ header, locale = 'cs' }) => {
  const hasSlider = header.slider && (header.slider.slides?.length ?? 0) > 0;
  const hasServiceCards = header.service_cards && (header.service_cards.cards?.length ?? 0) > 0;

  // If neither component has content, don't render
  if (!hasSlider && !hasServiceCards) {
    return null;
  }

  // Transform slider data (same logic as DynamicZone)
  let sliderProps = null;
  if (hasSlider && header.slider) {
    const slides = (header.slider.slides ?? []).map((slide) => {
      const imageUrl = slide.image?.url
        ? getStrapiMediaURL(slide.image.url)
        : null;

      const backgroundImageUrl = slide.background_image?.url
        ? getStrapiMediaURL(slide.background_image.url)
        : null;

      let link = null;
      if (slide.link) {
        const resolved = resolveTextLink(slide.link, locale);
        link = {
          text: slide.link.text || '',
          url: resolved.url,
          external: resolved.external,
          disabled: resolved.disabled,
        };
      }

      return {
        title: slide.title || '',
        description: slide.description || '',
        link,
        image: imageUrl,
        backgroundImage: backgroundImageUrl,
        imagePosition: slide.image_position || 'right',
        textPosition: slide.text_position || 'middle',
      };
    });

    sliderProps = {
      slides,
      autoplay: header.slider.autoplay ?? undefined,
      autoplayInterval: header.slider.autoplay_interval ?? undefined,
    };
  }

  // Transform service cards data (same logic as DynamicZone)
  let serviceCardsProps = null;
  if (hasServiceCards && header.service_cards) {
    const cards = await Promise.all(
      (header.service_cards.cards ?? []).map(async (card) => {
        const iconUrl = card.icon?.icon?.id
          ? await getIconUrlById(card.icon.icon.id)
          : null;

        let link: { text: string; url: string } | undefined;
        if (card.link) {
          const resolved = resolveTextLink(card.link, locale);
          if (!resolved.disabled) {
            link = {
              text: card.link.text || '',
              url: resolved.url,
            };
          }
        }

        return {
          icon: iconUrl,
          title: card.title || '',
          description: card.description || '',
          link,
        };
      })
    );

    // Column mapping
    const columnMap: Record<string, 2 | 3 | 4 | 5> = {
      'Two columns': 2,
      'Three columns': 3,
      'Four columns': 4,
      'Five columns': 5,
    };
    const columnsKey = header.service_cards.columns ?? 'Three columns';

    serviceCardsProps = {
      cards,
      columns: columnMap[columnsKey] || 3,
      textAlign: header.service_cards.text_align ?? undefined,
      cardClickable: header.service_cards.card_clickable ?? undefined,
      showArrowBackground: false,
    };
  }

  return (
    <div className="relative">
      {/* Slider - 100% width */}
      {sliderProps && (
        <div className="w-full">
          <Slider {...sliderProps} variant="header" />
        </div>
      )}

      {/* Service Cards - overlaps with negative margin when slider present */}
      {serviceCardsProps && (
        <div
          className={`
            relative z-10 px-4 md:px-8 lg:px-16
            ${hasSlider ? '-mt-16 md:-mt-24' : ''}
          `}
        >
          <ServiceCards {...serviceCardsProps} />
        </div>
      )}
    </div>
  );
};

export default PageHeader;
