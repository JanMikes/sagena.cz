'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Download } from 'lucide-react';
import { marked } from 'marked';
import ContactCards from '@/components/people/ContactCards';

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
}

interface ExpandableSectionProps {
  title: string;
  description?: string | null;
  contacts?: ContactCardData[];
  files?: FileAttachment[];
  defaultOpen?: boolean;
}

const ExpandableSection: React.FC<ExpandableSectionProps> = ({
  title,
  description,
  contacts = [],
  files = [],
  defaultOpen = false,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const hasContent = description || contacts.length > 0 || files.length > 0;

  const formatFileSize = (sizeInKB: number): string => {
    if (sizeInKB < 1024) {
      return `${sizeInKB.toFixed(0)} KB`;
    }
    return `${(sizeInKB / 1024).toFixed(1)} MB`;
  };

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
        aria-expanded={isOpen}
      >
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {hasContent && (
          <div className="flex-shrink-0 ml-4">
            {isOpen ? (
              <ChevronUp className="w-5 h-5 text-gray-600" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-600" />
            )}
          </div>
        )}
      </button>

      {isOpen && hasContent && (
        <div className="px-6 pb-6 space-y-6 border-t border-gray-100">
          {description && (
            <div
              className="pt-6 prose prose-sm max-w-none [&_p]:text-gray-700 [&_a]:text-primary-600 [&_a]:hover:text-primary-700"
              dangerouslySetInnerHTML={{ __html: marked.parse(description, { async: false }) as string }}
            />
          )}

          {contacts.length > 0 && (
            <div className="pt-4">
              <ContactCards cards={contacts} />
            </div>
          )}

          {files.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-gray-900">Přílohy</h4>
              <div className="space-y-2">
                {files.map((file, index) => (
                  <a
                    key={index}
                    href={file.url}
                    download
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Download className="w-4 h-4 text-gray-500 flex-shrink-0 group-hover:text-primary-600" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {file.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {file.ext.toUpperCase().replace('.', '')} • {formatFileSize(file.size)}
                        </p>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ExpandableSection;
