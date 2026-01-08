import type { Schema, Struct } from '@strapi/strapi';

export interface ComponentsAccordionSections extends Struct.ComponentSchema {
  collectionName: 'components_components_accordion_sections';
  info: {
    displayName: 'Rozj\u00ED\u017Ed\u011Bc\u00ED sekce';
    icon: 'expand';
  };
  attributes: {
    sections: Schema.Attribute.Component<'elements.expandable-section', true>;
  };
}

export interface ComponentsAlert extends Struct.ComponentSchema {
  collectionName: 'components_components_alerts';
  info: {
    displayName: 'Upozorn\u011Bn\u00ED';
    icon: 'bell';
  };
  attributes: {
    text: Schema.Attribute.RichText;
    title: Schema.Attribute.String;
    type: Schema.Attribute.Enumeration<
      ['info', 'success', 'warning', 'error']
    > &
      Schema.Attribute.DefaultTo<'info'>;
  };
}

export interface ComponentsBadges extends Struct.ComponentSchema {
  collectionName: 'components_components_badges';
  info: {
    displayName: 'Badges';
    icon: 'apps';
  };
  attributes: {
    alignment: Schema.Attribute.Enumeration<
      ['Left aligned', 'Center aligned', 'Right aligned']
    > &
      Schema.Attribute.DefaultTo<'Left aligned'>;
    badges: Schema.Attribute.Component<'elements.badge', true>;
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
    buttons: Schema.Attribute.Component<'elements.button', true>;
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
    cards: Schema.Attribute.Component<'elements.contact-card', true>;
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
    instructions: Schema.Attribute.Component<'elements.direction-step', true>;
    style: Schema.Attribute.Enumeration<['Style 1', 'Style 2']> &
      Schema.Attribute.DefaultTo<'Style 1'>;
    title: Schema.Attribute.String;
  };
}

export interface ComponentsDoctorProfile extends Struct.ComponentSchema {
  collectionName: 'components_components_doctor_profiles';
  info: {
    displayName: 'Dokto\u0159i, ambulance';
    icon: 'user';
  };
  attributes: {
    columns: Schema.Attribute.Enumeration<
      ['Two columns', 'Three columns', 'Four columns']
    > &
      Schema.Attribute.DefaultTo<'Three columns'>;
    profiles: Schema.Attribute.Component<'elements.doctor-profile', true>;
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
    documents: Schema.Attribute.Component<'elements.document-item', true>;
  };
}

export interface ComponentsFullWidthCards extends Struct.ComponentSchema {
  collectionName: 'components_components_full_width_cards';
  info: {
    displayName: 'Dla\u017Edice \u0161\u00ED\u0159ka';
    icon: 'apps';
  };
  attributes: {
    background: Schema.Attribute.Enumeration<
      ['None', 'Primary light', 'Neutral light']
    > &
      Schema.Attribute.DefaultTo<'None'>;
    cards: Schema.Attribute.Component<'elements.full-width-card', true>;
  };
}

export interface ComponentsGallerySlider extends Struct.ComponentSchema {
  collectionName: 'components_components_gallery_sliders';
  info: {
    displayName: 'P\u00E1s galerie';
    icon: 'landscape';
  };
  attributes: {
    photos: Schema.Attribute.Component<'elements.photo', true>;
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
    text: Schema.Attribute.String;
    type: Schema.Attribute.Enumeration<['h2', 'h3', 'h4', 'h5', 'h6']> &
      Schema.Attribute.DefaultTo<'h2'>;
  };
}

export interface ComponentsImage extends Struct.ComponentSchema {
  collectionName: 'components_components_images';
  info: {
    displayName: 'Obr\u00E1zek';
    icon: 'picture';
  };
  attributes: {
    image: Schema.Attribute.Media<'images'>;
  };
}

export interface ComponentsIntranetNewsArticles extends Struct.ComponentSchema {
  collectionName: 'components_components_intranet_news_articles';
  info: {
    displayName: 'intranet-news-articles';
    icon: 'briefcase';
  };
  attributes: {
    limit: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<3>;
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
    cta_link: Schema.Attribute.Component<'elements.text-link', false>;
    department: Schema.Attribute.String;
    description: Schema.Attribute.Text;
    employment_type: Schema.Attribute.String;
    location: Schema.Attribute.String;
    title: Schema.Attribute.String;
  };
}

export interface ComponentsLinksList extends Struct.ComponentSchema {
  collectionName: 'components_components_links_lists';
  info: {
    displayName: 'Seznam odkaz\u016F';
    icon: 'apps';
  };
  attributes: {
    layout: Schema.Attribute.Enumeration<['Grid', 'Rows']> &
      Schema.Attribute.DefaultTo<'Grid'>;
    links: Schema.Attribute.Component<'elements.text-link', true>;
  };
}

export interface ComponentsLocationCards extends Struct.ComponentSchema {
  collectionName: 'components_components_location_cards';
  info: {
    displayName: 'Karty pobo\u010Dek';
    icon: 'apps';
  };
  attributes: {
    background: Schema.Attribute.Enumeration<
      ['None', 'Primary light', 'Neutral light']
    > &
      Schema.Attribute.DefaultTo<'None'>;
    cards: Schema.Attribute.Component<'elements.location-card', true>;
    columns: Schema.Attribute.Enumeration<
      ['Two columns', 'Three columns', 'Four columns']
    > &
      Schema.Attribute.DefaultTo<'Three columns'>;
  };
}

export interface ComponentsMarketingArguments extends Struct.ComponentSchema {
  collectionName: 'components_components_marketing_arguments';
  info: {
    displayName: 'Mark. argumenty';
    icon: 'apps';
  };
  attributes: {
    arguments: Schema.Attribute.Component<'elements.marketing-argument', true>;
    background: Schema.Attribute.Enumeration<
      ['None', 'Primary light', 'Neutral light']
    > &
      Schema.Attribute.DefaultTo<'None'>;
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

export interface ComponentsPageHeader extends Struct.ComponentSchema {
  collectionName: 'components_components_page_headers';
  info: {
    description: 'Page header with optional slider and service cards';
    displayName: 'Page Header';
    icon: 'layout';
  };
  attributes: {
    service_cards: Schema.Attribute.Component<
      'components.service-cards',
      false
    >;
    slider: Schema.Attribute.Component<'components.slider', false>;
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
    partners: Schema.Attribute.Component<'elements.partner-logo', true>;
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
    photos: Schema.Attribute.Component<'elements.photo', true>;
  };
}

export interface ComponentsPopup extends Struct.ComponentSchema {
  collectionName: 'components_components_popup';
  info: {
    displayName: 'Popup';
    icon: 'bell';
  };
  attributes: {
    description: Schema.Attribute.RichText;
    link: Schema.Attribute.Component<'elements.text-link', false>;
    rememberDismissal: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
    title: Schema.Attribute.String;
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
    background: Schema.Attribute.Enumeration<
      ['None', 'Primary light', 'Neutral light']
    > &
      Schema.Attribute.DefaultTo<'None'>;
    card_clickable: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
    cards: Schema.Attribute.Component<'elements.service-card', true>;
    columns: Schema.Attribute.Enumeration<
      ['Two columns', 'Three columns', 'Four columns', 'Five columns']
    > &
      Schema.Attribute.DefaultTo<'Three columns'>;
    text_align: Schema.Attribute.Enumeration<
      ['Left aligned', 'Center aligned']
    > &
      Schema.Attribute.DefaultTo<'Left aligned'>;
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
    slides: Schema.Attribute.Component<'elements.slide', true>;
  };
}

export interface ComponentsText extends Struct.ComponentSchema {
  collectionName: 'components_components_texts';
  info: {
    displayName: 'Textov\u00E9 pole';
    icon: 'bold';
  };
  attributes: {
    text: Schema.Attribute.RichText;
  };
}

export interface ComponentsTimeline extends Struct.ComponentSchema {
  collectionName: 'components_components_timelines';
  info: {
    displayName: '\u010Casov\u00E1 osa';
    icon: 'bulletList';
  };
  attributes: {
    items: Schema.Attribute.Component<'elements.timeline-item', true>;
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
      Schema.Attribute.DefaultTo<'Ratio 16/9'>;
    youtube_id: Schema.Attribute.String;
  };
}

export interface ElementsBadge extends Struct.ComponentSchema {
  collectionName: 'components_elements_badges';
  info: {
    displayName: 'Badge';
    icon: 'hashtag';
  };
  attributes: {
    label: Schema.Attribute.String & Schema.Attribute.Required;
    size: Schema.Attribute.Enumeration<['Small', 'Medium']> &
      Schema.Attribute.DefaultTo<'Medium'>;
    variant: Schema.Attribute.Enumeration<
      ['Primary', 'Secondary', 'Success', 'Info', 'Warning', 'Danger']
    > &
      Schema.Attribute.DefaultTo<'Primary'>;
  };
}

export interface ElementsButton extends Struct.ComponentSchema {
  collectionName: 'components_elements_buttons';
  info: {
    displayName: 'Tla\u010D\u00EDtko';
    icon: 'cursor';
  };
  attributes: {
    link: Schema.Attribute.Component<'elements.text-link', false>;
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
    displayName: 'Kontaktn\u00ED karta';
    icon: 'user';
  };
  attributes: {
    funkce: Schema.Attribute.String;
    person: Schema.Attribute.Component<'elements.person', false>;
  };
}

export interface ElementsDirectionStep extends Struct.ComponentSchema {
  collectionName: 'components_elements_direction_steps';
  info: {
    displayName: 'Instrukce';
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
    displayName: 'Profil doktora, ambulance';
    icon: 'user';
  };
  attributes: {
    ambulanceTitle: Schema.Attribute.String;
    department: Schema.Attribute.String;
    holiday: Schema.Attribute.Component<'elements.holiday', false>;
    openingHours: Schema.Attribute.Component<'elements.opening-hours', true>;
    person: Schema.Attribute.Component<'elements.person', false>;
    positions: Schema.Attribute.Component<'elements.position', true>;
  };
}

export interface ElementsDocumentItem extends Struct.ComponentSchema {
  collectionName: 'components_elements_document_items';
  info: {
    displayName: 'Dokument';
    icon: 'fileText';
  };
  attributes: {
    file: Schema.Attribute.Media<'files' | 'images' | 'videos' | 'audios'>;
    name: Schema.Attribute.String;
  };
}

export interface ElementsExpandableSection extends Struct.ComponentSchema {
  collectionName: 'components_elements_expandable_section';
  info: {
    displayName: 'expandable-section';
    icon: 'expand';
  };
  attributes: {
    contacts: Schema.Attribute.Component<'components.contact-cards', false>;
    default_open: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    description: Schema.Attribute.RichText;
    files: Schema.Attribute.Component<'elements.document-item', true>;
    gallery_columns: Schema.Attribute.Enumeration<
      ['Two columns', 'Three columns', 'Four columns']
    > &
      Schema.Attribute.DefaultTo<'Three columns'>;
    photos: Schema.Attribute.Component<'elements.photo', true>;
    title: Schema.Attribute.String;
  };
}

export interface ElementsFullWidthCard extends Struct.ComponentSchema {
  collectionName: 'components_elements_full_width_cards';
  info: {
    displayName: 'Dla\u017Edice \u0161\u00ED\u0159ka';
    icon: 'apps';
  };
  attributes: {
    description: Schema.Attribute.Text;
    icon: Schema.Attribute.Component<'elements.icon', false>;
    link: Schema.Attribute.Component<'elements.text-link', false>;
    title: Schema.Attribute.String;
  };
}

export interface ElementsHoliday extends Struct.ComponentSchema {
  collectionName: 'components_elements_holidays';
  info: {
    displayName: 'Nedostupnost';
    icon: 'plane';
  };
  attributes: {
    from: Schema.Attribute.Date;
    to: Schema.Attribute.Date;
  };
}

export interface ElementsIcon extends Struct.ComponentSchema {
  collectionName: 'components_elements_icons';
  info: {
    displayName: 'Ikona';
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

export interface ElementsLinksSection extends Struct.ComponentSchema {
  collectionName: 'components_elements_links_sections';
  info: {
    displayName: 'Sloupec odkaz\u016F';
    icon: 'bulletList';
  };
  attributes: {
    heading: Schema.Attribute.String;
    links: Schema.Attribute.Component<'elements.text-link', true>;
  };
}

export interface ElementsLocationCard extends Struct.ComponentSchema {
  collectionName: 'components_elements_location_cards';
  info: {
    displayName: 'Karta pobocky';
    icon: 'pinMap';
  };
  attributes: {
    address: Schema.Attribute.Text;
    description: Schema.Attribute.Text;
    email: Schema.Attribute.String;
    link: Schema.Attribute.Component<'elements.text-link', false>;
    map_link: Schema.Attribute.String;
    opening_hours: Schema.Attribute.Component<'elements.opening-hours', true>;
    phone: Schema.Attribute.String;
    photo: Schema.Attribute.Media<'images'>;
    title: Schema.Attribute.String;
  };
}

export interface ElementsMarketingArgument extends Struct.ComponentSchema {
  collectionName: 'components_elements_marketing_arguments';
  info: {
    displayName: 'Mark. argument';
    icon: 'bulletList';
  };
  attributes: {
    description: Schema.Attribute.Text;
    display_type: Schema.Attribute.Enumeration<['Icon', 'Number']> &
      Schema.Attribute.DefaultTo<'Icon'>;
    icon: Schema.Attribute.Component<'elements.icon', false>;
    number: Schema.Attribute.String;
    title: Schema.Attribute.String;
  };
}

export interface ElementsOpeningHours extends Struct.ComponentSchema {
  collectionName: 'components_elements_opening_hours';
  info: {
    displayName: 'Otv\u00EDrac\u00ED doba';
    icon: 'clock';
  };
  attributes: {
    day: Schema.Attribute.String;
    time: Schema.Attribute.String;
  };
}

export interface ElementsPartnerLogo extends Struct.ComponentSchema {
  collectionName: 'components_elements_partner_logos';
  info: {
    displayName: 'Logo partnera';
    icon: 'briefcase';
  };
  attributes: {
    logo: Schema.Attribute.Media<'images'>;
    name: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface ElementsPerson extends Struct.ComponentSchema {
  collectionName: 'components_elements_people';
  info: {
    displayName: '\u010Clov\u011Bk';
    icon: 'user';
  };
  attributes: {
    person: Schema.Attribute.Relation<'oneToOne', 'api::person.person'>;
  };
}

export interface ElementsPhoto extends Struct.ComponentSchema {
  collectionName: 'components_elements_photos';
  info: {
    displayName: 'Fotka';
    icon: 'picture';
  };
  attributes: {
    image: Schema.Attribute.Media<'images'>;
  };
}

export interface ElementsPosition extends Struct.ComponentSchema {
  collectionName: 'components_elements_positions';
  info: {
    displayName: 'Funkce';
    icon: 'briefcase';
  };
  attributes: {
    title: Schema.Attribute.String;
  };
}

export interface ElementsServiceCard extends Struct.ComponentSchema {
  collectionName: 'components_elements_service_cards';
  info: {
    displayName: 'Dla\u017Edice';
    icon: 'bulletList';
  };
  attributes: {
    description: Schema.Attribute.Text;
    icon: Schema.Attribute.Component<'elements.icon', false>;
    link: Schema.Attribute.Component<'elements.text-link', false>;
    title: Schema.Attribute.String;
  };
}

export interface ElementsSlide extends Struct.ComponentSchema {
  collectionName: 'components_elements_slides';
  info: {
    displayName: 'Slide';
    icon: 'picture';
  };
  attributes: {
    background_image: Schema.Attribute.Media<'images'>;
    description: Schema.Attribute.Text;
    image: Schema.Attribute.Media<'images'>;
    image_position: Schema.Attribute.Enumeration<['left', 'right']> &
      Schema.Attribute.DefaultTo<'right'>;
    link: Schema.Attribute.Component<'elements.text-link', false>;
    text_position: Schema.Attribute.Enumeration<['top', 'middle', 'bottom']> &
      Schema.Attribute.DefaultTo<'middle'>;
    title: Schema.Attribute.String;
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
    text: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface ElementsTimelineItem extends Struct.ComponentSchema {
  collectionName: 'components_elements_timeline_items';
  info: {
    displayName: 'Polo\u017Eka \u010Dasov\u00E9 osy';
    icon: 'bulletList';
  };
  attributes: {
    description: Schema.Attribute.Text;
    display_type: Schema.Attribute.Enumeration<['Icon', 'Number']> &
      Schema.Attribute.DefaultTo<'Number'>;
    icon: Schema.Attribute.Relation<'oneToOne', 'api::icon.icon'>;
    number: Schema.Attribute.String;
    title: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'components.accordion-sections': ComponentsAccordionSections;
      'components.alert': ComponentsAlert;
      'components.badges': ComponentsBadges;
      'components.button-group': ComponentsButtonGroup;
      'components.contact-cards': ComponentsContactCards;
      'components.directions': ComponentsDirections;
      'components.doctor-profile': ComponentsDoctorProfile;
      'components.documents': ComponentsDocuments;
      'components.full-width-cards': ComponentsFullWidthCards;
      'components.gallery-slider': ComponentsGallerySlider;
      'components.heading': ComponentsHeading;
      'components.image': ComponentsImage;
      'components.intranet-news-articles': ComponentsIntranetNewsArticles;
      'components.job-posting': ComponentsJobPosting;
      'components.links-list': ComponentsLinksList;
      'components.location-cards': ComponentsLocationCards;
      'components.marketing-arguments': ComponentsMarketingArguments;
      'components.news-articles': ComponentsNewsArticles;
      'components.page-header': ComponentsPageHeader;
      'components.partner-logos': ComponentsPartnerLogos;
      'components.photo-gallery': ComponentsPhotoGallery;
      'components.popup': ComponentsPopup;
      'components.section-divider': ComponentsSectionDivider;
      'components.service-cards': ComponentsServiceCards;
      'components.slider': ComponentsSlider;
      'components.text': ComponentsText;
      'components.timeline': ComponentsTimeline;
      'components.video': ComponentsVideo;
      'elements.badge': ElementsBadge;
      'elements.button': ElementsButton;
      'elements.contact-card': ElementsContactCard;
      'elements.direction-step': ElementsDirectionStep;
      'elements.doctor-profile': ElementsDoctorProfile;
      'elements.document-item': ElementsDocumentItem;
      'elements.expandable-section': ElementsExpandableSection;
      'elements.full-width-card': ElementsFullWidthCard;
      'elements.holiday': ElementsHoliday;
      'elements.icon': ElementsIcon;
      'elements.link': ElementsLink;
      'elements.links-section': ElementsLinksSection;
      'elements.location-card': ElementsLocationCard;
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
