import React from 'react';
import Link from 'next/link';
import { ExternalLink, AlertCircle } from 'lucide-react';

interface LinkItem {
  title: string;
  url: string;
  disabled?: boolean;
  disabledReason?: string;
  external?: boolean;
}

interface LinksListProps {
  links: LinkItem[];
}

const LinksList: React.FC<LinksListProps> = ({ links }) => {
  return (
    <div className="space-y-3">
      {links.map((link, index) => {
        if (link.disabled) {
          return (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-gray-100 border border-gray-200 rounded-lg opacity-60 cursor-not-allowed"
            >
              <div className="flex items-center space-x-3">
                <AlertCircle className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <div>
                  <span className="font-medium text-gray-500">
                    {link.title}
                  </span>
                  {link.disabledReason && (
                    <p className="text-sm text-gray-500 mt-1">
                      {link.disabledReason}
                    </p>
                  )}
                </div>
              </div>
              <span className="text-xs font-semibold text-gray-500 bg-gray-200 px-3 py-1 rounded-full">
                Nedostupné
              </span>
            </div>
          );
        }

        const isExternal = link.external || link.url.startsWith('http');
        const LinkComponent = isExternal ? 'a' : Link;
        const linkProps = isExternal
          ? { href: link.url, target: '_blank', rel: 'noopener noreferrer' }
          : { href: link.url };

        return (
          <LinkComponent
            key={index}
            {...linkProps}
            className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50/30 transition-all group"
          >
            <span className="font-medium text-gray-900 group-hover:text-primary-600 transition-colors">
              {link.title}
            </span>
            {isExternal && (
              <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-primary-600 transition-colors" />
            )}
          </LinkComponent>
        );
      })}
    </div>
  );
};

export default LinksList;
