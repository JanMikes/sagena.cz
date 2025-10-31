import React from 'react';
import Link from 'next/link';
import { Calendar, ArrowRight } from 'lucide-react';
import Image from 'next/image';

interface ActualityProps {
  title: string;
  date: string;
  text: string;
  image?: string;
  readMoreUrl: string;
  readMoreText?: string;
}

const Actuality: React.FC<ActualityProps> = ({
  title,
  date,
  text,
  image,
  readMoreUrl,
  readMoreText = 'Číst více',
}) => {
  return (
    <article className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {image && (
        <div className="relative h-48 bg-gray-200 overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
          />
        </div>
      )}
      <div className="p-6">
        <div className="flex items-center space-x-2 text-sm text-gray-500 mb-3">
          <Calendar className="w-4 h-4" />
          <time dateTime={date}>{new Date(date).toLocaleDateString('cs-CZ')}</time>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight">
          {title}
        </h3>
        <p className="text-gray-600 mb-4 leading-relaxed line-clamp-3">
          {text}
        </p>
        <Link
          href={readMoreUrl}
          className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-medium group"
        >
          <span>{readMoreText}</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </article>
  );
};

export default Actuality;
