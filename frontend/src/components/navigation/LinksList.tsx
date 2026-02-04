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
  layout?: 'Grid' | 'Rows';
  compact?: boolean;
}

const LinksList: React.FC<LinksListProps> = ({ links, layout = 'Grid', compact = false }) => {
  const isGrid = layout === 'Grid';

  // In compact mode (sidebar), use single column; otherwise use responsive grid
  const containerClass = isGrid
    ? compact
      ? 'grid grid-cols-1 gap-3'
      : 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'
    : 'space-y-3';

  return (
    <div className={containerClass}>
      {links.map((link, index) => {
        if (link.disabled) {
          return (
            <div
              key={index}
              className={
                isGrid
                  ? 'text-center p-4 rounded-lg bg-gray-100 border border-gray-200 opacity-60 cursor-not-allowed'
                  : 'flex items-center justify-between p-4 bg-gray-100 border border-gray-200 rounded-lg opacity-60 cursor-not-allowed'
              }
            >
              {isGrid ? (
                <>
                  <AlertCircle className="w-5 h-5 text-gray-400 mx-auto mb-2" />
                  <span className="font-medium text-gray-500 block">
                    {link.title}
                  </span>
                  {link.disabledReason && (
                    <p className="text-sm text-gray-500 mt-1">
                      {link.disabledReason}
                    </p>
                  )}
                </>
              ) : (
                <>
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
                </>
              )}
            </div>
          );
        }

        const isExternal = link.external || link.url.startsWith('http');
        const LinkComponent = isExternal ? 'a' : Link;
        const linkProps = isExternal
          ? { href: link.url, target: '_blank', rel: 'noopener noreferrer' }
          : { href: link.url };

        const gridLinkClass =
          'text-center p-4 rounded-lg bg-white hover:bg-primary-50 transition-colors border border-neutral-200 hover:border-primary-300 block';
        const rowsLinkClass =
          'flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50/30 transition-all group';

        return (
          <LinkComponent
            key={index}
            {...linkProps}
            className={isGrid ? gridLinkClass : rowsLinkClass}
          >
            {isGrid ? (
              <span className="text-primary-700 font-semibold">
                {link.title}
              </span>
            ) : (
              <>
                <span className="font-medium text-gray-900 group-hover:text-primary-600 transition-colors">
                  {link.title}
                </span>
                {isExternal && (
                  <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-primary-600 transition-colors" />
                )}
              </>
            )}
          </LinkComponent>
        );
      })}
    </div>
  );
};

export default LinksList;
