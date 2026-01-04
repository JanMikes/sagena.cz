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
import DoctorProfile from '@/components/people/DoctorProfile';
import NewsArticles from '@/components/content/NewsArticles';
import { getStrapiMediaURL, getIconUrlById, fetchNewsArticles, fetchIntranetNewsArticles, resolveTextLink } from '@/lib/strapi';
import {
  PageContentComponent,
  PageSidebarComponent,
  IntranetPageContentComponent,
  IntranetPageSidebarComponent,
  ComponentsHeading,
  ComponentsText,
  ComponentsAlert,
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
  ComponentsDoctorProfile,
  ComponentsNewsArticles,
  ComponentsIntranetNewsArticles,
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
      // Extract number from "h2", "h3", etc.
      const level = parseInt(headingComponent.type.substring(1)) as
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
          {headingComponent.text}
        </Heading>
      );
    }

    case 'components.text': {
      const textComponent = component as ComponentsText;
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
          type={alertComponent.type}
          title={alertComponent.title}
          text={alertComponent.text}
        />
      );
    }

    case 'components.links-list': {
      const linksListComponent = component as ComponentsLinksList;

      // Transform Strapi links to LinksList format
      const links = (linksListComponent.links ?? []).map((link) => {
        const resolved = resolveTextLink(link, locale);
        return {
          title: link.text,
          url: resolved.url,
          external: resolved.external,
          disabled: resolved.disabled,
          disabledReason: resolved.disabledReason,
        };
      });

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
      return (
        <Video
          key={`${__component}-${component.id || index}`}
          youtubeId={videoComponent.youtube_id}
          aspectRatio={videoComponent.aspect_ratio}
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
              text: card.link.text,
              url: resolved.url,
            };
          }
        }

        return {
          icon: iconUrl,
          title: card.title,
          description: card.description,
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
      const columns = columnMap[serviceCardsComponent.columns] || 3;

      // Background wrapper classes
      const background = serviceCardsComponent.background || 'None';
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
          textAlign={serviceCardsComponent.text_align}
          cardClickable={serviceCardsComponent.card_clickable}
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

        // Resolve link (required for full-width cards)
        const resolved = resolveTextLink(card.link, locale);

        return {
          icon: iconUrl,
          title: card.title,
          description: card.description,
          link: {
            text: card.link.text,
            url: resolved.url,
          },
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
          name: doc.name,
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
      const columns = columnMap[documentsComponent.columns] || 3;

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

      // Resolve the CTA link
      const resolved = resolveTextLink(jobPostingComponent.cta_link, locale);

      return (
        <JobPosting
          key={`${__component}-${component.id || index}`}
          title={jobPostingComponent.title}
          description={jobPostingComponent.description}
          department={jobPostingComponent.department}
          employment_type={jobPostingComponent.employment_type}
          location={jobPostingComponent.location}
          cta_link={{
            text: jobPostingComponent.cta_link.text,
            url: resolved.url,
          }}
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
          name: partner.name,
          logo: logoUrl,
          url: partner.url,
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
      const columns = columnMap[partnerLogosComponent.columns] || 6;

      // Map gap enum to string
      const gapMap: Record<string, 'small' | 'medium' | 'large'> = {
        'Small spacing': 'small',
        'Medium spacing': 'medium',
        'Large spacing': 'large',
      };
      const gap = gapMap[partnerLogosComponent.gap] || 'medium';

      return (
        <PartnerLogos
          key={`${__component}-${component.id || index}`}
          partners={partners}
          grayscale={partnerLogosComponent.grayscale}
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
          title: arg.title,
          description: arg.description,
        };
      }));

      // Convert column enum to number
      const columnMap: Record<string, 2 | 3 | 4> = {
        'Two columns': 2,
        'Three columns': 3,
        'Four columns': 4,
      };
      const columns = columnMap[marketingArgumentsComponent.columns] || 3;

      // Background wrapper classes
      const background = marketingArgumentsComponent.background || 'None';
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
          title: item.title,
          description: item.description,
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
          spacing={sectionDividerComponent.spacing}
          style={sectionDividerComponent.style}
          color={sectionDividerComponent.color}
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
            text: slide.link.text,
            url: resolved.url,
            external: resolved.external,
            disabled: resolved.disabled,
          };
        }

        return {
          title: slide.title,
          description: slide.description,
          link,
          image: imageUrl,
          backgroundImage: backgroundImageUrl,
        };
      });

      return (
        <Slider
          key={`${__component}-${component.id || index}`}
          slides={slides}
          autoplay={sliderComponent.autoplay}
          autoplayInterval={sliderComponent.autoplay_interval || 5000}
        />
      );
    }

    case 'components.gallery-slider': {
      const gallerySliderComponent = component as ComponentsGallerySlider;

      // Transform Strapi data to component props
      const photos = (gallerySliderComponent.photos ?? []).map((photo) => {
        return {
          url: getStrapiMediaURL(photo.image.url),
          alt: photo.image.alternativeText || photo.image.caption || undefined,
        };
      });

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
      const columns = columnMap[photoGalleryComponent.columns] || 3;

      // Transform Strapi data to component props
      const photos = (photoGalleryComponent.photos ?? []).map((photo) => {
        return {
          url: getStrapiMediaURL(photo.image.url),
          alt: photo.image.alternativeText || undefined,
          caption: photo.image.caption || undefined,
        };
      });

      return (
        <PhotoGallery
          key={`${__component}-${component.id || index}`}
          photos={photos}
          columns={columns}
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
          description={directionsComponent.description}
          style={directionsComponent.style}
        />
      );
    }

    case 'components.accordion-sections': {
      const expandableSectionsComponent = component as ComponentsAccordionSections;

      // Transform sections array to component props
      const sections = (expandableSectionsComponent.sections ?? []).map((section: ElementsExpandableSection) => {
        // Transform file attachments (using ElementsDocumentItem structure - no .attributes wrapper)
        const files = section.files?.map((file) => ({
          name: file.name,
          url: file.file?.url ? getStrapiMediaURL(file.file.url) : '',
          ext: file.file?.ext || '',
          size: file.file?.size || 0,
        })) || [];

        // Transform contacts from Strapi structure to component format
        const contacts = section.contacts?.cards?.map(card => ({
          name: card.person?.person?.name || '',
          email: card.person?.person?.email,
          phone: card.person?.person?.phone,
          photo: card.person?.person?.photo?.url ? getStrapiMediaURL(card.person.person.photo.url) : null,
          gender: card.person?.person?.gender,
        })) || [];

        return {
          title: section.title,
          description: section.description || null,
          contacts,
          files,
          defaultOpen: section.default_open || false,
        };
      });

      return (
        <ExpandableSections
          key={`${__component}-${component.id || index}`}
          sections={sections}
        />
      );
    }

    case 'components.button-group': {
      const buttonGroupComponent = component as ComponentsButtonGroup;

      // Transform Strapi buttons to component format
      const buttons = (buttonGroupComponent.buttons ?? []).map((button) => {
        const resolved = resolveTextLink(button.link, locale);

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

        return {
          text: button.link.text,
          url: resolved.url,
          external: resolved.external,
          disabled: resolved.disabled,
          variant: variantMap[button.variant] || 'primary',
          size: sizeMap[button.size] || 'md',
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

      return (
        <ButtonGroup
          key={`${__component}-${component.id || index}`}
          buttons={buttons}
          alignment={alignmentMap[buttonGroupComponent.alignment] || 'left'}
          spacing={spacingMap[buttonGroupComponent.spacing] || 'medium'}
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
        };
      });

      return (
        <ContactCards
          key={`${__component}-${component.id || index}`}
          cards={cards}
        />
      );
    }

    case 'components.doctor-profile': {
      const doctorProfileComponent = component as ComponentsDoctorProfile;
      const profile = doctorProfileComponent.profile;
      const person = profile.person?.person;

      // Extract photo URL from person if available
      // Strapi v5 returns media directly when populated with specific fields
      const photoUrl = person?.photo?.url
        ? getStrapiMediaURL(person.photo.url)
        : undefined;

      // Transform opening hours
      const openingHours = profile.openingHours?.map((hours) => ({
        day: hours.day,
        time: hours.time,
      })) || [];

      // Transform holiday
      const holiday = profile.holiday ? {
        from: profile.holiday.from,
        to: profile.holiday.to,
      } : undefined;

      return (
        <DoctorProfile
          key={`${__component}-${component.id || index}`}
          ambulanceTitle={profile.ambulanceTitle || undefined}
          photo={photoUrl}
          name={person?.name || ''}
          department={profile.department}
          positions={profile.positions?.map(p => p.title) || []}
          phone={person?.phone ?? undefined}
          email={person?.email ?? undefined}
          openingHours={openingHours}
          holiday={holiday}
        />
      );
    }

    case 'components.news-articles': {
      const newsArticlesComponent = component as ComponentsNewsArticles;

      // Extract tag slugs for filtering (if any tags are selected)
      const tagSlugs = newsArticlesComponent.tags?.map((tag) => tag.slug) || [];

      // Query limit+1 articles to detect if "show all" button should appear
      const limit = newsArticlesComponent.limit || 3;
      const fetchedArticles = await fetchNewsArticles(
        locale,
        tagSlugs.length > 0 ? tagSlugs : undefined,
        limit + 1 // Fetch one extra to detect "show all" button
      );

      // Split articles: display `limit` articles, hide the last one if limit+1 were returned
      const articlesToDisplay = fetchedArticles.slice(0, limit);
      const showAllButtonVisible = fetchedArticles.length > limit;

      // Transform articles to component props
      const articles = articlesToDisplay.map((article) => ({
        slug: article.slug,
        title: article.title,
        date: article.date || new Date().toISOString(),
        text: article.text || '',
        image: article.image?.attributes?.url
          ? getStrapiMediaURL(article.image.attributes.url)
          : undefined,
        imageAlt: article.image?.attributes?.alternativeText || article.title,
        tags: article.tags?.map((tag) => ({
          name: tag.name,
          slug: tag.slug,
        })),
      }));

      // Resolve "show all" link if provided
      let showAllLink = null;
      if (newsArticlesComponent.show_all_link) {
        const resolved = resolveTextLink(newsArticlesComponent.show_all_link, locale);
        if (!resolved.disabled) {
          showAllLink = {
            text: newsArticlesComponent.show_all_link.text,
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
        image: article.image?.attributes?.url
          ? getStrapiMediaURL(article.image.attributes.url)
          : undefined,
        imageAlt: article.image?.attributes?.alternativeText || article.title,
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
            text: intranetNewsArticlesComponent.show_all_link.text,
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
 */
const FULL_WIDTH_COMPONENTS = new Set([
  'components.slider',
  'components.section-divider',
]);

/**
 * Components that have their own background wrapper (applied in renderComponent)
 * These need container inside the background wrapper, not outside
 */
const BACKGROUND_COMPONENTS = new Set([
  'components.service-cards',
  'components.full-width-cards',
  'components.marketing-arguments',
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
        console.error(`Failed to render component ${component.__component}:`, error);
        Sentry.captureException(error, { extra: { component: component.__component, index } });
        return (
          <ComponentError
            key={`error-${component.__component}-${index}`}
            componentType={component.__component}
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

        // Headings get smaller margin to stay close to next component
        // Last component gets no bottom margin
        const spacingClass = isLast ? '' : (isHeading ? 'mb-6' : 'mb-12');

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
