import React from 'react';
import { marked, Renderer } from 'marked';
import { preventOrphans } from '@/lib/typography';

// Custom renderer to avoid <p> inside <li> and properly parse inline markdown
const renderer = new Renderer();
renderer.listitem = ({ text }) => {
  // In marked v17+, text is raw markdown - parse inline elements (bold, italic, links, etc.)
  const parsed = marked.parseInline(text, { async: false }) as string;
  // Remove wrapping <p> tags from list item content
  const unwrapped = parsed.replace(/^<p>(.*)<\/p>\n?$/s, '$1');
  return `<li>${unwrapped}</li>\n`;
};

interface RichTextProps {
  content: string;
  className?: string;
  size?: 'xs' | 'sm' | 'base' | 'lg';
}

const RichText: React.FC<RichTextProps> = ({ content, className = '', size = 'lg' }) => {
  const processedContent = preventOrphans(content);
  const html = marked.parse(processedContent, { async: false, renderer }) as string;

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
