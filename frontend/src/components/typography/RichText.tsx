import React from 'react';
import { marked } from 'marked';
import { preventOrphans } from '@/lib/typography';

interface RichTextProps {
  content: string;
  className?: string;
  size?: 'xs' | 'sm' | 'base' | 'lg';
}

const RichText: React.FC<RichTextProps> = ({ content, className = '', size = 'lg' }) => {
  const processedContent = preventOrphans(content);
  const html = marked.parse(processedContent, { async: false }) as string;

  const sizeClass = {
    xs: 'prose-sm text-xs',
    sm: 'prose-sm text-sm',
    base: 'prose-base',
    lg: 'prose-lg',
  }[size];

  return (
    <div
      className={`prose ${sizeClass} max-w-none text-gray-600 ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export default RichText;
