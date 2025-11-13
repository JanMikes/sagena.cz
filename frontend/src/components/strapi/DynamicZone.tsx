/**
 * DynamicZone Component
 *
 * Renders Strapi dynamic zone components based on their __component type.
 * This is the core renderer for all dynamic content from Strapi.
 */

import React from 'react';
import Heading from '@/components/typography/Heading';
import RichText from '@/components/typography/RichText';
import Alert from '@/components/interactive/Alert';
import LinksList from '@/components/navigation/LinksList';
import Video from '@/components/content/Video';
import ServiceCards from '@/components/content/ServiceCards';
import FullWidthCards from '@/components/content/FullWidthCards';
import { getStrapiMediaURL, getIconUrlById } from '@/lib/strapi';
import {
  PageContentComponent,
  PageSidebarComponent,
  ComponentsHeading,
  ComponentsText,
  ComponentsAlert,
  ComponentsLinksList,
  ComponentsVideo,
  ComponentsServiceCards,
  ComponentsFullWidthCards,
  ElementsTextLink,
  StrapiMedia,
} from '@/types/strapi';

interface DynamicZoneProps {
  components: (PageContentComponent | PageSidebarComponent)[];
  className?: string;
}

/**
 * Resolve ElementsTextLink to href and disabled state
 * Priority: page > url > file > anchor
 */
function resolveTextLink(link: ElementsTextLink): {
  url: string;
  external: boolean;
  disabled: boolean;
  disabledReason?: string;
} {
  // Check if link is explicitly disabled
  if (link.disabled) {
    return {
      url: '#',
      external: false,
      disabled: true,
      disabledReason: 'Tento odkaz je momentálně nedostupný',
    };
  }

  // Priority 1: Internal page
  if (link.page?.slug) {
    return {
      url: `/${link.page.slug}`,
      external: false,
      disabled: false,
    };
  }

  // Priority 2: External URL
  if (link.url) {
    return {
      url: link.url,
      external: link.url.startsWith('http'),
      disabled: false,
    };
  }

  // Priority 3: File
  if (link.file) {
    const fileData = link.file as StrapiMedia;
    return {
      url: fileData.attributes.url,
      external: false,
      disabled: false,
    };
  }

  // Priority 4: Anchor only
  if (link.anchor) {
    return {
      url: `#${link.anchor}`,
      external: false,
      disabled: false,
    };
  }

  // Fallback: disabled if no valid target
  return {
    url: '#',
    external: false,
    disabled: true,
    disabledReason: 'Odkaz nemá nastavenou cílovou stránku',
  };
}

/**
 * Render a single component from the dynamic zone
 */
async function renderComponent(
  component: PageContentComponent | PageSidebarComponent,
  index: number
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
          className="mb-4"
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
          className="mb-6"
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
          className="mb-6"
        />
      );
    }

    case 'components.links-list': {
      const linksListComponent = component as ComponentsLinksList;

      // Transform Strapi links to LinksList format
      const links = linksListComponent.links.map((link) => {
        const resolved = resolveTextLink(link);
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
      const cards = await Promise.all(serviceCardsComponent.cards.map(async (card) => {
        // Get icon URL from cache by ID
        // Structure: card.icon (component) → icon (relation) → icon.id
        const iconUrl = card.icon?.icon?.id
          ? await getIconUrlById(card.icon.icon.id)
          : null;

        // Resolve link if provided
        let link: { text: string; url: string } | undefined;
        if (card.link) {
          const resolved = resolveTextLink(card.link);
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
      const columnMap: Record<string, 2 | 3 | 4> = {
        'Two columns': 2,
        'Three columns': 3,
        'Four columns': 4,
      };
      const columns = columnMap[serviceCardsComponent.columns] || 3;

      return (
        <ServiceCards
          key={`${__component}-${component.id || index}`}
          cards={cards}
          columns={columns}
        />
      );
    }

    case 'components.full-width-cards': {
      const fullWidthCardsComponent = component as ComponentsFullWidthCards;

      // Transform Strapi data to FullWidthCards component props
      const cards = await Promise.all(fullWidthCardsComponent.cards.map(async (card) => {
        // Get icon URL from cache by ID
        // Structure: card.icon (component) → icon (relation) → icon.id
        const iconUrl = card.icon?.icon?.id
          ? await getIconUrlById(card.icon.icon.id)
          : null;

        // Resolve link (required for full-width cards)
        const resolved = resolveTextLink(card.link);

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

      return (
        <FullWidthCards
          key={`${__component}-${component.id || index}`}
          cards={cards}
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
 * DynamicZone component renders an array of Strapi components
 */
const DynamicZone: React.FC<DynamicZoneProps> = async ({
  components,
  className = '',
}) => {
  if (!components || components.length === 0) {
    return null;
  }

  // Render all components in parallel
  const renderedComponents = await Promise.all(
    components.map((component, index) => renderComponent(component, index))
  );

  return (
    <div className={className}>
      {renderedComponents}
    </div>
  );
};

export default DynamicZone;
