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
import {
  PageContentComponent,
  PageSidebarComponent,
  ComponentsHeading,
  ComponentsText,
  ComponentsAlert,
  ComponentsLinksList,
  ComponentsVideo,
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
function renderComponent(
  component: PageContentComponent | PageSidebarComponent,
  index: number
): React.ReactNode {
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

    default:
      // Log unknown component types for debugging
      console.warn(`Unknown component type: ${__component}`);
      return null;
  }
}

/**
 * DynamicZone component renders an array of Strapi components
 */
const DynamicZone: React.FC<DynamicZoneProps> = ({
  components,
  className = '',
}) => {
  if (!components || components.length === 0) {
    return null;
  }

  return (
    <div className={className}>
      {components.map((component, index) => renderComponent(component, index))}
    </div>
  );
};

export default DynamicZone;
