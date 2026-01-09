/**
 * DynamicZone Component
 *
 * Renders Strapi dynamic zone components based on their __component type.
 * This is the core renderer for all dynamic content from Strapi.
 */

import React from 'react';
import * as Sentry from '@sentry/nextjs';
import Heading from '@/components/typography/Heading';
import { ComponentError } from '@/components/strapi/ComponentError';
import RichText from '@/components/typography/RichText';
import Alert from '@/components/interactive/Alert';
import PopupModal from '@/components/interactive/PopupModal';
import LinksList from '@/components/navigation/LinksList';
import Video from '@/components/content/Video';
import ServiceCards from '@/components/content/ServiceCards';
import FullWidthCards from '@/components/content/FullWidthCards';
import Documents from '@/components/content/Documents';
import JobPosting from '@/components/content/JobPosting';
import PartnerLogos from '@/components/content/PartnerLogos';
import MarketingArguments from '@/components/marketing/MarketingArguments';
import Timeline from '@/components/marketing/Timeline';
import SectionDivider from '@/components/layout/SectionDivider';
import Slider from '@/components/marketing/Slider';
import GallerySlider from '@/components/media/GallerySlider';
import PhotoGallery from '@/components/media/PhotoGallery';
import Directions from '@/components/layout/Directions';
import ExpandableSections from '@/components/interactive/ExpandableSections';
import ButtonGroup from '@/components/layout/ButtonGroup';
import ContactCards from '@/components/people/ContactCards';
import AmbulanceCard from '@/components/ambulance/AmbulanceCard';
import NewsArticles from '@/components/content/NewsArticles';
import LocationCards from '@/components/content/LocationCards';
import Badges from '@/components/content/Badges';
import { getStrapiMediaURL, getIconUrlById, fetchNewsArticles, fetchIntranetNewsArticles, resolveTextLink, hasLinkDestination } from '@/lib/strapi';
import {
  PageContentComponent,
  PageSidebarComponent,
  IntranetPageContentComponent,
  IntranetPageSidebarComponent,
  ComponentsHeading,
  ComponentsText,
  ComponentsAlert,
  ComponentsPopup,
  ComponentsLinksList,
  ComponentsVideo,
  ComponentsServiceCards,
  ComponentsFullWidthCards,
  ComponentsDocuments,
  ComponentsJobPosting,
  ComponentsPartnerLogos,
  ComponentsMarketingArguments,
  ComponentsTimeline,
  ComponentsSectionDivider,
  ComponentsSlider,
  ComponentsGallerySlider,
  ComponentsPhotoGallery,
  ComponentsDirections,
  ComponentsAccordionSections,
  ElementsExpandableSection,
  ComponentsButtonGroup,
  ComponentsContactCards,
  ComponentsAmbulances,
  ComponentsNewsArticles,
  ComponentsIntranetNewsArticles,
  ComponentsLocationCards,
  ComponentsBadges,
  ComponentsImage,
  ElementsTextLink,
  StrapiMedia,
} from '@/types/strapi';

interface DynamicZoneProps {
  components: (PageContentComponent | PageSidebarComponent | IntranetPageContentComponent | IntranetPageSidebarComponent)[];
  className?: string;
  locale?: string;
  compact?: boolean;
  /** When true, DynamicZone won't add container wrappers (use when already inside a container) */
  inContainer?: boolean;
}

/**
 * Render a single component from the dynamic zone
 */
async function renderComponent(
  component: PageContentComponent | PageSidebarComponent | IntranetPageContentComponent | IntranetPageSidebarComponent,
  index: number,
  locale: string = 'cs',
  compact: boolean = false,
  inContainer: boolean = false
): Promise<React.ReactNode> {
  const { __component } = component;

  switch (__component) {
    case 'components.heading': {
      const headingComponent = component as ComponentsHeading;
      // Extract number from "h2", "h3", etc. - default to h2 if type is missing
      const typeStr = headingComponent.type || 'h2';
      const level = (parseInt(typeStr.substring(1)) || 2) as
        | 2
        | 3
        | 4
        | 5
        | 6;

      return (
        <Heading
          key={`${__component}-${component.id || index}`}
          level={level}
          id={headingComponent.anchor || undefined}
        >
          {headingComponent.text || ''}
        </Heading>
      );
    }

    case 'components.image': {
      const imageComponent = component as ComponentsImage;

      if (!imageComponent.image?.url) {
        return null;
      }

      return (
        <figure key={`${__component}-${component.id || index}`}>
          <img
            src={getStrapiMediaURL(imageComponent.image.url)}
            alt={imageComponent.image.alternativeText || ''}
            className="w-full h-auto rounded-lg"
          />
          {imageComponent.image.caption && (
            <figcaption className="mt-2 text-sm text-gray-600 text-center">
              {imageComponent.image.caption}
            </figcaption>
          )}
        </figure>
      );
    }

    case 'components.text': {
      const textComponent = component as ComponentsText;
      // Skip if no text content
      if (!textComponent.text) {
        return null;
      }
      return (
        <RichText
          key={`${__component}-${component.id || index}`}
          content={textComponent.text}
        />
      );
    }

    case 'components.alert': {
      const alertComponent = component as ComponentsAlert;
      return (
        <Alert
          key={`${__component}-${component.id || index}`}
          type={alertComponent.type || 'info'}
          title={alertComponent.title || ''}
          text={alertComponent.text ?? undefined}
        />
      );
    }

    case 'components.popup': {
      const popupComponent = component as ComponentsPopup;

      // Skip if completely empty
      if (!popupComponent.title && !popupComponent.description && !popupComponent.link) {
        return null;
      }

      // Resolve link if present
      let resolvedLink = null;
      if (popupComponent.link) {
        const resolved = resolveTextLink(popupComponent.link, locale);
        if (!resolved.disabled) {
          resolvedLink = {
            text: popupComponent.link.text || '',
            url: resolved.url,
            external: resolved.external,
          };
        }
      }

      return (
        <PopupModal
          key={`${__component}-${component.id || index}`}
          title={popupComponent.title ?? undefined}
          description={popupComponent.description ?? undefined}
          link={resolvedLink}
          rememberDismissal={popupComponent.rememberDismissal ?? false}
          popupId={popupComponent.id}
        />
      );
    }

    case 'components.links-list': {
      const linksListComponent = component as ComponentsLinksList;

      // Transform Strapi links to LinksList format - filter out invalid links
      const links = (linksListComponent.links ?? [])
        .filter((link) => link?.text)
        .map((link) => {
          const resolved = link ? resolveTextLink(link, locale) : { url: '#', external: false, disabled: true };
          return {
            title: link?.text || '',
            url: resolved.url,
            external: resolved.external,
            disabled: resolved.disabled,
            disabledReason: resolved.disabledReason,
          };
        });

      // Don't render if no valid links
      if (links.length === 0) {
        return null;
      }

      return (
        <LinksList
          key={`${__component}-${component.id || index}`}
          links={links}
          layout={linksListComponent.layout || 'Grid'}
        />
      );
    }

    case 'components.video': {
      const videoComponent = component as ComponentsVideo;
      // Skip if no YouTube ID
      if (!videoComponent.youtube_id) {
        return null;
      }
      return (
        <Video
          key={`${__component}-${component.id || index}`}
          youtubeId={videoComponent.youtube_id}
          aspectRatio={videoComponent.aspect_ratio ?? undefined}
        />
      );
    }

    case 'components.service-cards': {
      const serviceCardsComponent = component as ComponentsServiceCards;

      // Transform Strapi data to ServiceCards component props
      const cards = await Promise.all((serviceCardsComponent.cards ?? []).map(async (card) => {
        // Get icon URL from cache by ID
        // Structure: card.icon (component) → icon (relation) → icon.id
        const iconUrl = card.icon?.icon?.id
          ? await getIconUrlById(card.icon.icon.id)
          : null;

        // Resolve link if provided
        let link: { text: string; url: string } | undefined;
        if (card.link) {
          const resolved = resolveTextLink(card.link, locale);
          if (!resolved.disabled) {
            link = {
              text: card.link?.text || '',
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
      }));

      // Convert column enum to number
      const columnMap: Record<string, 2 | 3 | 4 | 5> = {
        'Two columns': 2,
        'Three columns': 3,
        'Four columns': 4,
        'Five columns': 5,
      };
      const columnsKey = serviceCardsComponent.columns ?? 'Three columns';
      const columns = columnMap[columnsKey] || 3;

      // Background wrapper classes
      const background = serviceCardsComponent.background ?? 'None';
      const hasBackground = background !== 'None';
      const backgroundClasses: Record<string, string> = {
        'None': '',
        'Primary light': 'bg-primary-50 py-16',
        'Neutral light': 'bg-neutral-50 py-16',
      };
      const bgClass = backgroundClasses[background] || '';

      const content = (
        <ServiceCards
          key={`${__component}-${component.id || index}`}
          cards={cards}
          columns={columns}
          textAlign={serviceCardsComponent.text_align ?? undefined}
          cardClickable={serviceCardsComponent.card_clickable ?? undefined}
        />
      );

      // Wrap with background if specified
      if (hasBackground) {
        return (
          <div key={`${__component}-${component.id || index}-wrapper`} className={bgClass}>
            {inContainer ? content : <div className="container-custom">{content}</div>}
          </div>
        );
      }

      // No background - container only if not already in one
      return inContainer ? content : (
        <div className="container-custom">
          {content}
        </div>
      );
    }

    case 'components.full-width-cards': {
      const fullWidthCardsComponent = component as ComponentsFullWidthCards;

      // Transform Strapi data to FullWidthCards component props
      const cards = await Promise.all((fullWidthCardsComponent.cards ?? []).map(async (card) => {
        // Get icon URL from cache by ID
        // Structure: card.icon (component) → icon (relation) → icon.id
        const iconUrl = card.icon?.icon?.id
          ? await getIconUrlById(card.icon.icon.id)
          : null;

        // Resolve link (required for full-width cards) - handle missing link gracefully
        const resolved = card.link ? resolveTextLink(card.link, locale) : null;

        return {
          icon: iconUrl,
          title: card.title || '',
          description: card.description || '',
          link: resolved ? {
            text: card.link?.text || '',
            url: resolved.url,
          } : { text: '', url: '#' },
        };
      }));

      // Background wrapper classes
      const background = fullWidthCardsComponent.background || 'None';
      const hasBackground = background !== 'None';
      const backgroundClasses: Record<string, string> = {
        'None': '',
        'Primary light': 'bg-primary-50 py-16',
        'Neutral light': 'bg-neutral-50 py-16',
      };
      const bgClass = backgroundClasses[background] || '';

      const content = (
        <FullWidthCards
          key={`${__component}-${component.id || index}`}
          cards={cards}
        />
      );

      // Wrap with background if specified
      if (hasBackground) {
        return (
          <div key={`${__component}-${component.id || index}-wrapper`} className={bgClass}>
            {inContainer ? content : <div className="container-custom">{content}</div>}
          </div>
        );
      }

      // No background - container only if not already in one
      return inContainer ? content : (
        <div className="container-custom">
          {content}
        </div>
      );
    }

    case 'components.documents': {
      const documentsComponent = component as ComponentsDocuments;

      // Transform Strapi data to Documents component props
      const documents = (documentsComponent.documents ?? []).map((doc) => {
        // Extract file data from Strapi media (Strapi v5 - no attributes wrapper)
        // URL is used directly thanks to Docker volume (same as images)
        const fileUrl = doc.file?.url || '#';

        // Extract extension from file.ext (e.g., ".pdf" -> "pdf")
        const extension = doc.file?.ext
          ? doc.file.ext.replace(/^\./, '')
          : 'file';

        // Format file size from KB to human-readable (Strapi returns size in KB)
        const sizeInKB = doc.file?.size;
        let formattedSize: string | undefined;
        if (sizeInKB !== undefined && sizeInKB !== null) {
          if (sizeInKB < 1) {
            formattedSize = `${Math.round(sizeInKB * 1024)} B`;
          } else if (sizeInKB < 1024) {
            formattedSize = `${Math.round(sizeInKB)} KB`;
          } else {
            formattedSize = `${(sizeInKB / 1024).toFixed(1)} MB`;
          }
        }

        return {
          name: doc.name || '',
          file: fileUrl,
          size: formattedSize,
          extension: extension,
        };
      });

      // Convert column enum to number
      const columnMap: Record<string, 1 | 2 | 3> = {
        'Single column': 1,
        'Two columns': 2,
        'Three columns': 3,
      };
      const documentsColumnsKey = documentsComponent.columns ?? 'Three columns';
      const columns = columnMap[documentsColumnsKey] || 3;

      return (
        <Documents
          key={`${__component}-${component.id || index}`}
          documents={documents}
          columns={columns}
        />
      );
    }

    case 'components.job-posting': {
      const jobPostingComponent = component as ComponentsJobPosting;

      // Resolve the CTA link - handle missing link gracefully
      const resolved = jobPostingComponent.cta_link ? resolveTextLink(jobPostingComponent.cta_link, locale) : null;

      return (
        <JobPosting
          key={`${__component}-${component.id || index}`}
          title={jobPostingComponent.title || ''}
          description={jobPostingComponent.description || ''}
          department={jobPostingComponent.department || ''}
          employment_type={jobPostingComponent.employment_type || ''}
          location={jobPostingComponent.location || ''}
          cta_link={resolved ? {
            text: jobPostingComponent.cta_link?.text || '',
            url: resolved.url,
          } : { text: '', url: '#' }}
        />
      );
    }

    case 'components.partner-logos': {
      const partnerLogosComponent = component as ComponentsPartnerLogos;

      // Transform Strapi data to component props
      const partners = (partnerLogosComponent.partners ?? []).map((partner) => {
        // Extract logo URL from Strapi media
        const logoUrl = partner.logo?.url
          ? getStrapiMediaURL(partner.logo.url)
          : '';

        return {
          name: partner.name || '',
          logo: logoUrl,
          url: partner.url || '',
        };
      });

      // Map column enum to number
      const columnMap: Record<string, 2 | 3 | 4 | 5 | 6> = {
        'Two columns': 2,
        'Three columns': 3,
        'Four columns': 4,
        'Five columns': 5,
        'Six columns': 6,
      };
      const partnerColumnsKey = partnerLogosComponent.columns ?? 'Six columns';
      const columns = columnMap[partnerColumnsKey] || 6;

      // Map gap enum to string
      const gapMap: Record<string, 'small' | 'medium' | 'large'> = {
        'Small spacing': 'small',
        'Medium spacing': 'medium',
        'Large spacing': 'large',
      };
      const partnerGapKey = partnerLogosComponent.gap ?? 'Medium spacing';
      const gap = gapMap[partnerGapKey] || 'medium';

      return (
        <PartnerLogos
          key={`${__component}-${component.id || index}`}
          partners={partners}
          grayscale={partnerLogosComponent.grayscale ?? undefined}
          columns={columns}
          gap={gap}
        />
      );
    }

    case 'components.marketing-arguments': {
      const marketingArgumentsComponent = component as ComponentsMarketingArguments;

      // Transform Strapi data to MarketingArguments component props
      const args = await Promise.all((marketingArgumentsComponent.arguments ?? []).map(async (arg) => {
        // Get icon URL from cache by ID if display_type is Icon
        const iconUrl = arg.display_type === 'Icon' && arg.icon?.icon?.id
          ? await getIconUrlById(arg.icon.icon.id)
          : null;

        return {
          icon: iconUrl,
          number: arg.display_type === 'Number' ? (arg.number || undefined) : undefined,
          title: arg.title || '',
          description: arg.description || '',
        };
      }));

      // Convert column enum to number
      const columnMap: Record<string, 2 | 3 | 4> = {
        'Two columns': 2,
        'Three columns': 3,
        'Four columns': 4,
      };
      const marketingColumnsKey = marketingArgumentsComponent.columns ?? 'Three columns';
      const columns = columnMap[marketingColumnsKey] || 3;

      // Background wrapper classes
      const background = marketingArgumentsComponent.background ?? 'None';
      const hasBackground = background !== 'None';
      const backgroundClasses: Record<string, string> = {
        'None': '',
        'Primary light': 'bg-primary-50 py-16',
        'Neutral light': 'bg-neutral-50 py-16',
      };
      const bgClass = backgroundClasses[background] || '';

      const content = (
        <MarketingArguments
          key={`${__component}-${component.id || index}`}
          arguments={args}
          columns={columns}
        />
      );

      // Wrap with background if specified
      if (hasBackground) {
        return (
          <div key={`${__component}-${component.id || index}-wrapper`} className={bgClass}>
            {inContainer ? content : <div className="container-custom">{content}</div>}
          </div>
        );
      }

      // No background - container only if not already in one
      return inContainer ? content : (
        <div className="container-custom">
          {content}
        </div>
      );
    }

    case 'components.timeline': {
      const timelineComponent = component as ComponentsTimeline;

      // Transform Strapi data to Timeline component props
      const items = await Promise.all((timelineComponent.items ?? []).map(async (item) => {
        // Get icon URL from icon relation if display_type is Icon
        const iconUrl = item.display_type === 'Icon' && item.icon?.image?.url
          ? getStrapiMediaURL(item.icon.image.url)
          : null;

        return {
          icon: iconUrl,
          number: item.display_type === 'Number' ? (item.number || undefined) : undefined,
          title: item.title || '',
          description: item.description || '',
        };
      }));

      return (
        <Timeline
          key={`${__component}-${component.id || index}`}
          items={items}
          compact={compact}
        />
      );
    }

    case 'components.section-divider': {
      const sectionDividerComponent = component as ComponentsSectionDivider;

      return (
        <SectionDivider
          key={`${__component}-${component.id || index}`}
          spacing={sectionDividerComponent.spacing ?? undefined}
          style={sectionDividerComponent.style ?? undefined}
          color={sectionDividerComponent.color ?? undefined}
        />
      );
    }

    case 'components.slider': {
      const sliderComponent = component as ComponentsSlider;

      // Transform Strapi data to component props
      const slides = (sliderComponent.slides ?? []).map((slide) => {
        // Extract image URLs from Strapi media
        const imageUrl = slide.image?.url
          ? getStrapiMediaURL(slide.image.url)
          : null;

        const backgroundImageUrl = slide.background_image?.url
          ? getStrapiMediaURL(slide.background_image.url)
          : null;

        // Resolve link (optional for slides)
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

      return (
        <Slider
          key={`${__component}-${component.id || index}`}
          slides={slides}
          autoplay={sliderComponent.autoplay ?? undefined}
          autoplayInterval={sliderComponent.autoplay_interval ?? undefined}
          compact={compact}
        />
      );
    }

    case 'components.gallery-slider': {
      const gallerySliderComponent = component as ComponentsGallerySlider;

      // Transform Strapi data to component props - filter out photos with missing images
      const photos = (gallerySliderComponent.photos ?? [])
        .filter((photo) => photo?.image?.url)
        .map((photo) => ({
          url: getStrapiMediaURL(photo.image!.url),
          alt: photo.image?.alternativeText || photo.image?.caption || undefined,
        }));

      // Don't render if no valid photos
      if (photos.length === 0) {
        return null;
      }

      return (
        <GallerySlider
          key={`${__component}-${component.id || index}`}
          photos={photos}
        />
      );
    }

    case 'components.photo-gallery': {
      const photoGalleryComponent = component as ComponentsPhotoGallery;

      // Convert column enum to number
      const columnMap: Record<string, 2 | 3 | 4> = {
        'Two columns': 2,
        'Three columns': 3,
        'Four columns': 4,
      };
      const photoGalleryColumnsKey = photoGalleryComponent.columns ?? 'Three columns';
      const columns = columnMap[photoGalleryColumnsKey] || 3;

      // Transform Strapi data to component props - filter out photos with missing images
      const photos = (photoGalleryComponent.photos ?? [])
        .filter((photo) => photo?.image?.url)
        .map((photo) => ({
          url: getStrapiMediaURL(photo.image!.url),
          alt: photo.image?.alternativeText || undefined,
          caption: photo.image?.caption || undefined,
        }));

      // Don't render if no valid photos
      if (photos.length === 0) {
        return null;
      }

      return (
        <PhotoGallery
          key={`${__component}-${component.id || index}`}
          photos={photos}
          columns={columns}
          compact={compact}
        />
      );
    }

    case 'components.directions': {
      const directionsComponent = component as ComponentsDirections;

      // Transform Strapi data to component props
      const instructions = (directionsComponent.instructions ?? []).map((step) => {
        // Extract icon URL from Strapi media relation
        const iconUrl = step.icon?.image?.url
          ? getStrapiMediaURL(step.icon.image.url)
          : null;

        return {
          icon: iconUrl,
          floor: step.floor || null,
          text: step.text || '',
        };
      });

      return (
        <Directions
          key={`${__component}-${component.id || index}`}
          title={directionsComponent.title || undefined}
          instructions={instructions}
          description={directionsComponent.description || undefined}
          style={directionsComponent.style || 'Style 1'}
        />
      );
    }

    case 'components.accordion-sections': {
      const expandableSectionsComponent = component as ComponentsAccordionSections;

      // Transform sections array to component props
      const sections = (expandableSectionsComponent.sections ?? []).map((section: ElementsExpandableSection) => {
        // Transform file attachments (using ElementsDocumentItem structure - no .attributes wrapper)
        const files = section.files?.map((file) => ({
          name: file.name || '',
          url: file.file?.url ? getStrapiMediaURL(file.file.url) : '',
          ext: file.file?.ext || '',
          size: file.file?.size || 0,
        })) || [];

        // Transform contacts from Strapi structure to component format
        const contacts = section.contacts?.cards?.map(card => ({
          name: card.person?.person?.name || '',
          email: card.person?.person?.email ?? undefined,
          phone: card.person?.person?.phone ?? undefined,
          photo: card.person?.person?.photo?.url ? getStrapiMediaURL(card.person.person.photo.url) : null,
          gender: card.person?.person?.gender ?? undefined,
          funkce: card.funkce ?? undefined,
        })) || [];

        // Transform photos from Strapi structure
        const photos = (section.photos ?? [])
          .filter((photo) => photo?.image?.url)
          .map((photo) => ({
            url: getStrapiMediaURL(photo.image!.url),
            alt: photo.image?.alternativeText || undefined,
            caption: photo.image?.caption || undefined,
          }));

        // Map column enum to number
        const galleryColumns: 2 | 3 | 4 = section.gallery_columns === 'Two columns' ? 2 :
                               section.gallery_columns === 'Four columns' ? 4 : 3;

        return {
          title: section.title || '',
          description: section.description ?? undefined,
          contacts,
          files,
          defaultOpen: section.default_open || false,
          photos,
          galleryColumns,
        };
      });

      return (
        <ExpandableSections
          key={`${__component}-${component.id || index}`}
          sections={sections}
          locale={locale}
        />
      );
    }

    case 'components.button-group': {
      const buttonGroupComponent = component as ComponentsButtonGroup;

      // Transform Strapi buttons to component format
      const buttons = (buttonGroupComponent.buttons ?? []).map((button) => {
        const resolved = button.link ? resolveTextLink(button.link, locale) : null;

        // Map Strapi variant/size values to component values
        const variantMap: Record<string, 'primary' | 'secondary' | 'outline' | 'ghost'> = {
          'Primary': 'primary',
          'Secondary': 'secondary',
          'Outline': 'outline',
          'Ghost': 'ghost',
        };

        const sizeMap: Record<string, 'sm' | 'md' | 'lg'> = {
          'Small': 'sm',
          'Medium': 'md',
          'Large': 'lg',
        };

        const variantKey = button.variant ?? 'Primary';
        const sizeKey = button.size ?? 'Medium';
        return {
          text: button.link?.text || '',
          url: resolved?.url || '#',
          external: resolved?.external || false,
          disabled: resolved?.disabled || !button.link,
          variant: variantMap[variantKey] || 'primary',
          size: sizeMap[sizeKey] || 'md',
        };
      });

      // Map alignment value
      const alignmentMap: Record<string, 'left' | 'center' | 'right'> = {
        'Left aligned': 'left',
        'Center aligned': 'center',
        'Right aligned': 'right',
      };

      // Map spacing value - convert Strapi format to component format
      const spacingMap: Record<string, 'small' | 'medium' | 'large'> = {
        'Small spacing': 'small',
        'Medium spacing': 'medium',
        'Large spacing': 'large',
      };

      const alignmentKey = buttonGroupComponent.alignment ?? 'Left aligned';
      const spacingKey = buttonGroupComponent.spacing ?? 'Medium spacing';

      return (
        <ButtonGroup
          key={`${__component}-${component.id || index}`}
          buttons={buttons}
          alignment={alignmentMap[alignmentKey] || 'left'}
          spacing={spacingMap[spacingKey] || 'medium'}
        />
      );
    }

    case 'components.contact-cards': {
      const contactCardsComponent = component as ComponentsContactCards;

      // Transform Strapi contact cards to component format
      const cards = (contactCardsComponent.cards ?? []).map((card) => {
        const person = card.person?.person;

        // Extract photo URL from person if available
        // Strapi v5 returns media directly when populated with specific fields
        const photoUrl = person?.photo?.url
          ? getStrapiMediaURL(person.photo.url)
          : null;

        return {
          name: person?.name || '',
          email: person?.email || null,
          phone: person?.phone || null,
          photo: photoUrl,
          gender: person?.gender || null,
          funkce: card.funkce || null,
        };
      });

      return (
        <ContactCards
          key={`${__component}-${component.id || index}`}
          cards={cards}
        />
      );
    }

    case 'components.ambulances': {
      const ambulancesComponent = component as ComponentsAmbulances;
      const items = ambulancesComponent.items;

      // Handle missing items data
      if (!items || items.length === 0) {
        return null;
      }

      // Fixed 3-column grid on desktop (not configurable per plan)
      const gridClass = compact
        ? 'grid grid-cols-1 gap-4'
        : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6';

      return (
        <div key={`${__component}-${component.id || index}`} className={gridClass}>
          {items.map((item, itemIndex) => {
            const ambulance = item.ambulance;

            if (!ambulance) return null;

            // Transform doctors data - use item-level doctors with overrides if available
            const itemDoctors = item.doctors && item.doctors.length > 0 ? item.doctors : null;
            const doctors = itemDoctors
              ? itemDoctors.map((docWrapper) => ({
                  name: docWrapper.doctor?.name || '',
                  // Use function_override if set, otherwise fall back to doctor's function
                  function: docWrapper.function_override || docWrapper.doctor?.function || undefined,
                  phone: docWrapper.doctor?.phone ?? undefined,
                  email: docWrapper.doctor?.email ?? undefined,
                  photo: docWrapper.doctor?.photo?.url
                    ? getStrapiMediaURL(docWrapper.doctor.photo.url)
                    : undefined,
                  holidays: (docWrapper.doctor?.holidays ?? []).map((h) => ({
                    from: h.from || '',
                    to: h.to || '',
                  })),
                }))
              : (ambulance.doctors ?? []).map((doctor) => ({
                  name: doctor.name,
                  function: doctor.function ?? undefined,
                  phone: doctor.phone ?? undefined,
                  email: doctor.email ?? undefined,
                  photo: doctor.photo?.url ? getStrapiMediaURL(doctor.photo.url) : undefined,
                  holidays: (doctor.holidays ?? []).map((h) => ({
                    from: h.from || '',
                    to: h.to || '',
                  })),
                }));

            // Transform nurses data
            const nurses = (ambulance.nurses ?? []).map((nurse) => ({
              name: nurse.name,
              holidays: (nurse.holidays ?? []).map((h) => ({
                from: h.from || '',
                to: h.to || '',
              })),
            }));

            // Extract nurses phones
            const nursesPhones = (ambulance.nurses_phones ?? [])
              .map((p) => p.phone)
              .filter((p): p is string => !!p);

            // Transform opening hours (grouped structure with title)
            const openingHours = (ambulance.opening_hours ?? []).map((group) => ({
              title: group.title || undefined,
              hours: (group.hours ?? []).map((entry) => ({
                day: entry.day || '',
                time: entry.time || '',
                time_afternoon: entry.time_afternoon || '',
              })),
            }));

            // Transform documents
            const documents = (item.documents ?? [])
              .filter((doc) => doc.file?.url)
              .map((doc) => ({
                name: doc.name || doc.file?.name || 'Document',
                url: getStrapiMediaURL(doc.file!.url),
              }));

            // Resolve button link
            let button: { text: string; url: string } | undefined;
            if (item.button && item.button.text) {
              const resolved = resolveTextLink(item.button, locale);
              if (!resolved.disabled && resolved.url) {
                button = { text: item.button.text, url: resolved.url };
              }
            }

            // Use component description if set, otherwise fall back to ambulance description
            const description = item.description || ambulance.description || undefined;

            return (
              <AmbulanceCard
                key={item.id || itemIndex}
                name={ambulance.name}
                phone={ambulance.phone ?? undefined}
                email={ambulance.email ?? undefined}
                doctors={doctors}
                nurses={nurses}
                nursesPhones={nursesPhones}
                nursesEmail={ambulance.nurses_email ?? undefined}
                description={description}
                documents={documents}
                button={button}
                openingHours={openingHours}
              />
            );
          })}
        </div>
      );
    }

    case 'components.news-articles': {
      const newsArticlesComponent = component as ComponentsNewsArticles;

      // Extract tag slugs for filtering (if any tags are selected)
      const tagSlugs = newsArticlesComponent.tags?.map((tag) => tag.slug) || [];

      // Fetch articles up to limit
      const limit = newsArticlesComponent.limit || 3;
      const fetchedArticles = await fetchNewsArticles(
        locale,
        tagSlugs.length > 0 ? tagSlugs : undefined,
        limit
      );

      // Display fetched articles
      const articlesToDisplay = fetchedArticles.slice(0, limit);

      // Transform articles to component props
      const articles = articlesToDisplay.map((article) => ({
        slug: article.slug,
        title: article.title,
        date: article.date || new Date().toISOString(),
        text: article.text || '',
        image: article.image?.url
          ? getStrapiMediaURL(article.image.url)
          : undefined,
        imageAlt: article.image?.alternativeText || article.title,
        tags: article.tags?.map((tag) => ({
          name: tag.name,
          slug: tag.slug,
        })),
      }));

      // Determine "show all" link behavior:
      // 1. If show_all_link is missing -> don't show button
      // 2. If show_all_link has destination (page/url/file/anchor) -> use resolved link
      // 3. If show_all_link exists but no destination -> use text (or default) + /aktuality link with tags
      let showAllLink = null;
      const tagsQuery = tagSlugs.length > 0 ? `?tags=${tagSlugs.join(',')}` : '';
      const defaultLinkText = locale === 'en' ? 'Show all' : 'Zobrazit vše';

      if (newsArticlesComponent.show_all_link) {
        if (hasLinkDestination(newsArticlesComponent.show_all_link)) {
          // Case 2: Has destination - use resolved link
          const resolved = resolveTextLink(newsArticlesComponent.show_all_link, locale);
          if (!resolved.disabled) {
            showAllLink = {
              text: newsArticlesComponent.show_all_link.text || defaultLinkText,
              url: resolved.url,
            };
          }
        } else {
          // Case 3: Exists but no destination - use text (or default) + /aktuality link with tags
          const linkText = newsArticlesComponent.show_all_link.text || defaultLinkText;
          showAllLink = {
            text: linkText,
            url: `/${locale}/aktuality/${tagsQuery}`,
          };
        }
      }
      // Case 1: No show_all_link - showAllLink stays null, button won't show

      return (
        <NewsArticles
          key={`${__component}-${component.id || index}`}
          articles={articles}
          showAllLink={showAllLink}
          showAllButtonVisible={!!showAllLink}
          locale={locale}
          compact={compact}
        />
      );
    }

    case 'components.intranet-news-articles': {
      const intranetNewsArticlesComponent = component as ComponentsIntranetNewsArticles;

      // Extract tag slugs for filtering (if any tags are selected)
      const tagSlugs = intranetNewsArticlesComponent.tags?.map((tag) => tag.slug) || [];

      // Query limit+1 articles to detect if "show all" button should appear
      const limit = intranetNewsArticlesComponent.limit || 3;
      const fetchedArticles = await fetchIntranetNewsArticles(
        locale,
        tagSlugs.length > 0 ? tagSlugs : undefined,
        limit + 1 // Fetch one extra to detect "show all" button
      );

      // Split articles: display `limit` articles, hide the last one if limit+1 were returned
      const articlesToDisplay = fetchedArticles.slice(0, limit);
      const showAllButtonVisible = fetchedArticles.length > limit;

      // Transform articles to component props with intranet URL path
      const articles = articlesToDisplay.map((article) => ({
        slug: article.slug,
        title: article.title,
        date: article.date || new Date().toISOString(),
        text: article.text || '',
        image: article.image?.url
          ? getStrapiMediaURL(article.image.url)
          : undefined,
        imageAlt: article.image?.alternativeText || article.title,
        tags: article.tags?.map((tag) => ({
          name: tag.name,
          slug: tag.slug,
        })),
        // Override the default article URL path to use intranet route
        urlPath: `/${locale}/intranet/aktuality/${article.slug}/`,
      }));

      // Resolve "show all" link if provided
      let showAllLink = null;
      if (intranetNewsArticlesComponent.show_all_link) {
        const resolved = resolveTextLink(intranetNewsArticlesComponent.show_all_link, locale);
        if (!resolved.disabled) {
          showAllLink = {
            text: intranetNewsArticlesComponent.show_all_link.text || '',
            url: resolved.url,
          };
        }
      }

      return (
        <NewsArticles
          key={`${__component}-${component.id || index}`}
          articles={articles}
          showAllLink={showAllLink}
          showAllButtonVisible={showAllButtonVisible}
          locale={locale}
          basePath={`/${locale}/intranet/aktuality`}
          compact={compact}
        />
      );
    }

    case 'components.location-cards': {
      const locationCardsComponent = component as ComponentsLocationCards;

      // Transform Strapi data to LocationCards component props
      const cards = (locationCardsComponent.cards ?? []).map((card) => {
        // Extract photo URL from Strapi media
        const photoUrl = card.photo?.url
          ? getStrapiMediaURL(card.photo.url)
          : null;

        // Resolve link if provided
        let link: { text: string; url: string; external: boolean } | undefined;
        if (card.link) {
          const resolved = resolveTextLink(card.link, locale);
          if (!resolved.disabled) {
            link = {
              text: card.link.text || '',
              url: resolved.url,
              external: resolved.external,
            };
          }
        }

        return {
          title: card.title || undefined,
          photo: photoUrl,
          photoAlt: card.photo?.alternativeText || card.title || undefined,
          address: card.address || undefined,
          phone: card.phone || undefined,
          email: card.email || undefined,
          description: card.description || undefined,
          link,
          mapLink: card.map_link || undefined,
          openingHours: card.opening_hours?.map((hours) => ({
            day: hours?.day || '',
            time: hours?.time || '',
          })) || undefined,
        };
      });

      // Convert column enum to number
      const columnMap: Record<string, 2 | 3 | 4> = {
        'Two columns': 2,
        'Three columns': 3,
        'Four columns': 4,
      };
      const columnsKey = locationCardsComponent.columns ?? 'Three columns';
      const columns = columnMap[columnsKey] || 3;

      // Background wrapper classes
      const background = locationCardsComponent.background ?? 'None';
      const hasBackground = background !== 'None';
      const backgroundClasses: Record<string, string> = {
        'None': '',
        'Primary light': 'bg-primary-50 py-16',
        'Neutral light': 'bg-neutral-50 py-16',
      };
      const bgClass = backgroundClasses[background] || '';

      const content = (
        <LocationCards
          key={`${__component}-${component.id || index}`}
          cards={cards}
          columns={columns}
        />
      );

      // Wrap with background if specified
      if (hasBackground) {
        return (
          <div key={`${__component}-${component.id || index}-wrapper`} className={bgClass}>
            {inContainer ? content : <div className="container-custom">{content}</div>}
          </div>
        );
      }

      // No background - container only if not already in one
      return inContainer ? content : (
        <div className="container-custom">
          {content}
        </div>
      );
    }

    case 'components.badges': {
      const badgesComponent = component as ComponentsBadges;

      // Map Strapi variant enum to UI Badge variant
      const variantMap: Record<string, 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'danger'> = {
        'Primary': 'primary',
        'Secondary': 'secondary',
        'Success': 'success',
        'Info': 'info',
        'Warning': 'warning',
        'Danger': 'danger',
      };

      // Map Strapi size enum to UI Badge size
      const sizeMap: Record<string, 'sm' | 'md'> = {
        'Small': 'sm',
        'Medium': 'md',
      };

      // Map Strapi alignment enum to component alignment
      const alignmentMap: Record<string, 'left' | 'center' | 'right'> = {
        'Left aligned': 'left',
        'Center aligned': 'center',
        'Right aligned': 'right',
      };

      const badges = (badgesComponent.badges ?? [])
        .filter((badge) => badge.label)
        .map((badge) => ({
          label: badge.label!,
          variant: variantMap[badge.variant || 'Primary'] || 'primary',
          size: sizeMap[badge.size || 'Medium'] || 'md',
        }));

      const alignment = alignmentMap[badgesComponent.alignment || 'Left aligned'] || 'left';

      return (
        <Badges
          key={`${__component}-${component.id || index}`}
          badges={badges}
          alignment={alignment}
        />
      );
    }

    default:
      // Log unknown component types for debugging
      console.warn(`Unknown component type: ${__component}`);
      return null;
  }
}

/**
 * Components that should render full-width (no container wrapper)
 * These components handle their own width/layout
 * Note: Slider is NOT full-width in DynamicZone - it uses container-custom.
 * The only 100%-width slider is in PageHeader (header property).
 */
const FULL_WIDTH_COMPONENTS = new Set([
  'components.popup',
]);

/**
 * Components that have their own background wrapper (applied in renderComponent)
 * These need container inside the background wrapper, not outside
 */
const BACKGROUND_COMPONENTS = new Set([
  'components.service-cards',
  'components.full-width-cards',
  'components.marketing-arguments',
  'components.location-cards',
]);

/**
 * Overlay components that render as fixed positioned overlays
 * These don't need spacing as they don't take up space in the content flow
 */
const OVERLAY_COMPONENTS = new Set([
  'components.popup',
]);

/**
 * DynamicZone component renders an array of Strapi components
 *
 * Spacing logic:
 * - Standard spacing between components: mb-12 (48px)
 * - Headings use smaller margin (mb-6 / 24px) to stay visually connected to following content
 * - Last component has no bottom margin
 *
 * Container logic:
 * - Most components wrapped in container-custom for proper content width
 * - Full-width components (Slider, SectionDivider) render edge-to-edge
 * - Components with backgrounds handle container internally
 */
const DynamicZone: React.FC<DynamicZoneProps> = async ({
  components,
  className = '',
  locale = 'cs',
  compact = false,
  inContainer = false,
}) => {
  if (!components || components.length === 0) {
    return null;
  }

  // Render all components in parallel with error isolation
  const renderedComponents = await Promise.all(
    components.map(async (component, index) => {
      try {
        return await renderComponent(component, index, locale, compact, inContainer);
      } catch (error) {
        const componentType = component?.__component || 'unknown';
        console.error(`Failed to render component ${componentType}:`, error);

        // Safely try to capture in Sentry (don't let Sentry errors break rendering)
        try {
          Sentry.captureException(error, { extra: { component: componentType, index } });
        } catch {
          // Ignore Sentry errors
        }

        return (
          <ComponentError
            key={`error-${componentType}-${index}`}
            componentType={componentType}
            showDetails={process.env.NODE_ENV === 'development'}
          />
        );
      }
    })
  );

  return (
    <div className={className}>
      {renderedComponents.map((rendered, index) => {
        if (!rendered) return null;

        const component = components[index];
        const componentType = component.__component;
        const isHeading = componentType === 'components.heading';
        const isLast = index === renderedComponents.length - 1;
        const isFullWidth = FULL_WIDTH_COMPONENTS.has(componentType);
        const hasBackground = BACKGROUND_COMPONENTS.has(componentType);
        const isOverlay = OVERLAY_COMPONENTS.has(componentType);

        // Headings get smaller margin to stay close to next component
        // Last component gets no bottom margin
        // Overlay components get no margin as they don't take up space in the content flow
        const spacingClass = isLast || isOverlay ? '' : (isHeading ? 'mb-6' : 'mb-12');

        // Full-width components don't get container wrapper
        // Background components handle their own container (see renderComponent)
        // When inContainer is true, we're already inside a container so don't add another
        const needsContainer = !inContainer && !isFullWidth && !hasBackground;

        return (
          <div key={`wrapper-${index}`} className={spacingClass}>
            {needsContainer ? (
              <div className="container-custom">
                {rendered}
              </div>
            ) : (
              rendered
            )}
          </div>
        );
      })}
    </div>
  );
};

export default DynamicZone;
