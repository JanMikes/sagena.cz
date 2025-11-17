import type { Schema, Struct } from '@strapi/strapi';

export interface ComponentsAlert extends Struct.ComponentSchema {
  collectionName: 'components_components_alerts';
  info: {
    displayName: 'Alert';
    icon: 'bell';
  };
  attributes: {
    text: Schema.Attribute.Text;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    type: Schema.Attribute.Enumeration<
      ['info', 'success', 'warning', 'error']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'info'>;
  };
}

export interface ComponentsDocuments extends Struct.ComponentSchema {
  collectionName: 'components_components_documents';
  info: {
    displayName: 'documents';
    icon: 'folder';
  };
  attributes: {
    columns: Schema.Attribute.Enumeration<
      ['Single column', 'Two columns', 'Three columns']
    > &
      Schema.Attribute.DefaultTo<'Three columns'>;
    documents: Schema.Attribute.Component<'elements.document-item', true> &
      Schema.Attribute.Required;
  };
}

export interface ComponentsFullWidthCards extends Struct.ComponentSchema {
  collectionName: 'components_components_full_width_cards';
  info: {
    displayName: 'full-width-cards';
    icon: 'apps';
  };
  attributes: {
    cards: Schema.Attribute.Component<'elements.full-width-card', true> &
      Schema.Attribute.Required;
  };
}

export interface ComponentsHeading extends Struct.ComponentSchema {
  collectionName: 'components_components_headings';
  info: {
    displayName: 'Nadpis';
    icon: 'hashtag';
  };
  attributes: {
    anchor: Schema.Attribute.String;
    text: Schema.Attribute.String & Schema.Attribute.Required;
    type: Schema.Attribute.Enumeration<['h2', 'h3', 'h4', 'h5', 'h6']> &
      Schema.Attribute.Required;
  };
}

export interface ComponentsJobPosting extends Struct.ComponentSchema {
  collectionName: 'components_components_job_postings';
  info: {
    displayName: 'job-posting';
    icon: 'briefcase';
  };
  attributes: {
    cta_link: Schema.Attribute.Component<'elements.text-link', false> &
      Schema.Attribute.Required;
    department: Schema.Attribute.String & Schema.Attribute.Required;
    description: Schema.Attribute.Text & Schema.Attribute.Required;
    employment_type: Schema.Attribute.String & Schema.Attribute.Required;
    location: Schema.Attribute.String & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ComponentsLinksList extends Struct.ComponentSchema {
  collectionName: 'components_components_links_lists';
  info: {
    displayName: 'List odkaz\u016F';
    icon: 'apps';
  };
  attributes: {
    links: Schema.Attribute.Component<'elements.text-link', true> &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
  };
}

export interface ComponentsMarketingArguments extends Struct.ComponentSchema {
  collectionName: 'components_components_marketing_arguments';
  info: {
    displayName: 'marketing-arguments';
    icon: 'apps';
  };
  attributes: {
    arguments: Schema.Attribute.Component<'elements.marketing-argument', true> &
      Schema.Attribute.Required;
    columns: Schema.Attribute.Enumeration<
      ['Two columns', 'Three columns', 'Four columns']
    > &
      Schema.Attribute.DefaultTo<'Three columns'>;
  };
}

export interface ComponentsPartnerLogos extends Struct.ComponentSchema {
  collectionName: 'components_components_partner_logos';
  info: {
    displayName: 'partner-logos';
    icon: 'briefcase';
  };
  attributes: {
    columns: Schema.Attribute.Enumeration<
      [
        'Two columns',
        'Three columns',
        'Four columns',
        'Five columns',
        'Six columns',
      ]
    > &
      Schema.Attribute.DefaultTo<'Six columns'>;
    gap: Schema.Attribute.Enumeration<
      ['Small spacing', 'Medium spacing', 'Large spacing']
    > &
      Schema.Attribute.DefaultTo<'Medium spacing'>;
    grayscale: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    partners: Schema.Attribute.Component<'elements.partner-logo', true> &
      Schema.Attribute.Required;
  };
}

export interface ComponentsSectionDivider extends Struct.ComponentSchema {
  collectionName: 'components_components_section_dividers';
  info: {
    displayName: 'section-divider';
    icon: 'minus';
  };
  attributes: {
    color: Schema.Attribute.Enumeration<['Gray', 'Primary blue']> &
      Schema.Attribute.DefaultTo<'Gray'>;
    spacing: Schema.Attribute.Enumeration<
      ['Small spacing', 'Medium spacing', 'Large spacing']
    > &
      Schema.Attribute.DefaultTo<'Medium spacing'>;
    style: Schema.Attribute.Enumeration<
      [
        'Solid line',
        'Dashed line',
        'Dotted line',
        'Double line',
        'Gradient line',
      ]
    > &
      Schema.Attribute.DefaultTo<'Solid line'>;
  };
}

export interface ComponentsServiceCards extends Struct.ComponentSchema {
  collectionName: 'components_components_service_cards';
  info: {
    displayName: 'service-cards';
    icon: 'dashboard';
  };
  attributes: {
    cards: Schema.Attribute.Component<'elements.service-card', true> &
      Schema.Attribute.Required;
    columns: Schema.Attribute.Enumeration<
      ['Two columns', 'Three columns', 'Four columns']
    > &
      Schema.Attribute.DefaultTo<'Three columns'>;
  };
}

export interface ComponentsText extends Struct.ComponentSchema {
  collectionName: 'components_components_texts';
  info: {
    displayName: 'Text';
    icon: 'bold';
  };
  attributes: {
    text: Schema.Attribute.RichText & Schema.Attribute.Required;
  };
}

export interface ComponentsTimeline extends Struct.ComponentSchema {
  collectionName: 'components_components_timelines';
  info: {
    displayName: 'timeline';
    icon: 'bulletList';
  };
  attributes: {
    items: Schema.Attribute.Component<'elements.timeline-item', true> &
      Schema.Attribute.Required;
  };
}

export interface ComponentsVideo extends Struct.ComponentSchema {
  collectionName: 'components_components_videos';
  info: {
    displayName: 'video';
    icon: 'slideshow';
  };
  attributes: {
    aspect_ratio: Schema.Attribute.Enumeration<
      ['Ratio 16/9', 'Ratio 4/3', 'Ratio 1/1']
    > &
      Schema.Attribute.Required;
    youtube_id: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ElementsDocumentItem extends Struct.ComponentSchema {
  collectionName: 'components_elements_document_items';
  info: {
    displayName: 'document-item';
    icon: 'fileText';
  };
  attributes: {
    file: Schema.Attribute.Media<'files' | 'images' | 'videos' | 'audios'> &
      Schema.Attribute.Required;
    name: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ElementsFullWidthCard extends Struct.ComponentSchema {
  collectionName: 'components_elements_full_width_cards';
  info: {
    displayName: 'full-width-card';
    icon: 'apps';
  };
  attributes: {
    description: Schema.Attribute.Text & Schema.Attribute.Required;
    icon: Schema.Attribute.Component<'elements.icon', false>;
    link: Schema.Attribute.Component<'elements.text-link', false> &
      Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ElementsIcon extends Struct.ComponentSchema {
  collectionName: 'components_elements_icons';
  info: {
    displayName: 'icon';
    icon: 'picture';
  };
  attributes: {
    icon: Schema.Attribute.Relation<'oneToOne', 'api::icon.icon'>;
  };
}

export interface ElementsLink extends Struct.ComponentSchema {
  collectionName: 'components_elements_links';
  info: {
    displayName: 'Odkaz';
    icon: 'attachment';
  };
  attributes: {
    anchor: Schema.Attribute.String;
    file: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    page: Schema.Attribute.Relation<'oneToOne', 'api::page.page'>;
    url: Schema.Attribute.String;
  };
}

export interface ElementsMarketingArgument extends Struct.ComponentSchema {
  collectionName: 'components_elements_marketing_arguments';
  info: {
    displayName: 'marketing-argument';
    icon: 'bulletList';
  };
  attributes: {
    description: Schema.Attribute.Text & Schema.Attribute.Required;
    display_type: Schema.Attribute.Enumeration<['Icon', 'Number']> &
      Schema.Attribute.Required;
    icon: Schema.Attribute.Component<'elements.icon', false>;
    number: Schema.Attribute.String;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ElementsPartnerLogo extends Struct.ComponentSchema {
  collectionName: 'components_elements_partner_logos';
  info: {
    displayName: 'partner-logo';
    icon: 'briefcase';
  };
  attributes: {
    logo: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    url: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ElementsServiceCard extends Struct.ComponentSchema {
  collectionName: 'components_elements_service_cards';
  info: {
    displayName: 'service-card';
    icon: 'bulletList';
  };
  attributes: {
    description: Schema.Attribute.Text;
    icon: Schema.Attribute.Component<'elements.icon', false>;
    link: Schema.Attribute.Component<'elements.text-link', false>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ElementsTextLink extends Struct.ComponentSchema {
  collectionName: 'components_elements_text_links';
  info: {
    displayName: 'Textov\u00FD odkaz';
    icon: 'code';
  };
  attributes: {
    anchor: Schema.Attribute.String;
    disabled: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    file: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    page: Schema.Attribute.Relation<'oneToOne', 'api::page.page'>;
    text: Schema.Attribute.String & Schema.Attribute.Required;
    url: Schema.Attribute.String;
  };
}

export interface ElementsTimelineItem extends Struct.ComponentSchema {
  collectionName: 'components_elements_timeline_items';
  info: {
    displayName: 'timeline-item';
    icon: 'bulletList';
  };
  attributes: {
    description: Schema.Attribute.Text & Schema.Attribute.Required;
    display_type: Schema.Attribute.Enumeration<['Icon', 'Number']> &
      Schema.Attribute.Required;
    icon: Schema.Attribute.Relation<'oneToOne', 'api::icon.icon'>;
    number: Schema.Attribute.String;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'components.alert': ComponentsAlert;
      'components.documents': ComponentsDocuments;
      'components.full-width-cards': ComponentsFullWidthCards;
      'components.heading': ComponentsHeading;
      'components.job-posting': ComponentsJobPosting;
      'components.links-list': ComponentsLinksList;
      'components.marketing-arguments': ComponentsMarketingArguments;
      'components.partner-logos': ComponentsPartnerLogos;
      'components.section-divider': ComponentsSectionDivider;
      'components.service-cards': ComponentsServiceCards;
      'components.text': ComponentsText;
      'components.timeline': ComponentsTimeline;
      'components.video': ComponentsVideo;
      'elements.document-item': ElementsDocumentItem;
      'elements.full-width-card': ElementsFullWidthCard;
      'elements.icon': ElementsIcon;
      'elements.link': ElementsLink;
      'elements.marketing-argument': ElementsMarketingArgument;
      'elements.partner-logo': ElementsPartnerLogo;
      'elements.service-card': ElementsServiceCard;
      'elements.text-link': ElementsTextLink;
      'elements.timeline-item': ElementsTimelineItem;
    }
  }
}
