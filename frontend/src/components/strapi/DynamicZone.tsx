/**
 * DynamicZone Component
 *
 * Renders Strapi dynamic zone components based on their __component type.
 * This is the core renderer for all dynamic content from Strapi.
 */

import React from 'react';
import Heading from '@/components/typography/Heading';
import RichText from '@/components/typography/RichText';
import {
  PageContentComponent,
  PageSidebarComponent,
  ComponentsHeading,
  ComponentsText,
} from '@/types/strapi';

interface DynamicZoneProps {
  components: (PageContentComponent | PageSidebarComponent)[];
  className?: string;
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
