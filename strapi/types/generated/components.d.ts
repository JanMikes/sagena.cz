import type { Schema, Struct } from '@strapi/strapi';

export interface ComponentsAlert extends Struct.ComponentSchema {
  collectionName: 'components_components_alerts';
  info: {
    displayName: 'Upozorn\u011Bn\u00ED';
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

export interface ComponentsButtonGroup extends Struct.ComponentSchema {
  collectionName: 'components_components_button_groups';
  info: {
    displayName: 'Tla\u010D\u00EDtka';
    icon: 'apps';
  };
  attributes: {
    alignment: Schema.Attribute.Enumeration<
      ['Left aligned', 'Center aligned', 'Right aligned']
    > &
      Schema.Attribute.DefaultTo<'Left aligned'>;
    buttons: Schema.Attribute.Component<'elements.button', true> &
      Schema.Attribute.Required;
    spacing: Schema.Attribute.Enumeration<
      ['Small spacing', 'Medium spacing', 'Large spacing']
    > &
      Schema.Attribute.DefaultTo<'Medium spacing'>;
  };
}

export interface ComponentsContactCards extends Struct.ComponentSchema {
  collectionName: 'components_components_contact_cards';
  info: {
    displayName: 'Kontakty na lidi';
    icon: 'user';
  };
  attributes: {
    cards: Schema.Attribute.Component<'elements.contact-card', true> &
      Schema.Attribute.Required;
  };
}

export interface ComponentsDirections extends Struct.ComponentSchema {
  collectionName: 'components_components_directions';
  info: {
    displayName: 'Instrukce';
    icon: 'compass';
  };
  attributes: {
    description: Schema.Attribute.RichText;
    instructions: Schema.Attribute.Component<'elements.direction-step', true> &
      Schema.Attribute.Required;
    style: Schema.Attribute.Enumeration<['Style 1', 'Style 2']> &
      Schema.Attribute.DefaultTo<'Style 1'>;
    title: Schema.Attribute.String;
  };
}

export interface ComponentsDoctorProfile extends Struct.ComponentSchema {
  collectionName: 'components_components_doctor_profiles';
  info: {
    displayName: 'Doktor, ambulance';
    icon: 'user';
  };
  attributes: {
    profile: Schema.Attribute.Component<'elements.doctor-profile', false> &
      Schema.Attribute.Required;
  };
}

export interface ComponentsDocuments extends Struct.ComponentSchema {
  collectionName: 'components_components_documents';
  info: {
    displayName: 'Dokumenty';
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

export interface ComponentsExpandableSection extends Struct.ComponentSchema {
  collectionName: 'components_components_expandable_sections';
  info: {
    displayName: 'Rozj\u00ED\u017Ed\u011Bc\u00ED obsah';
    icon: 'expand';
  };
  attributes: {
    contact_email: Schema.Attribute.Email;
    contact_name: Schema.Attribute.String;
    contact_phone: Schema.Attribute.String;
    default_open: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    description: Schema.Attribute.Text;
    files: Schema.Attribute.Component<'elements.file-attachment', true>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ComponentsFullWidthCards extends Struct.ComponentSchema {
  collectionName: 'components_components_full_width_cards';
  info: {
    displayName: 'Dla\u017Edice \u0161\u00ED\u0159ka';
    icon: 'apps';
  };
  attributes: {
    cards: Schema.Attribute.Component<'elements.full-width-card', true> &
      Schema.Attribute.Required;
  };
}

export interface ComponentsGallerySlider extends Struct.ComponentSchema {
  collectionName: 'components_components_gallery_sliders';
  info: {
    displayName: 'P\u00E1s galerie';
    icon: 'landscape';
  };
  attributes: {
    photos: Schema.Attribute.Component<'elements.photo', true> &
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

export interface ComponentsIntranetNewsArticles extends Struct.ComponentSchema {
  collectionName: 'components_components_intranet_news_articles';
  info: {
    displayName: 'intranet-news-articles';
    icon: 'briefcase';
  };
  attributes: {
    limit: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<3>;
    show_all_link: Schema.Attribute.Component<'elements.text-link', false>;
    tags: Schema.Attribute.Relation<'oneToMany', 'api::tag.tag'>;
  };
}

export interface ComponentsJobPosting extends Struct.ComponentSchema {
  collectionName: 'components_components_job_postings';
  info: {
    displayName: 'Nab\u00EDdka pr\u00E1ce';
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
    displayName: 'Seznam odkaz\u016F';
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
    displayName: 'Mark. argumenty';
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

export interface ComponentsNewsArticles extends Struct.ComponentSchema {
  collectionName: 'components_components_news_articles';
  info: {
    displayName: 'Aktuality';
    icon: 'feather';
  };
  attributes: {
    limit: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          max: 20;
          min: 1;
        },
        number
      > &
      Schema.Attribute.DefaultTo<3>;
    show_all_link: Schema.Attribute.Component<'elements.text-link', false>;
    tags: Schema.Attribute.Relation<'oneToMany', 'api::tag.tag'>;
  };
}

export interface ComponentsPartnerLogos extends Struct.ComponentSchema {
  collectionName: 'components_components_partner_logos';
  info: {
    displayName: 'Loga partner\u016F';
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

export interface ComponentsPhotoGallery extends Struct.ComponentSchema {
  collectionName: 'components_components_photo_galleries';
  info: {
    displayName: 'Fotogalerie';
    icon: 'picture';
  };
  attributes: {
    columns: Schema.Attribute.Enumeration<
      ['Two columns', 'Three columns', 'Four columns']
    > &
      Schema.Attribute.DefaultTo<'Three columns'>;
    photos: Schema.Attribute.Component<'elements.photo', true> &
      Schema.Attribute.Required;
  };
}

export interface ComponentsSectionDivider extends Struct.ComponentSchema {
  collectionName: 'components_components_section_dividers';
  info: {
    displayName: 'Rozd\u011Blovn\u00EDk';
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
    displayName: 'Dla\u017Edice';
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

export interface ComponentsSlider extends Struct.ComponentSchema {
  collectionName: 'components_components_sliders';
  info: {
    displayName: 'Slider';
    icon: 'layer';
  };
  attributes: {
    autoplay: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    autoplay_interval: Schema.Attribute.Integer &
      Schema.Attribute.DefaultTo<5000>;
    slides: Schema.Attribute.Component<'elements.slide', true> &
      Schema.Attribute.Required;
  };
}

export interface ComponentsText extends Struct.ComponentSchema {
  collectionName: 'components_components_texts';
  info: {
    displayName: 'Textov\u00E9 pole';
    icon: 'bold';
  };
  attributes: {
    text: Schema.Attribute.RichText & Schema.Attribute.Required;
  };
}

export interface ComponentsTimeline extends Struct.ComponentSchema {
  collectionName: 'components_components_timelines';
  info: {
    displayName: '\u010Casov\u00E1 osa';
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
    displayName: 'Video';
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

export interface ElementsButton extends Struct.ComponentSchema {
  collectionName: 'components_elements_buttons';
  info: {
    displayName: 'button';
    icon: 'cursor';
  };
  attributes: {
    link: Schema.Attribute.Component<'elements.text-link', false> &
      Schema.Attribute.Required;
    size: Schema.Attribute.Enumeration<['Small', 'Medium', 'Large']> &
      Schema.Attribute.DefaultTo<'Medium'>;
    variant: Schema.Attribute.Enumeration<
      ['Primary', 'Secondary', 'Outline', 'Ghost']
    > &
      Schema.Attribute.DefaultTo<'Primary'>;
  };
}

export interface ElementsContactCard extends Struct.ComponentSchema {
  collectionName: 'components_elements_contact_cards';
  info: {
    displayName: 'contact-card';
    icon: 'user';
  };
  attributes: {
    person: Schema.Attribute.Component<'elements.person', false> &
      Schema.Attribute.Required;
  };
}

export interface ElementsDirectionStep extends Struct.ComponentSchema {
  collectionName: 'components_elements_direction_steps';
  info: {
    displayName: 'direction-step';
    icon: 'arrowRight';
  };
  attributes: {
    floor: Schema.Attribute.String;
    icon: Schema.Attribute.Relation<'oneToOne', 'api::icon.icon'>;
    text: Schema.Attribute.RichText;
  };
}

export interface ElementsDoctorProfile extends Struct.ComponentSchema {
  collectionName: 'components_elements_doctor_profiles';
  info: {
    displayName: 'doctor-profile';
    icon: 'user';
  };
  attributes: {
    ambulanceTitle: Schema.Attribute.String;
    department: Schema.Attribute.String & Schema.Attribute.Required;
    holiday: Schema.Attribute.Component<'elements.holiday', false>;
    openingHours: Schema.Attribute.Component<'elements.opening-hours', true>;
    person: Schema.Attribute.Component<'elements.person', false> &
      Schema.Attribute.Required;
    positions: Schema.Attribute.Component<'elements.position', true>;
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

export interface ElementsFileAttachment extends Struct.ComponentSchema {
  collectionName: 'components_elements_file_attachments';
  info: {
    displayName: 'file-attachment';
    icon: 'paperclip';
  };
  attributes: {
    file: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'> &
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

export interface ElementsHoliday extends Struct.ComponentSchema {
  collectionName: 'components_elements_holidays';
  info: {
    displayName: 'holiday';
    icon: 'plane';
  };
  attributes: {
    from: Schema.Attribute.Date & Schema.Attribute.Required;
    to: Schema.Attribute.Date & Schema.Attribute.Required;
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

export interface ElementsOpeningHours extends Struct.ComponentSchema {
  collectionName: 'components_elements_opening_hours';
  info: {
    displayName: 'opening-hours';
    icon: 'clock';
  };
  attributes: {
    day: Schema.Attribute.String & Schema.Attribute.Required;
    time: Schema.Attribute.String & Schema.Attribute.Required;
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

export interface ElementsPerson extends Struct.ComponentSchema {
  collectionName: 'components_elements_people';
  info: {
    displayName: 'person';
    icon: 'user';
  };
  attributes: {
    person: Schema.Attribute.Relation<'oneToOne', 'api::person.person'>;
  };
}

export interface ElementsPhoto extends Struct.ComponentSchema {
  collectionName: 'components_elements_photos';
  info: {
    displayName: 'photo';
    icon: 'picture';
  };
  attributes: {
    image: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
  };
}

export interface ElementsPosition extends Struct.ComponentSchema {
  collectionName: 'components_elements_positions';
  info: {
    displayName: 'position';
    icon: 'briefcase';
  };
  attributes: {
    title: Schema.Attribute.String & Schema.Attribute.Required;
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

export interface ElementsSlide extends Struct.ComponentSchema {
  collectionName: 'components_elements_slides';
  info: {
    displayName: 'slide';
    icon: 'picture';
  };
  attributes: {
    background_image: Schema.Attribute.Media<'images'>;
    description: Schema.Attribute.Text & Schema.Attribute.Required;
    image: Schema.Attribute.Media<'images'>;
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
      'components.button-group': ComponentsButtonGroup;
      'components.contact-cards': ComponentsContactCards;
      'components.directions': ComponentsDirections;
      'components.doctor-profile': ComponentsDoctorProfile;
      'components.documents': ComponentsDocuments;
      'components.expandable-section': ComponentsExpandableSection;
      'components.full-width-cards': ComponentsFullWidthCards;
      'components.gallery-slider': ComponentsGallerySlider;
      'components.heading': ComponentsHeading;
      'components.intranet-news-articles': ComponentsIntranetNewsArticles;
      'components.job-posting': ComponentsJobPosting;
      'components.links-list': ComponentsLinksList;
      'components.marketing-arguments': ComponentsMarketingArguments;
      'components.news-articles': ComponentsNewsArticles;
      'components.partner-logos': ComponentsPartnerLogos;
      'components.photo-gallery': ComponentsPhotoGallery;
      'components.section-divider': ComponentsSectionDivider;
      'components.service-cards': ComponentsServiceCards;
      'components.slider': ComponentsSlider;
      'components.text': ComponentsText;
      'components.timeline': ComponentsTimeline;
      'components.video': ComponentsVideo;
      'elements.button': ElementsButton;
      'elements.contact-card': ElementsContactCard;
      'elements.direction-step': ElementsDirectionStep;
      'elements.doctor-profile': ElementsDoctorProfile;
      'elements.document-item': ElementsDocumentItem;
      'elements.file-attachment': ElementsFileAttachment;
      'elements.full-width-card': ElementsFullWidthCard;
      'elements.holiday': ElementsHoliday;
      'elements.icon': ElementsIcon;
      'elements.link': ElementsLink;
      'elements.marketing-argument': ElementsMarketingArgument;
      'elements.opening-hours': ElementsOpeningHours;
      'elements.partner-logo': ElementsPartnerLogo;
      'elements.person': ElementsPerson;
      'elements.photo': ElementsPhoto;
      'elements.position': ElementsPosition;
      'elements.service-card': ElementsServiceCard;
      'elements.slide': ElementsSlide;
      'elements.text-link': ElementsTextLink;
      'elements.timeline-item': ElementsTimelineItem;
    }
  }
}
