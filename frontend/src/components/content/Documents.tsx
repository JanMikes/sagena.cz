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
}

const Documents: React.FC<DocumentsProps> = ({ documents, columns = 3 }) => {
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
          className="flex items-start space-x-4 p-4 bg-white border border-gray-200 rounded-lg hover:border-primary-300 hover:shadow-md transition-all duration-300 group"
        >
          <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-lg flex-shrink-0 group-hover:bg-primary-100 transition-colors">
            <FileText className="w-6 h-6 text-gray-600 group-hover:text-primary-600 transition-colors" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-gray-900 truncate group-hover:text-primary-600 transition-colors">
              {doc.name}
            </h4>
            {(doc.file || doc.url) && doc.extension && (
              <div className="flex items-center space-x-2 mt-2">
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded ${getExtensionColor(
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
          <Download className="w-5 h-5 text-gray-400 group-hover:text-primary-600 transition-colors flex-shrink-0" />
        </a>
      ))}
    </div>
  );
};

export default Documents;
