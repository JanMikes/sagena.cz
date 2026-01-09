'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Mail, Phone, Clock, FileText, Plane, ExternalLink, Download, Info } from 'lucide-react';
import RichText from '@/components/typography/RichText';

interface Holiday {
  from?: string;
  to?: string;
}

interface Doctor {
  name?: string;
  function?: string;
  phone?: string;
  email?: string;
  photo?: string;
  holidays?: Holiday[];
}

interface Nurse {
  name?: string;
  holidays?: Holiday[];
}

interface Document {
  name?: string;
  url?: string;
  extension?: string;
}

interface OpeningHoursEntry {
  day?: string;
  time?: string;
  time_afternoon?: string;
}

interface OpeningHoursGroup {
  title?: string;
  hours?: OpeningHoursEntry[];
}

interface AmbulanceCardProps {
  name?: string;
  phone?: string;
  email?: string;
  doctors?: Doctor[];
  nurses?: Nurse[];
  nursesPhones?: string[];
  nursesEmail?: string;
  description?: string;
  documents?: Document[];
  button?: { text: string; url: string };
  openingHours?: OpeningHoursGroup[];
}

const AmbulanceCard: React.FC<AmbulanceCardProps> = ({
  name = '',
  phone,
  email,
  doctors = [],
  nurses = [],
  nursesPhones = [],
  nursesEmail,
  description,
  documents = [],
  button,
  openingHours = [],
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [cardHeight, setCardHeight] = useState<number | null>(null);
  const frontRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLDivElement>(null);

  // Calculate max height of both sides
  useEffect(() => {
    const updateHeight = () => {
      const frontHeight = frontRef.current?.scrollHeight || 0;
      const backHeight = backRef.current?.scrollHeight || 0;
      setCardHeight(Math.max(frontHeight, backHeight));
    };
    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, [doctors, nurses, documents, openingHours, description, button]);

  const getSurname = (fullName?: string): string => {
    if (!fullName) return '';
    const parts = fullName.trim().split(' ');
    return parts[parts.length - 1] || '';
  };

  const getInitials = (fullName?: string): string => {
    if (!fullName) return '?';
    const parts = fullName.trim().split(' ').filter(Boolean);
    if (parts.length === 0) return '?';
    return parts
      .map((n) => n[0] || '')
      .join('')
      .toUpperCase()
      .slice(0, 2) || '?';
  };

  const getExtension = (doc: Document): string => {
    if (doc.extension) return doc.extension;
    if (!doc.url) return 'file';
    // Try to extract from URL
    const match = doc.url.match(/\.([a-zA-Z0-9]+)(?:\?|$)/);
    return match ? match[1] : 'file';
  };

  const getExtensionColor = (ext: string) => {
    const lowerExt = ext.toLowerCase();
    if (lowerExt === 'pdf') return 'bg-red-100 text-red-700';
    if (['doc', 'docx'].includes(lowerExt)) return 'bg-primary-100 text-primary-700';
    if (['xls', 'xlsx'].includes(lowerExt)) return 'bg-green-100 text-green-700';
    if (['jpg', 'jpeg', 'png', 'gif'].includes(lowerExt)) return 'bg-purple-100 text-purple-700';
    return 'bg-gray-100 text-gray-700';
  };

  // Check if any opening hours groups have hours
  const hasOpeningHours = openingHours.some(group => group.hours && group.hours.length > 0);

  // Check if holiday has not ended yet (to date + 1 day >= today)
  const isHolidayNotEnded = (holiday?: Holiday): boolean => {
    if (!holiday || !holiday.to) return false;
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const to = new Date(holiday.to);
      to.setDate(to.getDate() + 1); // Add 1 day buffer
      if (isNaN(to.getTime())) return false;
      return today <= to;
    } catch {
      return false;
    }
  };

  // Check if holiday is currently active (today is within the range)
  const isHolidayActive = (holiday?: Holiday): boolean => {
    if (!holiday || !holiday.from || !holiday.to) return false;
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const from = new Date(holiday.from);
      const to = new Date(holiday.to);
      if (isNaN(from.getTime()) || isNaN(to.getTime())) return false;
      return today >= from && today <= to;
    } catch {
      return false;
    }
  };

  const getRelevantHolidays = (holidays?: Holiday[]): Holiday[] => {
    if (!holidays || holidays.length === 0) return [];
    return holidays.filter(isHolidayNotEnded);
  };

  const isOnHoliday = (holidays?: Holiday[]): boolean => {
    if (!holidays || holidays.length === 0) return false;
    return holidays.some(isHolidayActive);
  };

  const getActiveHolidays = (holidays?: Holiday[]): Holiday[] => {
    if (!holidays || holidays.length === 0) return [];
    return holidays.filter(isHolidayActive);
  };

  const formatDate = (dateStr?: string): string => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;
      return `${date.getDate()}.${date.getMonth() + 1}.`;
    } catch {
      return dateStr;
    }
  };

  return (
    <div>
      {/* Header - outside the flip card */}
      <h3 className="text-lg font-semibold text-primary-600 mb-2">{name}</h3>

      {(phone || email) && (
        <div className="flex flex-wrap gap-4 mb-3 text-sm">
          {phone && (
            <a
              href={`tel:${phone}`}
              className="flex items-center gap-1.5 text-gray-600 hover:text-primary-600 transition-colors"
            >
              <Phone className="w-4 h-4 text-primary-600" />
              <span>{phone}</span>
            </a>
          )}
          {email && (
            <a
              href={`mailto:${email}`}
              className="flex items-center gap-1.5 text-gray-600 hover:text-primary-600 transition-colors"
            >
              <Mail className="w-4 h-4 text-primary-600" />
              <span>{email}</span>
            </a>
          )}
        </div>
      )}

      {/* Flip Card Container */}
      <div
        className="relative"
        style={{
          perspective: '1000px',
          height: cardHeight ? `${cardHeight}px` : 'auto'
        }}
      >
        <div
          className={`relative w-full h-full transition-transform duration-700 ${
            isFlipped ? '[transform:rotateY(180deg)]' : ''
          }`}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Front Side */}
          <div
            className="absolute inset-0 w-full"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <div ref={frontRef} className="bg-white border border-gray-200 rounded-xl p-5 pb-6 flex flex-col">
              {/* Doctors Section */}
              {doctors.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Doktoři</h4>
                  <div>
                    {doctors.map((doctor, index) => (
                      <div key={index} className="py-3 border-b border-gray-100">
                        {/* Holiday Banners */}
                        {getRelevantHolidays(doctor.holidays).map((holiday, holidayIndex) => (
                          <div key={holidayIndex} className="flex items-center gap-2 text-sm text-yellow-800 bg-yellow-100 px-3 py-2 rounded-lg mb-3">
                            <Plane className="w-4 h-4 flex-shrink-0 text-yellow-600" />
                            <span>Dovolená: {formatDate(holiday.from)} - {formatDate(holiday.to)}</span>
                          </div>
                        ))}
                        <div className={`flex gap-3 ${!doctor.function && !doctor.phone && !doctor.email ? 'items-center' : 'items-start'}`}>
                          {/* Avatar with initials */}
                          {doctor.photo ? (
                            <img
                              src={doctor.photo}
                              alt={doctor.name || 'Doktor'}
                              className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gray-400 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                              {getInitials(doctor.name)}
                            </div>
                          )}

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-primary-600">{doctor.name || 'Neznámý'}</div>
                            {doctor.function && (
                              <span className="inline-block text-xs text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full mt-1">
                                {doctor.function}
                              </span>
                            )}
                            {(doctor.phone || doctor.email) && (
                              <div className="space-y-1 mt-2">
                                {doctor.phone && (
                                  <a
                                    href={`tel:${doctor.phone}`}
                                    className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-primary-600 transition-colors"
                                  >
                                    <Phone className="w-4 h-4 text-primary-600" />
                                    <span>{doctor.phone}</span>
                                  </a>
                                )}
                                {doctor.email && (
                                  <a
                                    href={`mailto:${doctor.email}`}
                                    className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-primary-600 transition-colors"
                                  >
                                    <Mail className="w-4 h-4 text-primary-600" />
                                    <span className="truncate">{doctor.email}</span>
                                  </a>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Nurses Section */}
              {nurses.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Sestry</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {nurses.map((nurse, index) => (
                      <span
                        key={index}
                        className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
                          isOnHoliday(nurse.holidays)
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-primary-100 text-primary-600'
                        }`}
                        title={isOnHoliday(nurse.holidays) ? getActiveHolidays(nurse.holidays).map(h => `Dovolená: ${formatDate(h.from)} - ${formatDate(h.to)}`).join(', ') : undefined}
                      >
                        {getSurname(nurse.name)}
                        {isOnHoliday(nurse.holidays) && (
                          <Plane className="w-3 h-3 text-yellow-600" />
                        )}
                      </span>
                    ))}
                  </div>
                  {(nursesPhones.length > 0 || nursesEmail) && (
                    <div className="mt-3 space-y-1.5 text-sm text-gray-600">
                      {nursesPhones.map((phoneNum, index) => (
                        <a
                          key={index}
                          href={`tel:${phoneNum}`}
                          className="flex items-center gap-1.5 hover:text-primary-600 transition-colors"
                        >
                          <Phone className="w-4 h-4 text-primary-600" />
                          {phoneNum}
                        </a>
                      ))}
                      {nursesEmail && (
                        <a
                          href={`mailto:${nursesEmail}`}
                          className="flex items-center gap-1.5 hover:text-primary-600 transition-colors"
                        >
                          <Mail className="w-4 h-4 text-primary-600" />
                          {nursesEmail}
                        </a>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Description */}
              {description && (
                <div className="flex gap-2 mb-4">
                  <Info className="w-4 h-4 text-primary-600 flex-shrink-0 mt-0.5" />
                  <RichText content={description} size="sm" />
                </div>
              )}

              {/* Documents */}
              {documents.filter(doc => doc.url).length > 0 && (
                <div className="mb-4 space-y-2">
                  {documents.filter(doc => doc.url).map((doc, index) => {
                    const ext = getExtension(doc);
                    return (
                      <a
                        key={index}
                        href={doc.url}
                        download
                        className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg hover:border-primary-300 hover:shadow-sm transition-all group"
                      >
                        <div className="flex items-center justify-center w-9 h-9 bg-gray-100 rounded-lg flex-shrink-0 group-hover:bg-primary-100 transition-colors">
                          <FileText className="w-5 h-5 text-primary-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-sm font-medium text-primary-600 group-hover:text-primary-700 truncate block">
                            {doc.name || 'Dokument'}
                          </span>
                          <span className={`inline-block text-xs font-semibold px-1.5 py-0.5 rounded mt-1 ${getExtensionColor(ext)}`}>
                            {ext.toUpperCase()}
                          </span>
                        </div>
                        <Download className="w-4 h-4 text-primary-600 flex-shrink-0" />
                      </a>
                    );
                  })}
                </div>
              )}

              {/* Spacer */}
              <div className="flex-1" />

              {/* Button */}
              {button && (
                <a
                  href={button.url}
                  className="inline-flex items-center justify-center gap-2 w-full py-2 px-4 bg-primary-600 text-white rounded-lg font-medium text-sm hover:bg-primary-700 transition-colors mb-3 border border-primary-600 hover:border-primary-700"
                >
                  <span>{button.text}</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}

              {/* Opening Hours Button */}
              {hasOpeningHours && (
                <button
                  onClick={() => setIsFlipped(true)}
                  className="flex items-center justify-center gap-2 w-full py-2 text-primary-600 hover:text-primary-700 font-medium text-sm transition-colors border border-primary-600 rounded-lg hover:bg-primary-50"
                >
                  <Clock className="w-4 h-4 text-primary-600" />
                  <span>Ordinační hodiny</span>
                </button>
              )}
              {/* Bottom spacer for proper spacing */}
              <div className="h-2" />
            </div>
          </div>

          {/* Back Side - Opening Hours */}
          <div
            className="absolute inset-0 w-full [transform:rotateY(180deg)]"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <div ref={backRef} className="bg-primary-600 text-white rounded-xl p-5 pb-6 flex flex-col">
              <h4 className="text-lg font-bold mb-4">Ordinační hodiny</h4>
              <div className="space-y-4 flex-1 overflow-y-auto divide-y divide-white/50">
                {openingHours.map((group, groupIndex) => (
                  <div key={groupIndex} className={groupIndex > 0 ? 'pt-4' : ''}>
                    {group.title && (
                      <h5 className="text-base font-semibold text-white/80 mb-2">{group.title}</h5>
                    )}
                    <div className="space-y-2">
                      {(group.hours || []).map((entry, entryIndex) => (
                        <div key={entryIndex} className="flex justify-between text-sm gap-2">
                          <span className="font-medium flex-shrink-0">{entry.day}</span>
                          <div className="text-right flex-1">
                            {entry.time}{entry.time && entry.time_afternoon && ', '}{entry.time_afternoon}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setIsFlipped(false)}
                className="mt-4 w-full py-2 bg-white text-primary-600 rounded-lg font-medium hover:bg-primary-50 transition-colors"
              >
                Zpět
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AmbulanceCard;
