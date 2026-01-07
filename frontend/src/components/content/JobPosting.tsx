import React from 'react';
import Link from 'next/link';

/**
 * Job posting item from Strapi (for CMS-driven pages)
 */
interface JobPostingProps {
  title: string;
  description: string;
  department: string;
  employment_type: string;
  location: string;
  cta_link: {
    text: string;
    url: string;
  };
}

const JobPosting: React.FC<JobPostingProps> = ({
  title,
  description,
  department,
  employment_type,
  location,
  cta_link,
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 hover:border-primary-300 hover:shadow-md transition-all duration-300">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-primary-600 mb-2">{title}</h3>
          <p className="text-gray-600 mb-4">{description}</p>

          <div className="flex flex-wrap gap-3 mb-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary-50 text-primary-700 font-medium text-sm">
              {department}
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm">
              {employment_type}
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm">
              {location}
            </span>
          </div>
        </div>

        <div className="flex-shrink-0">
          <Link
            href={cta_link.url}
            className="inline-flex items-center justify-center px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors duration-200"
          >
            {cta_link.text}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default JobPosting;
