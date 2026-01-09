'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, ExternalLink } from 'lucide-react';
import RichText from '@/components/typography/RichText';

interface PopupModalProps {
  title?: string | null;
  description?: string | null;
  link?: {
    text: string;
    url: string;
    external?: boolean;
  } | null;
  rememberDismissal?: boolean;
  popupId?: number;
}

const PopupModal: React.FC<PopupModalProps> = ({
  title,
  description,
  link,
  rememberDismissal,
  popupId,
}) => {
  // Generate storage key using globally unique Strapi component ID
  const storageKey = popupId ? `popup-dismissed-${popupId}` : null;

  // Track hydration state to prevent flash
  const [mounted, setMounted] = useState(!rememberDismissal);
  const [isOpen, setIsOpen] = useState(true);

  // Check localStorage after hydration to avoid SSR mismatch
  useEffect(() => {
    if (rememberDismissal && storageKey) {
      const wasDismissed = localStorage.getItem(storageKey) === 'true';
      setIsOpen(!wasDismissed);
    }
    setMounted(true);
  }, [rememberDismissal, storageKey]);

  // Check if there's any content to show
  const hasContent = !!(title || description || link);

  useEffect(() => {
    if (isOpen && hasContent) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, hasContent]);

  // If no content at all, don't render anything
  if (!hasContent) {
    return null;
  }

  // Wait for hydration when rememberDismissal is enabled to prevent flash
  if (!mounted) return null;

  if (!isOpen) return null;

  const handleClose = () => {
    // Save dismissal to localStorage if rememberDismissal is enabled
    if (rememberDismissal && storageKey) {
      localStorage.setItem(storageKey, 'true');
    }
    setIsOpen(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'popup-title' : undefined}
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-auto animate-in zoom-in-95 duration-300"
      >
        {/* Header with title */}
        {title && (
          <div className="flex items-center justify-between p-6 bg-gradient-to-br from-primary-600 to-primary-800 rounded-t-2xl">
            <h3 id="popup-title" className="text-2xl font-bold text-white">
              {title}
            </h3>
            <button
              onClick={handleClose}
              className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Zavřít"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Close button without title */}
        {!title && (
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors z-10"
            aria-label="Zavřít"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Content */}
        <div className={title ? 'p-6' : 'p-8 pt-12'}>
          {description && (
            <RichText content={description} size="base" />
          )}

          {link && link.text && link.url && (
            <div className={description ? 'mt-6' : ''}>
              {link.external ? (
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
                >
                  {link.text}
                  <ExternalLink className="w-4 h-4" />
                </a>
              ) : (
                <Link
                  href={link.url}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
                  onClick={handleClose}
                >
                  {link.text}
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PopupModal;
