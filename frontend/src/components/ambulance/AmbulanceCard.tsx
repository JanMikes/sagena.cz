'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Mail, Phone, Clock, FileText, Plane, ExternalLink, Download } from 'lucide-react';

interface Doctor {
  name: string;
  function?: string;
  phone?: string;
  email?: string;
  photo?: string;
  holiday?: { from: string; to: string };
}

interface Nurse {
  name: string;
  holiday?: { from: string; to: string };
}

interface Document {
  name: string;
  url: string;
  extension?: string;
}

interface OpeningHours {
  day: string;
  time: string;
}

interface AmbulanceCardProps {
  name: string;
  phone?: string;
  email?: string;
  doctors: Doctor[];
  nurses: Nurse[];
  nursesPhones: string[];
  nursesEmail?: string;
  description?: string;
  documents: Document[];
  button?: { text: string; url: string };
  openingHours: OpeningHours[];
}

const AmbulanceCard: React.FC<AmbulanceCardProps> = ({
  name,
  phone,
  email,
  doctors,
  nurses,
  nursesPhones,
  nursesEmail,
  description,
  documents,
  button,
  openingHours,
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

  const getSurname = (fullName: string): string => {
    const parts = fullName.trim().split(' ');
    return parts[parts.length - 1];
  };

  const getInitials = (fullName: string): string => {
    return fullName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getExtension = (doc: Document): string => {
    if (doc.extension) return doc.extension;
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

  const groupedHours = openingHours.reduce<Record<string, string[]>>((acc, hours) => {
    if (!acc[hours.day]) {
      acc[hours.day] = [];
    }
    acc[hours.day].push(hours.time);
    return acc;
  }, {});

  const isOnHoliday = (holiday?: { from: string; to: string }): boolean => {
    if (!holiday) return false;
    const today = new Date();
    const from = new Date(holiday.from);
    const to = new Date(holiday.to);
    return today >= from && today <= to;
  };

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('cs-CZ', { day: 'numeric', month: 'numeric' });
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
              <Phone className="w-4 h-4" />
              <span>{phone}</span>
            </a>
          )}
          {email && (
            <a
              href={`mailto:${email}`}
              className="flex items-center gap-1.5 text-gray-600 hover:text-primary-600 transition-colors"
            >
              <Mail className="w-4 h-4" />
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
            ref={frontRef}
            className="absolute inset-0 w-full"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <div className="bg-white border border-gray-200 rounded-xl p-5 h-full flex flex-col">
              {/* Doctors Section */}
              {doctors.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Doktoři</h4>
                  <div>
                    {doctors.map((doctor, index) => (
                      <div key={index} className="py-3 border-b border-gray-100">
                        {/* Holiday Banner */}
                        {isOnHoliday(doctor.holiday) && doctor.holiday && (
                          <div className="flex items-center gap-2 text-sm text-yellow-800 bg-yellow-100 px-3 py-2 rounded-lg mb-3">
                            <Plane className="w-4 h-4 flex-shrink-0" />
                            <span>Dovolená: {formatDate(doctor.holiday.from)} - {formatDate(doctor.holiday.to)}</span>
                          </div>
                        )}
                        <div className="flex items-start gap-3">
                          {/* Avatar with initials */}
                          {doctor.photo ? (
                            <img
                              src={doctor.photo}
                              alt={doctor.name}
                              className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                              {getInitials(doctor.name)}
                            </div>
                          )}

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-primary-600">{doctor.name}</div>
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
                                    <Phone className="w-4 h-4" />
                                    <span>{doctor.phone}</span>
                                  </a>
                                )}
                                {doctor.email && (
                                  <a
                                    href={`mailto:${doctor.email}`}
                                    className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-primary-600 transition-colors"
                                  >
                                    <Mail className="w-4 h-4" />
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
                          isOnHoliday(nurse.holiday)
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-primary-100 text-primary-600'
                        }`}
                        title={isOnHoliday(nurse.holiday) && nurse.holiday ? `Dovolená: ${formatDate(nurse.holiday.from)} - ${formatDate(nurse.holiday.to)}` : undefined}
                      >
                        {getSurname(nurse.name)}
                        {isOnHoliday(nurse.holiday) && (
                          <Plane className="w-3 h-3" />
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
                          <Phone className="w-4 h-4" />
                          {phoneNum}
                        </a>
                      ))}
                      {nursesEmail && (
                        <a
                          href={`mailto:${nursesEmail}`}
                          className="flex items-center gap-1.5 hover:text-primary-600 transition-colors"
                        >
                          <Mail className="w-4 h-4" />
                          {nursesEmail}
                        </a>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Description */}
              {description && (
                <div
                  className="text-sm text-gray-600 mb-4 prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: description }}
                />
              )}

              {/* Documents */}
              {documents.length > 0 && (
                <div className="mb-4 space-y-2">
                  {documents.map((doc, index) => {
                    const ext = getExtension(doc);
                    return (
                      <a
                        key={index}
                        href={doc.url}
                        download
                        className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg hover:border-primary-300 hover:shadow-sm transition-all group"
                      >
                        <div className="flex items-center justify-center w-9 h-9 bg-gray-100 rounded-lg flex-shrink-0 group-hover:bg-primary-100 transition-colors">
                          <FileText className="w-5 h-5 text-gray-600 group-hover:text-primary-600 transition-colors" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-sm font-medium text-primary-600 group-hover:text-primary-700 truncate block">
                            {doc.name}
                          </span>
                          <span className={`inline-block text-xs font-semibold px-1.5 py-0.5 rounded mt-1 ${getExtensionColor(ext)}`}>
                            {ext.toUpperCase()}
                          </span>
                        </div>
                        <Download className="w-4 h-4 text-gray-400 group-hover:text-primary-600 transition-colors flex-shrink-0" />
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
                  className="inline-flex items-center justify-center gap-2 w-full py-2 px-4 bg-primary-600 text-white rounded-lg font-medium text-sm hover:bg-primary-700 transition-colors mb-3"
                >
                  <span>{button.text}</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}

              {/* Opening Hours Button */}
              {openingHours.length > 0 && (
                <button
                  onClick={() => setIsFlipped(true)}
                  className="flex items-center justify-center gap-2 w-full py-2 text-primary-600 hover:text-primary-700 font-medium text-sm transition-colors border border-primary-600 rounded-lg hover:bg-primary-50 mb-2"
                >
                  <Clock className="w-4 h-4" />
                  <span>Ordinační hodiny</span>
                </button>
              )}
            </div>
          </div>

          {/* Back Side - Opening Hours */}
          <div
            ref={backRef}
            className="absolute inset-0 w-full [transform:rotateY(180deg)]"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <div className="bg-primary-600 text-white rounded-xl p-5 h-full flex flex-col">
              <h4 className="text-lg font-bold mb-4">Ordinační hodiny</h4>
              <div className="space-y-3 flex-1">
                {Object.entries(groupedHours).map(([day, times]) => (
                  <div key={day} className="flex justify-between text-sm">
                    <span className="font-medium">{day}</span>
                    <div className="text-right">
                      {times.map((time, index) => (
                        <div key={index}>{time}</div>
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
