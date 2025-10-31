import React from 'react';

interface RichTextProps {
  content: string;
  className?: string;
}

const RichText: React.FC<RichTextProps> = ({ content, className = '' }) => {
  return (
    <div
      className={`prose prose-lg max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: content }}
      style={{
        // Custom prose styles to match the design system
        color: '#4b5563',
        lineHeight: '1.75',
      }}
    />
  );
};

export default RichText;

// Add global styles for the rich text content
// This would typically go in globals.css, but including here for reference
export const richTextStyles = `
  .prose h1 {
    @apply text-4xl md:text-5xl font-bold text-gray-900 mb-4 mt-8;
  }
  .prose h2 {
    @apply text-3xl md:text-4xl font-bold text-gray-900 mb-3 mt-6;
  }
  .prose h3 {
    @apply text-2xl md:text-3xl font-bold text-gray-900 mb-3 mt-6;
  }
  .prose h4 {
    @apply text-xl md:text-2xl font-semibold text-gray-900 mb-2 mt-4;
  }
  .prose h5 {
    @apply text-lg md:text-xl font-semibold text-gray-900 mb-2 mt-4;
  }
  .prose h6 {
    @apply text-base md:text-lg font-semibold text-gray-900 mb-2 mt-4;
  }
  .prose p {
    @apply mb-4 text-gray-600 leading-relaxed;
  }
  .prose a {
    @apply text-primary-600 hover:text-primary-700 underline transition-colors;
  }
  .prose strong {
    @apply font-semibold text-gray-900;
  }
  .prose em {
    @apply italic;
  }
  .prose ul {
    @apply list-disc list-inside mb-4 space-y-2;
  }
  .prose ol {
    @apply list-decimal list-inside mb-4 space-y-2;
  }
  .prose li {
    @apply text-gray-600;
  }
  .prose blockquote {
    @apply border-l-4 border-primary-600 pl-4 italic text-gray-700 my-4;
  }
  .prose code {
    @apply bg-gray-100 px-2 py-1 rounded text-sm font-mono text-gray-800;
  }
  .prose pre {
    @apply bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-4;
  }
  .prose img {
    @apply rounded-lg my-6;
  }
  .prose table {
    @apply w-full border-collapse mb-4;
  }
  .prose th {
    @apply bg-gray-100 border border-gray-300 px-4 py-2 text-left font-semibold;
  }
  .prose td {
    @apply border border-gray-300 px-4 py-2;
  }
`;
