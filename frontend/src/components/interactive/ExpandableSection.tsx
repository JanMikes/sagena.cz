'use client';

import React, { useState } from 'react';
import { ChevronDown, Download, FileText } from 'lucide-react';
import ContactCards from '@/components/people/ContactCards';
import RichText from '@/components/typography/RichText';

/**
 * File attachment from Strapi
 */
interface FileAttachment {
  name: string;
  url: string;
  ext: string;
  size: number; // Size in KB
}

/**
 * Contact card data for ContactCards component
 */
interface ContactCardData {
  name: string;
  email?: string | null;
  phone?: string | null;
  photo?: string | null;
  gender?: 'man' | 'woman' | null;
  funkce?: string | null;
}

interface ExpandableSectionProps {
  title: string;
  description?: string | null;
  contacts?: ContactCardData[];
  files?: FileAttachment[];
  defaultOpen?: boolean;
  locale?: string;
}

const translations = {
  cs: {
    documentsToDownload: 'Dokumenty ke stažení',
  },
  en: {
    documentsToDownload: 'Documents to download',
  },
} as const;

const ExpandableSection: React.FC<ExpandableSectionProps> = ({
  title,
  description,
  contacts = [],
  files = [],
  defaultOpen = false,
  locale = 'cs',
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const t = translations[locale as keyof typeof translations] || translations.cs;

  const hasContent = description || contacts.length > 0 || files.length > 0;

  const formatFileSize = (sizeInKB: number): string => {
    if (sizeInKB < 1024) {
      return `${sizeInKB.toFixed(0)} KB`;
    }
    return `${(sizeInKB / 1024).toFixed(1)} MB`;
  };

  const getExtensionColor = (ext: string) => {
    const lowerExt = ext.toLowerCase().replace('.', '');
    if (lowerExt === 'pdf') return 'bg-red-100 text-red-700';
    if (['doc', 'docx'].includes(lowerExt)) return 'bg-primary-100 text-primary-700';
    if (['xls', 'xlsx'].includes(lowerExt)) return 'bg-green-100 text-green-700';
    if (['jpg', 'jpeg', 'png', 'gif'].includes(lowerExt)) return 'bg-purple-100 text-purple-700';
    return 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative w-full flex items-center justify-between p-6 text-left"
        aria-expanded={isOpen}
      >
        <div
          className={`absolute inset-0 bg-gradient-to-r from-gray-100 to-gray-50 transition-opacity duration-300 ${
            isOpen ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          }`}
        />
        <h3 className="relative text-lg font-semibold text-primary-600">{title}</h3>
        {hasContent && (
          <div className="relative flex-shrink-0 ml-4">
            <ChevronDown
              className={`w-5 h-5 text-gray-600 transition-transform duration-300 ${
                isOpen ? 'rotate-180' : ''
              }`}
            />
          </div>
        )}
      </button>

      {hasContent && (
        <div
          className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
            isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
          }`}
        >
          <div className="overflow-hidden">
            <div className="pl-10 pr-6 pb-6 space-y-6 border-t border-gray-100">
              {description && (
                <div className="pt-6">
                  <RichText
                    content={description}
                    size="sm"
                    className="[&_p]:text-gray-700 [&_a]:text-primary-600 [&_a]:hover:text-primary-700"
                  />
                </div>
              )}

              {contacts.length > 0 && (
                <div className="pt-4">
                  <ContactCards cards={contacts} />
                </div>
              )}

              {files.length > 0 && (
                <div className="pt-6 space-y-2">
                  <h4 className="text-sm font-semibold text-primary-600">{t.documentsToDownload}</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {files.map((file, index) => (
                      <a
                        key={index}
                        href={file.url}
                        download
                        className="flex items-start space-x-4 p-4 bg-white border border-gray-200 rounded-lg hover:border-primary-300 hover:shadow-md transition-all duration-300 group"
                      >
                        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-lg flex-shrink-0 group-hover:bg-primary-100 transition-colors">
                          <FileText className="w-6 h-6 text-gray-600 group-hover:text-primary-600 transition-colors" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h5 className="font-medium text-primary-600 truncate group-hover:text-primary-700 transition-colors">
                            {file.name}
                          </h5>
                          <div className="flex items-center space-x-2 mt-2">
                            <span
                              className={`text-xs font-semibold px-2 py-1 rounded ${getExtensionColor(file.ext)}`}
                            >
                              {file.ext.toUpperCase().replace('.', '')}
                            </span>
                            <span className="text-xs text-gray-500">
                              {formatFileSize(file.size)}
                            </span>
                          </div>
                        </div>
                        <Download className="w-5 h-5 text-gray-400 group-hover:text-primary-600 transition-colors flex-shrink-0" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpandableSection;
