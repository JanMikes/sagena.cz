'use client';

import React, { useState } from 'react';
import { ChevronDown, Mail, Phone, FileText } from 'lucide-react';

interface File {
  name: string;
  url: string;
  size?: string;
}

interface Contact {
  name?: string;
  email?: string;
  phone?: string;
}

interface ExpandableSectionProps {
  title: string;
  description?: string;
  contact?: Contact;
  files?: File[];
  defaultOpen?: boolean;
}

const ExpandableSection: React.FC<ExpandableSectionProps> = ({
  title,
  description,
  contact,
  files,
  defaultOpen = false,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
      >
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <ChevronDown
          className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      <div
        className={`transition-all duration-300 overflow-hidden ${
          isOpen ? 'max-h-[2000px]' : 'max-h-0'
        }`}
      >
        <div className="px-6 pb-6 space-y-4">
          {description && (
            <p className="text-gray-600 leading-relaxed">{description}</p>
          )}

          {contact && (
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              {contact.name && (
                <p className="font-medium text-gray-900">{contact.name}</p>
              )}
              {contact.email && (
                <a
                  href={`mailto:${contact.email}`}
                  className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  <span>{contact.email}</span>
                </a>
              )}
              {contact.phone && (
                <a
                  href={`tel:${contact.phone}`}
                  className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  <span>{contact.phone}</span>
                </a>
              )}
            </div>
          )}

          {files && files.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900 text-sm">
                Soubory ke stažení
              </h4>
              <div className="space-y-2">
                {files.map((file, index) => (
                  <a
                    key={index}
                    href={file.url}
                    className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group"
                    download
                  >
                    <div className="flex items-center space-x-3">
                      <FileText className="w-5 h-5 text-gray-400 group-hover:text-primary-600 transition-colors" />
                      <span className="text-sm font-medium text-gray-700 group-hover:text-primary-600 transition-colors">
                        {file.name}
                      </span>
                    </div>
                    {file.size && (
                      <span className="text-xs text-gray-500">{file.size}</span>
                    )}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpandableSection;
