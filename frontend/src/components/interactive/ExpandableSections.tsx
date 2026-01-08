import React from 'react';
import ExpandableSection from './ExpandableSection';

interface FileAttachment {
  name: string;
  url: string;
  ext: string;
  size: number;
}

interface ContactCardData {
  name: string;
  email?: string | null;
  phone?: string | null;
  photo?: string | null;
  gender?: 'man' | 'woman' | null;
  funkce?: string | null;
}

interface Photo {
  url: string;
  alt?: string;
  caption?: string;
}

interface ExpandableSectionData {
  title: string;
  description?: string | null;
  contacts?: ContactCardData[];
  files?: FileAttachment[];
  defaultOpen?: boolean;
  photos?: Photo[];
  galleryColumns?: 2 | 3 | 4;
}

interface ExpandableSectionsProps {
  sections: ExpandableSectionData[];
  locale?: string;
}

const ExpandableSections: React.FC<ExpandableSectionsProps> = ({ sections, locale = 'cs' }) => {
  return (
    <div className="space-y-4">
      {sections.map((section, index) => (
        <ExpandableSection
          key={index}
          title={section.title}
          description={section.description}
          contacts={section.contacts}
          files={section.files}
          defaultOpen={section.defaultOpen}
          locale={locale}
          photos={section.photos}
          galleryColumns={section.galleryColumns}
        />
      ))}
    </div>
  );
};

export default ExpandableSections;
