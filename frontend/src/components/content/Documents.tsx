import React from 'react';
import { FileText, Download } from 'lucide-react';
import Badge from '@/components/ui/Badge';

interface Document {
  name: string;
  url?: string;  // For legacy usage
  file?: string; // For Strapi usage
  size?: string;
  extension: string;
}

interface DocumentsProps {
  documents: Document[];
  columns?: 1 | 2 | 3; // Number of columns (1, 2, or 3)
  compact?: boolean;
}

const Documents: React.FC<DocumentsProps> = ({ documents, columns = 3, compact = false }) => {
  const getExtensionColor = (ext: string) => {
    const lowerExt = ext.toLowerCase();
    if (lowerExt === 'pdf') return 'bg-red-100 text-red-700';
    if (['doc', 'docx'].includes(lowerExt)) return 'bg-primary-100 text-primary-700';
    if (['xls', 'xlsx'].includes(lowerExt))
      return 'bg-green-100 text-green-700';
    if (['jpg', 'jpeg', 'png', 'gif'].includes(lowerExt))
      return 'bg-purple-100 text-purple-700';
    return 'bg-gray-100 text-gray-700';
  };

  const getGridClass = () => {
    // In compact mode (sidebar), always use single column
    if (compact) return 'grid grid-cols-1 gap-3';
    if (columns === 1) return 'grid grid-cols-1 gap-4';
    if (columns === 2) return 'grid grid-cols-1 md:grid-cols-2 gap-4';
    return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4';
  };

  return (
    <div className={getGridClass()}>
      {documents.map((doc, index) => (
        <a
          key={index}
          href={doc.file || doc.url || '#'}
          download
          className={`flex items-center bg-white border border-gray-200 rounded-lg hover:border-primary-300 hover:shadow-md transition-all duration-300 group ${compact ? 'p-3 gap-3' : 'p-4 gap-4'}`}
        >
          <div className={`flex items-center justify-center bg-gray-100 rounded-lg flex-shrink-0 group-hover:bg-primary-100 transition-colors ${compact ? 'w-10 h-10' : 'w-12 h-12'}`}>
            <FileText className={`text-gray-600 group-hover:text-primary-600 transition-colors ${compact ? 'w-5 h-5' : 'w-6 h-6'}`} />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className={`font-medium text-primary-600 group-hover:text-primary-700 transition-colors truncate ${compact ? 'text-sm' : ''}`}>
              {doc.name}
            </h4>
            {(doc.file || doc.url) && doc.extension && (
              <div className="flex items-center space-x-2 mt-1">
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded ${getExtensionColor(
                    doc.extension
                  )}`}
                >
                  {doc.extension.toUpperCase()}
                </span>
                {doc.size && (
                  <span className="text-xs text-gray-500">{doc.size}</span>
                )}
              </div>
            )}
          </div>
          <Download className={`text-gray-400 group-hover:text-primary-600 transition-colors flex-shrink-0 ${compact ? 'w-4 h-4' : 'w-5 h-5'}`} />
        </a>
      ))}
    </div>
  );
};

export default Documents;
